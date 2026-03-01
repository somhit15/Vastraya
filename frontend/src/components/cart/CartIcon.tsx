'use client';

import { ShoppingBag } from 'lucide-react';
import { useCartStore, getTotalItems } from '@/store/cartStore';
import { useEffect, useState } from 'react';
import { clsx } from 'clsx';

export const CartIcon = () => {
  const toggleCart = useCartStore((state) => state.toggleCart);
  const totalItems = useCartStore(getTotalItems);
  const [mounted, setMounted] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    setMounted(true);
    useCartStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (totalItems > 0) {
      setIsPulsing(true);
      const timer = setTimeout(() => setIsPulsing(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  if (!mounted) return (
    <div className="p-2 relative text-gray-600">
      <ShoppingBag size={24} />
    </div>
  );

  return (
    <button
      onClick={toggleCart}
      className="p-2 relative text-gray-600 hover:text-orange-600 transition-colors group"
      aria-label="Toggle Cart"
    >
      <ShoppingBag size={24} className="group-active:scale-90 transition-transform" />
      {totalItems > 0 && (
        <span className={clsx(
          "absolute top-0 right-0 bg-orange-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[1.2rem] h-[1.2rem] flex items-center justify-center border-2 border-white transition-transform",
          isPulsing && "scale-125"
        )}>
          {totalItems}
        </span>
      )}
    </button>
  );
};
