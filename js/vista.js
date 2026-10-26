// ==========================================
// VISTA: solo dibuja y lee el HTML

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
const botonRestaurar = document.getElementById('btn-restaurar'); // opcional (reto)
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
const mensajeContactoExito = document.getElementById('mensaje-contacto-exito');

// Menú lateral, tema y panel plegable de filtros
const menuLateral = document.getElementById('navigation-menu');
const botonMenuAbrir = document.getElementById('btn-menu-abrir');
const botonMenuCerrar = document.getElementById('btn-menu-cerrar');
const temaToggle = document.getElementById('theme-toggle');
const botonFiltros = document.getElementById('btn-filtros') || document.querySelector('.btn-filtros-toggle');
const filtrosMenu = document.getElementById('filtros-menu');
const flechaFiltros = document.getElementById('flecha-filtros');

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

// ---------- Formato ----------

// Da formato de pesos colombianos: 8000 -> $8.000
const formatearPrecio = (valor) => `$${Number(valor).toLocaleString('es-CO')}`;

// Crea una celda de tabla con texto seguro
const crearCelda = (texto) => {
  const celda = document.createElement('td');
  celda.textContent = texto;
  return celda;
};

// ---------- Catálogo ----------

// Dibuja las tarjetas de la lista recibida
const renderizarProductos = (lista) => {
  if (!catalogoGrid) return;

  catalogoGrid.replaceChildren();

  if (lista.length === 0) {
    const mensajeVacio = document.createElement('p');
    mensajeVacio.className = 'empty-message';
    mensajeVacio.textContent = 'No se encontraron productos disponibles con los filtros seleccionados.';
    catalogoGrid.appendChild(mensajeVacio);
    return;
  }

  lista.forEach(prod => {
    const agotado = estaAgotado(prod);

    const tarjeta = document.createElement('article');
    tarjeta.className = agotado ? 'producto agotado' : 'producto';

    const imagen = document.createElement('img');
    imagen.src = prod.imagen;
    imagen.alt = prod.nombre;
    tarjeta.appendChild(imagen);

    const titulo = document.createElement('h3');
    titulo.textContent = prod.nombre;
    tarjeta.appendChild(titulo);

    const descripcion = document.createElement('p');
    descripcion.textContent = prod.descripcion;
    tarjeta.appendChild(descripcion);

    const precio = document.createElement('span');
    precio.className = 'precio';
    precio.textContent = formatearPrecio(prod.precio);
    tarjeta.appendChild(precio);

    const botonesDiv = document.createElement('div');
    botonesDiv.className = 'producto-botones';

    // Cliente: comprar y ver detalles
    if (!esAdmin) {
      // Botón comprar (conserva los data-* que usa el carrito)
      const botonComprar = document.createElement('button');
      botonComprar.className = 'btn-comprar';
      botonComprar.textContent = 'Comprar';
      botonComprar.disabled = agotado;
      botonComprar.dataset.id = prod.id;
      botonComprar.dataset.nombre = prod.nombre;
      botonComprar.dataset.precio = prod.precio;
      botonComprar.dataset.stock = prod.cantidad;
      botonesDiv.appendChild(botonComprar);

      // Botón ver detalles (solo si existe su sección de especificaciones)
      if (prod.detalleId) {
        const botonDetalles = document.createElement('button');
        botonDetalles.className = 'btn-detalles';
        botonDetalles.textContent = 'Ver detalles';
        botonDetalles.dataset.detalle = prod.detalleId;
        botonesDiv.appendChild(botonDetalles);
      }
    }

    // Administrador: editar y eliminar
    if (esAdmin) {
      // Botón editar con data-id (reutiliza el estilo de "Ver detalles")
      const botonEditar = document.createElement('button');
      botonEditar.className = 'btn-detalles btn-editar';
      botonEditar.textContent = 'Editar';
      botonEditar.dataset.id = prod.id;
      botonesDiv.appendChild(botonEditar);

      // Botón eliminar con data-id
      const botonEliminar = document.createElement('button');
      botonEliminar.className = 'btn-eliminar';
      botonEliminar.textContent = 'Eliminar';
      botonEliminar.dataset.id = prod.id;
      botonesDiv.appendChild(botonEliminar);
    }

    tarjeta.appendChild(botonesDiv);
    catalogoGrid.appendChild(tarjeta);
  });
};

