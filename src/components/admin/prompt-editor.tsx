"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { updateSystemPrompt } from "@/actions/admin-settings"
import { toast } from "sonner"
import { Loader2, Save } from "lucide-react"
import { useRouter } from "next/navigation"

export function PromptEditor({ initialPrompt }: { initialPrompt: string }) {
    const [prompt, setPrompt] = useState(initialPrompt)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleSave() {
        setLoading(true)
        const result = await updateSystemPrompt(prompt)

        if (result.success) {
            toast.success("System Prompt updated successfully")
            router.refresh()
        } else {
            toast.error(result.message)
        }
        setLoading(false)
    }

    return (
        <div className="space-y-4">
            <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[500px] font-mono text-sm"
            />

            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Changes
                </Button>
            </div>
        </div>
    )
}
