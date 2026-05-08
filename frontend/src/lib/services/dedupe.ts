import { prisma } from '../prisma';

export async function isDuplicateJob(companyId: string, jobLink: string, title: string): Promise<boolean> {
  // Check by URL first (most reliable)
  const existingByUrl = await prisma.job.findUnique({
    where: { jobLink },
  });

  if (existingByUrl) return true;

  // Fallback: Check if a job with the same title exists for this company 
  // (Prevents duplicate postings that just have different UTM parameters)
  const existingByTitle = await prisma.job.findFirst({
    where: {
      companyId,
      title,
    }
  });

  if (existingByTitle) return true;

  return false;
}
