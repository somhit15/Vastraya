'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { account } from '@/lib/appwrite';
import { useProducts, useCategories } from '@/hooks/useProducts';
import { deleteProduct, createProduct, updateProduct, uploadProductImages } from '@/lib/api/products';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Edit, LogOut, Package, Tag, Layers, Loader2, Camera, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: productsData, isLoading: productsLoading } = useProducts();
  const { data: categories } = useCategories();
  
  const products = productsData?.items || [];
  const categoriesList = categories || [];

  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
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
      closeForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => updateProduct(currentId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      closeForm();
    }
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await account.get();
      } catch (e) {
        router.push('/admin/login');
      }
    };
    checkAuth();
  }, [router]);

  const closeForm = () => {
    setShowOpen(false);
    setIsEditing(false);
    setCurrentId(null);
    setNewProduct({
      name: '', slug: '', description: '', price: 0, sale_price: 0,
      sizes: ['S', 'M', 'L'], category_id: '', images: [] as string[],
      is_featured: false
    });
  };

  const handleEdit = (prod: any) => {
    setCurrentId(prod.$id);
    setNewProduct({
      name: prod.name,
      slug: prod.slug,
      description: prod.description,
      price: prod.price,
      sale_price: prod.sale_price || 0,
      sizes: prod.sizes,
      category_id: prod.category_id,
      images: prod.images,
      is_featured: prod.is_featured
    });
    setIsEditing(true);
    setShowOpen(true);
  };

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
    if (isEditing) {
      updateMutation.mutate(newProduct);
    } else {
      createMutation.mutate(newProduct);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        <div className="text-xl font-black text-orange-600 mb-10 tracking-tight uppercase">Vastraya Admin</div>
        
        <nav className="flex-grow space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-orange-50 text-orange-600 rounded-xl font-bold transition-all">
            <Package size={20} /> Products
          </button>
          <Link href="/" className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium transition-all">
            <ExternalLink size={20} /> View Store
          </Link>
        </nav>

        <button 
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-bold transition-all"
        >
          <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 md:p-10">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Inventory</h1>
            <p className="text-gray-500 font-medium italic">Manage your catalog items.</p>
          </div>
          <button 
            onClick={() => setShowOpen(true)}
            className="bg-black text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-all active:scale-95 shadow-lg"
          >
            <Plus size={20} /> New Product
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Products</div>
            <div className="text-3xl font-black text-gray-900">{products.length}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">In Stock</div>
            <div className="text-3xl font-black text-green-600">{products.length}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Server</div>
              <div className="text-xl font-black text-blue-600 uppercase">Live</div>
            </div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product Details</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Pricing</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
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
                <tr key={prod.$id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-100 flex-shrink-0">
                        <Image src={prod.images[0] || '/placeholder.png'} alt={prod.name} fill className="object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{prod.name}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{prod.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
                      {categoriesList.find(c => c.$id === prod.category_id)?.name || 'General'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900 italic">Rs. {prod.price}</div>
                    {prod.sale_price && prod.sale_price < prod.price && (
                      <div className="text-[10px] text-red-500 font-black uppercase">SALE: Rs. {prod.sale_price}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => handleEdit(prod)} className="p-2 text-gray-300 hover:text-orange-600 transition-all"><Edit size={18} /></button>
                      <button onClick={() => handleDelete(prod.$id)} className="p-2 text-gray-300 hover:text-red-600 transition-all"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] p-10 shadow-2xl relative animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">
                {isEditing ? 'Update Item' : 'New Collection Item'}
              </h2>
              <button onClick={closeForm} className="p-2 hover:bg-gray-100 rounded-full"><X size={24}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Product Name</label>
                  <input 
                    required value={newProduct.name}
                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-gray-900 font-bold focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    placeholder="e.g. Silk Kurta"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">URL Slug</label>
                  <input 
                    required value={newProduct.slug}
                    onChange={e => setNewProduct({...newProduct, slug: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-gray-900 font-bold focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    placeholder="silk-kurta"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Description</label>
                <textarea 
                  required value={newProduct.description} rows={4}
                  onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-gray-900 font-medium focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  placeholder="Tell the story of this item..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Retail Price</label>
                  <input 
                    type="number" required value={newProduct.price}
                    onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                    className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-gray-900 font-bold focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sale Price (Opt)</label>
                  <input 
                    type="number" value={newProduct.sale_price}
                    onChange={e => setNewProduct({...newProduct, sale_price: parseFloat(e.target.value)})}
                    className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-gray-900 font-bold focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</label>
                  <select 
                    required value={newProduct.category_id}
                    onChange={e => setNewProduct({...newProduct, category_id: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-gray-900 font-bold focus:ring-2 focus:ring-orange-500 outline-none transition-all appearance-none"
                  >
                    <option value="">Select...</option>
                    {categoriesList.map(c => <option key={c.$id} value={c.$id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gallery</label>
                <div className="flex flex-wrap gap-4">
                  {newProduct.images.map((img, i) => (
                    <div key={i} className="relative w-24 h-32 rounded-2xl overflow-hidden border-2 border-orange-100 group">
                      <Image src={img} alt="Preview" fill className="object-cover" />
                      <button 
                        type="button" 
                        onClick={() => setNewProduct({...newProduct, images: newProduct.images.filter((_, idx) => idx !== i)})}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12}/>
                      </button>
                    </div>
                  ))}
                  <label className="w-24 h-32 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-orange-500 hover:text-orange-500 cursor-pointer transition-all bg-gray-50 hover:bg-orange-50/30 group">
                    {isUploading ? <Loader2 className="animate-spin" /> : <Camera size={28} className="group-hover:scale-110 transition-transform"/>}
                    <span className="text-[8px] font-black mt-2 uppercase tracking-widest">Upload</span>
                    <input type="file" multiple className="hidden" onChange={handleFileUpload} />
                  </label>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  type="button" onClick={closeForm}
                  className="flex-grow bg-gray-100 text-gray-500 font-black py-5 rounded-2xl hover:bg-gray-200 transition-all uppercase tracking-widest text-xs"
                >
                  Discard
                </button>
                <button 
                  disabled={createMutation.isPending || updateMutation.isPending || isUploading}
                  className="flex-grow bg-orange-600 text-white font-black py-5 rounded-2xl hover:bg-orange-700 transition-all shadow-xl active:scale-95 disabled:bg-gray-400 uppercase tracking-widest text-xs"
                >
                  {createMutation.isPending || updateMutation.isPending ? <Loader2 className="animate-spin mx-auto" /> : isEditing ? 'Push Updates' : 'Publish Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
