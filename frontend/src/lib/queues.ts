import { Queue } from 'bullmq';
import { redis } from './redis';

export const scrapeCompanyQueue = new Queue('scrapeCompany', { connection: redis });
export const emailDigestQueue = new Queue('emailDigest', { connection: redis });

export async function enqueueScrapeJob(companyId: string, runId: string) {
  await scrapeCompanyQueue.add('scrape', { companyId, runId });
}

export async function enqueueEmailDigest(userId: string) {
  await emailDigestQueue.add('sendDigest', { userId });
}

export async function setupSchedulers() {
  // Clear existing repeatable jobs to avoid duplicates
  const repeatableJobs = await emailDigestQueue.getRepeatableJobs();
  for (const job of repeatableJobs) {
    await emailDigestQueue.removeRepeatableByKey(job.key);
  }

  // Find all users with digests enabled
  const { prisma } = await import('./prisma');
  const users = await prisma.user.findMany({
    where: { digestSettings: { enabled: true } },
    select: { id: true }
  });

  for (const user of users) {
    await emailDigestQueue.add(
      'dailyDigest',
      { userId: user.id },
      { 
        repeat: { 
          pattern: '0 9 * * *' // Every day at 9:00 AM
        } 
      }
    );
  }
  
  console.log(`[Scheduler] Registered daily digests for ${users.length} users.`);
}
