"use client"

import { EmailPreview } from "@/components/admin/email-preview"
import { WELCOME_TEMPLATE_DEFAULT } from "@/lib/email/templates/welcome"
import { ROADMAP_TEMPLATE_DEFAULT } from "@/lib/email/templates/roadmap"
import { MILESTONE_TEMPLATE_DEFAULT } from "@/lib/email/templates/milestone"
import { WEEKLY_TEMPLATE_DEFAULT } from "@/lib/email/templates/weekly"
import { INACTIVITY_TEMPLATE_DEFAULT } from "@/lib/email/templates/inactivity"

export default function EmailTemplatesPage() {
    // We create wrapper functions to pass default dummy data for previewing
    const templates = [
        {
            id: "welcome",
            name: "Welcome Email",
            description: "Sent immediately after user signup.",
            defaultContent: WELCOME_TEMPLATE_DEFAULT,
            defaultData: {
                name: "John Doe"
            }
        },
        {
            id: "roadmap",
            name: "Roadmap Ready",
            description: "Sent when a requested roadmap generation is complete.",
            defaultContent: ROADMAP_TEMPLATE_DEFAULT,
            defaultData: {
                name: "John Doe",
                roadmapTitle: "Full Stack Web Development",
                roadmapId: "123"
            }
        },
        {
            id: "milestone",
            name: "Milestone Completed",
            description: "Sent when a user completes a significant milestone.",
            defaultContent: MILESTONE_TEMPLATE_DEFAULT,
            defaultData: {
                name: "John Doe",
                milestone: "Learn React Basics",
                roadmapTitle: "Full Stack Path",
                roadmapId: "123"
            }
        },
        {
            id: "weekly",
            name: "Weekly Progress",
            description: "A summary of the user's activity over the past week.",
            defaultContent: WEEKLY_TEMPLATE_DEFAULT,
            defaultData: {
                name: "John Doe",
                completedTasks: 5,
                totalHours: 12,
                currentStreak: 3,
                nextGoal: "Build a Todo App"
            }
        },
        {
            id: "inactivity",
            name: "Inactivity Reminder",
            description: "Re-engagement email for users inactive for 7+ days.",
            defaultContent: INACTIVITY_TEMPLATE_DEFAULT,
            defaultData: {
                name: "John Doe"
            }
        }
    ]


    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Email Templates</h1>
                    <p className="text-muted-foreground mt-1">Preview and verify email designs.</p>
                </div>
            </div>

            <div className="flex-1">
                <EmailPreview templates={templates} />
            </div>
        </div>
    )
}
