/* ================================================================
   PORTADA.JS - Video de YouTube con transición automática
   - Usa postMessage para detectar el tiempo del video
   - Transiciona 2 segundos ANTES de que termine
   - Muestra partículas flotantes doradas
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const tapOverlay = document.getElementById('tapOverlay');
  const skipBtn = document.getElementById('skipBtn');
  const particlesContainer = document.getElementById('particles');
  const iframe = document.getElementById('introVideo');

  const SIGUIENTE_PAGINA = '../02-mis15/mis15.html';
  const SEGUNDOS_ANTES_DEL_FIN = 2; // Transicionar 2s antes del final

  let yaPaso = false;
  let videoIniciado = false;
  let duracion = 0;
  let ultimoLog = 0;

  console.log('🟢 portada.js cargado');

  // ================================================================
  //  CREAR PARTÍCULAS FLOTANTES
  // ================================================================
  if (particlesContainer) {
    const cantidad = 25;
    for (let i = 0; i < cantidad; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (6 + Math.random() * 8) + 's';
      particle.style.animationDelay = (Math.random() * 10) + 's';
      particle.style.opacity = 0.3 + Math.random() * 0.7;
      const tamaño = 2 + Math.random() * 4;
      particle.style.width = tamaño + 'px';
      particle.style.height = tamaño + 'px';
      particlesContainer.appendChild(particle);
    }
  }

  // ================================================================
  //  PASAR A LA SIGUIENTE PÁGINA
  // ================================================================
  function pasarSiguiente() {
    if (yaPaso) return;
    yaPaso = true;

    console.log('➡️ Pasando a Mis 15...');
    window.InvitacionNav.irA(SIGUIENTE_PAGINA, 'next');
  }

  // ================================================================
  //  ENVIAR MENSAJE AL SHELL PARA INICIAR MÚSICA
  // ================================================================
  function iniciarMusica() {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ tipo: 'invitacion-musica' }, '*');
    }
  }

  // ================================================================
  //  ✅ ESCUCHAR EVENTOS DEL IFRAME DE YOUTUBE
  //  YouTube envía eventos "infoDelivery" con el tiempo actual
  //  cuando enablejsapi=1 está activado
  // ================================================================
  window.addEventListener('message', (event) => {
    try {
      // Los eventos vienen como string JSON
      const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;

      if (!data) return;

      // ✅ Evento "infoDelivery" trae el tiempo y la duración
      if (data.event === 'infoDelivery' && data.info) {
        const info = data.info;

        // Guardar duración
        if (info.duration && info.duration > 0) {
          duracion = info.duration;
        }

        // Detectar el tiempo actual
        if (info.currentTime !== undefined && duracion > 0 && videoIniciado) {
          const tiempoActual = info.currentTime;
          const restante = duracion - tiempoActual;

          // Log cada 2 segundos aprox
          if (tiempoActual - ultimoLog >= 2) {
            console.log(`⏱️ Video: ${tiempoActual.toFixed(1)}s / ${duracion.toFixed(1)}s · Restante: ${restante.toFixed(1)}s`);
            ultimoLog = tiempoActual;
          }

          // ✅ Cuando falten X segundos, transicionar
          if (restante <= SEGUNDOS_ANTES_DEL_FIN && !yaPaso) {
            console.log(`⏱️ ¡Faltan ${restante.toFixed(2)}s! Transicionando...`);
            pasarSiguiente();
          }
        }
      }

      // ✅ Evento "onStateChange" (0 = terminado)
      if (data.event === 'onStateChange' && data.info === 0) {
        console.log('🎬 Video terminado');
        if (!yaPaso) pasarSiguiente();
      }
    } catch (e) {
      // Ignorar mensajes que no son JSON
    }
  });

  // ================================================================
  //  COMENZAR AL TOCAR EL OVERLAY
  // ================================================================
  function comenzar() {
    if (videoIniciado) return;
    videoIniciado = true;

    console.log('🎬 Comenzando portada...');

    // 1. Música de fondo
    iniciarMusica();

    // 2. Ocultar overlay
    if (tapOverlay) tapOverlay.classList.add('oculto');

    // 3. Dar play al video vía postMessage
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
          '*'
      );
      iframe.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'unMute', args: [] }),
          '*'
      );
      iframe.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'setVolume', args: [0] }),
          '*'
      );
    }

    // 4. Mostrar botón saltar
    setTimeout(() => {
      if (skipBtn) skipBtn.classList.remove('hidden');
    }, 1000);

    // 5. ✅ Pedir "listening" para que YouTube empiece a mandar infoDelivery
    setTimeout(() => {
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(
            JSON.stringify({ event: 'listening', id: 1, channel: 'widget' }),
            '*'
        );
        iframe.contentWindow.postMessage(
            JSON.stringify({ event: 'command', func: 'getDuration', args: [] }),
            '*'
        );
      }
    }, 1000);

    // 6. ✅ Timer de respaldo: si por alguna razón no detecta el final,
    //    pasamos a los 60s máximo
    setTimeout(() => {
      if (!yaPaso) {
        console.log('⏱️ Respaldo: 60s alcanzados, pasando...');
        pasarSiguiente();
      }
    }, 60000);
  }

  // ================================================================
  //  EVENTOS
  // ================================================================
  if (tapOverlay) {
    tapOverlay.addEventListener('click', comenzar);
    tapOverlay.addEventListener('touchstart', comenzar, { passive: true });
  }

  if (skipBtn) {
    skipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      pasarSiguiente();
    });
  }

  // ================================================================
  //  INICIALIZAR NAVEGACIÓN (sin flechas en portada)
  // ================================================================
  window.InvitacionNav.init(null, null);

  // Ocultar flechas
  setTimeout(() => {
    const btnNext = document.querySelector('.nav-next');
    if (btnNext) btnNext.style.display = 'none';
    const btnPrev = document.querySelector('.nav-prev');
    if (btnPrev) btnPrev.style.display = 'none';
  }, 100);
});