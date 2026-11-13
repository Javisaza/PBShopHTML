// ==========================================
// CONTROLADOR · tabla de datos (admin.html): orden, paginación y exportación
// ==========================================

// Estado de la tabla
let columnaOrden = 'id';
let direccionOrden = 'asc';
let paginaActual = 1;
let tamanoPagina = 5;

// Lista filtrada y ordenada completa (todas las páginas); es la que se exporta
let listaOrdenada = [];

// Ordena, pagina y dibuja la lista filtrada que llega del catálogo
const actualizarTablaDatos = (listaFiltrada, reiniciarPagina = false) => {
  if (!cuerpoResumen) return;

  if (reiniciarPagina) paginaActual = 1;

  listaOrdenada = ordenarProductos(listaFiltrada, columnaOrden, direccionOrden);
  const pagina = paginarProductos(listaOrdenada, paginaActual, tamanoPagina);
  paginaActual = pagina.paginaActual;

  renderizarFilasTabla(pagina.filas);
  marcarOrdenTabla(columnaOrden, direccionOrden);
  actualizarEstadoTabla(pagina, tamanoPagina);
  renderizarPaginacion(pagina.paginaActual, pagina.totalPaginas);
};

// Nombre del archivo con la fecha de hoy: pbshop_productos_2026-11-13.csv
const nombreArchivoCsv = () => `pbshop_productos_${new Date().toISOString().slice(0, 10)}.csv`;

const exportarCsv = () => {
  if (listaOrdenada.length === 0) {
    mostrarAviso('⚠️ No hay registros para exportar.');
    return;
  }

  descargarArchivo(nombreArchivoCsv(), generarCsv(listaOrdenada), 'text/csv;charset=utf-8');
  mostrarAviso(`✅ Se exportaron ${listaOrdenada.length} registro(s).`);
};

const registrarEventosTabla = () => {
  // Clic en un encabezado: ordena por esa columna; otro clic invierte el sentido
  escuchar(encabezadoTabla, 'click', (e) => {
    const encabezado = e.target.closest('th[data-columna]');
    if (!encabezado) return;

    const columna = encabezado.dataset.columna;
    direccionOrden = columna === columnaOrden && direccionOrden === 'asc' ? 'desc' : 'asc';
    columnaOrden = columna;
    filtrarYRenderizar(true);
  });

  // Botones de la paginación (delegación)
  escuchar(tablaPaginacion, 'click', (e) => {
    const boton = e.target.closest('button[data-pagina]');
    if (!boton || boton.disabled) return;

    paginaActual = Number(boton.dataset.pagina);
    filtrarYRenderizar();
  });

  escuchar(selectTamanoPagina, 'change', (e) => {
    tamanoPagina = Number(e.target.value);
    filtrarYRenderizar(true);
  });

  // Acciones de cada fila: editar y eliminar (delegación)
  escuchar(cuerpoResumen, 'click', (e) => {
    const boton = e.target.closest('button[data-accion]');
    if (!boton) return;

    const id = Number(boton.dataset.id);
    if (boton.dataset.accion === 'editar') editarProducto(id);
    if (boton.dataset.accion === 'eliminar') eliminarConConfirmacion(id);
  });

  escuchar(botonExportarCsv, 'click', exportarCsv);
};
