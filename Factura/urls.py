# Factura/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('guardar_ids_factura', views.guardar_ids_factura, name='guardar_ids_factura'),
    path('generar_factura', views.generar_factura, name='generar_factura'),
]
