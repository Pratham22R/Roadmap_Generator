# Internal Developer Documentation: AI Skill Roadmap Generator

**Version**: 1.0.0
**Last Updated**: February 2026
**Tech Stack**: Next.js 16, TypeScript, Tailwind CSS, Prisma, Gemini AI, Inngest, Polar, Nodemailer.

---

## 1. Project Architecture Overview

This project is a **Next.js 16 SaaS application** using the **App Router**. It follows a monolithic architecture specifically designed for serverless deployment (Vercel).

### Key Architectural Patterns
*   **Full-Stack Next.js**: Both frontend and backend logic reside in `src/app`.
*   **Server Actions**: We primarily use Server Actions (`src/actions`) for mutations (form submissions, updates) instead of traditional API routes, to ensure type safety and reduce boilerplate.
*   **Event-Driven Background Jobs**: Heavy tasks (emails, long-running AI processes) are offloaded to **Inngest** to avoid server timeouts and improve user experience.
*   **Service Layer Pattern**: Core business logic is encapsulated in `src/lib` (e.g., `src/lib/ai`, `src/lib/email.ts`) rather than being scattered in UI components.
*   **Database First**: The schema is defined in **Prisma**, serving as the single source of truth for data models.

---

## 2. Folder Structure Breakdown

The project sources are located in the `src/` directory.

```text
src/
├── actions/            # Server Actions (Mutations & Data logic)
│   ├── onboarding.ts   # Onboarding form submission
│   ├── roadmap.ts      # Roadmap & skill status updates
│   └── ...
├── app/                # Next.js App Router (Pages & API Routes)
│   ├── admin/          # Admin Panel (Protected)
│   ├── api/            # API Routes (Webhooks, Auth, Inngest)
│   ├── dashboard/      # User Dashboard
│   ├── onboarding/     # Onboarding Flow
│   └── layout.tsx      # Root layout
├── components/         # React Components
│   ├── admin/          # Admin-specific UI
│   ├── onboarding/     # Onboarding forms
│   └── ui/             # Reusable UI primitives (Shadcn/UI)
├── lib/                # Core Business Logic & Utilities
│   ├── ai/             # Gemini AI Logic
│   ├── email/          # Email functions & templates
│   ├── inngest/        # Background Job Definitions
│   └── prisma.ts       # Database Client
├── prisma/             # Database Schema
│   └── schema.prisma   # PostgreSQL Schema
└── public/             # Static Assets
```

---

## 3. Authentication System

Authentication is handled by **Auth.js (NextAuth v5)**. It supports OAuth (Google, GitHub) and manages sessions via JWT.

### Key Files
*   **Config**: `src/auth.config.ts`
    *   Defines providers and pages.
*   **Initialization**: `src/auth.ts`
    *   Exports `auth`, `signIn`, `signOut`.
*   **Middleware**: `src/middleware.ts`
    *   Protects routes (`/dashboard`, `/admin`) and redirects unauthenticated users.
*   **API Route**: `src/app/api/auth/[...nextauth]/route.ts` (Managed via library exports)
*   **Database Models**: `User`, `Account`, `Session` in `schema.prisma`.

### Flow
1.  User clicks "Sign In".
2.  Redirected to provider (Google/GitHub).
3.  Callback processed by `src/app/api/auth/...`.
4.  Session created in DB + JWT cookie set.
5.  `middleware.ts` verifies token on navigation.

---

## 4. Onboarding & Personalization

The onboarding flow collects user preferences to generate a personalized roadmap.

### Key Files
*   **Page**: `src/app/onboarding/page.tsx`
    *   Renders the multi-step form.
*   **Components**: `src/components/onboarding/onboarding-flow.tsx`
    *   Client-side state for the wizard.
*   **Server Action**: `src/actions/onboarding.ts` (`submitOnboarding`)
    *   Validates input with Zod.
    *   Checks subscription limits.
    *   Saves `OnboardingProfile` to DB.
    *   **Triggers AI Generation**.
*   **Database Model**: `OnboardingProfile`.

---

## 5. Skill Gap & Career Engine

The system maps users to specific Career Roles (e.g., "Frontend Developer") to determine missing skills.

