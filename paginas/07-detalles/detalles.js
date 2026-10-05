/* ============================================================
   DETALLES.JS - Sección "Detalles del Evento"
   - Mariposas grandes volando
   - Contador central normal (sin overlay)
   - Oculta el contador de abajo del shell
   ============================================================ */

// ================================================================
//  CONFIGURACIÓN DE LA FECHA DEL EVENTO
// ================================================================
const FECHA_EVENTO = new Date('2026-11-29T14:00:00-05:00').getTime();

// ================================================================
//  MARIPOSAS VOLANDO
// ================================================================
function hacerMariposasLocas() {
  const mariposas = document.querySelectorAll(".bfly");

  mariposas.forEach((mariposa) => {
    const tamaño = 60 + Math.random() * 30;
    mariposa.style.width = `${tamaño}px`;

    const duracion = Math.random() * 6 + 6;
    const retraso = Math.random() * 3;
    mariposa.style.animationDuration = `${duracion}s`;
    mariposa.style.animationDelay = `-${retraso}s`;
  });
}
window.addEventListener("load", hacerMariposasLocas);

// ================================================================
//  CONTADOR CENTRAL
// ================================================================
function actualizarContador() {
  const ahora = new Date().getTime();
  const distancia = FECHA_EVENTO - ahora;

  const elDias = document.getElementById('cd-dias');
  const elHoras = document.getElementById('cd-horas');
  const elMin = document.getElementById('cd-min');
  const elSeg = document.getElementById('cd-seg');

  if (!elDias || !elHoras || !elMin || !elSeg) return;

  if (distancia < 0) {
    elDias.textContent = '00';
    elHoras.textContent = '00';
    elMin.textContent = '00';
    elSeg.textContent = '00';
    return;
  }

  const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
  const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
  const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

  elDias.textContent = String(dias).padStart(2, '0');
  elHoras.textContent = String(horas).padStart(2, '0');
  elMin.textContent = String(minutos).padStart(2, '0');
  elSeg.textContent = String(segundos).padStart(2, '0');
}

actualizarContador();
setInterval(actualizarContador, 1000);

// ================================================================
//  ✅ OCULTAR EL CONTADOR DE ABAJO (del shell)
//  Sin efectos, solo lo oculta al entrar a esta página
// ================================================================
window.addEventListener('load', () => {
  console.log('🚫 Ocultando contador del shell');
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ tipo: 'ocultar-contador' }, '*');
  }
});

// ================================================================
//  INICIALIZAR NAVEGACIÓN
// ================================================================
window.InvitacionNav.init(
    "../05-padre/padre.html",
    "../08-confirmacion/confirmacion.html"
);