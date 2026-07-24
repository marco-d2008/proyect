const mano = document.getElementById("mi-mano");

function activarSaludo() {
  mano.classList.add("animacion-saludo");

  // Quitamos la clase cuando termine (1.5s) para poder reiniciarla después
  setTimeout(() => {
    mano.classList.remove("animacion-saludo");
  }, 1500);
}

// 1. Saluda automáticamente al ingresar al sitio
activarSaludo();

// 2. Vuelve a saludar automáticamente cada 10 segundos
setInterval(activarSaludo, 10000);
// 1. Buscamos los elementos en el HTML
const btnProductos = document.getElementById("btn-productos");
const menuDropdown = document.getElementById("dropdown-menu");

// Validamos que los elementos existan en la página actual para evitar errores
if (btnProductos && menuDropdown) {
  // 2. ABRE y CIERRA el menú al hacer clic en el botón
  btnProductos.addEventListener("click", function (evento) {
    evento.preventDefault();
    menuDropdown.classList.toggle("show");
  });

  // 3. CIERRA el menú si haces clic en cualquier otro lado
  window.addEventListener("click", function (evento) {
    if (!evento.target.closest("#btn-productos")) {
      if (menuDropdown.classList.contains("show")) {
        menuDropdown.classList.remove("show");
      }
    }
  });
}
