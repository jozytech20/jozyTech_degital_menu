import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import api from "../../../lib/api";
import type { OwnerCategory } from "../../../types/category";
import { ImageOff, Loader2, Upload, Layers, PencilLine } from "lucide-react";

/* ── brand palette ── */
const BRAND = {
    deep: "oklch(0.25 0.08 250)",
    mid: "oklch(0.35 0.08 250)",
    bright: "oklch(0.65 0.15 250)",
    pale: "oklch(0.92 0.03 250)",
};

interface CategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category: OwnerCategory | null;
    onSaved: (category: OwnerCategory) => void;
}

function CategoryDialog({ open, onOpenChange, category, onSaved }: CategoryDialogProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [imagePublicId, setImagePublicId] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (category) {
            setName(category.name);
            setDescription(category.description);
            setImage(category.image);
            setImagePublicId(category.imagePublicId ?? "");
            setIsActive(category.isActive);
        } else {
            setName("");
            setDescription("");
            setImage("");
            setImagePublicId("");
            setIsActive(true);
        }
        setError("");
    }, [category, open]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError("");

        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await api.post("/owner/upload-image", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setImage(response.data.data.url);
            setImagePublicId(response.data.data.publicId);
        } catch (err) {
            setError("Image upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setError("");

        try {
            let response;
            if (category) {
                response = await api.patch(`/owner/categories/${category._id}`, {
                    name,
                    description,
                    image,
                    imagePublicId,
                    isActive,
                });
            } else {
                response = await api.post("/owner/categories", {
                    name,
                    description,
                    image,
                    imagePublicId,
                });
            }
            onSaved(response.data.data);
            onOpenChange(false);
        } catch (err) {
            setError("Failed to save category");
        } finally {
            setSaving(false);
        }
    };

    const isEdit = !!category;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg p-0">
                {/* ── Branded header ── */}
                <div
                    className="relative overflow-hidden rounded-t-xl px-6 pt-6 pb-5"
                    style={{
                        background: `linear-gradient(135deg, ${BRAND.deep}, oklch(0.30 0.10 260))`,
                    }}
                >
                    {/* decorative circle */}
                    <div
                        className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-[0.08]"
                        style={{ background: BRAND.bright }}
                    />

                    <DialogHeader className="relative z-10 gap-0">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-9 h-9 rounded-lg flex items-center justify-center"
                                style={{ background: BRAND.mid }}
                            >
                                {isEdit ? (
                                    <PencilLine className="size-4 text-white/80" />
                                ) : (
                                    <Layers className="size-4 text-white/80" />
                                )}
                            </div>
                            <DialogTitle className="text-lg font-bold text-white">
                                {isEdit ? "Edit Category" : "Add Category"}
                            </DialogTitle>
                        </div>
                    </DialogHeader>
                </div>

                {/* ── Body ── */}
                <div className="px-6 pb-2 pt-1 space-y-5">
                    {/* Error */}
                    {error && (
                        <div
                            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium"
                            style={{
                                background: "oklch(0.97 0.03 25)",
                                color: "oklch(0.50 0.18 25)",
                            }}
                        >
                            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "oklch(0.55 0.20 25)" }} />
                            {error}
                        </div>
                    )}

                    {/* Name */}
                    <div className="space-y-1.5">
                        <Label
                            htmlFor="cat-name"
                            className="text-sm font-semibold"
                            style={{ color: "oklch(0.35 0.03 250)" }}
                        >
                            Name
                        </Label>
                        <Input
                            id="cat-name"
                            placeholder="e.g. Appetizers"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="h-11 rounded-xl"
                            style={{ borderColor: "oklch(0.90 0.02 250)" }}
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <Label
                            htmlFor="cat-desc"
                            className="text-sm font-semibold"
                            style={{ color: "oklch(0.35 0.03 250)" }}
                        >
                            Description
                        </Label>
                        <Input
                            id="cat-desc"
                            placeholder="Brief description of this category"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="h-11 rounded-xl"
                            style={{ borderColor: "oklch(0.90 0.02 250)" }}
                        />
                    </div>

                    {/* Image upload */}
                    <div className="space-y-2">
                        <Label
                            className="text-sm font-semibold"
                            style={{ color: "oklch(0.35 0.03 250)" }}
                        >
                            Image
                        </Label>

                        <div className="flex items-start gap-4">
                            <div
                                className="w-20 h-20 rounded-xl shrink-0 overflow-hidden flex items-center justify-center ring-1"
                                style={{
                                    background: image ? "transparent" : BRAND.pale,
                                    "--tw-ring-color": "oklch(0.90 0.02 250)",
                                } as React.CSSProperties}
                            >
                                {uploading ? (
                                    <Loader2 className="size-5 animate-spin" style={{ color: BRAND.bright }} />
                                ) : image ? (
                                    <img src={image} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <ImageOff className="size-5" style={{ color: "oklch(0.72 0.02 250)" }} />
                                )}
                            </div>

                            {/* Upload area */}
                            <label
                                className="flex-1 flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed py-4 px-3 cursor-pointer transition-colors duration-200 hover:border-solid"
                                style={{
                                    borderColor: "oklch(0.88 0.03 250)",
                                    background: "oklch(0.98 0.005 250)",
                                }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLElement).style.borderColor = BRAND.bright;
                                    (e.currentTarget as HTMLElement).style.background = BRAND.pale;
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLElement).style.borderColor = "oklch(0.88 0.03 250)";
                                    (e.currentTarget as HTMLElement).style.background = "oklch(0.98 0.005 250)";
                                }}
                            >
                                <Upload className="size-4" style={{ color: BRAND.bright }} />
                                <span className="text-xs font-medium" style={{ color: BRAND.bright }}>
                                    {uploading ? "Uploading…" : "Click to upload"}
                                </span>
                                <span className="text-[10px] text-gray-400">PNG, JPG, WEBP</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="sr-only"
                                    disabled={uploading}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Active toggle (edit only) */}
                    {isEdit && (
                        <div
                            className="flex items-center justify-between rounded-xl px-4 py-3"
                            style={{ background: BRAND.pale }}
                        >
                            <div className="space-y-0.5">
                                <Label
                                    htmlFor="cat-active"
                                    className="text-sm font-semibold cursor-pointer"
                                    style={{ color: "oklch(0.30 0.05 250)" }}
                                >
                                    Active
                                </Label>
                                <p className="text-xs text-gray-400">
                                    Inactive categories are hidden from the public menu
                                </p>
                            </div>
                            <Switch id="cat-active" checked={isActive} onCheckedChange={setIsActive} />
                        </div>
                    )}
                </div>

                {/* ── Footer ── */}
                <DialogFooter className="px-6 pb-6 pt-2 gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="rounded-xl h-10 cursor-pointer"
                        style={{ borderColor: "oklch(0.90 0.02 250)" }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={saving || uploading}
                        className="rounded-xl h-10 font-semibold cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md"
                        style={{ background: BRAND.deep }}
                    >
                        {saving ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="size-4 animate-spin" />
                                Saving…
                            </span>
                        ) : isEdit ? (
                            "Save Changes"
                        ) : (
                            "Create Category"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default CategoryDialog;