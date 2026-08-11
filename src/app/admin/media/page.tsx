"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  Upload,
  Search,
  Trash2,
  Copy,
  Download,
  Eye,
  Loader2,
  X,
  Image as ImageIcon,
  Filter
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MediaItem {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  metadata: {
    width?: number;
    height?: number;
    caption?: string | null;
  };
  alt: string | null;
  category: string;
  createdAt: string;
}

export default function MediaLibraryPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<Set<string>>(new Set());
  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadAlt, setUploadAlt] = useState("");
  const [uploadCaption, setUploadCaption] = useState("");

  useEffect(() => {
    fetchMedia();
  }, [search, typeFilter]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (typeFilter) params.append("type", typeFilter);

      const response = await fetch(`/admin/api/media?${params.toString()}`);
      const data = await response.json();
      
      console.log("Fetched media data:", data);
      
      // Map the API response to match the interface
      const mappedMedia = (data.media || []).map((item: any) => ({
        id: item.id,
        filename: item.filename,
        url: item.url,
        mimeType: item.mimeType || item.fileType || 'image/jpeg',
        size: item.size || item.fileSize || 0,
        metadata: item.metadata || { width: 0, height: 0 },
        alt: item.alt,
        category: item.category || 'OTHER',
        createdAt: item.createdAt
      }));
      
      setMedia(mappedMedia);
    } catch (error) {
      console.error("Error fetching media:", error);
      setMedia([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      if (uploadAlt) formData.append("alt", uploadAlt);
      if (uploadCaption) formData.append("caption", uploadCaption);

      const response = await fetch("/admin/api/media", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload media");
      }

      setUploadDialogOpen(false);
      setUploadFile(null);
      setUploadAlt("");
      setUploadCaption("");
      fetchMedia();
    } catch (error) {
      console.error("Error uploading media:", error);
      alert("Failed to upload media");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media?")) return;

    try {
      const response = await fetch(`/admin/api/media?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete media");
      }

      fetchMedia();
    } catch (error) {
      console.error("Error deleting media:", error);
      alert("Failed to delete media");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedMedia.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedMedia.size} media items?`)) return;

    try {
      for (const id of selectedMedia) {
        await fetch(`/admin/api/media?id=${id}`, {
          method: "DELETE",
        });
      }
      setSelectedMedia(new Set());
      fetchMedia();
    } catch (error) {
      console.error("Error deleting media:", error);
      alert("Failed to delete media");
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    alert("URL copied to clipboard");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const getFileTypeLabel = (type: string) => {
    if (!type) return "UNKNOWN";
    if (type.includes("jpeg") || type.includes("jpg")) return "JPEG";
    if (type.includes("png")) return "PNG";
    if (type.includes("webp")) return "WebP";
    if (type.includes("svg")) return "SVG";
    if (type.includes("gif")) return "GIF";
    return type.split("/")[1]?.toUpperCase() || "UNKNOWN";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#CDB586]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
        <div className="space-y-2 min-w-0 flex-1">
          <h1 className="text-3xl lg:text-4xl font-bold text-[#0E161B] font-manrope">Media Library</h1>
          <p className="text-[#5F3C18] text-base">Manage website media files</p>
        </div>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5] flex-shrink-0">
              <Upload className="h-4 w-4 mr-2" />
              Upload Media
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#F7F5EF] border-[#CDB586]/30">
            <DialogHeader>
              <DialogTitle className="text-[#0E161B]">Upload Media</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <Label htmlFor="file">File</Label>
                <Input
                  id="file"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  required
                  className="bg-white border-[#CDB586]"
                />
              </div>
              <div>
                <Label htmlFor="alt">Alt Text</Label>
                <Input
                  id="alt"
                  value={uploadAlt}
                  onChange={(e) => setUploadAlt(e.target.value)}
                  placeholder="Image description for accessibility"
                  className="bg-white border-[#CDB586]"
                />
              </div>
              <div>
                <Label htmlFor="caption">Caption</Label>
                <Input
                  id="caption"
                  value={uploadCaption}
                  onChange={(e) => setUploadCaption(e.target.value)}
                  placeholder="Optional caption"
                  className="bg-white border-[#CDB586]"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setUploadDialogOpen(false)}
                  className="border-[#CDB586] text-[#0E161B] flex-shrink-0"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!uploadFile || uploading}
                  className="bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5] flex-shrink-0"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Upload"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#CDB586]" />
              <Input
                placeholder="Search media..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-white border-[#CDB586]"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px] bg-white border-[#CDB586] flex-shrink-0">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="image/jpeg">JPEG</SelectItem>
                <SelectItem value="image/png">PNG</SelectItem>
                <SelectItem value="image/webp">WebP</SelectItem>
                <SelectItem value="image/svg+xml">SVG</SelectItem>
              </SelectContent>
            </Select>
            {selectedMedia.size > 0 && (
              <Button
                onClick={handleBulkDelete}
                variant="outline"
                className="bg-red-600 text-white hover:bg-red-700 border-red-600 flex-shrink-0"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete ({selectedMedia.size})
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {media.length === 0 && (
        <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
          <CardContent className="p-12 text-center">
            <ImageIcon className="h-12 w-12 mx-auto mb-4 text-[#CDB586]/40" />
            <p className="font-medium text-[#5F3C18] mb-2">No media files yet</p>
            <p className="text-[#5F3C18]/60 mb-4">Upload your first media file to get started</p>
            <Button
              onClick={() => setUploadDialogOpen(true)}
              className="bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5] flex-shrink-0"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Media
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Media Grid */}
      {media.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {media.map((item) => (
            <Card
              key={item.id}
              className={`bg-[#F7F5EF] border-[#CDB586] cursor-pointer transition-all hover:shadow-lg ${
                selectedMedia.has(item.id) ? "ring-2 ring-[#CDB586]" : ""
              }`}
              onClick={() => {
                setSelectedMedia((prev) => {
                  const newSet = new Set(prev);
                  if (newSet.has(item.id)) {
                    newSet.delete(item.id);
                  } else {
                    newSet.add(item.id);
                  }
                  return newSet;
                });
              }}
            >
              <div className="relative aspect-square">
                <img
                  src={item.url}
                  alt={item.alt || item.filename}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  <Badge className="bg-[#0E161B]/80 text-[#EBE2C5]">
                    {getFileTypeLabel(item.mimeType)}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-3">
                <p className="text-xs text-[#5F3C18] truncate mb-1">{item.filename}</p>
                <p className="text-xs text-[#5F3C18]/60">
                  {item.metadata?.width || 0}×{item.metadata?.height || 0} • {formatFileSize(item.size)}
                </p>
                <div className="flex gap-1 mt-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 hover:bg-[#CDB586]/20 flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewMedia(item);
                    }}
                  >
                    <Eye className="h-3 w-3 text-[#5F3C18]" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 hover:bg-[#CDB586]/20 flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(item.url);
                    }}
                  >
                    <Copy className="h-3 w-3 text-[#5F3C18]" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 hover:bg-red-100 flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3 text-red-600" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={!!previewMedia} onOpenChange={() => setPreviewMedia(null)}>
        <DialogContent className="bg-[#F7F5EF] border-[#CDB586] max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-[#0E161B]">{previewMedia?.filename}</DialogTitle>
          </DialogHeader>
          {previewMedia && (
            <div className="space-y-4">
              <img
                src={previewMedia.url}
                alt={previewMedia.alt || previewMedia.filename}
                className="w-full max-h-[60vh] object-contain bg-white rounded"
              />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-[#5F3C18]">Type</p>
                  <p className="text-[#5F3C18]/60">{getFileTypeLabel(previewMedia.mimeType)}</p>
                </div>
                <div>
                  <p className="font-medium text-[#5F3C18]">Size</p>
                  <p className="text-[#5F3C18]/60">{formatFileSize(previewMedia.size)}</p>
                </div>
                <div>
                  <p className="font-medium text-[#5F3C18]">Dimensions</p>
                  <p className="text-[#5F3C18]/60">{previewMedia.metadata?.width || 0}×{previewMedia.metadata?.height || 0}</p>
                </div>
                <div>
                  <p className="font-medium text-[#5F3C18]">URL</p>
                  <p className="text-[#5F3C18]/60 truncate">{previewMedia.url}</p>
                </div>
                {previewMedia.alt && (
                  <div className="col-span-2">
                    <p className="font-medium text-[#5F3C18]">Alt Text</p>
                    <p className="text-[#5F3C18]/60">{previewMedia.alt}</p>
                  </div>
                )}
                {previewMedia.metadata?.caption && (
                  <div className="col-span-2">
                    <p className="font-medium text-[#5F3C18]">Caption</p>
                    <p className="text-[#5F3C18]/60">{previewMedia.metadata.caption}</p>
                  </div>
                )}
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  onClick={() => copyToClipboard(previewMedia.url)}
                  className="bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5]"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy URL
                </Button>
                <Button
                  onClick={() => setPreviewMedia(null)}
                  variant="outline"
                  className="border-[#CDB586] text-[#0E161B]"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
