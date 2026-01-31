import { getPrisma } from "@/lib/prisma"
import { YouTubeManager } from "@/components/admin/youtube-manager"

export const dynamic = "force-dynamic"

export default async function YouTubeSettingsPage() {
    const prisma = getPrisma()

    // Fetch all channels
    // Note: We cast to any because user's prisma client might strictly not know about the new model yet 
    // due to the file lock issue, but at runtime it should work if DB has the table.
    // However, for safety in this environment, let's assume valid types if compilation passes.
    // If validation fails, we might need a workaround.
    let channels: any[] = []
    try {
        channels = await prisma.youTubeChannel.findMany({
            orderBy: { createdAt: 'desc' }
        })
    } catch (e) {
        console.error("Failed to fetch channels", e)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight">YouTube Content Rules</h1>
                <p className="text-muted-foreground">
                    Manage channels that are whitelisted (boosted) or blacklisted (ignored) when generating roadmaps.
                </p>
            </div>

            <YouTubeManager channels={channels} />
        </div>
    )
}
