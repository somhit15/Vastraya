import apiClient from './client';
import { Product } from '@/types';
import { PaginatedResponse } from '@/types/api';

export async function getProducts(params: {
  page?: number;
  limit?: number;
  category_slug?: string;
  featured?: boolean;
  search?: string;
} = {}): Promise<PaginatedResponse<Product>> {
  return apiClient.get('/products/', { params });
}

export async function getProduct(slug: string): Promise<Product> {
  return apiClient.get(`/products/${slug}`);
}

export async function createProduct(data: any): Promise<Product> {
  return apiClient.post('/admin/products', data);
}

export async function updateProduct(id: string, data: any): Promise<Product> {
  return apiClient.patch(`/admin/products/${id}`, data);
}

export async function deleteProduct(id: string): Promise<void> {
  return apiClient.delete(`/admin/products/${id}`);
}

export async function uploadProductImages(files: File[]): Promise<{ urls: string[] }> {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));
  return apiClient.post('/admin/upload-images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
