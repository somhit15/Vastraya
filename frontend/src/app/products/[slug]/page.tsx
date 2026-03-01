'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useProduct } from '@/hooks/useProducts';
import { useCartStore } from '@/store/cartStore';
import { Product } from '@/types';
import { Loader2, ShoppingBag, Heart, ShieldCheck, Truck } from 'lucide-react';
import { clsx } from 'clsx';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { data: product, isLoading } = useProduct(slug as string);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (product?.sizes?.length) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-orange-600" size={40} />
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-20 font-bold text-xl">Product not found.</div>;
  }

  const hasSale = product.sale_price && product.sale_price < product.price;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-sm">
            <Image
              src={product.images[0] || '/placeholder.png'}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.slice(1).map((img, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-gray-100">
                  <Image src={img} alt={`${product.name} ${i}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-extrabold text-gray-900 leading-tight mb-2">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            {hasSale ? (
              <>
                <span className="text-3xl font-bold text-gray-900">₹{product.sale_price}</span>
                <span className="text-lg text-gray-400 line-through decoration-2">₹{product.price}</span>
                <span className="bg-red-50 text-red-600 text-xs font-bold px-2 py-1 rounded">
                  {Math.round(((product.price - product.sale_price!) / product.price) * 100)}% OFF
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
            )}
          </div>

          <div className="prose prose-sm text-gray-600 mb-8 leading-relaxed">
            <p>{product.description}</p>
          </div>

          {/* Size Selector */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Select Size</h3>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={clsx(
                    "min-w-[3.5rem] h-12 px-4 rounded-lg border-2 font-bold text-sm transition-all uppercase",
                    selectedSize === size 
                      ? "border-orange-600 bg-orange-50 text-orange-600 shadow-sm" 
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mb-10">
            <button
              onClick={() => addItem({
                id: product.$id,
                name: product.name,
                price: product.sale_price || product.price,
                image: product.images[0],
                size: selectedSize,
                slug: product.slug
              })}
              className="flex-grow bg-orange-600 hover:bg-orange-700 text-white font-bold h-14 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
            >
              <ShoppingBag size={20} />
              <span>Add to Cart</span>
            </button>
            <button className="w-14 h-14 border-2 border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors group">
              <Heart size={20} className="text-gray-400 group-hover:text-red-500" />
            </button>
          </div>

          {/* Value Props */}
          <div className="border-t border-gray-100 pt-8 space-y-4">
            <div className="flex items-center gap-3 text-gray-600">
              <Truck size={20} className="text-orange-600" />
              <span className="text-sm font-medium">Free shipping on orders above ₹2000</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <ShieldCheck size={20} className="text-orange-600" />
              <span className="text-sm font-medium">100% Authentic Handcrafted Quality</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
