"use client"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from "next-auth/react"

export function UserNav({ user }: { user: any }) {
    const role = user?.role || "USER"
    const isAdmin = role === "ADMIN"

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-slate-100 transition-colors">
                    <Avatar className="h-9 w-9 border border-slate-200 shadow-sm">
                        <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
                        <AvatarFallback className="bg-slate-100 text-slate-600 font-medium">{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white border-slate-200 text-slate-900 shadow-lg p-2" align="end" forceMount>
                <DropdownMenuLabel className="font-normal px-2 py-2">
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold leading-none text-slate-900">{user?.name}</p>
                            <span className="text-[10px] uppercase bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-500 font-medium">
                                {role}
                            </span>
                        </div>
                        <p className="text-xs leading-none text-slate-500 font-medium">
                            {user?.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-100 my-1" />
                <DropdownMenuGroup>
                    {isAdmin && (
                        <DropdownMenuItem asChild className="focus:bg-slate-50 focus:text-slate-900 cursor-pointer rounded-md px-2 py-2 text-slate-600 font-medium transition-colors">
                            <a href="/admin">Admin Panel</a>
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem className="focus:bg-slate-50 focus:text-slate-900 cursor-pointer rounded-md px-2 py-2 text-slate-600 font-medium transition-colors">
                        Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-slate-50 focus:text-slate-900 cursor-pointer rounded-md px-2 py-2 text-slate-600 font-medium transition-colors">
                        Settings
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-slate-100 my-1" />
                <DropdownMenuItem
                    className="focus:bg-red-50 focus:text-red-600 cursor-pointer rounded-md px-2 py-2 text-red-500 font-medium transition-colors"
                    onClick={() => signOut({ callbackUrl: "/" })}
                >
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
