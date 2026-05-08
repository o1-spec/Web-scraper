import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const keyword = await prisma.keyword.findUnique({ where: { id: params.id } });
    if (!keyword) return NextResponse.json({ error: 'Keyword not found' }, { status: 404 });
    if (keyword.userId !== payload.userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await prisma.keyword.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
