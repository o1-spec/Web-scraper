import { Worker, Job } from 'bullmq';
import { prisma } from '../prisma';
import { redis } from '../redis';
import { scrapeGreenhouse } from '../services/scrapers/greenhouse';
import { scrapeLever } from '../services/scrapers/lever';
import { isDuplicateJob } from '../services/dedupe';
import { calculateMatchScore } from '../services/jobMatcher';

export const worker = new Worker('scrapeCompany', async (job: Job) => {
  const { companyId, runId } = job.data;
  
  console.log(`[ScrapeWorker] Processing company ${companyId}`);

  try {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        user: {
          include: { keywords: true }
        }
      }
    });

    if (!company) throw new Error('Company not found');

    await prisma.scrapeRun.update({
      where: { id: runId },
      data: { status: 'running' }
    });

    let scrapedJobs = [];
    if (company.sourceType === 'greenhouse') {
      scrapedJobs = await scrapeGreenhouse(company.careerPageUrl, company.name);
    } else if (company.sourceType === 'lever') {
      scrapedJobs = await scrapeLever(company.careerPageUrl, company.name);
    } else {
      throw new Error(`Scraper for ${company.sourceType} not implemented yet.`);
    }

    const userKeywords = company.user.keywords.map((k: any) => k.keyword);
    let newJobsInserted = 0;

    for (const scrapedJob of scrapedJobs) {
      const isDuplicate = await isDuplicateJob(company.id, scrapedJob.jobLink, scrapedJob.title);
      
      if (!isDuplicate) {
        const matchInfo = calculateMatchScore(scrapedJob.title, scrapedJob.description, userKeywords);
        
        await prisma.job.create({
          data: {
            companyId: company.id,
            title: scrapedJob.title,
            location: scrapedJob.location,
            locationType: scrapedJob.locationType,
            jobType: scrapedJob.jobType,
            source: scrapedJob.source,
            jobLink: scrapedJob.jobLink,
            description: scrapedJob.description,
            tags: matchInfo.tags,
            matchScore: matchInfo.score,
          }
        });
        newJobsInserted++;
      }
    }

    await prisma.company.update({
      where: { id: company.id },
      data: { 
        lastChecked: new Date(),
        jobsFound: company.jobsFound + newJobsInserted,
        status: 'active'
      }
    });

    await prisma.scrapeRun.update({
      where: { id: runId },
      data: { 
        status: 'completed',
        jobsFound: newJobsInserted,
        completedAt: new Date()
      }
    });

    console.log(`[ScrapeWorker] Completed company ${companyId}. Inserted ${newJobsInserted} new jobs.`);
  } catch (error: any) {
    console.error(`[ScrapeWorker] Error scraping company ${companyId}:`, error);
    
    await prisma.scrapeRun.update({
      where: { id: runId },
      data: { 
        status: 'failed',
        error: error.message || 'Unknown error',
        completedAt: new Date()
      }
    });

    await prisma.company.update({
      where: { id: companyId },
      data: { status: 'error' }
    });
  }
}, { connection: redis });

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed with error ${err.message}`);
});
