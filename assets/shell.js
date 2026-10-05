// ================================================================
//  SHELL.JS v3.4 - Música + Navegación + Precarga
//  + Contador centrado abajo (SIN animaciones, solo ocultar/mostrar)
// ================================================================

console.log('🟢 SHELL.JS v3.4 CARGADO');

const musicBtn = document.getElementById('musicBtn');
const contentFrame = document.getElementById('contentFrame');
const youtubeAudio = document.getElementById('youtube-audio');

let musicaIniciada = false;
let musicaPausada = false;

// ================================================================
//  LISTA COMPLETA DE PÁGINAS (para la precarga)
// ================================================================
const PAGINAS = [
  'paginas/01-portada/portada.html',
  'paginas/02-mis15/mis15.html',
  'paginas/03-keidy/keidy.html',
  'paginas/04-invitacion/invitacion.html',
  'paginas/05-padre/padre.html',
  'paginas/07-detalles/detalles.html',
  'paginas/08-confirmacion/confirmacion.html',
  'paginas/09-teesperamos/teesperamos.html',
];

const paginasPrecargadas = new Set();

// ================================================================
//  COMANDO A YOUTUBE
// ================================================================
function enviarComandoYoutube(comando, args) {
  if (!youtubeAudio || !youtubeAudio.contentWindow) return;
  youtubeAudio.contentWindow.postMessage(
      JSON.stringify({ event: 'command', func: comando, args: args || [] }),
      '*'
  );
}

// ================================================================
//  INICIAR MÚSICA
// ================================================================
function iniciarMusica() {
  if (musicaIniciada) return;
  musicaIniciada = true;
  console.log('🎵 Iniciando música');
  enviarComandoYoutube('seekTo', [26, true]);
  enviarComandoYoutube('unMute');
  enviarComandoYoutube('setVolume', [40]);
  enviarComandoYoutube('playVideo');
  if (musicBtn) musicBtn.classList.add('playing');
}

// ================================================================
//  ✅ MOSTRAR / OCULTAR CONTADOR (sin efectos)
// ================================================================
function mostrarContador() {
  const contador = document.getElementById('countdown-widget');
  if (contador) {
    contador.style.display = '';
    console.log('♻️ Contador mostrado abajo');
  }
}

function ocultarContador() {
  const contador = document.getElementById('countdown-widget');
  if (contador) {
    contador.style.display = 'none';
    console.log('🚫 Contador oculto');
  }
}

