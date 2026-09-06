import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { FetchMenuItemsResponse, OwnerMenuItem } from "@/types/menuItems";
import type { FetchCategoriesResponse, OwnerCategory } from "@/types/category";
import api from "@/lib/api";
import MenuItemDialog from "./MenuItemDialog";

function OwnerMenuItems() {
  const [items, setItems] = useState<OwnerMenuItem[]>([]);
  const [categories, setCategories] = useState<OwnerCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<OwnerMenuItem | null>(null);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsRes, categoriesRes] = await Promise.all([
          api.get<FetchMenuItemsResponse>("/owner/menu-items"),
          api.get<FetchCategoriesResponse>("/owner/categories"),
        ]);
        setItems(itemsRes.data.data);
        setCategories(categoriesRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c._id === categoryId)?.name ?? "Unknown";
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Menu Items</h1>
        <Button onClick={openCreate}>+ Add Menu Item</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item._id}>
              <TableCell>
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-10 h-10 rounded object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded bg-gray-100" />
                )}
              </TableCell>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{getCategoryName(item.categoryId)}</TableCell>
              <TableCell>{item.price}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded text-xs ${item.isAvailable
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                    }`}
                >
                  {item.isAvailable ? "Available" : "Unavailable"}
                </span>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <button onClick={() => openEdit(item)} className="text-blue-600 text-sm cursor-pointer">Edit</button>
                <button className="text-red-600 text-sm cursor-pointer">Delete</button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <MenuItemDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        item={editTarget}
        categories={categories}
        onSaved={handleSaved}
      />
    </div>
  );
}

export default OwnerMenuItems;