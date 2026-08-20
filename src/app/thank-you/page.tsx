import Link from "next/link";
import { CheckCircle, ShoppingBag, ArrowRight, Phone, MessageCircle } from "lucide-react";
import { Button, LinkButton } from "@/components/ui/button";
import { CtaGroup } from "@/components/ui/cta-group";

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-[#F7F5EF] flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center border border-[#CDB586]/20">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          {/* Main Message */}
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0E161B] mb-4">
            Thank You!
          </h1>
          
          <p className="text-lg text-[#5F3C18] mb-8">
            Your submission has been received successfully. We'll get back to you as soon as possible.
          </p>

          {/* Divider */}
          <div className="h-px bg-[#CDB586]/30 my-8"></div>

          {/* Next Steps */}
          <div className="space-y-6 mb-8">
            <div className="flex items-start gap-4 text-left">
              <div className="w-10 h-10 bg-[#CDB586]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="w-5 h-5 text-[#CDB586]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#0E161B] mb-1">Continue Shopping</h3>
                <p className="text-sm text-[#5F3C18]">Browse our collection of quality iPhones</p>
              </div>
            </div>

            <div className="flex items-start gap-4 text-left">
              <div className="w-10 h-10 bg-[#CDB586]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-[#CDB586]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#0E161B] mb-1">Contact Us Directly</h3>
                <p className="text-sm text-[#5F3C18]">Call or WhatsApp for immediate assistance</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <CtaGroup className="justify-center">
            <LinkButton href="/iphones" variant="primary" goldGlow className="flex-1 sm:flex-none">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Browse iPhones
            </LinkButton>
            
            <LinkButton href="/" variant="tertiary" className="flex-1 sm:flex-none">
              <ArrowRight className="w-4 h-4 mr-2" />
              Back to Home
            </LinkButton>
          </CtaGroup>

          {/* Quick Contact */}
          <div className="mt-8 pt-8 border-t border-[#CDB586]/20">
            <p className="text-sm text-[#5F3C18] mb-4">Need immediate help?</p>
            <div className="flex justify-center gap-4">
              <a
                href="https://wa.me/263773227172"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#0E161B] hover:text-[#CDB586] transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm font-medium">WhatsApp Us</span>
              </a>
              <span className="text-[#CDB586]/40">•</span>
              <a
                href="tel:+263773227172"
                className="flex items-center gap-2 text-[#0E161B] hover:text-[#CDB586] transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span className="text-sm font-medium">+263 77 322 7172</span>
              </a>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-[#5F3C18]/60">
            iPhone Hub Zimbabwe • Masvingo, Zimbabwe
          </p>
        </div>
      </div>
    </div>
  );
}
