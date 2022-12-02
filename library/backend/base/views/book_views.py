from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from base.models import Book,Review
from base.serializer import BookSerializer

from rest_framework import status


@api_view(['GET'])
def getBooks(request):
    books = Book.objects.all()
    serializer = BookSerializer(books, many=True)
    return Response(serializer.data)



@api_view(['GET'])
def getBook(request, pk):
    book = Book.objects.get(_id=pk)
    serializer = BookSerializer(book, many=False)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def createBook(request):
    user = request.user
    book = Book.objects.create(
        user=user,
        name='Sample Name',
        price=0,
        brand='Sample Brand',
        countInStock=0,
        category='Sample Category',
        description=''
    )
    serializer = BookSerializer(book, many=False)
    return Response(serializer.data)




@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateBook(request, pk):
    data = request.data
    book = Book.objects.get(_id=pk)
    book.name = data['name']
    book.price = data['price']
    book.brand = data['brand']
    book.countInStock = data['countInStock']
    book.category = data['category']
    book.description = data['description']
    book.save()

    serializer = BookSerializer(book, many=False)
    return Response(serializer.data)



@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteBook(request, pk):
    book = Book.objects.get(_id=pk)
    book.delete()

    return Response('Book deleted')



@api_view(['POST'])
def uploadImage(request):
    data = request.data
    book_id = data['book_id']
    book = Book.objects.get(_id=book_id)
    book.image = request.FILES.get('image')
    book.save()
     
    return Response('Image was uploaded')




@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createBookReview(request,pk):
    user = request.user
    book = Book.objects.get(_id=pk)
    data = request.data

    alreadyExist = book.review_set.filter(user=user).exists()

    if alreadyExist:
        content = {'details': 'Book already reviewed'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)


    elif data['rating'] == 0:
        content = {'details': 'Please select a rating'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    else:
        review = Review.objects.create(
            user=user,
            book=book,
            name=user.first_name,
            rating=data['rating'],
            comment=data['comment'],
        )
        reviews = book.review_set.all()
        book.numReviews = len(reviews)

        total = 0
        for i in reviews:
            total += i.rating
        book.rating = total / len(reviews)
        book.save()

        return Response('Review added')
        


