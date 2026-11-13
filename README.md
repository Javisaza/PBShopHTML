# PB Shop · El aliado del parche pascualino

Tienda web universitaria con catálogo, carrito, panel de administración (CRUD) y consulta de tasas de cambio.
Proyecto final de **Herramientas de Programación III (ET0056) · 2026-2** · I.U. Pascual Bravo.

- **Integrantes:** _(completar con los nombres del equipo)_
- **Publicado en:** _(completar con el enlace de GitHub Pages)_
- **Repositorio:** https://github.com/Javisaza/PBShopHTML

## 1. Dominio

PB Shop es un punto de venta para la comunidad pascualina: comida, moda universitaria, papelería, tecnología y estilo de vida.
La entidad principal es el **producto** (nombre, precio, cantidad, categoría, subcategoría, imagen y descripción).

| Página | Para quién | Qué hace |
|---|---|---|
| `index.html` | Cliente | Catálogo con búsqueda y filtros, detalles, promociones, precios en otras monedas (API) y contacto |
| `carrito.html` | Cliente | Carrito persistente con control de stock |
| `admin.html` | Administrador | CRUD de productos, tabla de datos con orden, paginación y exportación a CSV |

## 2. Cómo ejecutarlo en VS Code

1. Abre la carpeta del proyecto en VS Code.
2. Instala la extensión **Live Server**.
3. Clic derecho sobre `index.html` → **Open with Live Server**.
4. Para la administración abre `admin.html` (también desde el ícono de la llave en la barra de navegación).

No hay dependencias ni paso de compilación: es HTML, CSS y JavaScript puros. La API de tasas no requiere clave.

## 3. Arquitectura por capas

```
PBShop_html_PA/
├── index.html · admin.html · carrito.html
├── README.md
├── css/
│   └── estilos.css
├── js/
│   ├── modelo/            Datos y reglas. Nunca tocan el DOM.
│   │   ├── productos.js     Catálogo inicial, validaciones, CRUD, filtros, localStorage
│   │   ├── carrito.js       Carrito y stock
│   │   ├── tema.js          Preferencia claro/oscuro
│   │   ├── tabla.js         Orden, paginación y generación de CSV
│   │   └── divisas.js       Transforma las tasas de la API y convierte precios
│   ├── servicios/
│   │   └── api.js           ÚNICO archivo que hace fetch (API de tasas de cambio)
│   ├── vista/             Todo lo que toca el DOM. No guarda datos de negocio.
│   │   ├── elementos.js     Referencias al DOM
│   │   ├── catalogo.js      Tarjetas, resumen y panel de filtros
│   │   ├── formulario.js    Formulario, imagen y modal
│   │   ├── tabla.js         Filas, encabezados, paginación y descarga
│   │   ├── divisas.js       Selector, tarjetas, indicador de carga y errores
│   │   ├── carrito.js       Tabla del carrito
│   │   └── interfaz.js      Menú, tema, avisos y contacto
│   ├── controlador/       Eventos y flujo: une modelo, servicios y vista.
│   │   ├── catalogo.js · tabla.js · divisas.js · carrito.js · interfaz.js
│   └── app.js             Punto de arranque (DOMContentLoaded)
└── img/
```

Los scripts se cargan en este orden en cada HTML: **modelo → servicios → vista → controlador → app.js**.
Son scripts clásicos (sin módulos) que comparten el ámbito global, por eso el orden importa.

Regla de las capas: el modelo no usa `document`; la vista no decide ni guarda reglas; el controlador no escribe HTML; el servicio no conoce el DOM.

## 4. Consumo de API: tasas de cambio

Sirve para mostrar el precio de cada producto en dólares, euros y otras monedas (útil para estudiantes de intercambio o compras desde el exterior).

