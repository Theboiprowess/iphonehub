"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Smartphone, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Clock,
  Star
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPageContainer } from "@/components/admin/admin-page-container";

type EcoCashAccount = {
  id: string;
  name: string;
  phoneNumber: string;
  isActive: boolean;
  isDefault: boolean;
  notes?: string;
  _count: {
    payments: number;
    transactions: number;
  };
};

export default function EcoCashAccountsPage() {
  const [accounts, setAccounts] = useState<EcoCashAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<EcoCashAccount | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    isActive: true,
    isDefault: false,
    notes: "",
  });

  // Fetch accounts
  const fetchAccounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/admin/api/ecocash-accounts");
      if (!response.ok) {
        throw new Error("Failed to fetch accounts");
      }
      const data = await response.json();
      setAccounts(data.accounts);
    } catch (err: any) {
      setError(err.message || "Failed to fetch accounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      phoneNumber: "",
      isActive: true,
      isDefault: false,
      notes: "",
    });
    setEditingAccount(null);
  };

  // Open dialog for new account
  const handleNew = () => {
    resetForm();
    setDialogOpen(true);
  };

  // Open dialog for editing
  const handleEdit = (account: EcoCashAccount) => {
    setEditingAccount(account);
    setFormData({
      name: account.name,
      phoneNumber: account.phoneNumber,
      isActive: account.isActive,
      isDefault: account.isDefault,
      notes: account.notes || "",
    });
    setDialogOpen(true);
  };

  // Save account
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const url = editingAccount
        ? `/admin/api/ecocash-accounts/${editingAccount.id}`
        : "/admin/api/ecocash-accounts";
      const method = editingAccount ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save account");
      }

      setDialogOpen(false);
      resetForm();
      fetchAccounts();
    } catch (err: any) {
      setError(err.message || "Failed to save account");
    } finally {
      setSaving(false);
    }
  };

  // Delete account
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this account?")) {
      return;
    }

    try {
      const response = await fetch(`/admin/api/ecocash-accounts/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete account");
      }

      fetchAccounts();
    } catch (err: any) {
      alert(err.message || "Failed to delete account");
    }
  };

  return (
    <AdminPageContainer>
      <div className="space-y-8">
        <AdminPageHeader 
          title="EcoCash Receiving Accounts" 
          subtitle="Manage EcoCash payment receiving accounts"
        />

        {error && (
          <div className="p-4 bg-red-900/50 border border-red-500 rounded text-red-200">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleNew}>
                <Plus className="h-4 w-4 mr-2" />
                Add Account
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingAccount ? "Edit Account" : "Add New Account"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <Label htmlFor="name">Account Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., CEO 1 - Artwell"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phoneNumber">EcoCash Number *</Label>
                  <Input
                    id="phoneNumber"
                    placeholder="e.g., 0773227172"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isDefault"
                    checked={formData.isDefault}
                    onCheckedChange={(checked) => setFormData({ ...formData, isDefault: checked })}
                  />
                  <Label htmlFor="isDefault">Default Account</Label>
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Optional notes about this account"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Accounts List */}
        <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
          <CardHeader>
            <CardTitle>Receiving Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-[#5F3C18]/60">Loading...</div>
            ) : accounts.length === 0 ? (
              <div className="text-center py-12 text-[#5F3C18]/60">
                <Smartphone className="h-12 w-12 mx-auto mb-4 text-[#CDB586]/40" />
                <p>No EcoCash accounts configured</p>
              </div>
            ) : (
              <div className="space-y-4">
                {accounts.map((account) => (
                  <div
                    key={account.id}
                    className="bg-white border border-[#CDB586]/20 rounded-lg p-4 hover:border-[#CDB586]/40 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-[#0E161B]">{account.name}</h3>
                          {account.isDefault && (
                            <Badge className="bg-[#CDB586] text-[#0E161B]">
                              <Star className="h-3 w-3 mr-1" />
                              Default
                            </Badge>
                          )}
                          {account.isActive ? (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-800">
                              <XCircle className="h-3 w-3 mr-1" />
                              Inactive
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2 text-[#5F3C18]">
                            <Smartphone className="h-4 w-4" />
                            <span className="font-medium">{account.phoneNumber}</span>
                          </div>
                          {account.notes && (
                            <p className="text-[#5F3C18]/60">{account.notes}</p>
                          )}
                          <div className="flex gap-4 text-[#5F3C18]/60 mt-2">
                            <span>{account._count.payments} payments</span>
                            <span>{account._count.transactions} transactions</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(account)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(account.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminPageContainer>
  );
}
