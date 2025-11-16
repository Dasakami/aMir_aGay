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
      const [cats, sts] = await Promise.all([
        api.getCategories(),
        api.getStyles(),
      ]);
      setCategories(cats);
      setStyles(sts);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить данные для фильтра",
        variant: "destructive",
      });
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const p: any = {};
      if (selectedCategory) p.category = selectedCategory;
      if (selectedStyle) p.style = selectedStyle;
      if (priceRange[0] > 0) p.min_price = priceRange[0];
      if (priceRange[1] < 10000) p.max_price = priceRange[1];
      if (sortBy) p.ordering = sortBy;
      if (searchQuery) p.search = searchQuery;

      const d = await api.getProducts(p);
      setProducts(d);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить товары",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const d = await api.getFavorites();
      setFavorites(d.map((f: any) => f.product.id));
    } catch (error) {
    }
  };

  const handleAddToFavorites = async (productId: number) => {
    if (!isAuthenticated) {
      toast({
        title: "Требуется авторизация",
        description: "Пожалуйста, войдите в систему, чтобы добавить товар в избранное",
        variant: "destructive",
      });
      return;
    }

    try {
      await api.addToFavorites(productId);
      setFavorites([...favorites, productId]);
      toast({
        title: "Добавлено в избранное",
        description: "Товар сохранен в избранное",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Ошибка при сохранении в избранное",
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
      <div className="mb-12 rounded-2xl bg-gradient-primary p-8 text-center text-primary-foreground md:p-12">
        <h1 className="mb-4 text-4xl font-bold md:text-5xl">
          Премиум дизайн ресурсы
        </h1>
        <p className="mx-auto max-w-2xl text-lg opacity-90">
          Откройте для себя высококачественные наборы пользовательского интерфейса, макеты, иконки и шаблоны, созданные талантливыми дизайнерами
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Фильтры</h2>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Очистить
              </Button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Категория</Label>
                <Select value={selectedCategory || "all"} onValueChange={(value) => setSelectedCategory(value === "all" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Все категории" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все категории</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.name}>
                        {c.name} ({c.products_count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Стиль</Label>
                <Select value={selectedStyle || "all"} onValueChange={(value) => setSelectedStyle(value === "all" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Все стили" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все стили</SelectItem>
                    {styles.map((s) => (
                      <SelectItem key={s.id} value={s.name}>
                        {s.name} ({s.products_count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>Диапазон цен</Label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={10000}
                  step={100}
                  className="mt-2"
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{priceRange[0]} сомов</span>
                  <span>{priceRange[1]} сомов </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Сортировать </Label>
                <Select value={sortBy || "default"} onValueChange={(value) => setSortBy(value === "default" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Default" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">По умолчанию</SelectItem>
                    <SelectItem value="-rating">Самый высокий рейтинг</SelectItem>
                    <SelectItem value="price">от низкой до высокой</SelectItem>
                    <SelectItem value="-price">от высокой до низкой</SelectItem>
                    <SelectItem value="-downloads">популярности</SelectItem>
                    <SelectItem value="-created_at">дате</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </aside>

        <main>
          <div className="mb-6">
            <h2 className="text-2xl font-bold">
              {searchQuery ? `Результаты поиска по "${searchQuery}"` : 'Все продукты'}
            </h2>
            <p className="text-muted-foreground">
              {loading ? 'Загружается...' : `Найдено товаров: ${products.length}`}
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
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAddToFavorites={handleAddToFavorites}
                  isFavorite={favorites.includes(p.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[400px] items-center justify-center rounded-lg border-2 border-dashed border-border">
              <div className="text-center">
                <p className="mb-2 text-lg font-semibold">Товары не найдены</p>
                <p className="text-muted-foreground">Попробуйте изменить фильтры</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
