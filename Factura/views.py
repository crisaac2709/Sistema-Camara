# Factura/views.py
from django.shortcuts import render, redirect
from django.http import JsonResponse
import json
from Camaras.models import Camara
from .models import Factura

def guardar_ids_factura(request):
    if request.method == 'GET':
        camaras_ids = request.GET.get('camaras_ids', '').split(',')
        print(camaras_ids)
        request.session['camaras_ids_factura'] = camaras_ids
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'failed'}, status=400)

def generar_factura(request):
    # Obtener los IDs de las cámaras seleccionadas desde la sesión
    camaras_ids = request.session.get('camaras_ids_factura', [])
    if not camaras_ids:
        return redirect('home')  # O alguna página de error si no hay cámaras seleccionadas
    
    # Obtener las cámaras seleccionadas
    camaras = Camara.objects.filter(id__in=camaras_ids)

    facturas = []
    total = 0
    for camara in camaras:
        cantidad = camaras_ids.count(str(camara.id))  # Contar cuántas veces se ha seleccionado cada cámara
        precio_total = camara.precio * cantidad
        factura_item = Factura(
            camara=camara,
            cantidad=cantidad,
            precio_unitario=camara.precio,
            precio_total=precio_total
        )
        factura_item.save()  # Guardar en la base de datos
        facturas.append(factura_item)
        total += precio_total

    context = {
        'facturas': facturas,
        'total': total
    }

    return render(request, 'detalle_factura.html', context)
