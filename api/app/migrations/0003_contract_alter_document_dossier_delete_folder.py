# Generated by Django 5.1.6 on 2025-02-14 13:50

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0002_profile'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Contract',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('PENDING', 'En attente'), ('APPROVE', 'Validé'), ('REJECTED', 'Refusé')], default='pending', max_length=20)),
                ('start_date', models.DateField()),
                ('end_date', models.DateField()),
                ('sav_included', models.BooleanField(default=False)),
                ('assistance_included', models.BooleanField(default=False)),
                ('purchase_option', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('car', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.car')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AlterField(
            model_name='document',
            name='dossier',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='documents', to='app.contract'),
        ),
        migrations.DeleteModel(
            name='Folder',
        ),
    ]
