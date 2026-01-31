"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Ban, Trash, Eye, CheckCircle } from "lucide-react"
import { banUser, deleteUser } from "@/app/actions/admin"
import { toast } from "sonner"

interface UserActionsProps {
    userId: string
    isBanned: boolean
}

export function UserActions({ userId, isBanned }: UserActionsProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleBan = async () => {
        setIsLoading(true)
        const result = await banUser(userId, !isBanned)
        setIsLoading(false)
        if (result.success) {
            toast.success(result.message)
        } else {
            toast.error(result.error)
        }
    }

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return

        setIsLoading(true)
        const result = await deleteUser(userId)
        setIsLoading(false)
        if (result.success) {
            toast.success(result.message)
        } else {
            toast.error(result.error)
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => router.push(`/admin/users/${userId}`)}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleBan}>
                    {isBanned ? (
                        <>
                            <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                            Unban User
                        </>
                    ) : (
                        <>
                            <Ban className="mr-2 h-4 w-4 text-orange-600" />
                            Ban User
                        </>
                    )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete User
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
