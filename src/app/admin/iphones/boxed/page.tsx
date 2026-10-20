"use client";

import { Smartphone } from "lucide-react";

export default function AdminBoxediPhonesPage() {
  return (
    <div className="w-full max-w-full p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0E161B]">Boxed iPhones</h1>
          <p className="text-[#5F3C18] mt-1">Manage boxed iPhone inventory</p>
        </div>

        <div className="bg-white rounded-xl border border-[#CDB586]/20 p-8 text-center">
          <div className="h-16 w-16 rounded-full bg-[#CDB586]/10 flex items-center justify-center mx-auto mb-6">
            <Smartphone className="h-8 w-8 text-[#CDB586]" />
          </div>
          <h3 className="text-xl font-semibold text-[#0E161B] mb-2">Boxed iPhone management coming soon</h3>
          <p className="text-[#5F3C18]">This feature is under development and will be available soon</p>
        </div>
      </div>
    </div>
  );
}
