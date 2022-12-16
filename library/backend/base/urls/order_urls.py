from django.urls import path
from base.views import order_views as views

urlpatterns = [
    path('', views.getOrders, name='orders'),
    path('add/', views.addOrderItems, name='orders-add'),
    path('myorders/', views.getMyOrders, name='myorders'),
    path('myorders/', views.getMyOrders, name='myorders'),
    # path('signatures/', views.getSignitures, name='signatures'),

    path('<str:pk>/deliver/', views.downloadPDF, name='order-download'),
    path('<str:pk>/', views.getOrderById, name='user-order'),
    path('<str:pk>/pay/', views.updateOrderToPaid, name='pay'),

    
]