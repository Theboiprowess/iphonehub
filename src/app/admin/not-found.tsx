import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileX, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F5EF] p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg border border-[#CDB586]/20 p-8 text-center">
          <div className="h-16 w-16 rounded-full bg-[#CDB586]/10 flex items-center justify-center mx-auto mb-6">
            <FileX className="h-8 w-8 text-[#CDB586]" />
          </div>
          
          <h2 className="text-2xl font-bold text-[#0E161B] mb-2">
            Page Not Found
          </h2>
          
          <p className="text-[#5F3C18] mb-6">
            The admin page you're looking for doesn't exist or has been moved.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/admin">
              <Button className="bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5]">
                <Home className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
