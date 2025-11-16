import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, CartItem } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Trash2, ShoppingBag } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const d = await api.getCart();
      setCartItems(d);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить корзину",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: number) => {
    try {
      await api.removeFromCart(id);
      setCartItems(cartItems.filter((i) => i.id !== id));
      toast({
        title: "Удалено из корзины",
        description: "Товар успешно удален",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить товар",
        variant: "destructive",
      });
    }
  };

  const handleCheckout = async () => {
    try {
      await api.createOrder('');
      await api.clearCart();
      toast({
        title: "Заказ оформлен!",
        description: "Ваш заказ успешно создан",
      });
      navigate('/orders');
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось создать заказ",
        variant: "destructive",
      });
    }
  };

  const t = cartItems.reduce(
    (s, i) => s + Number(i.total_price),
    0
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="mb-8 h-10 w-48" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Корзина</h1>

      {cartItems.length === 0 ? (
        <Card className="p-12 text-center">
          <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-semibold">Ваша корзина пуста</h2>
          <p className="mb-6 text-muted-foreground">
            Начните покупки, чтобы добавить товары в корзину
          </p>
          <Button asChild>
            <Link to="/">Смотреть товары</Link>
          </Button>
        </Card>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          <div className="space-y-4">
            {cartItems.map((i) => (
              <Card key={i.id} className="p-4">
                <div className="flex gap-4">
                  <Link to={`/product/${i.product.id}`}>
                    <img
                      src={i.product.image}
                      alt={i.product.name}
                      className="h-24 w-24 rounded-lg object-cover"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <Link to={`/product/${i.product.id}`}>
                        <h3 className="font-semibold hover:text-primary">
                          {i.product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {i.product.author}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">
                        ₽{i.total_price}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(i.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="h-fit p-6">
            <h2 className="mb-6 text-xl font-bold">Итого</h2>
            <div className="space-y-3 border-b border-border pb-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Товаров</span>
                <span>{cartItems.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Сумма</span>
                <span>₽{t.toFixed(2)}</span>
              </div>
            </div>
            <div className="my-4 flex justify-between text-xl font-bold">
              <span>Всего</span>
              <span>₽{t.toFixed(2)}</span>
            </div>
            <Button onClick={handleCheckout} className="w-full" size="lg">
              Оформить заказ
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}
