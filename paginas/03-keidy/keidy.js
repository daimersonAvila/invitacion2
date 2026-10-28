/* ================================================================
   Lógica propia de la página "Keidy Julieth"
   - Los pétalos GRANDES explotan desde el centro y luego caen
   - El nombre aparece entre la corona y la cabeza
   ================================================================ */

function explotarPetalos() {
  const petalos = document.querySelectorAll("#contenedor-petalos .petalo");
  if (petalos.length === 0) return;

  const centroX = window.innerWidth / 2;
  const centroY = window.innerHeight / 2;

  petalos.forEach((petalo, i) => {
    // ✅ Pétalos MUCHO más grandes (entre 40 y 90px)
    const tamaño = Math.random() * 50 + 40;
    petalo.style.width = `${tamaño}px`;

    // Ángulo y distancia aleatoria para la explosión
    const angulo = Math.random() * Math.PI * 2;
    const distancia = 0.4 + Math.random() * 0.2;
    const destinoX = centroX + Math.cos(angulo) * (window.innerWidth * distancia);
    const destinoY = centroY + Math.sin(angulo) * (window.innerHeight * distancia);

    // Retraso escalonado (ráfaga)
    const retraso = i * 30;

    setTimeout(() => {
      // FASE 1: Explosión
      petalo.style.transition = "transform 1.4s cubic-bezier(0.15, 0.9, 0.3, 1.2), opacity 0.4s";
      petalo.style.opacity = "1";
      petalo.style.transform = `translate(-50%, -50%) translate(${destinoX - centroX}px, ${destinoY - centroY}px) rotate(${Math.random() * 720}deg) scale(1)`;

      // FASE 2: Caída y vuelo libre
      setTimeout(() => {
        function caerYVagar() {
          const nuevaX = Math.random() * window.innerWidth;
          const nuevaY = Math.random() * window.innerHeight;
          const duracion = Math.random() * 3000 + 4000;
          const giro = Math.random() * 720 - 360;

          petalo.style.transition = `transform ${duracion}ms ease-in-out`;
          petalo.style.transform = `translate(-50%, -50%) translate(${nuevaX - centroX}px, ${nuevaY - centroY}px) rotate(${giro}deg)`;

          setTimeout(caerYVagar, duracion);
        }
        caerYVagar();
      }, 1500);

    }, retraso);
  });
}

window.addEventListener("load", explotarPetalos);

// ✅ Navegación con efecto "fade" (el único que existe ahora)
window.InvitacionNav.init(
    "../02-mis15/mis15.html",
    "../04-invitacion/invitacion.html"
);