/* ============================================================
   INTERACCIÓN GENERAL — FoodExpress
   - Menú desplegable "Productos"
   - Animación de saludo del logo
   - Carrito de compras (localStorage) y checkout
   ============================================================ */

/* ---------- Carrito de compras ---------- */
const CART_KEY = "foodexpress_carrito";
const COSTO_ENVIO = 1.5;

function obtenerCarrito() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (error) {
    return [];
  }
}

function guardarCarrito(carrito) {
  localStorage.setItem(CART_KEY, JSON.stringify(carrito));
  actualizarContador();
}

function actualizarContador() {
  const contador = document.getElementById("cart-count");
  if (!contador) return;
  const carrito = obtenerCarrito();
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  contador.textContent = totalItems;
  contador.style.display = totalItems > 0 ? "flex" : "none";
}

function agregarAlCarrito(nombre, precio, imagen) {
  const carrito = obtenerCarrito();
  const existente = carrito.find((item) => item.nombre === nombre);
  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({ nombre, precio, imagen, cantidad: 1 });
  }
  guardarCarrito(carrito);
}

function cambiarCantidad(nombre, delta) {
  let carrito = obtenerCarrito();
  const item = carrito.find((i) => i.nombre === nombre);
  if (!item) return;

  item.cantidad += delta;
  if (item.cantidad <= 0) {
    carrito = carrito.filter((i) => i.nombre !== nombre);
  }

  guardarCarrito(carrito);
  renderizarCarrito();
}

function eliminarDelCarrito(nombre) {
  const carrito = obtenerCarrito().filter((i) => i.nombre !== nombre);
  guardarCarrito(carrito);
  renderizarCarrito();
}

function vaciarCarrito() {
  guardarCarrito([]);
  renderizarCarrito();
}

function escaparComillas(texto) {
  return texto.replace(/'/g, "\\'");
}

function renderizarCarrito() {
  const contenedorLista = document.getElementById("carrito-lista");
  if (!contenedorLista) return; // esta página no es carrito.html

  const vacioEl = document.getElementById("carrito-vacio");
  const layoutEl = document.getElementById("carrito-layout");
  const carrito = obtenerCarrito();

  if (carrito.length === 0) {
    layoutEl.style.display = "none";
    vacioEl.style.display = "block";
    return;
  }

  layoutEl.style.display = "grid";
  vacioEl.style.display = "none";

  contenedorLista.innerHTML = carrito
    .map((item) => {
      const nombreSeguro = escaparComillas(item.nombre);
      return `
      <div class="carrito-item">
        <img src="${item.imagen}" alt="${item.nombre}" />
        <div class="carrito-item-info">
          <h4>${item.nombre}</h4>
          <p>$${item.precio.toFixed(2)}</p>
        </div>
        <div class="qty-stepper">
          <button type="button" aria-label="Quitar uno" onclick="cambiarCantidad('${nombreSeguro}', -1)">-</button>
          <span>${item.cantidad}</span>
          <button type="button" aria-label="Agregar uno" onclick="cambiarCantidad('${nombreSeguro}', 1)">+</button>
        </div>
        <button type="button" class="btn-eliminar" aria-label="Eliminar producto" onclick="eliminarDelCarrito('${nombreSeguro}')">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>`;
    })
    .join("");

  const subtotal = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0,
  );
  const total = subtotal + COSTO_ENVIO;

  document.getElementById("resumen-subtotal").textContent =
    `$${subtotal.toFixed(2)}`;
  document.getElementById("resumen-envio").textContent =
    `$${COSTO_ENVIO.toFixed(2)}`;
  document.getElementById("resumen-total").textContent = `$${total.toFixed(2)}`;
}

/* ---------- Todo lo que necesita el DOM ya cargado ---------- */
document.addEventListener("DOMContentLoaded", () => {
  /* Menú desplegable "Productos" */
  const btn = document.getElementById("btn-productos");
  const menu = document.getElementById("dropdown-menu");

  if (btn && menu) {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      menu.classList.toggle("show");
    });

    document.addEventListener("click", (e) => {
      if (!btn.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove("show");
      }
    });
  }

  /* Animación de saludo del logo */
  const mano = document.getElementById("mi-mano");
  if (mano) {
    mano.addEventListener("mouseenter", () => {
      mano.classList.add("animacion-saludo");
      setTimeout(() => mano.classList.remove("animacion-saludo"), 1500);
    });
  }

  /* Carrito: estado inicial */
  actualizarContador();
  renderizarCarrito();

  /* Conectar todos los botones "Agregar" de las tarjetas de producto */
  document.querySelectorAll(".card .btn-comprar").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".card");
      if (!card) return;

      const nombre = card.querySelector("h3")?.textContent.trim();
      const precioTexto = card
        .querySelector(".precio")
        ?.textContent.trim()
        .replace("$", "");
      const precio = parseFloat(precioTexto);
      const imagen = card.querySelector("img")?.getAttribute("src") || "";

      if (!nombre || Number.isNaN(precio)) return;

      agregarAlCarrito(nombre, precio, imagen);

      const textoOriginal = btn.textContent;
      btn.textContent = "¡Agregado!";
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = textoOriginal;
        btn.disabled = false;
      }, 900);
    });
  });

  /* Botón "Vaciar carrito" */
  const btnVaciar = document.getElementById("btn-vaciar-carrito");
  if (btnVaciar) {
    btnVaciar.addEventListener("click", vaciarCarrito);
  }

  /* Formulario de checkout (datos de entrega) */
  const formCheckout = document.getElementById("form-checkout");
  if (formCheckout) {
    formCheckout.addEventListener("submit", (e) => {
      e.preventDefault();
      const carrito = obtenerCarrito();
      if (carrito.length === 0) return;

      document.getElementById("carrito-layout").style.display = "none";
      document.getElementById("confirmacion-pedido").style.display = "block";
      vaciarCarrito();
    });
  }
});
