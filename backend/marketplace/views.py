from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import  IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Style, Product, Favorite, CartItem, Order
from .serializers import (
    CategorySerializer, StyleSerializer, ProductListSerializer,
    ProductDetailSerializer, FavoriteSerializer, CartItemSerializer, OrderSerializer
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'


class StyleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Style.objects.all()
    serializer_class = StyleSerializer
    lookup_field = 'slug'


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.select_related('category', 'style').all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__slug', 'style__slug', 'is_featured']
    search_fields = ['name', 'description', 'author', 'tags']
    ordering_fields = ['price', 'rating', 'downloads', 'created_at']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductListSerializer

    def get_queryset(self):
        q = super().get_queryset()
        minp = self.request.query_params.get('min_price')
        if minp:
            q = q.filter(price__gte=minp)

        maxp = self.request.query_params.get('max_price')
        if maxp:
            q = q.filter(price__lte=maxp)

        cat = self.request.query_params.get('category')
        if cat:
            q = q.filter(category__name=cat)

        st = self.request.query_params.get('style')
        if st:
            q = q.filter(style__name=st)
        
        return q

    @action(detail=False, methods=['get'])
    def featured(self, request):
        items = self.get_queryset().filter(is_featured=True)
        p = self.paginate_queryset(items)
        if p is not None:
            s = self.get_serializer(p, many=True)
            return self.get_paginated_response(s.data)
        s = self.get_serializer(items, many=True)
        return Response(s.data)

    @action(detail=False, methods=['get'])
    def popular(self, request):
        items = self.get_queryset().order_by('-downloads')[:12]
        s = self.get_serializer(items, many=True)
        return Response(s.data)


class FavoriteViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user).select_related('product')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user).select_related('product')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['delete'])
    def clear(self, request):
        CartItem.objects.filter(user=request.user).delete()
        return Response({'message': 'Корзина очищена'}, status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['get'])
    def total(self, request):
        items = self.get_queryset()
        t = sum(i.get_total_price() for i in items)
        return Response({'total': t, 'items_count': items.count()})


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items__product')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)