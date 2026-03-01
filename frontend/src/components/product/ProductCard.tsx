'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { Heart, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const hasSale = product.sale_price && product.sale_price < product.price;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.$id,
      name: product.name,
      price: product.sale_price || product.price,
      image: product.images[0],
      size: product.sizes[0] || 'Standard',
      slug: product.slug
    });
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-lg overflow-hidden transition-all hover:shadow-xl duration-300">
      {/* Image Container */}
      <Link href={`/products/${product.slug}`} className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={product.images[0] || '/placeholder.png'}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
        {hasSale && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">
            SALE
          </div>
        )}
        <button 
          onClick={handleQuickAdd}
          className="absolute bottom-2 left-2 right-2 py-2 bg-white/90 backdrop-blur-sm text-black text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 flex items-center justify-center gap-2 hover:bg-orange-600 hover:text-white"
        >
          <ShoppingBag size={14} /> Quick Add
        </button>
        <button className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <Heart size={16} className="text-gray-600 hover:text-red-500 transition-colors" />
        </button>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm font-medium text-gray-900 group-hover:text-orange-600 transition-colors truncate">
            {product.name}
          </h3>
        </Link>
        <div className="mt-2 flex items-center gap-2">
          {hasSale ? (
            <>
              <span className="text-lg font-bold text-gray-900">₹{product.sale_price}</span>
              <span className="text-sm text-gray-400 line-through">₹{product.price}</span>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
          )}
        </div>
        
        {/* Sizes Quick View */}
        <div className="mt-4 flex flex-wrap gap-1">
          {product.sizes.slice(0, 4).map((size) => (
            <span key={size} className="text-[10px] uppercase border border-gray-200 px-1.5 py-0.5 rounded text-gray-500">
              {size}
            </span>
          ))}
          {product.sizes.length > 4 && (
            <span className="text-[10px] text-gray-400">+{product.sizes.length - 4}</span>
          )}
        </div>
      </div>
    </div>
  );
};
