import { getPrisma } from "@/lib/prisma"
import { GoogleGenAI } from "@google/genai"
import { google } from "googleapis"
import { inngest } from "@/lib/inngest/client"
import { normalizeInputs, generateTemplateHash, type RoadmapRequest } from "./roadmap-utils"
import { z } from "zod"

/* -------------------- AI SETUP -------------------- */

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
})

const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
})

/* -------------------- ZOD SCHEMAS -------------------- */
// We relax the URL requirement since we'll fetch it ourselves
const YouTubeResourceSchema = z.object({
  title: z.string(),
  channel: z.string().optional(),
  url: z.string().optional(),
})

const DocResourceSchema = z.object({
  title: z.string(),
  source: z.string(),
  url: z.string().url()
})

const SkillSchema = z.object({
  title: z.string(),
  description: z.string(),
  estimatedTime: z.string(),
  youtube: YouTubeResourceSchema,
  documentation: DocResourceSchema,
})

const PhaseSchema = z.object({
  title: z.string(),
  duration: z.string(),
  skills: z.array(SkillSchema)
})

const RoadmapSchema = z.object({
  roadmapTitle: z.string(),
  description: z.string(),
  phases: z.array(PhaseSchema)
})

type AIRoadmap = z.infer<typeof RoadmapSchema>

/* -------------------- MAIN FUNCTION -------------------- */

export async function generateRoadmap(
  userId: string,
  request: RoadmapRequest
) {
  const prisma = getPrisma()

  /* -------------------- 1. NORMALIZE & HASH -------------------- */
  const normalizedInput = normalizeInputs(request)
  const templateHash = generateTemplateHash(normalizedInput)

  /* -------------------- 2. CACHE CHECK -------------------- */
  const existingTemplate = await prisma.roadmapTemplate.findUnique({
    where: { inputsHash: templateHash },
    include: {
      phases: {
        include: { skills: true }
      }
    }
  })

  // CACHE HIT
  if (existingTemplate) {
    console.log("✅ CACHE HIT: Reusing template", existingTemplate.id)
    return createRoadmapFromTemplate(prisma, userId, existingTemplate.id, existingTemplate.title, existingTemplate.description ?? "")
  }

  /* -------------------- 3. GENERATION (CACHE MISS) -------------------- */
  console.log("⚠️ CACHE MISS: Calling Gemini...")

  /* -------------------- 3. GENERATION (CACHE MISS) -------------------- */
  console.log("⚠️ CACHE MISS: Calling Gemini...")

  // Fetch dynamic system prompt
  const systemPromptSetting = await prisma.globalSettings.findUnique({
    where: { key: "roadmap_system_prompt" }
  })

  let basePrompt = systemPromptSetting?.value || ""

  // Fallback if DB is empty for some reason
  if (!basePrompt) {
    basePrompt = `You are a senior industry mentor and curriculum architect.
  
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
  }

  // Inject variables
  const prompt = basePrompt
    .replace("{{careerGoal}}", request.careerGoal)
    .replace("{{experienceLevel}}", request.experienceLevel)
    .replace("{{dailyTime}}", request.dailyTime)
    .replace("{{targetDuration}}", request.targetDuration)
    .replace("{{currentSkills}}", request.currentSkills?.length ? `Existing Skills: ${request.currentSkills.join(", ")}` : "")

  const result = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    config: {
      responseMimeType: "application/json",
    },
    contents: [{
      role: "user",
      parts: [{ text: prompt }]
    }]
  })

  const rawText = result.text ?? ""
  if (!rawText) throw new Error("Gemini returned empty response")

  /* -------------------- 4. PARSE & VALIDATE -------------------- */
  let aiData: AIRoadmap
  try {
    const jsonStr = rawText.replace(/^```json/, '').replace(/```$/, '').trim()
    const parsed = JSON.parse(jsonStr)
    aiData = RoadmapSchema.parse(parsed)
  } catch (error) {
    console.error("❌ JSON Validation Failed:", error)
    if (error instanceof z.ZodError) {
      console.error("Zod Issues:", error.issues)
    }

    throw new Error("AI returned invalid JSON structure")
  }

  /* -------------------- 5. PERSIST TEMPLATE (WITH API FETCH) -------------------- */
  const savedTemplate = await prisma.$transaction(async (tx) => {
    // Double check cache in case of race condition
    const raceCheck = await tx.roadmapTemplate.findUnique({ where: { inputsHash: templateHash } })
    if (raceCheck) return raceCheck;

    // Create Template
    const template = await tx.roadmapTemplate.create({
      data: {
        inputsHash: templateHash,
        title: aiData.roadmapTitle,
        description: aiData.description,
      }
    })

    // Create Phases & Skills
    for (const [phaseIdx, phase] of aiData.phases.entries()) {
      const dbPhase = await tx.templatePhase.create({
        data: {
          templateId: template.id,
          title: phase.title,
          duration: phase.duration,
          order: phaseIdx + 1
        }
      })

      // Parallelize Skills & YouTube processing
      const skillPromises = phase.skills.map(async (skill) => {
        const dbSkill = await tx.templateSkill.create({
          data: {
            phaseId: dbPhase.id,
            title: skill.title,
            description: skill.description,
            estimatedTime: skill.estimatedTime,
          }
        })

        // ⭐ FETCH REAL YOUTUBE VIDEO (or Verify AI Link) ⭐
        const videoData = await searchYouTube(skill.youtube.title || skill.title, skill.youtube.url)

        await tx.templateResource.createMany({
          data: [
            {
              skillId: dbSkill.id,
              title: videoData.title,
              url: videoData.url,
              thumbnail: videoData.thumbnail,
              type: "VIDEO",
            },
            {
              skillId: dbSkill.id,
              title: skill.documentation.title,
              url: skill.documentation.url,
              type: "ARTICLE"
            }
          ]
        })
      })

      await Promise.all(skillPromises)
    }

    return template
  }, {
    maxWait: 10000,
    timeout: 60000 // Extended timeout for API calls
  })


  /* -------------------- 6. CREATE USER INSTANCE -------------------- */
  return createRoadmapFromTemplate(prisma, userId, savedTemplate.id, savedTemplate.title, savedTemplate.description ?? "")
}


/* -------------------- HELPER: YOUTUBE SEARCH + OEMBED FALLBACK -------------------- */
async function searchYouTube(query: string, fallbackUrl?: string) {
  // 1. Try API First
  try {
    if (process.env.YOUTUBE_API_KEY) {
      const response = await youtube.search.list({
        part: ["snippet"],
        q: query,
        maxResults: 1,
        type: ["video"],
        videoEmbeddable: "true",
        safeSearch: "moderate"
      })

      const video = response.data.items?.[0]
      if (video && video.id?.videoId) {
        return {
          title: video.snippet?.title || query,
          url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
          thumbnail: video.snippet?.thumbnails?.high?.url || video.snippet?.thumbnails?.default?.url || ""
        }
      }
    }
  } catch (error) {
    console.warn(`⚠️ YouTube API Failed for "${query}" (Quota or Error). Trying oEmbed fallback...`)
  }

  // 2. Try oEmbed Verification of fallback URL
  if (fallbackUrl && (fallbackUrl.includes("youtube.com") || fallbackUrl.includes("youtu.be"))) {
    try {
      const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(fallbackUrl)}&format=json`
      const res = await fetch(oembedUrl)
      if (res.ok) {
        // Verified!
        const data = await res.json()
        return {
          title: data.title || query,
          url: fallbackUrl,
          thumbnail: data.thumbnail_url || ""
        }
      }
    } catch {
      // Ignore oembed error
    }
  }

  // 3. Final Fallback: Search Link
  return {
    title: query,
    url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
    thumbnail: ""
  }
}


