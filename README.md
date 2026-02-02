# AI Skill Roadmap Generator

## 1. Project Overview

### Problem Statement
In the rapidly evolving tech landscape, learners often struggle to find structured, up-to-date, and personalized learning paths. Generic roadmaps fail to account for individual experience levels, time constraints, and career goals, leading to inefficient learning and loss of motivation.

### Why This Project Exists
This project bridges the gap between static curriculum and personalized mentorship. It leverages Generative AI to create dynamic, custom-tailored learning roadmaps that adapt to user constraints (time, current skills) and provide curated, high-quality resources (YouTube videos, official documentation) automatically.

### High-Level Solution
The AI Skill Roadmap Generator is a SaaS platform where users input their career goals and availability. The system uses Google's Gemini 1.5 Flash model to generate a phased, project-oriented learning path. It features a sophisticated caching layer to minimize AI costs, an interactive dashboard for tracking progress, and automated email reminders to keep users on track.

## 2. Key Features

- **Personalized Onboarding**: Tailors roadmaps based on experience level (Beginner/Intermediate/Pro), career goals, and daily time commitment.
- **AI-Generated Skill Roadmaps**: Uses Google Gemini to create detailed, step-by-step curricula divided into phases (Foundations, Advanced, Mastery).
- **Project-Based Learning**: Roadmaps emphasize practical application with project suggestions and clear learning outcomes.
- **Embedded YouTube Resources**: Automatically searches and embeds relevant, high-quality YouTube tutorials for every skill using the YouTube Data API.
- **Roadmap Caching & Reuse**: Intelligent hashing of user inputs allows the system to reuse previously generated high-quality templates, significantly reducing AI costs and latency.
- **Progress Tracking**: Granular tracking at the skill level with status updates (Pending, In Progress, Completed).
- **Email Automation**: Automated welcome emails, roadmap readiness notifications, and milestone achievements using Inngest and Nodemailer.
- **Admin Panel**: Comprehensive dashboard for administrators to manage users (ban/delete), view analytics, and oversee system templates.
- **Subscription System**: Premium features managed via Polar integration with webhook synchronization.

## 3. Tech Stack

### Frontend
- **Next.js 16 (App Router)**: Chosen for its server-side rendering performance, SEO capabilities, and robust routing architecture.
- **React 19**: Leverages the latest React features including Server Actions for seamless data mutation.
- **TailwindCSS V4**: Provides a modern, utility-first styling approach with zero runtime overhead.
- **Framer Motion**: Delivers smooth, professional animations for a premium user experience.

### Backend
- **Next.js Server Actions**: Simplifies the API layer by allowing direct database mutations from UI components, reducing the need for separate API routes.
- **Node.js**: The runtime environment executing the server-side logic.

### Database
- **PostgreSQL**: A robust, relational database essential for structured data (users, roadmaps, relations).
- **Prisma ORM**: Selected for its type-safe database queries and intuitive schema definition, preventing runtime SQL errors.

### AI Model
- **Google Gemini 1.5 Flash**: Chosen for its high speed, low latency, and cost-effectiveness while maintaining high-quality reasoning for educational content.

### Background Jobs
- **Inngest**: Handles event-driven background tasks (emails, longterm processing) reliably with automatic retries and durable execution.

### Email Service
- **Nodemailer**: A flexible and industry-standard library for sending transactional emails.

### Payment Gateway
- **Polar**: Modern merchant of record platform used for managing subscriptions and handling global tax compliance.

## 4. System Architecture

The system follows a modern **Serverless/Edge-ready architecture** built on the Next.js framework.

1. **Client Layer**: React components handling UI and state.
2. **Server Action Layer**: Validates inputs, checks authentication (NextAuth/Auth.js), and interacts with the database.
3. **Service Layer**:
    - **AI Engine**: Constructs prompts and calls Google Gemini.
    - **Content Engine**: Fetches and verifies YouTube/Documentation links.
4. **Data Layer**: PostgreSQL database managed via Prisma.
5. **Async Worker Layer**: Inngest processes background events (e.g., sending emails after roadmap generation) asynchronously to keep the UI responsive.

**Data Flow**: 
User Input -> Onboarding API -> Input Normalization & Hashing -> DB Cache Check -> (If Miss) Gemini AI -> (If Hit) Fetch Template -> Create User Instance.

## 5. Application Flow

1. **Landing Page**: Users see the value proposition and "Get Started" CTA.
2. **Authentication**: Sign up/Login via Google or Email (NextAuth).
3. **Onboarding**: User fills out a multi-step form (Career Goal, Experience, Time/Day).
4. **Roadmap Generation**:
   - System checks `inputsHash` in `RoadmapTemplate`.
   - If found, instantly clones the template.
   - If new, calls Gemini AI to generate JSON structure, verifies resources, creates a new Template, then clones it.
5. **Dashboard**: User sees their active roadmap, overall progress, and stats.
6. **Progress Tracking**: Users click skills to mark them as "In Progress" or "Completed".
7. **Emails**: Users receive notifications when roadmaps are ready or milestones are reached.
8. **Admin Operations**: Admins can view user stats or ban users via the `/admin` route.

## 6. AI Roadmap Generation

The core engine transforms raw user inputs into structured JSON.

