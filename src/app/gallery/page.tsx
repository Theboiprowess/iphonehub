"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/section-header";
import { Search, Download, Eye, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

export default function GalleryPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  useEffect(() => {
    fetchMedia();
  }, [search, categoryFilter]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (categoryFilter) params.append("type", categoryFilter);

      const response = await fetch(`/api/media?${params.toString()}`);
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#CDB586] mx-auto mb-4" />
          <p className="text-gray-600">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 section-spacing">
      <div className="site-container">
        <SectionHeader 
          title="Photo Gallery"
          subtitle="Browse our collection of product photos and store images"
        />

        {/* Search and Filters */}
        <div className="mb-8 space-y-4 mt-12">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search gallery..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Select
              value={categoryFilter}
              onValueChange={setCategoryFilter}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                <SelectItem value="PRODUCT">Products</SelectItem>
                <SelectItem value="HERO">Hero Images</SelectItem>
                <SelectItem value="STORE">Store Photos</SelectItem>
                <SelectItem value="CEO">CEO Photos</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Gallery Grid */}
        <div>
          {media.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No images found in the gallery.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {media.map((item) => (
              <Card key={item.id} className="group overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedMedia(item)}>
                <CardContent className="p-0">
                  <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200">
                    <img
                      src={item.url}
                      alt={item.alt || item.filename}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Badge className="bg-black/50 text-white">
                        {getFileTypeLabel(item.mimeType)}
                      </Badge>
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Eye className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-medium text-gray-900 truncate mb-1">{item.filename}</p>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>{item.metadata?.width || 0}×{item.metadata?.height || 0}</span>
                      <span>{formatFileSize(item.size)}</span>
                    </div>
                    {item.metadata?.caption && (
                      <p className="text-xs text-gray-600 mt-2 line-clamp-2">{item.metadata.caption}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        </div>
      </div>

      {/* Image Preview Dialog */}
      <Dialog open={!!selectedMedia} onOpenChange={() => setSelectedMedia(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedMedia?.filename}</DialogTitle>
          </DialogHeader>
          {selectedMedia && (
            <div className="space-y-4">
              <div className="aspect-video bg-white rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.alt || selectedMedia.filename}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Type</p>
                  <p className="text-gray-600">{getFileTypeLabel(selectedMedia.mimeType)}</p>
                </div>
                <div>
                  <p className="font-medium">Size</p>
                  <p className="text-gray-600">{formatFileSize(selectedMedia.size)}</p>
                </div>
                <div>
                  <p className="font-medium">Dimensions</p>
                  <p className="text-gray-600">{selectedMedia.metadata?.width || 0}×{selectedMedia.metadata?.height || 0}</p>
                </div>
                <div>
                  <p className="font-medium">Category</p>
                  <p className="text-gray-600">{selectedMedia.category}</p>
                </div>
                {selectedMedia.alt && (
                  <div className="col-span-2">
                    <p className="font-medium">Alt Text</p>
                    <p className="text-gray-600">{selectedMedia.alt}</p>
                  </div>
                )}
                {selectedMedia.metadata?.caption && (
                  <div className="col-span-2">
                    <p className="font-medium">Caption</p>
                    <p className="text-gray-600">{selectedMedia.metadata.caption}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
