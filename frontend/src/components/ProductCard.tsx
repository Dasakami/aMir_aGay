import { Link } from 'react-router-dom';
import { Heart, Download, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/lib/api';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  onAddToFavorites?: (productId: number) => void;
  isFavorite?: boolean;
}

export default function ProductCard({ product, onAddToFavorites, isFavorite }: ProductCardProps) {
  const [hover, setHover] = useState(false);

  return (
    <Card
      className="group overflow-hidden transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {product.is_featured && (
            <Badge className="absolute left-3 top-3 bg-gradient-accent">
              Рекомендуемое
            </Badge>
          )}
        </div>
      </Link>

      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <Link to={`/product/${product.id}`} className="flex-1">
            <h3 className="font-semibold leading-tight transition-colors hover:text-primary">
              {product.name}
            </h3>
          </Link>
          {onAddToFavorites && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => onAddToFavorites(product.id)}
            >
              <Heart
                className={`h-4 w-4 transition-colors ${
                  isFavorite ? 'fill-destructive text-destructive' : ''
                }`}
              />
            </Button>
          )}
        </div>

        <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
          <span>{product.author}</span>
          <span>•</span>
          <Badge variant="secondary" className="text-xs">
            {product.category_name}
          </Badge>
        </div>

        <div className="mb-3 flex items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="font-medium">{product.rating}</span>
            <span>({product.reviews_count})</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            <span>{product.downloads.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">{product.price} сом</span>
          <Button
            size="sm"
            className={`transition-all duration-300 ${
              hover ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0'
            }`}
          >
            Подробнее
          </Button>
        </div>
      </div>
    </Card>
  );
}
