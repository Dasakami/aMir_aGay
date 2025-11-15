# Маркетплейс для дизайнеров - Backend (Django REST Framework)

## Структура проекта

```
designer_marketplace/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── config/
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   └── marketplace/
│       ├── __init__.py
│       ├── admin.py
│       ├── models.py
│       ├── serializers.py
│       ├── views.py
│       ├── urls.py
│       └── management/
│           └── commands/
│               └── seed_data.py
└── frontend/
    └── (React приложение)
```

## Установка и запуск Backend

### 1. Создайте виртуальное окружение
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# или
venv\Scripts\activate  # Windows
```

### 2. Установите зависимости
```bash
pip install -r requirements.txt
```

### 3. Выполните миграции
```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. Создайте суперпользователя
```bash
python manage.py createsuperuser
```

### 5. Загрузите тестовые данные
```bash
python manage.py seed_data
```

### 6. Запустите сервер
```bash
python manage.py runserver
```

Backend будет доступен по адресу: `http://localhost:8000`

## API Endpoints

### Продукты
- `GET /api/products/` - Список всех продуктов
- `GET /api/products/{id}/` - Детали продукта
- `GET /api/products/?category=UI Kit` - Фильтр по категории
- `GET /api/products/?style=Минимализм` - Фильтр по стилю
- `GET /api/products/?search=mockup` - Поиск
- `GET /api/products/?ordering=-rating` - Сортировка
- `GET /api/products/?min_price=1000&max_price=3000` - Фильтр по цене

### Категории
- `GET /api/categories/` - Список категорий

### Стили
- `GET /api/styles/` - Список стилей

### Избранное
- `GET /api/favorites/` - Список избранного
- `POST /api/favorites/` - Добавить в избранное
- `DELETE /api/favorites/{id}/` - Удалить из избранного

### Корзина
- `GET /api/cart/` - Содержимое корзины
- `POST /api/cart/` - Добавить в корзину
- `DELETE /api/cart/{id}/` - Удалить из корзины
- `DELETE /api/cart/clear/` - Очистить корзину

### Заказы
- `GET /api/orders/` - История заказов
- `POST /api/orders/` - Создать заказ
- `GET /api/orders/{id}/` - Детали заказа

## Тестовые данные

После выполнения `python manage.py seed_data` будут созданы:
- 20+ продуктов разных категорий
- 5 категорий (UI Kit, Mockups, Иконки, Шаблоны, Графика)
- 7 стилей дизайна (Минимализм, Неоморфизм, Glassmorphism, Flat, 3D, Vintage, Modern)
- Тестовый пользователь: `test@example.com` / `testpass123`

## Админ-панель

Доступ к админ-панели: `http://localhost:8000/admin/`

## CORS

CORS настроен для работы с фронтендом на `http://localhost:3000`