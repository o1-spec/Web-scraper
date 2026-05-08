import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { companySchema } from '@/lib/validators';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const result = companySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues }, { status: 400 });
    }

    const { name, careerPageUrl, sourceType } = result.data;

    const company = await prisma.company.findUnique({ where: { id: params.id } });
    if (!company) return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    if (company.userId !== payload.userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const updated = await prisma.company.update({
      where: { id: params.id },
      data: { name, careerPageUrl, sourceType }
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const company = await prisma.company.findUnique({ where: { id: params.id } });
    if (!company) return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    if (company.userId !== payload.userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await prisma.company.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
