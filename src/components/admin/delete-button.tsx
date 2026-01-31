"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, Loader2 } from "lucide-react"
import { deleteCareerRole, deleteSkill } from "@/actions/admin-content"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface DeleteButtonProps {
    id: string
    type: "role" | "skill"
}

export function DeleteButton({ id, type }: DeleteButtonProps) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleDelete() {
        if (!confirm("Are you sure? This cannot be undone.")) return

        setLoading(true)
        let result
        if (type === "role") {
            result = await deleteCareerRole(id)
        } else {
            result = await deleteSkill(id)
        }

        if (result.message === "Success") {
            toast.success("Deleted successfully")
            router.refresh()
        } else {
            toast.error(result.message)
        }
        setLoading(false)
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50"
            onClick={handleDelete}
            disabled={loading}
        >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </Button>
    )
}
