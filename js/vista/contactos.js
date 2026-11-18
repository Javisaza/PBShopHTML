// ==========================================
// VISTA · contactos: lee el formulario de contacto y dibuja la tabla del admin
// Solo lee y dibuja; no guarda datos ni decide reglas.
// ==========================================

// ---------- Formulario de contacto (index.html) ----------

// Lee lo que escribió la persona en el formulario de contacto
const leerDatosContacto = () => {
  const leer = (id) => {
    const campo = document.getElementById(id);
    return campo ? campo.value.trim() : '';
  };

  return {
    nombre: leer('nombre'),
    correo: leer('correo'),
    telefono: leer('telefono'),
    direccion: leer('direccion'),
    ciudad: leer('ciudad'),
    mensaje: leer('mensaje')
  };
};

// ---------- Tabla de mensajes (admin.html) ----------

// Da formato a la fecha ISO guardada: "15/11/2026, 6:43 p. m."
const formatearFechaContacto = (fechaIso) => {
  const fecha = new Date(fechaIso);
  return Number.isNaN(fecha.getTime()) ? '—' : fecha.toLocaleString('es-CO');
};

// Dibuja un mensaje por fila
const renderizarContactos = (lista) => {
  if (!cuerpoContactos) return; // No estamos en admin.html

  cuerpoContactos.replaceChildren();

  if (lista.length === 0) {
    const fila = document.createElement('tr');
    const celda = crearCelda('Aún no se han recibido mensajes de contacto.');
    celda.colSpan = 8;
    fila.appendChild(celda);
    cuerpoContactos.appendChild(fila);
    return;
  }

  lista.forEach(contacto => {
    const fila = document.createElement('tr');

    [contacto.nombre, contacto.correo, contacto.telefono, contacto.direccion, contacto.ciudad]
      .forEach(valor => fila.appendChild(crearCelda(valor)));

    // El mensaje usa su propia clase para que el texto largo baje a la siguiente línea
    const celdaMensaje = crearCelda(contacto.mensaje || '—');
    celdaMensaje.className = 'contacto__mensaje';
    fila.appendChild(celdaMensaje);

    fila.appendChild(crearCelda(formatearFechaContacto(contacto.fecha)));

    const celdaAcciones = document.createElement('td');
    celdaAcciones.appendChild(crearBotonAccion('eliminar', contacto.id, 'Eliminar'));
    fila.appendChild(celdaAcciones);

    cuerpoContactos.appendChild(fila);
  });
};