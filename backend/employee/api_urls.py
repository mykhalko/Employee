from django.conf.urls import url, include

from rest_framework import routers
from rest_framework_jwt import views as auth_views

from . import views


app_name = 'employee'

router = routers.DefaultRouter('')
router.register('employee', views.EmployeeViewSet)


urlpatterns = [
    url(r'^token-auth/', auth_views.obtain_jwt_token),
    url(r'^token-refresh/', auth_views.refresh_jwt_token),
    url(r'^', include(router.urls)),
]
