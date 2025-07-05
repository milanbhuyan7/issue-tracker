from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.documentation import include_docs_urls

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('oauth2_provider.urls', namespace='oauth2_provider')),
    path('api/accounts/', include('allauth.urls')),
    path('api/users/', include('users.urls')),
    path('api/issues/', include('issues.urls')),
    path('api/analytics/', include('analytics.urls')),
    path('api/docs/', include_docs_urls(title='Issues Tracker API')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
