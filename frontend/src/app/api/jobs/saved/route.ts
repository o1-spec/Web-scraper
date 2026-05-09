import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const savedJobs = await prisma.savedJob.findMany({
      where: { userId: user.userId },
      include: {
        job: {
          include: { company: true }
        }
      },
      orderBy: { updatedAt: 'desc' } as any
    });

    return NextResponse.json(savedJobs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch saved jobs' }, { status: 500 });
  }
}
