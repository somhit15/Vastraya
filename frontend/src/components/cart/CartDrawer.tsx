'use client';

import { useEffect, useState } from 'react';
import { useCartStore, getTotal, getTotalItems, getWhatsAppMessage } from '@/store/cartStore';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { clsx } from 'clsx';

export const CartDrawer = () => {
  const { items, isOpen, closeCart, removeItem, updateQuantity } = useCartStore();
  const total = useCartStore(getTotal);
  const totalItems = useCartStore(getTotalItems);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted) return null;

  const handleCheckout = () => {
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '910000000000';
    const url = getWhatsAppMessage(useCartStore.getState(), whatsappNumber);
    window.open(url, '_blank');
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={clsx(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className={clsx(
        "fixed top-0 right-0 h-full w-full max-w-sm bg-white z-[101] shadow-2xl transition-transform duration-300 ease-out flex flex-col",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase">Your Cart</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{totalItems} items</p>
          </div>
          <button onClick={closeCart} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag size={32} className="text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium mb-6">Your shopping bag is empty</p>
              <Link 
                href="/products" 
                onClick={closeCart}
                className="inline-flex items-center gap-2 text-orange-600 font-black text-sm uppercase tracking-wider hover:gap-3 transition-all"
              >
                Continue Shopping <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex gap-4 group animate-in slide-in-from-right-4 duration-300">
                <div className="relative w-[60px] h-[80px] rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                
                <div className="flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-sm font-bold text-gray-900 leading-tight line-clamp-1">{item.name}</h3>
                    <button 
                      onClick={() => removeItem(item.id, item.size)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-black uppercase bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                      {item.size}
                    </span>
                    <span className="text-xs font-bold text-gray-900 italic">Rs. {item.price}</span>
                  </div>

                  <div className="mt-auto flex justify-between items-center">
                    <div className="flex items-center border border-gray-200 rounded-md bg-white shadow-sm overflow-hidden scale-90 -ml-2">
                      <button 
                        onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                        className="p-1.5 hover:bg-gray-50 text-gray-500 transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-xs font-black text-gray-900 border-x border-gray-100">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                        className="p-1.5 hover:bg-gray-50 text-gray-500 transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <span className="text-sm font-black text-orange-600">Rs. {item.price * item.quantity}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-white">
            <div className="flex justify-between items-end mb-6">
              <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Subtotal</span>
              <span className="text-2xl font-black text-gray-900 tracking-tighter">Rs. {total}</span>
            </div>
            
            <button
              onClick={handleCheckout}
              className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-black py-4 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg group"
            >
              <ShoppingBag size={20} className="group-hover:scale-110 transition-transform" />
              <span className="uppercase tracking-widest text-sm">Checkout via WhatsApp</span>
            </button>
            
            <p className="mt-4 text-[9px] text-center text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
              Fast & Secure • Confirm via Chat • Free Delivery
            </p>
          </div>
        )}
      </div>
    </>
  );
};
