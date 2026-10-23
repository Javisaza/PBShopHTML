// ==========================================
// CONTROLADOR: escucha eventos y coordina Modelo y Vista
// No contiene reglas de negocio ni HTML.
// ==========================================

// null = se está creando un producto; un id = se está editando ese producto
let idEditando = null;

// Estado de los filtros activos
let categoriaSeleccionada = '';
let subcategoriaSeleccionada = '';
let textoBusqueda = '';
let estadoSeleccionado = ''; // '', 'disponible', 'bajo' o 'agotado'
let precioMinimo = '';
let precioMaximo = '';

// Agrega un listener solo si el elemento existe en la página actual
const escuchar = (elemento, evento, manejador) => {
  if (elemento) elemento.addEventListener(evento, manejador);
};

// Redibuja todo lo que depende de la lista de productos
const filtrarYRenderizar = () => {
  actualizarErrorPrecio(rangoPrecioInvalido(precioMinimo, precioMaximo));

  const resultado = obtenerProductosFiltrados({
    categoria: categoriaSeleccionada,
    subcategoria: subcategoriaSeleccionada,
    texto: textoBusqueda,
    estado: estadoSeleccionado,
    min: precioMinimo,
    max: precioMaximo
  });

  renderizarProductos(resultado);
  actualizarContadorResultados(resultado.length);
  renderizarTablaResumen(productos);
  actualizarResumen(productos.length, contarAgotados(), calcularValorInventario());
};

// Redibuja la tabla del carrito
const refrescarCarrito = () => {
  renderizarCarrito(leerCarrito(), calcularTotalCarrito());
};

// ---------- CRUD ----------

const abrirNuevo = () => {
  idEditando = null;
  modoFormulario(false);
  abrirModalProducto();
};

const editarProducto = (id) => {
  const prod = buscarProductoPorId(id);
  if (!prod) return;

  idEditando = id;
  limpiarErrorFormulario();
  llenarFormulario(prod);
  abrirModalProducto();
};

const cancelarEdicion = () => {
  idEditando = null;
  cerrarModalProducto();
};

// Crea o actualiza según idEditando (mismo formulario para las dos cosas)
const guardarFormulario = () => {
  limpiarErrorFormulario();

  const datos = leerFormulario();
  const errores = validarProducto(datos, idEditando);

  if (errores.length > 0) {
    mostrarErrorFormulario(`⚠️ ${errores.map(e => e.mensaje).join(' ')}`);
    marcarCamposConError(errores.flatMap(e => e.campos));
    return;
  }

  const editando = idEditando !== null;
  const guardado = editando ? actualizarProducto(idEditando, datos) : agregarProducto(datos);

  cancelarEdicion();
  filtrarYRenderizar();

  if (guardado) {
    mostrarAviso(editando ? '✅ Producto actualizado.' : '✅ Producto agregado.');
  } else {
    mostrarAviso('⚠️ No se pudo guardar en el navegador (almacenamiento lleno). Prueba con imágenes más livianas.');
  }
};

