// ==========================================
// SERVICIO · consumo de la API REST de tasas de cambio
// Solo hace la petición y devuelve datos. No conoce el DOM ni las reglas de la tienda.
// Documentación: https://www.exchangerate-api.com/docs/free
// ==========================================

// Endpoint público sin clave: tasas de todas las monedas respecto al peso colombiano
const urlTasasCop = 'https://open.er-api.com/v6/latest/COP';

const mensajeErrorTasas = 'No pudimos consultar las tasas de cambio. Revisa tu conexión e inténtalo de nuevo.';

// Devuelve { tasas, actualizado }. Si algo falla lanza un Error con un mensaje amable.
const obtenerTasasCambio = async () => {
  try {
    const respuesta = await fetch(urlTasasCop);

    // fetch solo falla por red; un 404 o un 500 también llegan aquí y hay que revisarlos
    if (!respuesta.ok) {
      throw new Error(`La API respondió con el estado ${respuesta.status}`);
    }

    const datos = await respuesta.json();
    if (datos.result !== 'success' || !datos.rates) {
      throw new Error('La API devolvió una respuesta sin tasas');
    }

    return { tasas: datos.rates, actualizado: datos.time_last_update_utc };
  } catch (error) {
    throw new Error(mensajeErrorTasas, { cause: error });
  }
};
