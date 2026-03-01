'use client';

import { useCart } from '@/store/use-cart';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBasket } from 'lucide-react';
import { WhatsAppCheckoutButton } from '@/components/cart/WhatsAppCheckoutButton';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6 text-gray-400">
          <ShoppingBasket size={40} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
        <p className="text-gray-500 mb-8 text-lg">Looks like you haven't added anything to your cart yet.</p>
        <Link 
          href="/products" 
          className="inline-block bg-orange-600 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-700 transition-all shadow-md active:scale-95"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-10">Shopping Cart ({totalItems()})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div 
              key={`${item.$id}-${item.selectedSize}`} 
              className="flex gap-4 sm:gap-6 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm"
            >
              <div className="relative w-24 h-32 sm:w-32 sm:h-40 rounded-xl overflow-hidden flex-shrink-0">
                <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
              </div>

              <div className="flex flex-col flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg sm:text-xl mb-1">{item.name}</h3>
                    <p className="text-gray-500 text-sm font-medium mb-4 uppercase tracking-wide">Size: {item.selectedSize}</p>
                  </div>
                  <button 
                    onClick={() => removeItem(item.$id, item.selectedSize)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="mt-auto flex justify-between items-end">
                  <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-2 py-1">
                    <button 
                      onClick={() => updateQuantity(item.$id, item.selectedSize, Math.max(1, item.quantity - 1))}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.$id, item.selectedSize, item.quantity + 1)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">₹{(item.sale_price || item.price) * item.quantity}</p>
                    {item.sale_price && <p className="text-xs text-gray-400 line-through">₹{item.price * item.quantity}</p>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-2xl p-8 sticky top-24 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">Order Summary</h2>
            
            <div className="space-y-4 mb-8 text-sm sm:text-base font-medium text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal ({totalItems()} items)</span>
                <span>₹{totalPrice()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600 font-bold">FREE</span>
              </div>
              <div className="border-t border-gray-200 pt-4 flex justify-between text-xl font-extrabold text-gray-900">
                <span>Total</span>
                <span>₹{totalPrice()}</span>
              </div>
            </div>

            <WhatsAppCheckoutButton />
            
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-400 leading-relaxed font-medium">
                No payment is required now. You will be redirected to WhatsApp to confirm your order details with us.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
