// ==========================================
// VISTA · formulario de producto, imagen y modal
// ==========================================

// ---------- Formulario de producto ----------

// Llena el select de subcategorías según la categoría elegida en el modal
const cargarSubcategorias = (categoria) => {
  if (!selectSubcategoria) return;

  selectSubcategoria.replaceChildren();
  const subs = subcategorias[categoria];

  if (!subs) {
    selectSubcategoria.disabled = true;
    selectSubcategoria.appendChild(new Option('Primero seleccione una categoría', ''));
    return;
  }

  selectSubcategoria.disabled = false;
  selectSubcategoria.appendChild(new Option('Seleccione una subcategoría', ''));
  subs.forEach(sub => selectSubcategoria.appendChild(new Option(sub, sub)));
};

// Lee lo que escribió la persona en el formulario
const leerFormulario = () => ({
  nombre: inputNombre.value.trim(),
  precioTexto: inputPrecio.value,
  cantidadTexto: inputCantidad.value,
  categoria: selectCategoria.value,
  subcategoria: selectSubcategoria.value,
  imagen: imagenSeleccionada,
  descripcion: inputDescripcion.value.trim()
});

// Muestra el error del formulario dentro de la página (sin alert)
const mostrarErrorFormulario = (mensaje) => {
  let errorDiv = document.getElementById('error-form-msg');
  if (!errorDiv) {
    errorDiv = document.createElement('div');
    errorDiv.id = 'error-form-msg';
    if (formNuevoProducto) formNuevoProducto.prepend(errorDiv);
  }
  errorDiv.textContent = mensaje;
  errorDiv.classList.add('error-alerta', 'mostrar-error');
};

// Marca en rojo los campos que indicó el modelo (por nombre)
const marcarCamposConError = (nombresCampos) => {
  nombresCampos.forEach(nombre => {
    if (camposFormulario[nombre]) camposFormulario[nombre].classList.add('input-error');
  });
};

const limpiarErrorFormulario = () => {
  const errorDiv = document.getElementById('error-form-msg');
  if (errorDiv) {
    errorDiv.textContent = '';
    errorDiv.classList.remove('mostrar-error');
  }
  document.querySelectorAll('#form-nuevo-producto .input-error')
    .forEach(el => el.classList.remove('input-error'));
};

// Cambia los textos del modal según se cree o se edite (el formulario es el mismo)
const modoFormulario = (editando) => {
  const titulo = document.querySelector('#modal-producto h2');
  const subtitulo = document.querySelector('#modal-producto .modal-subtitulo');
  const guardar = document.querySelector('#form-nuevo-producto .btn-guardar');

  if (titulo) {
    const icono = document.createElement('i');
    icono.className = editando ? 'fa-solid fa-pen-to-square' : 'fa-solid fa-box-open';
    titulo.replaceChildren(icono, document.createTextNode(editando ? ' Editar Producto' : ' Agregar Nuevo Producto'));
  }

  if (subtitulo) {
    subtitulo.textContent = editando
      ? 'Modifica los datos del artículo y guarda los cambios.'
      : 'Completa los datos para registrar un nuevo artículo en la tienda.';
  }

  if (guardar) {
    const icono = document.createElement('i');
    icono.className = 'fa-solid fa-check';
    guardar.replaceChildren(icono, document.createTextNode(editando ? ' Guardar cambios' : ' Guardar Producto'));
  }
};

// Llena el formulario con los datos de un producto para editarlo
const llenarFormulario = (prod) => {
  inputNombre.value = prod.nombre;
  inputPrecio.value = prod.precio;
  inputCantidad.value = prod.cantidad;
  selectCategoria.value = prod.categoria;
  cargarSubcategorias(prod.categoria);
  selectSubcategoria.value = prod.subcategoria;
  inputDescripcion.value = prod.descripcion;

  // La imagen actual se conserva si no se elige otra
  imagenSeleccionada = prod.imagen;
  vistaPreviaImagen.src = prod.imagen;
  vistaPreviaImagen.classList.remove('oculto');

  modoFormulario(true);
};

// ---------- Imagen ----------

// Quita la imagen elegida y oculta la vista previa
const limpiarVistaPrevia = () => {
  imagenSeleccionada = '';
  if (!vistaPreviaImagen) return;
  vistaPreviaImagen.classList.add('oculto');
  vistaPreviaImagen.removeAttribute('src');
};

// Lee la imagen elegida y la muestra en una vista previa (ya validada por el modelo)
const cargarImagenSeleccionada = (archivo) => {
  limpiarErrorFormulario();

  const lector = new FileReader();
  lector.addEventListener('load', () => {
    imagenSeleccionada = lector.result;
    vistaPreviaImagen.src = imagenSeleccionada;
    vistaPreviaImagen.classList.remove('oculto');
  });
  lector.readAsDataURL(archivo);
};

const vaciarInputImagen = () => {
  if (inputImagen) inputImagen.value = '';
};

// ---------- Modal ----------

const abrirModalProducto = () => {
  if (modalProducto) modalProducto.classList.add('visible');
};

const cerrarModalProducto = () => {
  if (modalProducto) modalProducto.classList.remove('visible');

  limpiarErrorFormulario();
  limpiarVistaPrevia();
  if (formNuevoProducto) formNuevoProducto.reset();
  cargarSubcategorias(''); // reset() no dispara "change", así que se reinicia a mano
  modoFormulario(false);
};
