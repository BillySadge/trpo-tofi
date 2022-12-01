from django.urls import path
from base.views import book_views as views

urlpatterns = [

    path('', views.getBooks, name="books"),
    path('create/', views.createBook, name="book-create"),
    path('<str:pk>', views.getBook, name="book"),

    path('update/<str:pk>/', views.updateBook, name="book-update"),
    path('delete/<str:pk>/', views.deleteBook, name="book-delete"),

    

]