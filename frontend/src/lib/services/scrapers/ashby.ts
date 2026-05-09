import { ScrapedJob } from './greenhouse';

export async function scrapeAshby(url: string, companyName: string): Promise<ScrapedJob[]> {
  const match = url.match(/ashbyhq\.com\/([^/]+)/);
  if (!match) throw new Error('Invalid Ashby URL');
  const boardToken = match[1];

  // Ashby uses a POST request to their search-api for public boards
  const response = await fetch(`https://api.ashbyhq.com/posting-api/job-board/${boardToken}`);
  
  if (!response.ok) throw new Error(`Ashby API returned ${response.status}`);
  const data = await response.json();

  return data.jobs.map((job: any) => {
    const location = job.location || 'Unknown';
    const isRemote = job.isRemote || location.toLowerCase().includes('remote');

    return {
      title: job.title,
      company: companyName,
      location,
      locationType: isRemote ? 'remote' : 'on-site',
      jobType: 'full-time', // Ashby doesn't always expose this in the simple board API
      source: 'ashby',
      jobLink: job.jobUrl,
      description: job.descriptionPlain || '',
    };
  });
}
