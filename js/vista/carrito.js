// ==========================================
// VISTA · carrito (carrito.html)
// ==========================================

// ---------- Carrito (carrito.html) ----------

// Dibuja la tabla de carrito.html
const renderizarCarrito = (carrito, total) => {
  if (!cuerpoCarrito) return; // No estamos en carrito.html

  cuerpoCarrito.replaceChildren();

  if (carrito.length === 0) {
    const fila = document.createElement('tr');
    const celda = crearCelda('Tu carrito está vacío. ¡Agrega productos desde el catálogo!');
    celda.colSpan = 5;
    fila.appendChild(celda);
    cuerpoCarrito.appendChild(fila);
    if (totalCarrito) totalCarrito.textContent = '$0';
    return;
  }

  carrito.forEach(item => {
    const fila = document.createElement('tr');
    fila.appendChild(crearCelda(item.nombre));

    const celdaCantidad = document.createElement('td');
    const campoCantidad = document.createElement('input');
    campoCantidad.type = 'number';
    campoCantidad.min = '1';
    if (Number.isFinite(item.stock)) {
      campoCantidad.max = item.stock;
      campoCantidad.title = `Máximo disponible: ${item.stock}`;
    }
    campoCantidad.value = item.cantidad;
    campoCantidad.dataset.id = item.id;
    campoCantidad.className = 'input-cantidad';
    celdaCantidad.appendChild(campoCantidad);
    fila.appendChild(celdaCantidad);

    fila.appendChild(crearCelda(formatearPrecio(item.precio)));
    fila.appendChild(crearCelda(formatearPrecio(item.precio * item.cantidad)));

    const celdaAccion = document.createElement('td');
    const botonQuitar = document.createElement('button');
    botonQuitar.className = 'btn-eliminar btn-quitar-carrito';
    botonQuitar.textContent = 'Quitar';
    botonQuitar.dataset.id = item.id;
    celdaAccion.appendChild(botonQuitar);
    fila.appendChild(celdaAccion);

    cuerpoCarrito.appendChild(fila);
  });

  if (totalCarrito) totalCarrito.textContent = formatearPrecio(total);
};
