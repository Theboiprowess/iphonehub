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
import { useParams } from "next/navigation";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);
  
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
    const loadParams = async () => {
      const resolvedParams = await params;
      const id = Array.isArray(resolvedParams.id) ? resolvedParams.id[0] : resolvedParams.id;
      if (id) {
        setProductId(id);
        fetchProduct(id);
      }
      fetchCategories();
    };
    loadParams();
  }, [params]);

  const fetchProduct = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/admin/api/products/${id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          name: data.name || "",
          model: data.model || "",
          categoryId: data.categoryId || "",
          condition: data.condition || "BOXED",
          description: data.description || "",
          isFeatured: data.isFeatured || false,
          isActive: data.isActive !== false,
          status: data.status || "DRAFT",
          metaTitle: data.metaTitle || "",
          metaDescription: data.metaDescription || "",
          variants: (data.variants || []).map((v: any) => ({
            storage: v.storage || "",
            colour: v.colour || "",
            price: v.price?.toString() || "",
            comparePrice: v.comparePrice?.toString() || "",
            costPrice: v.costPrice?.toString() || "",
            sku: v.sku || "",
            stock: v.stock?.toString() || "0",
            reserved: v.reserved?.toString() || "0",
            isActive: v.isActive !== false
          })),
          images: data.images || [],
          devices: (data.devices || []).map((d: any) => ({
            variantId: d.variantId || "",
            imei: d.imei || "",
            serialNumber: d.serialNumber || "",
            modelNumber: d.modelNumber || "",
            region: d.region || "",
            simType: d.simType || "",
            esimSupport: d.esimSupport || false,
            networkStatus: d.networkStatus || "",
            activationStatus: d.activationStatus || "",
            icloudStatus: d.icloudStatus || "",
            repairHistory: d.repairHistory || "",
            screenCondition: d.screenCondition || "",
            bodyCondition: d.bodyCondition || "",
            cameraCondition: d.cameraCondition || "",
            faceIdStatus: d.faceIdStatus || "",
            touchFunctionality: d.touchFunctionality || "",
            chargingPortCondition: d.chargingPortCondition || "",
            batteryHealth: d.batteryHealth?.toString() || "",
            condition: d.condition || "",
            notes: d.notes || "",
            price: d.price?.toString() || "",
            isSold: d.isSold || false,
            isReserved: d.isReserved || false
          }))
        });
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/admin/api/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const currentImageCount = formData.images?.length || 0;
      const uploadPromises = Array.from(files).map(async (file, index) => {
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);

        const response = await fetch("/admin/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (!response.ok) throw new Error("Failed to upload image");

        const data = await response.json();
        return {
          url: data.url,
          alt: file.name,
          order: currentImageCount + index,
          type: "MAIN"
        };
      });

      const uploadedImages = await Promise.all(uploadPromises);
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...uploadedImages]
      }));
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
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
      ]
    }));
  };

  const removeVariant = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const updateVariant = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.map((v, i) =>
        i === index ? { ...v, [field]: value } : v
      )
    }));
  };

  const addDevice = () => {
    setFormData((prev) => ({
      ...prev,
      devices: [
        ...prev.devices,
        {
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
        }
      ]
    }));
  };

  const removeDevice = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      devices: prev.devices.filter((_, i) => i !== index)
    }));
  };

  const updateDevice = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      devices: prev.devices.map((d, i) =>
        i === index ? { ...d, [field]: value } : d
      )
    }));
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (status: string = "DRAFT") => {
    if (!validateForm() || !productId) return;

    setSaving(true);
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

      const response = await fetch(`/admin/api/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "EDIT", ...submitData })
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Product update error:", error);
        throw new Error(error.error || "Failed to update product");
      }

      const product = await response.json();
      router.push("/admin/products");
    } catch (error) {
      console.error("Error updating product:", error);
      alert(error instanceof Error ? error.message : "Failed to update product");
    } finally {
      setSaving(false);
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-[#EBE2C5] font-manrope">Edit iPhone</h1>
            <p className="text-[#EBE2C5]/60">Update product details</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleSubmit("DRAFT")}
            disabled={saving}
            className="border-[#CDB586] text-[#CDB586] hover:bg-[#CDB586]/10"
          >
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save as Draft
          </Button>
          <Button
            onClick={() => handleSubmit("PUBLISHED")}
            disabled={saving}
            className="bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5]"
          >
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Eye className="h-4 w-4 mr-2" />}
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
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>}
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
                      <SelectItem value="BOXED">Boxed</SelectItem>
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
                  className="bg-white border-[#CDB586]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Variants */}
          <Card className="bg-[#F7F5EF] border-[#CDB586]">
            <CardHeader>
              <CardTitle className="text-[#0E161B]">Variants</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.variants.map((variant, index) => (
                <div key={index} className="p-4 border border-[#CDB586] rounded space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-[#0E161B]">Variant {index + 1}</h3>
                    {formData.variants.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVariant(index)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-[#5F3C18]">Storage *</Label>
                      <Input
                        value={variant.storage}
                        onChange={(e) => updateVariant(index, "storage", e.target.value)}
                        className={errors[`variant-${index}-storage`] ? "border-red-500" : ""}
                      />
                      {errors[`variant-${index}-storage`] && <p className="text-red-500 text-sm mt-1">{errors[`variant-${index}-storage`]}</p>}
                    </div>
                    <div>
                      <Label className="text-[#5F3C18]">Colour *</Label>
                      <Input
                        value={variant.colour}
                        onChange={(e) => updateVariant(index, "colour", e.target.value)}
                        className={errors[`variant-${index}-colour`] ? "border-red-500" : ""}
                      />
                      {errors[`variant-${index}-colour`] && <p className="text-red-500 text-sm mt-1">{errors[`variant-${index}-colour`]}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-[#5F3C18]">Price *</Label>
                      <Input
                        type="number"
                        value={variant.price}
                        onChange={(e) => updateVariant(index, "price", e.target.value)}
                        className={errors[`variant-${index}-price`] ? "border-red-500" : ""}
                      />
                      {errors[`variant-${index}-price`] && <p className="text-red-500 text-sm mt-1">{errors[`variant-${index}-price`]}</p>}
                    </div>
                    <div>
                      <Label className="text-[#5F3C18]">Compare Price</Label>
                      <Input
                        type="number"
                        value={variant.comparePrice}
                        onChange={(e) => updateVariant(index, "comparePrice", e.target.value)}
                        placeholder="Optional"
                      />
                    </div>
                    <div>
                      <Label className="text-[#5F3C18]">Cost Price</Label>
                      <Input
                        type="number"
                        value={variant.costPrice}
                        onChange={(e) => updateVariant(index, "costPrice", e.target.value)}
                        placeholder="Optional"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
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
                        className={errors[`variant-${index}-stock`] ? "border-red-500" : ""}
                      />
                      {errors[`variant-${index}-stock`] && <p className="text-red-500 text-sm mt-1">{errors[`variant-${index}-stock`]}</p>}
                    </div>
                    <div>
                      <Label className="text-[#5F3C18]">Reserved</Label>
                      <Input
                        type="number"
                        value={variant.reserved}
                        onChange={(e) => updateVariant(index, "reserved", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addVariant}
                className="w-full border-[#CDB586] text-[#CDB586] hover:bg-[#CDB586]/10"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Variant
              </Button>
            </CardContent>
          </Card>

          {/* Product Images */}
          <Card className="bg-[#F7F5EF] border-[#CDB586]">
            <CardHeader>
              <CardTitle className="text-[#0E161B]">Product Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-[#CDB586] rounded-lg p-8 text-center">
                <input
                  type="file"
                  id="image-upload"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload className="h-8 w-8 text-[#CDB586]" />
                  <span className="text-[#5F3C18]">
                    {uploading ? "Uploading..." : "Click to upload images"}
                  </span>
                  <span className="text-xs text-[#5F3C18]/60">
                    JPEG, PNG, WebP (max 5MB)
                  </span>
                </label>
              </div>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-32 object-cover rounded border border-[#CDB586]"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-600 text-white hover:bg-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {errors.images && <p className="text-red-500 text-sm">{errors.images}</p>}
            </CardContent>
          </Card>

          {/* Individual Devices (for pre-owned/second-hand) */}
          {formData.condition !== "BOXED" && (
            <Card className="bg-[#F7F5EF] border-[#CDB586]">
              <CardHeader>
                <CardTitle className="text-[#0E161B]">Individual Devices</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.devices.map((device, index) => (
                  <div key={index} className="p-4 border border-[#CDB586] rounded space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-[#0E161B]">Device {index + 1}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDevice(index)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="IMEI"
                        value={device.imei}
                        onChange={(e) => updateDevice(index, "imei", e.target.value)}
                      />
                      <Input
                        placeholder="Serial Number"
                        value={device.serialNumber}
                        onChange={(e) => updateDevice(index, "serialNumber", e.target.value)}
                      />
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addDevice}
                  className="w-full border-[#CDB586] text-[#CDB586] hover:bg-[#CDB586]/10"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Device
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Product Settings */}
          <Card className="bg-[#F7F5EF] border-[#CDB586]">
            <CardHeader>
              <CardTitle className="text-[#0E161B]">Product Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-[#5F3C18]">Featured Product</Label>
                <div className="relative inline-block w-10 h-6">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-[#0E161B]/30 rounded-full peer peer-checked:bg-[#CDB586] transition-colors cursor-pointer"></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-[#5F3C18]">Active</Label>
                <div className="relative inline-block w-10 h-6">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-[#0E161B]/30 rounded-full peer peer-checked:bg-[#CDB586] transition-colors cursor-pointer"></div>
                </div>
              </div>

              <div>
                <Label className="text-[#5F3C18]">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger className="bg-white border-[#CDB586]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="HIDDEN">Hidden</SelectItem>
                    <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
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
                  className="bg-white border-[#CDB586]"
                />
              </div>
              <div>
                <Label className="text-[#5F3C18]">Meta Description</Label>
                <Textarea
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  placeholder="SEO description"
                  rows={3}
                  className="bg-white border-[#CDB586]"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}