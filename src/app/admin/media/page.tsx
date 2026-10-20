"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Upload,
  Search,
  Loader2,
  Image as ImageIcon,
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
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadAlt, setUploadAlt] = useState("");
  const [uploadCaption, setUploadCaption] = useState("");
  const [uploadCategory, setUploadCategory] = useState("PRODUCT");

  useEffect(() => {
    fetchMedia();
  }, [search]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);

      const response = await fetch(`/admin/api/media?${params.toString()}`);
      const data = await response.json();
      
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
      formData.append("category", uploadCategory);

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
      setUploadCategory("PRODUCT");
      fetchMedia();
    } catch (error) {
      console.error("Error uploading media:", error);
      alert("Failed to upload media");
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="w-full max-w-full p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#0E161B]">Media Library</h1>
            <p className="text-[#5F3C18] mt-1">Manage website media files</p>
          </div>
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5]">
                <Upload className="h-4 w-4 mr-2" />
                Upload Media
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#F7F5EF] border-[#CDB586]/30 max-w-2xl">
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={uploadCategory} onValueChange={setUploadCategory}>
                      <SelectTrigger className="bg-white border-[#CDB586]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PRODUCT">Product</SelectItem>
                        <SelectItem value="HERO">Hero</SelectItem>
                        <SelectItem value="BLOG">Blog</SelectItem>
                        <SelectItem value="CEO">CEO</SelectItem>
                        <SelectItem value="LOGO">Logo</SelectItem>
                        <SelectItem value="BANNER">Banner</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
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
                <div className="flex gap-2 justify-end pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setUploadDialogOpen(false)}
                    className="border-[#CDB586] text-[#0E161B]"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!uploadFile || uploading}
                    className="bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5]"
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

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#CDB586]" />
          <Input
            placeholder="Search media..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white border-[#CDB586]"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64 bg-white rounded-xl border border-[#CDB586]/20">
            <Loader2 className="h-8 w-8 animate-spin text-[#CDB586]" />
          </div>
        ) : media.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#CDB586]/20 p-8 text-center">
            <div className="h-16 w-16 rounded-full bg-[#CDB586]/10 flex items-center justify-center mx-auto mb-6">
              <ImageIcon className="h-8 w-8 text-[#CDB586]" />
            </div>
            <h3 className="text-xl font-semibold text-[#0E161B] mb-2">No media files yet</h3>
            <p className="text-[#5F3C18] mb-6">Upload your first media file to get started</p>
            <Button
              onClick={() => setUploadDialogOpen(true)}
              className="bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5]"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Media
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#CDB586]/20 p-6">
            <h3 className="text-lg font-semibold text-[#0E161B] mb-4">Media Files ({media.length})</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {media.slice(0, 12).map((item) => (
                <div key={item.id} className="relative aspect-square bg-[#F7F5EF] rounded-lg overflow-hidden">
                  <img
                    src={item.url}
                    alt={item.alt || item.filename}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2">
                    <p className="text-xs text-white truncate">{item.filename}</p>
                  </div>
                </div>
              ))}
            </div>
            {media.length > 12 && (
              <p className="text-center text-sm text-[#5F3C18] pt-4">
                And {media.length - 12} more media files...
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
