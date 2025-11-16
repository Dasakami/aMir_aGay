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
        u = self.context['request'].user
        pid = validated_data['product_id']
        
        f, c = Favorite.objects.get_or_create(
            user=u,
            product_id=pid
        )
        
        return f


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
        u = self.context['request'].user
        pid = validated_data['product_id']
        qty = validated_data.get('quantity', 1)
        
        ci, cr = CartItem.objects.get_or_create(
            user=u,
            product_id=pid,
            defaults={'quantity': qty}
        )
        
        if not cr:
            ci.quantity += qty
            ci.save()
        
        return ci


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
        u = self.context['request'].user
        cis = CartItem.objects.filter(user=u)
        
        if not cis.exists():
            raise serializers.ValidationError('Корзина пуста')
        
        tp = sum(i.get_total_price() for i in cis)
        
        o = Order.objects.create(
            user=u,
            total_price=tp,
            email=validated_data.get('email', u.email)
        )
        
        for ci in cis:
            OrderItem.objects.create(
                order=o,
                product=ci.product,
                quantity=ci.quantity,
                price=ci.product.price
            )
        
        cis.delete()
        
        return o