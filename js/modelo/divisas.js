// ==========================================
// MODELO · divisas: transforma las tasas de la API y convierte precios
// Nunca toca el HTML ni hace peticiones (eso lo hace servicios/api.js).
// ==========================================

// Monedas que se ofrecen en la tienda (la API devuelve más de 160)
const monedasSoportadas = [
  { codigo: 'USD', nombre: 'Dólar estadounidense' },
  { codigo: 'EUR', nombre: 'Euro' },
  { codigo: 'MXN', nombre: 'Peso mexicano' },
  { codigo: 'BRL', nombre: 'Real brasileño' },
  { codigo: 'GBP', nombre: 'Libra esterlina' }
];

// Monedas con tasa válida y la moneda elegida (null = precios solo en COP)
let monedas = [];
let monedaSeleccionada = null;

// Cruza las tasas de la API con las monedas soportadas.
// tasa = cuántas unidades de la moneda equivalen a 1 COP; copPorUnidad = lo contrario.
const prepararMonedas = (tasas) => {
  monedas = monedasSoportadas
    .filter(moneda => Number.isFinite(tasas[moneda.codigo]) && tasas[moneda.codigo] > 0)
    .map(moneda => ({
      ...moneda,
      tasa: tasas[moneda.codigo],
      copPorUnidad: 1 / tasas[moneda.codigo]
    }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));

  return monedas;
};

// Elige la moneda por su código; con "COP" o un código desconocido vuelve a solo pesos
const seleccionarMoneda = (codigo) => {
  monedaSeleccionada = monedas.find(moneda => moneda.codigo === codigo) || null;
  return monedaSeleccionada;
};

// Convierte un valor en pesos a la moneda indicada
const convertirDesdeCop = (valorCop, moneda) => valorCop * moneda.tasa;
