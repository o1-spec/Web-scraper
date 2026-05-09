export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return 'N/A';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return 'Invalid Date';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return 'Never';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return 'Invalid Date';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function getRelativeTime(date: Date | string | null | undefined): string {
  if (!date) return 'Never';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return 'Invalid Date';

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  return formatDate(date);
}

export function getSourceBadgeColor(
  source: 'greenhouse' | 'lever' | 'ashby' | 'custom' | 'unknown'
): string {
  switch (source) {
    case 'greenhouse':
      return 'bg-blue-100 text-blue-800';
    case 'lever':
      return 'bg-purple-100 text-purple-800';
    case 'ashby':
      return 'bg-green-100 text-green-800';
    case 'custom':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getStatusBadgeColor(status: 'active' | 'failed' | 'pending'): string {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getLocationTypeLabel(locationType: 'remote' | 'on-site' | 'hybrid'): string {
  switch (locationType) {
    case 'remote':
      return 'Remote';
    case 'on-site':
      return 'On-site';
    case 'hybrid':
      return 'Hybrid';
    default:
      return locationType;
  }
}

export function getJobTypeLabel(jobType: string): string {
  return jobType
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getSourceTypeLabel(sourceType: string): string {
  switch (sourceType) {
    case 'greenhouse':
      return 'Greenhouse';
    case 'lever':
      return 'Lever';
    case 'ashby':
      return 'Ashby';
    case 'custom':
      return 'Custom Page';
    default:
      return sourceType;
  }
}
