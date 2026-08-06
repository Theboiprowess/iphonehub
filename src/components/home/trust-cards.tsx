import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    title: "Masvingo Based",
    description: "Your trusted local iPhone destination in Masvingo, Zimbabwe.",
  },
];

export function TrustCards() {
  return (
    <section className="py-16 sm:py-24 bg-[#EBE2C5]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0E161B] mb-4 font-manrope">
            Why Choose iPhone Hub?
          </h2>
          <p className="text-lg text-[#5F3C18] max-w-2xl mx-auto">
            Discover why customers trust us for their iPhone needs
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trustFeatures.map((feature) => (
            <Card key={feature.title} className="border-[#CDB586] shadow-sm bg-[#F7F5EF] hover:shadow-lg transition-all group">
              <CardHeader>
                <div className="h-14 w-14 rounded-xl bg-[#0E161B] text-[#CDB586] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform gold-glow">
                  <feature.icon className="h-7 w-7" />
                </div>
                <CardTitle className="text-lg text-[#0E161B]">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#5F3C18]">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
