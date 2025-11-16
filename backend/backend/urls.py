
from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from .api_views import RegisterView

from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions
sv = get_schema_view(
   openapi.Info(
      title="Edutest Pro API",
      default_version='v1',
      description="Добро пожаловать! Это бета-версия, но апи работает.",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="dendasakami@gmail.com"),
      license=openapi.License(name="AAU License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('marketplace.urls')),
    path("api/register/", RegisterView.as_view(), name="register"),
    path("api/login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path('auth/', include('djoser.urls')),
    re_path(r'^auth/', include('djoser.urls.authtoken')),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    path('swagger.<format>/', sv.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', sv.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', sv.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
