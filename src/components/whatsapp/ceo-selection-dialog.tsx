"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, ShoppingBag } from "lucide-react";

interface CEOSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName?: string;
  productVariant?: string;
  price?: string;
  orderNumber?: string;
  context?: "product" | "order";
  onBuyOnline?: () => void;
}

export function CEOSelectionDialog({
  open,
  onOpenChange,
  productName,
  productVariant,
  price,
  orderNumber,
  context = "product",
  onBuyOnline,
}: CEOSelectionDialogProps) {
  const generateWhatsAppMessage = (ceoName: string) => {
    if (context === "order" && orderNumber) {
      return `Hello ${ceoName}, I have placed order #${orderNumber} on iPhone Hub Zimbabwe and would like assistance with my order.`;
    } else if (productName) {
      return `Hello iPhone Hub Zimbabwe, I am interested in the ${productName}${productVariant ? ` (${productVariant})` : ""}${price ? ` listed at ${price}` : ""}. I would like more information.`;
    }
    return "Hello iPhone Hub Zimbabwe, I would like to make an enquiry.";
  };

  const openWhatsApp = (phone: string, ceoName: string) => {
    const message = generateWhatsAppMessage(ceoName);
    const whatsappUrl = `https://wa.me/263${phone.replace(/^0/, "")}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#F7F5EF] border-[#CDB586]/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#0E161B] flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-[#25D366]" />
            Contact iPhone Hub Zimbabwe
          </DialogTitle>
          <DialogDescription className="text-[#5F3C18]">
            Who would you like to contact?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Button
            onClick={() => openWhatsApp("0773227172", "Artwell")}
            className="w-full h-16 text-lg bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Chat with Artwell
          </Button>

          <Button
            onClick={() => openWhatsApp("0784502347", "Sabeka")}
            className="w-full h-16 text-lg bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Chat with Sabeka
          </Button>

          {context === "product" && onBuyOnline && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#CDB586]/30"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[#F7F5EF] text-[#5F3C18]/60">Or</span>
                </div>
              </div>

              <Button
                onClick={() => {
                  onBuyOnline();
                  onOpenChange(false);
                }}
                className="w-full h-16 text-lg bg-[#0E161B] hover:bg-[#1A1A20] text-[#EBE2C5] font-semibold"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Buy Online
              </Button>
            </>
          )}

          <div className="text-center text-sm text-[#5F3C18]/60 pt-2">
            <p>Both CEOs are available to assist you</p>
            <p>with your iPhone purchase enquiry.</p>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-[#5F3C18] hover:text-[#0E161B]"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}