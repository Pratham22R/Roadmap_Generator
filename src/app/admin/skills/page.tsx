import { getPrisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AddSkillDialog } from "@/components/admin/add-skill-dialog"
import { EditSkillDialog } from "@/components/admin/edit-skill-dialog"
import { DeleteButton } from "@/components/admin/delete-button" // We'll create this next

export const dynamic = "force-dynamic"

export default async function AdminSkillsPage() {
    const prisma = getPrisma()

    // Fetch all skills with their roles
    const skills = await prisma.skill.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            roles: {
                include: {
                    role: {
                        select: { id: true, title: true }
                    }
                }
            }
        }
    })

    // Fetch roles for the Add Dialog
    const roles = await prisma.careerRole.findMany({
        select: { id: true, title: true }
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Skills Inventory</h1>
                    <p className="text-muted-foreground">Manage the technical skills associated with career roles.</p>
                </div>
                <AddSkillDialog roles={roles} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {skills.map((skill) => (
                    <Card key={skill.id}>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-base font-bold">{skill.title}</CardTitle>
                                <div className="flex items-center gap-1">
                                    <EditSkillDialog skill={skill} allRoles={roles} />
                                    <DeleteButton id={skill.id} type="skill" />
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                                {skill.roles.map(rs => (
                                    <Badge key={rs.id} variant="secondary" className="text-[10px]">
                                        {rs.role.title} ({rs.category || "Core"})
                                    </Badge>
                                ))}
                                {skill.roles.length === 0 && (
                                    <span className="text-xs text-muted-foreground italic">Unused</span>
                                )}
                            </div>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    )
}