// ================================================================
//  PRECARGA
// ================================================================
function precargarSiguiente(rutaActual) {
  const rutaLimpia = rutaActual
      .replace(/^.*?paginas\//, 'paginas/')
      .replace(/[?#].*$/, '');

  const indice = PAGINAS.findIndex(p => rutaLimpia.includes(p.split('/')[1]));
  if (indice === -1) return;
  if (indice === PAGINAS.length - 1) return;

  const siguiente = PAGINAS[indice + 1];
  if (paginasPrecargadas.has(siguiente)) return;
  paginasPrecargadas.add(siguiente);

  console.log('📥 Precargando:', siguiente);

  const prefetch = document.createElement('iframe');
  prefetch.src = siguiente;
  prefetch.style.cssText =
      'position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;top:-9999px;left:-9999px;';
  prefetch.setAttribute('aria-hidden', 'true');
  prefetch.setAttribute('tabindex', '-1');
  document.body.appendChild(prefetch);

  setTimeout(() => {
    if (prefetch.parentNode) prefetch.remove();
  }, 15000);
}

// ================================================================
//  CAMBIAR DE PÁGINA
// ================================================================
function cambiarPagina(ruta) {
  console.log('📄 Cambiando a:', ruta);
  if (!musicaIniciada) iniciarMusica();
  if (!contentFrame) return;

  // ✅ Al cambiar de página, SIEMPRE mostrar el contador
  // (así se restaura cuando sales de Detalles)
  mostrarContador();

  let rutaFinal = ruta;
  try {
    const urlActual = contentFrame.contentWindow.location.href;
    rutaFinal = new URL(ruta, urlActual).href;
    console.log('🔗 Ruta resuelta a:', rutaFinal);
  } catch (e) {
    console.warn('No se pudo resolver la ruta:', e);
  }

  if (contentFrame.src === rutaFinal) {
    console.log('Ya estamos en esa página');
    return;
  }

  contentFrame.style.transition = 'opacity 0.5s ease';
  contentFrame.style.opacity = '0';

  setTimeout(() => {
    contentFrame.src = rutaFinal;
    contentFrame.onload = () => {
      contentFrame.style.opacity = '1';
    };
  }, 400);
}
window.cambiarPagina = cambiarPagina;

// ================================================================
//  ESCUCHAR MENSAJES DEL IFRAME
// ================================================================
window.addEventListener('message', (event) => {
  if (!event.data) return;

  // ✅ Mensaje: iniciar música
  if (event.data.tipo === 'invitacion-musica') {
    console.log('📨 Mensaje: iniciar música');
    iniciarMusica();
  }

  // ✅ Mensaje: navegar
  if (event.data.tipo === 'invitacion-nav' && event.data.url) {
    console.log('📨 Mensaje: navegar a', event.data.url);
    cambiarPagina(event.data.url);
  }

  // ✅ Mensaje: ocultar contador (sin efectos)
  if (event.data.tipo === 'ocultar-contador') {
    console.log('📨 Mensaje: ocultar contador');
    ocultarContador();
  }
});

// ================================================================
//  BOTÓN DE MÚSICA
// ================================================================
if (musicBtn) {
  musicBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!musicaIniciada) {
      iniciarMusica();
      return;
    }
    if (musicaPausada) {
      enviarComandoYoutube('unMute');
      enviarComandoYoutube('setVolume', [40]);
      enviarComandoYoutube('playVideo');
      musicBtn.classList.add('playing');
      musicaPausada = false;
    } else {
      enviarComandoYoutube('pauseVideo');
      musicBtn.classList.remove('playing');
      musicaPausada = true;
    }
  });
}

// ================================================================
//  DETECTAR CARGA DEL IFRAME
// ================================================================
contentFrame.addEventListener('load', () => {
  try {
    const rutaActual = contentFrame.contentWindow.location.pathname;
    precargarSiguiente(rutaActual);
  } catch (e) {
    console.warn('No se pudo leer la ruta del iframe:', e);
  }
});

// ================================================================
//  PRECARGA INICIAL
// ================================================================
setTimeout(() => {
  console.log('🚀 Iniciando precarga inicial...');
  [1, 2].forEach(i => {
    if (PAGINAS[i] && !paginasPrecargadas.has(PAGINAS[i])) {
      paginasPrecargadas.add(PAGINAS[i]);
      console.log('📥 Precargando (inicial):', PAGINAS[i]);

      const prefetch = document.createElement('iframe');
      prefetch.src = PAGINAS[i];
      prefetch.style.cssText =
          'position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;top:-9999px;left:-9999px;';
      prefetch.setAttribute('aria-hidden', 'true');
      prefetch.setAttribute('tabindex', '-1');
      document.body.appendChild(prefetch);

      setTimeout(() => {
        if (prefetch.parentNode) prefetch.remove();
      }, 15000);
    }
  });
}, 1500);

// ================================================================
//  ✅ CONTADOR CENTRADO ABAJO
//  Fecha del evento: 29 Noviembre 2026 · 2:00 PM (UTC-5 Colombia)
// ================================================================
const FECHA_EVENTO = new Date('2026-11-29T14:00:00-05:00').getTime();

function actualizarContador() {
  const elDias = document.getElementById('cd-dias');
  const elHoras = document.getElementById('cd-horas');
  const elMin = document.getElementById('cd-min');
  const elSeg = document.getElementById('cd-seg');

  if (!elDias || !elHoras || !elMin || !elSeg) return;

  const ahora = new Date().getTime();
  const distancia = FECHA_EVENTO - ahora;

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

console.log('✅ SHELL.JS v3.4 LISTO');