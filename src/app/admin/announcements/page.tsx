"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  Eye, 
  Loader2,
  AlertTriangle,
  Package,
  Truck,
  Info,
  Zap,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

type Announcement = {
  id: string;
  message: string;
  type: 'PROMOTIONAL' | 'INFORMATIONAL' | 'STOCK' | 'DELIVERY' | 'URGENT';
  isActive: boolean;
  priority: number;
  startDate: string | null;
  endDate: string | null;
  scrollingSpeed: number;
  displayDuration: number;
  createdAt: string;
  updatedAt: string;
};

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    message: "",
    type: "INFORMATIONAL" as 'PROMOTIONAL' | 'INFORMATIONAL' | 'STOCK' | 'DELIVERY' | 'URGENT',
    isActive: true,
    priority: 0,
    startDate: "",
    endDate: "",
    scrollingSpeed: 30,
    displayDuration: 0
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/admin/api/announcements');
      const data = await response.json();
      setAnnouncements(data || []);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (id?: string) => {
    try {
      const url = id ? `/admin/api/announcements/${id}` : '/admin/api/announcements';
      const method = id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.details || "Failed to save");
      }

      await fetchAnnouncements();
      setEditingId(null);
      setFormData({
        message: "",
        type: "INFORMATIONAL",
        isActive: true,
        priority: 0,
        startDate: "",
        endDate: "",
        scrollingSpeed: 30,
        displayDuration: 0
      });
    } catch (error) {
      console.error("Error saving announcement:", error);
      alert(`Failed to save announcement: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    
    try {
      await fetch(`/admin/api/announcements/${id}`, { method: 'DELETE' });
      await fetchAnnouncements();
    } catch (error) {
      console.error("Error deleting announcement:", error);
      alert("Failed to delete announcement");
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingId(announcement.id);
    setFormData({
      message: announcement.message,
      type: announcement.type as 'PROMOTIONAL' | 'INFORMATIONAL' | 'STOCK' | 'DELIVERY' | 'URGENT',
      isActive: announcement.isActive,
      priority: announcement.priority,
      startDate: announcement.startDate ? announcement.startDate.split('T')[0] : "",
      endDate: announcement.endDate ? announcement.endDate.split('T')[0] : "",
      scrollingSpeed: announcement.scrollingSpeed,
      displayDuration: announcement.displayDuration
    });
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newAnnouncements = [...announcements];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newAnnouncements.length) return;
    
    const temp = newAnnouncements[index].priority;
    newAnnouncements[index].priority = newAnnouncements[targetIndex].priority;
    newAnnouncements[targetIndex].priority = temp;
    
    setAnnouncements(newAnnouncements);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PROMOTIONAL': return <Zap className="h-4 w-4" />;
      case 'STOCK': return <Package className="h-4 w-4" />;
      case 'DELIVERY': return <Truck className="h-4 w-4" />;
      case 'URGENT': return <AlertTriangle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'PROMOTIONAL': return 'bg-[#CDB586]/20 text-[#CDB586]';
      case 'STOCK': return 'bg-blue-100 text-blue-700';
      case 'DELIVERY': return 'bg-green-100 text-green-700';
      case 'URGENT': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#CDB586]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="Announcements"
        subtitle="Manage ticker announcements for the website"
      />

      {/* Quick Add Form */}
      <Card className="bg-white rounded-xl shadow-sm border border-[#CDB586]/20">
        <CardHeader>
          <CardTitle className="text-[#0E161B]">
            {editingId ? 'Edit Announcement' : 'Create New Announcement'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-[#5F3C18]">Message *</Label>
            <Input
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Enter announcement message..."
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-[#5F3C18]">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: any) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INFORMATIONAL">Informational</SelectItem>
                  <SelectItem value="PROMOTIONAL">Promotional</SelectItem>
                  <SelectItem value="STOCK">Stock</SelectItem>
                  <SelectItem value="DELIVERY">Delivery</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-[#5F3C18]">Priority</Label>
              <Input
                type="number"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                className="mt-1"
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-[#5F3C18]">Start Date</Label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-[#5F3C18]">End Date</Label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-[#5F3C18]">Scroll Speed (seconds)</Label>
              <Input
                type="number"
                value={formData.scrollingSpeed}
                onChange={(e) => setFormData({ ...formData, scrollingSpeed: parseInt(e.target.value) || 30 })}
                className="mt-1"
                placeholder="30"
              />
            </div>

            <div>
              <Label className="text-[#5F3C18]">Display Duration (0 = infinite)</Label>
              <Input
                type="number"
                value={formData.displayDuration}
                onChange={(e) => setFormData({ ...formData, displayDuration: parseInt(e.target.value) || 0 })}
                className="mt-1"
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
            <Label className="text-[#5F3C18]">Active</Label>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => handleSave(editingId || undefined)}
              className="bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5]"
            >
              <Save className="h-4 w-4 mr-2" />
              {editingId ? 'Update' : 'Create'}
            </Button>
            {editingId && (
              <Button
                variant="outline"
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    message: "",
                    type: "INFORMATIONAL" as 'PROMOTIONAL' | 'INFORMATIONAL' | 'STOCK' | 'DELIVERY' | 'URGENT',
                    isActive: true,
                    priority: 0,
                    startDate: "",
                    endDate: "",
                    scrollingSpeed: 30,
                    displayDuration: 0
                  });
                }}
                className="border-[#CDB586] text-[#CDB586]"
              >
                Cancel
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              className="border-[#CDB586] text-[#CDB586]"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      {showPreview && (
        <Card className="bg-[#0E161B] border border-[#CDB586]/30">
          <CardContent className="p-4">
            <div className="overflow-hidden whitespace-nowrap">
              <div 
                className="inline-block animate-marquee"
                style={{ animationDuration: `${formData.scrollingSpeed}s` }}
              >
                <span className="text-[#EBE2C5] text-sm">
                  {formData.message || "Your announcement will appear here..."}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Announcements List */}
      <Card className="bg-white rounded-xl shadow-sm border border-[#CDB586]/20">
        <CardHeader>
          <CardTitle className="text-[#0E161B]">All Announcements</CardTitle>
        </CardHeader>
        <CardContent>
          {announcements.length === 0 ? (
            <div className="text-center py-8 text-[#5F3C18]">
              No announcements yet. Create your first announcement above.
            </div>
          ) : (
            <div className="space-y-3">
              {announcements.map((announcement, index) => (
                <div
                  key={announcement.id}
                  className={`p-4 border border-[#CDB586]/20 rounded-lg ${
                    !announcement.isActive ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getTypeColor(announcement.type)}`}>
                          {getTypeIcon(announcement.type)}
                          {announcement.type}
                        </span>
                        {!announcement.isActive && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-[#0E161B] font-medium mb-2">{announcement.message}</p>
                      <div className="flex flex-wrap gap-4 text-xs text-[#5F3C18]">
                        <span>Priority: {announcement.priority}</span>
                        <span>Speed: {announcement.scrollingSpeed}s</span>
                        {announcement.startDate && <span>Start: {announcement.startDate.split('T')[0]}</span>}
                        {announcement.endDate && <span>End: {announcement.endDate.split('T')[0]}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => moveItem(index, 'up')}
                        disabled={index === 0}
                        className="h-8 w-8"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => moveItem(index, 'down')}
                        disabled={index === announcements.length - 1}
                        className="h-8 w-8"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(announcement)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(announcement.id)}
                        className="h-8 w-8 text-red-500 hover:text-red-700"
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
  );
}
