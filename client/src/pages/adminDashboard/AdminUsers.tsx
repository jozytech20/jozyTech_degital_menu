// src/pages/admin/Users.tsx
import { useEffect, useMemo, useState } from "react";
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
import {
  Pencil,
  Trash,
  Users,
  Building2,
  UserX,
  Search,
  RefreshCw,
  Loader2,
} from "lucide-react";
import DeleteUserDialog from "./DeleteUserDialog";
import EditUserDialog from "./EditUserDialog";
import { toast } from "@/components/ui/toast";

function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [editTarget, setEditTarget] = useState<AdminUser | null>(null);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setError("");
      setLoading(true);
      const response = await api.get<FetchUsersResponse>("/admin/users");
      setUsers(response.data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const term = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term)
    );
  });

  const { totalUsers, ownerCount, inactiveCount } = useMemo(
    () => ({
      totalUsers: users.length,
      ownerCount: users.filter((u) => u.role === "owner").length,
      inactiveCount: users.filter((u) => !u.isActive).length,
    }),
    [users],
  );

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.add({
        type: "success",
        description: "User has been deleted",
      });
    } catch (err) {
      console.error(err);
      toast.add({
        type: "error",
        description: "Failed to delete user",
      });
    }
  };

  const handleUserUpdated = (updatedUser: AdminUser) => {
    setUsers((prev) =>
      prev.map((u) => (u._id === updatedUser._id ? updatedUser : u)),
    );
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-gray-400" />
          <p className="text-sm text-gray-500">Loading users...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-red-100 mx-auto flex items-center justify-center">
            <UserX className="size-6 text-red-500" />
          </div>
          <p className="text-gray-900 font-medium">{error}</p>
          <button
            onClick={fetchUsers}
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
      label: "Total Users",
      value: totalUsers,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Owners",
      value: ownerCount,
      icon: Building2,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      label: "Inactive",
      value: inactiveCount,
      icon: UserX,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <p className="text-sm text-gray-500 mb-1">Dashboard &gt; Users</p>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
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
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/80">
              <TableHead className="font-semibold text-gray-600">
                User
              </TableHead>
              <TableHead className="font-semibold text-gray-600">
                Role
              </TableHead>
              <TableHead className="font-semibold text-gray-600">
                Email
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
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-gray-500 py-12"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Search className="size-8 text-gray-300" />
                    <p className="text-sm">
                      {search
                        ? "No users match your search"
                        : "No users found"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow
                  key={user._id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0"
                        style={{ background: "oklch(0.30 0.08 250)" }}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900">
                        {user.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === "superAdmin"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                        }`}
                    >
                      {user.role === "superAdmin" ? "Super Admin" : "Owner"}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-600">{user.email}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                        }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${user.isActive ? "bg-green-500" : "bg-red-500"
                          }`}
                      />
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setEditTarget(user)}
                        className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        aria-label={`Edit ${user.name}`}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(user)}
                        className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        aria-label={`Delete ${user.name}`}
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

      <EditUserDialog
        open={!!editTarget}
        onOpenChange={(open) => !open && setEditTarget(null)}
        user={editTarget}
        onUpdated={handleUserUpdated}
      />
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