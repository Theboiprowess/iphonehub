import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { ShieldCheck, ScanSearch, Smartphone, Headphones, ArrowLeftRight, MapPin } from "lucide-react";

const trustFeatures = [
  {
    icon: ShieldCheck,
    title: "Quality Checked",
    description: "Every device is carefully inspected and verified for authenticity.",
  },
  {
    icon: ScanSearch,
    title: "Transparent Information",
    description: "Clear details about condition, battery health, and device history.",
  },
  {
    icon: Smartphone,
    title: "Multiple Options",
    description: "Boxed, pre-owned, and second-hand iPhones to fit every budget.",
  },
  {
    icon: Headphones,
    title: "Personal Service",
    description: "Dedicated customer support via WhatsApp and phone.",
  },
  {
    icon: ArrowLeftRight,
    title: "Trade-In Available",
    description: "Upgrade your current iPhone with our trade-in program.",
  },
  {
    icon: MapPin,
    title: "Zimbabwe Based",
    description: "Your trusted local iPhone destination in Zimbabwe.",
  },
];

export function TrustCards() {
  return (
    <section className="section-spacing bg-[#EBE2C5]">
      <div className="site-container">
        <SectionHeader 
          title="Why Choose iPhone Hub?"
          subtitle="Discover why customers trust us for their iPhone needs"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {trustFeatures.map((feature) => (
            <Card key={feature.title} className="border-[#CDB586] shadow-sm bg-[#F7F5EF] hover:shadow-lg transition-all group text-center">
              <CardHeader className="p-8">
                <div className="h-14 w-14 rounded-xl bg-[#0E161B] text-[#CDB586] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform gold-glow mx-auto">
                  <feature.icon className="h-7 w-7" />
                </div>
                <div className="space-y-4">
                  <CardTitle className="text-lg text-[#0E161B] font-semibold">{feature.title}</CardTitle>
                  <div className="h-px w-8 bg-[#CDB586]/30 mx-auto"></div>
                </div>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <p className="text-[#5F3C18] leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
