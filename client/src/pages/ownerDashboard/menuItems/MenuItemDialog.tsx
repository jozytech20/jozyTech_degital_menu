// src/components/owner/MenuItemDialog.tsx
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { OwnerMenuItem } from "@/types/menuItems";
import type { OwnerCategory } from "@/types/category";
import api from "@/lib/api";


interface MenuItemDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item: OwnerMenuItem | null; // null = create mode
    categories: OwnerCategory[];
    onSaved: (item: OwnerMenuItem) => void;
}

function MenuItemDialog({ open, onOpenChange, item, categories, onSaved }: MenuItemDialogProps) {
    const [categoryId, setCategoryId] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState("");
    const [isAvailable, setIsAvailable] = useState(true);
    const [isFeatured, setIsFeatured] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (item) {
            setCategoryId(item.categoryId);
            setName(item.name);
            setDescription(item.description);
            setPrice(String(item.price));
            setImage(item.image);
            setIsAvailable(item.isAvailable);
            setIsFeatured(item.isFeatured);
        } else {
            setCategoryId("");
            setName("");
            setDescription("");
            setPrice("");
            setImage("");
            setIsAvailable(true);
            setIsFeatured(false);
        }
        setError("");
    }, [item, open]);

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
        if (!categoryId) {
            setError("Please select a category");
            return;
        }

        setSaving(true);
        setError("");

        const payload = {
            categoryId,
            name,
            description,
            price: Number(price),
            image,
            isAvailable,
            isFeatured,
        };

        try {
            let response;
            if (item) {
                response = await api.patch(`/owner/menu-items/${item._id}`, payload);
            } else {
                response = await api.post("/owner/menu-items", payload);
            }
            onSaved(response.data.data);
            onOpenChange(false);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to save menu item");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{item ? "Edit Menu Item" : "Add Menu Item"}</DialogTitle>
                </DialogHeader>

                {error && <p className="text-red-600 text-sm">{error}</p>}

                <div className="space-y-4">
                    <div>
                        <Label>Category</Label>
                        <Select value={categoryId} onValueChange={setCategoryId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((c) => (
                                    <SelectItem key={c._id} value={c._id}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>

                    <div>
                        <Label htmlFor="price">Price</Label>
                        <Input
                            id="price"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>

                    <div>
                        <Label htmlFor="image">Image</Label>
                        <Input id="image" type="file" accept="image/*" onChange={handleFileChange} />
                        {uploading && <p className="text-xs text-gray-500 mt-1">Uploading...</p>}
                        {image && !uploading && (
                            <img src={image} alt="Preview" className="w-16 h-16 rounded object-cover mt-2" />
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <Label htmlFor="isAvailable">Available</Label>
                        <Switch id="isAvailable" checked={isAvailable} onCheckedChange={setIsAvailable} />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label htmlFor="isFeatured">Featured</Label>
                        <Switch id="isFeatured" checked={isFeatured} onCheckedChange={setIsFeatured} />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={saving || uploading}>
                        {saving ? "Saving..." : item ? "Save Changes" : "Create Item"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default MenuItemDialog;