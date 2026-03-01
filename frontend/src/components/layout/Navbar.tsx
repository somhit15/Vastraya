'use client';

import Link from 'next/link';
import { User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { CartIcon } from '@/components/cart/CartIcon';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-black transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-black tracking-tighter text-orange-600">
              VASTRAYA
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/products" className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-orange-600 transition-colors">Collections</Link>
            <Link href="/category/kurtas" className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-orange-600 transition-colors">Kurtas</Link>
            <Link href="/category/sarees" className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-orange-600 transition-colors">Sarees</Link>
            <Link href="/category/lehengas" className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-orange-600 transition-colors">Lehengas</Link>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-2">
            <Link href="/admin/login" className="text-gray-400 hover:text-black hidden sm:block p-2">
              <User size={20} />
            </Link>
            <CartIcon />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 animate-in slide-in-from-top duration-300">
          <div className="px-6 pt-2 pb-8 space-y-4">
            <Link href="/products" onClick={() => setIsOpen(false)} className="block text-xl font-black uppercase tracking-tighter py-3 border-b border-gray-50">Collections</Link>
            <Link href="/category/kurtas" onClick={() => setIsOpen(false)} className="block text-xl font-black uppercase tracking-tighter py-3 border-b border-gray-50">Kurtas</Link>
            <Link href="/category/sarees" onClick={() => setIsOpen(false)} className="block text-xl font-black uppercase tracking-tighter py-3 border-b border-gray-50">Sarees</Link>
            <Link href="/category/lehengas" onClick={() => setIsOpen(false)} className="block text-xl font-black uppercase tracking-tighter py-3 border-b border-gray-50">Lehengas</Link>
            <Link href="/admin/login" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-sm font-bold text-gray-400 py-4 uppercase tracking-widest">
              <User size={18} /> Admin Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
