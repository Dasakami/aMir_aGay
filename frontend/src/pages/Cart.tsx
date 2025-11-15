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
      const data = await api.getCart();
      setCartItems(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load cart",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (itemId: number) => {
    try {
      await api.removeFromCart(itemId);
      setCartItems(cartItems.filter((item) => item.id !== itemId));
      toast({
        title: "Removed from cart",
        description: "Item removed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      });
    }
  };

  const handleCheckout = async () => {
    try {
      await api.createOrder('');
      await api.clearCart();
      toast({
        title: "Order placed!",
        description: "Your order has been created successfully",
      });
      navigate('/orders');
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create order",
        variant: "destructive",
      });
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.total_price),
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
      <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <Card className="p-12 text-center">
          <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-semibold">Your cart is empty</h2>
          <p className="mb-6 text-muted-foreground">
            Start shopping to add items to your cart
          </p>
          <Button asChild>
            <Link to="/">Browse Products</Link>
          </Button>
        </Card>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex gap-4">
                  <Link to={`/product/${item.product.id}`}>
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-24 w-24 rounded-lg object-cover"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <Link to={`/product/${item.product.id}`}>
                        <h3 className="font-semibold hover:text-primary">
                          {item.product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {item.product.author}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">
                        ₽{item.total_price}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(item.id)}
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
            <h2 className="mb-6 text-xl font-bold">Order Summary</h2>
            <div className="space-y-3 border-b border-border pb-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Items</span>
                <span>{cartItems.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₽{total.toFixed(2)}</span>
              </div>
            </div>
            <div className="my-4 flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>₽{total.toFixed(2)}</span>
            </div>
            <Button onClick={handleCheckout} className="w-full" size="lg">
              Proceed to Checkout
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}
