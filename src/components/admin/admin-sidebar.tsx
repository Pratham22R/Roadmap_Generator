"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Users,
    BookOpen,
    Briefcase,
    FileText,
    Settings,
    Youtube,
    Mail,
    Activity,
    CreditCard
} from "lucide-react"

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Users",
        href: "/admin/users",
        icon: Users,
    },
    {
        title: "Career Roles",
        href: "/admin/career-roles",
        icon: Briefcase,
    },
    {
        title: "Skills",
        href: "/admin/skills",
        icon: BookOpen,
    },
    {
        title: "Roadmap Templates",
        href: "/admin/roadmap-templates",
        icon: FileText,
    },
    {
        title: "AI Prompts",
        href: "/admin/ai-prompts",
        icon: Settings,
    },
    {
        title: "YouTube Rules",
        href: "/admin/youtube-settings",
        icon: Youtube,
    },
    {
        title: "Email Templates",
        href: "/admin/email-templates",
        icon: Mail,
    },
    {
        title: "Subscriptions",
        href: "/admin/subscriptions",
        icon: CreditCard,
    },
    {
        title: "Logs",
        href: "/admin/logs",
        icon: Activity,
    },
]

export function AdminSidebar() {
    const pathname = usePathname()

    return (
        <div className="flex h-screen w-64 flex-col border-r bg-white">
            <div className="flex h-14 items-center border-b px-6">
                <span className="text-lg font-bold">Admin Panel</span>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-1 px-3">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href
                        const Icon = item.icon

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {item.title}
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </div>
    )
}
