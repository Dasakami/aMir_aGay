import { useState, useEffect } from 'react';
import { api, Product } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Favorites() {
  const [favorites, setFavorites] = useState<Array<{ id: number; product: Product }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const data = await api.getFavorites();
      setFavorites(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load favorites",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (favoriteId: number) => {
    try {
      await api.removeFromFavorites(favoriteId);
      setFavorites(favorites.filter((fav) => fav.id !== favoriteId));
      toast({
        title: "Removed from favorites",
        description: "Product removed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove favorite",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="mb-8 h-10 w-48" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[4/3] w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">My Favorites</h1>

      {favorites.length === 0 ? (
        <Card className="p-12 text-center">
          <Heart className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-semibold">No favorites yet</h2>
          <p className="mb-6 text-muted-foreground">
            Start exploring and save your favorite products
          </p>
          <Button asChild>
            <Link to="/">Browse Products</Link>
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((fav) => (
            <ProductCard
              key={fav.id}
              product={fav.product}
              onAddToFavorites={() => handleRemove(fav.id)}
              isFavorite={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
