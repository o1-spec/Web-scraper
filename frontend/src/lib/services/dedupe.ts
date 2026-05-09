import { prisma } from '../prisma';

export async function isDuplicateJob(companyId: string, jobLink: string, title: string): Promise<boolean> {
  const existingByUrl = await prisma.job.findUnique({
    where: { jobLink },
  });

  if (existingByUrl) return true;

  const existingByTitle = await prisma.job.findFirst({
    where: {
      companyId,
      title,
    }
  });

  if (existingByTitle) return true;

  return false;
}
