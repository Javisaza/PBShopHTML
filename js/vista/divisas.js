// ==========================================
// VISTA · divisas: selector, tarjetas, indicador de carga y errores
// Solo dibuja los datos que recibe del controlador.
// ==========================================

// Da formato de moneda: (2.05, 'USD') -> "US$ 2,05"
const formatearEnMoneda = (valor, codigo) => {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: codigo }).format(valor);
};

// Indicador de carga mientras llega la respuesta de la API
const mostrarCargaDivisas = () => {
  if (!divisasEstado) return;

  divisasEstado.replaceChildren();
  divisasEstado.className = 'divisas__estado divisas__estado--cargando';

  const spinner = document.createElement('span');
  spinner.className = 'divisas__spinner';
  spinner.setAttribute('aria-hidden', 'true');
  divisasEstado.append(spinner, document.createTextNode(' Consultando tasas de cambio…'));

  if (selectMoneda) selectMoneda.disabled = true;
  if (botonReintentarTasas) botonReintentarTasas.hidden = true;
};

// Mensaje amable cuando la API falla o no hay internet
const mostrarErrorDivisas = (mensaje) => {
  if (!divisasEstado) return;

  divisasEstado.textContent = `⚠️ ${mensaje}`;
  divisasEstado.className = 'divisas__estado divisas__estado--error';
  if (botonReintentarTasas) botonReintentarTasas.hidden = false;
};

// Fecha de la última actualización de las tasas
const mostrarExitoDivisas = (actualizado) => {
  if (!divisasEstado) return;

  const fecha = new Date(actualizado);
  const textoFecha = Number.isNaN(fecha.getTime())
    ? 'fecha no disponible'
    : fecha.toLocaleDateString('es-CO', { dateStyle: 'long' });

  divisasEstado.textContent = `✅ Tasas actualizadas el ${textoFecha}.`;
  divisasEstado.className = 'divisas__estado divisas__estado--ok';
};

// Llena el selector con las monedas disponibles
const renderizarSelectorMoneda = (lista) => {
  if (!selectMoneda) return;

  selectMoneda.replaceChildren(new Option('Peso colombiano (COP)', 'COP'));
  lista.forEach(moneda => selectMoneda.appendChild(new Option(`${moneda.nombre} (${moneda.codigo})`, moneda.codigo)));
  selectMoneda.disabled = false;
};

// Una tarjeta por moneda: "1 USD = $3.800 COP"
const renderizarTarjetasDivisas = (lista) => {
  if (!divisasGrid) return;

  divisasGrid.replaceChildren();

  lista.forEach(moneda => {
    const tarjeta = document.createElement('article');
    tarjeta.className = 'divisas__tarjeta';

    const codigo = document.createElement('h3');
    codigo.className = 'divisas__codigo';
    codigo.textContent = moneda.codigo;

    const nombre = document.createElement('p');
    nombre.className = 'divisas__nombre';
    nombre.textContent = moneda.nombre;

    const equivalencia = document.createElement('p');
    equivalencia.className = 'divisas__equivalencia';
    equivalencia.textContent = `1 ${moneda.codigo} = ${formatearEnMoneda(moneda.copPorUnidad, 'COP')}`;

    tarjeta.append(codigo, nombre, equivalencia);
    divisasGrid.appendChild(tarjeta);
  });
};
