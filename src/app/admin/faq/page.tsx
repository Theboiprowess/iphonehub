"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Trash2, 
  Edit, 
  Loader2,
  ArrowUp,
  ArrowDown,
  Search,
  Filter
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isPublished: boolean;
}

const FAQ_CATEGORIES = [
  "BUYING",
  "PRODUCTS",
  "BOXED_IPHONES",
  "PRE_OWNED",
  "SECOND_HAND",
  "BATTERY_HEALTH",
  "DELIVERY",
  "PAYMENTS",
  "WARRANTY",
  "RETURNS",
  "TRADE_IN",
  "GENERAL"
];

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);

  useEffect(() => {
    fetchFAQs();
  }, [search, categoryFilter]);

  const fetchFAQs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (categoryFilter) params.append("category", categoryFilter);

      const response = await fetch(`/admin/api/faq?${params.toString()}`);
      const data = await response.json();
      setFaqs(data || []);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (faqData: Partial<FAQ>) => {
    try {
      const url = editingFAQ ? "/admin/api/faq" : "/admin/api/faq";
      const method = editingFAQ ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingFAQ ? { ...faqData, id: editingFAQ.id } : faqData),
      });

      if (!response.ok) {
        throw new Error("Failed to save FAQ");
      }

      setDialogOpen(false);
      setEditingFAQ(null);
      fetchFAQs();
    } catch (error) {
      console.error("Error saving FAQ:", error);
      alert("Failed to save FAQ");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;

    try {
      const response = await fetch(`/admin/api/faq?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete FAQ");
      }

      fetchFAQs();
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      alert("Failed to delete FAQ");
    }
  };

  const moveFAQOrder = (index: number, direction: "up" | "down") => {
    const newFaqs = [...faqs];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < newFaqs.length) {
      [newFaqs[index], newFaqs[newIndex]] = [newFaqs[newIndex], newFaqs[index]];
      setFaqs(newFaqs);
      
      // Update order in database
      newFaqs.forEach((faq, i) => {
        fetch("/admin/api/faq", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: faq.id, order: i }),
        });
      });
    }
  };

  const togglePublished = async (id: string, isPublished: boolean) => {
    try {
      const response = await fetch("/admin/api/faq", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isPublished: !isPublished }),
      });

      if (!response.ok) {
        throw new Error("Failed to update FAQ");
      }

      fetchFAQs();
    } catch (error) {
      console.error("Error updating FAQ:", error);
      alert("Failed to update FAQ");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#CDB586]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#EBE2C5] font-manrope">FAQ Management</h1>
          <p className="text-[#EBE2C5]/60">Manage frequently asked questions</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5]">
              <Plus className="h-4 w-4 mr-2" />
              Add FAQ
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#F7F5EF] border-[#CDB586] max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-[#0E161B]">
                {editingFAQ ? "Edit FAQ" : "Add FAQ"}
              </DialogTitle>
            </DialogHeader>
            <FAQForm
              faq={editingFAQ}
            onSave={handleSave}
            onCancel={() => {
              setDialogOpen(false);
              setEditingFAQ(null);
            }}
          />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="bg-[#F7F5EF] border-[#CDB586]">
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#CDB586]" />
              <Input
                placeholder="Search FAQs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-white border-[#CDB586]"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[200px] bg-white border-[#CDB586]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {FAQ_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {faqs.length === 0 && (
        <Card className="bg-[#F7F5EF] border-[#CDB586]">
          <CardContent className="p-12 text-center">
            <p className="font-medium text-[#5F3C18] mb-2">No FAQs yet</p>
            <p className="text-[#5F3C18]/60 mb-4">Create your first FAQ to get started</p>
            <Button
              onClick={() => setDialogOpen(true)}
              className="bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add FAQ
            </Button>
          </CardContent>
        </Card>
      )}

      {/* FAQ List */}
      {faqs.length > 0 && (
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={faq.id} className="bg-[#F7F5EF] border-[#CDB586]">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-[#CDB586] text-[#0E161B]">
                        {faq.category.replace(/_/g, " ")}
                      </Badge>
                      {faq.isPublished ? (
                        <Badge className="bg-green-100 text-green-800">Published</Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800">Draft</Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-[#0E161B] mb-1">{faq.question}</h3>
                    <p className="text-sm text-[#5F3C18]/60">{faq.answer}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => moveFAQOrder(index, "up")}
                      disabled={index === 0}
                      className="hover:bg-[#CDB586]/20"
                    >
                      <ArrowUp className="h-4 w-4 text-[#5F3C18]" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => moveFAQOrder(index, "down")}
                      disabled={index === faqs.length - 1}
                      className="hover:bg-[#CDB586]/20"
                    >
                      <ArrowDown className="h-4 w-4 text-[#5F3C18]" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => togglePublished(faq.id, faq.isPublished)}
                      className="hover:bg-[#CDB586]/20"
                    >
                      {faq.isPublished ? "Unpublish" : "Publish"}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingFAQ(faq);
                        setDialogOpen(true);
                      }}
                      className="hover:bg-[#CDB586]/20"
                    >
                      <Edit className="h-4 w-4 text-[#5F3C18]" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(faq.id)}
                      className="hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function FAQForm({ faq, onSave, onCancel }: { faq: FAQ | null; onSave: (faq: Partial<FAQ>) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState<Partial<FAQ>>(
    faq || {
      question: "",
      answer: "",
      category: "GENERAL",
      order: 0,
      isPublished: false
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="question">Question</Label>
        <Input
          id="question"
          value={formData.question}
          onChange={(e) => setFormData({ ...formData, question: e.target.value })}
          className="bg-white border-[#CDB586]"
          required
        />
      </div>
      <div>
        <Label htmlFor="answer">Answer</Label>
        <Textarea
          id="answer"
          value={formData.answer}
          onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
          className="bg-white border-[#CDB586]"
          rows={4}
          required
        />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => setFormData({ ...formData, category: value })}
        >
          <SelectTrigger className="bg-white border-[#CDB586]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FAQ_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="isPublished">Published</Label>
        <Switch
          id="isPublished"
          checked={formData.isPublished}
          onCheckedChange={(checked) => setFormData({ ...formData, isPublished: checked })}
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-[#CDB586] text-[#0E161B]"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5]"
        >
          Save FAQ
        </Button>
      </div>
    </form>
  );
}