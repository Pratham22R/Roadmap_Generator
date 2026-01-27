"use client"

import { Button } from "@/components/ui/button"
import { syncSubscriptionStatus } from "@/actions/sync-subscription"
import { useState } from "react"
import { RefreshCw } from "lucide-react"
import { toast } from "sonner" // Assuming sonner or use standard alert

export function SyncButton() {
    const [loading, setLoading] = useState(false)

    const handleSync = async () => {
        setLoading(true)
        try {
            const res = await syncSubscriptionStatus()
            if (res.success) {
                // You might want to show a toast here
                alert(res.message)
                window.location.reload() // Force reload to see changes
            } else {
                alert(res.message)
            }
        } catch (e) {
            alert("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleSync}
            disabled={loading}
            className="gap-2 border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800"
        >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Syncing..." : "Sync Status"}
        </Button>
    )
}
