import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Return success even if user not found for security reasons
      return NextResponse.json({ success: true, message: 'If an account with that email exists, we sent a password reset link.' });
    }

    // In a real app, generate a reset token, save to DB, and send an email via Nodemailer/Resend
    // For this MVP, we just simulate success.

    return NextResponse.json({ success: true, message: 'Password reset link sent to your email.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
