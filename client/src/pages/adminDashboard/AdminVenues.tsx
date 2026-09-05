// src/pages/admin/Venues.tsx
import { useEffect, useState } from "react";
import api from "../../lib/api";
// import type { AdminVenue, FetchVenuesResponse } from "../../types/venue";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { AdminVenue, FetchVenuesResponse } from "@/types/user";
import EditVenueDialog from "../ownerDashboard/EditVenueDialog";


function AdminVenues() {
  const [venues, setVenues] = useState<AdminVenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [search, setSearch] = useState("");

  const totalVenues = venues.length;
  const activeVenues = venues.filter((v) => v.status === "active").length;
  const inactiveVenues = venues.filter((v) => v.status === "paused").length;

  const [editTarget, setEditTarget] = useState<AdminVenue | null>(null);

  const handleVenueUpdated = (updatedVenue: AdminVenue) => {
    setVenues((prev) =>
      prev.map((v) => (v._id === updatedVenue._id ? updatedVenue : v)),
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const fetchVenues = async () => {
        setSearching(true);
        try {
          const response = await api.get<FetchVenuesResponse>("/admin/venues", {
            params: { search },
          });
          setVenues(response.data.data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
          setSearching(false);
        }
      };
      fetchVenues();
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Venues</h1>
        <Button>+ Add New Venue</Button>
      </div>
      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="border rounded-lg p-4">
          <p className="text-sm text-gray-500">Total Venues</p>
          <p className="text-2xl font-bold">{totalVenues}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-gray-500">Active Venues</p>
          <p className="text-2xl font-bold">{activeVenues}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-gray-500">Inactive Venues</p>
          <p className="text-2xl font-bold">{inactiveVenues}</p>
        </div>
      </div>
      {/* Search */}
      <Input
        placeholder="Search venues..."
        className="max-w-sm"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {venues.map((venue) => (
            <TableRow key={venue._id}>
              <TableCell className="font-medium">{venue.name}</TableCell>
              <TableCell>{venue.slug}</TableCell>
              <TableCell>{venue.email}</TableCell>
              <TableCell>{venue.phone}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    venue.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {venue.status}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <button
                  onClick={() => setEditTarget(venue)}
                  className="text-blue-600 text-sm cursor-pointer"
                >
                  Edit
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <EditVenueDialog
        open={!!editTarget}
        onOpenChange={(open) => !open && setEditTarget(null)}
        venue={editTarget}
        onUpdated={handleVenueUpdated}
      />
      {searching && <p className="text-sm text-gray-400">Searching...</p>}
    </div>
  );
}

export default AdminVenues;