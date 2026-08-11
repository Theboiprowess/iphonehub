"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Loader2, Building2, User, Trophy, Users } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

interface AboutUs {
  id?: string;
  companyName: string;
  heading: string;
  description: string;
  story?: string;
  mission?: string;
  vision?: string;
  values?: string;
  ceoName: string;
  ceoTitle?: string;
  ceoBio?: string;
  ceoPhoto?: string;
  teamMembers?: any;
  storePhotos?: string[];
  statistics?: any;
  achievements?: any;
}

export default function AboutPage() {
  const [aboutUs, setAboutUs] = useState<AboutUs>({
    companyName: "iPhone Hub Zimbabwe",
    heading: "About iPhone Hub Zimbabwe",
    description: "Your trusted source for premium iPhones in Zimbabwe",
    ceoName: "Artwell Gwata",
    ceoTitle: "Founder & CEO",
    teamMembers: [],
    storePhotos: [],
    statistics: {},
    achievements: {}
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    fetchAboutUs();
  }, []);

  const fetchAboutUs = async () => {
    setLoading(true);
    try {
      const response = await fetch("/admin/api/about");
      const data = await response.json();
      setAboutUs(data);
    } catch (error) {
      console.error("Error fetching about us:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/admin/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aboutUs),
      });

      if (!response.ok) {
        throw new Error("Failed to save about us information");
      }

      alert("About us information saved successfully!");
    } catch (error) {
      console.error("Error saving about us:", error);
      alert("Failed to save about us information");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof AboutUs, value: string) => {
    setAboutUs((prev) => ({ ...prev, [field]: value }));
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
          <h1 className="text-3xl lg:text-4xl font-bold text-[#0E161B] font-manrope">About Us Management</h1>
          <p className="text-[#5F3C18] text-base">Manage company information and story</p>
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
        <TabsList className="bg-[#F7F5EF] border-[#CDB586]">
          <TabsTrigger value="general" className="data-[state=active]:bg-[#CDB586] data-[state=active]:text-[#0E161B]">
            <Building2 className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="ceo" className="data-[state=active]:bg-[#CDB586] data-[state=active]:text-[#0E161B]">
            <User className="h-4 w-4 mr-2" />
            CEO
          </TabsTrigger>
          <TabsTrigger value="story" className="data-[state=active]:bg-[#CDB586] data-[state=active]:text-[#0E161B]">
            <Trophy className="h-4 w-4 mr-2" />
            Story & Values
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="bg-[#F7F5EF] border-[#CDB586]">
            <CardHeader>
              <CardTitle className="text-[#0E161B]">Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={aboutUs.companyName}
                  onChange={(e) => handleChange("companyName", e.target.value)}
                  className="bg-white border-[#CDB586]"
                />
              </div>
              <div>
                <Label htmlFor="heading">Page Heading</Label>
                <Input
                  id="heading"
                  value={aboutUs.heading}
                  onChange={(e) => handleChange("heading", e.target.value)}
                  className="bg-white border-[#CDB586]"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={aboutUs.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="bg-white border-[#CDB586]"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ceo">
          <Card className="bg-[#F7F5EF] border-[#CDB586]">
            <CardHeader>
              <CardTitle className="text-[#0E161B]">CEO Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="ceoName">CEO Name</Label>
                <Input
                  id="ceoName"
                  value={aboutUs.ceoName}
                  onChange={(e) => handleChange("ceoName", e.target.value)}
                  className="bg-white border-[#CDB586]"
                />
              </div>
              <div>
                <Label htmlFor="ceoTitle">CEO Title</Label>
                <Input
                  id="ceoTitle"
                  value={aboutUs.ceoTitle || ""}
                  onChange={(e) => handleChange("ceoTitle", e.target.value)}
                  className="bg-white border-[#CDB586]"
                />
              </div>
              <div>
                <Label htmlFor="ceoBio">CEO Bio</Label>
                <Textarea
                  id="ceoBio"
                  value={aboutUs.ceoBio || ""}
                  onChange={(e) => handleChange("ceoBio", e.target.value)}
                  className="bg-white border-[#CDB586]"
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="ceoPhoto">CEO Photo</Label>
                <div className="space-y-3">
                  {aboutUs.ceoPhoto && (
                    <div className="relative w-32 h-32">
                      <img
                        src={aboutUs.ceoPhoto}
                        alt="CEO"
                        className="w-full h-full object-cover rounded-lg border border-[#CDB586]"
                      />
                    </div>
                  )}
                  <div>
                    <Input
                      id="ceoPhoto"
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            handleChange("ceoPhoto", reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="bg-white border-[#CDB586]"
                    />
                    <p className="text-xs text-gray-600 mt-1">Upload CEO photo (will be stored as base64)</p>
                  </div>
                  {aboutUs.ceoPhoto && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleChange("ceoPhoto", "")}
                      className="border-[#CDB586] text-[#0E161B]"
                    >
                      Remove Photo
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="story">
          <Card className="bg-[#F7F5EF] border-[#CDB586]">
            <CardHeader>
              <CardTitle className="text-[#0E161B]">Company Story & Values</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="story">Company Story</Label>
                <Textarea
                  id="story"
                  value={aboutUs.story || ""}
                  onChange={(e) => handleChange("story", e.target.value)}
                  className="bg-white border-[#CDB586]"
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="mission">Mission</Label>
                <Textarea
                  id="mission"
                  value={aboutUs.mission || ""}
                  onChange={(e) => handleChange("mission", e.target.value)}
                  className="bg-white border-[#CDB586]"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="vision">Vision</Label>
                <Textarea
                  id="vision"
                  value={aboutUs.vision || ""}
                  onChange={(e) => handleChange("vision", e.target.value)}
                  className="bg-white border-[#CDB586]"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="values">Values</Label>
                <Textarea
                  id="values"
                  value={aboutUs.values || ""}
                  onChange={(e) => handleChange("values", e.target.value)}
                  className="bg-white border-[#CDB586]"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
