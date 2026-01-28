import { cn } from "@/lib/utils";
import {
    FileCode2,
    Database,
    Globe,
    Terminal,
    LayoutTemplate,
    Box,
    Workflow,
    CheckCircle2,
    GitBranch,
    PlayCircle,
    BookOpen,
    Cpu,
    Layers,
    Code2,
    Server,
    Zap,
    Flag,
    Milestone,
    Check
} from "lucide-react";

// Mock logos/icons using Lucide for now to ensure speed, 
// normally we'd import SVGs for specific brands like React/Tailwind.
// Center item is index 12 in a 0-24 array (25 items).

const gridItems = [
    { icon: FileCode2, color: "text-blue-500" },          // 1 JS
    { icon: LayoutTemplate, color: "text-cyan-500" },     // 2 React
    { icon: Box, color: "text-orange-500" },              // 3 HTML
    { icon: Terminal, color: "text-slate-800" },          // 4 Terminal
    { icon: Database, color: "text-blue-400" },           // 5 SQL

    { icon: Globe, color: "text-green-500" },             // 6 Node
    { icon: Workflow, color: "text-purple-500" },         // 7 API
    { icon: GitBranch, color: "text-red-500" },           // 8 Git
    { icon: Server, color: "text-indigo-500" },           // 9 Server
    { icon: Cpu, color: "text-yellow-600" },              // 10 Logic

    { icon: PlayCircle, color: "text-red-600" },          // 11 Video
    { icon: BookOpen, color: "text-blue-700" },           // 12 Docs
    { icon: "LOGO", color: "text-white" },                // 13 CENTER LOGO
    { icon: CheckCircle2, color: "text-green-600" },      // 14 Done
    { icon: Layers, color: "text-pink-500" },             // 15 Stack

    { icon: Code2, color: "text-blue-600" },              // 16 TS
    { icon: Zap, color: "text-yellow-500" },              // 17 AI
    { icon: Flag, color: "text-orange-600" },             // 18 Goal
    { icon: Milestone, color: "text-slate-600" },         // 19 Step
    { icon: Check, color: "text-green-500" },             // 20 Check

    { icon: Box, color: "text-purple-400" },              // 21
    { icon: Terminal, color: "text-slate-700" },          // 22 
    { icon: Database, color: "text-blue-300" },           // 23
    { icon: Globe, color: "text-emerald-500" },           // 24
    { icon: Server, color: "text-indigo-400" },           // 25
];

export function TechnologyGrid() {
    return (
        <div className="relative flex items-center justify-center p-8 select-none">
            {/* Background glow behind the grid */}
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-100 to-transparent rounded-full blur-[80px] -z-10" />

            <div className="grid grid-cols-5 gap-3 md:gap-4 p-4 rounded-[32px] bg-white border border-slate-100 shadow-[0px_20px_40px_-10px_rgba(0,0,0,0.08)]">
                {gridItems.map((item, i) => {
                    const isCenter = item.icon === "LOGO";
                    const Icon = item.icon !== "LOGO" ? (item.icon as any) : null;

                    if (isCenter) {
                        return (
                            <div
                                key={i}
                                className="relative z-10 flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-2xl bg-black shadow-lg shadow-black/20 scale-110"
                            >
                                <span className="text-white font-bold text-xl">R</span>
                            </div>
                        )
                    }

                    return (
                        <div
                            key={i}
                            className={cn(
                                "flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-md",
                                "bg-[#f8fafc] border border-transparent shadow-sm" // Very light gray bg, subtle shadow
                            )}
                        >
                            <Icon className={cn("h-6 w-6 md:h-7 md:w-7", item.color)} strokeWidth={2} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
