// ==========================================
// CONTROLADOR · interfaz general: menú y tema
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
};