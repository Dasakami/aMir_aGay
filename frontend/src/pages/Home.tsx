import { useState, useEffect } from 'react';
import { api, Product, Category, Style } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface HomeProps {
  searchQuery?: string;
}

export default function Home({ searchQuery }: HomeProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [styles, setStyles] = useState<Style[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [priceRange, setPriceRange] = useState<number[]>([0, 10000]);
  const [sortBy, setSortBy] = useState<string>('');

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, selectedStyle, priceRange, sortBy, searchQuery]);

  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites();
    }
  }, [isAuthenticated]);

  const loadInitialData = async () => {
    try {
      const [categoriesData, stylesData] = await Promise.all([
        api.getCategories(),
        api.getStyles(),
      ]);
      setCategories(categoriesData);
      setStyles(stylesData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load filters",
        variant: "destructive",
      });
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (selectedCategory) params.category = selectedCategory;
      if (selectedStyle) params.style = selectedStyle;
      if (priceRange[0] > 0) params.min_price = priceRange[0];
      if (priceRange[1] < 10000) params.max_price = priceRange[1];
      if (sortBy) params.ordering = sortBy;
      if (searchQuery) params.search = searchQuery;

      const data = await api.getProducts(params);
      setProducts(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const data = await api.getFavorites();
      setFavorites(data.map((fav: any) => fav.product.id));
    } catch (error) {
      // Silent fail for favorites
    }
  };

  const handleAddToFavorites = async (productId: number) => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please login to add favorites",
        variant: "destructive",
      });
      return;
    }

    try {
      await api.addToFavorites(productId);
      setFavorites([...favorites, productId]);
      toast({
        title: "Added to favorites",
        description: "Product saved to your favorites",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add to favorites",
        variant: "destructive",
      });
    }
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedStyle('');
    setPriceRange([0, 10000]);
    setSortBy('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-12 rounded-2xl bg-gradient-primary p-8 text-center text-primary-foreground md:p-12">
        <h1 className="mb-4 text-4xl font-bold md:text-5xl">
          Premium Design Resources
        </h1>
        <p className="mx-auto max-w-2xl text-lg opacity-90">
          Discover high-quality UI kits, mockups, icons, and templates created by talented designers
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Filters Sidebar */}
        <aside className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Filters</h2>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear
              </Button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={selectedCategory || "all"} onValueChange={(value) => setSelectedCategory(value === "all" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name} ({cat.products_count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Style</Label>
                <Select value={selectedStyle || "all"} onValueChange={(value) => setSelectedStyle(value === "all" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All styles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All styles</SelectItem>
                    {styles.map((style) => (
                      <SelectItem key={style.id} value={style.name}>
                        {style.name} ({style.products_count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>Price Range</Label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={10000}
                  step={100}
                  className="mt-2"
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>₽{priceRange[0]}</span>
                  <span>₽{priceRange[1]}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Sort By</Label>
                <Select value={sortBy || "default"} onValueChange={(value) => setSortBy(value === "default" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Default" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="-rating">Highest Rated</SelectItem>
                    <SelectItem value="price">Price: Low to High</SelectItem>
                    <SelectItem value="-price">Price: High to Low</SelectItem>
                    <SelectItem value="-downloads">Most Popular</SelectItem>
                    <SelectItem value="-created_at">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <main>
          <div className="mb-6">
            <h2 className="text-2xl font-bold">
              {searchQuery ? `Search results for "${searchQuery}"` : 'All Products'}
            </h2>
            <p className="text-muted-foreground">
              {loading ? 'Loading...' : `${products.length} products found`}
            </p>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToFavorites={handleAddToFavorites}
                  isFavorite={favorites.includes(product.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[400px] items-center justify-center rounded-lg border-2 border-dashed border-border">
              <div className="text-center">
                <p className="mb-2 text-lg font-semibold">No products found</p>
                <p className="text-muted-foreground">Try adjusting your filters</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
