"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Plus, 
  Trash2, 
  Save, 
  Eye, 
  Smartphone,
  Image as ImageIcon,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  
  // Product form state
  const [formData, setFormData] = useState({
    name: "",
    model: "",
    categoryId: "",
    condition: "BOXED",
    description: "",
    isFeatured: false,
    isActive: true,
    status: "DRAFT",
    metaTitle: "",
    metaDescription: "",
    variants: [
      {
        storage: "",
        colour: "",
        price: "",
        comparePrice: "",
        costPrice: "",
        sku: "",
        stock: "0",
        reserved: "0",
        isActive: true
      }
    ],
    images: [] as any[],
    devices: [] as any[]
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/admin/api/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data || []);
        
        if (data.length === 0) {
          setErrors(prev => ({ ...prev, categoryId: "No categories available. Please create categories first." }));
        }
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleImageUpload = async (file: File, type: string = "MAIN") => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "product");

      const response = await fetch("/admin/api/upload", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, {
          url: data.url,
          alt: file.name,
          type,
          order: prev.images.length
        }]
      }));
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleImageDelete = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleImageReorder = (fromIndex: number, toIndex: number) => {
    setFormData(prev => {
      const newImages = [...prev.images];
      const [moved] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, moved);
      return {
        ...prev,
        images: newImages.map((img, i) => ({ ...img, order: i }))
      };
    });
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, {
        storage: "",
        colour: "",
        price: "",
        comparePrice: "",
        costPrice: "",
        sku: "",
        stock: "0",
        reserved: "0",
        isActive: true
      }]
    }));
  };

  const removeVariant = (index: number) => {
    if (formData.variants.length > 1) {
      setFormData(prev => ({
        ...prev,
        variants: prev.variants.filter((_, i) => i !== index)
      }));
    }
  };

  const updateVariant = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((v, i) => 
        i === index ? { ...v, [field]: value } : v
      )
    }));
  };

  const addDevice = () => {
    setFormData(prev => ({
      ...prev,
      devices: [...prev.devices, {
        variantId: "",
        imei: "",
        serialNumber: "",
        modelNumber: "",
        region: "",
        simType: "",
        esimSupport: false,
        networkStatus: "",
        activationStatus: "",
        icloudStatus: "",
        repairHistory: "",
        screenCondition: "",
        bodyCondition: "",
        cameraCondition: "",
        faceIdStatus: "",
        touchFunctionality: "",
        chargingPortCondition: "",
        batteryHealth: "",
        condition: "",
        notes: "",
        price: "",
        isSold: false,
        isReserved: false
      }]
    }));
  };

  const removeDevice = (index: number) => {
    setFormData(prev => ({
      ...prev,
      devices: prev.devices.filter((_, i) => i !== index)
    }));
  };

  const updateDevice = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      devices: prev.devices.map((d, i) => 
        i === index ? { ...d, [field]: value } : d
      )
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.model.trim()) newErrors.model = "Model is required";
    if (!formData.categoryId) newErrors.categoryId = "Category is required";
    if (!formData.condition) newErrors.condition = "Condition is required";

    formData.variants.forEach((variant, index) => {
      if (!variant.storage.trim()) newErrors[`variant-${index}-storage`] = "Storage is required";
      if (!variant.colour.trim()) newErrors[`variant-${index}-colour`] = "Colour is required";
      if (!variant.price || parseFloat(variant.price) <= 0) {
        newErrors[`variant-${index}-price`] = "Price must be positive";
      }
      if (parseInt(variant.stock) < 0) {
        newErrors[`variant-${index}-stock`] = "Stock cannot be negative";
      }
    });

    if (formData.status === "PUBLISHED" && formData.images.length === 0) {
      newErrors.images = "At least one image is required for published products";
    }

    if (formData.condition !== "BOXED") {
      formData.devices.forEach((device, index) => {
        if (device.batteryHealth && (device.batteryHealth < 0 || device.batteryHealth > 100)) {
          newErrors[`device-${index}-battery`] = "Battery health must be between 0 and 100";
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (status: string = "DRAFT") => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        status,
        variants: formData.variants.map(v => ({
          ...v,
          price: parseFloat(v.price),
          comparePrice: v.comparePrice ? parseFloat(v.comparePrice) : null,
          costPrice: v.costPrice ? parseFloat(v.costPrice) : null,
          stock: parseInt(v.stock),
          reserved: parseInt(v.reserved)
        })),
        devices: formData.devices.map(d => ({
          ...d,
          price: d.price ? parseFloat(d.price) : null,
          batteryHealth: d.batteryHealth ? parseInt(d.batteryHealth) : null
        }))
      };

      const response = await fetch("/admin/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData)
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Product creation error:", error);
        throw new Error(error.error || "Failed to create product");
      }

      const product = await response.json();
      router.push(`/admin/products`);
    } catch (error) {
      console.error("Error creating product:", error);
      alert(error instanceof Error ? error.message : "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-[#EBE2C5] font-manrope">Add New iPhone</h1>
            <p className="text-[#EBE2C5]/60">Create a new product listing</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleSubmit("DRAFT")}
            disabled={loading}
            className="border-[#CDB586] text-[#CDB586] hover:bg-[#CDB586]/10"
          >
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save as Draft
          </Button>
          <Button
            onClick={() => handleSubmit("PUBLISHED")}
            disabled={loading}
            className="bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5]"
          >
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Eye className="h-4 w-4 mr-2" />}
            Publish Product
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="bg-[#F7F5EF] border-[#CDB586]">
            <CardHeader>
              <CardTitle className="text-[#0E161B]">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-[#5F3C18]">Product Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., iPhone 15 Pro Max 256GB"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label className="text-[#5F3C18]">Model *</Label>
                <Input
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="e.g., iPhone 15 Pro Max"
                  className={errors.model ? "border-red-500" : ""}
                />
                {errors.model && <p className="text-red-500 text-sm mt-1">{errors.model}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-[#5F3C18]">Category *</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                  >
                    <SelectTrigger className={errors.categoryId ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.length === 0 ? (
                        <div className="p-2 text-sm text-[#5F3C18]/60">
                          No categories available
                        </div>
                      ) : (
                        categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>}
                  {categories.length === 0 && (
                    <Link href="/admin/categories" className="text-sm text-[#CDB586] hover:underline mt-1 block">
                      Create categories first →
                    </Link>
                  )}
                </div>

                <div>
                  <Label className="text-[#5F3C18]">Condition *</Label>
                  <Select
                    value={formData.condition}
                    onValueChange={(value) => setFormData({ ...formData, condition: value })}
                  >
                    <SelectTrigger className={errors.condition ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BOXED">Boxed / Brand New</SelectItem>
                      <SelectItem value="PRE_OWNED">Pre-Owned</SelectItem>
                      <SelectItem value="SECOND_HAND">Second-Hand</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.condition && <p className="text-red-500 text-sm mt-1">{errors.condition}</p>}
                </div>
              </div>

              <div>
                <Label className="text-[#5F3C18]">Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Product description..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Variants */}
          <Card className="bg-[#F7F5EF] border-[#CDB586]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-[#0E161B]">Variants</CardTitle>
              <Button onClick={addVariant} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Variant
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.variants.map((variant, index) => (
                <div key={index} className="p-4 border border-[#CDB586]/30 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-[#0E161B]">Variant {index + 1}</h4>
                    {formData.variants.length > 1 && (
                      <Button
                        onClick={() => removeVariant(index)}
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-[#5F3C18]">Storage *</Label>
                      <Input
                        value={variant.storage}
                        onChange={(e) => updateVariant(index, "storage", e.target.value)}
                        placeholder="e.g., 256GB"
                        className={errors[`variant-${index}-storage`] ? "border-red-500" : ""}
                      />
                      {errors[`variant-${index}-storage`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`variant-${index}-storage`]}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-[#5F3C18]">Colour *</Label>
                      <Input
                        value={variant.colour}
                        onChange={(e) => updateVariant(index, "colour", e.target.value)}
                        placeholder="e.g., Natural Titanium"
                        className={errors[`variant-${index}-colour`] ? "border-red-500" : ""}
                      />
                      {errors[`variant-${index}-colour`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`variant-${index}-colour`]}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label className="text-[#5F3C18]">Price *</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={variant.price}
                        onChange={(e) => updateVariant(index, "price", e.target.value)}
                        placeholder="0.00"
                        className={errors[`variant-${index}-price`] ? "border-red-500" : ""}
                      />
                      {errors[`variant-${index}-price`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`variant-${index}-price`]}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-[#5F3C18]">Compare Price</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={variant.comparePrice}
                        onChange={(e) => updateVariant(index, "comparePrice", e.target.value)}
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <Label className="text-[#5F3C18]">Cost Price</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={variant.costPrice}
                        onChange={(e) => updateVariant(index, "costPrice", e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label className="text-[#5F3C18]">SKU</Label>
                      <Input
                        value={variant.sku}
                        onChange={(e) => updateVariant(index, "sku", e.target.value)}
                        placeholder="Unique SKU"
                      />
                    </div>

                    <div>
                      <Label className="text-[#5F3C18]">Stock *</Label>
                      <Input
                        type="number"
                        value={variant.stock}
                        onChange={(e) => updateVariant(index, "stock", e.target.value)}
                        placeholder="0"
                        className={errors[`variant-${index}-stock`] ? "border-red-500" : ""}
                      />
                      {errors[`variant-${index}-stock`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`variant-${index}-stock`]}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-[#5F3C18]">Reserved</Label>
                      <Input
                        type="number"
                        value={variant.reserved}
                        onChange={(e) => updateVariant(index, "reserved", e.target.value)}
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Individual Devices (for pre-owned/second-hand) */}
          {formData.condition !== "BOXED" && (
            <Card className="bg-[#F7F5EF] border-[#CDB586]">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-[#0E161B]">Individual Devices</CardTitle>
                <Button onClick={addDevice} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Device
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.devices.map((device, index) => (
                  <div key={index} className="p-4 border border-[#CDB586]/30 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-[#0E161B]">Device {index + 1}</h4>
                      <Button
                        onClick={() => removeDevice(index)}
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-[#5F3C18]">IMEI (Admin Only)</Label>
                        <Input
                          value={device.imei}
                          onChange={(e) => updateDevice(index, "imei", e.target.value)}
                          placeholder="IMEI number"
                        />
                      </div>

                      <div>
                        <Label className="text-[#5F3C18]">Serial Number (Admin Only)</Label>
                        <Input
                          value={device.serialNumber}
                          onChange={(e) => updateDevice(index, "serialNumber", e.target.value)}
                          placeholder="Serial number"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-[#5F3C18]">Battery Health %</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={device.batteryHealth}
                        onChange={(e) => updateDevice(index, "batteryHealth", e.target.value)}
                        placeholder="e.g., 94"
                        className={errors[`device-${index}-battery`] ? "border-red-500" : ""}
                      />
                      {errors[`device-${index}-battery`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`device-${index}-battery`]}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-[#5F3C18]">Condition</Label>
                      <Input
                        value={device.condition}
                        onChange={(e) => updateDevice(index, "condition", e.target.value)}
                        placeholder="e.g., Excellent, Very Good, Good"
                      />
                    </div>

                    <div>
                      <Label className="text-[#5F3C18]">Device Price</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={device.price}
                        onChange={(e) => updateDevice(index, "price", e.target.value)}
                        placeholder="Individual device price"
                      />
                    </div>

                    <div>
                      <Label className="text-[#5F3C18]">Notes</Label>
                      <Textarea
                        value={device.notes}
                        onChange={(e) => updateDevice(index, "notes", e.target.value)}
                        placeholder="Additional device notes..."
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Images */}
          <Card className="bg-[#F7F5EF] border-[#CDB586]">
            <CardHeader>
              <CardTitle className="text-[#0E161B]">Product Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-[#CDB586]/30 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="image-upload"
                  className="hidden"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    files.forEach(file => handleImageUpload(file, "MAIN"));
                  }}
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <ImageIcon className="h-8 w-8 mx-auto text-[#CDB586] mb-2" />
                  <p className="text-sm text-[#5F3C18]">
                    {uploading ? "Uploading..." : "Click to upload images"}
                  </p>
                  <p className="text-xs text-[#5F3C18]/60 mt-1">
                    JPEG, PNG, WebP (max 5MB)
                  </p>
                </label>
              </div>

              {errors.images && (
                <p className="text-red-500 text-sm">{errors.images}</p>
              )}

              {formData.images.length > 0 && (
                <div className="space-y-2">
                  {formData.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative group border border-[#CDB586]/30 rounded-lg overflow-hidden"
                    >
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleImageDelete(index)}
                          className="text-white hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Badge className="absolute top-2 left-2 bg-[#CDB586] text-[#0E161B]">
                        {image.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Settings */}
          <Card className="bg-[#F7F5EF] border-[#CDB586]">
            <CardHeader>
              <CardTitle className="text-[#0E161B]">Product Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-[#5F3C18]">Featured Product</Label>
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-[#5F3C18]">Active</Label>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
              </div>

              <div>
                <Label className="text-[#5F3C18]">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="HIDDEN">Hidden</SelectItem>
                    <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* SEO */}
          <Card className="bg-[#F7F5EF] border-[#CDB586]">
            <CardHeader>
              <CardTitle className="text-[#0E161B]">SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-[#5F3C18]">Meta Title</Label>
                <Input
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  placeholder="SEO title"
                />
              </div>

              <div>
                <Label className="text-[#5F3C18]">Meta Description</Label>
                <Textarea
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  placeholder="SEO description"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}