# JobScout Frontend

A modern, clean job monitoring dashboard built with Next.js, TypeScript, and Tailwind CSS.

## Features

✨ **Dashboard** - Overview of your job tracking metrics
📋 **Job Listings** - Browse and filter jobs from multiple sources
🏢 **Company Tracking** - Manage career pages you're monitoring
🔑 **Keywords** - Track specific roles, technologies, and levels
⚙️ **Settings** - Configure email digest preferences

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **UI Components**: shadcn/ui (ready to integrate)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install
# or
yarn install

# Create environment file
cp .env.example .env.local
```

### Development

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                      # Next.js pages and layouts
│   ├── dashboard/           # Dashboard page
│   ├── jobs/                # Jobs listing page
│   ├── companies/           # Companies tracking page
│   ├── keywords/            # Keywords preferences page
│   ├── settings/            # Settings page
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Root redirect
│   └── globals.css          # Global styles
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx      # Main navigation
│   │   └── Topbar.tsx       # Top navigation bar
│   ├── dashboard/
│   │   └── StatCard.tsx     # Statistics cards
│   ├── jobs/
│   │   ├── JobCard.tsx      # Job listing card
│   │   └── JobFilters.tsx   # Job filtering component
│   └── companies/
│       └── CompanyTable.tsx # Companies table (upcoming)
├── lib/
│   ├── mockData.ts          # Mock data for development
│   └── utils.ts             # Utility functions
├── types/
│   └── index.ts             # TypeScript type definitions
└── styles/                  # Additional style files

```

## Key Components

### StatCard
Displays key metrics like total jobs, new jobs today, etc.

```tsx
<StatCard
  label="Total Jobs"
  value={42}
  icon={Briefcase}
  trend={{ value: 12, isPositive: true }}
/>
```

### JobCard
Shows individual job listing with save functionality.

```tsx
<JobCard
  job={jobData}
  onSaveToggle={handleSave}
/>
```

### JobFilters
Advanced filtering for job search.

```tsx
<JobFilters
  onFiltersChange={handleFilters}
  onReset={handleReset}
/>
```

## Available Routes

- `/` - Redirects to `/dashboard`
- `/dashboard` - Main dashboard overview
- `/jobs` - Jobs listing with filters
- `/companies` - Company tracking management
- `/keywords` - Keyword preferences
- `/settings` - Email digest and preferences

## Mock Data

The application comes with realistic mock data:
- 10 sample jobs
- 9 sample companies
- 11 sample keywords
- Dashboard statistics

Mock data is located in `src/lib/mockData.ts` and can be easily replaced with API calls to the backend.

## Types

All TypeScript types are defined in `src/types/index.ts`:

- `Job` - Job posting interface
- `Company` - Company information
- `Keyword` - Keyword tracking
- `DigestSettings` - Email digest configuration
- `DashboardStats` - Dashboard metrics

## Styling

The project uses Tailwind CSS with a custom color scheme. Key features:

- **Color Variables**: Defined in `tailwind.config.ts`
- **Responsive Design**: Mobile-first approach with breakpoints
- **Custom Components**: Reusable component patterns
- **Light Theme**: Clean white/light gray design

## Environment Variables

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Backend Integration

Currently, the frontend uses mock data. To connect to the backend:

1. Create API client functions in `lib/api.ts`
2. Replace mock data imports with API calls
3. Update `.env.local` with backend URL

Example pattern:

```tsx
// Before: Using mock data
import { mockJobs } from '@/lib/mockData';
const [jobs, setJobs] = useState<Job[]>(mockJobs);

// After: Using API
const [jobs, setJobs] = useState<Job[]>([]);
useEffect(() => {
  fetchJobs().then(setJobs);
}, []);
```

## Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm start         # Start production server
npm run lint      # Run ESLint
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Performance

- Optimized with Next.js Image component
- CSS modules for scoped styling
- Efficient state management with React hooks
- Client-side filtering for smooth UX

## Accessibility

- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Color contrast compliance

## Future Enhancements

- [ ] Dark mode support
- [ ] Advanced analytics
- [ ] Job recommendations
- [ ] Saved searches
- [ ] Export functionality
- [ ] Team collaboration features

## Contributing

This is a personal project. Feel free to fork and customize for your needs.

## License

MIT

---

**JobScout** - Personal job monitoring dashboard for tracking roles across company career pages.
