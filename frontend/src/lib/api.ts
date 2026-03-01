const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: 'An unexpected error occurred' }));
      throw new Error(error.detail || `Error: ${res.status}`);
    }

    if (res.status === 204) return {} as T;
    return res.json();
  }

  // Public Endpoints
  async getProducts(params: { category_slug?: string; featured?: boolean; page?: number; limit?: number } = {}) {
    const query = new URLSearchParams();
    if (params.category_slug) query.append('category_slug', params.category_slug);
    if (params.featured) query.append('featured', 'true');
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());

    return this.request<any>(`/products/?${query.toString()}`);
  }

  async getProductBySlug(slug: string) {
    return this.request<any>(`/products/${slug}`);
  }

  async getCategories() {
    return this.request<any[]>('/categories/');
  }

  async getHealth() {
    return this.request<any>('/health');
  }
}

export const api = new ApiService();
