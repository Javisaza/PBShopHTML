// ==========================================
// MODELO: datos, reglas de negocio y almacenamiento
// Nunca toca el HTML.
// ==========================================

// Las claves coinciden con los "value" del select #nueva-categoria
const subcategorias = {
  "Comida y Gastronomía": [
    "Snacks y Dulces",
    "Comida Preparada",
    "Repostería y Tortas por Encargo",
    "Bebidas",
    "Opciones Especiales (Vegano, Fit, Sin Gluten)"
  ],
  "Moda Universitaria": [
    "Ropa Institucional",
    "Moda Independiente y Vintage",
    "Calzado y Accesorios"
  ],
  "Útiles y Papelería": [
    "Libros y Textos Académicos",
    "Papelería General",
    "Artículos de Escritura y Diseño"
  ],
  "Tecnología": [
    "Accesorios para Dispositivos",
    "Periféricos y Cables",
    "Recursos y Archivos Digitales"
  ],
  "Estilo de Vida": [
    "Artesanías y Manualidades",
    "Cuidado Personal y Belleza",
    "Hogar y Termos",
    "Deportes y Recreación"
  ]
};

// detalleId = id de la sección "Especificaciones" a la que enlaza "Ver detalles"
const productosIniciales = [
  { id: 1, nombre: "Porción Pizza", precio: 8000, cantidad: 20, categoria: "Comida y Gastronomía", subcategoria: "Comida Preparada", imagen: "img/productos/pizza.jpeg", descripcion: "Deliciosa pizza hawaiana.", detalleId: "Porcion-Pizza" },
  { id: 2, nombre: "Limonada de coco / cereza", precio: 4500, cantidad: 15, categoria: "Comida y Gastronomía", subcategoria: "Bebidas", imagen: "img/productos/limonadas.jpeg", descripcion: "Limonada artesanal granizada con el toque exótico del coco o la cereza.", detalleId: "Limonada-coco-cereza" },
  { id: 3, nombre: "Granizado de café", precio: 4500, cantidad: 12, categoria: "Comida y Gastronomía", subcategoria: "Bebidas", imagen: "img/productos/cafeFrio.jpeg", descripcion: "Granizado cremoso a base de café premium, la combinación perfecta de dulce y frío.", detalleId: "Granizado-cafe" },
  { id: 4, nombre: "Café de origen en bolsa", precio: 15000, cantidad: 8, categoria: "Comida y Gastronomía", subcategoria: "Bebidas", imagen: "img/productos/bolsaCafe.png", descripcion: "Bolsa de café especial de origen seleccionado, cultivado con manos campesinas.", detalleId: "Cafe-origen-bolsa" },
  { id: 5, nombre: "Capuchino", precio: 3500, cantidad: 25, categoria: "Comida y Gastronomía", subcategoria: "Bebidas", imagen: "img/productos/cafe.jpeg", descripcion: "Café expreso balanceado con leche vaporizada y una capa perfecta de espuma.", detalleId: "Capuchino" },
  { id: 6, nombre: "Brunch Campesino Completo", precio: 10000, cantidad: 10, categoria: "Comida y Gastronomía", subcategoria: "Comida Preparada", imagen: "img/productos/desayuno.jpeg", descripcion: "Brunch completo con arepa, huevo revuelto, quesito, calentado y café en leche.", detalleId: "Brunch-Campesino-Completo" },
  { id: 7, nombre: "Sándwich de la casa", precio: 6000, cantidad: 14, categoria: "Comida y Gastronomía", subcategoria: "Comida Preparada", imagen: "img/productos/sandwich.jpeg", descripcion: "Sándwich tostado de la casa con ingredientes frescos y salsa especial.", detalleId: "Sandwich-casa" },
  { id: 8, nombre: "Torta de café o chocolate", precio: 4000, cantidad: 3, categoria: "Comida y Gastronomía", subcategoria: "Repostería y Tortas por Encargo", imagen: "img/productos/torta.jpeg", descripcion: "Porción de torta artesanal esponjosa con sabor intenso a café o chocolate.", detalleId: "Torta-cafe-chocolate" },
  { id: 9, nombre: "Paleta de café", precio: 2500, cantidad: 0, categoria: "Comida y Gastronomía", subcategoria: "Snacks y Dulces", imagen: "img/productos/paletaCafe.jpeg", descripcion: "Paleta helada artesanal con el sabor auténtico del café de origen.", detalleId: "Paleta-cafe" },
  { id: 10, nombre: "Yogurt con frutas", precio: 10000, cantidad: 9, categoria: "Comida y Gastronomía", subcategoria: "Opciones Especiales (Vegano, Fit, Sin Gluten)", imagen: "img/productos/avena.jpeg", descripcion: "Frutas con granola y yogurt ideal para un desayuno delicioso y saludable.", detalleId: "Yogurt-frutas" }
];

