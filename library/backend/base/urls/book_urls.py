from django.urls import path
from base.views import book_views as views

urlpatterns = [

    path('', views.getBooks, name="books"),
    path('create/', views.createBook, name="book-create"),
    path('upload/image/', views.uploadImage, name="image-upload"),
    path('upload/file/', views.uploadFile, name="file-upload"),

    path('<str:pk>/reviews/', views.createBookReview, name="create-review"),
    path('top/', views.getTopBooks, name='top-books'),
    path('<str:pk>', views.getBook, name="book"),

    path('update/<str:pk>/', views.updateBook, name="book-update"),
    path('delete/<str:pk>/', views.deleteBook, name="book-delete"),

    

]