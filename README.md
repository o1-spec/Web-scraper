# JobScout 🚀

**JobScout** is a high-performance, full-stack Job Discovery & Tracking Platform designed to automate your job search. It monitors company career pages, scrapes new openings, and uses an intelligent matching engine to help you find the roles that matter most.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748.svg)
![BullMQ](https://img.shields.io/badge/BullMQ-Workers-FF4B4B.svg)

## ✨ Core Features

### 🔍 Automated Job Discovery
Monitor career pages from top tech companies. Support for specialized ATS platforms including:
*   **Greenhouse**
*   **Lever**
*   **Ashby**
*   **Custom Web Scrapers**

### 🧠 Intelligent Matching Engine
Define your target keywords (React, TypeScript, Senior, etc.) and let JobScout calculate a **Match Score** for every discovered role. Focus your energy on the highest-relevance opportunities.

### 📊 Real-time Observability
Monitor background workers and scrape health directly from the **System Status** dashboard. Track success rates, discovery counts, and scrape durations.

### 🔔 Smart Notifications
Get global success/error feedback via a premium glassmorphic toast system and configure email digests for daily summaries of new matching roles.

## 🛠️ Tech Stack

*   **Frontend**: Next.js 14 (App Router), Tailwind CSS, Framer Motion, Lucide Icons.
*   **Backend**: Next.js API Routes, BullMQ (Queue Management).
*   **Database**: PostgreSQL (Data persistence), Redis (Queue Broker & Caching).
*   **ORM**: Prisma.
*   **Auth**: JWT-based secure session management.

## 🚀 Getting Started

### Prerequisites
*   Node.js 18+
*   Docker & Docker Compose

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/o1-spec/Web-scraper.git
    cd Web-scraper
    ```

2.  **Environment Setup**:
    Copy the example environment file and fill in your secrets.
    ```bash
    cp frontend/.env.example frontend/.env
    ```

3.  **Start Services (Docker)**:
    ```bash
    docker-compose up -d
    ```

4.  **Install Dependencies & Sync Database**:
    ```bash
    cd frontend
    npm install
    npx prisma migrate dev
    ```

5.  **Run the Application**:
    ```bash
    # Terminal 1: Web App
    npm run dev

    # Terminal 2: Background Workers
    npx ts-node worker.ts
    ```

## 📐 Architecture

For a deep dive into the system design, pipeline flow, and database schema, see our [ARCHITECTURE.md](./ARCHITECTURE.md).

## 🛡️ License

Distributed under the MIT License. See `LICENSE` for more information.

---
*Built with passion for the developer community.*
