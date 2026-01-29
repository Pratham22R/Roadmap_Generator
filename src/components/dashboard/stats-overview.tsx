"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Activity, BarChart3, CheckCircle2, Flame, Layers, Target, TrendingUp, Zap } from "lucide-react"

type StatsOverviewProps = {
    totalRoadmaps: number
    completedSkills: number
    totalSkills: number
    weeklyActivity: { date: string; count: number }[]
    streak: number
}

export function StatsOverview({
    totalRoadmaps,
    completedSkills,
    totalSkills,
    weeklyActivity,
    streak
}: StatsOverviewProps) {

    // Calculate percentages & Level
    const completionRate = totalSkills > 0 ? Math.round((completedSkills / totalSkills) * 100) : 0
    const maxActivity = Math.max(...weeklyActivity.map(d => d.count), 5)

    const getLevel = (rate: number) => {
        if (rate >= 100) return { label: "Master", color: "text-purple-600 bg-purple-50 border-purple-100" }
        if (rate >= 75) return { label: "Expert", color: "text-blue-600 bg-blue-50 border-blue-100" }
        if (rate >= 50) return { label: "Intermediate", color: "text-indigo-600 bg-indigo-50 border-indigo-100" }
        if (rate >= 25) return { label: "Apprentice", color: "text-emerald-600 bg-emerald-50 border-emerald-100" }
        return { label: "Novice", color: "text-slate-600 bg-slate-50 border-slate-100" }
    }

    const level = getLevel(completionRate)

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* 1. Main Progress Ring Card */}
            <Card className="md:col-span-1 border-slate-200 bg-white shadow-sm overflow-hidden relative group">
                <CardHeader className="pb-2 relative z-10">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Target className="w-4 h-4 text-slate-400" />
                            Mastery Level
                        </CardTitle>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${level.color}`}>
                            {level.label}
                        </span>
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-6 relative z-10">
                    <div className="relative w-40 h-40 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <defs>
                                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#2563eb" /> {/* Blue-600 */}
                                    <stop offset="100%" stopColor="#7c3aed" /> {/* Purple-600 */}
                                </linearGradient>
                            </defs>
                            {/* Background Circle */}
                            <circle
                                cx="80"
                                cy="80"
                                r="70"
                                stroke="currentColor"
                                strokeWidth="12"
                                fill="transparent"
                                className="text-slate-50"
                            />
                            {/* Foreground Circle */}
                            <motion.circle
                                initial={{ strokeDashoffset: 440 }}
                                animate={{ strokeDashoffset: 440 - (440 * completionRate) / 100 }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                cx="80"
                                cy="80"
                                r="70"
                                stroke="url(#progressGradient)"
                                strokeWidth="12"
                                fill="transparent"
                                strokeDasharray="440"
                                strokeLinecap="round"
                                className="drop-shadow-sm"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-extrabold text-slate-900 tracking-tight">{completionRate}%</span>
                            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wide mt-1">Total Progress</span>
                        </div>
                    </div>

                    <div className="mt-6 w-full flex items-center justify-between px-4 py-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-semibold text-slate-400 uppercase">Skills Mastered</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-lg font-bold text-slate-900">{completedSkills}</span>
                                <span className="text-xs text-slate-400">/ {totalSkills}</span>
                            </div>
                        </div>
                        <div className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-blue-600 shadow-sm">
                            <CheckCircle2 className="w-4 h-4" />
                        </div>
                    </div>
                </CardContent>

                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            </Card>

            {/* 2. Activity & Stats Card */}
            <Card className="md:col-span-2 border-slate-200 bg-white shadow-sm flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50/80 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

                <CardHeader className="pb-2 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-slate-400" />
                            Learning Activity
                        </CardTitle>

                        <div className="flex gap-3">
                            {/* Total Stats */}
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100">
                                <Layers className="w-3.5 h-3.5 text-slate-400" />
                                <span className="text-xs font-bold text-slate-700">{totalRoadmaps} <span className="font-medium text-slate-400">Roadmaps</span></span>
                            </div>

                            {/* Streak Badge */}
                            <div className="flex items-center gap-2 text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100/50 shadow-sm">
                                <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-600 animate-pulse" />
                                {streak} Day Streak
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col justify-end gap-2 pt-6 px-6 pb-6 relative z-10">
                    <div className="flex items-end justify-between gap-3 h-40">
                        {weeklyActivity.map((day, index) => {
                            const heightPercentage = (day.count / maxActivity) * 100
                            return (
                                <div key={index} className="flex flex-col items-center gap-3 flex-1 group h-full justify-end">
                                    <div className="w-full relative h-full flex items-end overflow-visible">
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${Math.max(heightPercentage, 8)}%` }} // Min height 8% for visibility
                                            transition={{ duration: 0.8, delay: index * 0.1, ease: "backOut" }}
                                            className={`w-full rounded-t-lg relative group-hover:-translate-y-1 transition-transform duration-300
                                                ${day.count > 0
                                                    ? "bg-gradient-to-t from-blue-500 to-indigo-500 shadow-[0_4px_12px_rgba(59,130,246,0.3)]"
                                                    : "bg-slate-100"}`}
                                        >
                                            {/* Tooltip */}
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 pointer-events-none whitespace-nowrap z-20">
                                                {day.count} Actions
                                                <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45" />
                                            </div>
                                        </motion.div>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-blue-500 transition-colors">
                                        {day.date.charAt(0)}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
