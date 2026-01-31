import { getSystemPrompt } from "@/actions/admin-settings"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PromptEditor } from "@/components/admin/prompt-editor"

export const dynamic = "force-dynamic"

export default async function AIPromptsPage() {
    const currentPrompt = await getSystemPrompt()

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">AI Prompts Configuration</h1>
                    <p className="text-muted-foreground">Fine-tune the behavior of the Gemini AI.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>System Instruction</CardTitle>
                    <CardDescription>
                        This prompt is sent to Gemini as the system instruction. Use <code>{`{{variable}}`}</code> syntax for dynamic values.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <PromptEditor initialPrompt={currentPrompt} />
                </CardContent>
            </Card>
        </div>
    )
}
