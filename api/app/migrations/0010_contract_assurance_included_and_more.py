# Generated by Django 5.1.6 on 2025-02-18 10:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0009_merge_20250217_1624'),
    ]

    operations = [
        migrations.AddField(
            model_name='contract',
            name='assurance_included',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='contract',
            name='technical_inspection_included',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='contract',
            name='status',
            field=models.CharField(choices=[('PENDING', 'En attente'), ('APPROVE', 'Validé'), ('REJECTED', 'Refusé')], default='PENDING', max_length=20),
        ),
    ]
