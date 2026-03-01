import { MetadataRoute } from 'next';
import { getProducts } from '@/lib/api/products';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://vastraya.com';

  // Fetch all products for sitemap
  let productEntries: MetadataRoute.Sitemap = [];
  try {
    const products = await getProducts({ limit: 100 });
    productEntries = products.items.map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: new Date(product.$updatedAt),
    }));
  } catch (e) {
    console.error('Sitemap fetch failed', e);
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
    },
    ...productEntries,
  ];
}
