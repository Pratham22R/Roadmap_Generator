'use client'

import { useState, useEffect } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { ExternalLinkIcon, PlayCircleIcon, Youtube } from "lucide-react"
import { toggleSkillStatus } from "@/actions/roadmap"
import { motion } from "framer-motion"

type RoadmapProps = {
  roadmap: any
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
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function RoadmapView({ roadmap }: RoadmapProps) {
  // Calculate progress
  const totalSkills = roadmap.phases.reduce((acc: number, phase: any) => acc + phase.skills.length, 0)
  const completedSkills = roadmap.phases.reduce((acc: number, phase: any) =>
    acc + phase.skills.filter((s: any) => s.status === "COMPLETED").length, 0
  )
  const progress = totalSkills === 0 ? 0 : Math.round((completedSkills / totalSkills) * 100)

  return (
    <div className="space-y-8 pb-20">
      {/* Compact Bento Header */}
      <div className="grid md:grid-cols-[1fr_300px] gap-6 mb-8">

        {/* Helper Title Card */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 p-6 md:p-8 flex flex-col justify-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-purple-500/30 bg-purple-500/10 text-purple-300 text-[10px] px-2 py-0.5 uppercase tracking-wider">
                Active Journey
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
              {roadmap.title}
            </h1>
            <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2">
              {roadmap.description}
            </p>
          </div>
        </div>

        {/* Stats Bento Card */}
        <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 flex flex-col justify-between backdrop-blur-md relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Total Progress</p>
                <span className="text-3xl font-bold text-white">{progress}%</span>
              </div>
              <div className="text-right">
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Status</p>
                <span className="text-sm font-medium text-green-400 flex items-center justify-end gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> On Track
                </span>
              </div>
            </div>

            <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              />
            </div>

            <div className="flex justify-between text-xs text-zinc-500 pt-2 border-t border-white/5">
              <span>{completedSkills} / {totalSkills} Skills</span>
              <span>{roadmap.phases.length} Phases</span>
            </div>
          </div>
        </div>
      </div>

      {/* Phases Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6"
      >
        {roadmap.phases.map((phase: any, index: number) => (
          <motion.div key={phase.id} variants={item}>
            <Card className="border-white/5 bg-zinc-900/40 backdrop-blur-md hover:bg-zinc-900/60 transition-colors duration-300">
              <CardHeader className="pb-3 border-b border-white/5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 font-bold text-sm">
                      {index + 1}
                    </div>
                    <CardTitle className="text-lg font-medium text-zinc-200">
                      {phase.title}
                    </CardTitle>
                  </div>
                  <Badge variant="secondary" className="bg-zinc-800 text-zinc-400 hover:bg-zinc-700">
                    {phase.duration}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <Accordion type="single" collapsible className="w-full space-y-2">
                  {phase.skills.map((skill: any) => (
                    <AccordionItem key={skill.id} value={skill.id} className="border border-white/5 rounded-lg bg-black/20 px-3 data-[state=open]:bg-black/40 transition-all duration-200">
                      <div className="flex items-start gap-3">
                        {/* Checkbox OUTSIDE trigger */}
                        <Checkbox
                          checked={skill.status === "COMPLETED"}
                          onCheckedChange={async (checked) => {
                            await toggleSkillStatus(roadmap.id, skill.id, checked as boolean)
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="mt-3 border-zinc-600 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                        />

                        {/* Trigger contains ONLY text */}
                        <AccordionTrigger className="flex-1 hover:no-underline py-3">
                          <span
                            className={`${skill.status === "COMPLETED"
                              ? "line-through text-zinc-500"
                              : "text-zinc-300"
                              } transition-colors`}
                          >
                            {skill.title}
                          </span>
                        </AccordionTrigger>
                      </div>
                      <AccordionContent className="pb-4 pt-2 pl-9">
                        <div className="space-y-4">
                          <p className="text-zinc-400 text-sm leading-relaxed border-l-2 border-zinc-800 pl-3">
                            {skill.description}
                          </p>

                          {skill.resources.length > 0 && (
                            <div className="grid gap-3 pt-2">
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
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

function ResourceCard({ resource }: { resource: any }) {
  // State
  const [isEmbeddable, setIsEmbeddable] = useState<boolean | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [thumbnail, setThumbnail] = useState<string | null>(null)

  const isYoutube = resource.url.includes("youtube.com") || resource.url.includes("youtu.be")
  const videoId = isYoutube ? getVideoId(resource.url) : null

  useEffect(() => {
    if (!isYoutube || !videoId) return

    const checkAvailability = async () => {
      try {
        // 1. Check if High Res Thumbnail exists (Proxy for video availability/quality)
        // We use a simple image load check since fetch might be blocked by CORS for images
        const img = new Image()
        img.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`

        img.onload = async () => {
          // Image loaded -> Likely good video
          setThumbnail(img.src)
          // 2. Double check with oEmbed for strict embeddability permissions
          try {
            const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`)
            if (res.ok) setIsEmbeddable(true)
            else setIsEmbeddable(false)
          } catch {
            // If oEmbed fails network-wise, we treat image success as "Good enough" for now,
            // OR we default to false to be super safe. Let's be safe.
            setIsEmbeddable(false)
          }
        }

        img.onerror = () => {
          // HQ Thumbnail failed -> Likely deleted/private/bad video
          setIsEmbeddable(false)
          setThumbnail(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`) // Fallback for link card
        }

      } catch (e) {
        setIsEmbeddable(false)
      }
    }

    checkAvailability()
  }, [isYoutube, videoId])


  // 1. Iframe Player (Only if confirmed embeddable)
  if (isYoutube && isEmbeddable === true && videoId) {
    if (isPlaying) {
      return (
        <div className="rounded-xl overflow-hidden border border-white/5 bg-black/50 aspect-video relative group shadow-lg">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      )
    }

    // Facade (Thumbnail with Play Button)
    return (
      <div
        onClick={() => setIsPlaying(true)}
        className="rounded-xl overflow-hidden border border-white/5 bg-zinc-900/50 aspect-video relative group shadow-lg cursor-pointer hover:border-white/20 transition-all"
      >
        <img
          src={thumbnail || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
          alt={resource.title}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-full bg-red-600/90 p-4 shadow-xl group-hover:scale-110 transition-transform">
            <PlayCircleIcon className="h-8 w-8 text-white fill-white" />
          </div>
        </div>
        <div className="absolute bottom-4 left-4 right-4 group-hover:translate-y-0 translate-y-2 opacity-0 group-hover:opacity-100 transition-all">
          <p className="text-white text-sm font-medium truncate drop-shadow-md">{resource.title}</p>
        </div>
      </div>
    )
  }

  // 2. Youtube Fallback Link (If not embeddable or check failed)
  if (isYoutube && videoId) {
    // Use efficient HQ thumbnail if oEmbed didn't provide one
    const thumb = thumbnail || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`

    return (
      <a
        href={resource.url}
        target="_blank"
        rel="noreferrer"
        className="block group relative overflow-hidden rounded-xl border border-white/5 bg-zinc-900/50 hover:bg-zinc-900 transition-all"
      >
        <div className="grid grid-cols-[120px_1fr] gap-4">
          {/* Thumbnail Section */}
          <div className="relative h-full min-h-[80px] w-full">
            <img
              src={thumb}
              alt="Video thumbnail"
              className="absolute inset-0 h-full w-full object-cover text-transparent"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-full bg-black/50 p-1.5 backdrop-blur-sm group-hover:bg-red-600 transition-colors">
                <PlayCircleIcon className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="py-3 pr-4 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1.5">
              <Youtube className="h-3.5 w-3.5 text-red-500" />
              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">
                Watch on YouTube
              </span>
            </div>
            <h4 className="text-sm font-medium text-zinc-200 line-clamp-2 leading-snug group-hover:text-white transition-colors">
              {resource.title || "External Video Resource"}
            </h4>
          </div>
        </div>
      </a>
    )
  }

  // 3. Documentation / Other Link
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 transition-all group"
    >
      <div className="p-2 rounded-full bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
        <ExternalLinkIcon className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-medium text-zinc-200 group-hover:text-blue-300 transition-colors">
          {resource.title || "External Resource"}
        </h4>
        <p className="text-xs text-zinc-500 truncate opacity-60 group-hover:opacity-100 transition-opacity">{resource.url}</p>
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
