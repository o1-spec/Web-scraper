import { Worker, Job } from 'bullmq';
import { prisma } from '../prisma';
import { redis } from '../redis';
import { scrapeGreenhouse } from '../services/scrapers/greenhouse';
import { scrapeLever } from '../services/scrapers/lever';
import { scrapeAshby } from '../services/scrapers/ashby';
import { scrapeBreezy } from '../services/scrapers/breezy';
import { scrapeWorkable } from '../services/scrapers/workable';
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
    } else if (company.sourceType === 'ashby') {
      scrapedJobs = await scrapeAshby(company.careerPageUrl, company.name);
    } else if (company.sourceType === 'breezy') {
      scrapedJobs = await scrapeBreezy(company.careerPageUrl, company.name);
    } else if (company.sourceType === 'workable') {
      scrapedJobs = await scrapeWorkable(company.careerPageUrl, company.name);
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

    if (newJobsInserted > 0) {
      await prisma.notification.create({
        data: {
          userId: company.userId,
          title: 'New Jobs Discovered',
          message: `Found ${newJobsInserted} new jobs for ${company.name} matching your profile.`,
          type: 'JOB_FOUND',
          link: '/jobs'
        }
      });
    }

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

    const companyName = await prisma.company.findUnique({ where: { id: companyId }, select: { name: true, userId: true } });
    if (companyName) {
      await prisma.notification.create({
        data: {
          userId: companyName.userId,
          title: 'Scrape Failed',
          message: `Failed to scrape ${companyName.name}: ${error.message || 'Unknown error'}`,
          type: 'SCRAPE_ERROR',
          link: '/status'
        }
      });
    }
  }
}, { connection: redis });

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed with error ${err.message}`);
});
