"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Save, Loader2, Globe, Smartphone, Palette, Shield } from "lucide-react";

interface WebsiteSettings {
  id?: string;
  siteName: string;
  logo?: string;
  favicon?: string;
  contactEmail: string;
  contactPhone: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  ogImage?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  whatsappNumber?: string;
  primaryColor?: string;
  secondaryColor?: string;
  buttonStyle?: string;
  currency: string;
  language: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<WebsiteSettings>({
    siteName: "iPhone Hub Masvingo",
    contactEmail: "info@iphonehubmasvingo.co.zw",
    contactPhone: "0773227172",
    currency: "USD",
    language: "en"
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch("/admin/api/settings");
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/admin/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof WebsiteSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
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
          <h1 className="text-3xl font-bold text-[#EBE2C5] font-manrope">Website Settings</h1>
          <p className="text-[#EBE2C5]/60">Manage website configuration</p>
        </div>
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
              Save Settings
            </>
          )}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-[#F7F5EF] border-[#CDB586]">
          <TabsTrigger value="general" className="data-[state=active]:bg-[#CDB586] data-[state=active]:text-[#0E161B]">
            <Globe className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="seo" className="data-[state=active]:bg-[#CDB586] data-[state=active]:text-[#0E161B]">
            <Smartphone className="h-4 w-4 mr-2" />
            SEO
          </TabsTrigger>
          <TabsTrigger value="social" className="data-[state=active]:bg-[#CDB586] data-[state=active]:text-[#0E161B]">
            <Shield className="h-4 w-4 mr-2" />
            Social
          </TabsTrigger>
          <TabsTrigger value="appearance" className="data-[state=active]:bg-[#CDB586] data-[state=active]:text-[#0E161B]">
            <Palette className="h-4 w-4 mr-2" />
            Appearance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="bg-[#F7F5EF] border-[#CDB586]">
            <CardHeader>
              <CardTitle className="text-[#0E161B]">General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => handleChange("siteName", e.target.value)}
                  className="bg-white border-[#CDB586]"
                />
              </div>
              <div>
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => handleChange("contactEmail", e.target.value)}
                  className="bg-white border-[#CDB586]"
                />
              </div>
              <div>
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  value={settings.contactPhone}
                  onChange={(e) => handleChange("contactPhone", e.target.value)}
                  className="bg-white border-[#CDB586]"
                />
              </div>
              <div>
                <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                <Input
                  id="whatsappNumber"
                  value={settings.whatsappNumber || ""}
                  onChange={(e) => handleChange("whatsappNumber", e.target.value)}
                  className="bg-white border-[#CDB586]"
                />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  value={settings.currency}
                  onChange={(e) => handleChange("currency", e.target.value)}
                  className="bg-white border-[#CDB586]"
                />
              </div>
              <div>
                <Label htmlFor="language">Language</Label>
                <Input
                  id="language"
                  value={settings.language}
                  onChange={(e) => handleChange("language", e.target.value)}
                  className="bg-white border-[#CDB586]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo">
          <Card className="bg-[#F7F5EF] border-[#CDB586]">
            <CardHeader>
              <CardTitle className="text-[#0E161B]">SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  id="seoTitle"
                  value={settings.seoTitle || ""}
                  onChange={(e) => handleChange("seoTitle", e.target.value)}
                  placeholder="iPhone Hub Masvingo - Premium iPhones"
                  className="bg-white border-[#CDB586]"
                />
              </div>
              <div>
                <Label htmlFor="seoDescription">Meta Description</Label>
                <Textarea
                  id="seoDescription"
                  value={settings.seoDescription || ""}
                  onChange={(e) => handleChange("seoDescription", e.target.value)}
                  placeholder="Your trusted source for premium boxed, pre-owned, and second-hand iPhones in Masvingo, Zimbabwe."
                  className="bg-white border-[#CDB586]"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="seoKeywords">SEO Keywords</Label>
                <Textarea
                  id="seoKeywords"
                  value={settings.seoKeywords || ""}
                  onChange={(e) => handleChange("seoKeywords", e.target.value)}
                  placeholder="iPhone, Apple, Masvingo, Zimbabwe, boxed iPhones, pre-owned iPhones"
                  className="bg-white border-[#CDB586]"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="ogImage">Open Graph Image</Label>
                <Input
                  id="ogImage"
                  value={settings.ogImage || ""}
                  onChange={(e) => handleChange("ogImage", e.target.value)}
                  placeholder="/uploads/media/og-image.jpg"
                  className="bg-white border-[#CDB586]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card className="bg-[#F7F5EF] border-[#CDB586]">
            <CardHeader>
              <CardTitle className="text-[#0E161B]">Social Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="facebookUrl">Facebook URL</Label>
                <Input
                  id="facebookUrl"
                  value={settings.facebookUrl || ""}
                  onChange={(e) => handleChange("facebookUrl", e.target.value)}
                  placeholder="https://facebook.com/iphonehubmasvingo"
                  className="bg-white border-[#CDB586]"
                />
              </div>
              <div>
                <Label htmlFor="instagramUrl">Instagram URL</Label>
                <Input
                  id="instagramUrl"
                  value={settings.instagramUrl || ""}
                  onChange={(e) => handleChange("instagramUrl", e.target.value)}
                  placeholder="https://instagram.com/iphonehubmasvingo"
                  className="bg-white border-[#CDB586]"
                />
              </div>
              <div>
                <Label htmlFor="tiktokUrl">TikTok URL</Label>
                <Input
                  id="tiktokUrl"
                  value={settings.tiktokUrl || ""}
                  onChange={(e) => handleChange("tiktokUrl", e.target.value)}
                  placeholder="https://tiktok.com/@iphonehubmasvingo"
                  className="bg-white border-[#CDB586]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card className="bg-[#F7F5EF] border-[#CDB586]">
            <CardHeader>
              <CardTitle className="text-[#0E161B]">Appearance Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={settings.primaryColor || "#0D161B"}
                    onChange={(e) => handleChange("primaryColor", e.target.value)}
                    className="w-20 h-10 border-[#CDB586]"
                  />
                  <Input
                    value={settings.primaryColor || "#0D161B"}
                    onChange={(e) => handleChange("primaryColor", e.target.value)}
                    className="flex-1 bg-white border-[#CDB586]"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={settings.secondaryColor || "#CDB586"}
                    onChange={(e) => handleChange("secondaryColor", e.target.value)}
                    className="w-20 h-10 border-[#CDB586]"
                  />
                  <Input
                    value={settings.secondaryColor || "#CDB586"}
                    onChange={(e) => handleChange("secondaryColor", e.target.value)}
                    className="flex-1 bg-white border-[#CDB586]"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="buttonStyle">Button Style</Label>
                <select
                  id="buttonStyle"
                  value={settings.buttonStyle || "solid"}
                  onChange={(e) => handleChange("buttonStyle", e.target.value)}
                  className="w-full p-2 bg-white border-[#CDB586] rounded"
                >
                  <option value="solid">Solid</option>
                  <option value="outline">Outline</option>
                  <option value="ghost">Ghost</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}