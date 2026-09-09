import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { AxiosError } from "axios";
import type { OwnerVenue } from "@/types/ownerVenue";
import api from "@/lib/api";
import { Upload, X, Loader2, QrCode } from "lucide-react";

function OwnerVenueSetting() {
    const [venue, setVenue] = useState<OwnerVenue | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [downloadingQr, setDownloadingQr] = useState(false);

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

    const handleQrDownload = async () => {
        const qrCodeUrl = venue?.branding?.qrCodeUrl;

        if (!qrCodeUrl) {
            toast.add({
                type: "error",
                description: "QR code is not available",
            });
            return;
        }

        setDownloadingQr(true);

        try {
            const response = await fetch(qrCodeUrl);

            if (!response.ok) {
                throw new Error("Failed to fetch QR code");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = `${venue.slug}-qr-code.png`;

            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(url);

            toast.add({
                type: "success",
                description: "QR code downloaded",
            });
        } catch (error) {
            console.error(error);

            toast.add({
                type: "error",
                description: "Failed to download QR code",
            });
        } finally {
            setDownloadingQr(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="size-8 animate-spin text-primary/60" />
            </div>
        );
    }

    if (!venue) return <div className="p-8 text-center text-muted-foreground">Could not load venue</div>;

    return (
        <div className="max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out pb-12">
            <Card className="border shadow-sm bg-card overflow-hidden">
                <CardHeader className="bg-muted/30 border-b pb-6">
                    <CardTitle className="text-2xl font-bold tracking-tight">Venue Profile</CardTitle>
                    <CardDescription className="text-sm mt-2">
                        Manage your restaurant details and branding. Public URL:{" "}
                        <span className="font-mono bg-background px-1.5 py-0.5 rounded-md border text-primary">
                            {venue.slug}.jozytech.com
                        </span>
                    </CardDescription>
                </CardHeader>

                <CardContent className="pt-8 space-y-8">
                    {/* Basic Info Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium">Restaurant Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="focus-visible:ring-primary/20"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">Contact Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="focus-visible:ring-primary/20"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="focus-visible:ring-primary/20"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="website" className="text-sm font-medium">Website</Label>
                            <Input
                                id="website"
                                type="url"
                                placeholder="https://"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                className="focus-visible:ring-primary/20"
                            />
                        </div>
                    </div>

                    {/* Logo Upload Section */}
                    <div className="space-y-3 pt-4 border-t">
                        <div>
                            <Label className="text-base font-semibold">Restaurant Logo</Label>
                            <p className="text-sm text-muted-foreground mb-4">
                                This will be displayed on your digital menu and QR codes.
                            </p>
                        </div>

                        <div className="mt-2">
                            {logoUrl ? (
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-4 rounded-xl border bg-muted/20">
                                    <div className="relative group overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5">
                                        <img
                                            src={logoUrl}
                                            alt="Restaurant Logo"
                                            className="w-32 h-32 object-contain p-2"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="bg-white/90 text-black px-3 py-1.5 rounded-md text-xs font-medium hover:bg-white transition-colors"
                                            >
                                                Change
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => setLogoUrl("")}
                                            className="w-full sm:w-auto"
                                        >
                                            <X className="size-4 mr-2" />
                                            Remove Logo
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="group flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer bg-muted/10 hover:bg-primary/5 hover:border-primary/50 transition-all duration-300"
                                >
                                    {uploading ? (
                                        <div className="flex flex-col items-center text-primary">
                                            <Loader2 className="size-8 animate-spin mb-3" />
                                            <span className="font-medium">Uploading...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="p-3 bg-background border shadow-sm rounded-full mb-3 group-hover:scale-110 group-hover:shadow-md group-hover:text-primary transition-all duration-300">
                                                <Upload className="size-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                            </div>
                                            <span className="text-sm font-medium">Click to browse or drag and drop</span>
                                            <span className="text-xs text-muted-foreground mt-1">PNG, JPG, SVG up to 2MB</span>
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
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="bg-muted/30 border-t p-6 flex justify-end">
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-8 shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="size-4 animate-spin mr-2" />
                                Saving Changes...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </CardFooter>
            </Card>

            <Card className="border shadow-sm bg-card overflow-hidden">
                <CardHeader className="bg-muted/30 border-b pb-6">
                    <div className="flex items-center gap-2">
                        <QrCode className="size-5 text-primary" />
                        <CardTitle className="text-lg font-bold">Your QR Code</CardTitle>
                    </div>
                    <CardDescription>
                        Customers can scan this code to view your digital menu instantly.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    {venue.branding?.qrCodeUrl ? (
                        <div className="flex flex-col items-start gap-4">
                            <div className="p-2 bg-white rounded-xl shadow-sm border inline-block">
                                <img src={venue.branding.qrCodeUrl} alt="QR Code" className="w-48 h-48" />
                            </div>
                            <Button
                                    onClick={handleQrDownload}
                                    variant="outline"
                                    disabled={downloadingQr}
                                    className="shadow-sm"
                                >
                                    {downloadingQr ? (
                                        <>
                                            <Loader2 className="size-4 mr-2 animate-spin" />
                                            Downloading...
                                        </>
                                    ) : (
                                        "Download QR Code"
                                    )}
                                </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-xl bg-muted/10 text-muted-foreground">
                            <QrCode className="size-10 mb-2 opacity-50" />
                            <p className="text-sm font-medium">No QR code generated yet.</p>
                            <p className="text-xs opacity-70">Save your venue settings to generate one.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default OwnerVenueSetting;