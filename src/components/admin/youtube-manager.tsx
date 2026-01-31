"use client"

import { useState } from "react"
import { addYouTubeChannel, deleteYouTubeChannel } from "@/actions/admin-content"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Plus, ExternalLink, Youtube } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

type ChannelType = "WHITELIST" | "BLACKLIST"

interface YouTubeChannel {
    id: string
    channelId: string
    title: string | null
    type: string
}

export function YouTubeManager({ channels }: { channels: YouTubeChannel[] }) {
    const [activeTab, setActiveTab] = useState<ChannelType>("WHITELIST")
    const [newChannelId, setNewChannelId] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const filteredChannels = channels.filter(c => c.type === activeTab)

    async function handleAdd() {
        if (!newChannelId.trim()) return

        setLoading(true)
        const result = await addYouTubeChannel(newChannelId, activeTab)
        if (result.message === "Success") {
            toast.success("Channel added")
            setNewChannelId("")
            router.refresh()
        } else {
            toast.error(result.message)
        }
        setLoading(false)
    }

    async function handleDelete(id: string) {
        if (!confirm("Remove this channel?")) return
        const result = await deleteYouTubeChannel(id)
        if (result.message === "Success") {
            toast.success("Channel removed")
            router.refresh()
        } else {
            toast.error(result.message)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex space-x-2 border-b pb-2">
                <Button
                    variant={activeTab === "WHITELIST" ? "default" : "ghost"}
                    onClick={() => setActiveTab("WHITELIST")}
                    className="gap-2"
                >
                    <Youtube className="h-4 w-4" />
                    Whitelist
                </Button>
                <Button
                    variant={activeTab === "BLACKLIST" ? "destructive" : "ghost"}
                    onClick={() => setActiveTab("BLACKLIST")}
                    className={activeTab === "BLACKLIST" ? "" : "text-muted-foreground"}
                >
                    Blacklist
                </Button>
            </div>

            <div className="flex gap-4 items-end">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Input
                        type="text"
                        placeholder="Channel ID (e.g. UC_x5X...)"
                        value={newChannelId}
                        onChange={(e) => setNewChannelId(e.target.value)}
                    />
                </div>
                <Button onClick={handleAdd} disabled={loading || !newChannelId}>
                    {loading ? "Adding..." : <><Plus className="mr-2 h-4 w-4" /> Add Channel</>}
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredChannels.length === 0 ? (
                    <div className="col-span-full py-8 text-center text-muted-foreground border rounded-lg border-dashed">
                        No {activeTab.toLowerCase()}ed channels found.
                    </div>
                ) : (
                    filteredChannels.map((channel) => (
                        <Card key={channel.id} className="overflow-hidden">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="space-y-1 overflow-hidden">
                                    <p className="text-sm font-medium truncate" title={channel.channelId}>
                                        {channel.channelId}
                                    </p>
                                    <a
                                        href={`https://youtube.com/channel/${channel.channelId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-muted-foreground flex items-center hover:underline"
                                    >
                                        View Channel <ExternalLink className="h-3 w-3 ml-1" />
                                    </a>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDelete(channel.id)}
                                    className="h-8 w-8 text-muted-foreground hover:text-red-500"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
