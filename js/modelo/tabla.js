// ==========================================
// MODELO · tabla de datos: ordenamiento, paginación y CSV
// Funciones puras: reciben listas y devuelven listas o texto. Nunca tocan el HTML.
// ==========================================

// Columnas de la tabla. "tipo" decide cómo se comparan los valores al ordenar
const columnasTabla = [
  { clave: 'id', titulo: 'ID', tipo: 'numero' },
  { clave: 'nombre', titulo: 'Nombre', tipo: 'texto' },
  { clave: 'categoria', titulo: 'Categoría', tipo: 'texto' },
  { clave: 'subcategoria', titulo: 'Subcategoría', tipo: 'texto' },
  { clave: 'precio', titulo: 'Precio', tipo: 'numero' },
  { clave: 'cantidad', titulo: 'Cantidad', tipo: 'numero' },
  { clave: 'estado', titulo: 'Estado', tipo: 'texto' }
];

// Excel en español usa punto y coma como separador de columnas
const separadorCsv = ';';

// Nombres legibles para el estado de inventario
const etiquetasEstado = { disponible: 'Disponible', bajo: 'Stock bajo', agotado: 'Agotado' };

// Valor de un producto para una columna ("estado" se calcula, el resto se lee directo)
const valorColumna = (producto, clave) => {
  return clave === 'estado' ? etiquetasEstado[obtenerEstadoInventario(producto)] : producto[clave];
};

// Devuelve una copia ordenada (no modifica la lista original)
const ordenarProductos = (lista, clave, direccion) => {
  const columna = columnasTabla.find(c => c.clave === clave);
  if (!columna) return [...lista];

  const factor = direccion === 'desc' ? -1 : 1;
  return [...lista].sort((a, b) => {
    const valorA = valorColumna(a, clave);
    const valorB = valorColumna(b, clave);
    if (columna.tipo === 'numero') return (valorA - valorB) * factor;
    return String(valorA).localeCompare(String(valorB), 'es') * factor;
  });
};

// Corta la lista en la página pedida y corrige páginas fuera de rango
const paginarProductos = (lista, pagina, tamano) => {
  const totalPaginas = Math.max(1, Math.ceil(lista.length / tamano));
  const paginaActual = Math.min(Math.max(1, pagina), totalPaginas);
  const inicio = (paginaActual - 1) * tamano;

  return {
    filas: lista.slice(inicio, inicio + tamano),
    paginaActual,
    totalPaginas,
    totalRegistros: lista.length
  };
};

// Protege valores con separador, comillas o saltos de línea
const escaparCsv = (valor) => {
  const texto = String(valor);
  const necesitaComillas = [separadorCsv, '"', '\n', '\r'].some(caracter => texto.includes(caracter));
  return necesitaComillas ? `"${texto.replaceAll('"', '""')}"` : texto;
};

// Convierte la lista recibida (ya filtrada y ordenada) en texto CSV
const generarCsv = (lista) => {
  const encabezados = columnasTabla.map(c => escaparCsv(c.titulo));
  const filas = lista.map(producto =>
    columnasTabla.map(c => escaparCsv(valorColumna(producto, c.clave))).join(separadorCsv)
  );
  return [encabezados.join(separadorCsv), ...filas].join('\r\n');
};
