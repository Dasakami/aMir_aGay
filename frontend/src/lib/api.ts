const API_BASE_URL = 'http://localhost:8000/api';

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  password2: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: number;
  category_name: string;
  style: number;
  style_name: string;
  price: string;
  image: string;
  author: string;
  rating: string;
  reviews_count: number;
  downloads: number;
  tags: string[];
  is_featured: boolean;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  products_count: number;
}

export interface Style {
  id: number;
  name: string;
  slug: string;
  description: string;
  products_count: number;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  total_price: string;
  created_at: string;
}

export interface Order {
  id: number;
  user: number;
  user_email: string;
  status: string;
  total_price: string;
  email: string;
  items: Array<{
    id: number;
    product: Product;
    quantity: number;
    price: string;
    total_price: string;
  }>;
  created_at: string;
  updated_at: string;
}

class API {
  private getAuthHeader() {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request<T>(url: string, opts: RequestInit = {}): Promise<T> {
  if (!opts.headers) opts.headers = {};
  const prot = ['/cart', '/orders', '/favorites', '/categories', '/styles', '/products'];
  if (prot.some(e => url.startsWith(e))) {
    opts.headers = { ...opts.headers, ...this.getAuthHeader() };
  }

  const res = await fetch(`${API_BASE_URL}${url}`, opts);

  if (!res.ok) {
    let m = `Request failed with status ${res.status}`;
    try {
      const d = await res.json();
      m = d.detail || Object.values(d).flat().join(' ') || m;
    } catch {}
    throw new Error(m);
  }

  return res.json() as Promise<T>;
}

  async login(credentials: LoginCredentials) {
    const data = await this.request<{ access: string; refresh: string }>('/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    return data;
  }

  async register(data: RegisterData) {
    return this.request('/register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  async getProducts(params?: Record<string, any>) {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request<Product[]>(`/products/${query}`);
  }

  async getProduct(id: number) {
    return this.request<Product>(`/products/${id}/`);
  }

  async getCategories() {
    return this.request<Category[]>('/categories/');
  }

  async getStyles() {
    return this.request<Style[]>('/styles/');
  }

  async getFavorites() {
    return this.request<Product[]>('/favorites/');
  }

  async addToFavorites(productId: number) {
    return this.request('/favorites/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: productId }),
    });
  }

  async removeFromFavorites(favoriteId: number) {
    return this.request(`/favorites/${favoriteId}/`, { method: 'DELETE' });
  }

  async getCart() {
    return this.request<CartItem[]>('/cart/');
  }

  async addToCart(productId: number, quantity: number = 1) {
    return this.request('/cart/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: productId, quantity }),
    });
  }

  async removeFromCart(cartItemId: number) {
    return this.request(`/cart/${cartItemId}/`, { method: 'DELETE' });
  }

  async clearCart() {
    return this.request('/cart/clear/', { method: 'DELETE' });
  }

  async getOrders() {
    return this.request<Order[]>('/orders/');
  }

  async createOrder(em?: string) {
  const b: Record<string, any> = {};
  if (em && em.trim() !== '') {
    b.email = em;
  }

  return this.request<Order>('/orders/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(b),
  });
}

}

export const api = new API();
