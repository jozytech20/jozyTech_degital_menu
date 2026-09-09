import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { AxiosError } from "axios";
import type { OwnerVenue } from "@/types/ownerVenue";
import api from "@/lib/api";
import { Upload, X, Loader2 } from "lucide-react";

function OwnerVenueSetting() {
    const [venue, setVenue] = useState<OwnerVenue | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [website, setWebsite] = useState("");
    const [logoUrl, setLogoUrl] = useState("")

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);

        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await api.post("/owner/upload-image", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setLogoUrl(response.data.data.url);
            toast.add({ type: "success", description: "Logo uploaded" });
        } catch {
            toast.add({ type: "error", description: "Logo upload failed" });
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        const fetchVenue = async () => {
            try {
                const response = await api.get<{ data: OwnerVenue }>("/owner/venue");
                const v = response.data.data;

                setVenue(v);
                setName(v.name);
                setEmail(v.email);
                setPhone(v.phone);
                setWebsite(v.website ?? "");
                setLogoUrl(v.branding?.logoUrl ?? "");

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchVenue();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await api.patch<{ data: OwnerVenue }>("/owner/venue", {
                name,
                email,
                phone,
                website,
                logoUrl,
            });
            setVenue(response.data.data);
            toast.add({ type: "success", description: "Venue settings updated" });
        } catch (err) {
            const message = err instanceof AxiosError ? err.response?.data?.message : undefined;
            toast.add({ type: "error", description: message || "Failed to update venue" });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!venue) return <div>Could not load venue</div>;

    return (
        <div className="space-y-8 max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold">Venue Settings</h1>
                <p className="text-sm text-gray-500">
                    Public URL: <span className="font-mono">{venue.slug}.jozytech.com</span>{" "}
                    <span className="text-xs">(contact support to change your slug)</span>
                </p>
            </div>

            <div className="space-y-4">
                <div>
                    <Label htmlFor="name">Restaurant Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div>
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" value={website} onChange={(e) => setWebsite(e.target.value)} />
                </div>

                <div>
                    <Label>Restaurant Logo</Label>
                    <div className="mt-2">
                        {logoUrl ? (
                            <div className="relative inline-block">
                                <img
                                    src={logoUrl}
                                    alt="Restaurant Logo"
                                    className="w-32 h-32 object-contain rounded-lg border p-1"
                                />
                                <button
                                    type="button"
                                    onClick={() => setLogoUrl("")}
                                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5 hover:opacity-80 transition-opacity"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>
                        ) : (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors"
                            >
                                {uploading ? (
                                    <Loader2 className="size-6 animate-spin text-muted-foreground" />
                                ) : (
                                    <>
                                        <Upload className="size-6 text-muted-foreground mb-2" />
                                        <span className="text-sm text-muted-foreground">Click to upload logo</span>
                                        <span className="text-xs text-muted-foreground/60 mt-1">PNG, JPG up to 2MB</span>
                                    </>
                                )}
                            </div>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleLogoUpload}
                        />
                        {logoUrl && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin mr-1" />
                                        Uploading…
                                    </>
                                ) : (
                                    "Change Logo"
                                )}
                            </Button>
                        )}
                    </div>
                </div>

                <Button onClick={handleSave} disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                </Button>
            </div>

            <div className="border-t pt-6">
                <h2 className="font-semibold mb-2">Your QR Code</h2>
                {venue.branding?.qrCodeUrl ? (
                    <img src={venue.branding.qrCodeUrl} alt="QR Code" className="w-40 h-40 border rounded" />
                ) : (
                    <p className="text-sm text-gray-500">No QR code uploaded yet.</p>
                )}
            </div>
        </div>
    );
}

export default OwnerVenueSetting;