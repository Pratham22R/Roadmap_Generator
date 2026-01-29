"use client"

import { Card } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { createCheckout } from "@/actions/subscription"

interface CreateRoadmapCardProps {
    isPro: boolean
    currentCount: number
}

export function CreateRoadmapCard({ isPro, currentCount }: CreateRoadmapCardProps) {
    const router = useRouter()
    const [showUpgradeModal, setShowUpgradeModal] = useState(false)
    const MAX_FREE_ROADMAPS = 1

    const handleClick = () => {
        if (!isPro && currentCount >= MAX_FREE_ROADMAPS) {
            setShowUpgradeModal(true)
        } else {
            router.push("/onboarding")
        }
    }

    return (
        <>
            <Card
                onClick={handleClick}
                className="h-full border border-dashed border-slate-300 bg-slate-50/50 group-hover:bg-blue-600 group-hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center min-h-[250px] text-slate-500 group-hover:text-white rounded-2xl group relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-10" />

                <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center mb-5 group-hover:bg-white/10 group-hover:backdrop-blur-sm group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-md group-hover:scale-110">
                    <Plus className="h-7 w-7 text-slate-400 group-hover:text-white" />
                </div>
                <h3 className="font-bold text-lg text-slate-700 group-hover:text-white transition-colors">Create New Roadmap</h3>
                <p className="text-sm mt-2 opacity-60 font-medium group-hover:text-blue-100">Generate a custom learning path</p>
                {!isPro && (
                    <div className="mt-4 px-3 py-1 bg-slate-200/50 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:bg-white/20 group-hover:text-white transition-colors">
                        {currentCount} / {MAX_FREE_ROADMAPS} Free Used
                    </div>
                )}
            </Card>

            <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
                <DialogContent className="bg-white border-slate-200 text-slate-900">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Upgrade to Pro
                        </DialogTitle>
                        <DialogDescription className="text-slate-500">
                            You've reached the limit of free roadmaps. Upgrade to create unlimited learning paths!
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                            <span className="text-green-600">✓</span> Unlimited AI Roadmaps
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                            <span className="text-green-600">✓</span> Advanced Progress Tracking
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                            <span className="text-green-600">✓</span> Priority Support
                        </div>
                    </div>

                    <form action={createCheckout} className="w-full">
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg shadow-lg shadow-blue-500/20 transition-all">
                            Unlock Unlimited Access
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}
