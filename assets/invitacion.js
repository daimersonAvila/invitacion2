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
  mapa: "https://www.youtube.com/watch?v=HF-_IqvEMgo&list=RDHF-_IqvEMgo&start_radio=1",
  auto: true, // recorrido automático
  // Tiempo de lectura (ms): base + por palabra + por foto. Súbelos si quieren más calma.
  lectura: { base: 3000, porPalabra: 500, porFoto: 1500, max: 24000 },
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

const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;

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
  if (!quieto) { setTimeout(rafaga, 700); if (CONFIG.auto) setTimeout(() => recorrer(0), 3200); }
});

/* ---------- Enlaces ---------- */
$("mapa").href = CONFIG.mapa;

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


/* ---------- Pétalos: una lluvia al llegar a cada sección ---------- */
function rafaga(n = 12) {
  const fotos = ["pe1", "pe2", "petBla"];
  for (let i = 0; i < n; i++) {
    const p = document.createElement("img");
    p.src = `assets/img/${fotos[i % 3]}.png`; p.alt = ""; p.className = "petalo";
    p.style.cssText = `left:${Math.random() * 100}%;width:${18 + Math.random() * 18}px;animation-duration:${4 + Math.random() * 4}s;animation-delay:${Math.random() * 1.5}s;animation-iteration-count:1;animation-fill-mode:forwards;--dx:${Math.random() * 160 - 80}px;--rot:${Math.random() * 720 - 360}deg`;
    p.addEventListener("animationend", () => p.remove());
    $("petalos").appendChild(p);
  }
}

/* ---------- Mariposas: unas cruzan volando, otras forman un corazón ---------- */
const nuevaMari = () => { const m = document.createElement("img"); m.src = "assets/img/mar1.png"; m.alt = ""; m.className = "mari"; $("mariposas").appendChild(m); return m; };
function volar() {
  const w = innerWidth, h = innerHeight, izq = Math.random() < 0.5, n = 5, m = nuevaMari(), kf = [];
  for (let i = 0; i < n; i++) {
    const x = izq ? -60 + ((w + 120) * i) / (n - 1) : w + 60 - ((w + 120) * i) / (n - 1);
    kf.push({ transform: `translate(${x}px,${h * (0.1 + Math.random() * 0.75)}px) rotate(${(i % 2 ? -1 : 1) * (10 + Math.random() * 30)}deg)`, opacity: i === 0 || i === n - 1 ? 0 : 1 });
  }
  m.animate(kf, { duration: 9000 + Math.random() * 5000, easing: "ease-in-out" }).onfinish = () => m.remove();
}
function corazon() {
  const w = innerWidth, h = innerHeight, S = Math.min(w * 0.62, 300) / 34, cx = w / 2, cy = h * 0.24, N = 22;
  for (let i = 0; i < N; i++) {
    const t = (i / N) * 2 * Math.PI, hx = 16 * Math.sin(t) ** 3;
    const hy = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    const ex = cx + hx * S - 20, ey = cy - hy * S - 12, ro = Math.random() * 30 - 15, lado = Math.random() < 0.5;
    const m = nuevaMari(), fin = `translate(${ex}px,${ey}px) rotate(${ro}deg)`;
    m.animate([{ transform: `translate(${lado ? -80 : w + 80}px,${h * Math.random()}px) rotate(${lado ? 40 : -40}deg)`, opacity: 0 }, { transform: fin, opacity: 0.95 }],
      { duration: 2600 + Math.random() * 900, delay: Math.random() * 900, easing: "cubic-bezier(.25,.8,.3,1)", fill: "forwards" }).onfinish = () =>
      setTimeout(() => m.animate([{ transform: fin, opacity: 0.95 }, { transform: `translate(${ex + Math.random() * 300 - 150}px,-90px) rotate(${Math.random() * 80 - 40}deg)`, opacity: 0 }],
        { duration: 2600 + Math.random() * 1200, easing: "ease-in" }).onfinish = () => m.remove(), 3500);
  }
}
if (!quieto) setInterval(() => { if (!document.hidden && !document.body.classList.contains("bloqueado")) volar(); }, 3800);

/* ---------- Al llegar a cada sección: pétalos (y corazón en algunas) ---------- */
const secs = [...document.querySelectorAll("main>section")];
const vistas = new IntersectionObserver((es) => es.forEach((e) => {
  if (e.isIntersecting && !document.body.classList.contains("bloqueado")) {
    vistas.unobserve(e.target);
    if (!quieto) { rafaga(); if (e.target.hasAttribute("data-corazon")) corazon(); }
  }
}), { threshold: 0.3 });
secs.forEach((s) => vistas.observe(s));

/* ---------- Recorrido automático (se pausa al tocar la pantalla) ---------- */
let auto = false, tok = 0;
const btnAuto = $("autoBtn");
const ui = () => (btnAuto.firstElementChild.textContent = auto ? "❚❚" : "▶");
const espera = (ms, t) => new Promise((ok) => setTimeout(() => ok(t === tok), ms));
const irA = (y, ms, t) => new Promise((ok) => {
  const y0 = scrollY, dy = y - y0, t0 = performance.now();
  (function paso(ahora) {
    if (t !== tok) return ok(false);
    const k = Math.min(1, (ahora - t0) / ms), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    scrollTo(0, y0 + dy * e);
    k < 1 ? requestAnimationFrame(paso) : ok(true);
  })(t0);
});
function tiempo(s) {
  const L = CONFIG.lectura, palabras = s.innerText.split(/\s+/).filter(Boolean).length;
  return Math.min(L.max, L.base + L.porPalabra * palabras + L.porFoto * s.querySelectorAll("figure").length + (s.classList.contains("cierre") ? 8000 : 0));
}
async function recorrer(desde) {
  const t = ++tok; auto = true; ui();
  for (let i = desde; i < secs.length; i++) {
    const s = secs[i], vh = innerHeight, r = s.getBoundingClientRect(), top = r.top + scrollY, h = r.height;
    const n = h > vh * 1.1 ? Math.ceil(h / (vh * 0.85)) : 1, total = tiempo(s);
    for (let k = 0; k < n; k++) {
      const y = n === 1 ? top - (vh - h) / 2 : top + (k * (h - vh)) / (n - 1);
      if (!(await irA(Math.max(0, Math.round(y)), 2800, t))) return;
      if (!(await espera(total / n, t))) return;
    }
  }
  if (t === tok) { auto = false; ui(); }
}
["touchstart", "wheel", "keydown", "mousedown"].forEach((ev) =>
  addEventListener(ev, (e) => { if (auto && !(e.target.closest && e.target.closest("button,a"))) { tok++; auto = false; ui(); } }, { passive: true })
);
btnAuto.addEventListener("click", () => {
  if (auto) { tok++; auto = false; ui(); return; }
  recorrer(Math.max(0, secs.findIndex((s) => s.getBoundingClientRect().bottom > innerHeight * 0.5)));
});
