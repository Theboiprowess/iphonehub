"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0E161B] p-4 relative overflow-hidden w-full">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(205,181,134,0.3),transparent_70%)]"></div>
      </div>
      
      <Card className="w-full max-w-[480px] bg-[#1A242D] border-[#CDB586]/30 relative z-10 shadow-2xl mx-auto">
        <CardHeader className="space-y-6 text-center pb-6 px-6">
          <div className="flex justify-center">
            <div className="p-4 bg-[#CDB586]/10 rounded-full border border-[#CDB586]/30">
              <Smartphone className="h-10 w-10 text-[#CDB586]" />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-[#EBE2C5] tracking-tight">
              iPhone Hub Zimbabwe
            </CardTitle>
            <p className="text-[#EBE2C5]/60 text-base sm:text-lg">Admin Dashboard Login</p>
          </div>
        </CardHeader>
        <CardContent className="pt-0 px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#EBE2C5] text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@iphonehubzimbabwe.co.zw"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-[#0E161B] border-[#CDB586]/30 text-[#EBE2C5] placeholder:text-[#EBE2C5]/40 h-11 w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#EBE2C5] text-sm font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="•••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="bg-[#0E161B] border-[#CDB586]/30 text-[#EBE2C5] placeholder:text-[#EBE2C5]/40 h-11 w-full"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5] h-12 text-base font-semibold"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