// Tabla con el resumen de todos los registros
const renderizarTablaResumen = (lista) => {
  if (!cuerpoResumen) return;

  cuerpoResumen.replaceChildren();

  lista.forEach(prod => {
    const fila = document.createElement('tr');
    fila.appendChild(crearCelda(prod.nombre));
    fila.appendChild(crearCelda(prod.categoria));
    fila.appendChild(crearCelda(formatearPrecio(prod.precio)));
    fila.appendChild(crearCelda(prod.cantidad));
    cuerpoResumen.appendChild(fila);
  });
};

// Datos calculados en la barra lateral
const actualizarResumen = (totalRegistros, agotados, valorTotal) => {
  if (!resumenTotal) return;

  resumenTotal.textContent = totalRegistros;
  resumenAgotados.textContent = agotados;
  if (resumenValor) resumenValor.textContent = formatearPrecio(valorTotal);
};

// Contador de resultados bajo el buscador
const actualizarContadorResultados = (cantidad) => {
  if (!contadorResultados) return;
  contadorResultados.textContent = `Mostrando ${cantidad} producto(s) encontrado(s).`;
};

// Avisa en la página si el precio mínimo es mayor que el máximo
const actualizarErrorPrecio = (rangoInvalido) => {
  if (!errorPrecio) return;

  errorPrecio.textContent = rangoInvalido ? '⚠️ El precio mínimo no puede ser mayor que el máximo.' : '';
  errorPrecio.classList.toggle('mostrar-error', rangoInvalido);
  if (inputPrecioMin) inputPrecioMin.classList.toggle('input-error', rangoInvalido);
  if (inputPrecioMax) inputPrecioMax.classList.toggle('input-error', rangoInvalido);
};

// ---------- Panel de filtros ----------

// Crea desde los datos los títulos de categoría y los botones de subcategoría
const construirFiltros = () => {
  if (!asideFiltros) return;

  asideFiltros.replaceChildren();

  Object.keys(subcategorias).forEach(categoria => {
    const bloque = document.createElement('div');
    bloque.className = 'filtro-categoria';

    const titulo = document.createElement('h4');
    titulo.dataset.categoria = categoria;
    titulo.setAttribute('role', 'button');
    titulo.setAttribute('tabindex', '0');

    const icono = document.createElement('i');
    icono.className = `fa-solid ${iconosCategoria[categoria] || 'fa-tag'}`;
    titulo.appendChild(icono);
    titulo.appendChild(document.createTextNode(` ${categoria}`));
    bloque.appendChild(titulo);

    const lista = document.createElement('ul');
    subcategorias[categoria].forEach(sub => {
      const item = document.createElement('li');
      const boton = document.createElement('button');
      boton.type = 'button';
      boton.textContent = sub;
      boton.dataset.subcategoria = sub;
      item.appendChild(boton);
      lista.appendChild(item);
    });
    bloque.appendChild(lista);

    asideFiltros.appendChild(bloque);
  });
};

// Marca en el panel el filtro que está activo (clase "activo")
const marcarFiltroActivo = (categoriaSeleccionada, subcategoriaSeleccionada) => {
  if (!asideFiltros) return;

  asideFiltros.querySelectorAll('.activo').forEach(el => el.classList.remove('activo'));

  if (categoriaSeleccionada) {
    asideFiltros.querySelectorAll('h4[data-categoria]').forEach(titulo => {
      if (titulo.dataset.categoria === categoriaSeleccionada) titulo.classList.add('activo');
    });
  }

  if (subcategoriaSeleccionada) {
    asideFiltros.querySelectorAll('button[data-subcategoria]').forEach(boton => {
      if (boton.dataset.subcategoria === subcategoriaSeleccionada) boton.classList.add('activo');
    });
  }
};

