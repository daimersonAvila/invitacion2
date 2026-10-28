/* =========================================================
   NAV.JS
   Lógica compartida por TODAS las páginas para:
   - Mostrar los botones "Anterior" (‹) y "Siguiente" (›)
   - Animar la transición como si se pasara una hoja del libro

   Si la página se está mostrando dentro del shell principal
   (index.html, vía <iframe>), el cambio de página se le pide
   a ese shell por mensaje, para que la música (que vive en el
   shell) nunca se interrumpa. Si la página se abre suelta
   (sin el shell), navega ella misma con su propia animación.

   Cada página llama a InvitacionNav.init(prevUrl, nextUrl)
   pasando null cuando no exista esa dirección.
   ========================================================= */
(function () {
  function dentroDeIframe() {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }

  function crearBoton(direccion, url, etiqueta) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "nav-btn nav-" + direccion;
    btn.setAttribute(
      "aria-label",
      etiqueta || (direccion === "prev" ? "Página anterior" : "Página siguiente"),
    );
    btn.innerHTML = direccion === "prev" ? "&#10094;" : "&#10095;";
    btn.addEventListener("click", () => irA(url, direccion === "prev" ? "prev" : "next"));
    return btn;
  }

  function irA(url, direccion) {
    if (!url) return;
    // Deshabilita ambos botones para evitar doble clic durante la animación
    document
      .querySelectorAll(".page-nav .nav-btn")
      .forEach((b) => (b.disabled = true));

    if (dentroDeIframe()) {
      // Le avisamos al shell (index.html) que cambie de página.
      // Él se encarga de la animación de "hoja" del lado de afuera
      // y la música sigue sonando sin cortes.
      const absoluta = new URL(url, window.location.href).href;
      window.parent.postMessage(
        { tipo: "invitacion-nav", url: absoluta, direccion },
        "*",
      );
      return;
    }

    // Respaldo: la página se abrió suelta (sin el shell). Navega
    // ella misma con su propia animación de "pasar hoja".
    const stage = document.getElementById("pageFlip");
    if (stage) {
      stage.classList.add(direccion === "next" ? "flip-out-next" : "flip-out-prev");
      stage.addEventListener(
        "animationend",
        () => {
          window.location.href = url;
        },
        { once: true },
      );
      setTimeout(() => {
        window.location.href = url;
      }, 750);
    } else {
      window.location.href = url;
    }
  }

  function init(prevUrl, nextUrl, opciones) {
    opciones = opciones || {};

    function montar() {
      // Animación de entrada tipo "hoja recién pasada" (solo aplica
      // cuando la página vive suelta; dentro del shell la anima el
      // propio shell alrededor del iframe).
      if (!dentroDeIframe()) {
        const stage = document.getElementById("pageFlip");
        if (stage) {
          stage.classList.add("flip-in");
          stage.addEventListener(
            "animationend",
            () => stage.classList.remove("flip-in"),
            { once: true },
          );
        }
      }

      const nav = document.createElement("div");
      nav.className = "page-nav";

      if (prevUrl) {
        nav.appendChild(crearBoton("prev", prevUrl, opciones.prevLabel));
      }
      if (nextUrl) {
        nav.appendChild(crearBoton("next", nextUrl, opciones.nextLabel));
      }

      document.body.appendChild(nav);
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", montar);
    } else {
      montar();
    }
  }

  window.InvitacionNav = { init, irA };
})();
