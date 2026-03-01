'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { account } from '@/lib/appwrite';
import { useProducts, useCategories } from '@/hooks/useProducts';
import { deleteProduct, createProduct, uploadProductImages } from '@/lib/api/products';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Edit, LogOut, Package, Tag, Layers, Loader2, Camera } from 'lucide-react';
import Image from 'next/image';

export default function AdminDashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: productsData, isLoading: productsLoading } = useProducts();
  const { data: categories } = useCategories();
  
  const products = productsData?.items || [];
  const categoriesList = categories || [];

  const [showForm, setShowOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '', slug: '', description: '', price: 0, sale_price: 0,
    sizes: ['S', 'M', 'L'], category_id: '', images: [] as string[],
    is_featured: false
  });

  const [isUploading, setIsUploading] = useState(false);

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setShowOpen(false);
      setNewProduct({
        name: '', slug: '', description: '', price: 0, sale_price: 0,
        sizes: ['S', 'M', 'L'], category_id: '', images: [] as string[],
        is_featured: false
      });
    }
  });

  useEffect(() => {
    // Check if logged in
    const checkAuth = async () => {
      try {
        await account.get();
      } catch (e) {
        router.push('/admin/login');
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await account.deleteSession('current');
    router.push('/admin/login');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setIsUploading(true);
      try {
        const { urls } = await uploadProductImages(Array.from(e.target.files));
        setNewProduct({ ...newProduct, images: [...newProduct.images, ...urls] });
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(newProduct);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        <div className="text-xl font-black text-orange-600 mb-10 tracking-tight">VASTRAYA ADMIN</div>
        
        <nav className="flex-grow space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-orange-50 text-orange-600 rounded-xl font-bold">
            <Package size={20} /> Products
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium transition-colors">
            <Layers size={20} /> Categories
          </button>
        </nav>

        <button 
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-bold transition-colors"
        >
          <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 md:p-10">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Inventory Management</h1>
            <p className="text-gray-500 font-medium">Manage your product catalog and categories.</p>
          </div>
          <button 
            onClick={() => setShowOpen(true)}
            className="bg-black text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-all active:scale-95 shadow-lg"
          >
            <Plus size={20} /> Add Product
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-1">Total Products</div>
            <div className="text-3xl font-black text-gray-900">{products.length}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-1">Categories</div>
            <div className="text-3xl font-black text-gray-900">{categories.length}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-1">In Stock</div>
            <div className="text-3xl font-black text-green-600">{products.filter(p => p.stock_status === 'in_stock').length}</div>
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {productsLoading ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center">
                    <Loader2 className="animate-spin mx-auto text-orange-600" size={32} />
                  </td>
                </tr>
              ) : products.map((prod) => (
                <tr key={prod.$id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-16 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                        <Image src={prod.images[0] || '/placeholder.png'} alt={prod.name} fill className="object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 line-clamp-1">{prod.name}</div>
                        <div className="text-xs text-gray-400">{prod.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                      {categoriesList.find(c => c.$id === prod.category_id)?.name || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">₹{prod.price}</div>
                    {prod.sale_price && <div className="text-[10px] text-red-500 font-bold uppercase">Sale: ₹{prod.sale_price}</div>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-orange-600 transition-colors"><Edit size={18} /></button>
                      <button 
                        onClick={() => handleDelete(prod.$id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Add Product Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">Create New Product</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Name</label>
                  <input 
                    required value={newProduct.name}
                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Slug</label>
                  <input 
                    required value={newProduct.slug}
                    onChange={e => setNewProduct({...newProduct, slug: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Description</label>
                <textarea 
                  required value={newProduct.description} rows={3}
                  onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Price (₹)</label>
                  <input 
                    type="number" required value={newProduct.price}
                    onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Category</label>
                  <select 
                    required value={newProduct.category_id}
                    onChange={e => setNewProduct({...newProduct, category_id: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select Category</option>
                    {categoriesList.map(c => <option key={c.$id} value={c.$id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2 flex flex-col justify-center">
                  <label className="flex items-center gap-3 cursor-pointer group mt-4">
                    <input 
                      type="checkbox" checked={newProduct.is_featured}
                      onChange={e => setNewProduct({...newProduct, is_featured: e.target.checked})}
                      className="w-5 h-5 accent-orange-600"
                    />
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest group-hover:text-gray-900 transition-colors">Featured</span>
                  </label>
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Product Images</label>
                <div className="flex flex-wrap gap-4">
                  {newProduct.images.map((img, i) => (
                    <div key={i} className="relative w-20 h-24 rounded-lg overflow-hidden border border-orange-200">
                      <Image src={img} alt="Preview" fill className="object-cover" />
                    </div>
                  ))}
                  <label className="w-20 h-24 rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-orange-500 hover:text-orange-500 cursor-pointer transition-all">
                    <Camera size={24} />
                    <span className="text-[8px] font-bold mt-1 uppercase">Upload</span>
                    <input type="file" multiple className="hidden" onChange={handleFileUpload} />
                  </label>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" onClick={() => setShowOpen(false)}
                  className="flex-grow bg-gray-100 text-gray-500 font-bold py-4 rounded-xl hover:bg-gray-200 transition-all"
                >
                  CANCEL
                </button>
                <button 
                  disabled={createMutation.isPending || isUploading}
                  className="flex-grow bg-orange-600 text-white font-bold py-4 rounded-xl hover:bg-orange-700 transition-all shadow-lg active:scale-95 disabled:bg-gray-400"
                >
                  {createMutation.isPending || isUploading ? <Loader2 className="animate-spin mx-auto" /> : 'SAVE PRODUCT'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