| Campo | Valor |
|---|---|
| Proveedor | [ExchangeRate-API (endpoint abierto)](https://www.exchangerate-api.com/docs/free) |
| URL base | `https://open.er-api.com` |
| Endpoint | `/v6/latest/COP` |
| Método HTTP | `GET` |
| Parámetros | Ninguno en la query. La moneda base (`COP`) va en la ruta. No requiere clave |
| Archivo | `js/servicios/api.js` → `obtenerTasasCambio()` |

Ejemplo de respuesta (recortado; los valores cambian a diario):

```json
{
  "result": "success",
  "provider": "https://www.exchangerate-api.com",
  "time_last_update_utc": "Fri, 13 Nov 2026 00:02:31 +0000",
  "base_code": "COP",
  "rates": { "COP": 1, "USD": 0.00026, "EUR": 0.00022, "MXN": 0.0048, "BRL": 0.0014, "GBP": 0.00019 }
}
```

Flujo: `controlador/divisas.js` llama a `obtenerTasasCambio()` (async/await) → `modelo/divisas.js` filtra, transforma y ordena las monedas con `filter`, `map` y `sort` → `vista/divisas.js` dibuja el selector, las tarjetas y el precio equivalente en cada producto.

Manejo de errores: `try/catch`, revisión de `response.ok`, indicador de carga con spinner, mensaje amable y botón **Reintentar** si falla la API o no hay internet. Si falla, la tienda sigue funcionando en pesos.

Atribución: tasas de [ExchangeRate-API](https://www.exchangerate-api.com).

## 5. Tabla de datos (admin.html)

Búsqueda y filtros combinados (categoría, subcategoría, texto, estado y rango de precio) · orden por columna (clic en el encabezado, con `aria-sort`) · paginación de 5, 10 o 20 filas · exportación a CSV de **todos** los registros filtrados (separador `;` y BOM para que Excel en español lea bien las tildes).

## 6. Métodos de arreglos y dónde se usan

| Método | Uso |
|---|---|
| `filter` | Filtros del catálogo, eliminar un producto, monedas con tasa válida |
| `map` | Actualizar un producto, transformar las tasas de la API, armar filas del CSV |
| `find` | Buscar un producto por id, buscar la columna de orden, elegir la moneda |
| `reduce` | Valor total del inventario, total del carrito, siguiente id |
| `sort` | Orden de la tabla y de las monedas |

## 7. Guía de codificación del equipo

- **Nombres:** `camelCase` para variables y funciones (`filtrarYRenderizar`), nombres en español y con verbo cuando son funciones (`calcularTotalCarrito`). Constantes de configuración también en `camelCase`.
- **CSS:** clases con **BEM** (`bloque__elemento--modificador`), por ejemplo `tabla-datos__boton--editar`, `divisas__tarjeta`. Se aplica a todos los componentes nuevos; los componentes heredados se migran por etapas.
- **Sangría:** 2 espacios en JS y CSS, 4 espacios en HTML. Punto y coma al final de cada instrucción, comillas simples en JS.
- **Comentarios:** en español, una línea que explique el *porqué* sobre cada función y cada bloque. Cada archivo abre con un encabezado que dice su capa.
- **Seguridad en el DOM:** los datos escritos por el usuario se pintan con `textContent`; no se usa `innerHTML`.
- **Limpieza:** sin código muerto y sin `console.log` de prueba.
- **Git:** commits pequeños y con mensaje descriptivo; cada integrante trabaja en sus propios commits.

## 8. Fuentes de documentación consultadas

| Página | Para qué sirvió |
|---|---|
| [MDN · Usar Fetch](https://developer.mozilla.org/es/docs/Web/API/Fetch_API/Using_Fetch) | Hacer la petición a la API y entender que `fetch` solo rechaza por errores de red |
| [MDN · Response.ok](https://developer.mozilla.org/es/docs/Web/API/Response/ok) | Detectar respuestas 404/500 antes de leer el JSON |
| [MDN · async function](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/async_function) | Escribir `obtenerTasasCambio` y `cargarDivisas` con `async` y `await` |
| [MDN · Array.prototype.sort](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) | Ordenar la tabla por columna sin modificar la lista original |
| [MDN · Intl.NumberFormat](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) | Dar formato de moneda (`US$ 2,08`) |
| [MDN · Blob](https://developer.mozilla.org/es/docs/Web/API/Blob) y [URL.createObjectURL](https://developer.mozilla.org/es/docs/Web/API/URL/createObjectURL_static) | Generar y descargar el archivo CSV |
| [MDN · aria-sort](https://developer.mozilla.org/es/docs/Web/Accessibility/ARIA/Attributes/aria-sort) | Indicar a los lectores de pantalla qué columna está ordenada |
| [MDN · Web Storage API](https://developer.mozilla.org/es/docs/Web/API/Web_Storage_API) | Persistir productos, carrito y tema en `localStorage` |
| [Documentación de ExchangeRate-API](https://www.exchangerate-api.com/docs/free) | Endpoint, formato de la respuesta y condiciones de uso |

## 9. Recursos externos

- Íconos: [Font Awesome 6.4.0 (cdnjs)](https://fontawesome.com).
- Tasas de cambio: [ExchangeRate-API](https://www.exchangerate-api.com).
- Imágenes de productos y promociones: _(completar con la fuente de cada una)_.

## 10. Uso de inteligencia artificial

_(Completar: para qué se usó, qué se verificó en la documentación oficial y que el equipo puede explicar todo el código. Esta misma sección va en el manual técnico.)_

## 11. Autores

_(Integrantes del equipo)_
