"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Pencil } from "lucide-react"
import { updateSkill } from "@/actions/admin-content"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface EditSkillDialogProps {
    skill: {
        id: string
        title: string
        category?: string | null
        roles: { roleId: string; category: string | null }[]
    }
    allRoles: { id: string; title: string }[]
}

export function EditSkillDialog({ skill, allRoles }: EditSkillDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const currentRoleIds = skill.roles.map(r => r.roleId)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        formData.append("id", skill.id)

        const result = await updateSkill(null, formData)

        if (result.message === "Success") {
            toast.success("Skill updated")
            setOpen(false)
            router.refresh()
        } else {
            toast.error(result.message)
        }
        setLoading(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Pencil className="h-3 w-3 text-muted-foreground" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Skill</DialogTitle>
                    <DialogDescription>
                        Update skill details and manage associated roles.
                    </DialogDescription>
                </DialogHeader>
                <form action={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                            Title
                        </Label>
                        <Input
                            id="title"
                            name="title"
                            defaultValue={skill.title}
                            className="col-span-3"
                            required
                        />
                    </div>

                    {/* Category is redundant if we have multiple roles with potentially different categories.
                        For now, let's keep it as a default for NEW assignments, or update ALL.
                        Or maybe just hide it for now to avoid confusion unless we want a global default?
                        The user asked to assign roles. Let's show the Role checkbox list.
                     */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">
                            Category
                        </Label>
                        <Input
                            id="category"
                            name="category"
                            defaultValue={skill.category || ""}
                            placeholder="Default category for new links"
                            className="col-span-3"
                        />
                    </div>

                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label className="text-right mt-2">
                            Roles
                        </Label>
                        <div className="col-span-3 flex flex-col gap-3 max-h-[200px] overflow-y-auto border p-2 rounded-md">
                            {allRoles.map((role) => (
                                <div key={role.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`edit-role-${role.id}`}
                                        name="roleIds"
                                        value={role.id}
                                        defaultChecked={currentRoleIds.includes(role.id)}
                                    />
                                    <label
                                        htmlFor={`edit-role-${role.id}`}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        {role.title}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
