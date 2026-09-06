import { useEffect, useMemo, useState } from "react";
import api from "../../../lib/api";
import type { OwnerCategory, FetchCategoriesResponse } from "../../../types/category";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CategoryDialog from "./CategoryDialog";
import {
  Pencil,
  Trash,
  TriangleAlert,
  FolderTree,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  Plus,
  ImageOff,
  Layers,
} from "lucide-react";
import { toast } from "@/components/ui/toast";
import { AxiosError } from "axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/* ── brand palette (matching sidebar oklch tokens) ── */
const BRAND = {
  deep: "oklch(0.25 0.08 250)",
  mid: "oklch(0.35 0.08 250)",
  accent: "oklch(0.50 0.10 250)",
  bright: "oklch(0.65 0.15 250)",
  pale: "oklch(0.92 0.03 250)",
  surface: "oklch(0.97 0.01 250)",
};

function OwnerCategories() {
  const [categories, setCategories] = useState<OwnerCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<OwnerCategory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<OwnerCategory | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { totalCategories, activeCategories, inactiveCategories } = useMemo(
    () => ({
      totalCategories: categories.length,
      activeCategories: categories.filter((c) => c.isActive).length,
      inactiveCategories: categories.filter((c) => !c.isActive).length,
    }),
    [categories],
  );

  const handleSaved = (savedCategory: OwnerCategory) => {
    if (editTarget) {
      setCategories((prev) => prev.map((c) => (c._id === savedCategory._id ? savedCategory : c)));
    } else {
      setCategories((prev) => [savedCategory, ...prev]);
    }
  };

  const openCreate = () => {
    setEditTarget(null);
    setDialogOpen(true);
  };

  const openEdit = (category: OwnerCategory) => {
    setEditTarget(category);
    setDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      await api.delete(`/owner/categories/${deleteTarget._id}`);
      setCategories((prev) => prev.filter((c) => c._id !== deleteTarget._id));
      setDeleteTarget(null);
      toast.add({
        type: "success",
        description: "Category has been deleted",
      });
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? err.response?.data?.message
          : undefined;
      toast.add({
        type: "error",
        description: message || "Failed to delete category",
      });
    } finally {
      setDeleting(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await api.get<FetchCategoriesResponse>("/owner/categories");
      setCategories(response.data.data);
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? err.response?.data?.message
          : undefined;
      console.error(err);
      setError(message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ── Loading state ── */
  if (loading)
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center animate-pulse"
            style={{ background: BRAND.pale }}
          >
            <Loader2 className="size-6 animate-spin" style={{ color: BRAND.bright }} />
          </div>
          <p className="text-sm text-gray-400 font-medium">Loading categories…</p>
        </div>
      </div>
    );

  /* ── Error state ── */
  if (error)
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center space-y-4">
          <div
            className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center"
            style={{ background: "oklch(0.95 0.03 25)" }}
          >
            <FolderTree className="size-6" style={{ color: "oklch(0.55 0.20 25)" }} />
          </div>
          <p className="text-gray-900 font-semibold">{error}</p>
          <button
            onClick={fetchCategories}
            className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-xl border transition-all cursor-pointer hover:-translate-y-0.5 hover:shadow-md"
            style={{ borderColor: "oklch(0.88 0.02 250)", color: BRAND.deep }}
          >
            <RefreshCw className="size-3.5" />
            Try again
          </button>
        </div>
      </div>
    );

  const statCards = [
    {
      label: "Total Categories",
      value: totalCategories,
      icon: FolderTree,
      gradient: `linear-gradient(135deg, oklch(0.55 0.15 250), oklch(0.45 0.12 260))`,
    },
    {
      label: "Active",
      value: activeCategories,
      icon: CheckCircle2,
      gradient: `linear-gradient(135deg, oklch(0.55 0.16 155), oklch(0.45 0.13 165))`,
    },
    {
      label: "Inactive",
      value: inactiveCategories,
      icon: XCircle,
      gradient: `linear-gradient(135deg, oklch(0.65 0.16 80), oklch(0.55 0.14 70))`,
    },
  ];

  return (
    <div
      className="space-y-6 sm:p-6 max-w-7xl mx-auto min-h-screen"
      style={{ background: BRAND.surface }}
    >
      {/* ── Header ── */}
      <div
        className="rounded-2xl p-6 sm:p-8 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${BRAND.deep}, oklch(0.30 0.10 260))`,
        }}
      >
        {/* decorative shapes */}
        <div
          className="absolute -top-16 -right-16 w-56 h-56 rounded-full opacity-[0.08]"
          style={{ background: BRAND.bright }}
        />
        <div
          className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full opacity-[0.06]"
          style={{ background: BRAND.accent }}
        />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: BRAND.mid }}
            >
              <Layers className="size-5 text-white/80" />
            </div>
            <div>
              <p className="text-white/40 text-xs font-medium uppercase tracking-wider">
                Dashboard &gt; Categories
              </p>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Category Management
              </h1>
            </div>
          </div>

          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer hover:-translate-y-0.5 hover:shadow-lg"
            style={{
              background: BRAND.bright,
              color: "white",
            }}
          >
            <Plus className="size-4" />
            Add Category
          </button>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((stat, idx) => (
          <div
            key={stat.label}
            className="group relative rounded-2xl p-5 text-white overflow-hidden cursor-default transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            style={{
              background: stat.gradient,
              animationDelay: `${idx * 80}ms`,
            }}
          >
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.06] transition-colors duration-300" />
            <div className="relative z-10 flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-white/70 text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
              </div>
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                style={{ background: "rgba(255,255,255,0.15)" }}
              >
                <stat.icon className="size-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Table ── */}
      <div
        className="rounded-2xl border overflow-hidden transition-shadow duration-300 hover:shadow-lg"
        style={{
          background: "white",
          borderColor: "oklch(0.92 0.01 250)",
        }}
      >
        <Table>
          <TableHeader>
            <TableRow
              className="border-b"
              style={{ background: BRAND.pale, borderColor: "oklch(0.90 0.02 250)" }}
            >
              <TableHead
                className="font-semibold text-xs uppercase tracking-wider"
                style={{ color: "oklch(0.45 0.05 250)" }}
              >
                Image
              </TableHead>
              <TableHead
                className="font-semibold text-xs uppercase tracking-wider"
                style={{ color: "oklch(0.45 0.05 250)" }}
              >
                Name
              </TableHead>
              <TableHead
                className="font-semibold text-xs uppercase tracking-wider"
                style={{ color: "oklch(0.45 0.05 250)" }}
              >
                Description
              </TableHead>
              <TableHead
                className="font-semibold text-xs uppercase tracking-wider"
                style={{ color: "oklch(0.45 0.05 250)" }}
              >
                Status
              </TableHead>
              <TableHead
                className="text-right font-semibold text-xs uppercase tracking-wider"
                style={{ color: "oklch(0.45 0.05 250)" }}
              >
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-16"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center"
                      style={{ background: BRAND.pale }}
                    >
                      <FolderTree className="size-6" style={{ color: BRAND.accent }} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-600">No categories yet</p>
                      <p className="text-xs text-gray-400">
                        Click "Add Category" to get started
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow
                  key={category._id}
                  className="group transition-colors duration-200 border-b"
                  style={{
                    borderColor: "oklch(0.95 0.005 250)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = BRAND.pale;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "";
                  }}
                >
                  {/* Image – larger size */}
                  <TableCell>
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-14 h-14 rounded-xl object-cover ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center"
                        style={{ background: "oklch(0.95 0.01 250)" }}
                      >
                        <ImageOff className="size-5 text-gray-300" />
                      </div>
                    )}
                  </TableCell>

                  {/* Name */}
                  <TableCell className="font-semibold text-gray-900">
                    {category.name}
                  </TableCell>

                  {/* Description */}
                  <TableCell className="text-gray-500 text-sm max-w-xs truncate">
                    {category.description}
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                      style={
                        category.isActive
                          ? {
                              background: "oklch(0.95 0.04 155)",
                              color: "oklch(0.40 0.12 155)",
                            }
                          : {
                              background: "oklch(0.95 0.01 250)",
                              color: "oklch(0.50 0 0)",
                            }
                      }
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background: category.isActive
                            ? "oklch(0.55 0.16 155)"
                            : "oklch(0.70 0 0)",
                        }}
                      />
                      {category.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(category)}
                        className="p-2 rounded-xl transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
                        style={{ color: "oklch(0.55 0.05 250)" }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.background = BRAND.pale;
                          (e.currentTarget as HTMLElement).style.color = BRAND.bright;
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.background = "";
                          (e.currentTarget as HTMLElement).style.color = "oklch(0.55 0.05 250)";
                        }}
                        aria-label={`Edit ${category.name}`}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(category)}
                        className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
                        aria-label={`Delete ${category.name}`}
                      >
                        <Trash size={15} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={editTarget}
        onSaved={handleSaved}
      />

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open && !deleting) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader className="items-center gap-4 sm:flex-row sm:items-start">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-destructive/10">
              <TriangleAlert className="size-5 text-destructive" />
            </div>
            <div className="flex flex-col gap-1 text-center sm:text-left">
              <AlertDialogTitle className="text-base font-semibold">
                Delete category
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm leading-relaxed">
                Are you sure you want to delete{" "}
                <span className="font-medium text-foreground">"{deleteTarget?.name}"</span>?
                This action is permanent and cannot be undone.
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default OwnerCategories;