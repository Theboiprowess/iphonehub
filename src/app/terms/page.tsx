import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F7F5EF] section-spacing">
      <div className="site-container">
          <h1 className="text-4xl sm:text-5xl font-bold mb-12 text-[#0E161B] font-manrope text-center">Terms & Conditions</h1>

        <Card className="bg-[#F7F5EF] border-[#CDB586]">
          <CardContent className="pt-8 space-y-10">
            <section>
              <h2 className="text-xl font-semibold mb-6 text-[#0E161B]">Acceptance of Terms</h2>
              <p className="text-[#5F3C18] leading-relaxed">
                By accessing and using iPhone Hub Zimbabwe's website, you accept and agree to be bound by these Terms & Conditions. If you do not agree to these terms, please do not use our website.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-6 text-[#0E161B]">Product Information</h2>
              <p className="text-[#5F3C18] leading-relaxed">
                We strive to provide accurate product information, including specifications, condition, and battery health. However, we do not warrant that product descriptions are error-free. All devices are sold as described, and we encourage customers to review all information before purchase.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-6 text-[#0E161B]">Pricing and Payment</h2>
              <p className="text-[#5F3C18] leading-relaxed">
                All prices are in USD unless otherwise stated. We reserve the right to modify prices at any time without prior notice. Payment is required at the time of order placement unless alternative arrangements are made.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-6 text-[#0E161B]">Orders and Acceptance</h2>
              <p className="text-[#5F3C18] leading-relaxed">
                We reserve the right to refuse or cancel any order for any reason, including product availability, errors in pricing, or suspected fraud. You will be notified if your order is cancelled and any payment made will be refunded.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-6 text-[#0E161B]">Delivery</h2>
              <p className="text-[#5F3C18] leading-relaxed">
                Delivery times are estimates and not guaranteed. We are not responsible for delays caused by circumstances beyond our control. Risk of loss transfers to you upon delivery.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-6 text-[#0E161B]">Warranty and Returns</h2>
              <p className="text-[#5F3C18] leading-relaxed">
                Warranty terms vary by product condition and are specified on each product page. Returns are accepted within the specified warranty period for defective devices. Please refer to our Warranty Policy and Return Policy for detailed information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-6 text-[#0E161B]">Limitation of Liability</h2>
              <p className="text-[#5F3C18] leading-relaxed">
                iPhone Hub Zimbabwe shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our products or services. Our liability is limited to the purchase price of the product.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-6 text-[#0E161B]">Governing Law</h2>
              <p className="text-[#5F3C18] leading-relaxed">
                These Terms & Conditions are governed by the laws of Zimbabwe. Any disputes shall be resolved in the courts of Zimbabwe.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-6 text-[#0E161B]">Changes to Terms</h2>
              <p className="text-[#5F3C18] leading-relaxed">
                We reserve the right to modify these Terms & Conditions at any time. Continued use of the website after changes constitutes acceptance of the new terms.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
