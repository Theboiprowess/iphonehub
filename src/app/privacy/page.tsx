import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F7F5EF] section-spacing">
      <div className="site-container">
          <h1 className="text-4xl sm:text-5xl font-bold mb-12 text-[#0E161B] font-manrope text-center">Privacy Policy</h1>

        <Card className="bg-[#F7F5EF] border-[#CDB586]">
          <CardContent className="pt-8 space-y-10">
            <section>
              <h2 className="text-xl font-semibold mb-6 text-[#0E161B]">Information We Collect</h2>
              <p className="text-[#5F3C18] leading-relaxed">
                We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us. This may include your name, email address, phone number, payment information, and delivery address.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-6 text-[#0E161B]">How We Use Your Information</h2>
              <p className="text-[#5F3C18] leading-relaxed">
                We use the information we collect to process your orders, communicate with you about your purchases, provide customer support, and improve our services. We do not sell your personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-6 text-[#0E161B]">Data Security</h2>
              <p className="text-[#5F3C18] leading-relaxed">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is completely secure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-6 text-[#0E161B]">Your Rights</h2>
              <p className="text-[#5F3C18] leading-relaxed">
                You have the right to access, correct, or delete your personal information. You may also opt out of marketing communications. To exercise these rights, please contact us using the information provided on our contact page.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-6 text-[#0E161B]">Cookies</h2>
              <p className="text-[#5F3C18] leading-relaxed">
                We use cookies to enhance your browsing experience and analyze site traffic. You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-6 text-[#0E161B]">Contact Us</h2>
              <p className="text-[#5F3C18] leading-relaxed">
                If you have questions about this Privacy Policy, please contact us through our contact page or at info@iphonehubzimbabwe.co.zw
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
