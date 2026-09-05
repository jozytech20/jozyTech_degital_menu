// src/components/owner/CategoryDialog.tsx
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
import api from "../../lib/api";
import type { OwnerCategory } from "../../types/category";

interface CategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category: OwnerCategory | null; // null = create mode
    onSaved: (category: OwnerCategory) => void;
}

function CategoryDialog({ open, onOpenChange, category, onSaved }: CategoryDialogProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (category) {
            setName(category.name);
            setDescription(category.description);
            setImage(category.image);
            setIsActive(category.isActive);
        } else {
            setName("");
            setDescription("");
            setImage("");
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
                    isActive,
                });
            } else {
                response = await api.post("/owner/categories", {
                    name,
                    description,
                    image,
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{category ? "Edit Category" : "Add Category"}</DialogTitle>
                </DialogHeader>

                {error && <p className="text-red-600 text-sm">{error}</p>}

                <div className="space-y-4">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>

                    <div>
                        <Label htmlFor="image">Image</Label>
                        <Input id="image" type="file" accept="image/*" onChange={handleFileChange} />
                        {uploading && <p className="text-xs text-gray-500 mt-1">Uploading...</p>}
                        {image && !uploading && (
                            <img src={image} alt="Preview" className="w-16 h-16 rounded object-cover mt-2" />
                        )}
                    </div>

                    {category && (
                        <div className="flex items-center justify-between">
                            <Label htmlFor="isActive">Active</Label>
                            <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={saving || uploading}>
                        {saving ? "Saving..." : category ? "Save Changes" : "Create Category"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default CategoryDialog;