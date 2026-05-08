import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const job = await prisma.job.findUnique({
      where: { id: params.id },
      include: { company: true }
    });

    if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    if (job.company.userId !== payload.userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const existingSave = await prisma.savedJob.findUnique({
      where: {
        userId_jobId: {
          userId: payload.userId,
          jobId: params.id,
        }
      }
    });

    if (existingSave) {
      await prisma.savedJob.delete({
        where: { id: existingSave.id }
      });
      return NextResponse.json({ isSaved: false });
    } else {
      await prisma.savedJob.create({
        data: {
          userId: payload.userId,
          jobId: params.id,
        }
      });
      return NextResponse.json({ isSaved: true });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
