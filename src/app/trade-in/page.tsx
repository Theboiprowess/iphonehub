"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CtaGroup } from "@/components/ui/cta-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { SectionHeader } from "@/components/ui/section-header";
import { Smartphone, ArrowRight, ArrowLeft, Upload, MessageCircle, Phone, ArrowRightLeft, Camera, SearchCheck, ArrowUpRight } from "lucide-react";

export default function TradeInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Customer Information
    name: "",
    phone: "",
    whatsapp: "",
    email: "",
    // Step 2: Device
    currentModel: "",
    storage: "",
    colour: "",
    batteryHealth: "",
    // Step 3: Condition
    condition: "",
    powersOn: false,
    touchscreenWorking: false,
    camerasWorking: false,
    faceIdWorking: false,
    chargingPortWorking: false,
    allButtonsWorking: false,
    // Step 4: Accessories
    hasOriginalBox: false,
    hasChargingCable: false,
    hasCharger: false,
    hasReceipt: false,
    otherAccessories: "",
    // Step 5: Photos
    photos: [] as File[],
    // Step 6: Additional Information
    notes: "",
  });

  const nextStep = () => {
    if (currentStep < 6) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First, save to API
      const response = await fetch("/api/trade-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Send trade-in details to both CEOs via WhatsApp
        const whatsappNumbers = ["263784502347", "263773227172"]; // Sabeka and Artwell

        const tradeInMessage = `*TRADE-IN REQUEST - iPhone Hub Zimbabwe*

*Customer Information*
Name: ${formData.name}
Phone: ${formData.phone}
WhatsApp: ${formData.whatsapp}
Email: ${formData.email}

*Device Information*
Model: ${formData.currentModel}
Storage: ${formData.storage}
Colour: ${formData.colour}
Battery Health: ${formData.batteryHealth}%
Condition: ${formData.condition}

*Device Status*
Powers On: ${formData.powersOn ? "Yes" : "No"}
Touchscreen: ${formData.touchscreenWorking ? "Yes" : "No"}
Cameras: ${formData.camerasWorking ? "Yes" : "No"}
Face ID: ${formData.faceIdWorking ? "Yes" : "No"}
Charging Port: ${formData.chargingPortWorking ? "Yes" : "No"}
Buttons: ${formData.allButtonsWorking ? "Yes" : "No"}
Repairs: ${formData.condition}

*Accessories*
Original Box: ${formData.hasOriginalBox ? "Yes" : "No"}
Charging Cable: ${formData.hasChargingCable ? "Yes" : "No"}
Charger: ${formData.hasCharger ? "Yes" : "No"}
Receipt: ${formData.hasReceipt ? "Yes" : "No"}
Other: ${formData.otherAccessories}

*Additional Notes*
${formData.notes}`;

        // Send to both CEOs
        whatsappNumbers.forEach((number) => {
          window.open(`https://wa.me/${number}?text=${encodeURIComponent(tradeInMessage)}`, "_blank");
        });

        // Redirect to thank-you page
        router.push("/thank-you");
      } else {
        alert("Failed to submit trade-in request. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting trade-in:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = (name: string, number: string) => {
    const whatsappNumber = `263${number}`;
    const defaultMessage = "Hello iPhone Hub Zimbabwe, I would like to enquire about your iPhones.";
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF]">
      {/* Hero Section */}
      <section className="section-spacing bg-[#0E161B] wood-texture">
        <div className="site-container">
          <SectionHeader 
            title="Trade In Your iPhone. Upgrade With Confidence."
            subtitle="Thinking about upgrading? Tell us about your current iPhone and our team can assess your device and discuss your trade-in options."
          >
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-[#0E161B] text-[#CDB586] flex items-center justify-center gold-glow">
                <ArrowRightLeft className="h-8 w-8" />
              </div>
            </div>
          </SectionHeader>
        </div>
      </section>

      {/* Visual Trade-In Process */}
      <section className="section-spacing">
        <div className="site-container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 lg:gap-8 min-w-0">
              <div className="text-center p-8 bg-[#F7F5EF] border border-[#CDB586] rounded-lg hover:shadow-lg transition-all flex flex-col items-center">
                <div className="h-12 w-12 rounded-lg bg-[#0E161B] text-[#CDB586] flex items-center justify-center mb-4">
                  <Smartphone className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold text-[#CDB586] mb-3">01</div>
                <p className="text-sm text-[#5F3C18]">Tell Us About Your iPhone</p>
              </div>
              <div className="text-center p-8 bg-[#F7F5EF] border border-[#CDB586] rounded-lg hover:shadow-lg transition-all flex flex-col items-center">
                <div className="h-12 w-12 rounded-lg bg-[#0E161B] text-[#CDB586] flex items-center justify-center mb-4">
                  <Camera className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold text-[#CDB586] mb-3">02</div>
                <p className="text-sm text-[#5F3C18]">Send Photos</p>
              </div>
              <div className="text-center p-8 bg-[#F7F5EF] border border-[#CDB586] rounded-lg hover:shadow-lg transition-all flex flex-col items-center">
                <div className="h-12 w-12 rounded-lg bg-[#0E161B] text-[#CDB586] flex items-center justify-center mb-4">
                  <SearchCheck className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold text-[#CDB586] mb-3">03</div>
                <p className="text-sm text-[#5F3C18]">Device Assessment</p>
              </div>
              <div className="text-center p-8 bg-[#F7F5EF] border border-[#CDB586] rounded-lg hover:shadow-lg transition-all flex flex-col items-center">
                <div className="h-12 w-12 rounded-lg bg-[#0E161B] text-[#CDB586] flex items-center justify-center mb-4">
                  <ArrowUpRight className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold text-[#CDB586] mb-3">04</div>
                <p className="text-sm text-[#5F3C18]">Upgrade</p>
              </div>
            </div>
        </div>
      </section>

      {/* Multi-Step Form */}
      <section className="section-spacing">
        <div className="site-container">
          <Card className="bg-[#F7F5EF] border-[#CDB586]">
                <CardHeader className="pb-6 trade-in-card-header">
                <CardTitle className="text-[#0E161B] text-xl">Trade-In Request</CardTitle>
                <div className="flex items-center gap-2 mt-4">
                  {[1, 2, 3, 4, 5, 6].map((step) => (
                    <div
                      key={step}
                      className={`flex-1 h-1 rounded-full ${
                        step <= currentStep ? "bg-[#CDB586]" : "bg-[#81592B]/30"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-[#5F3C18] mt-3">Step {currentStep} of 6</p>
              </CardHeader>
              <CardContent className="pt-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Step 1: Customer Information */}
                  {currentStep === 1 && (
                    <div className="space-y-6 trade-in-step-container">
                      <h3 className="text-xl font-semibold text-[#0E161B]">Customer Information</h3>
                      <div>
                        <Label htmlFor="name" className="text-[#5F3C18] mb-2 block">Full Name *</Label>
                        <Input
                          id="name"
                          required
                          className="h-11 trade-in-form-input"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-[#5F3C18] mb-2 block">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          required
                          className="h-11 trade-in-form-input"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="whatsapp" className="text-[#5F3C18] mb-2 block">WhatsApp Number</Label>
                        <Input
                          id="whatsapp"
                          type="tel"
                          className="h-11 trade-in-form-input"
                          value={formData.whatsapp}
                          onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-[#5F3C18] mb-2 block">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          className="h-11 trade-in-form-input"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 2: Device */}
                  {currentStep === 2 && (
                    <div className="space-y-6 trade-in-step-container">
                      <h3 className="text-xl font-semibold text-[#0E161B]">Device Information</h3>
                      <div>
                        <Label htmlFor="currentModel" className="text-[#5F3C18] mb-2 block">iPhone Model *</Label>
                        <Select
                          value={formData.currentModel}
                          onValueChange={(value) => setFormData({ ...formData, currentModel: value })}
                        >
                          <SelectTrigger className="h-11 trade-in-form-select">
                            <SelectValue placeholder="Select your iPhone model" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="iPhone 15 Pro Max">iPhone 15 Pro Max</SelectItem>
                            <SelectItem value="iPhone 15 Pro">iPhone 15 Pro</SelectItem>
                            <SelectItem value="iPhone 15">iPhone 15</SelectItem>
                            <SelectItem value="iPhone 15 Plus">iPhone 15 Plus</SelectItem>
                            <SelectItem value="iPhone 14 Pro Max">iPhone 14 Pro Max</SelectItem>
                            <SelectItem value="iPhone 14 Pro">iPhone 14 Pro</SelectItem>
                            <SelectItem value="iPhone 14">iPhone 14</SelectItem>
                            <SelectItem value="iPhone 14 Plus">iPhone 14 Plus</SelectItem>
                            <SelectItem value="iPhone 13 Pro Max">iPhone 13 Pro Max</SelectItem>
                            <SelectItem value="iPhone 13 Pro">iPhone 13 Pro</SelectItem>
                            <SelectItem value="iPhone 13">iPhone 13</SelectItem>
                            <SelectItem value="iPhone 13 Mini">iPhone 13 Mini</SelectItem>
                            <SelectItem value="iPhone 12 Pro Max">iPhone 12 Pro Max</SelectItem>
                            <SelectItem value="iPhone 12 Pro">iPhone 12 Pro</SelectItem>
                            <SelectItem value="iPhone 12">iPhone 12</SelectItem>
                            <SelectItem value="iPhone 12 Mini">iPhone 12 Mini</SelectItem>
                            <SelectItem value="iPhone 11 Pro Max">iPhone 11 Pro Max</SelectItem>
                            <SelectItem value="iPhone 11 Pro">iPhone 11 Pro</SelectItem>
                            <SelectItem value="iPhone 11">iPhone 11</SelectItem>
                            <SelectItem value="iPhone SE (2022)">iPhone SE (2022)</SelectItem>
                            <SelectItem value="iPhone SE (2020)">iPhone SE (2020)</SelectItem>
                            <SelectItem value="iPhone XR">iPhone XR</SelectItem>
                            <SelectItem value="iPhone XS Max">iPhone XS Max</SelectItem>
                            <SelectItem value="iPhone XS">iPhone XS</SelectItem>
                            <SelectItem value="iPhone X">iPhone X</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="storage" className="text-[#5F3C18] mb-2 block">Storage *</Label>
                        <Select
                          value={formData.storage}
                          onValueChange={(value) => setFormData({ ...formData, storage: value })}
                        >
                          <SelectTrigger className="h-11 trade-in-form-select">
                            <SelectValue placeholder="Select storage" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="128GB">128GB</SelectItem>
                            <SelectItem value="256GB">256GB</SelectItem>
                            <SelectItem value="512GB">512GB</SelectItem>
                            <SelectItem value="1TB">1TB</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="colour" className="text-[#5F3C18] mb-2 block">Colour *</Label>
                        <Select
                          value={formData.colour}
                          onValueChange={(value) => setFormData({ ...formData, colour: value })}
                        >
                          <SelectTrigger className="h-11 trade-in-form-select">
                            <SelectValue placeholder="Select colour" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Black">Black</SelectItem>
                            <SelectItem value="White">White</SelectItem>
                            <SelectItem value="Red">Red</SelectItem>
                            <SelectItem value="Blue">Blue</SelectItem>
                            <SelectItem value="Green">Green</SelectItem>
                            <SelectItem value="Yellow">Yellow</SelectItem>
                            <SelectItem value="Purple">Purple</SelectItem>
                            <SelectItem value="Pink">Pink</SelectItem>
                            <SelectItem value="Gold">Gold</SelectItem>
                            <SelectItem value="Silver">Silver</SelectItem>
                            <SelectItem value="Graphite">Graphite</SelectItem>
                            <SelectItem value="Midnight">Midnight</SelectItem>
                            <SelectItem value="Starlight">Starlight</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="batteryHealth" className="text-[#5F3C18] mb-2 block">Battery Health (%) *</Label>
                        <Input
                          id="batteryHealth"
                          type="number"
                          min="0"
                          max="100"
                          required
                          className="h-11 trade-in-form-input"
                          value={formData.batteryHealth}
                          onChange={(e) => setFormData({ ...formData, batteryHealth: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="condition" className="text-[#5F3C18]">Condition *</Label>
                        <Select
                          value={formData.condition}
                          onValueChange={(value) => setFormData({ ...formData, condition: value })}
                        >
                          <SelectTrigger className="trade-in-form-select">
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Excellent">Excellent</SelectItem>
                            <SelectItem value="Good">Good</SelectItem>
                            <SelectItem value="Fair">Fair</SelectItem>
                            <SelectItem value="Poor">Poor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Device Status */}
                  {currentStep === 3 && (
                    <div className="space-y-4 trade-in-step-container">
                      <h3 className="text-xl font-semibold text-[#0E161B]">Device Status</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id="powersOn"
                            checked={formData.powersOn}
                            onCheckedChange={(checked) => setFormData({ ...formData, powersOn: checked })}
                          />
                          <Label htmlFor="powersOn" className="text-[#5F3C18]">Powers On</Label>
                        </div>
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id="touchscreenWorking"
                            checked={formData.touchscreenWorking}
                            onCheckedChange={(checked) => setFormData({ ...formData, touchscreenWorking: checked })}
                          />
                          <Label htmlFor="touchscreenWorking" className="text-[#5F3C18]">Touchscreen Working</Label>
                        </div>
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id="camerasWorking"
                            checked={formData.camerasWorking}
                            onCheckedChange={(checked) => setFormData({ ...formData, camerasWorking: checked })}
                          />
                          <Label htmlFor="camerasWorking" className="text-[#5F3C18]">Cameras Working</Label>
                        </div>
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id="faceIdWorking"
                            checked={formData.faceIdWorking}
                            onCheckedChange={(checked) => setFormData({ ...formData, faceIdWorking: checked })}
                          />
                          <Label htmlFor="faceIdWorking" className="text-[#5F3C18]">Face ID Working</Label>
                        </div>
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id="chargingPortWorking"
                            checked={formData.chargingPortWorking}
                            onCheckedChange={(checked) => setFormData({ ...formData, chargingPortWorking: checked })}
                          />
                          <Label htmlFor="chargingPortWorking" className="text-[#5F3C18]">Charging Port Working</Label>
                        </div>
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id="allButtonsWorking"
                            checked={formData.allButtonsWorking}
                            onCheckedChange={(checked) => setFormData({ ...formData, allButtonsWorking: checked })}
                          />
                          <Label htmlFor="allButtonsWorking" className="text-[#5F3C18]">All Buttons Working</Label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Accessories */}
                  {currentStep === 4 && (
                    <div className="space-y-4 trade-in-step-container">
                      <h3 className="text-xl font-semibold text-[#0E161B]">Accessories</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id="hasOriginalBox"
                            checked={formData.hasOriginalBox}
                            onCheckedChange={(checked) => setFormData({ ...formData, hasOriginalBox: checked })}
                          />
                          <Label htmlFor="hasOriginalBox" className="text-[#5F3C18]">Original Box</Label>
                        </div>
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id="hasChargingCable"
                            checked={formData.hasChargingCable}
                            onCheckedChange={(checked) => setFormData({ ...formData, hasChargingCable: checked })}
                          />
                          <Label htmlFor="hasChargingCable" className="text-[#5F3C18]">Charging Cable</Label>
                        </div>
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id="hasCharger"
                            checked={formData.hasCharger}
                            onCheckedChange={(checked) => setFormData({ ...formData, hasCharger: checked })}
                          />
                          <Label htmlFor="hasCharger" className="text-[#5F3C18]">Charger</Label>
                        </div>
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id="hasReceipt"
                            checked={formData.hasReceipt}
                            onCheckedChange={(checked) => setFormData({ ...formData, hasReceipt: checked })}
                          />
                          <Label htmlFor="hasReceipt" className="text-[#5F3C18]">Receipt</Label>
                        </div>
                        <div>
                          <Label htmlFor="otherAccessories" className="text-[#5F3C18]">Other Accessories</Label>
                          <Input
                            id="otherAccessories"
                            value={formData.otherAccessories}
                            onChange={(e) => setFormData({ ...formData, otherAccessories: e.target.value })}
                            className="trade-in-form-input"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 5: Photos */}
                  {currentStep === 5 && (
                    <div className="space-y-4 trade-in-step-container">
                      <h3 className="text-xl font-semibold text-[#0E161B]">Device Photos</h3>
                      <div>
                        <Label htmlFor="photos" className="text-[#5F3C18]">Upload Photos</Label>
                        <Input
                          id="photos"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => setFormData({ ...formData, photos: Array.from(e.target.files) })}
                          className="trade-in-form-input"
                        />
                      </div>
                      {formData.photos.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 gap-4 min-w-0">
                          {formData.photos.map((photo, index) => (
                            <div key={index} className="relative">
                              <img
                                src={URL.createObjectURL(photo)}
                                alt={`Photo ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 6: Additional Information */}
                  {currentStep === 6 && (
                    <div className="space-y-4 trade-in-step-container">
                      <h3 className="text-xl font-semibold text-[#0E161B]">Additional Information</h3>
                      <div>
                        <Label htmlFor="notes" className="text-[#5F3C18]">Notes</Label>
                        <Textarea
                          id="notes"
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          rows={4}
                          className="trade-in-form-textarea"
                        />
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <CtaGroup className="justify-between mt-10 trade-in-navigation-buttons">
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        variant="tertiary"
                        onClick={prevStep}
                        className="flex-1 sm:flex-none"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Previous
                      </Button>
                    )}
                    {currentStep < 6 ? (
                      <Button
                        type="button"
                        variant="primary"
                        onClick={nextStep}
                        className="flex-1 sm:flex-none"
                      >
                        Next
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={loading}
                        variant="primary"
                        goldGlow
                        className="flex-1 sm:flex-none"
                      >
                        {loading ? "Submitting..." : "Submit Trade-In Request"}
                      </Button>
                    )}
                  </CtaGroup>
                </form>
              </CardContent>
          </Card>

          {/* Disclaimer */}
          <Card className="bg-[#0E161B] border-[#CDB586] mt-10 mb-20">
            <CardContent className="p-8 trade-in-disclaimer">
              <h3 className="text-lg font-semibold text-[#CDB586] mb-3">Trade-In Valuation Disclaimer</h3>
              <p className="text-[#EBE2C5]/80 text-sm leading-relaxed">
                Trade-in values are estimates and are subject to physical inspection and verification of the device. A submitted trade-in request does not constitute a guaranteed offer. Final valuation may change after inspection.
              </p>
            </CardContent>
          </Card>

          {/* WhatsApp CTA */}
          <div className="text-center bg-[#0E161B] wood-texture rounded-2xl p-12 mt-20">
            <h2 className="text-3xl font-bold mb-6 text-[#EBE2C5] font-manrope">
            Trade-In Form Sent to Both CEOs
          </h2>
          <p className="text-lg text-[#EBE2C5]/80 mb-10">
            After completing the 6-step form, your trade-in request will be sent directly to both Artwell and Sabeka via WhatsApp for valuation.
          </p>
            <CtaGroup className="justify-center">
              <Button 
                variant="secondary"
                onClick={() => handleWhatsApp("Artwell", "773227172")}
                className="flex-1 sm:flex-none"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                WHATSAPP ARTWELL
              </Button>
              <Button 
                variant="secondary"
                onClick={() => handleWhatsApp("Sabeka", "784502347")}
                className="flex-1 sm:flex-none"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                WHATSAPP SABEKA
              </Button>
            </CtaGroup>
          </div>
        </div>
      </section>
    </div>
  );
}
