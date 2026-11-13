// ==========================================
// VISTA · interfaz general: menú, tema y avisos
// ==========================================

// ---------- Menú, tema y avisos ----------

// Menú lateral
function abrirMenu() {
  if (menuLateral) menuLateral.classList.add('abierto');
}

function cerrarMenu() {
  if (menuLateral) menuLateral.classList.remove('abierto');
}

// Aplica el tema (claro u oscuro)
const aplicarTema = (esClaro) => {
  document.body.classList.toggle('light-theme', esClaro);
  if (temaToggle) temaToggle.checked = esClaro;
};

// Aviso flotante (estilos en la clase .aviso-carrito)
const mostrarAviso = (mensaje) => {
  let aviso = document.getElementById('aviso-carrito');
  if (!aviso) {
    aviso = document.createElement('div');
    aviso.id = 'aviso-carrito';
    aviso.className = 'aviso-carrito';
    document.body.appendChild(aviso);
  }
  aviso.textContent = mensaje;
  aviso.classList.add('visible');
  clearTimeout(temporizadorAviso);
  temporizadorAviso = setTimeout(() => aviso.classList.remove('visible'), 1800);
};

// ---------- Contacto (index.html) ----------

// Nombre escrito en el formulario de contacto (cadena vacía si no hay formulario)
const leerNombreContacto = () => {
  const campoNombre = document.getElementById('nombre');
  return campoNombre ? campoNombre.value.trim() : '';
};

// Muestra el agradecimiento y limpia el formulario
const mostrarExitoContacto = (nombrePersona) => {
  if (mensajeContactoExito) {
    mensajeContactoExito.textContent = `¡Gracias ${nombrePersona}, tu mensaje ha sido enviado correctamente! Nos pondremos en contacto pronto.`;
    mensajeContactoExito.classList.add('mostrar-exito');
  }
  if (formContacto) formContacto.reset();
};
