// ==========================================
// APP: punto de arranque. Prepara los datos y conecta las capas.
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  cargarProductos();
  aplicarTema(temaGuardadoEsClaro());
  construirFiltros();
  cargarSubcategorias('');

  registrarEventosInterfaz();
  registrarEventosCatalogo();
  registrarEventosTabla();
  registrarEventosDivisas();
  registrarEventosCarrito();

  filtrarYRenderizar();
  refrescarCarrito();
  cargarDivisas();
});
