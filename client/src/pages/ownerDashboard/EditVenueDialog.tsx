// src/components/admin/EditVenueDialog.tsx
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "../../lib/api";
import type { AdminVenue } from "@/types/user";


interface EditVenueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  venue: AdminVenue | null;
  onUpdated: (updatedVenue: AdminVenue) => void;
}

function EditVenueDialog({
  open,
  onOpenChange,
  venue,
  onUpdated,
}: EditVenueDialogProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"active" | "paused">("active");
  const [primaryColor, setPrimaryColor] = useState("#000000");
  const [secondaryColor, setSecondaryColor] = useState("#000000");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [confirmingSlug, setConfirmingSlug] = useState(false);

  useEffect(() => {
    if (venue) {
      setName(venue.name);
      setSlug(venue.slug);
      setEmail(venue.email);
      setPhone(venue.phone);
      setWebsite(venue.website ?? "");
      setStatus(venue.status);
      setPrimaryColor(venue.branding.theme.primaryColor);
      setSecondaryColor(venue.branding.theme.secondaryColor);
      setConfirmingSlug(false);
    }
  }, [venue]);

  const slugChanged = venue ? slug !== venue.slug : false;

  const performSave = async () => {
    if (!venue) return;
    setSaving(true);
    setError("");

    try {
      const response = await api.patch(`/admin/venues/${venue._id}`, {
        name,
        slug,
        email,
        phone,
        website,
        status,
        branding: {
          theme: {
            primaryColor,
            secondaryColor,
          },
        },
      });
      onUpdated(response.data.data);
      onOpenChange(false);
    } catch (err) {
      setError(
        "Failed to update venue. The slug may already be taken or reserved.",
      );
      setConfirmingSlug(false);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveClick = () => {
    if (slugChanged) {
      setConfirmingSlug(true);
    } else {
      performSave();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Venue</DialogTitle>
        </DialogHeader>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        {!confirmingSlug ? (
          <>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  This is the venue's public URL — changing it breaks any
                  existing QR codes.
                </p>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              <div>
                <Label>Status</Label>
                <Select
                  value={status}
                  onValueChange={(v) => setStatus(v as "active" | "paused")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <Input
                    id="primaryColor"
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveClick} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-700">
              You're changing the venue's slug from{" "}
              <strong>{venue?.slug}</strong> to <strong>{slug}</strong>. This
              changes its public URL and will break any QR codes or bookmarks
              pointing to the old address. Continue?
            </p>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setConfirmingSlug(false)}
              >
                Go Back
              </Button>
              <Button onClick={performSave} disabled={saving}>
                {saving ? "Saving..." : "Yes, Change Slug"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default EditVenueDialog;
