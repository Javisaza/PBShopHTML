// ==========================================
// CONTROLADOR · carrito (carrito.html)
// ==========================================

// Redibuja la tabla del carrito
const refrescarCarrito = () => {
  renderizarCarrito(leerCarrito(), calcularTotalCarrito());
};

const registrarEventosCarrito = () => {
  // Cambiar cantidad (mínimo 1, máximo el stock disponible)
  escuchar(cuerpoCarrito, 'change', (e) => {
    if (!e.target.classList.contains('input-cantidad')) return;

    const mensaje = cambiarCantidadCarrito(Number(e.target.dataset.id), e.target.value);
    if (mensaje) mostrarAviso(mensaje);
    refrescarCarrito();
  });

  // Quitar producto
  escuchar(cuerpoCarrito, 'click', (e) => {
    const botonQuitar = e.target.closest('.btn-quitar-carrito');
    if (!botonQuitar) return;

    quitarDelCarrito(Number(botonQuitar.dataset.id));
    refrescarCarrito();
  });

  // No permitir pagar con el carrito vacío
  escuchar(formPedido, 'submit', (e) => {
    if (leerCarrito().length > 0) return;
    e.preventDefault();
    mostrarAviso('⚠️ Tu carrito está vacío. Agrega al menos un producto.');
  });
};
