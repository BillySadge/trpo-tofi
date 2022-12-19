from django.shortcuts import render
from io import BytesIO
from PIL import Image
from django.core.files import File
from django.http import HttpResponse
from binascii import a2b_base64
import urllib

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from base.models import Book, Order, OrderItem, ShippingAddress, Signature, SignatureBook
from base.serializer import BookSerializer, OrderSerializer

from rest_framework import status
from datetime import datetime
from base.signeture import sign_pdf


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data
    # print(data)
    # print(order)
    # print(data)
    orderItems = data['orderItems']

    if orderItems and len(orderItems) == 0:
        return Response({'detail':'No Order Items'}, status=status.HTTP_400_BAD_REQUEST)
    else:



        



        
        order = Order.objects.create(
            user=user,
            paymentMethod = data['paymentMethod'],
            taxPrice = data['taxPrice'],
            shippingPrice = data['shippingPrice'],
            totalPrice=data['totalPrice']
        )
        imgUrl = data['signature']['signatureImg']
    
        dimg = str(imgUrl)
        response = urllib.request.urlopen(dimg)
       

        signature = Signature.objects.create(
            order = order,
            name = data['signature']['n'],
            qty = data['signature']['q'],
            image = data['signature']['i']
            # image = data['signature']['signatureImg']

        )

        with open(f'static/images/signatures/signature{signature._id}.png', 'wb') as f:
            f.write(response.file.read())   
        signature.image = f'static/images/signatures/signature{signature._id}.png'
        signature.save()

        for i in orderItems:
            book = Book.objects.get(_id=i['book'])

            item = OrderItem.objects.create(
                book=book,
                order=order,
                name=book.name,
                qty=i['qty'],
                price=i['price'],
                image=book.image.url,
            )

            # book.countInStock -= item.qty
            book.save()

            
        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data)




@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk):
    user = request.user

    
    
   
    try:
        order = Order.objects.get(_id=pk)
        
        
        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)
        else:
            Response({'detail':'Not authorized to view this order'},  status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response({'detail':'Order does not exist'}, status=status.HTTP_400_BAD_REQUEST)




@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    user = request.user
    orders = user.order_set.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)



@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def getSignatures(request):
    user = request.user
    signatures = Signature.order_set.all()
    serializer = Signature(signatures, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getOrders(request):
    orders = Order.objects.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)





@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateOrderToPaid(request, pk):
    order = Order.objects.get(_id=pk)
    orderItems = OrderItem.objects.filter(order__pk=pk)
    # print(orderItems)
    sign = Signature.objects.get(order__pk=pk)
    sbook = SignatureBook.objects.create(
        signature = sign,
        book = orderItems[0].book,
    )


    # sign = Signature.objects.get(order__pk=pk)
    # print("abc")
    # print(sign.image)
    # data = str(sign.image)
    # response = urllib.request.urlopen(data)
    # with open(f'static/images/signatures/signature{sign._id}.png', 'wb') as f:
    #     f.write(response.file.read())   
    # sign.image = f'static/images/signatures/signature{sign._id}.png'
    # sign.save()


    # data = str(sign.image)
    # response = urllib.request.urlopen(data)
    # with open(f'static/images/signatures/signature{sign._id}.png', 'wb') as f:
    #     f.write(response.file.read())   
    # sign.image = f'static/images/signatures/signature{sign._id}.png'
    # sign.save()
    
   
    


    

    sign_pdf.load()
    sign_pdf.sign_file(f'static/images/signatures/signature{sign._id}.png',str(sbook.book.uploadSrc),"ANDREI CHAPLINSKI", 280, 0, output_file=f'static/images/books/{sbook.book}{sign._id}_signed.pdf')
    # sign_pdf.sign_file("static\images\signatures\signature1.png",str(sbook.book.uploadSrc),"ANDREI CHAPLINSKI", 280, 0)
    order.isPaid = True
    
    order.paidAt = datetime.now()
    order.save()

    
    return Response('Order was Paid')



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def downloadPDF(request, pk):

    order = Order.objects.get(_id=pk)
    sign = Signature.objects.get(order__pk=pk)
    
    sbook = SignatureBook.objects.get(signature__pk=sign._id)
    print(sign._id)
    path_to_file = f'static/images/books/{sbook.book}{sign._id}_signed.pdf'
    print(path_to_file)
    f = open(path_to_file, 'rb')
    pdfFile = File(f)
    response = HttpResponse(pdfFile.read())
    response['Content-Disposition'] = 'attachment'
    return response

    # sign = Signature.objects.get(order__pk=pk)
    # # sbook = SignatureBook.objects.filter(sign__pk=pk)
    # # sbook = SignatureBook.objects.get(sign_id=pk)
    # path_to_file = 'static/images/books/'
    # sbook = SignatureBook.objects.get(order__id=pk)
    # print(sbook)
    # sbook.
    # order = Order.objects.get(_id=pk)

    # order.isDelivered = True

    # order.deliveredAt = datetime.now()
    # order.save()

    
    # return Response('Order was Delivered')

# @api_view(['PUT'])
# @permission_classes([IsAdminUser])
# def updateOrderToDelivered(request, pk):
#     sbook = SignatureBook.objects.get(order__id=pk)
#     # sbook.
#     order = Order.objects.get(_id=pk)

#     order.isDelivered = True

#     order.deliveredAt = datetime.now()
#     order.save()

    
#     return Response('Order was Delivered')
