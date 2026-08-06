import Link from "next/link";
import { Phone, Mail, MapPin, MessageCircle, Share2 } from "lucide-react";

const footerLinks = {
  products: [
    { name: "Boxed iPhones", href: "/iphones?condition=boxed" },
    { name: "Pre-Owned iPhones", href: "/iphones?condition=pre-owned" },
    { name: "Second-Hand iPhones", href: "/iphones?condition=second-hand" },
    { name: "Accessories", href: "/accessories" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "FAQ", href: "/faq" },
    { name: "Trade-In", href: "/trade-in" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Refund Policy", href: "/terms" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#0E161B] wood-texture">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#CDB586] font-manrope">
              iPhone Hub Masvingo
            </h3>
            <p className="text-[#EBE2C5]/80 text-sm">
              Premium iPhones. Trusted Service.
            </p>
            <div className="flex space-x-4">
              <Link 
                href="#" 
                className="text-[#EBE2C5]/60 hover:text-[#CDB586] transition-colors"
                aria-label="Social Media"
              >
                <Share2 className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#CDB586] mb-4 font-manrope">Products</h4>
            <ul className="space-y-2">
              {footerLinks.products.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#EBE2C5]/80 hover:text-[#CDB586] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#CDB586] mb-4 font-manrope">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#EBE2C5]/80 hover:text-[#CDB586] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#CDB586] mb-4 font-manrope">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-[#EBE2C5]/80">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#CDB586]" />
                <span>Masvingo, Zimbabwe</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-[#EBE2C5]/80">
                <Phone className="h-4 w-4 text-[#CDB586]" />
                <div className="flex flex-col">
                  <span>Artwell: 0773227172</span>
                  <span>Sabeka: 0784502347</span>
                </div>
              </li>
              <li className="flex items-center gap-3 text-sm text-[#EBE2C5]/80">
                <MessageCircle className="h-4 w-4 text-[#CDB586]" />
                <div className="flex flex-col">
                  <Link 
                    href="https://wa.me/263773227172" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#CDB586] transition-colors"
                  >
                    WhatsApp Artwell
                  </Link>
                  <Link 
                    href="https://wa.me/263784502347" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#CDB586] transition-colors"
                  >
                    WhatsApp Sabeka
                  </Link>
                </div>
              </li>
              <li className="flex items-center gap-3 text-sm text-[#EBE2C5]/80">
                <Mail className="h-4 w-4 text-[#CDB586]" />
                <span>info@iphonehubmasvingo.co.zw</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#CDB586]/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[#EBE2C5]/60">
              © {new Date().getFullYear()} iPhone Hub Masvingo. All rights reserved.
            </p>
            <div className="flex gap-6">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm text-[#EBE2C5]/60 hover:text-[#CDB586] transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
