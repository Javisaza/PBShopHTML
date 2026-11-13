// ==========================================
// CONTROLADOR · interfaz general: menú, tema y contacto
// ==========================================

const registrarEventosInterfaz = () => {
  // Menú lateral: abrir, cerrar y cerrar al elegir un enlace
  escuchar(botonMenuAbrir, 'click', abrirMenu);
  escuchar(botonMenuCerrar, 'click', cerrarMenu);
  escuchar(menuLateral, 'click', (e) => {
    if (e.target.closest('a:not(.cerrar)')) cerrarMenu();
  });

  // Tema claro/oscuro
  escuchar(temaToggle, 'change', () => {
    aplicarTema(temaToggle.checked);
    guardarTema(temaToggle.checked);
  });

  // Contacto: evita la recarga, confirma con el nombre y limpia el formulario
  escuchar(formContacto, 'submit', (e) => {
    e.preventDefault();
    mostrarExitoContacto(leerNombreContacto() || 'Usuario');
  });
};
