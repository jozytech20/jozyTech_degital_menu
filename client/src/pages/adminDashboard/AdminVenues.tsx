import { useEffect, useMemo, useState } from "react";
import api from "../../lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pencil,
  Store,
  CheckCircle2,
  PauseCircle,
  Search,
  RefreshCw,
  Loader2,
  Plus,
} from "lucide-react";
import type { AdminVenue, FetchVenuesResponse } from "@/types/user";
import EditVenueDialog from "../ownerDashboard/EditVenueDialog";
import AddVenueDialog from "./AddVenueDialog";


function AdminVenues() {
  const [venues, setVenues] = useState<AdminVenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState<AdminVenue | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const { totalVenues, activeVenues, pausedVenues } = useMemo(
    () => ({
      totalVenues: venues.length,
      activeVenues: venues.filter((v) => v.status === "active").length,
      pausedVenues: venues.filter((v) => v.status === "paused").length,
    }),
    [venues],
  );

  const handleVenueCreated = (newVenue: AdminVenue) => {
    setVenues((prev) => [newVenue, ...prev]);
  };

  const handleVenueUpdated = (updatedVenue: AdminVenue) => {
    setVenues((prev) =>
      prev.map((v) => (v._id === updatedVenue._id ? updatedVenue : v)),
    );
  };

  const fetchVenues = async () => {
    setSearching(true);
    setError(null);
    try {
      const response = await api.get<FetchVenuesResponse>("/admin/venues", {
        params: { search },
      });
      setVenues(response.data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load venues");
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchVenues();
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  if (loading)
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-gray-400" />
          <p className="text-sm text-gray-500">Loading venues...</p>
        </div>
      </div>
    );

  if (error && venues.length === 0)
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-red-100 mx-auto flex items-center justify-center">
            <Store className="size-6 text-red-500" />
          </div>
          <p className="text-gray-900 font-medium">{error}</p>
          <button
            onClick={fetchVenues}
            className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <RefreshCw className="size-3.5" />
            Try again
          </button>
        </div>
      </div>
    );

  const statCards = [
    {
      label: "Total Venues",
      value: totalVenues,
      icon: Store,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Active",
      value: activeVenues,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Paused",
      value: pausedVenues,
      icon: PauseCircle,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="space-y-6 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">Dashboard &gt; Venues</p>
          <h1 className="text-lg font-bold text-gray-900">
            Venue Management
          </h1>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors cursor-pointer"
        >
          <Plus className="size-4" />
          Add New Venue
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm"
          >
            <div
              className={`w-11 h-11 rounded-lg ${stat.bg} flex items-center justify-center shrink-0`}
            >
              <stat.icon className={`size-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search venues..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
        />
        {searching && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 animate-spin" />
        )}
      </div>

      {/* Error banner (inline, when venues already loaded) */}
      {error && venues.length > 0 && (
        <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>
          <button
            onClick={fetchVenues}
            className="inline-flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-100 transition-colors cursor-pointer"
          >
            <RefreshCw className="size-3.5" />
            Retry
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/80">
              <TableHead className="font-semibold text-gray-600">
                Name
              </TableHead>
              <TableHead className="font-semibold text-gray-600">
                Slug
              </TableHead>
              <TableHead className="font-semibold text-gray-600">
                Email
              </TableHead>
              <TableHead className="font-semibold text-gray-600">
                Phone
              </TableHead>
              <TableHead className="font-semibold text-gray-600">
                Status
              </TableHead>
              <TableHead className="text-right font-semibold text-gray-600">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {venues.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-gray-500 py-12"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Search className="size-8 text-gray-300" />
                    <p className="text-sm">
                      {search
                        ? "No venues match your search"
                        : "No venues found"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              venues.map((venue) => (
                <TableRow
                  key={venue._id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0"
                        style={{ background: "oklch(0.30 0.08 250)" }}
                      >
                        {venue.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900">
                        {venue.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">{venue.slug}</TableCell>
                  <TableCell className="text-gray-600">
                    {venue.email}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {venue.phone}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${venue.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                        }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${venue.status === "active"
                          ? "bg-green-500"
                          : "bg-amber-500"
                          }`}
                      />
                      {venue.status === "active" ? "Active" : "Paused"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setEditTarget(venue)}
                        className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        aria-label={`Edit ${venue.name}`}
                      >
                        <Pencil size={15} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AddVenueDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onCreated={handleVenueCreated}
      />
      <EditVenueDialog
        open={!!editTarget}
        onOpenChange={(open) => !open && setEditTarget(null)}
        venue={editTarget}
        onUpdated={handleVenueUpdated}
      />
    </div>
  );
}

export default AdminVenues;