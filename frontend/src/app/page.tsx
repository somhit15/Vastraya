'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShoppingBag, Loader2 } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';

export default function Home() {
  const { data: categories, isLoading } = useCategories();
  const featuredCategories = categories || [];
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1600"
          alt="Hero Banner"
          fill
          className="object-cover brightness-75 scale-105"
          priority
        />
        <div className="relative z-10 text-center px-4 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-md">
            Wear the Tradition
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 drop-shadow-md">
            Discover a curated collection of handcrafted Indian ethnic wear, designed for modern elegance.
          </p>
          <Link
            href="/products"
            className="bg-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg inline-flex items-center gap-2 hover:bg-orange-700 transition-all shadow-lg active:scale-95"
          >
            <span>Explore Collection</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Featured Categories Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Shop by Category</h2>
            <p className="mt-2 text-gray-500">Handpicked collections for every occasion.</p>
          </div>
          <Link href="/products" className="text-orange-600 font-semibold flex items-center gap-1 hover:underline">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-orange-600" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCategories.map((cat) => (
              <Link 
                key={cat.$id} 
                href={`/category/${cat.slug}`}
                className="group relative aspect-[3/4] overflow-hidden rounded-2xl shadow-md"
              >
                <Image
                  src={cat.image_url || 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=800'}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                  <h3 className="text-2xl font-bold text-white tracking-wide">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Feature Section: Quality Promise */}
      <section className="bg-orange-50 py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="text-orange-600" size={24} />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Authentic Fabrics</h4>
            <p className="text-sm text-gray-600">Sourced directly from traditional weavers across India.</p>
          </div>
          <div className="p-6">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ArrowRight className="text-orange-600 rotate-90" size={24} />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Modern Tailoring</h4>
            <p className="text-sm text-gray-600">Traditional designs meets modern fits for everyday comfort.</p>
          </div>
          <div className="p-6">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-orange-600">₹</span>
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Fair Pricing</h4>
            <p className="text-sm text-gray-600">No middlemen, just high-quality clothing at honest prices.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
