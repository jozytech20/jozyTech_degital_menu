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

  if (loading)
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-gray-400" />
          <p className="text-sm text-gray-500">Loading categories...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-red-100 mx-auto flex items-center justify-center">
            <FolderTree className="size-6 text-red-500" />
          </div>
          <p className="text-gray-900 font-medium">{error}</p>
          <button
            onClick={fetchCategories}
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
      label: "Total Categories",
      value: totalCategories,
      icon: FolderTree,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Active",
      value: activeCategories,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Inactive",
      value: inactiveCategories,
      icon: XCircle,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="space-y-6 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">Dashboard &gt; Categories</p>
          <h1 className="text-lg font-bold text-gray-900">
            Category Management
          </h1>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors cursor-pointer"
        >
          <Plus className="size-4" />
          Add Category
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

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/80">
              <TableHead className="font-semibold text-gray-600">
                Image
              </TableHead>
              <TableHead className="font-semibold text-gray-600">
                Name
              </TableHead>
              <TableHead className="font-semibold text-gray-600">
                Description
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
            {categories.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-gray-500 py-12"
                >
                  <div className="flex flex-col items-center gap-2">
                    <FolderTree className="size-8 text-gray-300" />
                    <p className="text-sm">No categories yet</p>
                    <p className="text-xs text-gray-400">
                      Click "Add Category" to get started
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow
                  key={category._id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <TableCell>
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-10 h-10 rounded-lg object-cover border border-gray-100"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        <ImageOff className="size-4 text-gray-400" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">
                    {category.name}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {category.description}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${category.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                        }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${category.isActive
                          ? "bg-green-500"
                          : "bg-gray-400"
                          }`}
                      />
                      {category.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(category)}
                        className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        aria-label={`Edit ${category.name}`}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(category)}
                        className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
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