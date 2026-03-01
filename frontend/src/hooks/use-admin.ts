import { useState } from 'react';
import { Product } from '@/types';
import { account } from '@/lib/appwrite';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const useAdminProducts = () => {
  const [loading, setLoading] = useState(false);

  const getAuthHeader = async () => {
    try {
      const session = await account.getSession('current');
      // For Appwrite, we'll use the session ID or a custom JWT
      // Our backend is set up to verify via Appwrite SDK directly if needed, 
      // but for this implementation we'll use a simple approach.
      return { 'Authorization': `Bearer ${session.$id}` };
    } catch (e) {
      return {};
    }
  };

  const createProduct = async (data: any) => {
    setLoading(true);
    try {
      const headers = await getAuthHeader();
      const res = await fetch(`${API_URL}/admin/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create product');
      return await res.json();
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, data: any) => {
    setLoading(true);
    try {
      const headers = await getAuthHeader();
      const res = await fetch(`${API_URL}/admin/products/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update product');
      return await res.json();
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    setLoading(true);
    try {
      const headers = await getAuthHeader();
      const res = await fetch(`${API_URL}/admin/products/${id}`, {
        method: 'DELETE',
        headers,
      });
      if (!res.ok) throw new Error('Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  const uploadImages = async (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    const headers = await getAuthHeader();
    const res = await fetch(`${API_URL}/admin/upload-images`, {
      method: 'POST',
      headers,
      body: formData,
    });
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return data.urls; // Array of public URLs
  };

  return { createProduct, updateProduct, deleteProduct, uploadImages, loading };
};