### Key Files
*   **Schema**: `CareerRole`, `RoleSkill`, `Skill` in `prisma/schema.prisma`.
*   **Logic**:
    *   Roles and default skills are seeded or managed via Admin.
    *   During onboarding, selected "Current Skills" are compared against the target logic (handled in the AI Prompt mainly, but supported by DB data).
*   **Admin Management**: `src/app/admin/career-roles` (implied).

---

## 6. AI Roadmap Generation (Gemini)

This is the core engine. It uses Google's Gemini 2.5 Flash to generate structured JSON roadmaps.

### Key Files
*   **Generator**: `src/lib/ai/roadmap-generator.ts`
    *   **Purpose**: Main orchestration function `generateRoadmap`.
*   **Utils**: `src/lib/ai/roadmap-utils.ts`
    *   **Purpose**: Input normalization and hash generation.
*   **Trigger**: Called from `src/actions/onboarding.ts`.

### Full Flow
1.  **User Submits**: `submitOnboarding` calls `generateRoadmap`.
2.  **Normalization**: Inputs (Goal, Experience, Time) are normalized and hashed.
3.  **Cache Check**: Code checks `RoadmapTemplate` for `inputsHash`.
    *   *Hit*: Clones existing template.
    *   *Miss*: Calls Gemini API.
4.  **Prompt Construction**: `src/lib/ai/roadmap-generator.ts` builds a prompt using `roadmap_system_prompt` (from DB) or a fallback string.
5.  **Gemini Call**: Requests JSON output.
6.  **Parsing**: Validates response with `Zod` schemas.
7.  **YouTube Enrichment**: For each skill, the system searches YouTube API (or uses oEmbed) to find real video links.
8.  **Persist**: Saves `RoadmapTemplate` -> `TemplatePhase` -> `TemplateSkill`.
9.  **Instantiation**: Creates a user-specific `Roadmap` linked to the template.

---

## 7. Roadmap Caching & Template Reuse

To save AI costs and speed up generation, identical inputs reuse generated roadmaps.

### Key Files
*   **Hash Logic**: `src/lib/ai/roadmap-utils.ts` (`generateTemplateHash`)
*   **Schema**: `RoadmapTemplate` table (`inputsHash` unique index).
*   **Implementation**: `src/lib/ai/roadmap-generator.ts` (Lines 63-81).

### Logic
1.  Inputs are sorted and lowercased.
2.  SHA-256 hash (or similar) is generated.
3.  DB lookup: `prisma.roadmapTemplate.findUnique({ where: { inputsHash } })`.

---

## 8. YouTube Resource Integration

The AI suggests search terms, and the system resolves them to actual playable URLs.

### Key Files
*   **Search Logic**: `src/lib/ai/roadmap-generator.ts` (`searchYouTube` function).
*   **Schema**: `TemplateResource` (stores Title, URL, Thumbnail).
*   **Whitelist/Blacklist**: `YouTubeChannel` model (in schema).

### Flow
1.  AI returns: `{"title": "Learn React", "channel": "Fireship"}`
2.  `searchYouTube` calls Google YouTube Data API.
    *   *Fallback*: If API fails/limit reached, tries oEmbed or generates a search result URL.
3.  Thumbnail and Video ID are stored in `TemplateResource`.

---

## 9. Dashboard & Progress Tracking

The user hub for viewing active roadmaps and tracking progress.

### Key Files
*   **Page**: `src/app/dashboard/page.tsx`
*   **Action**: `src/actions/roadmap.ts` (`toggleSkillStatus`)
    *   Updates `SkillProgress` status.
    *   Logs entry in `ProgressLog`.
*   **Database**: `SkillProgress` (links `Roadmap` and `TemplateSkill`).

---

## 10. Background Jobs (Inngest)

We use Inngest for reliable event-driven task execution (e.g., sending emails asynchronously).

### Key Files
*   **Client**: `src/lib/inngest/client.ts`
*   **Functions**: `src/lib/inngest/functions/`
    *   `welcome-email.ts`: Sends welcome email on signup.
    *   `roadmap-email.ts`: Sends email when roadmap is ready.
