# Factura/models.py
from django.db import models
from Camaras.models import Camara

class Factura(models.Model):
    camara = models.ForeignKey(Camara, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    precio_total = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Factura - {self.camara.nombre} - {self.cantidad}"
