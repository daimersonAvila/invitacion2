/* ================================================================
   CONFIRMACION.JS - Sección "Un Mensaje para Ti"
   Solo muestra mensajes bonitos rotando cada 3.5 segundos
   ================================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const mensajeDinamico = document.getElementById("mensajeDinamico");

  // ================================================================
  //  ✅ LISTA DE MENSAJES BONITOS
  // ================================================================
  const MENSAJES = [
    "Tu presencia hará que este día sea inolvidable ✦",
    "Será un honor tenerte en mi gran noche",
    "Tu compañía es el mejor regalo que puedo recibir",
    "Ven a celebrar conmigo este momento tan especial",
    "Cada sonrisa tuya hará brillar más mi fiesta",
    "Te espero para compartir la magia de mis XV años",
    "Gracias por ser parte de este sueño hecho realidad",
    "Mi corazón late emocionado por tenerte cerca",
    "Este día brilla más porque tú estarás aquí",
    "Eres parte esencial de mi historia, te espero",
  ];

  let indiceMensaje = 0;

  // ================================================================
  //  CAMBIAR MENSAJE CON ANIMACIÓN
  // ================================================================
  function cambiarMensaje() {
    if (!mensajeDinamico) return;

    // Animación de salida
    mensajeDinamico.style.opacity = '0';
    mensajeDinamico.style.transform = 'scale(0.85) translateY(-10px)';

    setTimeout(() => {
      // Cambiar al siguiente mensaje
      indiceMensaje = (indiceMensaje + 1) % MENSAJES.length;
      mensajeDinamico.textContent = MENSAJES[indiceMensaje];

      // Animación de entrada
      mensajeDinamico.style.opacity = '1';
      mensajeDinamico.style.transform = 'scale(1) translateY(0)';
    }, 600);
  }

  // ================================================================
  //  INICIAR ROTACIÓN
  // ================================================================
  if (mensajeDinamico) {
    mensajeDinamico.textContent = MENSAJES[0];
    console.log('💌 Mensajes dinámicos iniciados');

    // Rotar cada 3.5 segundos
    setInterval(cambiarMensaje, 5500);
  }
});

// ================================================================
//  INICIALIZAR NAVEGACIÓN
// ================================================================
window.InvitacionNav.init(
    "../07-detalles/detalles.html",
    "../09-teesperamos/teesperamos.html"
);

console.log('✅ confirmacion.js cargado');