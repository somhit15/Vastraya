import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-orange-600">VASTRAYA</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Ethically sourced, traditionally inspired modern Indian clothing for everyone.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Shop</h4>
            <ul className="space-y-2">
              <li><Link href="/products" className="text-gray-500 hover:text-orange-600 text-sm">New Arrivals</Link></li>
              <li><Link href="/category/best-sellers" className="text-gray-500 hover:text-orange-600 text-sm">Best Sellers</Link></li>
              <li><Link href="/category/festive" className="text-gray-500 hover:text-orange-600 text-sm">Festive Edit</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link href="/contact" className="text-gray-500 hover:text-orange-600 text-sm">Contact Us</Link></li>
              <li><Link href="/shipping" className="text-gray-500 hover:text-orange-600 text-sm">Shipping Policy</Link></li>
              <li><Link href="/returns" className="text-gray-500 hover:text-orange-600 text-sm">Returns & Exchange</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Newsletter</h4>
            <p className="text-gray-500 text-sm mb-4">Get early access to new collections.</p>
            <form className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email address"
                className="bg-white border border-gray-200 rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-1 focus:ring-orange-600"
              />
              <button className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors">
                Join
              </button>
            </form>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-400 text-xs">
            © {new Date().getFullYear()} Vastraya. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
