import { ScrapedJob } from './greenhouse';

export async function scrapeLever(url: string, companyName: string): Promise<ScrapedJob[]> {
  // Extract board token: e.g. https://jobs.lever.co/stripe -> stripe
  const match = url.match(/lever\.co\/([^/]+)/);
  if (!match) throw new Error('Invalid Lever URL');
  const boardToken = match[1];

  const response = await fetch(`https://api.lever.co/v0/postings/${boardToken}?mode=json`);
  if (!response.ok) throw new Error(`Lever API returned ${response.status}`);
  const data = await response.json();

  return data.map((job: any) => {
    const location = job.categories?.location || 'Unknown';
    const commitment = (job.categories?.commitment || '').toLowerCase();
    
    let jobType: ScrapedJob['jobType'] = 'full-time';
    if (commitment.includes('part-time')) jobType = 'part-time';
    if (commitment.includes('contract')) jobType = 'contract';
    if (commitment.includes('intern')) jobType = 'internship';

    const isRemote = job.workplaceType === 'remote' || location.toLowerCase().includes('remote');

    return {
      title: job.text,
      company: companyName,
      location,
      locationType: isRemote ? 'remote' : 'on-site',
      jobType,
      source: 'lever',
      jobLink: job.hostedUrl,
      description: job.descriptionPlain || '',
    };
  });
}