// Clave propia del equipo para guardar el inventario en localStorage
const CLAVE = 'pbshop_inventario';

// Estado de los datos
let productos = [...productosIniciales];

// ---------- Persistencia (localStorage + JSON) ----------

// Carga el inventario guardado; si no hay nada (o está dañado), usa los datos de ejemplo
const cargarProductos = () => {
  try {
    const guardado = localStorage.getItem(CLAVE);
    const lista = guardado ? JSON.parse(guardado) : null;
    productos = Array.isArray(lista) ? lista : [...productosIniciales];
  } catch {
    productos = [...productosIniciales];
  }
};

// Guarda el inventario. Devuelve false si no se pudo (por ejemplo, almacenamiento lleno)
const guardarProductos = () => {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(productos));
    return true;
  } catch {
    return false;
  }
};

// Borra el inventario guardado (al recargar vuelven los datos de ejemplo)
const restaurarProductos = () => {
  localStorage.removeItem(CLAVE);
};

// Con este número de unidades o menos (y más de 0) el stock se considera bajo
const umbralStockBajo = 5;

// Peso máximo permitido para la imagen del producto (2 MB)
const pesoMaximoImagen = 2 * 1024 * 1024;

// Clave del carrito en localStorage (se comparte entre páginas)
const claveCarrito = 'pbshop_carrito';

// ---------- Estado del inventario ----------

// Un producto está agotado cuando su cantidad es 0
const estaAgotado = (producto) => producto.cantidad === 0;

// Clasifica el stock: 'agotado', 'bajo' o 'disponible'
const obtenerEstadoInventario = (producto) => {
  if (producto.cantidad === 0) return 'agotado';
  if (producto.cantidad <= umbralStockBajo) return 'bajo';
  return 'disponible';
};

// ---------- Consultas y datos calculados ----------

// Aplica categoría, subcategoría, búsqueda, estado y precio sobre la lista completa
// filtros = { categoria, subcategoria, texto, estado, min, max }
const obtenerProductosFiltrados = (filtros) => {
  let resultado = productos;

  if (filtros.categoria) {
    resultado = resultado.filter(p => p.categoria === filtros.categoria);
  }

  if (filtros.subcategoria) {
    resultado = resultado.filter(p => p.subcategoria === filtros.subcategoria);
  }

  if (filtros.texto) {
    const consulta = filtros.texto.toLowerCase();
    resultado = resultado.filter(p =>
      p.nombre.toLowerCase().includes(consulta) ||
      p.descripcion.toLowerCase().includes(consulta)
    );
  }

  if (filtros.estado) {
    resultado = resultado.filter(p => obtenerEstadoInventario(p) === filtros.estado);
  }

  if (filtros.min !== '') {
    resultado = resultado.filter(p => p.precio >= Number(filtros.min));
  }

  if (filtros.max !== '') {
    resultado = resultado.filter(p => p.precio <= Number(filtros.max));
  }

  return resultado;
};

// True si el precio mínimo es mayor que el máximo
const rangoPrecioInvalido = (min, max) => {
  return min !== '' && max !== '' && Number(min) > Number(max);
};

const contarAgotados = () => productos.filter(p => estaAgotado(p)).length;

const calcularValorInventario = () => productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

// ---------- Reglas de negocio ----------
  const validarProducto = (datos, idEditando = null) => {
  const errores = [];
  const error = (mensaje, ...campos) => errores.push({ mensaje, campos });

  // Regla 1: campos vacíos
  const camposVacios = [
    ['nombre', datos.nombre],
    ['precio', datos.precioTexto],
    ['cantidad', datos.cantidadTexto],
    ['categoria', datos.categoria],
    ['subcategoria', datos.subcategoria],
    ['imagen', datos.imagen],
    ['descripcion', datos.descripcion]
  ].filter(par => !par[1]).map(par => par[0]);

  if (camposVacios.length > 0) {
    error('Todos los campos son obligatorios.', ...camposVacios);
  }

  // Regla 2: precio válido y mayor a 0
  if (datos.precioTexto) {
    const precio = Number(datos.precioTexto);
    if (Number.isNaN(precio) || precio <= 0) {
      error('El precio debe ser un número válido mayor a 0.', 'precio');
    }
  }

  // Regla 3: cantidad entera y no negativa
  if (datos.cantidadTexto) {
    const cantidad = Number(datos.cantidadTexto);
    if (!Number.isInteger(cantidad) || cantidad < 0) {
      error('La cantidad debe ser un número entero de 0 o más.', 'cantidad');
    }
  }

  // Regla 4: nombre repetido (se ignora el propio producto al editar)
  if (datos.nombre) {
    const nombreRepetido = productos.some(
      p => p.nombre.toLowerCase() === datos.nombre.toLowerCase() && p.id !== idEditando
    );
    if (nombreRepetido) {
      error('Ya existe un producto registrado con este mismo nombre.', 'nombre');
    }
  }

  // Regla 5: descripción mínima de 10 caracteres
  if (datos.descripcion && datos.descripcion.length < 10) {
    error('La descripción del producto debe tener al menos 10 caracteres.', 'descripcion');
  }

  return errores;
};