// Registra todos los eventos de la página (se llama desde el arranque)
const registrarEventos = () => {
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

  // Panel plegable de filtros (se quita el onclick viejo del HTML, si quedó)
  if (botonFiltros) botonFiltros.removeAttribute('onclick');
  escuchar(botonFiltros, 'click', alternarFiltros);

  // Modal de agregar producto
  escuchar(botonAbrirModal, 'click', abrirNuevo);
  escuchar(botonCerrarModal, 'click', cancelarEdicion);
  escuchar(botonCancelarModal, 'click', cancelarEdicion);
  escuchar(selectCategoria, 'change', (e) => cargarSubcategorias(e.target.value));

  escuchar(inputImagen, 'change', (e) => {
    limpiarVistaPrevia();
    const archivo = e.target.files[0];
    if (!archivo) return;

    const error = validarImagen(archivo);
    if (error) {
      mostrarErrorFormulario(error);
      vaciarInputImagen();
      return;
    }
    cargarImagenSeleccionada(archivo);
  });

  // Búsqueda en tiempo real
  escuchar(formBuscador, 'submit', (e) => e.preventDefault());
  escuchar(inputBusqueda, 'input', (e) => {
    textoBusqueda = e.target.value.trim();
    filtrarYRenderizar();
  });

  // Filtros por categoría / subcategoría (delegación). Clic otra vez quita el filtro.
  escuchar(asideFiltros, 'click', (e) => {
    const titulo = e.target.closest('h4[data-categoria]');
    const boton = e.target.closest('button[data-subcategoria]');

    if (titulo) {
      const categoria = titulo.dataset.categoria;
      categoriaSeleccionada = categoriaSeleccionada === categoria ? '' : categoria;
      subcategoriaSeleccionada = '';
    } else if (boton) {
      const sub = boton.dataset.subcategoria;
      subcategoriaSeleccionada = subcategoriaSeleccionada === sub ? '' : sub;
      categoriaSeleccionada = '';
    } else {
      return;
    }

    marcarFiltroActivo(categoriaSeleccionada, subcategoriaSeleccionada);
    filtrarYRenderizar();
  });

  // Teclado en los títulos de categoría (accesibilidad)
  escuchar(asideFiltros, 'keydown', (e) => {
    const titulo = e.target.closest('h4[data-categoria]');
    if (!titulo) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      titulo.click();
    }
  });

  // Filtro por estado de inventario y rango de precio (se combinan con lo demás)
  escuchar(selectEstado, 'change', (e) => {
    estadoSeleccionado = e.target.value;
    filtrarYRenderizar();
  });

  escuchar(inputPrecioMin, 'input', (e) => {
    precioMinimo = e.target.value.trim();
    filtrarYRenderizar();
  });

  escuchar(inputPrecioMax, 'input', (e) => {
    precioMaximo = e.target.value.trim();
    filtrarYRenderizar();
  });

  // Limpiar todos los filtros del panel (la búsqueda de texto no se borra)
  escuchar(botonLimpiarFiltros, 'click', () => {
    categoriaSeleccionada = '';
    subcategoriaSeleccionada = '';
    estadoSeleccionado = '';
    precioMinimo = '';
    precioMaximo = '';
    limpiarControlesFiltro();
    marcarFiltroActivo(categoriaSeleccionada, subcategoriaSeleccionada);
    filtrarYRenderizar();
  });

  // Reto: restaurar datos de ejemplo (borra la clave y recarga la página)
  escuchar(botonRestaurar, 'click', () => {
    if (window.confirm('¿Restaurar los datos de ejemplo? Se perderán los cambios del inventario.')) {
      restaurarProductos();
      location.reload();
    }
  });

  // Tarjetas: comprar, editar, ver detalles y eliminar (delegación de eventos y data-*)
  escuchar(catalogoGrid, 'click', (e) => {
    const botonComprar = e.target.closest('.btn-comprar');
    if (botonComprar) {
      const mensaje = agregarAlCarrito({
        id: Number(botonComprar.dataset.id),
        nombre: botonComprar.dataset.nombre,
        precio: Number(botonComprar.dataset.precio),
        stock: Number(botonComprar.dataset.stock)
      });
      mostrarAviso(mensaje);
      return;
    }

    // Editar va antes que "detalles" porque comparte su estilo
    const botonEditar = e.target.closest('.btn-editar');
    if (botonEditar) {
      editarProducto(Number(botonEditar.dataset.id));
      return;
    }

    const botonDetalles = e.target.closest('.btn-detalles');
    if (botonDetalles) {
      location.href = `#${botonDetalles.dataset.detalle}`;
      return;
    }

    const botonEliminar = e.target.closest('.btn-eliminar');
    if (!botonEliminar) return;

    const idAEliminar = Number(botonEliminar.dataset.id);
    const confirmar = window.confirm('¿Estás seguro de que deseas eliminar este producto del inventario?');
    if (!confirmar) return;

    eliminarProducto(idAEliminar);
    if (idEditando === idAEliminar) cancelarEdicion();
    filtrarYRenderizar();
    mostrarAviso('✅ Producto eliminado.');
  });

  // Guardar producto (crear o editar) con validaciones y errores en la página
  escuchar(formNuevoProducto, 'submit', (e) => {
    e.preventDefault();
    guardarFormulario();
  });

  // Contacto: evita la recarga, confirma con el nombre y limpia el formulario
  escuchar(formContacto, 'submit', (e) => {
    e.preventDefault();

    const campoNombre = document.getElementById('nombre');
    const nombrePersona = campoNombre && campoNombre.value.trim() ? campoNombre.value.trim() : 'Usuario';

    if (mensajeContactoExito) {
      mensajeContactoExito.textContent = `¡Gracias ${nombrePersona}, tu mensaje ha sido enviado correctamente! Nos pondremos en contacto pronto.`;
      mensajeContactoExito.classList.add('mostrar-exito');
    }

    formContacto.reset();
  });

  // Carrito: cambiar cantidad (mínimo 1, máximo el stock disponible)
  escuchar(cuerpoCarrito, 'change', (e) => {
    if (!e.target.classList.contains('input-cantidad')) return;

    const mensaje = cambiarCantidadCarrito(Number(e.target.dataset.id), e.target.value);
    if (mensaje) mostrarAviso(mensaje);
    refrescarCarrito();
  });

  // Carrito: quitar producto
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

// ==========================================
// ARRANQUE (DOMContentLoaded)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  cargarProductos();
  aplicarTema(temaGuardadoEsClaro());
  construirFiltros();
  cargarSubcategorias('');
  registrarEventos();
  filtrarYRenderizar();
  refrescarCarrito();
});