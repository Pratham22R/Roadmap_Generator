'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { ExternalLinkIcon, PlayCircleIcon, Youtube, CheckCircle2, Clock, Trophy } from "lucide-react"
import { toggleSkillStatus } from "@/actions/roadmap"
import { motion } from "framer-motion"

type RoadmapProps = {
  roadmap: any
  streak?: number
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
}

export default function RoadmapView({ roadmap, streak = 0 }: RoadmapProps) {
  // Calculate progress
  const totalSkills = roadmap.phases.reduce((acc: number, phase: any) => acc + phase.skills.length, 0)
  const completedSkills = roadmap.phases.reduce((acc: number, phase: any) =>
    acc + phase.skills.filter((s: any) => s.status === "COMPLETED").length, 0
  )
  const progress = totalSkills === 0 ? 0 : Math.round((completedSkills / totalSkills) * 100)

  return (
    <div className="space-y-8 pb-20">
      {/* Premium Header Section - Row 1 */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">

        {/* Title Card - Takes 2/3 */}
        <div className="md:col-span-2 relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-center">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full blur-3xl opacity-60 pointer-events-none -mr-20 -mt-20" />

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 font-medium px-3 py-1 rounded-full text-xs uppercase tracking-wide">
                Interactive Roadmap
              </Badge>
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {roadmap.title}
              </h1>
              <p className="text-slate-500 mt-4 text-lg leading-relaxed max-w-2xl">
                {roadmap.description}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Card - Takes 1/3 */}
        <div className="md:col-span-1 rounded-3xl border border-slate-200 bg-white p-5 flex flex-col shadow-sm relative overflow-hidden group">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50/80 to-transparent pointer-events-none" />

          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Overall Progress</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-5xl font-extrabold text-slate-900 tracking-tight">{progress}%</span>
                    <span className="text-sm text-slate-500 font-medium">completed</span>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center text-green-600 shadow-sm border border-green-100">
                  <Trophy className="h-5 w-5" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="h-3.5 w-full bg-slate-100/80 rounded-full overflow-hidden border border-slate-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.2, ease: "circOut" }}
                    className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.4)]"
                  />
                </div>
              </div>
            </div>

            <div className="py-4">
              {/* Premium Streak Display */}
              <div className="w-full bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 rounded-2xl p-0.5 shadow-sm">
                <div className="bg-white/40 backdrop-blur-sm rounded-[14px] p-4 flex items-center justify-between border border-orange-100/50">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Learning Streak</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-black text-orange-600 tracking-tight">{streak}</span>
                      <span className="text-xs font-semibold text-orange-400">Days Fire</span>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-orange-400 blur-xl opacity-20 animate-pulse rounded-full" />
                    <div className="h-12 w-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200 text-white relative z-10 rotate-3 transition-transform group-hover:rotate-6">
                      <span className="text-2xl drop-shadow-md">🔥</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-400">
              <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-full border border-slate-100">
                <Clock className="w-3.5 h-3.5" />
                <span>Self-paced</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-full border border-emerald-100 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Active Journey</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resume Capabilities - Row 2 (Full Width) */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm mb-12">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-50" />
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10">
          <div className="flex-shrink-0 p-4 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                Resume Capabilities
              </h3>
              <p className="text-slate-500 text-sm mt-1">
                Key technologies you will master. Phase completion unlocks the verified badge.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {roadmap.phases.map((phase: any) => {
                // Check if all skills in this phase are completed
                const isPhaseCompleted = phase.skills.every((s: any) => s.status === 'COMPLETED')

                return (
                  <Badge
                    key={phase.id}
                    variant="secondary"
                    className={`px-3 py-1.5 text-sm border transition-all duration-300 cursor-default font-bold
                                        ${isPhaseCompleted
                        ? 'bg-green-50 text-green-700 border-green-200 shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 group-hover:border-slate-300'
                      }`}
                  >
                    {isPhaseCompleted && <span className="mr-1.5 text-green-600">✓</span>}
                    {phase.title}
                  </Badge>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Phases List */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {roadmap.phases.map((phase: any, index: number) => (
          <motion.div key={phase.id} variants={item}>
            <div className="relative pl-0 md:pl-4">
              {/* Timeline Connector (Desktop Only) */}
              {index !== roadmap.phases.length - 1 && (
                <div className="absolute left-[35px] top-14 bottom-[-24px] w-px bg-slate-200 hidden md:block" />
              )}

              <div className="flex flex-col md:flex-row gap-6">
                {/* Phase Indicator */}
                <div className="hidden md:flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-xl font-bold text-slate-900 z-10">
                    {index + 1}
                  </div>
                </div>

                {/* Phase Content */}
                <Card className="flex-1 border-slate-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                  <CardHeader className="border-b border-slate-100 bg-slate-50/50 py-4 px-6">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3 md:hidden">
                        <span className="text-sm font-bold text-slate-400">#{index + 1}</span>
                        <CardTitle className="text-lg font-bold text-slate-900">{phase.title}</CardTitle>
                      </div>
                      <CardTitle className="hidden md:block text-lg font-bold text-slate-900">{phase.title}</CardTitle>
                      <Badge variant="secondary" className="bg-white text-slate-600 border border-slate-200 shadow-sm text-xs">
                        {phase.duration}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0">
                    <Accordion type="single" collapsible className="w-full">
                      {phase.skills.map((skill: any, idx: number) => (
                        <AccordionItem
                          key={skill.id}
                          value={skill.id}
                          className="border-b border-slate-100 last:border-0 px-6 data-[state=open]:bg-slate-50/50 transition-colors"
                        >
                          <div className="flex items-center gap-4 py-4">
                            <Checkbox
                              checked={skill.status === "COMPLETED"}
                              onCheckedChange={async (checked) => {
                                await toggleSkillStatus(roadmap.id, skill.id, checked as boolean)
                              }}
                              className="h-5 w-5 border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 rounded-md transition-all"
                            />

                            <AccordionTrigger className="flex-1 py-0 hover:no-underline font-medium text-slate-700 hover:text-blue-600 text-left">
                              <span className={skill.status === "COMPLETED" ? "line-through text-slate-400" : ""}>
                                {skill.title}
                              </span>
                            </AccordionTrigger>
                          </div>

                          <AccordionContent className="pl-9 pb-6 pt-0">
                            <div className="space-y-4">
                              <p className="text-slate-500 text-sm leading-relaxed">
                                {skill.description}
                              </p>

                              {skill.resources.length > 0 && (
                                <div className="grid gap-3 pt-2">
                                  <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Recommended Resources</h4>
                                  {skill.resources.map((resource: any) => (
                                    <ResourceCard key={resource.id} resource={resource} />
                                  ))}
                                </div>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

function ResourceCard({ resource }: { resource: any }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const isYoutube = resource.url.includes("youtube.com") || resource.url.includes("youtu.be")
  const videoId = isYoutube ? getVideoId(resource.url) : null

  // Iframe Player
  if (isYoutube && videoId) {
    if (isPlaying) {
      return (
        <div className="rounded-xl overflow-hidden border border-slate-200 bg-black aspect-video relative shadow-sm w-full md:w-[480px]">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      )
    }

    return (
      <div
        onClick={() => setIsPlaying(true)}
        className="group relative aspect-video w-full md:w-[480px] cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm transition-all hover:shadow-md"
      >
        <img
          src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
          alt="Video thumbnail"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors group-hover:bg-black/20">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
            <PlayCircleIcon className="h-6 w-6 text-slate-900 ml-0.5" />
          </div>
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-md">
            <Youtube className="h-3 w-3 text-red-500" />
            <span>Watch Video</span>
          </div>
        </div>
      </div>
    )
  }

  // Generic Link
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/50 transition-all group hover:shadow-sm"
    >
      <div className="p-2 rounded-lg bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
        <ExternalLinkIcon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-slate-700 group-hover:text-blue-700 transition-colors truncate">
          {resource.title || "External Resource"}
        </h4>
        <p className="text-xs text-slate-400 truncate group-hover:text-blue-400/80">{resource.url}</p>
      </div>
    </a>
  )
}

function getVideoId(url: string) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}