// Deja vacíos el select de estado y los campos de precio
const limpiarControlesFiltro = () => {
  if (selectEstado) selectEstado.value = '';
  if (inputPrecioMin) inputPrecioMin.value = '';
  if (inputPrecioMax) inputPrecioMax.value = '';
};

// Muestra u oculta el panel de filtros
const alternarFiltros = () => {
  if (filtrosMenu) filtrosMenu.classList.toggle('abierto');
  if (flechaFiltros) flechaFiltros.classList.toggle('rotar');
};

// ---------- Formulario de producto ----------

// Llena el select de subcategorías según la categoría elegida en el modal
const cargarSubcategorias = (categoria) => {
  if (!selectSubcategoria) return;

  selectSubcategoria.replaceChildren();
  const subs = subcategorias[categoria];

  if (!subs) {
    selectSubcategoria.disabled = true;
    selectSubcategoria.appendChild(new Option('Primero seleccione una categoría', ''));
    return;
  }

  selectSubcategoria.disabled = false;
  selectSubcategoria.appendChild(new Option('Seleccione una subcategoría', ''));
  subs.forEach(sub => selectSubcategoria.appendChild(new Option(sub, sub)));
};

// Lee lo que escribió la persona en el formulario
const leerFormulario = () => ({
  nombre: inputNombre.value.trim(),
  precioTexto: inputPrecio.value,
  cantidadTexto: inputCantidad.value,
  categoria: selectCategoria.value,
  subcategoria: selectSubcategoria.value,
  imagen: imagenSeleccionada,
  descripcion: inputDescripcion.value.trim()
});

// Muestra el error del formulario dentro de la página (sin alert)
const mostrarErrorFormulario = (mensaje) => {
  let errorDiv = document.getElementById('error-form-msg');
  if (!errorDiv) {
    errorDiv = document.createElement('div');
    errorDiv.id = 'error-form-msg';
    if (formNuevoProducto) formNuevoProducto.prepend(errorDiv);
  }
  errorDiv.textContent = mensaje;
  errorDiv.classList.add('error-alerta', 'mostrar-error');
};

// Marca en rojo los campos que indicó el modelo (por nombre)
const marcarCamposConError = (nombresCampos) => {
  nombresCampos.forEach(nombre => {
    if (camposFormulario[nombre]) camposFormulario[nombre].classList.add('input-error');
  });
};

const limpiarErrorFormulario = () => {
  const errorDiv = document.getElementById('error-form-msg');
  if (errorDiv) {
    errorDiv.textContent = '';
    errorDiv.classList.remove('mostrar-error');
  }
  document.querySelectorAll('#form-nuevo-producto .input-error')
    .forEach(el => el.classList.remove('input-error'));
};

// Cambia los textos del modal según se cree o se edite (el formulario es el mismo)
const modoFormulario = (editando) => {
  const titulo = document.querySelector('#modal-producto h2');
  const subtitulo = document.querySelector('#modal-producto .modal-subtitulo');
  const guardar = document.querySelector('#form-nuevo-producto .btn-guardar');

  if (titulo) {
    const icono = document.createElement('i');
    icono.className = editando ? 'fa-solid fa-pen-to-square' : 'fa-solid fa-box-open';
    titulo.replaceChildren(icono, document.createTextNode(editando ? ' Editar Producto' : ' Agregar Nuevo Producto'));
  }

  if (subtitulo) {
    subtitulo.textContent = editando
      ? 'Modifica los datos del artículo y guarda los cambios.'
      : 'Completa los datos para registrar un nuevo artículo en la tienda.';
  }

  if (guardar) {
    const icono = document.createElement('i');
    icono.className = 'fa-solid fa-check';
    guardar.replaceChildren(icono, document.createTextNode(editando ? ' Guardar cambios' : ' Guardar Producto'));
  }
};

