from django.shortcuts import render
from io import BytesIO
from PIL import Image
import requests
import re
import base64
import data_url
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


        # shipping = ShippingAddress.objects.create(
        #     order = order,
        #     address=data['shippingAddress']['address'],
        #     city=data['shippingAddress']['city'],
        #     postalCode=data['shippingAddress']['postalCode'],
        #     country=data['shippingAddress']['country'],
        # )


        signature = Signature.objects.create(
            order = order,
            image = data['signature']['signatureImg']
        )

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

            book.countInStock -= item.qty
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
def getSignitures(request):
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

    
    data = str(sign.image)
    response = urllib.request.urlopen(data)
    with open(f'static/images/signatures/signature{sign._id}.png', 'wb') as f:
        f.write(response.file.read())

    




    sign_pdf.load()
    sign_pdf.sign_file(f'static/images/signatures/signature{sign._id}.png',str(sbook.book.uploadSrc),"ANDREI CHAPLINSKI", 280, 0, output_file=f'static/images/books/{sbook.book}{sbook._id}_signed.pdf')
    # sign_pdf.sign_file("static\images\signatures\signature1.png",str(sbook.book.uploadSrc),"ANDREI CHAPLINSKI", 280, 0)
    order.isPaid = True
    
    order.paidAt = datetime.now()
    order.save()

    
    return Response('Order was Paid')



@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateOrderToDelivered(request, pk):
    sbook = SignatureBook.objects.get(order__id=pk)
    # sbook.
    order = Order.objects.get(_id=pk)

    order.isDelivered = True

    order.deliveredAt = datetime.now()
    order.save()

    
    return Response('Order was Delivered')
