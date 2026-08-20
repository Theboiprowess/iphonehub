"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CtaGroup } from "@/components/ui/cta-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

export default function ContactPage() {
  const router = useRouter();
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
        router.push("/thank-you");
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
    const defaultMessage = message || "Hello iPhone Hub Zimbabwe, I would like to enquire about an iPhone.";
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF]">
      {/* Hero Section */}
      <section className="section-spacing bg-[#0E161B] wood-texture">
        <div className="site-container text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#EBE2C5] font-manrope mb-6">
            Contact Us
          </h1>
          <p className="text-lg sm:text-xl text-[#EBE2C5]/80 leading-relaxed">
            Have questions? We're here to help. Reach out to our team via WhatsApp, phone, or send us a message.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section-spacing">
        <div className="site-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 min-w-0">
              {/* Contact Form */}
              <div>
                <Card className="bg-[#F7F5EF] border-[#CDB586]">
                  <CardHeader className="pb-6">
                    <CardTitle className="text-[#0E161B] text-xl ml-2">Send us a message</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <Label htmlFor="name" className="text-[#5F3C18] mb-2 block ml-2">Name *</Label>
                        <Input
                          id="name"
                          required
                          className="h-11"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-[#5F3C18] mb-2 block ml-2">Phone / WhatsApp *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          required
                          className="h-11"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-[#5F3C18] mb-2 block ml-2">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          className="h-11"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="subject" className="text-[#5F3C18] mb-2 block ml-2">Subject *</Label>
                        <Input
                          id="subject"
                          required
                          className="h-11"
                          value={formData.subject}
                          onChange={(e) =>
                            setFormData({ ...formData, subject: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="message" className="text-[#5F3C18] mb-2 block ml-2">Message *</Label>
                        <Textarea
                          id="message"
                          required
                          rows={5}
                          className="min-h-[120px]"
                          value={formData.message}
                          onChange={(e) =>
                            setFormData({ ...formData, message: e.target.value })
                          }
                        />
                      </div>
                      <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                        {loading ? "Sending..." : "SEND MESSAGE"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                {/* Location */}
                <Card className="bg-[#F7F5EF] border-[#CDB586]">
                  <CardHeader className="pb-5">
                    <CardTitle className="text-[#0E161B] flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-[#CDB586]" />
                      Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#5F3C18] leading-relaxed">
                      Masvingo, Zimbabwe
                    </p>
                  </CardContent>
                </Card>

                {/* WhatsApp Contacts */}
                <Card className="bg-[#F7F5EF] border-[#CDB586]">
                  <CardHeader className="pb-5">
                    <CardTitle className="text-[#0E161B] flex items-center gap-3">
                      <MessageCircle className="h-5 w-5 text-[#CDB586]" />
                      WhatsApp / Phone
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Artwell */}
                    <div className="p-6 bg-[#EBE2C5] rounded-lg border border-[#CDB586]">
                      <h3 className="text-xl font-semibold mb-3 text-[#0E161B]">Artwell</h3>
                      <p className="text-[#5F3C18] mb-5">0773227172</p>
                      <CtaGroup>
                        <Button 
                          variant="tertiary"
                          onClick={() => window.open(`tel:0773227172`)}
                        >
                          <Phone className="mr-2 h-4 w-4" />
                          Call
                        </Button>
                        <Button 
                          variant="secondary"
                          onClick={() => handleWhatsApp("Artwell", "773227172")}
                        >
                          <MessageCircle className="mr-2 h-4 w-4" />
                          WhatsApp
                        </Button>
                      </CtaGroup>
                    </div>

                    {/* Sabeka */}
                    <div className="p-6 bg-[#EBE2C5] rounded-lg border border-[#CDB586]">
                      <h3 className="text-xl font-semibold mb-3 text-[#0E161B]">Sabeka</h3>
                      <p className="text-[#5F3C18] mb-5">0784502347</p>
                      <CtaGroup>
                        <Button 
                          variant="tertiary"
                          onClick={() => window.open(`tel:0784502347`)}
                        >
                          <Phone className="mr-2 h-4 w-4" />
                          Call
                        </Button>
                        <Button 
                          variant="secondary"
                          onClick={() => handleWhatsApp("Sabeka", "784502347")}
                        >
                          <MessageCircle className="mr-2 h-4 w-4" />
                          WhatsApp
                        </Button>
                      </CtaGroup>
                    </div>
                  </CardContent>
                </Card>

                {/* Email */}
                <Card className="bg-[#F7F5EF] border-[#CDB586]">
                  <CardHeader className="pb-5">
                    <CardTitle className="text-[#0E161B] flex items-center gap-3">
                      <Mail className="h-5 w-5 text-[#CDB586]" />
                      Email
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#5F3C18]">
                      info@iphonehubzimbabwe.co.zw
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
      </section>
    </div>
  );
}
