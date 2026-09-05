// src/pages/admin/Users.tsx
import { useEffect, useState } from "react";
import api from "../../lib/api";
import type { AdminUser, FetchUsersResponse } from "../../types/user";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash } from "lucide-react";
import DeleteUserDialog from "./DeleteUserDialog";

function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get<FetchUsersResponse>("/admin/users");
        setUsers(response.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()),
  );

  const totalUsers = users.length;
  const ownerCount = users.filter((u) => u.role === "owner").length;
  const inactiveCount = users.filter((u) => !u.isActive).length;


  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-bold">Dashboard &gt; Users</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="border rounded-lg p-4">
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="text-2xl font-bold">{totalUsers}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-gray-500">Owners</p>
          <p className="text-2xl font-bold">{ownerCount}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-gray-500">Inactive Users</p>
          <p className="text-2xl font-bold">{inactiveCount}</p>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded px-3 py-2 w-full max-w-sm"
      />

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user._id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    user.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-500 text-gray-200"
                  }`}
                >
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </TableCell>
              <TableCell className="text-right space-x-5">
                <button className="text-blue-600 text-sm cursor-pointer">
                  <Pencil size={15} />
                </button>
                <button
                  className="text-red-600 text-sm cursor-pointer"
                  onClick={() => setDeleteTarget(user)}
                >
                  <Trash size={15} />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <DeleteUserDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        userName={deleteTarget?.name ?? ""}
        onConfirm={() => deleteTarget && handleDelete(deleteTarget._id)}
      />
    </div>
  );
}

export default AdminUsers;