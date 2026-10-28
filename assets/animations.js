/* =========================================================
   ANIMATIONS.JS
   Efecto compartido: aparición suave (fade-in + subida) de
   cada .section cuando entra en pantalla al hacer scroll.
   ========================================================= */
(function () {
  function iniciar() {
    const secciones = document.querySelectorAll(".section");
    if (!secciones.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.1 },
    );

    secciones.forEach((section) => {
      section.style.opacity = "0";
      section.style.transform = "translateY(40px)";
      section.style.transition = "opacity 1s ease, transform 1s ease";
      observer.observe(section);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
