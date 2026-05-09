import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { status } = await request.json();
  const validStatuses = ['SAVED', 'APPLIED', 'INTERVIEWING', 'OFFER', 'REJECTED'];

  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  try {
    const existing = await prisma.savedJob.findFirst({
      where: {
        id: params.id,
        userId: user.userId
      }
    });

    if (!existing) {
      return NextResponse.json({ error: 'Job not found or unauthorized' }, { status: 404 });
    }

    const updated = await prisma.savedJob.update({
      where: { id: params.id },
      data: { 
        status: status,
        updatedAt: new Date()
      } as any
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}
