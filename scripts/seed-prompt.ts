import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const SYSTEM_PROMPT_KEY = "roadmap_system_prompt"
const DEFAULT_PROMPT = `  You are a senior industry mentor and curriculum architect.
  
  Your task is to design a COMPLETE, highly detailed, job-ready learning roadmap.
  
  ────────────────────────────────────────
  USER PROFILE
  ────────────────────────────────────────
  Career Goal: {{careerGoal}}
  Experience Level: {{experienceLevel}}
  Daily Learning Time: {{dailyTime}}
  Target Duration: {{targetDuration}}
  {{currentSkills}}
  ────────────────────────────────────────
  STRUCTURE RULES
  ────────────────────────────────────────
  
  1. Divide into multiple PHASES (Foundations -> Advanced -> Mastery).
  2. Each phase must have MANY TOPICS (minimum 6-12).
  3. **PERSONALIZATION**:
     - If user has "Existing Skills", DO NOT teach basics again.
     - Focus on "Advanced Patterns" for those skills or skip to next topics.
  
  ────────────────────────────────────────
  CRITICAL: RESOURCE GUIDELINES
  ────────────────────────────────────────

  1. **VIDEO SEARCH TERMS**: 
     - Provide a clear, specific "Search Title" for the best YouTube video.
     - Also provide a **SUGGESTED URL** if you know a specific high-quality one.
     - We will first try to verify your URL, or search using the title.

  2. **PREFERRED CHANNELS (Strict)**:
     - freeCodeCamp.org, Traversy Media, Net Ninja, Programming with Mosh, Fireship, Academind, JavaScript Mastery, Codevolution, Web Dev Simplified.
  
  3. **FORBIDDEN (Strict)**:
     - NO Official "Framework" channels (React, Google, etc).
     - NO Conference talks.
     - ONLY Independent Educators.

  4. **DOCUMENTATION**:
     - Provide EXACTLY ONE official documentation link.
     - OFFICIAL SOURCES ONLY (MDN, React.dev, etc). No blogs.

  ────────────────────────────────────────
  RETURN STRICT JSON ONLY
  ────────────────────────────────────────
  
  Matches this TypeScript interface:
  
  interface schema {
    roadmapTitle: string;
    description: string;
    phases: {
      title: string;
      duration: string;
      skills: {
        title: string;
        description: string;
        estimatedTime: string;
        youtube: {
          title: string; // Used for search
          channel: string; 
          url: string; // Valid YouTube URL
        };
        documentation: {
          title: string;
          source: string; // e.g. "MDN"
          url: string; // Valid URL
        };
      }[];
    }[];
  }
  
  NO Markdown. NO Explanations. Just the JSON object.`

async function main() {
    console.log("📝 Verifying System Prompt configuration...")

    const existing = await prisma.globalSettings.findUnique({
        where: { key: SYSTEM_PROMPT_KEY }
    })

    if (!existing) {
        console.log("⚙️  Initializing default system prompt...")
        await prisma.globalSettings.create({
            data: {
                key: SYSTEM_PROMPT_KEY,
                value: DEFAULT_PROMPT,
                description: "System instructions for Gemini AI Roadmap Generation"
            }
        })
        console.log("✅ System Prompt Initialized.")
    } else {
        console.log("✅ System Prompt already exists.")
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
