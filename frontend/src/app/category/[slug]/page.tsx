'use client';

import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/components/product/ProductCard';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function CategoryPage() {
  const { slug } = useParams();
  const { data, isLoading, error } = useProducts({ category_slug: slug as string });
  const products = data?.items || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 capitalize">
          {slug?.toString().replace('-', ' ')}
        </h1>
        <p className="mt-2 text-gray-500 italic font-medium">Browse our handpicked {slug} collection.</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-orange-600" size={40} />
          <p className="text-gray-500 font-medium">Loading collection...</p>
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-red-500 font-bold">{(error as Error).message || 'Something went wrong. Please try again.'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-8">
          {products.map((product) => (
            <ProductCard key={product.$id} product={product} />
          ))}
        </div>
      )}

      {!isLoading && products.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-500 text-lg">No products found in this category yet.</p>
        </div>
      )}
    </div>
  );
}
