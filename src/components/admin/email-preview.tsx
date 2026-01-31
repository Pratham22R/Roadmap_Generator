"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Smartphone, Monitor, RefreshCw, Undo2, Save, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { emailLayout } from "@/lib/email/templates/layout"

interface EmailPreviewProps {
    templates: {
        id: string
        name: string
        description: string
        defaultData: any // Data to be used for preview interpolation
        defaultContent: string // The fallback content with placeholders
    }[]
}

export function EmailPreview({ templates }: EmailPreviewProps) {
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id || "")
    const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop")
    const [key, setKey] = useState(0) // Force re-render iframe
    const [customHtml, setCustomHtml] = useState<string>("")
    const [activeTab, setActiveTab] = useState("config")
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)


    const selectedTemplate = templates.find(t => t.id === selectedTemplateId)

    // Fetch template from DB or use default
    useEffect(() => {
        if (!selectedTemplate) return;

        const fetchTemplate = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/admin/email-templates?name=${selectedTemplate.id}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.template?.content) {
                        setCustomHtml(data.template.content);
                    } else {
                        setCustomHtml(selectedTemplate.defaultContent);
                    }
                } else {
                    setCustomHtml(selectedTemplate.defaultContent);
                }
            } catch (error) {
                console.error("Failed to fetch template", error);
                setCustomHtml(selectedTemplate.defaultContent);
            } finally {
                setIsLoading(false);
                setKey(prev => prev + 1);
            }
        };

        fetchTemplate();
    }, [selectedTemplateId, selectedTemplate]);


    // Interpolate locally for preview
    const interpolatedHtml = (() => {
        if (!selectedTemplate) return "";
        let content = customHtml || selectedTemplate.defaultContent;

        // Naive replacement of {{key}} with data from defaultData
        // We assume defaultData is a flat object or we manually handle specific keys if needed.
        // For simple usage:
        const data = selectedTemplate.defaultData;

        // Handle specific complex objects (like 'stats' in weekly) if necessary, 
        // but for now let's assume keys in data match {{key}} 
        // OR we flatten the data for replacement.

        Object.keys(data).forEach(key => {
            const val = data[key];
            const regex = new RegExp(`{{${key}}}`, 'g');
            content = content.replace(regex, String(val));
        });

        // Also wrap in layout for preview
        return emailLayout({
            previewText: "Preview",
            heading: "Preview Heading",
            content,
            actionText: "Action Button",
            actionUrl: "#",
            accentColor: "#2563eb"
        });
    })();

    const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCustomHtml(e.target.value)
    }

    const handleReset = () => {
        if (selectedTemplate) {
            setCustomHtml(selectedTemplate.defaultContent)
            setKey(prev => prev + 1)
        }
    }

    const handleSave = async () => {
        if (!selectedTemplate) return;
        setIsSaving(true);
        try {
            const res = await fetch('/api/admin/email-templates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: selectedTemplate.id,
                    content: customHtml,
                    subject: `Subject for ${selectedTemplate.name}`, // You might want to make subject editable too later
                })
            });

            if (!res.ok) throw new Error("Failed to save");

            toast.success("Template saved successfully.");
        } catch (error) {
            toast.error("Failed to save template.");
        } finally {
            setIsSaving(false);
        }
    };

    const refreshPreview = () => setKey(prev => prev + 1)

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
            <div className="lg:col-span-1 flex flex-col h-full">
                <Card className="h-full flex flex-col">
                    <CardHeader className="pb-3">
                        <CardTitle>Editor</CardTitle>
                        <CardDescription>Configure or edit the template</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col overflow-hidden pt-0">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col">
                            <TabsList className="grid w-full grid-cols-2 mb-4">
                                <TabsTrigger value="config">Settings</TabsTrigger>
                                <TabsTrigger value="code">Code</TabsTrigger>
                            </TabsList>

                            <TabsContent value="config" className="space-y-4 data-[state=active]:flex-1">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Template</label>
                                    <Select
                                        value={selectedTemplateId}
                                        onValueChange={(val) => setSelectedTemplateId(val)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select template" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {templates.map(t => (
                                                <SelectItem key={t.id} value={t.id}>
                                                    {t.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        {selectedTemplate?.description}
                                    </p>
                                </div>

                                <div className="pt-4 border-t">
                                    <label className="text-sm font-medium mb-2 block">Device View</label>
                                    <div className="flex gap-2">
                                        <Button
                                            variant={viewMode === "desktop" ? "default" : "outline"}
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => setViewMode("desktop")}
                                        >
                                            <Monitor className="w-4 h-4 mr-2" />
                                            Desktop
                                        </Button>
                                        <Button
                                            variant={viewMode === "mobile" ? "default" : "outline"}
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => setViewMode("mobile")}
                                        >
                                            <Smartphone className="w-4 h-4 mr-2" />
                                            Mobile
                                        </Button>
                                    </div>
                                </div>

                                <div className="pt-4 border-t">
                                    <Button variant="ghost" size="sm" className="w-full" onClick={refreshPreview}>
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Refresh Preview
                                    </Button>
                                </div>
                            </TabsContent>

                            <TabsContent value="code" className="flex-col h-full data-[state=active]:flex relative">
                                <div className="flex-1 relative min-h-[300px]">
                                    {isLoading ? (
                                        <div className="absolute inset-0 flex items-center justify-center bg-slate-50/50 z-10">
                                            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                                        </div>
                                    ) : null}
                                    <Textarea
                                        className="absolute inset-0 font-mono text-xs resize-none bg-slate-950 text-slate-50 border-slate-800 p-4 leading-relaxed"
                                        placeholder="HTML Code..."
                                        value={customHtml}
                                        onChange={handleCodeChange}
                                        spellCheck={false}
                                    />
                                </div>
                                <div className="pt-4 flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleReset}
                                        className="flex-1"
                                    >
                                        <Undo2 className="w-4 h-4 mr-2" />
                                        Reset
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="flex-1"
                                    >
                                        {isSaving ? (
                                            <div className="flex items-center">
                                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                                Saving...
                                            </div>
                                        ) : (
                                            <div className="flex items-center">
                                                <Save className="w-4 h-4 mr-2" />
                                                Save Changes
                                            </div>
                                        )}
                                    </Button>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>

            <div className="lg:col-span-2 bg-slate-100 rounded-lg border shadow-inner p-4 overflow-auto flex items-center justify-center relative">
                <div
                    className={`bg-white shadow-xl transition-all duration-300 overflow-hidden ${viewMode === "mobile" ? "w-[375px] h-[667px] rounded-[30px] border-8 border-slate-800" : "w-full h-full rounded-md"
                        }`}
                >
                    <iframe
                        key={key}
                        srcDoc={interpolatedHtml}
                        title="Email Preview"
                        className="w-full h-full border-none bg-white"
                        sandbox="allow-same-origin allow-scripts"
                    />
                </div>
            </div>
        </div>
    )
}
