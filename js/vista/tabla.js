// ==========================================
// VISTA · tabla de datos (admin.html)
// Solo dibuja filas, encabezados y botones de paginación; no ordena ni pagina.
// ==========================================

// Cuántos botones numerados se muestran a cada lado de la página actual
const vecinosPaginacion = 2;

// Crea un botón de acción de la tabla (editar / eliminar)
const crearBotonAccion = (accion, id, texto) => {
  const boton = document.createElement('button');
  boton.type = 'button';
  boton.className = `tabla-datos__boton tabla-datos__boton--${accion}`;
  boton.textContent = texto;
  boton.dataset.accion = accion;
  boton.dataset.id = id;
  return boton;
};

// Dibuja las filas de la página actual
const renderizarFilasTabla = (filas) => {
  if (!cuerpoResumen) return;

  cuerpoResumen.replaceChildren();

  if (filas.length === 0) {
    const fila = document.createElement('tr');
    const celda = crearCelda('No hay registros que coincidan con los filtros.');
    celda.colSpan = columnasTabla.length + 1;
    celda.className = 'tabla-datos__celda tabla-datos__celda--vacia';
    fila.appendChild(celda);
    cuerpoResumen.appendChild(fila);
    return;
  }

  filas.forEach(prod => {
    const fila = document.createElement('tr');
    fila.className = 'tabla-datos__fila';

    [prod.id, prod.nombre, prod.categoria, prod.subcategoria, formatearPrecio(prod.precio), prod.cantidad]
      .forEach(valor => {
        const celda = crearCelda(valor);
        celda.className = 'tabla-datos__celda';
        fila.appendChild(celda);
      });

    const celdaEstado = crearCelda(valorColumna(prod, 'estado'));
    celdaEstado.className = `tabla-datos__celda tabla-datos__celda--${obtenerEstadoInventario(prod)}`;
    fila.appendChild(celdaEstado);

    const celdaAcciones = document.createElement('td');
    celdaAcciones.className = 'tabla-datos__celda tabla-datos__celda--acciones';
    celdaAcciones.appendChild(crearBotonAccion('editar', prod.id, 'Editar'));
    celdaAcciones.appendChild(crearBotonAccion('eliminar', prod.id, 'Eliminar'));
    fila.appendChild(celdaAcciones);

    cuerpoResumen.appendChild(fila);
  });
};

// Marca en los encabezados la columna ordenada (lo lee el lector de pantalla con aria-sort)
const marcarOrdenTabla = (columnaOrden, direccionOrden) => {
  if (!encabezadoTabla) return;

  encabezadoTabla.querySelectorAll('th[data-columna]').forEach(th => {
    const activa = th.dataset.columna === columnaOrden;
    th.setAttribute('aria-sort', activa ? (direccionOrden === 'asc' ? 'ascending' : 'descending') : 'none');
  });
};

// Texto "Mostrando 1–5 de 10 registro(s)"
const actualizarEstadoTabla = ({ paginaActual, totalRegistros, filas }, tamano) => {
  if (!tablaEstado) return;

  if (totalRegistros === 0) {
    tablaEstado.textContent = 'Sin registros para mostrar.';
    return;
  }

  const desde = (paginaActual - 1) * tamano + 1;
  const hasta = desde + filas.length - 1;
  tablaEstado.textContent = `Mostrando ${desde}–${hasta} de ${totalRegistros} registro(s).`;
};

// Crea un botón de paginación (anterior, siguiente o número de página)
const crearBotonPagina = (texto, pagina, { deshabilitado = false, actual = false, etiqueta = '' } = {}) => {
  const boton = document.createElement('button');
  boton.type = 'button';
  boton.className = 'tabla-datos__pagina';
  boton.textContent = texto;
  boton.dataset.pagina = pagina;
  boton.disabled = deshabilitado;
  if (etiqueta) boton.setAttribute('aria-label', etiqueta);
  if (actual) {
    boton.classList.add('tabla-datos__pagina--actual');
    boton.setAttribute('aria-current', 'page');
  }
  return boton;
};

// Dibuja anterior / números cercanos / siguiente
const renderizarPaginacion = (paginaActual, totalPaginas) => {
  if (!tablaPaginacion) return;

  tablaPaginacion.replaceChildren();

  tablaPaginacion.appendChild(
    crearBotonPagina('‹', paginaActual - 1, { deshabilitado: paginaActual === 1, etiqueta: 'Página anterior' })
  );

  for (let pagina = 1; pagina <= totalPaginas; pagina++) {
    const cercana = Math.abs(pagina - paginaActual) <= vecinosPaginacion;
    if (pagina === 1 || pagina === totalPaginas || cercana) {
      tablaPaginacion.appendChild(
        crearBotonPagina(pagina, pagina, { actual: pagina === paginaActual, etiqueta: `Ir a la página ${pagina}` })
      );
    } else if (Math.abs(pagina - paginaActual) === vecinosPaginacion + 1) {
      const puntos = document.createElement('span');
      puntos.className = 'tabla-datos__puntos';
      puntos.textContent = '…';
      tablaPaginacion.appendChild(puntos);
    }
  }

  tablaPaginacion.appendChild(
    crearBotonPagina('›', paginaActual + 1, { deshabilitado: paginaActual === totalPaginas, etiqueta: 'Página siguiente' })
  );
};

// Descarga un texto como archivo. El BOM (\uFEFF) hace que Excel lea bien las tildes
const descargarArchivo = (nombre, contenido, tipoMime) => {
  const blob = new Blob(['\uFEFF', contenido], { type: tipoMime });
  const url = URL.createObjectURL(blob);

  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = nombre;
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();

  URL.revokeObjectURL(url);
};