// Llena el formulario con los datos de un producto para editarlo
const llenarFormulario = (prod) => {
  inputNombre.value = prod.nombre;
  inputPrecio.value = prod.precio;
  inputCantidad.value = prod.cantidad;
  selectCategoria.value = prod.categoria;
  cargarSubcategorias(prod.categoria);
  selectSubcategoria.value = prod.subcategoria;
  inputDescripcion.value = prod.descripcion;

  // La imagen actual se conserva si no se elige otra
  imagenSeleccionada = prod.imagen;
  vistaPreviaImagen.src = prod.imagen;
  vistaPreviaImagen.classList.remove('oculto');

  modoFormulario(true);
};

// ---------- Imagen ----------

// Quita la imagen elegida y oculta la vista previa
const limpiarVistaPrevia = () => {
  imagenSeleccionada = '';
  if (!vistaPreviaImagen) return;
  vistaPreviaImagen.classList.add('oculto');
  vistaPreviaImagen.removeAttribute('src');
};

// Lee la imagen elegida y la muestra en una vista previa (ya validada por el modelo)
const cargarImagenSeleccionada = (archivo) => {
  limpiarErrorFormulario();

  const lector = new FileReader();
  lector.addEventListener('load', () => {
    imagenSeleccionada = lector.result;
    vistaPreviaImagen.src = imagenSeleccionada;
    vistaPreviaImagen.classList.remove('oculto');
  });
  lector.readAsDataURL(archivo);
};

const vaciarInputImagen = () => {
  if (inputImagen) inputImagen.value = '';
};

// ---------- Modal ----------

const abrirModalProducto = () => {
  if (modalProducto) modalProducto.classList.add('visible');
};

const cerrarModalProducto = () => {
  if (modalProducto) modalProducto.classList.remove('visible');

  limpiarErrorFormulario();
  limpiarVistaPrevia();
  if (formNuevoProducto) formNuevoProducto.reset();
  cargarSubcategorias(''); // reset() no dispara "change", así que se reinicia a mano
  modoFormulario(false);
};

// ---------- Menú, tema y avisos ----------

// Menú lateral (se mantienen como function por si otras páginas usan onclick)
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

// ---------- Carrito (carrito.html) ----------

// Dibuja la tabla de carrito.html
const renderizarCarrito = (carrito, total) => {
  if (!cuerpoCarrito) return; // No estamos en carrito.html

  cuerpoCarrito.replaceChildren();

  if (carrito.length === 0) {
    const fila = document.createElement('tr');
    const celda = crearCelda('Tu carrito está vacío. ¡Agrega productos desde el catálogo!');
    celda.colSpan = 5;
    fila.appendChild(celda);
    cuerpoCarrito.appendChild(fila);
    if (totalCarrito) totalCarrito.textContent = '$0';
    return;
  }

  carrito.forEach(item => {
    const fila = document.createElement('tr');
    fila.appendChild(crearCelda(item.nombre));

    const celdaCantidad = document.createElement('td');
    const campoCantidad = document.createElement('input');
    campoCantidad.type = 'number';
    campoCantidad.min = '1';
    if (Number.isFinite(item.stock)) {
      campoCantidad.max = item.stock;
      campoCantidad.title = `Máximo disponible: ${item.stock}`;
    }
    campoCantidad.value = item.cantidad;
    campoCantidad.dataset.id = item.id;
    campoCantidad.className = 'input-cantidad';
    celdaCantidad.appendChild(campoCantidad);
    fila.appendChild(celdaCantidad);

    fila.appendChild(crearCelda(formatearPrecio(item.precio)));
    fila.appendChild(crearCelda(formatearPrecio(item.precio * item.cantidad)));

    const celdaAccion = document.createElement('td');
    const botonQuitar = document.createElement('button');
    botonQuitar.className = 'btn-eliminar btn-quitar-carrito';
    botonQuitar.textContent = 'Quitar';
    botonQuitar.dataset.id = item.id;
    celdaAccion.appendChild(botonQuitar);
    fila.appendChild(celdaAccion);

    cuerpoCarrito.appendChild(fila);
  });

  if (totalCarrito) totalCarrito.textContent = formatearPrecio(total);
};