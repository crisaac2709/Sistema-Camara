// MANEJAR LAS CATEGORIAS Y SU FILTRADO
document.addEventListener('DOMContentLoaded', function () {
    // Manejar cambios en los select
    document.querySelectorAll('select').forEach(function (select) {
        select.addEventListener('change', function () {
            // Obtener los valores seleccionados
            var tipo = document.getElementById('camaras_tipo').value;
            var precio = document.getElementById('camaras_precio').value;
            var marca = document.getElementById('camaras_marca').value;
            var resolucion = document.getElementById('camaras_resolucion').value;

            // Filtrar los elementos de la lista basados en las selecciones
            document.querySelectorAll('.imagen-camara').forEach(function (item) {
                var camaraTipo = item.getAttribute('data-tipo');
                var camaraPrecio = item.getAttribute('data-precio');
                var camaraMarca = item.getAttribute('data-marca');
                var camaraResolucion = item.getAttribute('data-resolucion');

                // Verificar si coincide con las selecciones
                var precioMin = 0, precioMax = Infinity;

                if (precio) {
                    var rango = precio.split('-');
                    precioMin = parseFloat(rango[0]);
                    precioMax = parseFloat(rango[1]);
                }

                if ((!tipo || camaraTipo === tipo) &&
                    (camaraPrecio >= precioMin && camaraPrecio < precioMax) &&
                    (!marca || camaraMarca === marca) &&
                    (!resolucion || camaraResolucion === resolucion)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

// MANEJAR EL SELECTOR Y CONTADOR DE LAS CAMARAS
    const camarasSeleccionadas = {};
    const angulosVisiones = []; // Array para almacenar los ángulos de visión
    const camarasSeleccionadasIds = []; // Array para almacenar los IDs de las cámaras seleccionadas

    // Agregar evento a los botones de agregar y eliminar
    document.querySelectorAll('.btn-agregar').forEach(button => {
        button.addEventListener('click', () => {
            const camaraId = button.getAttribute('data-id');
            const contador = document.getElementById(`contador-${camaraId}`);

            // Incrementar el contador
            camarasSeleccionadas[camaraId] = (camarasSeleccionadas[camaraId] || 0) + 1;
            contador.innerText = camarasSeleccionadas[camaraId];

            // Obtener el ángulo de visión de la cámara seleccionada
            const camaraElemento = document.querySelector(`.imagen-camara[data-id="${camaraId}"]`);
            if (camaraElemento) {
                const anguloVision = camaraElemento.dataset.anguloVision; // Aquí se accede al ángulo de visión
                angulosVisiones.push(anguloVision); // Agregar ángulo a la lista
                console.log(`Ángulo de visión agregado para la cámara ID ${camaraId}: ${anguloVision}`);
            }

            // Agregar el ID de la cámara seleccionada a la lista de IDs
            if (!camarasSeleccionadasIds.includes(camaraId)) {
                camarasSeleccionadasIds.push(camaraId);
                console.log(`cámara ID ${camaraId}: ${camarasSeleccionadasIds}`);
            }
        });
    });

    document.querySelectorAll('.btn-eliminar').forEach(button => {
        button.addEventListener('click', () => {
            const camaraId = button.getAttribute('data-id');
            const contador = document.getElementById(`contador-${camaraId}`);
    
            // Decrementar el contador si es mayor que 0
            if (camarasSeleccionadas[camaraId]) {
                const anguloVision = document.querySelector(`.imagen-camara[data-id="${camaraId}"]`).dataset.anguloVision;
                camarasSeleccionadas[camaraId] -= 1;
    
                // Asegúrate de que el contador no baje de 0
                if (camarasSeleccionadas[camaraId] < 0) {
                    camarasSeleccionadas[camaraId] = 0; // Fija el valor a 0 si se intenta disminuir más
                }
    
                // Si se elimina una cámara, quitar el ángulo de visión de la lista
                const index = angulosVisiones.indexOf(anguloVision);
                if (index > -1) {
                    angulosVisiones.splice(index, 1);
                    console.log(`Ángulo de visión eliminado para la cámara ID ${camaraId}: ${anguloVision}`);
                }
    
                // Actualiza el texto del contador
                contador.innerText = camarasSeleccionadas[camaraId];
    
                // Eliminar el ID de la lista de IDs si la cantidad es 0
                if (camarasSeleccionadas[camaraId] === 0) {
                    const idIndex = camarasSeleccionadasIds.indexOf(camaraId);
                    if (idIndex > -1) {
                        camarasSeleccionadasIds.splice(idIndex, 1);
                    }
                }
            }
        });
    });
    


    // MANEJAR EL ENVIO DE LOS DATOS DE LAS CAMARAS SELECCIONADAS
    document.getElementById('siguiente').addEventListener('click', () => {
        // Agregar console.log para ver la colección de ángulos
        console.log('Colección de ángulos de visión:', angulosVisiones);

        const angulosString = angulosVisiones.join(',');
        const camarasIdsString = camarasSeleccionadasIds.join(',');

        // Agregar console.log para verificar la cadena que se enviará en la URL
        console.log('Cadena de ángulos para la URL:', angulosString);
        console.log('Cadena de ids para la URL: ', camarasIdsString);

        // Enviar una solicitud AJAX para almacenar los IDs de las cámaras en el backend para su uso en factura
        fetch(`/factura/guardar_ids_factura?camaras_ids=${encodeURIComponent(camarasIdsString)}`, {
            method: 'GET'
        }).then(response => {
            if (response.ok) {
                console.log("IDs de cámaras guardados para factura.");
            } else {
                console.error("Error al guardar los IDs de las cámaras.");
            }
        });

        // Redirigir a la siguiente vista
        if (angulosVisiones.length > 0) {
            window.location.href = `/planos?angulos=${encodeURIComponent(angulosString)}`;
        } else {
            alert("Por favor, selecciona al menos una cámara.");
        }
    });
});