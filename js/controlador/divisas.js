// ==========================================
// CONTROLADOR · divisas: consume el servicio de la API y actualiza la vista
// ==========================================

// Datos para mostrar el precio equivalente en las tarjetas, o null si se eligió COP
const obtenerConversionActual = () => {
  if (!monedaSeleccionada) return null;

  const moneda = monedaSeleccionada;
  return { codigo: moneda.codigo, convertir: (valorCop) => convertirDesdeCop(valorCop, moneda) };
};

// Pide las tasas a la API y las muestra. Si falla, la tienda sigue funcionando en pesos.
const cargarDivisas = async () => {
  if (!selectMoneda) return;

  mostrarCargaDivisas();

  try {
    const { tasas, actualizado } = await obtenerTasasCambio();
    const lista = prepararMonedas(tasas);

    renderizarSelectorMoneda(lista);
    renderizarTarjetasDivisas(lista);
    mostrarExitoDivisas(actualizado);
  } catch (error) {
    mostrarErrorDivisas(error.message);
  }
};

const registrarEventosDivisas = () => {
  escuchar(selectMoneda, 'change', (e) => {
    seleccionarMoneda(e.target.value);
    filtrarYRenderizar();
  });

  escuchar(botonReintentarTasas, 'click', cargarDivisas);
};
