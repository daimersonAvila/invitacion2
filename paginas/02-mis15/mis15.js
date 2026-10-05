/* ================================================================
   Lógica propia de "Mis 15 Años"
   - Mariposas locas (con aparición suave)
   - Transición de salida (zoom + brillo)
   ================================================================ */

// ================================================================
//  MARIPOSAS LOCAS
// ================================================================
function hacerMariposasLocas() {
    const mariposas = document.querySelectorAll(".bfly");

    mariposas.forEach((mariposa, i) => {
        // Tamaño aleatorio
        const tamaño = Math.random() * 40 + 20;
        mariposa.style.width = `${tamaño}px`;

        // Posición inicial aleatoria
        mariposa.style.left = `${Math.random() * 100}vw`;
        mariposa.style.top = `${Math.random() * 100}vh`;

        // Duración y retraso aleatorio
        const duracion = Math.random() * 10 + 5;
        const retraso = Math.random() * 5;
        mariposa.style.setProperty("--duracion", `${duracion}s`);

        // Animación de vuelo aleatoria
        const animaciones = ["vuelo-1", "vuelo-2", "vuelo-3", "vuelo-4"];
        const animacionElegida =
            animaciones[Math.floor(Math.random() * animaciones.length)];
        mariposa.style.setProperty("--vuelo", animacionElegida);

        // ✅ Aparición escalonada (una tras otra)
        setTimeout(() => {
            mariposa.classList.add("aparecer");
        }, 100 * i); // Cada 100ms aparece una nueva
    });
}
window.addEventListener("load", hacerMariposasLocas);

// ================================================================
//  TRANSICIÓN DE SALIDA (zoom + brillo)
//  Se activa al tocar los botones ‹ ›
// ================================================================
function activarSalida() {
    const pageFlip = document.getElementById("pageFlip");
    if (!pageFlip) return;

    document.addEventListener(
        "click",
        (e) => {
            const btn = e.target.closest(".nav-btn");
            if (!btn || btn.disabled) return;

            // Aplicar efecto de salida
            pageFlip.classList.add("salir-zoom");
        },
        true
    );
}
window.addEventListener("load", activarSalida);

// ================================================================
//  INICIALIZAR NAVEGACIÓN
// ================================================================
window.InvitacionNav.init(
    "../01-portada/portada.html",
    "../03-keidy/keidy.html"
);