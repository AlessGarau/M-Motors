from rest_framework import permissions

class IsAdminProfile(permissions.BasePermission):
    """
    Custom permission to only allow users with is_admin=True in their profile.
    """
    def has_permission(self, request, view):
        if request.user.is_authenticated:
            return getattr(request.user.profile, 'is_admin', False)
        return False