// Devuelve un mensaje de error si el archivo no sirve, o null si es válido
const validarImagen = (archivo) => {
  if (!archivo.type.startsWith('image/')) {
    return '⚠️ El archivo seleccionado debe ser una imagen.';
  }

  if (archivo.size > pesoMaximoImagen) {
    return '⚠️ La imagen no puede pesar más de 2 MB.';
  }

  return null;
};

// ---------- CRUD ----------
// Cada operación que cambia datos termina guardando. Devuelven true si se pudo guardar.

const agregarProducto = (datos) => {
  // Siguiente id: el mayor existente + 1
  const nuevoId = productos.reduce((max, p) => Math.max(max, p.id), 0) + 1;
  productos.push({
    id: nuevoId,
    nombre: datos.nombre,
    precio: Number(datos.precioTexto),
    cantidad: Number(datos.cantidadTexto),
    categoria: datos.categoria,
    subcategoria: datos.subcategoria,
    imagen: datos.imagen,
    descripcion: datos.descripcion
  });
  return guardarProductos();
};

const buscarProductoPorId = (id) => productos.find(p => p.id === id);

// Reemplaza el producto editado conservando lo que el formulario no toca (como detalleId)
const actualizarProducto = (id, datos) => {
  productos = productos.map(p => p.id === id ? {
    ...p,
    nombre: datos.nombre,
    precio: Number(datos.precioTexto),
    cantidad: Number(datos.cantidadTexto),
    categoria: datos.categoria,
    subcategoria: datos.subcategoria,
    imagen: datos.imagen,
    descripcion: datos.descripcion
  } : p);
  return guardarProductos();
};

const eliminarProducto = (id) => {
  productos = productos.filter(p => p.id !== id);
  return guardarProductos();
};

// ---------- Carrito (localStorage) ----------

// Lectura y escritura del carrito en localStorage
const leerCarrito = () => {
  try {
    return JSON.parse(localStorage.getItem(claveCarrito)) || [];
  } catch {
    return [];
  }
};

const guardarCarrito = (carrito) => {
  localStorage.setItem(claveCarrito, JSON.stringify(carrito));
};

// Agrega un producto o suma una unidad sin pasar del stock disponible.
// Devuelve el mensaje que la vista debe mostrar.
const agregarAlCarrito = ({ id, nombre, precio, stock }) => {
  const carrito = leerCarrito();
  const existente = carrito.find(item => item.id === id);
  const cantidadActual = existente ? existente.cantidad : 0;
  const tieneLimite = Number.isFinite(stock);

  // Sin unidades suficientes: se actualiza el stock guardado y se avisa
  if (tieneLimite && cantidadActual >= stock) {
    if (existente) {
      existente.stock = stock;
      existente.cantidad = Math.min(existente.cantidad, stock);
      guardarCarrito(carrito);
    }
    return `⚠️ Solo hay ${stock} unidad(es) de ${nombre} en stock`;
  }

  if (existente) {
    existente.cantidad += 1;
    if (tieneLimite) existente.stock = stock;
  } else {
    const nuevoItem = { id, nombre, precio, cantidad: 1 };
    if (tieneLimite) nuevoItem.stock = stock;
    carrito.push(nuevoItem);
  }

  guardarCarrito(carrito);
  return `✅ ${nombre} agregado al carrito`;
};

// Cambia la cantidad (mínimo 1, máximo el stock disponible).
// Devuelve un mensaje si hubo que limitarla, o null.
const cambiarCantidadCarrito = (id, valor) => {
  const carrito = leerCarrito();
  const item = carrito.find(i => i.id === id);
  if (!item) return null;

  const cantidad = Math.floor(Number(valor));
  let cantidadFinal = Number.isNaN(cantidad) || cantidad < 1 ? 1 : cantidad;
  let mensaje = null;

  if (Number.isFinite(item.stock) && cantidadFinal > item.stock) {
    cantidadFinal = item.stock;
    mensaje = `⚠️ Solo hay ${item.stock} unidad(es) de ${item.nombre} en stock`;
  }

  item.cantidad = cantidadFinal;
  guardarCarrito(carrito);
  return mensaje;
};

const quitarDelCarrito = (id) => {
  guardarCarrito(leerCarrito().filter(i => i.id !== id));
};

const calcularTotalCarrito = () => {
  return leerCarrito().reduce((acc, item) => acc + item.precio * item.cantidad, 0);
};

// ---------- Tema (localStorage) ----------

const temaGuardadoEsClaro = () => localStorage.getItem('theme') === 'light';

const guardarTema = (esClaro) => {
  localStorage.setItem('theme', esClaro ? 'light' : 'dark');
};