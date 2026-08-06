"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Message sent successfully!");
        setFormData({
          name: "",
          phone: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = (name: string, number: string, message?: string) => {
    const whatsappNumber = `263${number}`;
    const defaultMessage = message || "Hello iPhone Hub Masvingo, I would like to enquire about an iPhone.";
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-4 text-[#0E161B] font-manrope">Contact Us</h1>
        <p className="text-lg text-[#5F3C18] mb-12">
          iPhone Hub Masvingo
          <br />
          Masvingo, Zimbabwe
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Contact Form */}
          <Card className="bg-[#F7F5EF] border-[#CDB586]">
            <CardHeader>
              <CardTitle className="text-[#0E161B]">Send us a message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-[#5F3C18]">Name *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-[#5F3C18]">Phone / WhatsApp *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-[#5F3C18]">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="subject" className="text-[#5F3C18]">Subject *</Label>
                  <Input
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="message" className="text-[#5F3C18]">Message *</Label>
                  <Textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                  />
                </div>
                <Button type="submit" className="w-full bg-[#0E161B] text-[#EBE2C5] hover:bg-[#1A1814]" disabled={loading}>
                  {loading ? "Sending..." : "SEND MESSAGE"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* WhatsApp Contacts */}
          <div className="space-y-6">
            <Card className="bg-[#F7F5EF] border-[#CDB586]">
              <CardHeader>
                <CardTitle className="text-[#0E161B]">WhatsApp / Phone</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Artwell */}
                <div className="p-4 bg-[#EBE2C5] rounded-lg border border-[#CDB586]">
                  <h3 className="text-xl font-semibold mb-2 text-[#0E161B]">Artwell</h3>
                  <p className="text-[#5F3C18] mb-4">0773227172</p>
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      className="flex-1 border-[#CDB586] text-[#CDB586] hover:bg-[#CDB586] hover:text-[#0E161B]"
                      onClick={() => window.open(`tel:0773227172`)}
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Call Artwell
                    </Button>
                    <Button 
                      className="flex-1 bg-[#0E161B] text-[#EBE2C5] hover:bg-[#1A1814]"
                      onClick={() => handleWhatsApp("Artwell", "773227172")}
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      WhatsApp Artwell
                    </Button>
                  </div>
                </div>

                {/* Sabeka */}
                <div className="p-4 bg-[#EBE2C5] rounded-lg border border-[#CDB586]">
                  <h3 className="text-xl font-semibold mb-2 text-[#0E161B]">Sabeka</h3>
                  <p className="text-[#5F3C18] mb-4">0784502347</p>
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      className="flex-1 border-[#CDB586] text-[#CDB586] hover:bg-[#CDB586] hover:text-[#0E161B]"
                      onClick={() => window.open(`tel:0784502347`)}
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Call Sabeka
                    </Button>
                    <Button 
                      className="flex-1 bg-[#0E161B] text-[#EBE2C5] hover:bg-[#1A1814]"
                      onClick={() => handleWhatsApp("Sabeka", "784502347")}
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      WhatsApp Sabeka
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Placeholder for editable fields */}
            <Card className="bg-[#F7F5EF] border-[#CDB586]">
              <CardHeader>
                <CardTitle className="text-[#0E161B]">Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-[#EBE2C5] rounded-lg border border-[#CDB586]/50">
                  <p className="text-sm text-[#5F3C18] italic">
                    [Physical Address - Editable field in admin panel]
                  </p>
                </div>
                <div className="p-4 bg-[#EBE2C5] rounded-lg border border-[#CDB586]/50">
                  <p className="text-sm text-[#5F3C18] italic">
                    [Opening Hours - Editable field in admin panel]
                  </p>
                </div>
                <div className="p-4 bg-[#EBE2C5] rounded-lg border border-[#CDB586]/50">
                  <p className="text-sm text-[#5F3C18] italic">
                    [Email Address - Editable field in admin panel]
                  </p>
                </div>
                <div className="p-4 bg-[#EBE2C5] rounded-lg border border-[#CDB586]/50">
                  <p className="text-sm text-[#5F3C18] italic">
                    [Social Media Links - Editable field in admin panel]
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center bg-[#0E161B] wood-texture rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4 text-[#EBE2C5] font-manrope">
            Have a question about an iPhone?
          </h2>
          <p className="text-lg text-[#EBE2C5]/80 mb-8 max-w-2xl mx-auto">
            Our team is available on WhatsApp to help you find the right device.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-[#0E161B] text-[#EBE2C5] border border-[#CDB586] hover:bg-[#1A1814]"
              onClick={() => handleWhatsApp("Artwell", "773227172")}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              WHATSAPP ARTWELL
            </Button>
            <Button 
              className="bg-[#0E161B] text-[#EBE2C5] border border-[#CDB586] hover:bg-[#1A1814]"
              onClick={() => handleWhatsApp("Sabeka", "784502347")}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              WHATSAPP SABEKA
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}