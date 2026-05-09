import { ScrapedJob } from './greenhouse';

export async function scrapeBreezy(url: string, companyName: string): Promise<ScrapedJob[]> {
  const match = url.match(/([^.]+)\.breezy\.hr/);
  if (!match) throw new Error('Invalid Breezy URL');
  const boardToken = match[1];

  const response = await fetch(`https://${boardToken}.breezy.hr/json`);
  if (!response.ok) throw new Error(`Breezy API returned ${response.status}`);
  const data = await response.json();

  return data.map((job: any) => {
    const isRemote = job.remote === true || (job.location?.name || '').toLowerCase().includes('remote');

    return {
      title: job.name,
      company: companyName,
      location: job.location?.name || 'Unknown',
      locationType: isRemote ? 'remote' : 'on-site',
      jobType: job.type?.name?.toLowerCase().includes('contract') ? 'contract' : 'full-time',
      source: 'breezy',
      jobLink: `https://${boardToken}.breezy.hr/p/${job.id}`,
      description: job.description || '',
    };
  });
}
