"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ShoppingBag, Smartphone, BatteryMedium, Truck, CreditCard, ShieldCheck, ArrowLeftRight } from "lucide-react";

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[#F7F5EF] py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-4 text-[#0E161B] font-manrope">Frequently Asked Questions</h1>
        <p className="text-[#5F3C18] mb-12">
          Find answers to common questions about our products and services.
        </p>

        <div className="space-y-8">
          {/* General Questions */}
          <Card className="bg-[#F7F5EF] border-[#CDB586]">
            <CardHeader>
              <CardTitle className="text-[#0E161B] flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-[#CDB586]" />
                General Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="gen-1">
                  <AccordionTrigger className="text-left text-[#0E161B]">
                    What does iPhone Hub Masvingo sell?
                  </AccordionTrigger>
                  <AccordionContent className="text-[#5F3C18]">
                    iPhone Hub Masvingo offers boxed, pre-owned and second-hand iPhones. Product availability, specifications, condition and pricing should be displayed on each individual product listing.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="gen-2">
                  <AccordionTrigger className="text-left text-[#0E161B]">
                    Where is iPhone Hub located?
                  </AccordionTrigger>
                  <AccordionContent className="text-[#5F3C18]">
                    iPhone Hub Masvingo is based in Masvingo, Zimbabwe. The exact physical address should be displayed once added by the administrator.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="gen-3">
                  <AccordionTrigger className="text-left text-[#0E161B]">
                    How can I contact iPhone Hub?
                  </AccordionTrigger>
                  <AccordionContent className="text-[#5F3C18]">
                    Customers can contact the team through WhatsApp:
                    <br /><br />
                    Artwell: 0773227172
                    <br />
                    Sabeka: 0784502347
                    <br /><br />
                    Both numbers support WhatsApp.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Buying Questions */}
          <Card className="bg-[#F7F5EF] border-[#CDB586]">
            <CardHeader>
              <CardTitle className="text-[#0E161B] flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-[#CDB586]" />
                Buying Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="buy-1">
                  <AccordionTrigger className="text-left text-[#0E161B]">
                    How do I buy an iPhone?
                  </AccordionTrigger>
                  <AccordionContent className="text-[#5F3C18]">
                    Customers can browse the available iPhones on the website, select a device and either proceed through the available ordering process or contact iPhone Hub through WhatsApp.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="buy-2">
                  <AccordionTrigger className="text-left text-[#0E161B]">
                    Can I ask about a phone before buying?
                  </AccordionTrigger>
                  <AccordionContent className="text-[#5F3C18]">
                    Yes. Customers can click the WhatsApp enquiry button on any product and send an enquiry directly to the team.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="buy-3">
                  <AccordionTrigger className="text-left text-[#0E161B]">
                    Can I reserve an iPhone?
                  </AccordionTrigger>
                  <AccordionContent className="text-[#5F3C18]">
                    Customers may request a reservation through WhatsApp. Reservation availability and duration are subject to confirmation by iPhone Hub Masvingo.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Boxed iPhone FAQ */}
          <Card className="bg-[#F7F5EF] border-[#CDB586]">
            <CardHeader>
              <CardTitle className="text-[#0E161B] flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-[#CDB586]" />
                Boxed iPhone FAQ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="boxed-1">
                  <AccordionTrigger className="text-left text-[#0E161B]">
                    What is a boxed iPhone?
                  </AccordionTrigger>
                  <AccordionContent className="text-[#5F3C18]">
                    A boxed iPhone refers to a device being offered in its box. The exact condition and contents of each product should always be confirmed on its individual listing.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="boxed-2">
                  <AccordionTrigger className="text-left text-[#0E161B]">
                    Does every boxed iPhone come with accessories?
                  </AccordionTrigger>
                  <AccordionContent className="text-[#5F3C18]">
                    Accessories and box contents can vary by product. Please check the individual product listing or contact us on WhatsApp to confirm what is included.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Pre-Owned iPhone FAQ */}
          <Card className="bg-[#F7F5EF] border-[#CDB586]">
            <CardHeader>
              <CardTitle className="text-[#0E161B] flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-[#CDB586]" />
                Pre-Owned iPhone FAQ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="preowned-1">
                  <AccordionTrigger className="text-left text-[#0E161B]">
                    What does pre-owned mean?
                  </AccordionTrigger>
                  <AccordionContent className="text-[#5F3C18]">
                    A pre-owned iPhone is a device that has previously belonged to another owner and is being offered for resale.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="preowned-2">
                  <AccordionTrigger className="text-left text-[#0E161B]">
                    Are pre-owned iPhones tested?
                  </AccordionTrigger>
                  <AccordionContent className="text-[#5F3C18]">
                    <div className="p-4 bg-[#EBE2C5] rounded-lg border border-[#CDB586]/50 mb-4">
                      <p className="text-sm text-[#5F3C18] italic">
                        Our inspection process: [ADMIN EDITABLE]
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="preowned-3">
                  <AccordionTrigger className="text-left text-[#0E161B]">
                    Can I see the condition of a pre-owned phone?
                  </AccordionTrigger>
                  <AccordionContent className="text-[#5F3C18]">
                    Yes, where photos and condition information are provided, customers should be able to review the actual device before purchasing. For each pre-owned product, display:
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Condition</li>
                      <li>Battery health</li>
                      <li>Storage</li>
                      <li>Colour</li>
                      <li>Device photos</li>
                      <li>Known cosmetic marks where applicable</li>
                      <li>Accessories included</li>
                      <li>Warranty information if applicable</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Second-Hand iPhone FAQ */}
          <Card className="bg-[#F7F5EF] border-[#CDB586]">
            <CardHeader>
              <CardTitle className="text-[#0E161B] flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-[#CDB586]" />
                Second-Hand iPhone FAQ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="secondhand-1">
                  <AccordionTrigger className="text-left text-[#0E161B]">
                    What is the difference between pre-owned and second-hand?
                  </AccordionTrigger>
                  <AccordionContent className="text-[#5F3C18]">
                    Terminology can vary between sellers. For iPhone Hub, the exact condition of each device should be clearly displayed on the product page rather than relying only on the category name.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="secondhand-2">
                  <AccordionTrigger className="text-left text-[#0E161B]">
                    Are second-hand iPhones cheaper?
                  </AccordionTrigger>
                  <AccordionContent className="text-[#5F3C18]">
                    Second-hand devices can provide a more affordable way to own an iPhone. Pricing depends on:
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Model</li>
                      <li>Storage</li>
                      <li>Condition</li>
                      <li>Battery health</li>
                      <li>Accessories</li>
                      <li>Availability</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Battery Health FAQ */}
          <Card className="bg-[#F7F5EF] border-[#CDB586]">
            <CardHeader>
              <CardTitle className="text-[#0E161B] flex items-center gap-2">
                <BatteryMedium className="h-5 w-5 text-[#CDB586]" />
                Battery Health FAQ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="battery-1">
                  <AccordionTrigger className="text-left text-[#0E161B]">
                    Can I check the battery health?
                  </AccordionTrigger>
                  <AccordionContent className="text-[#5F3C18]">
                    Where battery health information is available, display it directly on the product page.
                    <br /><br />
                    Example: <span className="font-semibold">Battery Health: 94%</span>
                    <br /><br />
                    Customers can also ask the team for additional information before purchasing.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="battery-2">
                  <AccordionTrigger className="text-left text-[#0E161B]">
                    Does battery health affect the price?
                  </AccordionTrigger>
                  <AccordionContent className="text-[#5F3C18]">
                    Battery health can be one of several factors considered when evaluating a pre-owned or second-hand iPhone. Other factors include model, storage, physical condition and overall device condition.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Delivery FAQ */}
          <Card className="bg-[#F7F5EF] border-[#CDB586]">
            <CardHeader>
              <CardTitle className="text-[#0E161B] flex items-center gap-2">
                <Truck className="h-5 w-5 text-[#CDB586]" />
                Delivery FAQ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="delivery-1">
                  <AccordionTrigger className="text-left text-[#0E161B]">
                    Do you offer delivery?
                  </AccordionTrigger>
                  <AccordionContent className="text-[#5F3C18]">
                    <div className="p-4 bg-[#EBE2C5] rounded-lg border border-[#CDB586]/50">
                      <p className="text-sm text-[#5F3C18] italic">
                        Delivery options and availability depend on the customer's location. Contact us on WhatsApp to confirm delivery options for your order. [ADMIN EDITABLE]
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="delivery-2">
                  <AccordionTrigger className="text-left text-[#0E161B]">
                    Can I collect my iPhone?
                  </AccordionTrigger>
                  <AccordionContent className="text-[#5F3C18]">
                    <div className="p-4 bg-[#EBE2C5] rounded-lg border border-[#CDB586]/50">
                      <p className="text-sm text-[#5F3C18] italic">
                        Pickup location, hours, and requirements: [ADMIN EDITABLE]
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Payment FAQ */}
          <Card className="bg-[#F7F5EF] border-[#CDB586]">
            <CardHeader>
              <CardTitle className="text-[#0E161B] flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-[#CDB586]" />
                Payment FAQ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="payment-1">
                  <AccordionTrigger className="text-left text-[#0E161B]">
                    What payment methods do you accept?
                  </AccordionTrigger>
                  <AccordionContent className="text-[#5F3C18]">
                    <div className="p-4 bg-[#EBE2C5] rounded-lg border border-[#CDB586]/50">
                      <p className="text-sm text-[#5F3C18] italic">
                        Payment methods will be displayed here based on administrator configuration.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Warranty FAQ */}
          <Card className="bg-[#F7F5EF] border-[#CDB586]">
            <CardHeader>
              <CardTitle className="text-[#0E161B] flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#CDB586]" />
                Warranty FAQ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="warranty-1">
                  <AccordionTrigger className="text-left text-[#0E161B]">
                    Do your iPhones come with a warranty?
                  </AccordionTrigger>
                  <AccordionContent className="text-[#5F3C18]">
                    Warranty availability and terms vary by product. Please check the product listing or contact iPhone Hub Masvingo before purchasing.
                    <br /><br />
                    <div className="p-4 bg-[#EBE2C5] rounded-lg border border-[#CDB586]/50 space-y-2">
                      <p className="text-sm text-[#5F3C18] italic">
                        Warranty duration: [ADMIN EDITABLE]
                      </p>
                      <p className="text-sm text-[#5F3C18] italic">
                        Covered issues: [ADMIN EDITABLE]
                      </p>
                      <p className="text-sm text-[#5F3C18] italic">
                        Exclusions: [ADMIN EDITABLE]
                      </p>
                      <p className="text-sm text-[#5F3C18] italic">
                        Claim procedure: [ADMIN EDITABLE]
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Returns FAQ */}
          <Card className="bg-[#F7F5EF] border-[#CDB586]">
            <CardHeader>
              <CardTitle className="text-[#0E161B] flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#CDB586]" />
                Returns FAQ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="returns-1">
                  <AccordionTrigger className="text-left text-[#0E161B]">
                    Can I return an iPhone?
                  </AccordionTrigger>
                  <AccordionContent className="text-[#5F3C18]">
                    Please review our Returns & Refund Policy before completing your purchase.
                    <br /><br />
                    <div className="p-4 bg-[#EBE2C5] rounded-lg border border-[#CDB586]/50">
                      <p className="text-sm text-[#5F3C18] italic">
                        Returns & Refund Policy: [ADMIN EDITABLE]
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Trade-In FAQ */}
          <Card className="bg-[#F7F5EF] border-[#CDB586]">
            <CardHeader>
              <CardTitle className="text-[#0E161B] flex items-center gap-2">
                <ArrowLeftRight className="h-5 w-5 text-[#CDB586]" />
                Trade-In FAQ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="tradein-1">
                  <AccordionTrigger className="text-left text-[#0E161B]">
                    How does the trade-in process work?
                  </AccordionTrigger>
                  <AccordionContent className="text-[#5F3C18]">
                    Visit our Trade-In page to submit information about your current iPhone. Our team will assess your device and provide an estimated trade-in value that can be applied toward an eligible replacement device.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[#5F3C18] mb-4">
            Can't find the answer you're looking for?
          </p>
          <a
            href="/contact"
            className="inline-block bg-[#0E161B] text-[#EBE2C5] px-6 py-3 rounded-lg hover:bg-[#1A1814] transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
