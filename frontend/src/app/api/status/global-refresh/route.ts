import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { enqueueScrapeJob } from '@/lib/queues';

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const companies = await prisma.company.findMany({
      where: { userId: user.userId }
    });

    if (companies.length === 0) {
      return NextResponse.json({ error: 'No companies found' }, { status: 404 });
    }

    const runs = [];
    for (const company of companies) {
      const run = await prisma.scrapeRun.create({
        data: {
          companyId: company.id,
          status: 'pending',
          startedAt: new Date(),
        }
      });

      await enqueueScrapeJob(company.id, run.id);
      runs.push(run);
    }

    return NextResponse.json({ 
      message: `Queued ${companies.length} companies for scraping`,
      runs 
    });
  } catch (error) {
    console.error('[GlobalRefresh] Error:', error);
    return NextResponse.json({ error: 'Failed to queue global refresh' }, { status: 500 });
  }
}
