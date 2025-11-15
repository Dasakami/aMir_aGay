from django.contrib import admin
from .models import Category, Style, Product, Favorite, CartItem, Order, OrderItem


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'created_at']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name']


@admin.register(Style)
class StyleAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'style', 'price', 'rating', 'downloads', 'is_featured', 'created_at']
    list_filter = ['category', 'style', 'is_featured', 'created_at']
    search_fields = ['name', 'author', 'description']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['price', 'is_featured']


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ['user', 'product', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__username', 'product__name']


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ['user', 'product', 'quantity', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__username', 'product__name']


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product', 'quantity', 'price']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'status', 'total_price', 'email', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['user__username', 'email']
    inlines = [OrderItemInline]
    readonly_fields = ['user', 'total_price', 'created_at', 'updated_at']