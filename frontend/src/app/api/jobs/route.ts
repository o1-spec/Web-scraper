import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const searchParams = req.nextUrl.searchParams;
    const keyword = searchParams.get('keyword');
    const company = searchParams.get('company');
    const location = searchParams.get('location');
    const locationType = searchParams.get('locationType');
    const jobType = searchParams.get('jobType');
    const source = searchParams.get('source');
    const savedOnly = searchParams.get('savedOnly') === 'true';
    const newOnly = searchParams.get('newOnly') === 'true';

    const companyIds = (await prisma.company.findMany({
      where: { userId: payload.userId },
      select: { id: true }
    })).map(c => c.id);

    const whereClause: any = {
      companyId: { in: companyIds },
    };

    if (keyword) {
      whereClause.OR = [
        { title: { contains: keyword, mode: 'insensitive' } },
        { description: { contains: keyword, mode: 'insensitive' } },
        { tags: { has: keyword } }
      ];
    }

    if (company && company !== 'all') {
      whereClause.company = { name: { contains: company, mode: 'insensitive' } };
    }

    if (location) {
      whereClause.location = { contains: location, mode: 'insensitive' };
    }

    if (locationType && locationType !== 'all') {
      whereClause.locationType = locationType;
    }

    if (jobType && jobType !== 'all') {
      whereClause.jobType = jobType;
    }

    if (source && source !== 'all') {
      whereClause.source = source;
    }

    if (savedOnly) {
      whereClause.savedBy = {
        some: { userId: payload.userId }
      };
    }

    if (newOnly) {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      whereClause.dateFound = { gte: startOfDay };
    }

    const jobs = await prisma.job.findMany({
      where: whereClause,
      orderBy: { matchScore: 'desc' },
      include: {
        company: { select: { name: true } },
        savedBy: { where: { userId: payload.userId }, select: { id: true } }
      }
    });

    const formatted = jobs.map(j => ({
      ...j,
      company: j.company.name,
      isSaved: j.savedBy.length > 0,
      savedBy: undefined,
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
