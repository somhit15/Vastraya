export default function ReturnsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-black text-gray-900 mb-10 text-center uppercase tracking-tight">Returns & Exchange</h1>
      
      <div className="space-y-12 text-gray-600">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">Eligibility</h2>
          <p className="leading-relaxed">
            We accept returns or exchanges within **7 days** of delivery. To be eligible, your item must be unused, unwashed, and in the same condition that you received it with all original tags intact.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">Non-Returnable Items</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm font-medium">
            <li>Customized or altered clothing</li>
            <li>Items purchased during a Clearance Sale</li>
            <li>Innerwear or Accessories for hygiene reasons</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">Process</h2>
          <p className="leading-relaxed mb-4">
            To initiate a return or exchange, please send us a message on WhatsApp with your order details and a photo of the item.
          </p>
          <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 flex flex-col items-center gap-4">
            <p className="text-orange-800 font-bold text-sm">Need help with a return?</p>
            <button className="bg-orange-600 text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-orange-700 transition-all active:scale-95">
              Chat via WhatsApp
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
