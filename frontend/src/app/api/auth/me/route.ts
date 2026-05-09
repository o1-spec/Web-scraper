import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) {
      const response = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      response.cookies.delete('token');
      return response;
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      }
    });

    if (!user) {
      const response = NextResponse.json({ error: 'User not found' }, { status: 404 });
      response.cookies.delete('token');
      return response;
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