1. **Prompt Engineering**: Inputs (Goal: "Frontend Dev", Level: "Beginner") are injected into a strict system prompt.
2. **Deterministic Output**: The prompt enforces a specific JSON schema (Phrases -> Skills -> Resources) to ensure the UI can always parse the result.
3. **Phase-Based Design**: The AI is instructed to break learning into logical phases (e.g., "Web Fundamentals", "React Ecosystem") rather than a flat list.
4. **Resource Verification**: The system attempts to resolve video titles to real YouTube URLs using the YouTube API, falling back to oEmbed verification, ensuring no broken links.

## 7. Roadmap Caching & Cost Optimization

To prevent redundant API calls and reduce costs:
1. **Input Normalization**: Inputs are standardized (trimmed, lowercased) and hashed (SHA-like).
2. **Template Separation**: The database separates `RoadmapTemplate` (the structure) from `Roadmap` (the user's instance).
3. **Reusability**: If User A and User B request "React Beginner 15min/day", User B gets User A's generated template instantly (0 cost, 0 latency).

## 8. Background Jobs & Email Automation

**Why Background Jobs?**  
Roadmap generation (especially if AI is slow) and third-party email APIs can fail or time out. Decoupling them ensures the user interface never freezes.

**Implementation**:
- **Inngest**: Triggers events like `heatmap/generated` or `user/signup`.
- **Nodemailer**: Consumes these events to send HTML emails.
- **Reliability**: If an email provider fails, Inngest automatically retries the job with exponential backoff.

**Email Types**: Welcome Email, Roadmap Ready, Milestone Reached, Inactivity Reminder.

## 9. Admin Panel

Located at `/admin`, this secure area allows privileged management.
- **User Management**: View user list, check status, ban/delete users.
- **Template Oversight**: View generated AI templates.
- **Security**: Protected by Role-Based Access Control (RBAC) ensuring only users with `role: ADMIN` can access.

## 10. Subscription & Billing

- **Provider**: Polar.sh.
- **Model**: "Free" (Basic Roadmaps) vs "Pro" (Unlimited Generations, Advanced Projects).
- **Sync**: Webhooks from Polar update the local `Subscription` table in real-time when payments succeed or fail.

## 11. Database Design

The Prisma schema is normalized for scale:
- **Separation of Concerns**: `RoadmapTemplate` contains the curriculum (shared). `Roadmap` contains the linkage to a user. `SkillProgress` tracks individual user progress on specific skills.
- **Audit Logging**: `EmailLog` table tracks every email attempt for debugging.
- **Safety**: `Cascade` deletions ensure that if a user is deleted, their personal data is wiped, but the *shared templates* they triggered remain for others.

## 12. Environment Variables

### Authentication
- `AUTH_SECRET`: Secret for session encryption.
- `AUTH_GOOGLE_ID`: Google OAuth Client ID.
- `AUTH_GOOGLE_SECRET`: Google OAuth Client Secret.

### Database
- `DATABASE_URL`: Connection string for PostgreSQL.

### AI & Media
- `GEMINI_API_KEY`: API key for Google Gemini.
- `YOUTUBE_API_KEY`: API key for YouTube Data API.

### Email
- `EMAIL_SERVER_HOST`: SMPT server host.
- `EMAIL_SERVER_PORT`: SMTP port.
- `EMAIL_SERVER_USER`: SMTP username.
- `EMAIL_SERVER_PASSWORD`: SMTP password.
- `EMAIL_FROM`: Default sender address.

### Payments
- `POLAR_ACCESS_TOKEN`: API Key for Polar.
- `POLAR_WEBHOOK_SECRET`: Secret to verify webhook signatures.

## 13. Local Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL (Local or Neon/Supabase)

### Installation
1. Clone the repository.
   ```bash
   git clone <repo-url>
   cd roadmap-generator
   ```
2. Install dependencies.
   ```bash
   npm install
   ```
3. Set up environment variables (copy `.env.example` to `.env`).
4. Initialize the database.
   ```bash
   npx prisma generate
   npx prisma db push
   ```

### Running the App
```bash
npm run dev
```
Visit `http://localhost:3000`.

### Running Background Jobs
In a separate terminal:
```bash
npx inngest-cli@latest dev
```
Open `http://localhost:8288` to view the Inngest dashboard.

## 14. Project Status

- **Implemented**: Core Authentication, AI Roadmap Generation, Caching System, Dashboard UI, Database Schema, Basic Admin Panel.
- **In Progress**: Advanced Analytics, Resume Parsing integration.
- **Planned**: Mobile App (React Native), Community Project Sharing, AI Chatbot Mentor.

## 15. Future Enhancements

- **Resume Analysis**: Upload a PDF resume and get a roadmap to fill skill gaps.
- **GitHub Integration**: Analyze user's GitHub code to suggest projects.
- **Job Recommendations**: Scrape job boards and map skills to open positions.
- **AI Mentor Chatbot**: A side-panel chat for asking questions about specific roadmap topics.

## 16. Academic Relevance

This project demonstrates **Full-Stack Engineering mastery** suitable for final-year evaluation:
- **Complex System Design**: From database normalization to caching strategies.
- **AI Integration**: Practical application of LLMs via prompt engineering and structured outputs.
- **Real-World SaaS Architecture**: Implementation of Auth, Payments, Email, and Background Jobs.
- **Code Quality**: Use of TypeScript, Zod validation, and Modern React patterns.
