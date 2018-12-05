from django.contrib.auth import get_user_model

from rest_framework import permissions


User = get_user_model()


class IsStaffOrReadOnly(permissions.BasePermission):

    def has_permission(self, request, *args, **kwargs):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff
