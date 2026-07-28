document.addEventListener("DOMContentLoaded", () => {
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

  const mano = document.getElementById("mi-mano");
  if (mano) {
    mano.addEventListener("mouseenter", () => {
      mano.classList.add("animacion-saludo");
      setTimeout(() => mano.classList.remove("animacion-saludo"), 1500);
    });
  }
});
