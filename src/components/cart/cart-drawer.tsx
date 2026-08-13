"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export function CartDrawer() {
  const { items, removeItem, updateQuantity, subtotal, itemCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="relative text-[#EBE2C5] hover:text-[#CDB586]"
      >
        <ShoppingBag className="h-5 w-5" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-[#CDB586] text-[#0E161B] text-xs rounded-full flex items-center justify-center font-semibold">
            {itemCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-[#F7F5EF] shadow-2xl">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b border-[#CDB586]/30 bg-[#0E161B]">
                <h2 className="text-lg font-semibold text-[#EBE2C5]">Shopping Cart ({itemCount})</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-[#EBE2C5] hover:text-[#CDB586]"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {items.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="h-16 w-16 mx-auto text-[#CDB586]/40 mb-4" />
                    <p className="text-[#5F3C18]">Your cart is empty</p>
                    <Button
                      variant="outline"
                      className="mt-4 border-[#CDB586] text-[#5F3C18] hover:bg-[#CDB586]/10"
                      onClick={() => setIsOpen(false)}
                    >
                      Continue Shopping
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <Card key={item.variantId} className="bg-white border-[#CDB586]/30">
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <div className="w-20 h-20 bg-gradient-to-br from-[#EBE2C5] to-[#F7F5EF] rounded-lg flex items-center justify-center border border-[#CDB586]/20">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <span className="text-3xl">📱</span>
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-[#0E161B] mb-1">{item.name}</h3>
                              <p className="text-sm text-[#5F3C18] mb-2">
                                {item.storage} • {item.colour}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-[#0E161B]">
                                  {formatPrice(item.price)}
                                </span>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 border-[#CDB586] text-[#5F3C18] hover:bg-[#CDB586]/10"
                                    onClick={() =>
                                      updateQuantity(item.variantId, item.quantity - 1)
                                    }
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                  <span className="w-8 text-center text-[#0E161B] font-medium">{item.quantity}</span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 border-[#CDB586] text-[#5F3C18] hover:bg-[#CDB586]/10"
                                    onClick={() =>
                                      updateQuantity(item.variantId, item.quantity + 1)
                                    }
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.variantId)}
                              className="text-[#5F3C18] hover:text-red-600"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {items.length > 0 && (
                <div className="border-t border-[#CDB586]/30 p-6 space-y-4 bg-[#0E161B]">
                  <div className="flex justify-between text-lg font-semibold text-[#EBE2C5]">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <Separator className="bg-[#CDB586]/30" />
                  <Link href="/checkout" className="block">
                    <Button
                      className="w-full bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5] font-semibold"
                      size="lg"
                      onClick={() => setIsOpen(false)}
                    >
                      Proceed to Checkout
                    </Button>
                  </Link>
                  <p className="text-xs text-center text-[#EBE2C5]/60">
                    Shipping and taxes calculated at checkout
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
