export default function ShippingPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-black text-gray-900 mb-10 text-center uppercase tracking-tight">Shipping Policy</h1>
      
      <div className="space-y-12 text-gray-600">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">Dispatch Timeline</h2>
          <p className="leading-relaxed">
            All orders are processed within 2-3 business days. Orders are not shipped or delivered on weekends or public holidays.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">Shipping Rates & Estimates</h2>
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <div className="flex justify-between mb-2">
              <span className="font-bold text-gray-900 uppercase text-[10px] tracking-widest">Region</span>
              <span className="font-bold text-gray-900 uppercase text-[10px] tracking-widest">Delivery Time</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2 mb-2">
              <span className="text-sm">Metro Cities</span>
              <span className="text-sm">3-5 Business Days</span>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-2">
              <span className="text-sm">Rest of India</span>
              <span className="text-sm">5-8 Business Days</span>
            </div>
          </div>
          <p className="mt-4 text-sm italic font-medium">Free shipping on all orders above Rs. 2000!</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">Order Tracking</h2>
          <p className="leading-relaxed">
            You will receive a shipment confirmation message on WhatsApp once your order has shipped containing your tracking number(s).
          </p>
        </section>
      </div>
    </div>
  );
}
