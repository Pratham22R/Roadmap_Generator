import { getPrisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-dynamic"

export default async function AdminTemplatesPage() {
    const prisma = getPrisma()

    const templates = await prisma.roadmapTemplate.findMany({
        take: 50,
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { roadmaps: true, phases: true }
            }
        }
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Roadmap Templates</h1>
                <Badge variant="outline" className="text-sm">
                    Total Cached: {templates.length}
                </Badge>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Cached Templates</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground uppercase bg-secondary/50">
                                <tr>
                                    <th className="px-4 py-3 rounded-tl-lg">Template Title</th>
                                    <th className="px-4 py-3">Phases</th>
                                    <th className="px-4 py-3">Usage Count</th>
                                    <th className="px-4 py-3">Created</th>
                                    <th className="px-4 py-3 rounded-tr-lg">ID</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {templates.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                            No templates cached yet. Generate some roadmaps!
                                        </td>
                                    </tr>
                                ) : (
                                    templates.map((template) => (
                                        <tr key={template.id} className="hover:bg-muted/50 transition-colors">
                                            <td className="px-4 py-3 font-medium">
                                                {template.title}
                                                <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                                                    {template.description}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                {template._count.phases}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge variant="secondary">
                                                    {template._count.roadmaps} uses
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {new Date(template.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3 text-xs font-mono text-muted-foreground">
                                                {template.id.substring(0, 8)}...
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
