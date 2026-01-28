import { CheckCircle2, Circle, FileText, PlayCircle } from "lucide-react"

export function RoadmapPreview() {
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

                <div className="relative rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden max-w-5xl mx-auto">
                    {/* Mock Window Header */}
                    <div className="flex items-center px-4 py-3 border-b border-slate-100 bg-[#f8fafc]">
                        <div className="flex gap-2">
                            <div className="h-3 w-3 rounded-full bg-red-400" />
                            <div className="h-3 w-3 rounded-full bg-yellow-400" />
                            <div className="h-3 w-3 rounded-full bg-green-400" />
                        </div>
                    </div>

                    {/* Mock Content */}
                    <div className="p-8 pb-12 flex flex-col md:flex-row gap-8">
                        {/* Sidebar Mock */}
                        <div className="w-full md:w-64 space-y-4 hidden md:block">
                            <div className="font-semibold text-sm text-[#0f172a] px-2">YOUR ROADMAP</div>
                            <div className="space-y-1">
                                {[
                                    { name: "Basics of React", active: true },
                                    { name: "State Management", active: false },
                                    { name: "Advanced Hooks", active: false },
                                    { name: "Performance", active: false },
                                ].map((item, i) => (
                                    <div
                                        key={i}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium ${item.active ? "bg-slate-100 text-[#0f172a]" : "text-[#64748b]"}`}
                                    >
                                        {item.name}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Main Area Mock */}
                        <div className="flex-1 space-y-6">
                            <div className="flex flex-col gap-2">
                                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Module 1</span>
                                <h3 className="text-2xl font-bold text-[#0f172a]">Basics of React</h3>
                                <p className="text-[#475569]">Typically takes 2-3 days to complete.</p>

                                {/* Progress Bar */}
                                <div className="h-2 w-full bg-slate-100 rounded-full mt-2 overflow-hidden">
                                    <div className="h-full w-[35%] bg-[#0f172a] rounded-full" />
                                </div>
                                <div className="text-xs text-[#64748b] text-right">35% Complete</div>
                            </div>

                            <div className="space-y-3">
                                {[
                                    { title: "Understanding Components", type: "video" },
                                    { title: "JSX Syntax Deep Dive", type: "doc" },
                                    { title: "Props and State", type: "video" },
                                ].map((task, i) => (
                                    <div key={i} className="flex items-center p-4 border border-slate-100 rounded-xl bg-white hover:border-slate-300 transition-colors cursor-pointer">
                                        <div className="mr-4">
                                            {i === 0 ? <CheckCircle2 className="h-6 w-6 text-green-500" /> : <Circle className="h-6 w-6 text-slate-300" />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium text-[#0f172a]">{task.title}</div>
                                            <div className="text-xs text-[#64748b] flex items-center gap-1 mt-1">
                                                {task.type === 'video' ? <PlayCircle className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
                                                {task.type === 'video' ? '12 min video' : 'Documentation'}
                                            </div>
                                        </div>
                                        <div className="px-3 py-1 bg-slate-50 rounded-md text-xs font-medium text-[#0f172a]">Start</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
