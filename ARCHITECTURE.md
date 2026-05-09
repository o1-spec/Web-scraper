# JobScout System Architecture

This document provides a technical overview of the JobScout architecture, data flow, and backend processing pipelines.

## 🏗️ High-Level Architecture

JobScout is built using a modern full-stack architecture that separates the web interface from the heavy background processing tasks.

```mermaid
graph TD
    User((User)) -->|HTTPS| FE[Next.js Frontend]
    FE -->|API Routes| DB[(PostgreSQL)]
    FE -->|Job Producer| Redis{Redis Cache}
    
    subgraph "Background Processing"
        Redis -->|Jobs Queue| Worker[BullMQ Scrape Worker]
        Worker -->|Scrape Request| Web[Company Careers Page]
        Web -->|Job Data| Worker
        Worker -->|Calculate Match| Matcher[Job Match Engine]
        Matcher -->|Save Jobs| DB
    end
```

## 🔄 Scraper Pipeline

The scraper pipeline is designed to be extensible, supporting multiple ATS (Applicant Tracking Systems) and custom web scrapers.

```mermaid
sequenceDiagram
    participant UI as Dashboard UI
    participant API as Next.js API
    participant Q as BullMQ (Redis)
    participant W as Scrape Worker
    participant S as ATS Service
    participant DB as Postgres

    UI->>API: Trigger Refresh
    API->>DB: Create ScrapeRun (status: pending)
    API->>Q: Add Job to 'scrapeCompany' queue
    Q->>W: Process Job
    W->>DB: Update ScrapeRun (status: running)
    W->>S: Fetch Jobs (Greenhouse/Lever)
    S-->>W: Raw JSON/HTML
    W->>W: Deduplicate & Filter
    W->>W: Calculate Match Score
    W->>DB: Bulk Insert New Jobs
    W->>DB: Update ScrapeRun (status: completed)
    W->>UI: Notify via SWR Mutate
```

## 📊 Database Schema

Our data model is optimized for high-speed job discovery and efficient keyword matching.

```mermaid
erDiagram
    User ||--o{ Company : "tracks"
    User ||--o{ Keyword : "defines"
    Company ||--o{ Job : "hosts"
    Company ||--o{ ScrapeRun : "executes"
    
    User {
        string id
        string email
        string password
    }
    
    Company {
        string id
        string name
        string careerPageUrl
        string sourceType
        int jobsFound
    }
    
    Job {
        string id
        string title
        string description
        float matchScore
        string jobLink
        datetime createdAt
    }
    
    ScrapeRun {
        string id
        string status
        int jobsFound
        datetime completedAt
    }
```

## 🤖 Job Matching Engine

The matching engine uses a weighted scoring algorithm:
1.  **Normalization**: Job titles and descriptions are cleaned and tokenized.
2.  **Keyword Matching**: Case-insensitive scanning for user-defined keywords.
3.  **Scoring**:
    *   Title matches carry a higher weight (2.5x).
    *   Description matches are calculated based on frequency and density.
4.  **Tagging**: Matches are converted into visual tags for the UI.

## ⚙️ Observability & Retries

- **BullMQ Retries**: Failed scrapes are automatically retried with exponential backoff (3 attempts).
- **Atomic Operations**: We use Prisma transactions to ensure that job insertion and `ScrapeRun` updates happen atomically.
- **Deduplication**: Every job is hashed by its unique URL and ID to prevent duplicate alerts.
