export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship' | 'graduate';

export type JobLocation = 'remote' | 'on-site' | 'hybrid';

export type JobSourcePlatform = 'greenhouse' | 'lever' | 'ashby' | 'breezy' | 'workable' | 'custom' | 'unknown';

export type CompanyStatus = 'active' | 'failed' | 'pending';

export type SourceType = 'greenhouse' | 'lever' | 'ashby' | 'breezy' | 'workable' | 'custom';

export type DigestFrequency = 'daily' | 'every-2-days' | 'weekly';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  locationType: JobLocation;
  jobType: JobType;
  source: JobSourcePlatform;
  dateFound: Date;
  jobLink: string;
  description?: string;
  matchScore: number; // 0-100
  tags: string[];
  isSaved: boolean;
}

export interface Company {
  id: string;
  name: string;
  careerPageUrl: string;
  sourceType: SourceType;
  lastChecked: Date;
  jobsFound: number;
  status: CompanyStatus;
}

export interface Keyword {
  id: string;
  keyword: string;
  createdAt: Date;
}

export interface DigestSettings {
  id: string;
  enabled: boolean;
  emailAddress: string;
  frequency: DigestFrequency;
  preferredTime: string; // "HH:mm" format
  minimumMatchScore: number; // 0-100
}

export interface DashboardStats {
  totalJobs: number;
  newJobsToday: number;
  companiesTracked: number;
  savedJobs: number;
  lastScrapeTime: Date;
}
