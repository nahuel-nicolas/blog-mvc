from django.urls import path
from . import views
from .views import MyTokenObtainPairView, UserViewSet
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
from rest_framework import routers

router = routers.DefaultRouter()
router.register('user', UserViewSet)

app_name = 'authentication'
urlpatterns = [
    path('', views.getRoutes, name='authentication_home'),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

urlpatterns += router.urls