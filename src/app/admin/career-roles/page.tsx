import { getPrisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { AddRoleDialog } from "@/components/admin/add-role-dialog"
import { EditRoleDialog } from "@/components/admin/edit-role-dialog"
import { DeleteButton } from "@/components/admin/delete-button"

export const dynamic = "force-dynamic"

export default async function AdminCareerRolesPage() {
    const prisma = getPrisma()

    const roles = await prisma.careerRole.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            skills: {
                include: {
                    skill: true
                }
            },
            _count: {
                select: { skills: true }
            }
        }
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Career Roles</h1>
                    <p className="text-muted-foreground">Manage the roles users can choose during onboarding.</p>
                </div>
                <AddRoleDialog />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {roles.map((role) => (
                    <Card key={role.id}>
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg font-bold">{role.title}</CardTitle>
                                <div className="flex items-center gap-1">
                                    <EditRoleDialog role={role} />
                                    <DeleteButton id={role.id} type="role" />
                                </div>
                            </div>
                            <CardDescription>{role.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {role.skills.slice(0, 5).map(rs => (
                                    <Badge key={rs.id} variant="secondary" className="text-[10px]">
                                        {rs.skill.title}
                                    </Badge>
                                ))}
                                {role._count.skills > 5 && (
                                    <Badge variant="outline" className="text-[10px]">
                                        +{role._count.skills - 5} more
                                    </Badge>
                                )}
                            </div>
                            <div className="flex justify-between items-center text-xs text-muted-foreground mt-4 border-t pt-4">
                                <span>{role.isActive ? "Active" : "Inactive"}</span>
                                <span>{new Date(role.createdAt).toLocaleDateString()}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
