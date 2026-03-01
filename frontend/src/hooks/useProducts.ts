import { useQuery } from '@tanstack/react-query';
import { getProducts, getProduct } from '@/lib/api/products';

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => getProducts({ featured: true, limit: 10 }),
  });
};

export const useProducts = (params: {
  page?: number;
  limit?: number;
  category_slug?: string;
  search?: string;
} = {}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => getProducts(params),
  });
};

export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => getProduct(slug),
    enabled: !!slug,
  });
};
