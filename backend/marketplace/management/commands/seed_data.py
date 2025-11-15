from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from marketplace.models import Category, Style, Product
import random


class Command(BaseCommand):
    help = 'Загрузка тестовых данных'

    def handle(self, *args, **kwargs):
        self.stdout.write('Загрузка тестовых данных...')

        if not User.objects.filter(username='testuser').exists():
            User.objects.create_user(
                username='testuser',
                email='test@example.com',
                password='testpass123'
            )
            self.stdout.write(self.style.SUCCESS('Создан пользователь: test@example.com / testpass123'))

        categories_data = [
            {'name': 'UI Kit', 'slug': 'ui-kit', 'description': 'Наборы UI компонентов'},
            {'name': 'Mockups', 'slug': 'mockups', 'description': 'Мокапы устройств и продуктов'},
            {'name': 'Иконки', 'slug': 'icons', 'description': 'Наборы иконок'},
            {'name': 'Шаблоны', 'slug': 'templates', 'description': 'Готовые шаблоны сайтов'},
            {'name': 'Графика', 'slug': 'graphics', 'description': 'Графические элементы'},
        ]

        for cat_data in categories_data:
            Category.objects.get_or_create(
                slug=cat_data['slug'],
                defaults={'name': cat_data['name'], 'description': cat_data['description']}
            )
        
        self.stdout.write(self.style.SUCCESS(f'Создано {len(categories_data)} категорий'))

        # Создание стилей
        styles_data = [
            {'name': 'Минимализм', 'slug': 'minimalism', 'description': 'Минималистичный дизайн'},
            {'name': 'Неоморфизм', 'slug': 'neomorphism', 'description': 'Soft UI дизайн'},
            {'name': 'Glassmorphism', 'slug': 'glassmorphism', 'description': 'Эффект матового стекла'},
            {'name': 'Flat', 'slug': 'flat', 'description': 'Плоский дизайн'},
            {'name': '3D', 'slug': '3d', 'description': 'Объемный 3D дизайн'},
            {'name': 'Vintage', 'slug': 'vintage', 'description': 'Винтажный стиль'},
            {'name': 'Modern', 'slug': 'modern', 'description': 'Современный стиль'},
        ]

        for style_data in styles_data:
            Style.objects.get_or_create(
                slug=style_data['slug'],
                defaults={'name': style_data['name'], 'description': style_data['description']}
            )
        
        self.stdout.write(self.style.SUCCESS(f'Создано {len(styles_data)} стилей'))

        # Создание продуктов
        categories = list(Category.objects.all())
        styles = list(Style.objects.all())

        products_data = [
            {
                'name': 'Modern UI Kit Pro',
                'slug': 'modern-ui-kit-pro',
                'description': 'Профессиональный UI Kit с 200+ компонентами для создания современных веб-приложений',
                'category': 'ui-kit',
                'style': 'minimalism',
                'price': 2999,
                'image': 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
                'author': 'Alex Design Studio',
                'rating': 4.8,
                'reviews_count': 156,
                'downloads': 2340,
                'tags': ['Figma', 'Sketch', 'Adobe XD', 'Web'],
                'is_featured': True
            },
            {
                'name': 'iPhone 15 Mockup Set',
                'slug': 'iphone-15-mockup-set',
                'description': 'Реалистичные 3D мокапы iPhone 15 Pro с различными углами съемки',
                'category': 'mockups',
                'style': '3d',
                'price': 1499,
                'image': 'https://images.unsplash.com/photo-1592286927505-838b3a0d3c0c?w=800&h=600&fit=crop',
                'author': 'Mockup Studio',
                'rating': 4.9,
                'reviews_count': 89,
                'downloads': 1567,
                'tags': ['PSD', 'Figma', 'Smart Object'],
                'is_featured': True
            },
            {
                'name': 'Minimalist Icon Pack',
                'slug': 'minimalist-icon-pack',
                'description': '500+ минималистичных иконок для веб и мобильных приложений',
                'category': 'icons',
                'style': 'minimalism',
                'price': 799,
                'image': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop',
                'author': 'Icon Masters',
                'rating': 4.7,
                'reviews_count': 234,
                'downloads': 4521,
                'tags': ['SVG', 'PNG', 'AI', 'Web', 'Mobile'],
                'is_featured': False
            },
            {
                'name': 'Glass Dashboard UI',
                'slug': 'glass-dashboard-ui',
                'description': 'Стильный дашборд с эффектом матового стекла и современными компонентами',
                'category': 'templates',
                'style': 'glassmorphism',
                'price': 3499,
                'image': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
                'author': 'UI Trends Co',
                'rating': 4.9,
                'reviews_count': 67,
                'downloads': 890,
                'tags': ['Figma', 'React', 'Vue', 'HTML'],
                'is_featured': True
            },
            {
                'name': 'Neomorphic UI Components',
                'slug': 'neomorphic-ui-components',
                'description': 'Набор неоморфных компонентов для создания уникальных интерфейсов',
                'category': 'ui-kit',
                'style': 'neomorphism',
                'price': 2499,
                'image': 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&h=600&fit=crop',
                'author': 'Neo Design Co',
                'rating': 4.6,
                'reviews_count': 123,
                'downloads': 1890,
                'tags': ['Figma', 'CSS', 'Sketch'],
                'is_featured': False
            },
            {
                'name': 'MacBook Pro Mockups',
                'slug': 'macbook-pro-mockups',
                'description': 'Профессиональные мокапы MacBook Pro 16" с высоким разрешением',
                'category': 'mockups',
                'style': 'minimalism',
                'price': 1999,
                'image': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop',
                'author': 'Mockup Studio',
                'rating': 4.8,
                'reviews_count': 201,
                'downloads': 3456,
                'tags': ['PSD', 'Sketch', 'Smart Object'],
                'is_featured': True
            },
            {
                'name': '3D Icon Collection',
                'slug': '3d-icon-collection',
                'description': '300+ объемных 3D иконок для современных проектов',
                'category': 'icons',
                'style': '3d',
                'price': 1299,
                'image': 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop',
                'author': 'Icon Masters',
                'rating': 4.9,
                'reviews_count': 178,
                'downloads': 2890,
                'tags': ['PNG', 'Blender', 'C4D'],
                'is_featured': False
            },
            {
                'name': 'Retro Website Template',
                'slug': 'retro-website-template',
                'description': 'Винтажный шаблон веб-сайта с уникальным дизайном',
                'category': 'templates',
                'style': 'vintage',
                'price': 2799,
                'image': 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=600&fit=crop',
                'author': 'Retro Designs',
                'rating': 4.5,
                'reviews_count': 92,
                'downloads': 1234,
                'tags': ['HTML', 'CSS', 'JS', 'Bootstrap'],
                'is_featured': False
            },
            {
                'name': 'Flat Design UI Kit',
                'slug': 'flat-design-ui-kit',
                'description': 'Яркий и современный flat дизайн UI Kit',
                'category': 'ui-kit',
                'style': 'flat',
                'price': 1899,
                'image': 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop',
                'author': 'Flat Studio',
                'rating': 4.7,
                'reviews_count': 145,
                'downloads': 2678,
                'tags': ['Figma', 'Sketch', 'Illustrator'],
                'is_featured': False
            },
            {
                'name': 'Abstract Shapes Pack',
                'slug': 'abstract-shapes-pack',
                'description': 'Коллекция абстрактных форм и графических элементов',
                'category': 'graphics',
                'style': 'modern',
                'price': 999,
                'image': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=600&fit=crop',
                'author': 'Graphics Pro',
                'rating': 4.6,
                'reviews_count': 87,
                'downloads': 1567,
                'tags': ['AI', 'SVG', 'EPS'],
                'is_featured': False
            },
            {
                'name': 'Tablet Mockup Bundle',
                'slug': 'tablet-mockup-bundle',
                'description': 'Набор мокапов планшетов различных моделей',
                'category': 'mockups',
                'style': 'minimalism',
                'price': 1799,
                'image': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=600&fit=crop',
                'author': 'Mockup Studio',
                'rating': 4.7,
                'reviews_count': 112,
                'downloads': 1998,
                'tags': ['PSD', 'Sketch'],
                'is_featured': False
            },
            {
                'name': 'Line Icons Pro',
                'slug': 'line-icons-pro',
                'description': '1000+ линейных иконок в едином стиле',
                'category': 'icons',
                'style': 'minimalism',
                'price': 899,
                'image': 'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=800&h=600&fit=crop',
                'author': 'Icon Masters',
                'rating': 4.8,
                'reviews_count': 267,
                'downloads': 5432,
                'tags': ['SVG', 'PNG', 'Webfont'],
                'is_featured': True
            },
            {
                'name': 'E-commerce Template',
                'slug': 'ecommerce-template',
                'description': 'Полнофункциональный шаблон интернет-магазина',
                'category': 'templates',
                'style': 'modern',
                'price': 4999,
                'image': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
                'author': 'Template Kings',
                'rating': 4.9,
                'reviews_count': 234,
                'downloads': 3456,
                'tags': ['Figma', 'React', 'Next.js'],
                'is_featured': True
            },
            {
                'name': 'Gradient Backgrounds',
                'slug': 'gradient-backgrounds',
                'description': '100+ градиентных фонов высокого качества',
                'category': 'graphics',
                'style': 'modern',
                'price': 599,
                'image': 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&h=600&fit=crop',
                'author': 'Graphics Pro',
                'rating': 4.5,
                'reviews_count': 156,
                'downloads': 3890,
                'tags': ['JPG', 'PNG', 'AI'],
                'is_featured': False
            },
            {
                'name': 'Watch Mockups Collection',
                'slug': 'watch-mockups-collection',
                'description': 'Мокапы смарт-часов для презентации дизайнов',
                'category': 'mockups',
                'style': '3d',
                'price': 1299,
                'image': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop',
                'author': 'Mockup Studio',
                'rating': 4.7,
                'reviews_count': 98,
                'downloads': 1456,
                'tags': ['PSD', 'Figma'],
                'is_featured': False
            },
            {
                'name': 'Animated Icons Set',
                'slug': 'animated-icons-set',
                'description': '200+ анимированных иконок в формате Lottie',
                'category': 'icons',
                'style': 'modern',
                'price': 1599,
                'image': 'https://images.unsplash.com/photo-1598662957563-ee4965d4d72c?w=800&h=600&fit=crop',
                'author': 'Animation Lab',
                'rating': 4.9,
                'reviews_count': 189,
                'downloads': 2345,
                'tags': ['Lottie', 'JSON', 'After Effects'],
                'is_featured': True
            },
            {
                'name': 'Landing Page Bundle',
                'slug': 'landing-page-bundle',
                'description': '10 готовых шаблонов посадочных страниц',
                'category': 'templates',
                'style': 'modern',
                'price': 3999,
                'image': 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop',
                'author': 'Template Kings',
                'rating': 4.8,
                'reviews_count': 145,
                'downloads': 2678,
                'tags': ['HTML', 'CSS', 'JS', 'Responsive'],
                'is_featured': True
            },
            {
                'name': 'Texture Pack',
                'slug': 'texture-pack',
                'description': '50+ текстур высокого разрешения',
                'category': 'graphics',
                'style': 'vintage',
                'price': 799,
                'image': 'https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?w=800&h=600&fit=crop',
                'author': 'Graphics Pro',
                'rating': 4.6,
                'reviews_count': 124,
                'downloads': 2234,
                'tags': ['JPG', 'PNG', 'Tileable'],
                'is_featured': False
            },
            {
                'name': 'Smartphone Mockup Pro',
                'slug': 'smartphone-mockup-pro',
                'description': 'Универсальные мокапы современных смартфонов',
                'category': 'mockups',
                'style': 'minimalism',
                'price': 1699,
                'image': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop',
                'author': 'Mockup Studio',
                'rating': 4.8,
                'reviews_count': 223,
                'downloads': 3890,
                'tags': ['PSD', 'Sketch', 'Figma'],
                'is_featured': False
            },
            {
                'name': 'Social Media Kit',
                'slug': 'social-media-kit',
                'description': 'Шаблоны для социальных сетей (Instagram, Facebook, Twitter)',
                'category': 'templates',
                'style': 'modern',
                'price': 1299,
                'image': 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop',
                'author': 'Social Designs',
                'rating': 4.7,
                'reviews_count': 198,
                'downloads': 4567,
                'tags': ['PSD', 'Figma', 'Canva'],
                'is_featured': True
            },
        ]

        created_count = 0
        for prod_data in products_data:
            category = Category.objects.get(slug=prod_data['category'])
            style = Style.objects.get(slug=prod_data['style'])
            
            product, created = Product.objects.get_or_create(
                slug=prod_data['slug'],
                defaults={
                    'name': prod_data['name'],
                    'description': prod_data['description'],
                    'category': category,
                    'style': style,
                    'price': prod_data['price'],
                    'image': prod_data['image'],
                    'author': prod_data['author'],
                    'rating': prod_data['rating'],
                    'reviews_count': prod_data['reviews_count'],
                    'downloads': prod_data['downloads'],
                    'tags': prod_data['tags'],
                    'is_featured': prod_data['is_featured'],
                }
            )
            
            if created:
                created_count += 1

        self.stdout.write(self.style.SUCCESS(f'Создано {created_count} продуктов'))
        self.stdout.write(self.style.SUCCESS('Загрузка данных завершена!'))