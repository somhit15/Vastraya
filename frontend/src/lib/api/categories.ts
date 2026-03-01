import apiClient from './client';
import { Category } from '@/types';

export async function getCategories(): Promise<Category[]> {
  return apiClient.get('/categories/');
}

export async function getCategory(slug: string): Promise<Category> {
  return apiClient.get(`/categories/${slug}`);
}

export async function createCategory(data: any): Promise<Category> {
  return apiClient.post('/admin/categories', data);
}

export async function updateCategory(id: string, data: any): Promise<Category> {
  return apiClient.patch(`/admin/categories/${id}`, data);
}

export async function deleteCategory(id: string): Promise<void> {
  return apiClient.delete(`/admin/categories/${id}`);
}

export async function uploadCategoryImage(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('file', file);
  return apiClient.post('/categories/upload-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
