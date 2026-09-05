// src/components/admin/AddVenueDialog.tsx
import { useState } from "react";
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
import api from "../../lib/api";
import type { AdminVenue } from "../../types/venue";

interface AddVenueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (newVenue: AdminVenue) => void;
}

function AddVenueDialog({
  open,
  onOpenChange,
  onCreated,
}: AddVenueDialogProps) {
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [password, setPassword] = useState("");
  const [venueName, setVenueName] = useState("");
  const [slug, setSlug] = useState("");
  const [venueEmail, setVenueEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setOwnerName("");
    setOwnerEmail("");
    setPassword("");
    setVenueName("");
    setSlug("");
    setVenueEmail("");
    setPhone("");
    setWebsite("");
    setError("");
  };

  const handleCreate = async () => {
    setSaving(true);
    setError("");

    try {
      const response = await api.post("/admin/venues", {
        ownerName,
        ownerEmail,
        password,
        venueName,
        slug,
        venueEmail,
        phone,
        website,
      });
      onCreated(response.data.data.venue ?? response.data.data);
      resetForm();
      onOpenChange(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create venue");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Venue</DialogTitle>
        </DialogHeader>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="space-y-4">
          <h3 className="font-semibold text-sm text-gray-500">Owner Account</h3>

          <div>
            <Label htmlFor="ownerName">Owner Name</Label>
            <Input
              id="ownerName"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="ownerEmail">Owner Email</Label>
            <Input
              id="ownerEmail"
              value={ownerEmail}
              onChange={(e) => setOwnerEmail(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="password">Temporary Password</Label>
            <Input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <h3 className="font-semibold text-sm text-gray-500 pt-2">
            Venue Details
          </h3>

          <div>
            <Label htmlFor="venueName">Venue Name</Label>
            <Input
              id="venueName"
              value={venueName}
              onChange={(e) => setVenueName(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="blue-nile"
            />
          </div>

          <div>
            <Label htmlFor="venueEmail">Venue Email</Label>
            <Input
              id="venueEmail"
              value={venueEmail}
              onChange={(e) => setVenueEmail(e.target.value)}
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
            <Label htmlFor="website">Website (optional)</Label>
            <Input
              id="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={saving}>
            {saving ? "Creating..." : "Create Venue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddVenueDialog;