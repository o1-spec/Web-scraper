import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { keywordSchema } from '@/lib/validators';

export async function GET(req: NextRequest) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const keywords = await prisma.keyword.findMany({
      where: { userId: payload.userId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(keywords);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const result = keywordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues }, { status: 400 });
    }

    const existing = await prisma.keyword.findUnique({
      where: {
        userId_keyword: {
          userId: payload.userId,
          keyword: result.data.keyword,
        }
      }
    });

    if (existing) {
      return NextResponse.json({ error: 'Keyword already exists' }, { status: 400 });
    }

    const keyword = await prisma.keyword.create({
      data: {
        userId: payload.userId,
        keyword: result.data.keyword,
      }
    });

    return NextResponse.json(keyword);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
