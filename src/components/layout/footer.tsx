import Link from "next/link";
import { Phone, Mail, MapPin, MessageCircle, Share2, Download } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0E161B] wood-texture">
      <div className="site-container py-10 sm:py-12 lg:py-16 px-4 sm:px-6">
        {/* Main Navigation Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-12">
          {/* Company Info - Full width on mobile */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-[#CDB586] font-manrope">
                iPhone Hub Zimbabwe
              </h3>
              <div className="h-px w-12 bg-[#CDB586]/30"></div>
            </div>
            <p className="text-[#EBE2C5]/80 text-sm leading-relaxed">
              Based in Masvingo, serving customers across Zimbabwe with quality boxed, pre-owned, and second-hand iPhones.
            </p>
            <div className="flex space-x-4 pt-2">
              <Link 
                href="#" 
                className="text-[#EBE2C5]/60 hover:text-[#CDB586] transition-colors"
                aria-label="Social Media"
              >
                <Share2 className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Shop + Company - Side by side on mobile */}
          <div className="grid grid-cols-2 gap-6 sm:col-span-2 lg:col-span-2">
            {/* Shop */}
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-[#CDB586] font-manrope uppercase tracking-wider">Shop</h4>
                <div className="h-px w-12 bg-[#CDB586]/30"></div>
              </div>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/iphones" className="text-sm text-[#EBE2C5]/80 hover:text-[#CDB586] transition-colors">
                    All iPhones
                  </Link>
                </li>
                <li>
                  <Link href="/iphones?condition=boxed" className="text-sm text-[#EBE2C5]/80 hover:text-[#CDB586] transition-colors">
                    Boxed iPhones
                  </Link>
                </li>
                <li>
                  <Link href="/iphones?condition=pre-owned" className="text-sm text-[#EBE2C5]/80 hover:text-[#CDB586] transition-colors">
                    Pre-Owned
                  </Link>
                </li>
                <li>
                  <Link href="/iphones?condition=second-hand" className="text-sm text-[#EBE2C5]/80 hover:text-[#CDB586] transition-colors">
                    Second-Hand
                  </Link>
                </li>
                <li>
                  <Link href="/accessories" className="text-sm text-[#EBE2C5]/80 hover:text-[#CDB586] transition-colors">
                    Accessories
                  </Link>
                </li>
                <li>
                  <Link href="/catalogue" className="text-sm text-[#EBE2C5]/80 hover:text-[#CDB586] transition-colors">
                    Price Catalogue
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-[#CDB586] font-manrope uppercase tracking-wider">Company</h4>
                <div className="h-px w-12 bg-[#CDB586]/30"></div>
              </div>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/about" className="text-sm text-[#EBE2C5]/80 hover:text-[#CDB586] transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-[#EBE2C5]/80 hover:text-[#CDB586] transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-sm text-[#EBE2C5]/80 hover:text-[#CDB586] transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/gallery" className="text-sm text-[#EBE2C5]/80 hover:text-[#CDB586] transition-colors">
                    Gallery
                  </Link>
                </li>
                <li>
                  <Link href="/trade-in" className="text-sm text-[#EBE2C5]/80 hover:text-[#CDB586] transition-colors">
                    Trade-In
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact - Full width on mobile, separate column on tablet/desktop */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-[#CDB586] font-manrope uppercase tracking-wider">Contact</h4>
              <div className="h-px w-12 bg-[#CDB586]/30"></div>
            </div>
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
                <span>info@iphonehubzimbabwe.co.zw</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#CDB586]/20 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[#EBE2C5]/60">
              © {new Date().getFullYear()} iPhone Hub Zimbabwe. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link
                href="/privacy"
                className="text-sm text-[#EBE2C5]/60 hover:text-[#CDB586] transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-[#EBE2C5]/60 hover:text-[#CDB586] transition-colors"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="h-16"></div>
    </footer>
  );
}
