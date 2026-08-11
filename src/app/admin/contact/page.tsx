"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Loader2, Phone, MessageCircle, Mail, MapPin, Share2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

interface ContactInfo {
  id?: string;
  phonePrimary: string;
  phonePrimaryLabel: string;
  phoneSecondary?: string;
  phoneSecondaryLabel?: string;
  whatsappPrimary: string;
  whatsappSecondary?: string;
  email: string;
  address?: string;
  city?: string;
  country?: string;
  openingHours?: string;
  googleMapsUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
}

export default function ContactPage() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    phonePrimary: "0773227172",
    phonePrimaryLabel: "Artwell",
    phoneSecondary: "0784502347",
    phoneSecondaryLabel: "Sabeka",
    whatsappPrimary: "0773227172",
    whatsappSecondary: "0784502347",
    email: "info@iphonehubzimbabwe.co.zw",
    city: "Zimbabwe",
    country: "Zimbabwe"
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("phones");

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    setLoading(true);
    try {
      const response = await fetch("/admin/api/contact");
      const data = await response.json();
      setContactInfo(data);
    } catch (error) {
      console.error("Error fetching contact info:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/admin/api/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactInfo),
      });

      if (!response.ok) {
        throw new Error("Failed to save contact information");
      }

      alert("Contact information saved successfully!");
    } catch (error) {
      console.error("Error saving contact info:", error);
      alert("Failed to save contact information");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof ContactInfo, value: string) => {
    setContactInfo((prev) => ({ ...prev, [field]: value }));
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
          <h1 className="text-3xl lg:text-4xl font-bold text-[#0E161B] font-manrope">Contact Management</h1>
          <p className="text-[#5F3C18] text-base">Manage contact information and channels</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5] flex-shrink-0"
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-[#F7F5EF] border-[#CDB586]/30">
          <TabsTrigger value="phones" className="data-[state=active]:bg-[#CDB586] data-[state=active]:text-[#0E161B]">
            <Phone className="h-4 w-4 mr-2" />
            Phones
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="data-[state=active]:bg-[#CDB586] data-[state=active]:text-[#0E161B]">
            <MessageCircle className="h-4 w-4 mr-2" />
            WhatsApp
          </TabsTrigger>
          <TabsTrigger value="email" className="data-[state=active]:bg-[#CDB586] data-[state=active]:text-[#0E161B]">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </TabsTrigger>
          <TabsTrigger value="address" className="data-[state=active]:bg-[#CDB586] data-[state=active]:text-[#0E161B]">
            <MapPin className="h-4 w-4 mr-2" />
            Address
          </TabsTrigger>
          <TabsTrigger value="social" className="data-[state=active]:bg-[#CDB586] data-[state=active]:text-[#0E161B]">
            <Share2 className="h-4 w-4 mr-2" />
            Social
          </TabsTrigger>
        </TabsList>

        <TabsContent value="phones">
          <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
            <CardHeader>
              <CardTitle className="text-[#0E161B]">Phone Numbers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phonePrimary">Primary Phone</Label>
                  <Input
                    id="phonePrimary"
                    value={contactInfo.phonePrimary}
                    onChange={(e) => handleChange("phonePrimary", e.target.value)}
                    className="bg-white border-[#CDB586]/30"
                  />
                </div>
                <div>
                  <Label htmlFor="phonePrimaryLabel">Primary Label</Label>
                  <Input
                    id="phonePrimaryLabel"
                    value={contactInfo.phonePrimaryLabel}
                    onChange={(e) => handleChange("phonePrimaryLabel", e.target.value)}
                    placeholder="Artwell"
                    className="bg-white border-[#CDB586]/30"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phoneSecondary">Secondary Phone</Label>
                  <Input
                    id="phoneSecondary"
                    value={contactInfo.phoneSecondary || ""}
                    onChange={(e) => handleChange("phoneSecondary", e.target.value)}
                    className="bg-white border-[#CDB586]/30"
                  />
                </div>
                <div>
                  <Label htmlFor="phoneSecondaryLabel">Secondary Label</Label>
                  <Input
                    id="phoneSecondaryLabel"
                    value={contactInfo.phoneSecondaryLabel || ""}
                    onChange={(e) => handleChange("phoneSecondaryLabel", e.target.value)}
                    placeholder="Sabeka"
                    className="bg-white border-[#CDB586]/30"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="whatsapp">
          <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
            <CardHeader>
              <CardTitle className="text-[#0E161B]">WhatsApp Numbers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="whatsappPrimary">Primary WhatsApp</Label>
                <Input
                  id="whatsappPrimary"
                  value={contactInfo.whatsappPrimary}
                  onChange={(e) => handleChange("whatsappPrimary", e.target.value)}
                  className="bg-white border-[#CDB586]"
                />
              </div>
              <div>
                <Label htmlFor="whatsappSecondary">Secondary WhatsApp</Label>
                <Input
                  id="whatsappSecondary"
                  value={contactInfo.whatsappSecondary || ""}
                  onChange={(e) => handleChange("whatsappSecondary", e.target.value)}
                  className="bg-white border-[#CDB586]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
            <CardHeader>
              <CardTitle className="text-[#0E161B]">Email Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="bg-white border-[#CDB586]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="address">
          <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
            <CardHeader>
              <CardTitle className="text-[#0E161B]">Address & Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={contactInfo.address || ""}
                  onChange={(e) => handleChange("address", e.target.value)}
                  className="bg-white border-[#CDB586]"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={contactInfo.city || ""}
                    onChange={(e) => handleChange("city", e.target.value)}
                    className="bg-white border-[#CDB586]/30"
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={contactInfo.country || ""}
                    onChange={(e) => handleChange("country", e.target.value)}
                    className="bg-white border-[#CDB586]/30"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="openingHours">Opening Hours</Label>
                <Textarea
                  id="openingHours"
                  value={contactInfo.openingHours || ""}
                  onChange={(e) => handleChange("openingHours", e.target.value)}
                  placeholder="Mon-Fri: 9AM-5PM, Sat: 10AM-2PM"
                  className="bg-white border-[#CDB586]"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="googleMapsUrl">Google Maps URL</Label>
                <Input
                  id="googleMapsUrl"
                  value={contactInfo.googleMapsUrl || ""}
                  onChange={(e) => handleChange("googleMapsUrl", e.target.value)}
                  placeholder="https://maps.google.com/..."
                  className="bg-white border-[#CDB586]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
            <CardHeader>
              <CardTitle className="text-[#0E161B]">Social Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="facebookUrl">Facebook URL</Label>
                <Input
                  id="facebookUrl"
                  value={contactInfo.facebookUrl || ""}
                  onChange={(e) => handleChange("facebookUrl", e.target.value)}
                  placeholder="https://facebook.com/iphonehubzimbabwe"
                  className="bg-white border-[#CDB586]"
                />
              </div>
              <div>
                <Label htmlFor="instagramUrl">Instagram URL</Label>
                <Input
                  id="instagramUrl"
                  value={contactInfo.instagramUrl || ""}
                  onChange={(e) => handleChange("instagramUrl", e.target.value)}
                  placeholder="https://instagram.com/iphonehubzimbabwe"
                  className="bg-white border-[#CDB586]"
                />
              </div>
              <div>
                <Label htmlFor="tiktokUrl">TikTok URL</Label>
                <Input
                  id="tiktokUrl"
                  value={contactInfo.tiktokUrl || ""}
                  onChange={(e) => handleChange("tiktokUrl", e.target.value)}
                  placeholder="https://tiktok.com/@iphonehubzimbabwe"
                  className="bg-white border-[#CDB586]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
