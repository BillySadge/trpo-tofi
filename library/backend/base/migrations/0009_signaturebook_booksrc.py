# Generated by Django 4.1.2 on 2022-12-16 16:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("base", "0008_signature_order_alter_book_uploadsrc"),
    ]

    operations = [
        migrations.AddField(
            model_name="signaturebook",
            name="bookSrc",
            field=models.FileField(blank=True, upload_to="books/%Y/%m/%d/"),
        ),
    ]