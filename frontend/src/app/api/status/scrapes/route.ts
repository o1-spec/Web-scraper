import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const runs = await prisma.scrapeRun.findMany({
      where: {
        company: {
          userId: user.userId
        }
      },
      include: {
        company: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        startedAt: 'desc'
      },
      take: 50
    });

    return NextResponse.json(runs);
  } catch (error) {
    console.error('Failed to fetch scrape logs:', error);
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}
