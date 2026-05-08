import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { settingsSchema } from '@/lib/validators';

export async function GET(req: NextRequest) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let settings = await prisma.digestSettings.findUnique({
      where: { userId: payload.userId }
    });

    if (!settings) {
      // Create defaults if not exists
      settings = await prisma.digestSettings.create({
        data: {
          userId: payload.userId,
          emailAddress: payload.email,
        }
      });
    }

    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const result = settingsSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues }, { status: 400 });
    }

    const updated = await prisma.digestSettings.upsert({
      where: { userId: payload.userId },
      update: result.data,
      create: {
        userId: payload.userId,
        ...result.data,
      }
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