/* -------------------- HELPER: INSTANCE CREATOR -------------------- */
async function createRoadmapFromTemplate(
  prisma: ReturnType<typeof getPrisma>,
  userId: string,
  templateId: string,
  title: string,
  description: string
) {
  // 1. Create Roadmap
  const roadmap = await prisma.roadmap.create({
    data: {
      userId,
      templateId,
      title,
      description,
      status: "ACTIVE",
    },
    include: {
      template: { include: { phases: { include: { skills: true } } } }
    }
  })

  // 2. Initialize Progress
  // Only flattened skills need tracking
  const skillsToTrack = roadmap.template?.phases.flatMap(p => p.skills) || []

  if (skillsToTrack.length > 0) {
    await prisma.skillProgress.createMany({
      data: skillsToTrack.map(s => ({
        roadmapId: roadmap.id,
        skillId: s.id,
        status: "PENDING"
      }))
    })
  }

  // 3. Async Email (Fire and forget)
  triggerRoadmapEmail(userId, title, roadmap.id).catch(console.error)

  return roadmap
}

async function triggerRoadmapEmail(userId: string, roadmapTitle: string, roadmapId: string) {
  const prisma = getPrisma()
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true }
  })

  if (user?.email) {
    await inngest.send({
      name: "roadmap/generated",
      data: {
        userId,
        email: user.email,
        roadmapTitle,
        roadmapId
      }
    })
  }
}

