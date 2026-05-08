import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Check if users exist
  const existingUser = await prisma.user.findFirst({
    where: { email: 'demo@jobscout.com' }
  });

  if (existingUser) {
    console.log('Demo user already exists. Skipping seed.');
    return;
  }

  // 1. Create Demo User
  const passwordHash = await bcrypt.hash('password123', 10);
  const user = await prisma.user.create({
    data: {
      email: 'demo@jobscout.com',
      passwordHash,
      firstName: 'Demo',
      lastName: 'User',
      digestSettings: {
        create: {
          enabled: true,
          emailAddress: 'demo@jobscout.com',
          frequency: 'daily',
          preferredTime: '09:00',
          minimumMatchScore: 60,
        }
      }
    }
  });
  console.log('Created Demo User');

  // 2. Create Keywords
  const keywords = ['React', 'Next.js', 'TypeScript', 'Node.js', 'Frontend', 'Fullstack'];
  for (const keyword of keywords) {
    await prisma.keyword.create({
      data: {
        userId: user.id,
        keyword,
      }
    });
  }
  console.log('Created Keywords');

  // 3. Create Companies
  const companies = [
    { name: 'Linear', url: 'https://linear.app/careers', source: 'ashby' },
    { name: 'Vercel', url: 'https://vercel.com/careers', source: 'greenhouse' },
    { name: 'Stripe', url: 'https://stripe.com/jobs', source: 'lever' },
  ];

  const createdCompanies = [];
  for (const company of companies) {
    const c = await prisma.company.create({
      data: {
        userId: user.id,
        name: company.name,
        careerPageUrl: company.url,
        sourceType: company.source,
        status: 'active',
        lastChecked: new Date(),
        jobsFound: 5,
      }
    });
    createdCompanies.push(c);
  }
  console.log('Created Companies');

  // 4. Create Jobs
  for (const company of createdCompanies) {
    await prisma.job.create({
      data: {
        companyId: company.id,
        title: `Senior Frontend Engineer - ${company.name}`,
        location: 'San Francisco, CA',
        locationType: 'remote',
        jobType: 'full-time',
        source: company.sourceType,
        jobLink: `${company.careerPageUrl}/job/${Math.floor(Math.random() * 10000)}`,
        description: 'We are looking for an experienced frontend engineer with deep knowledge of React and TypeScript.',
        tags: ['React', 'TypeScript', 'Frontend'],
        matchScore: Math.floor(Math.random() * (100 - 60 + 1) + 60),
        dateFound: new Date(),
      }
    });
  }
  console.log('Created Sample Jobs');

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
