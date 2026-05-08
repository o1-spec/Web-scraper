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
