import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api, Product } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, Download, ShoppingCart, Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const data = await api.getProduct(Number(id));
      setProduct(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please login to add items to cart",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    try {
      await api.addToCart(Number(id));
      toast({
        title: "Added to cart",
        description: "Product added to your cart",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add to cart",
        variant: "destructive",
      });
    }
  };

  const handleAddToFavorites = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please login to add favorites",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    try {
      await api.addToFavorites(Number(id));
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <Skeleton className="aspect-square w-full" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="mb-4 text-2xl font-bold">Product not found</h2>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Product Image */}
        <div className="overflow-hidden rounded-2xl bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Badge>{product.category_name}</Badge>
              <Badge variant="outline">{product.style_name}</Badge>
              {product.is_featured && (
                <Badge className="bg-gradient-accent">Featured</Badge>
              )}
            </div>
            <h1 className="mb-2 text-4xl font-bold">{product.name}</h1>
            <p className="text-lg text-muted-foreground">by {product.author}</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(Number(product.rating))
                        ? 'fill-primary text-primary'
                        : 'text-muted'
                    }`}
                  />
                ))}
              </div>
              <span className="font-semibold">{product.rating}</span>
              <span className="text-muted-foreground">
                ({product.reviews_count} reviews)
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Download className="h-5 w-5" />
              <span>{product.downloads.toLocaleString()} downloads</span>
            </div>
          </div>

          <div className="rounded-lg bg-muted p-6">
            <div className="mb-2 text-sm text-muted-foreground">Price</div>
            <div className="text-4xl font-bold">₽{product.price}</div>
          </div>

          <div className="space-y-3">
            <Button onClick={handleAddToCart} size="lg" className="w-full">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button
              onClick={handleAddToFavorites}
              variant="outline"
              size="lg"
              className="w-full"
            >
              <Heart className="mr-2 h-5 w-5" />
              Add to Favorites
            </Button>
          </div>

          <div className="space-y-3 border-t border-border pt-6">
            <h3 className="font-semibold">Description</h3>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <div className="space-y-3 border-t border-border pt-6">
            <h3 className="font-semibold">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
