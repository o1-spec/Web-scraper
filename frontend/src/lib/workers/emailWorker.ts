import { Worker, Job } from 'bullmq';
import { prisma } from '../prisma';
import { redis } from '../redis';
import { sendEmail } from '../mail';

export const emailWorker = new Worker('emailDigest', async (job: Job) => {
  const { userId } = job.data;
  
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        digestSettings: true,
      }
    });

    if (!user || !user.digestSettings?.enabled) return;

    const since = new Date();
    since.setHours(since.getHours() - 24);

    const jobs = await prisma.job.findMany({
      where: {
        company: { userId: user.id },
        dateFound: { gte: since },
        matchScore: { gte: user.digestSettings.minimumMatchScore }
      },
      include: { company: true },
      orderBy: { matchScore: 'desc' },
      take: 10
    });

    if (jobs.length === 0) return;

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
        <div style="background: #2563eb; padding: 32px; border-radius: 16px 16px 0 0; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px;">🚀 ${jobs.length} New Matching Roles</h1>
          <p style="margin: 8px 0 0; opacity: 0.8;">Your daily JobScout intelligence report is ready.</p>
        </div>
        <div style="padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 16px 16px;">
          <p>Hi ${user.firstName},</p>
          <p>We've discovered new opportunities that match your targeting keywords:</p>
          
          <div style="margin: 32px 0;">
            ${jobs.map(j => `
              <div style="margin-bottom: 24px; padding: 16px; background: #f9fafb; border-radius: 12px; border-left: 4px solid #2563eb;">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                  <h3 style="margin: 0; font-size: 16px; color: #111827;">${j.title}</h3>
                  <span style="background: #dcfce7; color: #166534; font-size: 12px; font-weight: bold; padding: 2px 8px; border-radius: 4px;">${j.matchScore}% MATCH</span>
                </div>
                <p style="margin: 4px 0; color: #4b5563; font-size: 14px;">at ${j.company.name}</p>
                <div style="margin-top: 12px;">
                  <a href="${j.jobLink}" style="color: #2563eb; text-decoration: none; font-weight: bold; font-size: 14px;">View Opportunity &rarr;</a>
                </div>
              </div>
            `).join('')}
          </div>

          <div style="text-align: center; margin-top: 32px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background: #111827; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Go to Dashboard</a>
          </div>
          
          <p style="margin-top: 48px; font-size: 12px; color: #9ca3af; text-align: center;">
            You are receiving this because you enabled Daily Summaries on JobScout.<br/>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/settings" style="color: #6b7280;">Manage your notifications</a>
          </p>
        </div>
      </div>
    `;

    await sendEmail({
      to: user.digestSettings.emailAddress,
      subject: `🚀 ${jobs.length} New Job Matches found by JobScout`,
      html,
      text: `Hi ${user.firstName}, we found ${jobs.length} new jobs for you. View them on your dashboard: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
    });

    console.log(`[EmailWorker] Digest sent to ${user.digestSettings.emailAddress}`);
  } catch (error) {
    console.error(`[EmailWorker] Failed to send digest for user ${userId}:`, error);
  }
}, { connection: redis });
