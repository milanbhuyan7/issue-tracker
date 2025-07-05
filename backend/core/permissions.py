from rest_framework import permissions
from users.models import User

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == User.ADMIN

class IsMaintainerOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return (request.user.is_authenticated and 
                request.user.role in [User.MAINTAINER, User.ADMIN])

class IsOwnerOrMaintainerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.role in [User.MAINTAINER, User.ADMIN]:
            return True
        return obj.reporter == request.user

class IsReporterForCreate(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method == 'POST':
            return request.user.is_authenticated
        return True
