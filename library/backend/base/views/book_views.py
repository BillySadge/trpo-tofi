from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from base.models import Book,Review
from base.serializer import BookSerializer

from rest_framework import status
from django.core.exceptions import ValidationError
from base.validator.MyValidator import MyValidator

from base.signeture import sign_pdf


@api_view(['GET'])
def getBooks(request):
    query = request.query_params.get('keyword')

    if query == None:
        query = ''

    books = Book.objects.filter(name__icontains=query)
    # print(books.query)
    page = request.query_params.get('page')
    paginator = Paginator(books, 8)


    try:
        books = paginator.page(page)
    except PageNotAnInteger:
        books = paginator.page(1)
    except EmptyPage:
        books = paginator.page(paginator.num_pages)


    if page == None:
        page = 1



    page = int(page)
    # print(page)
    serializer = BookSerializer(books, many=True)
    return Response({'books': serializer.data, 'page': page, 'pages': paginator.num_pages})


@api_view(['GET'])
def getTopBooks(request):
    books = Book.objects.filter(rating__gte=4).order_by('-rating')[0:5]
    # print(books.query)
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
        author='Sample Author',
        countInStock=1,
        category='Sample Category',
        description=''
        
    )

    
    serializer = BookSerializer(book, many=False)
    return Response(serializer.data)




@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateBook(request, pk):
    data = request.data
    try: 
        validator = MyValidator()
        print(data['price'])
        validator.validate_book(float(data['price']))
        book = Book.objects.get(_id=pk)
        book.name = data['name']
        book.price = data['price']
        book.author = data['author']
        book.countInStock = data['countInStock']
        book.category = data['category']
        book.description = data['description']
        # book.uploadSrc = data['bookSrc']

        # print(data['bookSrc'])
        if(data["bookSrc"] == None):
            raise ValidationError('ага а книгу не загрузишь? мы тут скамом не занимаемся')
        book.save()
    except ValidationError as e:
        message = {'detail': e}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


    serializer = BookSerializer(book, many=False)
    return Response(serializer.data)



@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteBook(request, pk):
    book = Book.objects.get(_id=pk)
    # # print(book)
    # sign_pdf.load()
    # sign_pdf.sign_file(str(book.uploadSrc),"ANDREI CHAPLINSKI", 280, 0)
    book.delete()

    return Response('Book deleted')



@api_view(['POST'])
def uploadImage(request):
    data = request.data
    print(data)
    book_id = data['book_id']
    book = Book.objects.get(_id=book_id)
    book.image = request.FILES.get('image')
    book.save()
    return Response('Image was uploaded')
 





@api_view(['POST'])
def uploadFile(request):
    data = request.data
    print(data)
    book_id = data['book_id']
    book = Book.objects.get(_id=book_id)
    book.uploadSrc = request.FILES.get('bookSrc')
    book.save()
    return Response('Book was uploaded')



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createBookReview(request,pk):
    user = request.user
    book = Book.objects.get(_id=pk)
    data = request.data

    alreadyExist = book.review_set.filter(user=user).exists()

    if alreadyExist:
        content = {'detail': 'Book already reviewed'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)


    elif data['rating'] == 0:
        content = {'detail': 'Please select a rating'}
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
        


