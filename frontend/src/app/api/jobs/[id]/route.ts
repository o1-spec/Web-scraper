import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const job = await prisma.job.findUnique({
      where: { id: params.id },
      include: {
        company: { select: { name: true, userId: true } },
        savedBy: { where: { userId: payload.userId }, select: { id: true } }
      }
    });

    if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    if (job.company.userId !== payload.userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const formatted = {
      ...job,
      company: job.company.name,
      isSaved: job.savedBy.length > 0,
      savedBy: undefined,
    };

    return NextResponse.json(formatted);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
