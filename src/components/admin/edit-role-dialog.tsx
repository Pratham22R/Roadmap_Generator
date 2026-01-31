"use client"

import { useState, useMemo } from "react"
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
import { Textarea } from "../ui/textarea"
import { Pencil, X } from "lucide-react"
import { updateCareerRole, removeSkillFromRole } from "@/actions/admin-content"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface EditRoleDialogProps {
    role: {
        id: string
        title: string
        description: string | null
        skills: {
            id: string // RoleSkill ID (not used for delete if we use composite key, but useful for key)
            skillId: string
            category: string | null
            skill: { title: string; id: string }
        }[]
    }
}

export function EditRoleDialog({ role }: EditRoleDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [skillToDelete, setSkillToDelete] = useState<{ id: string; title: string } | null>(null)
    const router = useRouter()

    const groupedSkills = useMemo(() => {
        return role.skills.reduce((acc, rs) => {
            const cat = rs.category || "Uncategorized"
            if (!acc[cat]) acc[cat] = []
            acc[cat].push(rs)
            return acc
        }, {} as Record<string, typeof role.skills>)
    }, [role.skills])

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        formData.append("id", role.id)

        const result = await updateCareerRole(null, formData)

        if (result.message === "Success") {
            toast.success("Career Role updated")
            setOpen(false)
            router.refresh()
        } else {
            toast.error(result.message)
        }
        setLoading(false)
    }

    async function handleRemoveSkill() {
        if (!skillToDelete) return

        const result = await removeSkillFromRole(role.id, skillToDelete.id)

        if (result.message === "Success") {
            toast.success(`${skillToDelete.title} removed from role`)
            router.refresh()
        } else {
            toast.error(result.message)
        }
        setSkillToDelete(null)
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4 text-muted-foreground" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[85vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Edit Career Role</DialogTitle>
                        <DialogDescription>
                            Update details and manage skills for {role.title}.
                        </DialogDescription>
                    </DialogHeader>
                    <form action={handleSubmit} className="grid gap-4 py-4 overflow-y-auto pr-2">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                                Title
                            </Label>
                            <Input
                                id="title"
                                name="title"
                                defaultValue={role.title}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                name="description"
                                defaultValue={role.description || ""}
                                className="col-span-3 min-h-[80px]"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label className="text-right mt-2">
                                Skills
                            </Label>
                            <div className="col-span-3">
                                <div className="border rounded-md p-4 min-h-[150px] max-h-[300px] overflow-y-auto space-y-4 bg-slate-50 dark:bg-slate-900/50">
                                    {Object.entries(groupedSkills).length === 0 && (
                                        <span className="text-sm text-muted-foreground">No skills assigned.</span>
                                    )}
                                    {Object.entries(groupedSkills).map(([category, skills]) => (
                                        <div key={category}>
                                            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 sticky top-0 bg-slate-50 dark:bg-slate-900/50 z-10 py-1">
                                                {category}
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {skills.map(rs => (
                                                    <Badge key={rs.skill.id} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 border shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                                        {rs.skill.title}
                                                        <button
                                                            type="button"
                                                            onClick={() => setSkillToDelete({ id: rs.skill.id, title: rs.skill.title })}
                                                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full p-0.5 transition-colors"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-2">
                                    Click 'X' to remove a skill. Categories are managed via the seed script or API.
                                </p>
                            </div>
                        </div>

                        <DialogFooter className="mt-4">
                            <Button type="submit" disabled={loading}>
                                {loading ? "Saving..." : "Save Changes"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={!!skillToDelete} onOpenChange={(open: boolean) => !open && setSkillToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remove Skill?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to remove <b>{skillToDelete?.title}</b> from this role?
                            This action cannot be undone instantly, but you can re-add it from the Skills page.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleRemoveSkill} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Confirm Remove
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
