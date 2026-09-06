// src/pages/owner/VenueSettings.tsx
import { useEffect, useState } from "react";
import api from "../../lib/api";
// import type { OwnerVenue } from "../../types/venue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { AxiosError } from "axios";
import type { OwnerVenue } from "@/types/ownerVenue";

function ownerVenue() {
  const [venue, setVenue] = useState<OwnerVenue | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#000000");
  const [secondaryColor, setSecondaryColor] = useState("#000000");

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
        branding: {
          theme: { primaryColor, secondaryColor },
        },
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="primaryColor">Primary Color</Label>
            <Input id="primaryColor" type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="secondaryColor">Secondary Color</Label>
            <Input id="secondaryColor" type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} />
          </div>
        </div>

        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="border-t pt-6">
        <h2 className="font-semibold mb-2">Your QR Code</h2>
        {venue.branding.qrCodeUrl ? (
          <img src={venue.branding.qrCodeUrl} alt="QR Code" className="w-40 h-40 border rounded" />
        ) : (
          <p className="text-sm text-gray-500">No QR code uploaded yet.</p>
        )}
      </div>
    </div>
  );
}

export default ownerVenue;