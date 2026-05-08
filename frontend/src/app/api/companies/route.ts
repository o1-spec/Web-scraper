import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { companySchema } from '@/lib/validators';

export async function GET(req: NextRequest) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const companies = await prisma.company.findMany({
      where: { userId: payload.userId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(companies);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const result = companySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues }, { status: 400 });
    }

    const { name, careerPageUrl, sourceType } = result.data;

    // Check duplicate URL
    const existing = await prisma.company.findUnique({
      where: {
        userId_careerPageUrl: {
          userId: payload.userId,
          careerPageUrl,
        }
      }
    });

    if (existing) {
      return NextResponse.json({ error: 'You are already tracking this career page.' }, { status: 400 });
    }

    const company = await prisma.company.create({
      data: {
        userId: payload.userId,
        name,
        careerPageUrl,
        sourceType,
      }
    });

    return NextResponse.json(company);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
