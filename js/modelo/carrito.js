// ==========================================
// MODELO · carrito: datos y reglas del carrito (localStorage)
// ==========================================

// Clave del carrito en localStorage (se comparte entre páginas)
const claveCarrito = 'pbshop_carrito';

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
