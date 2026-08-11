"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  UserCog, 
  Plus, 
  Trash2, 
  Edit
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

export default function AdminUsersPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "ADMIN",
  });

  const roles = [
    { value: "SUPER_ADMIN", label: "Super Admin", color: "bg-purple-100 text-purple-800" },
    { value: "ADMIN", label: "Admin", color: "bg-blue-100 text-blue-800" },
    { value: "CONTENT_MANAGER", label: "Content Manager", color: "bg-green-100 text-green-800" },
    { value: "INVENTORY_MANAGER", label: "Inventory Manager", color: "bg-orange-100 text-orange-800" },
    { value: "ORDER_MANAGER", label: "Order Manager", color: "bg-yellow-100 text-yellow-800" },
  ];

  const fetchAdmins = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/admin/api/admin-users");
      if (!response.ok) {
        throw new Error("Failed to fetch admin users");
      }
      const data = await response.json();
      setAdmins(data.admins);
    } catch (err: any) {
      setError(err.message || "Failed to fetch admin users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreate = async () => {
    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      setError("All fields are required");
      return;
    }

    setUpdating(true);
    try {
      const response = await fetch("/admin/api/admin-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create admin user");
      }
      await fetchAdmins();
      setDialogOpen(false);
      setFormData({ name: "", email: "", password: "", role: "ADMIN" });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedAdmin) return;

    setUpdating(true);
    try {
      const response = await fetch("/admin/api/admin-users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedAdmin.id,
          ...formData,
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update admin user");
      }
      await fetchAdmins();
      setDialogOpen(false);
      setSelectedAdmin(null);
      setFormData({ name: "", email: "", password: "", role: "ADMIN" });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this admin user?")) return;

    setUpdating(true);
    try {
      const response = await fetch(`/admin/api/admin-users?id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete admin user");
      }
      await fetchAdmins();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleToggleActive = async (admin: AdminUser) => {
    // Skip toggle since isActive field doesn't exist in User model
    return;
  };

  const openCreateDialog = () => {
    setSelectedAdmin(null);
    setFormData({ name: "", email: "", password: "", role: "ADMIN" });
    setDialogOpen(true);
  };

  const openEditDialog = (admin: AdminUser) => {
    setSelectedAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      password: "",
      role: admin.role,
    });
    setDialogOpen(true);
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = roles.find((r) => r.value === role);
    return roleConfig?.color || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <AdminPageHeader title="Admin Users" subtitle="Manage admin user accounts" />
        <div className="flex items-center justify-center h-64">
          <div className="text-[#5F3C18]">Loading admin users...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader title="Admin Users" subtitle="Manage admin user accounts" />

      {error && (
        <div className="p-4 bg-red-900/50 border border-red-500 rounded text-red-200">
          {error}
        </div>
      )}

      <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Admin Users ({admins.length})</CardTitle>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openCreateDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Admin
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{selectedAdmin ? "Edit Admin User" : "Create Admin User"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      disabled={updating}
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="admin@example.com"
                      disabled={updating}
                    />
                  </div>
                  <div>
                    <Label>Password {selectedAdmin && "(leave blank to keep current)"}</Label>
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder={selectedAdmin ? "••••••••" : "••••••••"}
                      disabled={updating}
                    />
                  </div>
                  <div>
                    <Label>Role</Label>
                    <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={selectedAdmin ? handleUpdate : handleCreate}
                    disabled={updating}
                    className="w-full"
                  >
                    {selectedAdmin ? "Update Admin" : "Create Admin"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {admins.length === 0 ? (
            <div className="text-center py-12 text-[#5F3C18]/60">
              <UserCog className="h-12 w-12 mx-auto mb-4 text-[#CDB586]/40" />
              <p>No admin users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#CDB586]/20">
                    <th className="text-left p-4 font-semibold text-[#0E161B]">Name</th>
                    <th className="text-left p-4 font-semibold text-[#0E161B]">Email</th>
                    <th className="text-left p-4 font-semibold text-[#0E161B]">Role</th>
                    <th className="text-left p-4 font-semibold text-[#0E161B]">Created</th>
                    <th className="text-right p-4 font-semibold text-[#0E161B]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin) => (
                    <tr key={admin.id} className="border-b border-[#CDB586]/10 hover:bg-[#CDB586]/5">
                      <td className="p-4">
                        <div className="font-medium text-[#0E161B]">{admin.name}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-[#5F3C18]">{admin.email}</div>
                      </td>
                      <td className="p-4">
                        <Badge className={getRoleBadge(admin.role)}>
                          {admin.role.replace(/_/g, " ")}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-[#5F3C18]">
                          {new Date(admin.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(admin)}
                            disabled={updating}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(admin.id)}
                            disabled={updating}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
