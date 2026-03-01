import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getPrisma } from "@/lib/prisma";
import { GoogleGenAI } from "@google/genai";
import { getResumeSkillExtractionPrompt } from "@/lib/ai/prompts/resumeSkillExtraction";
import { normalizeSkills } from "@/lib/skills/normalizer";
// @ts-ignore
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth";
import { z } from "zod";

const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        const userId = session?.user?.id;

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("resume") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // 1. Validations
        const MAX_SIZE = 5 * 1024 * 1024; // 5MB limit
        if (file.size > MAX_SIZE) {
            return NextResponse.json({ error: "File exceeds 5MB limit" }, { status: 400 });
        }

        const validTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/msword",
        ];

        if (!validTypes.includes(file.type) && !file.name.endsWith('.pdf') && !file.name.endsWith('.docx')) {
            return NextResponse.json({ error: "Invalid file type. Only PDF and DOCX are supported." }, { status: 400 });
        }

        // 2. Extract Text
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        let rawText = "";

        if (file.type === "application/pdf" || file.name.endsWith('.pdf')) {
            const pdfData = await pdfParse(buffer);
            rawText = pdfData.text;
        } else {
            const result = await mammoth.extractRawText({ buffer });
            rawText = result.value;
        }

        if (!rawText || rawText.trim().length === 0) {
            return NextResponse.json({ error: "Could not extract text from the document" }, { status: 400 });
        }

        // 3. Extract Skills via Gemini
        const prompt = getResumeSkillExtractionPrompt(rawText);
        const aiResult = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            config: { responseMimeType: "application/json" },
            contents: [{ role: "user", parts: [{ text: prompt }] }],
        });

        const aiText = aiResult.text;
        if (!aiText) {
            throw new Error("Gemini returned empty response");
        }

        // 4. Parse & Normalize
        let extractedSkills: string[] = [];
        try {
            const jsonStr = aiText.replace(/^```json/, "").replace(/```$/, "").trim();
            const parsed = JSON.parse(jsonStr);
            if (!Array.isArray(parsed)) throw new Error("Output is not an array");
            extractedSkills = z.array(z.string()).parse(parsed);
        } catch (err) {
            console.error("Skill extraction parsing failed:", err);
            return NextResponse.json({ error: "Failed to parse skills from resume" }, { status: 500 });
        }

        const normalizedSkills = normalizeSkills(extractedSkills);

        // 5. Save to DB
        const prisma = getPrisma();
        await prisma.$transaction(async (tx) => {
            await tx.resume.create({
                data: {
                    userId,
                    rawText: rawText.substring(0, 10000), // Cap length
                    extractedSkills,
                    normalizedSkills,
                },
            });

            await tx.user.update({
                where: { id: userId },
                data: {
                    resumeUploaded: true,
                    resumeProcessed: true,
                },
            });
        });

        return NextResponse.json({ success: true, skills: normalizedSkills });
    } catch (error) {
        console.error("Resume Upload Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
