# JobScout: Technical Architecture & Design Decisions

JobScout is a high-performance, automated job discovery and application management platform designed for the modern engineering workflow. This document outlines the architectural decisions and technical infrastructure that power the platform.

## 🏗️ Technical Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Framer Motion.
- **Backend**: Next.js API Routes (Serverless-ready).
- **Database**: PostgreSQL with Prisma ORM.
- **Background Jobs**: BullMQ (Node.js) + Redis.
- **Email Service**: Nodemailer (SMTP).
- **Authentication**: JWT with secure cookie-based session management.

---

## 🚀 Core Systems

### 1. The Multi-Engine Discovery Logic (`/src/lib/services/scrapers`)
Instead of a monolithic scraper, JobScout uses a **Modular Adapter Pattern**. 
- Each ATS (Applicant Tracking System) like Greenhouse, Lever, Ashby, or Workable has its own dedicated service.
- This allows for extreme scalability; adding a new platform requires only a new adapter, not a rewrite of the core engine.

### 2. Intelligent Match Scoring (`/src/lib/services/jobMatcher.ts`)
Discovered jobs are processed through a keyword-weighted algorithm:
- **Keyword Extraction**: Analyzes job titles and descriptions against user-defined technical keywords.
- **Weighted Scoring**: Assigns weights to specific matches (e.g., a match in the Title is weighted more heavily than in the Description).
- **Match Score**: Jobs are tagged with a 0-100% score, allowing users to filter for high-signal opportunities instantly.

### 3. Distributed Task Pipeline (BullMQ + Redis)
To handle high-frequency scraping without blocking the main thread, JobScout employs a distributed worker system:
- **`scrapeCompanyQueue`**: Manages the discovery tasks. Each company tracking request is enqueued and processed by independent workers.
- **`emailDigestQueue`**: Aggregates 24-hour discovery data and generates personalized HTML digests.
- **Reliability**: Using Redis ensures that even if a worker crashes, the job is persisted and can be retried automatically.

---

## 🔄 Data Lifecycle

1. **Discovery**: A background worker triggers an ATS-specific scraper.
2. **Ingestion**: Discovered jobs are cross-referenced with the database to prevent duplicates.
3. **Intelligence**: New jobs are scored against user keywords and saved.
4. **CRM Injection**: High-scoring jobs are displayed on the Dashboard and Pipeline board.
5. **Notification**: Once every 24 hours, the Email Worker aggregates the best matches and delivers a premium HTML report to the user's inbox.

---

## 📈 Scalability & Observability

- **Prisma Migrations**: Ensures a consistent, version-controlled database schema across development and production.
- **System Status Dashboard**: A dedicated observability layer (`/status`) monitors scraper health, success rates, and queue performance in real-time.
- **Atomic Operations**: Database transactions are used to ensure that job discovery and scrape-run recording are atomic, preventing data corruption.

---

## 🛡️ Security
- **Auth Guard**: All sensitive API routes are protected by a JWT-based middleware.
- **Data Scoping**: Every query is strictly scoped to the `userId` of the authenticated session, ensuring complete data isolation between users.
- **Environment Management**: Sensitive credentials (DB URL, Redis URL, SMTP details) are managed via encrypted environment variables.
