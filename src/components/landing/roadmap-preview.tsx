"use client"

import { useState } from "react"
import { CheckCircle2, Circle, FileText, PlayCircle } from "lucide-react"
import { cn } from "@/lib/utils"

// Define the data structure for modules
type Task = {
    id: number
    title: string
    type: "video" | "doc"
    duration: string
}

type Module = {
    id: string
    name: string
    title: string
    description: string
    tasks: Task[]
}

const MODULES: Module[] = [
    {
        id: "basics",
        name: "Basics of React",
        title: "Basics of React",
        description: "Typically takes 2-3 days to complete.",
        tasks: [
            { id: 101, title: "Understanding Components", type: "video", duration: "12 min video" },
            { id: 102, title: "JSX Syntax Deep Dive", type: "doc", duration: "Documentation" },
            { id: 103, title: "Props and State", type: "video", duration: "15 min video" },
        ]
    },
    {
        id: "state",
        name: "State Management",
        title: "State Management",
        description: "Mastering useState, useReducer, and Context API.",
        tasks: [
            { id: 201, title: "useState Hook", type: "video", duration: "10 min video" },
            { id: 202, title: "Complex State with useReducer", type: "video", duration: "18 min video" },
            { id: 203, title: "Context API Guide", type: "doc", duration: "Documentation" },
        ]
    },
    {
        id: "hooks",
        name: "Advanced Hooks",
        title: "Advanced Hooks",
        description: "Deep dive into useEffect, useRef, and custom hooks.",
        tasks: [
            { id: 301, title: "The useEffect Dependency Array", type: "doc", duration: "Documentation" },
            { id: 302, title: "Building Custom Hooks", type: "video", duration: "20 min video" },
            { id: 303, title: "Performance with useMemo", type: "video", duration: "15 min video" },
        ]
    },
    {
        id: "performance",
        name: "Performance",
        title: "React Performance",
        description: "Optimizing re-renders and code splitting.",
        tasks: [
            { id: 401, title: "React.memo and Callbacks", type: "video", duration: "14 min video" },
            { id: 402, title: "Lazy Loading Components", type: "doc", duration: "Documentation" },
            { id: 403, title: "Profiler API", type: "video", duration: "10 min video" },
        ]
    }
]

export function RoadmapPreview() {
    const [activeModuleId, setActiveModuleId] = useState<string>("basics")
    // Track completed tasks globally across all modules
    const [completedTasks, setCompletedTasks] = useState<number[]>([101, 201])

    const activeModule = MODULES.find(m => m.id === activeModuleId) || MODULES[0]

    const toggleTask = (id: number) => {
        setCompletedTasks(prev =>
            prev.includes(id)
                ? prev.filter(taskId => taskId !== id)
                : [...prev, id]
        )
    }

    // Calculate progress for the ACTIVE module only
    const activeModuleTasks = activeModule.tasks
    const completedCount = activeModuleTasks.filter(t => completedTasks.includes(t.id)).length
    const progress = Math.round((completedCount / activeModuleTasks.length) * 100)

    return (
        <section id="preview" className="py-24 bg-[#f8fafc]">
            <div className="container mx-auto px-6 max-w-[1200px]">
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                    <h2 className="text-3xl font-bold tracking-tight text-[#0f172a] sm:text-4xl">
                        Experience the learning journey
                    </h2>
                    <p className="text-[#475569] text-lg">
                        A sneak peek into how your personalized roadmap will look and function.
                    </p>
                </div>

                <div className="relative rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden max-w-5xl mx-auto transition-all duration-300">
                    {/* Mock Window Header */}
                    <div className="flex items-center px-4 py-3 border-b border-slate-100 bg-[#f8fafc]">
                        <div className="flex gap-2">
                            <div className="h-3 w-3 rounded-full bg-red-400" />
                            <div className="h-3 w-3 rounded-full bg-yellow-400" />
                            <div className="h-3 w-3 rounded-full bg-green-400" />
                        </div>
                    </div>

                    {/* Mock Content */}
                    <div className="p-8 pb-12 flex flex-col md:flex-row gap-8 min-h-[500px]">
                        {/* Sidebar Mock */}
                        <div className="w-full md:w-64 space-y-4 hidden md:block border-r border-slate-50 pr-4">
                            <div className="font-semibold text-sm text-[#0f172a] px-2 tracking-wide text-muted-foreground">YOUR ROADMAP</div>
                            <div className="space-y-1">
                                {MODULES.map((module) => {
                                    const isActive = module.id === activeModuleId
                                    return (
                                        <button
                                            key={module.id}
                                            onClick={() => setActiveModuleId(module.id)}
                                            className={cn(
                                                "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                                isActive
                                                    ? "bg-slate-100 text-[#0f172a] shadow-sm"
                                                    : "text-[#64748b] hover:bg-slate-50 hover:text-[#0f172a]"
                                            )}
                                        >
                                            {module.name}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Main Area Mock */}
                        <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 key={activeModuleId}">
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                                            Module {MODULES.findIndex(m => m.id === activeModuleId) + 1}
                                        </span>
                                        <h3 className="text-2xl font-bold text-[#0f172a] leading-tight w-full">
                                            {activeModule.title}
                                        </h3>
                                    </div>
                                    <span className="text-3xl font-bold text-[#0f172a] tabular-nums tracking-tight">
                                        {progress}%
                                    </span>
                                </div>
                                <p className="text-[#475569] text-base">{activeModule.description}</p>

                                {/* Progress Bar */}
                                <div className="h-2.5 w-full bg-slate-100 rounded-full mt-4 overflow-hidden">
                                    <div
                                        className={cn(
                                            "h-full rounded-full transition-all duration-700 ease-out",
                                            progress === 100 ? "bg-green-500" : "bg-[#0f172a]"
                                        )}
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                {activeModule.tasks.map((task) => {
                                    const isCompleted = completedTasks.includes(task.id)
                                    return (
                                        <div
                                            key={task.id}
                                            className={cn(
                                                "flex items-center p-4 border rounded-xl transition-all duration-200 cursor-pointer group select-none",
                                                isCompleted
                                                    ? "bg-slate-50/50 border-slate-200"
                                                    : "bg-white border-slate-100 hover:border-slate-300 hover:shadow-sm hover:translate-x-1"
                                            )}
                                            onClick={() => toggleTask(task.id)}
                                        >
                                            <div className="mr-4">
                                                {isCompleted ? (
                                                    <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center scale-110 transition-all">
                                                        <CheckCircle2 className="h-4 w-4 text-white" />
                                                    </div>
                                                ) : (
                                                    <Circle className="h-6 w-6 text-slate-300 group-hover:text-slate-400 transition-colors" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className={cn("font-medium truncate transition-colors", isCompleted ? "text-slate-500 line-through decoration-slate-300" : "text-[#0f172a]")}>
                                                    {task.title}
                                                </div>
                                                <div className="text-xs text-[#64748b] flex items-center gap-1 mt-1">
                                                    {task.type === 'video' ? <PlayCircle className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
                                                    {task.duration}
                                                </div>
                                            </div>
                                            <div className={cn(
                                                "px-3 py-1 rounded-md text-xs font-medium transition-colors ml-2",
                                                isCompleted
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-slate-50 text-[#0f172a] group-hover:bg-slate-100"
                                            )}>
                                                {isCompleted ? "Done" : "Start"}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
