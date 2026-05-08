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

    const recentJobs = await prisma.job.findMany({
      where: { companyId: { in: companyIds } },
      orderBy: { dateFound: 'desc' },
      take: 5,
      include: {
        company: { select: { name: true } },
        savedBy: { where: { userId: payload.userId }, select: { id: true } }
      }
    });

    const formatted = recentJobs.map(j => ({
      ...j,
      company: j.company.name,
      isSaved: j.savedBy.length > 0,
      savedBy: undefined, // remove from response
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
