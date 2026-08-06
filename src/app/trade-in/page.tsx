"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Smartphone, ArrowRight, ArrowLeft, Upload, MessageCircle, Phone, ArrowRightLeft, Camera, SearchCheck, ArrowUpRight } from "lucide-react";

export default function TradeInPage() {
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
    beenRepaired: false,
    hasCracks: false,
    liquidDamage: false,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/trade-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Trade-in enquiry submitted successfully! We'll contact you with an estimated value.");
        // Reset form
        setCurrentStep(1);
        setFormData({
          name: "",
          phone: "",
          whatsapp: "",
          email: "",
          currentModel: "",
          storage: "",
          colour: "",
          batteryHealth: "",
          condition: "",
          powersOn: false,
          touchscreenWorking: false,
          camerasWorking: false,
          faceIdWorking: false,
          chargingPortWorking: false,
          beenRepaired: false,
          hasCracks: false,
          liquidDamage: false,
          allButtonsWorking: false,
          hasOriginalBox: false,
          hasChargingCable: false,
          hasCharger: false,
          hasReceipt: false,
          otherAccessories: "",
          photos: [],
          notes: "",
        });
      } else {
        alert("Failed to submit trade-in enquiry. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting trade-in:", error);
      alert("Failed to submit trade-in enquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 6));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleWhatsApp = (name: string, number: string) => {
    const whatsappNumber = `263${number}`;
    const message = `Hello iPhone Hub Masvingo. I have submitted a trade-in request for my ${formData.currentModel} ${formData.storage}. I would like to discuss the valuation.`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section with Visual Trade-In */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-[#0E161B] text-[#CDB586] flex items-center justify-center gold-glow">
              <ArrowRightLeft className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-[#0E161B] font-manrope">
            Trade In Your iPhone. Upgrade With Confidence.
          </h1>
          <p className="text-lg text-[#5F3C18] max-w-2xl mx-auto">
            Thinking about upgrading? Tell us about your current iPhone and our team can assess your device and discuss your trade-in options.
          </p>
        </div>

        {/* Visual Trade-In Process */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-6 bg-[#F7F5EF] border border-[#CDB586] rounded-lg hover:shadow-lg transition-all">
              <div className="h-12 w-12 rounded-lg bg-[#0E161B] text-[#CDB586] flex items-center justify-center mx-auto mb-3">
                <Smartphone className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold text-[#CDB586] mb-2">01</div>
              <p className="text-sm text-[#5F3C18]">Tell Us About Your iPhone</p>
            </div>
            <div className="text-center p-6 bg-[#F7F5EF] border border-[#CDB586] rounded-lg hover:shadow-lg transition-all">
              <div className="h-12 w-12 rounded-lg bg-[#0E161B] text-[#CDB586] flex items-center justify-center mx-auto mb-3">
                <Camera className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold text-[#CDB586] mb-2">02</div>
              <p className="text-sm text-[#5F3C18]">Send Photos</p>
            </div>
            <div className="text-center p-6 bg-[#F7F5EF] border border-[#CDB586] rounded-lg hover:shadow-lg transition-all">
              <div className="h-12 w-12 rounded-lg bg-[#0E161B] text-[#CDB586] flex items-center justify-center mx-auto mb-3">
                <SearchCheck className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold text-[#CDB586] mb-2">03</div>
              <p className="text-sm text-[#5F3C18]">Device Assessment</p>
            </div>
            <div className="text-center p-6 bg-[#F7F5EF] border border-[#CDB586] rounded-lg hover:shadow-lg transition-all">
              <div className="h-12 w-12 rounded-lg bg-[#0E161B] text-[#CDB586] flex items-center justify-center mx-auto mb-3">
                <ArrowUpRight className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold text-[#CDB586] mb-2">04</div>
              <p className="text-sm text-[#5F3C18]">Upgrade</p>
            </div>
          </div>
        </div>

        {/* Multi-Step Form */}
        <Card className="bg-[#F7F5EF] border-[#CDB586]">
          <CardHeader>
            <CardTitle className="text-[#0E161B]">Trade-In Request</CardTitle>
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
            <p className="text-sm text-[#5F3C18] mt-2">Step {currentStep} of 6</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Customer Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-[#0E161B]">Customer Information</h3>
                  <div>
                    <Label htmlFor="name" className="text-[#5F3C18]">Full Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-[#5F3C18]">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="whatsapp" className="text-[#5F3C18]">WhatsApp Number</Label>
                    <Input
                      id="whatsapp"
                      type="tel"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-[#5F3C18]">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Device */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-[#0E161B]">Device Information</h3>
                  <div>
                    <Label htmlFor="currentModel" className="text-[#5F3C18]">iPhone Model *</Label>
                    <Select
                      value={formData.currentModel}
                      onValueChange={(value) => setFormData({ ...formData, currentModel: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your iPhone model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="iPhone 15 Pro Max">iPhone 15 Pro Max</SelectItem>
                        <SelectItem value="iPhone 15 Pro">iPhone 15 Pro</SelectItem>
                        <SelectItem value="iPhone 15 Plus">iPhone 15 Plus</SelectItem>
                        <SelectItem value="iPhone 15">iPhone 15</SelectItem>
                        <SelectItem value="iPhone 14 Pro Max">iPhone 14 Pro Max</SelectItem>
                        <SelectItem value="iPhone 14 Pro">iPhone 14 Pro</SelectItem>
                        <SelectItem value="iPhone 14 Plus">iPhone 14 Plus</SelectItem>
                        <SelectItem value="iPhone 14">iPhone 14</SelectItem>
                        <SelectItem value="iPhone 13 Pro Max">iPhone 13 Pro Max</SelectItem>
                        <SelectItem value="iPhone 13 Pro">iPhone 13 Pro</SelectItem>
                        <SelectItem value="iPhone 13">iPhone 13</SelectItem>
                        <SelectItem value="iPhone 12">iPhone 12</SelectItem>
                        <SelectItem value="iPhone 11">iPhone 11</SelectItem>
                        <SelectItem value="iPhone XR">iPhone XR</SelectItem>
                        <SelectItem value="iPhone XS">iPhone XS</SelectItem>
                        <SelectItem value="iPhone X">iPhone X</SelectItem>
                        <SelectItem value="iPhone 8">iPhone 8</SelectItem>
                        <SelectItem value="iPhone 7">iPhone 7</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="storage" className="text-[#5F3C18]">Storage *</Label>
                    <Select
                      value={formData.storage}
                      onValueChange={(value) => setFormData({ ...formData, storage: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select storage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="64GB">64GB</SelectItem>
                        <SelectItem value="128GB">128GB</SelectItem>
                        <SelectItem value="256GB">256GB</SelectItem>
                        <SelectItem value="512GB">512GB</SelectItem>
                        <SelectItem value="1TB">1TB</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="colour" className="text-[#5F3C18]">Colour *</Label>
                    <Input
                      id="colour"
                      placeholder="e.g., Midnight Green"
                      value={formData.colour}
                      onChange={(e) => setFormData({ ...formData, colour: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="batteryHealth" className="text-[#5F3C18]">Battery Health (%)</Label>
                    <Input
                      id="batteryHealth"
                      type="number"
                      min="0"
                      max="100"
                      placeholder="e.g., 85"
                      value={formData.batteryHealth}
                      onChange={(e) => setFormData({ ...formData, batteryHealth: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Condition */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-[#0E161B]">Device Condition</h3>
                  <div>
                    <Label htmlFor="condition" className="text-[#5F3C18]">Overall Condition *</Label>
                    <Select
                      value={formData.condition}
                      onValueChange={(value) => setFormData({ ...formData, condition: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Excellent">Excellent</SelectItem>
                        <SelectItem value="Very Good">Very Good</SelectItem>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Fair">Fair</SelectItem>
                        <SelectItem value="Damaged">Damaged</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <p className="text-[#5F3C18] font-medium">Functionality Check</p>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="powersOn"
                          checked={formData.powersOn}
                          onCheckedChange={(checked) => setFormData({ ...formData, powersOn: checked as boolean })}
                        />
                        <Label htmlFor="powersOn" className="text-[#5F3C18]">Does the phone power on?</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="touchscreenWorking"
                          checked={formData.touchscreenWorking}
                          onCheckedChange={(checked) => setFormData({ ...formData, touchscreenWorking: checked as boolean })}
                        />
                        <Label htmlFor="touchscreenWorking" className="text-[#5F3C18]">Is the touchscreen working?</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="camerasWorking"
                          checked={formData.camerasWorking}
                          onCheckedChange={(checked) => setFormData({ ...formData, camerasWorking: checked as boolean })}
                        />
                        <Label htmlFor="camerasWorking" className="text-[#5F3C18]">Are the cameras working?</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="faceIdWorking"
                          checked={formData.faceIdWorking}
                          onCheckedChange={(checked) => setFormData({ ...formData, faceIdWorking: checked as boolean })}
                        />
                        <Label htmlFor="faceIdWorking" className="text-[#5F3C18]">Is Face ID working?</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="chargingPortWorking"
                          checked={formData.chargingPortWorking}
                          onCheckedChange={(checked) => setFormData({ ...formData, chargingPortWorking: checked as boolean })}
                        />
                        <Label htmlFor="chargingPortWorking" className="text-[#5F3C18]">Is the charging port working?</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="allButtonsWorking"
                          checked={formData.allButtonsWorking}
                          onCheckedChange={(checked) => setFormData({ ...formData, allButtonsWorking: checked as boolean })}
                        />
                        <Label htmlFor="allButtonsWorking" className="text-[#5F3C18]">Are all buttons working?</Label>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-[#5F3C18] font-medium">Damage Assessment</p>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="beenRepaired"
                          checked={formData.beenRepaired}
                          onCheckedChange={(checked) => setFormData({ ...formData, beenRepaired: checked as boolean })}
                        />
                        <Label htmlFor="beenRepaired" className="text-[#5F3C18]">Has the phone been repaired?</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="hasCracks"
                          checked={formData.hasCracks}
                          onCheckedChange={(checked) => setFormData({ ...formData, hasCracks: checked as boolean })}
                        />
                        <Label htmlFor="hasCracks" className="text-[#5F3C18]">Are there cracks?</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="liquidDamage"
                          checked={formData.liquidDamage}
                          onCheckedChange={(checked) => setFormData({ ...formData, liquidDamage: checked as boolean })}
                        />
                        <Label htmlFor="liquidDamage" className="text-[#5F3C18]">Is there water/liquid damage?</Label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Accessories */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-[#0E161B]">Accessories</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hasOriginalBox"
                        checked={formData.hasOriginalBox}
                        onCheckedChange={(checked) => setFormData({ ...formData, hasOriginalBox: checked as boolean })}
                      />
                      <Label htmlFor="hasOriginalBox" className="text-[#5F3C18]">Original box</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hasChargingCable"
                        checked={formData.hasChargingCable}
                        onCheckedChange={(checked) => setFormData({ ...formData, hasChargingCable: checked as boolean })}
                      />
                      <Label htmlFor="hasChargingCable" className="text-[#5F3C18]">Charging cable</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hasCharger"
                        checked={formData.hasCharger}
                        onCheckedChange={(checked) => setFormData({ ...formData, hasCharger: checked as boolean })}
                      />
                      <Label htmlFor="hasCharger" className="text-[#5F3C18]">Charger</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hasReceipt"
                        checked={formData.hasReceipt}
                        onCheckedChange={(checked) => setFormData({ ...formData, hasReceipt: checked as boolean })}
                      />
                      <Label htmlFor="hasReceipt" className="text-[#5F3C18]">Receipt/proof of purchase</Label>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="otherAccessories" className="text-[#5F3C18]">Other accessories</Label>
                    <Input
                      id="otherAccessories"
                      placeholder="e.g., AirPods, cases, screen protectors"
                      value={formData.otherAccessories}
                      onChange={(e) => setFormData({ ...formData, otherAccessories: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* Step 5: Photos */}
              {currentStep === 5 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-[#0E161B]">Device Photos</h3>
                  <p className="text-[#5F3C18] text-sm">
                    Please upload photos showing: Front, Back, Sides, Camera, Screen, and any visible damage
                  </p>
                  <div className="border-2 border-dashed border-[#CDB586] rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 mx-auto text-[#CDB586] mb-4" />
                    <p className="text-[#5F3C18] mb-2">
                      Drag and drop photos here, or click to select
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      id="photos"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        setFormData({ ...formData, photos: files });
                      }}
                    />
                    <label
                      htmlFor="photos"
                      className="inline-block bg-[#CDB586] text-[#0E161B] px-4 py-2 rounded-lg cursor-pointer hover:bg-[#EBE2C5]"
                    >
                      Select Photos
                    </label>
                  </div>
                  {formData.photos.length > 0 && (
                    <div className="mt-4">
                      <p className="text-[#5F3C18] mb-2">{formData.photos.length} photo(s) selected</p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 6: Additional Information */}
              {currentStep === 6 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-[#0E161B]">Additional Information</h3>
                  <div>
                    <Label htmlFor="notes" className="text-[#5F3C18]">Tell us anything else about your iPhone</Label>
                    <Textarea
                      id="notes"
                      rows={6}
                      placeholder="Any additional information about your device..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="border-[#CDB586] text-[#CDB586] hover:bg-[#CDB586] hover:text-[#0E161B]"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                )}
                {currentStep < 6 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="ml-auto bg-[#0E161B] text-[#EBE2C5] hover:bg-[#1A1814]"
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="ml-auto bg-[#0E161B] text-[#EBE2C5] hover:bg-[#1A1814]"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "SUBMIT TRADE-IN REQUEST"}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Valuation Disclaimer */}
        <div className="mt-8 p-6 bg-[#0E161B] border border-[#CDB586] rounded-lg">
          <h3 className="text-lg font-semibold text-[#CDB586] mb-2">Trade-In Valuation Disclaimer</h3>
          <p className="text-[#EBE2C5]/80 text-sm">
            Trade-in values are estimates and are subject to physical inspection and verification of the device. A submitted trade-in request does not constitute a guaranteed offer. Final valuation may change after inspection.
          </p>
        </div>

        {/* WhatsApp CTA */}
        <div className="mt-8 text-center bg-[#0E161B] wood-texture rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4 text-[#EBE2C5] font-manrope">
            Chat With Us on WhatsApp
          </h2>
          <p className="text-lg text-[#EBE2C5]/80 mb-8 max-w-2xl mx-auto">
            Have questions about your trade-in? Our team is ready to help.
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
