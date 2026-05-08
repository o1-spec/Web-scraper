export interface ScrapedJob {
  title: string;
  company: string;
  location: string;
  locationType: 'remote' | 'on-site' | 'hybrid';
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship';
  source: string;
  jobLink: string;
  description: string;
}

export async function scrapeGreenhouse(url: string, companyName: string): Promise<ScrapedJob[]> {
  // Extract board token: e.g. https://boards.greenhouse.io/vercel -> vercel
  const match = url.match(/greenhouse\.io\/([^/]+)/);
  if (!match) throw new Error('Invalid Greenhouse URL');
  const boardToken = match[1];

  const response = await fetch(`https://boards-api.greenhouse.io/v1/boards/${boardToken}/jobs?content=true`);
  if (!response.ok) throw new Error(`Greenhouse API returned ${response.status}`);
  const data = await response.json();

  return data.jobs.map((job: any) => {
    const location = job.location?.name || 'Unknown';
    const isRemote = location.toLowerCase().includes('remote');

    return {
      title: job.title,
      company: companyName,
      location,
      locationType: isRemote ? 'remote' : 'on-site',
      jobType: 'full-time', // Often not provided reliably in greenhouse basic API
      source: 'greenhouse',
      jobLink: job.absolute_url,
      description: job.content || '',
    };
  });
}
