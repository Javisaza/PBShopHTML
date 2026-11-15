// ==========================================
// CONTROLADOR · contactos: guarda los mensajes del formulario y llena la tabla del admin
// Coordina Modelo y Vista. No contiene reglas de negocio ni HTML.
// ==========================================

// Redibuja la tabla de mensajes (solo existe en admin.html)
const refrescarContactos = () => {
  renderizarContactos(leerContactos());
};

const registrarEventosContactos = () => {
  // Formulario de contacto (index.html): guarda el mensaje y confirma.
  // El navegador solo dispara "submit" si los campos obligatorios son válidos.
  escuchar(formContacto, 'submit', (e) => {
    e.preventDefault();

    const datos = leerDatosContacto();
    const guardado = agregarContacto(datos);

    if (guardado) {
      mostrarExitoContacto(datos.nombre || 'Usuario');
    } else {
      mostrarAviso('⚠️ No se pudo guardar el mensaje (almacenamiento lleno).');
    }
  });

  // Tabla de mensajes (admin.html): eliminar con confirmación (delegación)
  escuchar(cuerpoContactos, 'click', (e) => {
    const boton = e.target.closest('button[data-accion="eliminar"]');
    if (!boton) return;

    if (!window.confirm('¿Eliminar este mensaje de contacto?')) return;

    eliminarContacto(Number(boton.dataset.id));
    refrescarContactos();
    mostrarAviso('✅ Mensaje eliminado.');
  });

  // Si llega un mensaje desde otra pestaña, la tabla se actualiza sola
  window.addEventListener('storage', (e) => {
    if (e.key === claveContactos) refrescarContactos();
  });
};