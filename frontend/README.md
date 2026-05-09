# 🚀 JobScout: Engineering Career Intelligence

**JobScout** is a premium, full-stack job discovery engine and career CRM designed to automate the search for high-signal engineering roles. It monitors company career pages in real-time, scores roles against your technical profile, and manages your entire application journey in one unified dashboard.

![JobScout Banner](https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=2000&ixlib=rb-4.0.3)

---

## ✨ High-End Features

- **Multi-Engine Scraper**: Native adapters for **Greenhouse, Lever, Ashby, Breezy HR, and Workable**.
- **Match Intelligence**: Proprietary keyword-weighted algorithm that calculates a % match for every role discovered.
- **Automated Career CRM**: A full Kanban-style board to track applications from *Saved* to *Offer*.
- **Daily Intelligence Reports**: Personalized HTML email digests delivered to your inbox via Nodemailer.
- **Global Discovery**: Single-click "Global Scrape" to refresh your entire tracking ecosystem.
- **Observability**: Real-time system monitoring of scraper health and queue performance.

## 🏗️ Technical Architecture

This project is built with a focus on **scalability, performance, and clean code**.

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Framer Motion.
- **Backend**: Next.js API Routes, BullMQ, Redis.
- **Database**: PostgreSQL with Prisma ORM.
- **Infrastructure**: Distributed Background Workers.

For a deep dive into the system design, see [**ARCHITECTURE.md**](./ARCHITECTURE.md).

---

## 🚦 Getting Started

### 1. Prerequisites
- **PostgreSQL**: Primary data store.
- **Redis**: Required for BullMQ task queues.
- **Node.js**: v18+.

### 2. Installation
```bash
git clone https://github.com/yourusername/jobscout.git
cd jobscout/frontend
npm install
```

### 3. Environment Setup
Create a `.env` file based on `.env.example`:
```env
DATABASE_URL="postgresql://..."
REDIS_URL="redis://..."
JWT_SECRET="your-secret"
SMTP_HOST="smtp.example.com"
EMAIL_FROM="JobScout <noreply@jobscout.com>"
```

### 4. Database & Workers
```bash
# Apply migrations
npx prisma migrate dev

# Start the discovery workers (in a separate terminal)
npm run worker

# Start the application
npm run dev
```

---

## 📊 Business Logic: The Scoring Engine
JobScout doesn't just find jobs; it evaluates them. The engine analyzes:
1. **Title Weighting**: Matches in the job title carry the highest signal.
2. **Contextual Analysis**: Tags are extracted from the job description to identify tech stacks (React, Go, AWS).
3. **Thresholding**: Only roles meeting your `minimumMatchScore` are enqueued for your daily digest.

---

## 🎨 Design Philosophy
JobScout uses a **Glassmorphic / Modern Dark** aesthetic:
- **Responsive**: Fully optimized for mobile discovery.
- **Accessible**: Semantic HTML and ARIA-compliant components.
- **Premium**: Smooth micro-animations using `framer-motion`.

## 📜 License
MIT - Created by [Your Name]
