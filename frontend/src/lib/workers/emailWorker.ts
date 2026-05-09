import { Worker, Job } from 'bullmq';
import { prisma } from '../prisma';
import { redis } from '../redis';
import { sendEmail } from '../mail';

export const emailWorker = new Worker('emailDigest', async (job: Job) => {
  const { userId } = job.data;
  
  console.log(`[EmailWorker] Generating digest for user ${userId}`);

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        digestSettings: true,
        keywords: true
      }
    });

    if (!user || !user.digestSettings?.enabled) {
      console.log(`[EmailWorker] Digest disabled or user not found for ${userId}`);
      return;
    }

    // Find jobs found in the last 24 hours (or since last digest)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const newJobs = await prisma.job.findMany({
      where: {
        dateFound: { gte: twentyFourHoursAgo },
        matchScore: { gte: user.digestSettings.minimumMatchScore }
      },
      include: {
        company: true
      },
      orderBy: { matchScore: 'desc' },
      take: 10
    });

    if (newJobs.length === 0) {
      console.log(`[EmailWorker] No new jobs for ${userId}, skipping email.`);
      return;
    }

    const jobListHtml = newJobs.map(job => `
      <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #e2e8f0; rounded-lg: 8px;">
        <h3 style="margin: 0; color: #2563eb;">${job.title}</h3>
        <p style="margin: 5px 0; font-weight: bold;">${job.company.name} • ${job.location}</p>
        <div style="font-size: 12px; color: #64748b;">Match Score: ${job.matchScore}%</div>
        <a href="${job.jobLink}" style="display: inline-block; margin-top: 10px; padding: 8px 16px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-size: 14px;">View Posting</a>
      </div>
    `).join('');

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
        <h1 style="color: #0f172a; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px;">Your Morning Job Brief</h1>
        <p>Hi ${user.firstName}, here are the best matches found for you in the last 24 hours.</p>
        <div style="margin-top: 30px;">
          ${jobListHtml}
        </div>
        <p style="margin-top: 30px; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; pt: 10px;">
          You are receiving this because you enabled Daily Briefings in JobScout. 
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/settings">Unsubscribe</a>
        </p>
      </div>
    `;

    await sendEmail({
      to: user.digestSettings.emailAddress,
      subject: `JobScout Brief: ${newJobs.length} new matches for you!`,
      html
    });

    console.log(`[EmailWorker] Digest sent to ${user.digestSettings.emailAddress}`);
  } catch (error) {
    console.error(`[EmailWorker] Error processing digest for ${userId}:`, error);
  }
}, { connection: redis });
