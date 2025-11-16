import { useState, useEffect } from 'react';
import { api, Order } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Package } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const d = await api.getOrders();
      setOrders(d);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить заказы",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'pending':
        return 'bg-yellow-500';
      case 'paid':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="mb-8 h-10 w-48" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Мои заказы</h1>

      {orders.length === 0 ? (
        <Card className="p-12 text-center">
          <Package className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-semibold">Заказов пока нет</h2>
          <p className="mb-6 text-muted-foreground">
            История ваших заказов появится здесь
          </p>
          <Button asChild>
            <Link to="/">Начать покупки</Link>
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((o) => (
            <Card key={o.id} className="p-6">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-3">
                    <h3 className="text-lg font-semibold">
                      Заказ #{o.id}
                    </h3>
                    <Badge className={getStatusColor(o.status)}>
                      {o.status === 'pending' ? 'Ожидает' : o.status === 'processing' ? 'В обработке' : o.status === 'completed' ? 'Завершен' : o.status === 'cancelled' ? 'Отменен' : o.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(o.created_at).toLocaleDateString('ru-RU', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Всего</div>
                  <div className="text-2xl font-bold">₽{o.total_price}</div>
                </div>
              </div>

              <div className="space-y-3 border-t border-border pt-4">
                {o.items.map((i) => (
                  <div key={i.id} className="flex gap-4">
                    <Link to={`/product/${i.product.id}`}>
                      <img
                        src={i.product.image}
                        alt={i.product.name}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                    </Link>
                    <div className="flex flex-1 items-center justify-between">
                      <div>
                        <Link
                          to={`/product/${i.product.id}`}
                          className="font-medium hover:text-primary"
                        >
                          {i.product.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {i.product.author}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">₽{i.price}</div>
                        <div className="text-sm text-muted-foreground">
                          Количество: {i.quantity}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
