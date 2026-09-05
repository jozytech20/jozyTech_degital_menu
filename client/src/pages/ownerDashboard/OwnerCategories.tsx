// src/pages/owner/Categories.tsx
import { useEffect, useState } from "react";
import api from "../../lib/api";
import type { OwnerCategory, FetchCategoriesResponse } from "../../types/category";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import CategoryDialog from "./CategoryDialog";

function OwnerCategories() {
  const [categories, setCategories] = useState<OwnerCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<OwnerCategory | null>(null);

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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get<FetchCategoriesResponse>("/owner/categories");
        setCategories(response.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Button onClick={openCreate}>+ Add Category</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category._id}>
              <TableCell>
                {category.image ? (
                  <img src={category.image} alt={category.name} className="w-10 h-10 rounded object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded bg-gray-100" />
                )}
              </TableCell>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell className="text-gray-500">{category.description}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded text-xs ${category.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                    }`}
                >
                  {category.isActive ? "Active" : "Inactive"}
                </span>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <button onClick={() => openEdit(category)} className="text-blue-600 text-sm cursor-pointer">Edit</button>
                <button className="text-red-600 text-sm cursor-pointer">Delete</button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={editTarget}
        onSaved={handleSaved}
      />
    </div>
  );
}

export default OwnerCategories;