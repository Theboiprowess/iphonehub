"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Smartphone } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-[#0E161B] p-4">
      <Card className="w-full max-w-md bg-[#1A242D] border-[#CDB586]/30">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="p-3 bg-[#CDB586]/10 rounded-full">
              <Smartphone className="h-8 w-8 text-[#CDB586]" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-[#EBE2C5]">
            iPhone Hub Zimbabwe
          </CardTitle>
          <p className="text-[#EBE2C5]/60">Admin Dashboard Login</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#EBE2C5]">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@iphonehubzimbabwe.co.zw"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="bg-[#0E161B] border-[#CDB586]/30 text-[#EBE2C5] placeholder:text-[#EBE2C5]/40"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#EBE2C5]">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="bg-[#0E161B] border-[#CDB586]/30 text-[#EBE2C5] placeholder:text-[#EBE2C5]/40"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5]"
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
