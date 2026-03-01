export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl font-black text-gray-900 mb-6">Contact Us</h1>
      <p className="text-gray-500 text-lg leading-relaxed mb-10">
        We're here to help! Whether you have questions about sizing, styling, or an existing order, feel free to reach out.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
        <div className="bg-gray-50 p-8 rounded-2xl">
          <h3 className="font-bold text-gray-900 mb-2 uppercase tracking-widest text-xs">WhatsApp Support</h3>
          <p className="text-gray-600 font-medium">+91 98765 43210</p>
          <p className="text-gray-400 text-sm mt-1">Available 10 AM - 7 PM</p>
        </div>
        <div className="bg-gray-50 p-8 rounded-2xl">
          <h3 className="font-bold text-gray-900 mb-2 uppercase tracking-widest text-xs">Email</h3>
          <p className="text-gray-600 font-medium">support@vastraya.com</p>
          <p className="text-gray-400 text-sm mt-1">Response within 24 hours</p>
        </div>
      </div>
    </div>
  );
}
