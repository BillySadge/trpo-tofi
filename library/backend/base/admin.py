from django.contrib import admin
from .models import *
# Register your models here.

admin.site.register(Book)
admin.site.register(Review)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Signature)
admin.site.register(SignatureBook)
# admin.site.register(ShippingAddress)
