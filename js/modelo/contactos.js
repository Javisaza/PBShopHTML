// ==========================================
// MODELO · contactos: mensajes enviados desde el formulario de contacto (localStorage)
// Nunca toca el HTML.
// ==========================================

const claveContactos = 'pbshop_contactos';

// Lee los mensajes guardados; si no hay nada o está dañado devuelve una lista vacía
const leerContactos = () => {
  try {
    const lista = JSON.parse(localStorage.getItem(claveContactos));
    return Array.isArray(lista) ? lista : [];
  } catch {
    return [];
  }
};

// Devuelve false si no se pudo guardar (por ejemplo, almacenamiento lleno)
const guardarContactos = (lista) => {
  try {
    localStorage.setItem(claveContactos, JSON.stringify(lista));
    return true;
  } catch {
    return false;
  }
};

// Agrega un mensaje con su id y la fecha de envío
const agregarContacto = (datos) => {
  const lista = leerContactos();
  const nuevoId = lista.reduce((max, c) => Math.max(max, c.id), 0) + 1;
  lista.push({ id: nuevoId, ...datos, fecha: new Date().toISOString() });
  return guardarContactos(lista);
};

const eliminarContacto = (id) => {
  return guardarContactos(leerContactos().filter(c => c.id !== id));
};
