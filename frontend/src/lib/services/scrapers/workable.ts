import { ScrapedJob } from './greenhouse';

export async function scrapeWorkable(url: string, companyName: string): Promise<ScrapedJob[]> {
  const match = url.match(/workable\.com\/([^/]+)/);
  if (!match) throw new Error('Invalid Workable URL');
  const boardToken = match[1];

  const response = await fetch(`https://apply.workable.com/api/v1/widget/accounts/${boardToken}`);
  if (!response.ok) throw new Error(`Workable API returned ${response.status}`);
  const data = await response.json();

  return data.jobs.map((job: any) => {
    const isRemote = job.remote === true || (job.location || '').toLowerCase().includes('remote');

    return {
      title: job.title,
      company: companyName,
      location: job.location || 'Unknown',
      locationType: isRemote ? 'remote' : 'on-site',
      jobType: 'full-time',
      source: 'workable',
      jobLink: job.url,
      description: job.description || '',
    };
  });
}
