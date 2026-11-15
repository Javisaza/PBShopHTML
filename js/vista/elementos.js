// ==========================================
// VISTA · elementos: referencias al DOM y estado propio de la interfaz
// Solo dibuja y lee el HTML.
// ==========================================

// Iconos de Font Awesome para cada categoría del panel de filtros
const iconosCategoria = {
  "Comida y Gastronomía": "fa-utensils",
  "Moda Universitaria": "fa-shirt",
  "Útiles y Papelería": "fa-book",
  "Tecnología": "fa-laptop",
  "Estilo de Vida": "fa-gift"
};

// La página de administración lleva <body data-rol="admin">
const esAdmin = document.body.dataset.rol === 'admin';

// Estado propio de la vista
let imagenSeleccionada = ''; // Imagen elegida en el explorador
let temporizadorAviso = null;

// Referencias a los elementos de la página
const catalogoGrid = document.getElementById('grid-productos');
const inputBusqueda = document.getElementById('input-busqueda');
const formBuscador = document.getElementById('form-buscador');
const contadorResultados = document.getElementById('contador-resultados');
const cuerpoResumen = document.getElementById('cuerpo-resumen');

const asideFiltros = document.getElementById('aside-filtros');
const selectEstado = document.getElementById('filtro-estado');
const inputPrecioMin = document.getElementById('filtro-precio-min');
const inputPrecioMax = document.getElementById('filtro-precio-max');
const errorPrecio = document.getElementById('error-precio');
const botonLimpiarFiltros = document.getElementById('btn-limpiar-filtros');
const resumenTotal = document.getElementById('resumen-total');
const resumenAgotados = document.getElementById('resumen-agotados');
const resumenValor = document.getElementById('resumen-valor');

const modalProducto = document.getElementById('modal-producto');
const botonAbrirModal = document.getElementById('btn-abrir-modal');
const botonCerrarModal = document.getElementById('btn-cerrar-modal');
const botonCancelarModal = document.getElementById('btn-cancelar-modal');
const botonRestaurar = document.getElementById('btn-restaurar');
const formNuevoProducto = document.getElementById('form-nuevo-producto');
const inputNombre = document.getElementById('nuevo-nombre');
const inputPrecio = document.getElementById('nuevo-precio');
const inputCantidad = document.getElementById('nueva-cantidad');
const selectCategoria = document.getElementById('nueva-categoria');
const selectSubcategoria = document.getElementById('nueva-subcategoria');
const inputImagen = document.getElementById('nueva-imagen');
const vistaPreviaImagen = document.getElementById('vista-previa-imagen');
const inputDescripcion = document.getElementById('nueva-descripcion');

const formContacto = document.getElementById('form-contacto');
const cuerpoContactos = document.getElementById('cuerpo-contactos'); // solo en admin.html
const mensajeContactoExito = document.getElementById('mensaje-contacto-exito');

// Menú lateral, tema y panel plegable de filtros
const menuLateral = document.getElementById('navigation-menu');
const botonMenuAbrir = document.getElementById('btn-menu-abrir');
const botonMenuCerrar = document.getElementById('btn-menu-cerrar');
const temaToggle = document.getElementById('theme-toggle');
const botonFiltros = document.getElementById('btn-filtros');
const filtrosMenu = document.getElementById('filtros-menu');
const flechaFiltros = document.getElementById('flecha-filtros');

// Tabla de datos (solo existe en admin.html)
const encabezadoTabla = document.getElementById('tabla-encabezado');
const tablaEstado = document.getElementById('tabla-estado');
const tablaPaginacion = document.getElementById('tabla-paginacion');
const selectTamanoPagina = document.getElementById('tabla-tamano');
const botonExportarCsv = document.getElementById('btn-exportar-csv');

// Divisas (solo existen en index.html)
const selectMoneda = document.getElementById('select-moneda');
const divisasEstado = document.getElementById('divisas-estado');
const divisasGrid = document.getElementById('divisas-grid');
const botonReintentarTasas = document.getElementById('btn-reintentar-tasas');

// Carrito (solo existen en carrito.html)
const cuerpoCarrito = document.getElementById('cuerpoCarrito');
const totalCarrito = document.getElementById('totalCarrito');
const formPedido = document.getElementById('formPedido');

// Campo del modelo -> elemento del formulario
const camposFormulario = {
  nombre: inputNombre,
  precio: inputPrecio,
  cantidad: inputCantidad,
  categoria: selectCategoria,
  subcategoria: selectSubcategoria,
  imagen: inputImagen,
  descripcion: inputDescripcion
};