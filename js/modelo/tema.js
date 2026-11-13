// ==========================================
// MODELO · tema: preferencia de tema claro/oscuro (localStorage)
// ==========================================

// ---------- Tema (localStorage) ----------

const temaGuardadoEsClaro = () => localStorage.getItem('theme') === 'light';

const guardarTema = (esClaro) => {
  localStorage.setItem('theme', esClaro ? 'light' : 'dark');
};
