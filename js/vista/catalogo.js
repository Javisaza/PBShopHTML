// ==========================================
// VISTA · catálogo: tarjetas, resumen y panel de filtros
// ==========================================

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

// Dibuja las tarjetas de la lista recibida.
// conversion = { codigo, convertir } es opcional: muestra el precio equivalente en otra moneda
const renderizarProductos = (lista, conversion = null) => {
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

    if (conversion) {
      const equivalente = document.createElement('span');
      equivalente.className = 'producto__equivalente';
      equivalente.textContent = `≈ ${formatearEnMoneda(conversion.convertir(prod.precio), conversion.codigo)}`;
      tarjeta.appendChild(equivalente);
    }

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
