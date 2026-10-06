/* Fuegos artificiales de la última sección (de la versión original) */
(function () {
  const sec = document.querySelector(".cierre"), cv = document.getElementById("fuegos"), ctx = cv.getContext("2d");
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return cv.remove();
  let W, H, visible = false, corriendo = false;
  const ajustar = () => { W = cv.width = sec.clientWidth; H = cv.height = sec.clientHeight; };
  ajustar(); new ResizeObserver(ajustar).observe(sec);
  const COL = [[212,175,55],[255,215,0],[220,30,30],[179,0,0],[255,182,193],[255,105,140],[255,245,220]];
  const col = () => COL[(Math.random() * COL.length) | 0];
  const cohetes = [], parts = [];
  const lanzar = () => cohetes.push({ x: W * (0.15 + Math.random() * 0.7), y: H + 20, ty: H * (0.1 + Math.random() * 0.4), v: 8 + Math.random() * 4, c: col(), est: [], t: 2 + Math.random() * 1.5 });
  function explotar(x, y, c) {
    const r = Math.random(), grande = r > 0.85, n = grande ? 80 : r > 0.6 ? 60 : 35, extra = Math.random() > 0.5 ? 15 : 0, c2 = col();
    for (let i = 0; i < n + extra; i++) {
      const a = Math.random() * 6.283, v = (grande ? 3 : 2) + Math.random() * 4;
      parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, vida: 1, d: 0.012 + Math.random() * 0.018, t: grande ? 2 + Math.random() * 2 : 1 + Math.random() * 1.5, c: i < n ? c : c2, cen: Math.random() > 0.7, f: Math.random() * 6.28 });
    }
  }
  function frame() {
    if (!visible) { corriendo = false; return; }
    ctx.globalCompositeOperation = "destination-out"; ctx.fillStyle = "rgba(0,0,0,.15)"; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";
    for (let i = cohetes.length - 1; i >= 0; i--) {
      const k = cohetes[i]; k.est.push([k.x, k.y]); if (k.est.length > 8) k.est.shift();
      k.y -= k.v; k.v *= 0.995;
      if (k.y <= k.ty || k.v < 2) { explotar(k.x, k.y, k.c); cohetes.splice(i, 1); continue; }
      const [r, g, b] = k.c;
      k.est.forEach((p, j) => { ctx.fillStyle = `rgba(${r},${g},${b},${j / k.est.length})`; ctx.beginPath(); ctx.arc(p[0], p[1], (k.t * j) / k.est.length, 0, 6.283); ctx.fill(); });
      ctx.fillStyle = ctx.shadowColor = `rgb(${r},${g},${b})`; ctx.shadowBlur = 15; ctx.beginPath(); ctx.arc(k.x, k.y, k.t, 0, 6.283); ctx.fill(); ctx.shadowBlur = 0;
    }
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i]; p.vx *= 0.985; p.vy = p.vy * 0.985 + 0.05; p.x += p.vx; p.y += p.vy; p.vida -= p.d;
      if (p.vida <= 0) { parts.splice(i, 1); continue; }
      let al = p.vida; if (p.cen) { p.f += 0.3; if (Math.sin(p.f) > 0.7) al *= 0.3; }
      const [r, g, b] = p.c;
      ctx.fillStyle = ctx.shadowColor = `rgba(${r},${g},${b},${al})`; ctx.shadowBlur = 12 * al;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.t * p.vida, 0, 6.283); ctx.fill(); ctx.shadowBlur = 0;
    }
    ctx.globalCompositeOperation = "source-over"; requestAnimationFrame(frame);
  }
  (function lluvia() { if (visible) lanzar(); setTimeout(lluvia, 400 + Math.random() * 800); })();
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !corriendo) { corriendo = true; for (let i = 0; i < 5; i++) setTimeout(lanzar, i * 200); frame(); }
  }, { threshold: 0.3 }).observe(sec);
})();
