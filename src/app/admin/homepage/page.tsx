"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Save, 
  Loader2, 
  Plus, 
  Trash2, 
  Smartphone,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  ExternalLink
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface HomepageConfig {
  id?: string;
  heroHeading: string;
  heroSubtitle: string;
  heroDescription?: string;
  heroCtaText: string;
  heroCtaUrl: string;
  heroImageUrl?: string;
  heroBackgroundUrl?: string;
  heroOverlay: boolean;
  showHero: boolean;
  featuredProductIds: string[];
  showFeaturedProducts: boolean;
  showCategories: boolean;
  showWhyChooseUs: boolean;
  showAboutSection: boolean;
  showTradeInSection: boolean;
  showAccessories: boolean;
  showReviews: boolean;
  showContactSection: boolean;
  isActive: boolean;
}

interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  buttonText?: string;
  buttonUrl?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  order: number;
}

interface TrustFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  isActive: boolean;
}

interface Product {
  id: string;
  name: string;
  model: string;
  condition: string;
  status: string;
}

export default function HomepagePage() {
  const [config, setConfig] = useState<HomepageConfig>({
    heroHeading: "Find Your Perfect iPhone",
    heroSubtitle: "Boxed. Pre-Owned. Second-Hand.",
    heroDescription: "Discover premium iPhones at the best prices in Masvingo",
    heroCtaText: "SHOP iPHONES",
    heroCtaUrl: "/iphones",
    heroOverlay: false,
    showHero: true,
    featuredProductIds: [],
    showFeaturedProducts: true,
    showCategories: true,
    showWhyChooseUs: true,
    showAboutSection: true,
    showTradeInSection: true,
    showAccessories: true,
    showReviews: true,
    showContactSection: true,
    isActive: true
  });
  
  const [banners, setBanners] = useState<Banner[]>([]);
  const [trustFeatures, setTrustFeatures] = useState<TrustFeature[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");
  const [bannerDialogOpen, setBannerDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  useEffect(() => {
    fetchHomepageData();
    fetchProducts();
  }, []);

  const fetchHomepageData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/admin/api/homepage");
      const data = await response.json();
      setConfig(data.config);
      setBanners(data.banners || []);
      setTrustFeatures(data.trustFeatures || []);
    } catch (error) {
      console.error("Error fetching homepage data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch("/admin/api/products?status=PUBLISHED&limit=100");
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/admin/api/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error("Failed to save homepage configuration");
      }

      alert("Homepage configuration saved successfully!");
    } catch (error) {
      console.error("Error saving homepage config:", error);
      alert("Failed to save homepage configuration");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof HomepageConfig, value: any) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const toggleFeaturedProduct = (productId: string) => {
    setConfig((prev) => {
      const featured = prev.featuredProductIds.includes(productId);
      return {
        ...prev,
        featuredProductIds: featured
          ? prev.featuredProductIds.filter((id) => id !== productId)
          : [...prev.featuredProductIds, productId]
      };
    });
  };

  const moveBannerOrder = (index: number, direction: "up" | "down") => {
    const newBanners = [...banners];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < newBanners.length) {
      [newBanners[index], newBanners[newIndex]] = [newBanners[newIndex], newBanners[index]];
      setBanners(newBanners);
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
          <h1 className="text-3xl font-bold text-[#EBE2C5] font-manrope">Homepage Management</h1>
          <p className="text-[#EBE2C5]/60">Manage homepage content and sections</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => window.open("/", "_blank")}
            className="border-[#CDB586] text-[#EBE2C5]"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5]"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-[#F7F5EF] border-[#CDB586]">
          <TabsTrigger value="hero" className="data-[state=active]:bg-[#CDB586] data-[state=active]:text-[#0E161B]">
            Hero Section
          </TabsTrigger>
          <TabsTrigger value="sections" className="data-[state=active]:bg-[#CDB586] data-[state=active]:text-[#0E161B]">
            Sections
          </TabsTrigger>
          <TabsTrigger value="featured" className="data-[state=active]:bg-[#CDB586] data-[state=active]:text-[#0E161B]">
            Featured Products
          </TabsTrigger>
          <TabsTrigger value="banners" className="data-[state=active]:bg-[#CDB586] data-[state=active]:text-[#0E161B]">
            Banners
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Card className="bg-[#F7F5EF] border-[#CDB586]">
            <CardHeader>
              <CardTitle className="text-[#0E161B]">Hero Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="showHero">Show Hero Section</Label>
                <Switch
                  id="showHero"
                  checked={config.showHero}
                  onCheckedChange={(checked) => handleChange("showHero", checked)}
                />
              </div>
              
              <div>
                <Label htmlFor="heroHeading">Heading</Label>
                <Input
                  id="heroHeading"
                  value={config.heroHeading}
                  onChange={(e) => handleChange("heroHeading", e.target.value)}
                  className="bg-white border-[#CDB586]"
                />
              </div>
              
              <div>
                <Label htmlFor="heroSubtitle">Subtitle</Label>
                <Input
                  id="heroSubtitle"
                  value={config.heroSubtitle}
                  onChange={(e) => handleChange("heroSubtitle", e.target.value)}
                  className="bg-white border-[#CDB586]"
                />
              </div>
              
              <div>
                <Label htmlFor="heroDescription">Description</Label>
                <Textarea
                  id="heroDescription"
                  value={config.heroDescription || ""}
                  onChange={(e) => handleChange("heroDescription", e.target.value)}
                  className="bg-white border-[#CDB586]"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="heroCtaText">CTA Button Text</Label>
                <Input
                  id="heroCtaText"
                  value={config.heroCtaText}
                  onChange={(e) => handleChange("heroCtaText", e.target.value)}
                  className="bg-white border-[#CDB586]"
                />
              </div>
              
              <div>
                <Label htmlFor="heroCtaUrl">CTA Button URL</Label>
                <Input
                  id="heroCtaUrl"
                  value={config.heroCtaUrl}
                  onChange={(e) => handleChange("heroCtaUrl", e.target.value)}
                  className="bg-white border-[#CDB586]"
                />
              </div>
              
              <div>
                <Label htmlFor="heroImageUrl">Hero Image URL</Label>
                <Input
                  id="heroImageUrl"
                  value={config.heroImageUrl || ""}
                  onChange={(e) => handleChange("heroImageUrl", e.target.value)}
                  placeholder="/uploads/media/hero-image.jpg"
                  className="bg-white border-[#CDB586]"
                />
              </div>
              
              <div>
                <Label htmlFor="heroBackgroundUrl">Background Image URL</Label>
                <Input
                  id="heroBackgroundUrl"
                  value={config.heroBackgroundUrl || ""}
                  onChange={(e) => handleChange("heroBackgroundUrl", e.target.value)}
                  placeholder="/uploads/media/background.jpg"
                  className="bg-white border-[#CDB586]"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="heroOverlay">Enable Overlay</Label>
                <Switch
                  id="heroOverlay"
                  checked={config.heroOverlay}
                  onCheckedChange={(checked) => handleChange("heroOverlay", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sections">
          <Card className="bg-[#F7F5EF] border-[#CDB586]">
            <CardHeader>
              <CardTitle className="text-[#0E161B]">Homepage Sections</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "showFeaturedProducts", label: "Featured Products" },
                { key: "showCategories", label: "Shop by Category" },
                { key: "showWhyChooseUs", label: "Why Choose Us" },
                { key: "showAboutSection", label: "About iPhone Hub" },
                { key: "showTradeInSection", label: "Trade-In Section" },
                { key: "showAccessories", label: "Accessories" },
                { key: "showReviews", label: "Customer Reviews" },
                { key: "showContactSection", label: "Contact Section" },
              ].map((section) => (
                <div key={section.key} className="flex items-center justify-between">
                  <Label htmlFor={section.key}>{section.label}</Label>
                  <Switch
                    id={section.key}
                    checked={config[section.key as keyof HomepageConfig] as boolean}
                    onCheckedChange={(checked) => handleChange(section.key as keyof HomepageConfig, checked)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="featured">
          <Card className="bg-[#F7F5EF] border-[#CDB586]">
            <CardHeader>
              <CardTitle className="text-[#0E161B]">Featured Products</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="showFeaturedProducts">Show Featured Products Section</Label>
                <Switch
                  id="showFeaturedProducts"
                  checked={config.showFeaturedProducts}
                  onCheckedChange={(checked) => handleChange("showFeaturedProducts", checked)}
                />
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-[#5F3C18]/60">Select products to feature on homepage:</p>
                {products.length === 0 ? (
                  <p className="text-sm text-[#5F3C18]/60">No published products available</p>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-3 bg-white border border-[#CDB586] rounded"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={config.featuredProductIds.includes(product.id)}
                            onChange={() => toggleFeaturedProduct(product.id)}
                            className="w-4 h-4 accent-[#CDB586]"
                          />
                          <div>
                            <p className="font-medium text-[#0E161B]">{product.name}</p>
                            <p className="text-sm text-[#5F3C18]/60">{product.model} • {product.condition}</p>
                          </div>
                        </div>
                        {config.featuredProductIds.includes(product.id) && (
                          <Badge className="bg-[#CDB586] text-[#0E161B]">Featured</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banners">
          <Card className="bg-[#F7F5EF] border-[#CDB586]">
            <CardHeader>
              <CardTitle className="text-[#0E161B]">Promotional Banners</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {banners.length === 0 ? (
                <div className="text-center py-8">
                  <ImageIcon className="h-12 w-12 mx-auto mb-4 text-[#CDB586]/40" />
                  <p className="text-[#5F3C18] mb-4">No banners yet</p>
                  <Button
                    onClick={() => setBannerDialogOpen(true)}
                    className="bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5]"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Banner
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {banners.map((banner, index) => (
                    <div
                      key={banner.id}
                      className="flex items-center gap-4 p-4 bg-white border border-[#CDB586] rounded"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-[#0E161B]">{banner.title}</p>
                        <p className="text-sm text-[#5F3C18]/60">{banner.subtitle}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => moveBannerOrder(index, "up")}
                          disabled={index === 0}
                          className="hover:bg-[#CDB586]/20"
                        >
                          <ArrowUp className="h-4 w-4 text-[#5F3C18]" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => moveBannerOrder(index, "down")}
                          disabled={index === banners.length - 1}
                          className="hover:bg-[#CDB586]/20"
                        >
                          <ArrowDown className="h-4 w-4 text-[#5F3C18]" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingBanner(banner);
                            setBannerDialogOpen(true);
                          }}
                          className="hover:bg-[#CDB586]/20"
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            if (confirm("Delete this banner?")) {
                              setBanners(banners.filter((b) => b.id !== banner.id));
                            }
                          }}
                          className="hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    onClick={() => setBannerDialogOpen(true)}
                    className="w-full bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5]"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Banner
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={bannerDialogOpen} onOpenChange={setBannerDialogOpen}>
        <DialogContent className="bg-[#F7F5EF] border-[#CDB586]">
          <DialogHeader>
            <DialogTitle className="text-[#0E161B]">
              {editingBanner ? "Edit Banner" : "Add Banner"}
            </DialogTitle>
          </DialogHeader>
          <BannerForm
            banner={editingBanner}
            onSave={(banner) => {
              if (editingBanner) {
                setBanners(banners.map((b) => b.id === banner.id ? banner : b));
              } else {
                setBanners([...banners, { ...banner, id: Date.now().toString(), order: banners.length }]);
              }
              setBannerDialogOpen(false);
              setEditingBanner(null);
            }}
            onCancel={() => {
              setBannerDialogOpen(false);
              setEditingBanner(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function BannerForm({ banner, onSave, onCancel }: { banner: Banner | null; onSave: (banner: Banner) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState<Partial<Banner>>(
    banner || {
      title: "",
      subtitle: "",
      imageUrl: "",
      buttonText: "",
      buttonUrl: "",
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isActive: true,
      order: 0
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Banner);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="bg-white border-[#CDB586]"
          required
        />
      </div>
      <div>
        <Label htmlFor="subtitle">Subtitle</Label>
        <Input
          id="subtitle"
          value={formData.subtitle || ""}
          onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
          className="bg-white border-[#CDB586]"
        />
      </div>
      <div>
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          className="bg-white border-[#CDB586]"
          required
        />
      </div>
      <div>
        <Label htmlFor="buttonText">Button Text</Label>
        <Input
          id="buttonText"
          value={formData.buttonText || ""}
          onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
          className="bg-white border-[#CDB586]"
        />
      </div>
      <div>
        <Label htmlFor="buttonUrl">Button URL</Label>
        <Input
          id="buttonUrl"
          value={formData.buttonUrl || ""}
          onChange={(e) => setFormData({ ...formData, buttonUrl: e.target.value })}
          className="bg-white border-[#CDB586]"
        />
      </div>
      <div>
        <Label htmlFor="startDate">Start Date</Label>
        <Input
          id="startDate"
          type="date"
          value={formData.startDate}
          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          className="bg-white border-[#CDB586]"
          required
        />
      </div>
      <div>
        <Label htmlFor="endDate">End Date</Label>
        <Input
          id="endDate"
          type="date"
          value={formData.endDate}
          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          className="bg-white border-[#CDB586]"
          required
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
          Save Banner
        </Button>
      </div>
    </form>
  );
}