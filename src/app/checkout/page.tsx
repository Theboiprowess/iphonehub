"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { Truck, Phone, CreditCard, AlertCircle, Smartphone, CheckCircle } from "lucide-react";

type EcoCashAccount = {
  id: string;
  name: string;
  phoneNumber: string;
  isDefault: boolean;
};

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ecoCashAccounts, setEcoCashAccounts] = useState<EcoCashAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    whatsapp: "",
    deliveryAddress: "",
    city: "",
    deliveryMethod: "",
    paymentMethod: "",
    receivingAccountId: "",
    orderNotes: "",
  });

  // Fetch EcoCash accounts
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch("/api/ecocash-accounts/public");
        if (response.ok) {
          const data = await response.json();
          setEcoCashAccounts(data.accounts || []);
          // Select default account
          const defaultAccount = data.accounts?.find((acc: EcoCashAccount) => acc.isDefault);
          if (defaultAccount) {
            setSelectedAccount(defaultAccount.id);
            setFormData(prev => ({ ...prev, receivingAccountId: defaultAccount.id }));
          }
        }
      } catch (error) {
        console.error("Failed to fetch EcoCash accounts:", error);
      }
    };
    fetchAccounts();
  }, []);

  const deliveryFee = formData.deliveryMethod === "pickup" ? 0 : formData.deliveryMethod === "local" ? 15 : 25;
  const total = subtotal + deliveryFee;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10,13}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = "Invalid phone number";
    }

    if (!formData.deliveryMethod) {
      newErrors.deliveryMethod = "Delivery method is required";
    }

    if (formData.deliveryMethod !== "pickup") {
      if (!formData.deliveryAddress.trim()) {
        newErrors.deliveryAddress = "Delivery address is required";
      }
      if (!formData.city.trim()) {
        newErrors.city = "City is required";
      }
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = "Payment method is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          items,
          subtotal,
          deliveryFee,
          total,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // If EcoCash is selected, redirect to EcoCash payment page
        if (formData.paymentMethod === "ecocash") {
          clearCart();
          window.location.href = `/checkout/ecocash?orderId=${data.order.id}`;
        } else {
          // For other payment methods, proceed as before
          clearCart();
          window.location.href = "/checkout/success?orderId=" + data.order.id;
        }
      } else {
        const errorData = await response.json();
        setErrors({ general: errorData.error || "Failed to create order. Please try again." });
      }
    } catch (error) {
      console.error("Error creating order:", error);
      setErrors({ general: "Failed to create order. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <Button onClick={() => (window.location.href = "/iphones")}>
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F5EF] py-12">
      <div className="site-container">
        <h1 className="text-3xl font-bold mb-8 text-[#0E161B]">Checkout</h1>

        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800">{errors.general}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white border-[#CDB586]/30">
              <CardHeader>
                <CardTitle className="text-[#0E161B]">Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName" className="text-[#5F3C18]">Full Name *</Label>
                    <Input
                      id="fullName"
                      required
                      value={formData.fullName}
                      onChange={(e) => {
                        setFormData({ ...formData, fullName: e.target.value });
                        setErrors({ ...errors, fullName: "" });
                      }}
                      className={errors.fullName ? "border-red-500" : ""}
                    />
                    {errors.fullName && <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-[#5F3C18]">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        setErrors({ ...errors, email: "" });
                      }}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-[#5F3C18]">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        setErrors({ ...errors, phone: "" });
                      }}
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
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
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#CDB586]/30">
              <CardHeader>
                <CardTitle className="text-[#0E161B]">Delivery Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="deliveryMethod" className="text-[#5F3C18]">Delivery Method *</Label>
                    <Select
                      value={formData.deliveryMethod}
                      onValueChange={(value) => {
                        setFormData({ ...formData, deliveryMethod: value });
                        setErrors({ ...errors, deliveryMethod: "" });
                      }}
                    >
                      <SelectTrigger className={errors.deliveryMethod ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select delivery method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pickup">
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4" />
                            <span>Pickup - Masvingo (Free)</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="local">
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4" />
                            <span>Local Delivery - Masvingo ($15)</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="nationwide">
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4" />
                            <span>Nationwide Delivery ($25)</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.deliveryMethod && <p className="text-red-600 text-sm mt-1">{errors.deliveryMethod}</p>}
                  </div>
                  {formData.deliveryMethod !== "pickup" && (
                    <>
                      <div>
                        <Label htmlFor="deliveryAddress" className="text-[#5F3C18]">Delivery Address *</Label>
                        <Input
                          id="deliveryAddress"
                          required
                          value={formData.deliveryAddress}
                          onChange={(e) => {
                            setFormData({ ...formData, deliveryAddress: e.target.value });
                            setErrors({ ...errors, deliveryAddress: "" });
                          }}
                          className={errors.deliveryAddress ? "border-red-500" : ""}
                        />
                        {errors.deliveryAddress && <p className="text-red-600 text-sm mt-1">{errors.deliveryAddress}</p>}
                      </div>
                      <div>
                        <Label htmlFor="city" className="text-[#5F3C18]">City *</Label>
                        <Input
                          id="city"
                          required
                          value={formData.city}
                          onChange={(e) => {
                            setFormData({ ...formData, city: e.target.value });
                            setErrors({ ...errors, city: "" });
                          }}
                          className={errors.city ? "border-red-500" : ""}
                        />
                        {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#CDB586]/30">
              <CardHeader>
                <CardTitle className="text-[#0E161B]">Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={(value) => {
                      setFormData({ ...formData, paymentMethod: value });
                      setErrors({ ...errors, paymentMethod: "" });
                    }}
                  >
                    <SelectTrigger className={errors.paymentMethod ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ecocash">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>EcoCash</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="zipit">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          <span>ZIPIT</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="bank">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          <span>Bank Transfer</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="collection">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>Cash on Collection</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="whatsapp">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>WhatsApp-assisted Payment</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.paymentMethod && <p className="text-red-600 text-sm mt-1">{errors.paymentMethod}</p>}
                </div>
              </CardContent>
            </Card>

            {/* EcoCash Account Selection */}
            {formData.paymentMethod === "ecocash" && (
              <Card className="bg-[#0E161B] border-[#CDB586]/30">
                <CardHeader>
                  <CardTitle className="text-[#EBE2C5]">EcoCash Payment Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="receivingAccount" className="text-[#EBE2C5]">Select EcoCash Account *</Label>
                      <Select
                        value={selectedAccount}
                        onValueChange={(value) => {
                          setSelectedAccount(value);
                          setFormData({ ...formData, receivingAccountId: value });
                        }}
                      >
                        <SelectTrigger className="bg-[#EBE2C5] text-[#0E161B]">
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                          {ecoCashAccounts.map((account) => (
                            <SelectItem key={account.id} value={account.id}>
                              <div className="flex items-center gap-2">
                                <Smartphone className="h-4 w-4" />
                                <span>{account.name}</span>
                                {account.isDefault && (
                                  <CheckCircle className="h-3 w-3 text-[#CDB586]" />
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedAccount && (
                      <div className="bg-[#EBE2C5]/10 border border-[#CDB586]/30 rounded-lg p-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Smartphone className="h-4 w-4 text-[#CDB586]" />
                            <span className="text-[#EBE2C5] font-medium">
                              {ecoCashAccounts.find((a) => a.id === selectedAccount)?.name}
                            </span>
                          </div>
                          <div className="text-2xl font-bold text-[#CDB586]">
                            {ecoCashAccounts.find((a) => a.id === selectedAccount)?.phoneNumber}
                          </div>
                          <div className="text-[#EBE2C5]/60 text-sm">
                            Send exactly <span className="text-[#CDB586] font-bold">{formatPrice(total)}</span> to this number
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-white border-[#CDB586]/30">
              <CardHeader>
                <CardTitle className="text-[#0E161B]">Order Notes (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Any special instructions for your order..."
                  value={formData.orderNotes}
                  onChange={(e) =>
                    setFormData({ ...formData, orderNotes: e.target.value })
                  }
                />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 bg-[#0E161B] border-[#CDB586]/30">
              <CardHeader>
                <CardTitle className="text-[#EBE2C5]">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.variantId} className="flex justify-between text-sm">
                      <div>
                        <p className="font-medium text-[#EBE2C5]">{item.name}</p>
                        <p className="text-[#EBE2C5]/60">
                          {item.storage} • {item.colour} × {item.quantity}
                        </p>
                      </div>
                      <span className="font-medium text-[#EBE2C5]">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator className="bg-[#CDB586]/30" />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#EBE2C5]/60">Subtotal</span>
                    <span className="text-[#EBE2C5]">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#EBE2C5]/60">Delivery</span>
                    <span className="text-[#EBE2C5]">{deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}</span>
                  </div>
                  <Separator className="bg-[#CDB586]/30" />
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-[#EBE2C5]">Total</span>
                    <span className="text-[#CDB586] text-xl">{formatPrice(total)}</span>
                  </div>
                </div>

                <Button
                  className="w-full bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5]"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Place Order"}
                </Button>

                <p className="text-xs text-center text-[#EBE2C5]/60">
                  By placing this order, you agree to our Terms & Conditions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
