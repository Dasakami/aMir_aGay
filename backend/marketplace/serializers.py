from rest_framework import serializers
from .models import Category, Style, Product, Favorite, CartItem, Order, OrderItem


class CategorySerializer(serializers.ModelSerializer):
    products_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'products_count']

    def get_products_count(self, obj):
        return obj.products.count()


class StyleSerializer(serializers.ModelSerializer):
    products_count = serializers.SerializerMethodField()

    class Meta:
        model = Style
        fields = ['id', 'name', 'slug', 'description', 'products_count']

    def get_products_count(self, obj):
        return obj.products.count()


class ProductListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    style_name = serializers.CharField(source='style.name', read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'category', 'category_name',
            'style', 'style_name', 'price', 'image', 'author', 'rating',
            'reviews_count', 'downloads', 'tags', 'is_featured', 'created_at'
        ]


class ProductDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    style = StyleSerializer(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'category', 'style', 'price',
            'image', 'author', 'rating', 'reviews_count', 'downloads', 'tags',
            'is_featured', 'created_at', 'updated_at'
        ]


class FavoriteSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Favorite
        fields = ['id', 'product', 'product_id', 'created_at']

    def create(self, validated_data):
        user = self.context['request'].user
        product_id = validated_data['product_id']
        
        favorite, created = Favorite.objects.get_or_create(
            user=user,
            product_id=product_id
        )
        
        return favorite


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity', 'total_price', 'created_at']

    def get_total_price(self, obj):
        return obj.get_total_price()

    def create(self, validated_data):
        user = self.context['request'].user
        product_id = validated_data['product_id']
        quantity = validated_data.get('quantity', 1)
        
        cart_item, created = CartItem.objects.get_or_create(
            user=user,
            product_id=product_id,
            defaults={'quantity': quantity}
        )
        
        if not created:
            cart_item.quantity += quantity
            cart_item.save()
        
        return cart_item


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'price', 'total_price']

    def get_total_price(self, obj):
        return obj.get_total_price()


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    email = serializers.EmailField(required=False) 
    
    class Meta:
        model = Order
        fields = ['id', 'user', 'user_email', 'status', 'total_price', 'email', 'items', 'created_at', 'updated_at']
        read_only_fields = ['user', 'total_price', 'status']

    def create(self, validated_data):
        user = self.context['request'].user
        cart_items = CartItem.objects.filter(user=user)
        
        if not cart_items.exists():
            raise serializers.ValidationError('Корзина пуста')
        
        total_price = sum(item.get_total_price() for item in cart_items)
        
        order = Order.objects.create(
            user=user,
            total_price=total_price,
            email=validated_data.get('email', user.email)
        )
        
        for cart_item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                quantity=cart_item.quantity,
                price=cart_item.product.price
            )
        
        cart_items.delete()
        
        return order