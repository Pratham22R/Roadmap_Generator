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
                className="h-full border-dashed border-zinc-800 bg-zinc-900/20 hover:bg-zinc-900/40 hover:border-zinc-700 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[250px] text-zinc-500 hover:text-zinc-300"
            >
                <div className="h-12 w-12 rounded-full bg-zinc-800/50 flex items-center justify-center mb-4 group-hover:bg-zinc-800 transition-colors">
                    <Plus className="h-6 w-6" />
                </div>
                <h3 className="font-medium text-lg">Create New Roadmap</h3>
                <p className="text-sm mt-1 opacity-60">Generate a custom learning path</p>
                {!isPro && (
                    <p className="text-xs mt-2 text-zinc-600">
                        {currentCount} / {MAX_FREE_ROADMAPS} Free Used
                    </p>
                )}
            </Card>

            <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
                <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Upgrade to Pro
                        </DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            You've reached the limit of free roadmaps. Upgrade to create unlimited learning paths!
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="flex items-center gap-2 text-sm text-zinc-300">
                            <span className="text-green-500">✓</span> Unlimited AI Roadmaps
                        </div>
                        <div className="flex items-center gap-2 text-sm text-zinc-300">
                            <span className="text-green-500">✓</span> Advanced Progress Tracking
                        </div>
                        <div className="flex items-center gap-2 text-sm text-zinc-300">
                            <span className="text-green-500">✓</span> Priority Support
                        </div>
                    </div>

                    <form action={createCheckout} className="w-full">
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-lg shadow-lg shadow-blue-500/20 transition-all">
                            Unlock Unlimited Access
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}
