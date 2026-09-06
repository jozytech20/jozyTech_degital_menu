import { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { FetchMenuItemsResponse, OwnerMenuItem } from "@/types/menuItems";
import type { FetchCategoriesResponse, OwnerCategory } from "@/types/category";
import api from "@/lib/api";
import MenuItemDialog from "./MenuItemDialog";
import { AxiosError } from "axios";
import { toast } from "@/components/ui/toast";
import {
  Pencil,
  Trash,
  TriangleAlert,
  UtensilsCrossed,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  Plus,
  ImageOff,
} from "lucide-react";
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

function OwnerMenuItems() {
  const [items, setItems] = useState<OwnerMenuItem[]>([]);
  const [categories, setCategories] = useState<OwnerCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<OwnerMenuItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<OwnerMenuItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { totalItems, availableItems, unavailableItems } = useMemo(
    () => ({
      totalItems: items.length,
      availableItems: items.filter((i) => i.isAvailable).length,
      unavailableItems: items.filter((i) => !i.isAvailable).length,
    }),
    [items],
  );

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      await api.delete(`/owner/menu-items/${deleteTarget._id}`);
      setItems((prev) => prev.filter((i) => i._id !== deleteTarget._id));
      setDeleteTarget(null);
      toast.add({ type: "success", description: "Menu item has been deleted" });
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? err.response?.data?.message
          : undefined;
      toast.add({ type: "error", description: message || "Failed to delete menu item" });
    } finally {
      setDeleting(false);
    }
  };

  const handleSaved = (savedItem: OwnerMenuItem) => {
    if (editTarget) {
      setItems((prev) => prev.map((i) => (i._id === savedItem._id ? savedItem : i)));
    } else {
      setItems((prev) => [savedItem, ...prev]);
    }
  };

  const openCreate = () => {
    setEditTarget(null);
    setDialogOpen(true);
  };

  const openEdit = (item: OwnerMenuItem) => {
    setEditTarget(item);
    setDialogOpen(true);
  };

  const fetchData = async () => {
    try {
      setError(null);
      setLoading(true);
      const [itemsRes, categoriesRes] = await Promise.all([
        api.get<FetchMenuItemsResponse>("/owner/menu-items"),
        api.get<FetchCategoriesResponse>("/owner/categories"),
      ]);
      setItems(itemsRes.data.data);
      setCategories(categoriesRes.data.data);
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? err.response?.data?.message
          : undefined;
      console.error(err);
      setError(message || "Failed to fetch menu items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c._id === categoryId)?.name ?? "Unknown";
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-gray-400" />
          <p className="text-sm text-gray-500">Loading menu items...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-red-100 mx-auto flex items-center justify-center">
            <UtensilsCrossed className="size-6 text-red-500" />
          </div>
          <p className="text-gray-900 font-medium">{error}</p>
          <button
            onClick={fetchData}
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
      label: "Total Items",
      value: totalItems,
      icon: UtensilsCrossed,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Available",
      value: availableItems,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Unavailable",
      value: unavailableItems,
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
          <p className="text-sm text-gray-500 mb-1">Dashboard &gt; Menu Items</p>
          <h1 className="text-lg font-bold text-gray-900">
            Menu Item Management
          </h1>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors cursor-pointer"
        >
          <Plus className="size-4" />
          Add Menu Item
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
                Category
              </TableHead>
              <TableHead className="font-semibold text-gray-600">
                Price
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
            {items.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-gray-500 py-12"
                >
                  <div className="flex flex-col items-center gap-2">
                    <UtensilsCrossed className="size-8 text-gray-300" />
                    <p className="text-sm">No menu items yet</p>
                    <p className="text-xs text-gray-400">
                      Click "Add Menu Item" to get started
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow
                  key={item._id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <TableCell>
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover border border-gray-100"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        <ImageOff className="size-4 text-gray-400" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">
                    {item.name}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {getCategoryName(item.categoryId)}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {item.price}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${item.isAvailable
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                        }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${item.isAvailable
                          ? "bg-green-500"
                          : "bg-gray-400"
                          }`}
                      />
                      {item.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(item)}
                        className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        aria-label={`Edit ${item.name}`}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(item)}
                        className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        aria-label={`Delete ${item.name}`}
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

      <MenuItemDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        item={editTarget}
        categories={categories}
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
                Delete menu item
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

export default OwnerMenuItems;