*   **API Route**: `src/app/api/inngest/route.ts` (Entry point for Inngest executor).

### Flow
1.  Code calls `inngest.send({ name: "roadmap/generated", data: ... })` (e.g., in `roadmap-generator.ts`).
2.  Inngest receives event.
3.  Inngest calls back `src/app/api/inngest`.
4.  `functions/roadmap-email.ts` executes and sends the email.

---

## 11. Email System (Nodemailer)

Transactional emails are sent via SMTP (Nodemailer).

### Key Files
*   **Service**: `src/lib/email.ts` (`sendEmail` function).
*   **Templates**: `src/lib/email-templates.ts` (or individual ts files in `lib/email`).
*   **Trigger**: Usually via Inngest functions.

### Flow
Inngest Function -> `lib/email.ts` -> SMTP Server -> User Inbox.

---

## 12. Admin Panel

Restricted area for managing app content.

### Key Files
*   **Root**: `src/app/admin`
*   **Layout**: `src/app/admin/layout.tsx`
    *   **Protection**: Checks `session.user.role === "ADMIN"`.
*   **Middleware**: `src/middleware.ts` (Double protection).
*   **Features**:
    *   `/admin/users`: User management.
    *   `/admin/career-roles`: Manage career paths.
    *   `/admin/email-templates`: Edit email content.

---

## 13. Subscription System (Polar)

Handles billing and premium features using Polar.

### Key Files
*   **Webhook Handler**: `src/app/api/webhooks/polar/route.ts`
    *   **Purpose**: Listens for `checkout.succeeded` and `subscription.*` events.
    *   Updates `Subscription` model in DB.
*   **Service**: `src/lib/polar.ts`.
*   **Database**: `Subscription`, `PolarWebhookEvent`.

### Flow
1.  User pays on Polar.
2.  Polar sends webhook to `/api/webhooks/polar`.
3.  Route verifies and updates user status to `PREMIUM`.
4.  `submitOnboarding` checks `Subscription` status before allowing generation.

---

## 14. Database Design

The `prisma/schema.prisma` file defines our data structure.

### Major Models
*   **User / Account**: Identity.
*   **RoadmapTemplate**: The "Master" copy of a generated roadmap (Cached).
*   **Roadmap**: The "Instance" copy for a specific user.
*   **TemplatePhase / TemplateSkill**: Structure of the roadmap.
*   **SkillProgress**: User's tracking state on a skill.
*   **CareerRole**: Definitions for the career engine.

---

## 15. Environment Variables

Create a `.env` file with the following:

### Groups
*   **Database**: `DATABASE_URL` (Postgres connection string).
*   **Auth**: `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`.
*   **AI**: `GEMINI_API_KEY`, `YOUTUBE_API_KEY`.
*   **Email**: `EMAIL_SERVER_HOST`, `EMAIL_SERVER_PORT`, `EMAIL_SERVER_USER`, `EMAIL_SERVER_PASSWORD`, `EMAIL_FROM`.
*   **Services**: `INNGEST_SIGNING_KEY`, `INNGEST_EVENT_KEY`, `POLAR_ACCESS_TOKEN`.

---

## 16. End-to-End Data Flow

**Scenario: User Signs Up and Generates a Roadmap**

1.  **User** logs in via Google (Auth.js).
2.  **User** lands on `/dashboard`, redirected to `/onboarding` (Middleware).
3.  **User** fills form -> Clicks "Generate".
4.  **Frontend** calls Server Action `submitOnboarding`.
5.  **Backend** checks `RoadmapTemplate` cache.
    *   *If miss*: Calls **Gemini AI**, parses JSON, fetches **YouTube** links, saves new Template to DB.
6.  **Backend** creates `Roadmap` instance for User.
7.  **Backend** emits `roadmap/generated` event to **Inngest**.
8.  **Inngest** triggers email function -> generic "Your roadmap is ready" email sent via **Nodemailer**.
9.  **Frontend** receives `roadmapId` and redirects user to `/dashboard/roadmap/[id]`.
10. **User** sees roadmap, checks off a skill -> `toggleSkillStatus` updates `SkillProgress` in DB.
