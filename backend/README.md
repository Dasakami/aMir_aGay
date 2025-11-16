# Маркетплейс Backend

## Установка

cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py seed_data
python manage.py runserver

Сервер будет на http://localhost:8000

## API

GET /api/products/
GET /api/products/{id}/
GET /api/products/?category=UI Kit
GET /api/products/?style=Минимализм
GET /api/products/?search=mockup
GET /api/products/?ordering=-rating
GET /api/products/?min_price=1000&max_price=3000

GET /api/categories/
GET /api/styles/

GET /api/favorites/
POST /api/favorites/
DELETE /api/favorites/{id}/

GET /api/cart/
POST /api/cart/
DELETE /api/cart/{id}/
DELETE /api/cart/clear/

GET /api/orders/
POST /api/orders/
GET /api/orders/{id}/

## Тестовые данные

После seed_data будет:
- 20+ продуктов
- 5 категорий
- 7 стилей
- Пользователь: test@example.com / testpass123

Админка: http://localhost:8000/admin/
