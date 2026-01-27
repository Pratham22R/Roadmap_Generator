-- AlterTable
ALTER TABLE "Roadmap" ADD COLUMN     "templateId" TEXT;

-- CreateTable
CREATE TABLE "RoadmapTemplate" (
    "id" TEXT NOT NULL,
    "inputsHash" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoadmapTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemplatePhase" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "duration" TEXT,

    CONSTRAINT "TemplatePhase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemplateSkill" (
    "id" TEXT NOT NULL,
    "phaseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "estimatedTime" TEXT,

    CONSTRAINT "TemplateSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemplateResource" (
    "id" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnail" TEXT,
    "type" TEXT NOT NULL DEFAULT 'VIDEO',

    CONSTRAINT "TemplateResource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillProgress" (
    "id" TEXT NOT NULL,
    "roadmapId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "status" "SkillStatus" NOT NULL DEFAULT 'PENDING',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkillProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RoadmapTemplate_inputsHash_key" ON "RoadmapTemplate"("inputsHash");

-- CreateIndex
CREATE UNIQUE INDEX "SkillProgress_roadmapId_skillId_key" ON "SkillProgress"("roadmapId", "skillId");

-- AddForeignKey
ALTER TABLE "Roadmap" ADD CONSTRAINT "Roadmap_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "RoadmapTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplatePhase" ADD CONSTRAINT "TemplatePhase_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "RoadmapTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateSkill" ADD CONSTRAINT "TemplateSkill_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "TemplatePhase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateResource" ADD CONSTRAINT "TemplateResource_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "TemplateSkill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillProgress" ADD CONSTRAINT "SkillProgress_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "Roadmap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillProgress" ADD CONSTRAINT "SkillProgress_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "TemplateSkill"("id") ON DELETE CASCADE ON UPDATE CASCADE;
