/* =========================================================
   CONFIGURACIÓN: lo único que normalmente hay que editar
   ========================================================= */
const CONFIG = {
  // Pega aquí el enlace de YouTube de "Tiempo de Vals" (o solo el ID del video)
  musica: "https://www.youtube.com/watch?v=OiC1rgCPmUQ",
  inicio: 0, // segundo donde empieza la canción
  volumen: 40,
  fecha: "2026-11-29T14:00:00-05:00",
  whatsapp: "573142739961",
  mapa: "https://www.google.com/maps/search/Capilla+Vereda+Chen",
  mensajes: [
    "Tu presencia hará que este día sea inolvidable",
    "Será un honor tenerte en mi gran noche",
    "Tu compañía es el mejor regalo que puedo recibir",
    "Cada sonrisa tuya hará brillar más mi fiesta",
    "Gracias por ser parte de este sueño hecho realidad",
  ],
};

const $ = (id) => document.getElementById(id);
document.documentElement.classList.add("js");

/* ---------- Música (iframe de YouTube) ---------- */
const idYoutube = (CONFIG.musica.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/) || [, CONFIG.musica])[1];
const yt = $("yt");
yt.src = `https://www.youtube.com/embed/${idYoutube}?enablejsapi=1&autoplay=0&mute=1&controls=0&loop=1&playlist=${idYoutube}&start=${CONFIG.inicio}&playsinline=1&rel=0&modestbranding=1&fs=0&disablekb=1`;
let sonando = false, iniciada = false;
const cmd = (func, args = []) =>
  yt.contentWindow && yt.contentWindow.postMessage(JSON.stringify({ event: "command", func, args }), "*");

function reproducir() {
  if (!iniciada) cmd("seekTo", [CONFIG.inicio, true]);
  iniciada = true;
  cmd("unMute"); cmd("setVolume", [CONFIG.volumen]); cmd("playVideo");
  sonando = true; $("musicBtn").classList.add("playing");
}
function pausar() { cmd("pauseVideo"); sonando = false; $("musicBtn").classList.remove("playing"); }
$("musicBtn").addEventListener("click", () => (sonando ? pausar() : reproducir()));

/* ---------- Portada: abrir el libro ---------- */
$("abrir").addEventListener("click", () => {
  $("portada").classList.add("abierta");
  document.body.classList.remove("bloqueado");
  reproducir();
  setTimeout(() => $("portada").remove(), 1400);
});

/* ---------- Enlaces ---------- */
$("mapa").href = CONFIG.mapa;
$("confirmar").href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(
  "¡Hola! Confirmo mi asistencia a los XV años de Keidy Julieth 💖\n\nNombre:\nPersonas:"
)}`;

/* ---------- Cuenta regresiva ---------- */
const meta = new Date(CONFIG.fecha).getTime();
function cuenta() {
  const d = Math.max(0, meta - Date.now());
  const v = [Math.floor(d / 864e5), Math.floor((d % 864e5) / 36e5), Math.floor((d % 36e5) / 6e4), Math.floor((d % 6e4) / 1e3)];
  ["cd-dias", "cd-horas", "cd-min", "cd-seg"].forEach((id, i) => ($(id).textContent = String(v[i]).padStart(2, "0")));
}
cuenta(); setInterval(cuenta, 1000);

/* ---------- Calendario (semana inicia en lunes) ---------- */
(function () {
  const f = new Date(CONFIG.fecha);
  const y = f.getFullYear(), m = f.getMonth(), dia = f.getDate();
  const nombre = new Intl.DateTimeFormat("es", { month: "long", year: "numeric" }).format(f);
  const primero = (new Date(y, m, 1).getDay() + 6) % 7;
  const total = new Date(y, m + 1, 0).getDate();
  let h = `<h3>${nombre.charAt(0).toUpperCase() + nombre.slice(1)}</h3><div class="cal-rejilla">`;
  h += ["L", "M", "M", "J", "V", "S", "D"].map((d) => `<b>${d}</b>`).join("");
  h += "<span></span>".repeat(primero);
  for (let i = 1; i <= total; i++) h += i === dia ? `<span class="hoy">${i}</span>` : `<span>${i}</span>`;
  $("calendario").innerHTML = h + "</div>";
})();

/* ---------- Aparición al hacer scroll ---------- */
const io = new IntersectionObserver(
  (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
  { threshold: 0.15 }
);
document.querySelectorAll(".rev").forEach((el) => io.observe(el));

/* ---------- Pétalos cayendo ---------- */
(function () {
  const fotos = ["pe1", "pe2", "petBla"];
  for (let i = 0; i < 14; i++) {
    const p = document.createElement("img");
    p.src = `assets/img/${fotos[i % 3]}.png`;
    p.alt = ""; p.className = "petalo";
    p.style.cssText = `left:${Math.random() * 100}%;width:${14 + Math.random() * 16}px;animation-duration:${9 + Math.random() * 9}s;animation-delay:${-Math.random() * 18}s;--dx:${Math.random() * 120 - 60}px;--rot:${Math.random() * 540 - 270}deg`;
    $("petalos").appendChild(p);
  }
})();

/* ---------- Mensajes rotando ---------- */
(function () {
  let i = 0; const el = $("mensaje");
  setInterval(() => {
    el.style.opacity = 0; el.style.transform = "scale(.92)";
    setTimeout(() => { i = (i + 1) % CONFIG.mensajes.length; el.textContent = CONFIG.mensajes[i]; el.style.opacity = 1; el.style.transform = "none"; }, 500);
  }, 4000);
})();

/* ---------- Galería: tocar para ampliar ---------- */
document.querySelectorAll(".rejilla img").forEach((img) =>
  img.addEventListener("click", () => { $("visor").querySelector("img").src = img.src; $("visor").hidden = false; })
);
$("visor").addEventListener("click", () => ($("visor").hidden = true));
