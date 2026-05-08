import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const companyIds = (await prisma.company.findMany({
      where: { userId: payload.userId },
      select: { id: true }
    })).map(c => c.id);

    const totalJobs = await prisma.job.count({
      where: { companyId: { in: companyIds } }
    });

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const newJobsToday = await prisma.job.count({
      where: {
        companyId: { in: companyIds },
        dateFound: { gte: startOfDay }
      }
    });

    const companiesTracked = companyIds.length;

    const savedJobs = await prisma.savedJob.count({
      where: { userId: payload.userId }
    });

    const lastScrape = await prisma.scrapeRun.findFirst({
      where: { company: { userId: payload.userId }, status: 'completed' },
      orderBy: { completedAt: 'desc' },
      select: { completedAt: true }
    });

    return NextResponse.json({
      totalJobs,
      newJobsToday,
      companiesTracked,
      savedJobs,
      lastScrapeTime: lastScrape?.completedAt || null,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
