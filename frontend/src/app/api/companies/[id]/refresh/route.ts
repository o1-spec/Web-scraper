import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { enqueueScrapeJob } from '@/lib/queues';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const company = await prisma.company.findUnique({ where: { id: params.id } });
    if (!company) return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    if (company.userId !== payload.userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const scrapeRun = await prisma.scrapeRun.create({
      data: {
        companyId: company.id,
        status: 'pending',
      }
    });

    await enqueueScrapeJob(company.id, scrapeRun.id);

    return NextResponse.json({ success: true, runId: scrapeRun.id, message: 'Scraping job queued.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
