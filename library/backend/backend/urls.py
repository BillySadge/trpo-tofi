from django.contrib import admin
from django.urls import path, include

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),
    # path('api/', include('base.urls')),
    path('api/books/', include('base.urls.book_urls')),
    path('api/users/', include('base.urls.user_urls')),
    path('api/orders/', include('base.urls.order_urls')),
]


urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)