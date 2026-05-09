import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const notification = await prisma.notification.update({
      where: { 
        id: params.id,
        userId: payload.userId 
      },
      data: { isRead: true }
    });

    return NextResponse.json(notification);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
