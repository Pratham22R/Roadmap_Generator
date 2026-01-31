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
import { Plus } from "lucide-react"
import { createSkill } from "@/actions/admin-content"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface AddSkillDialogProps {
    roles: { id: string; title: string }[]
}

export function AddSkillDialog({ roles }: AddSkillDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    // Removed single roleId state
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        // formData automatically includes all checked checkboxes with name="roleIds"

        const result = await createSkill(null, formData)

        if (result.message === "Success") {
            toast.success("Skill created")
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
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Skill
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Skill</DialogTitle>
                    <DialogDescription>
                        Add a skill and assign it to multiple career roles.
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
                            placeholder="e.g. React"
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">
                            Category
                        </Label>
                        <Input
                            id="category"
                            name="category"
                            placeholder="e.g. Frontend"
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label className="text-right mt-2">
                            Roles
                        </Label>
                        <div className="col-span-3 flex flex-col gap-3 max-h-[200px] overflow-y-auto border p-2 rounded-md">
                            {roles.map((role) => (
                                <div key={role.id} className="flex items-center space-x-2">
                                    <Checkbox id={`role-${role.id}`} name="roleIds" value={role.id} />
                                    <label
                                        htmlFor={`role-${role.id}`}
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
                            {loading ? "Saving..." : "Save changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
