/* ============================================================
   TEESPERAMOS.JS - Fuegos artificiales + apertura de WhatsApp
   - Muestra la lluvia de fuegos artificiales
   - Después de unos segundos, abre WhatsApp con la confirmación
   ============================================================ */

// ================================================================
//  CONFIGURACIÓN DEL CANVAS DE FUEGOS ARTIFICIALES
// ================================================================
const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');

let W = 0;
let H = 0;

function ajustarCanvas() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
}

ajustarCanvas();
window.addEventListener('resize', ajustarCanvas);

// ================================================================
//  COLORES DE LOS FUEGOS ARTIFICIALES
// ================================================================
const COLORES = [
    { nombre: 'dorado',       rgb: [212, 175, 55] },
    { nombre: 'dorado-claro', rgb: [255, 215, 0] },
    { nombre: 'rojo',         rgb: [220, 30, 30] },
    { nombre: 'rojo-vino',    rgb: [179, 0, 0] },
    { nombre: 'rosa',         rgb: [255, 182, 193] },
    { nombre: 'rosa-fuerte',  rgb: [255, 105, 140] },
    { nombre: 'crema',        rgb: [255, 245, 220] },
];

function colorAleatorio() {
    return COLORES[Math.floor(Math.random() * COLORES.length)];
}

// ================================================================
//  CLASE: COHETE
// ================================================================
class Cohete {
    constructor(x, targetY, color) {
        this.x = x;
        this.y = H + 20;
        this.targetY = targetY;
        this.color = color;
        this.velocidad = 8 + Math.random() * 4;
        this.estela = [];
        this.explotado = false;
        this.tamano = 2 + Math.random() * 1.5;
    }

    actualizar() {
        this.estela.push({ x: this.x, y: this.y });
        if (this.estela.length > 8) this.estela.shift();

        this.y -= this.velocidad;
        this.velocidad *= 0.995;

        if (this.y <= this.targetY || this.velocidad < 2) {
            this.explotado = true;
            return true;
        }
        return false;
    }

    dibujar() {
        ctx.beginPath();
        for (let i = 0; i < this.estela.length; i++) {
            const p = this.estela[i];
            const alpha = i / this.estela.length;
            const [r, g, b] = this.color.rgb;
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, this.tamano * alpha, 0, Math.PI * 2);
            ctx.fill();
        }

        const [r, g, b] = this.color.rgb;
        ctx.beginPath();
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.shadowColor = `rgb(${r}, ${g}, ${b})`;
        ctx.shadowBlur = 15;
        ctx.arc(this.x, this.y, this.tamano, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

// ================================================================
//  CLASE: PARTÍCULA
// ================================================================
class Particula {
    constructor(x, y, color, tipo = 'normal') {
        this.x = x;
        this.y = y;
        this.color = color;

        const angulo = Math.random() * Math.PI * 2;
        const velocidadBase = tipo === 'grande' ? 3 : 2;
        const velocidad = velocidadBase + Math.random() * 4;

        this.vx = Math.cos(angulo) * velocidad;
        this.vy = Math.sin(angulo) * velocidad;

        this.vida = 1;
        this.decaimiento = 0.012 + Math.random() * 0.018;
        this.gravedad = 0.05;
        this.friccion = 0.985;

        this.tamano = tipo === 'grande' ? 2 + Math.random() * 2 : 1 + Math.random() * 1.5;

        this.centelleo = Math.random() > 0.7;
        this.centelleoFase = Math.random() * Math.PI * 2;
    }

    actualizar() {
        this.vx *= this.friccion;
        this.vy *= this.friccion;
        this.vy += this.gravedad;

        this.x += this.vx;
        this.y += this.vy;

        this.vida -= this.decaimiento;

        return this.vida <= 0;
    }

    dibujar() {
        const [r, g, b] = this.color.rgb;
        let alpha = Math.max(0, this.vida);

        if (this.centelleo) {
            this.centelleoFase += 0.3;
            if (Math.sin(this.centelleoFase) > 0.7) {
                alpha *= 0.3;
            }
        }

        ctx.beginPath();
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.shadowBlur = 12 * alpha;
        ctx.arc(this.x, this.y, this.tamano * this.vida, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

// ================================================================
//  CLASE: EXPLOSIÓN
// ================================================================
class Explosion {
    constructor(x, y, color) {
        this.particulas = [];
        this.terminada = false;

        const tipo = Math.random();
        let cantidad = 45;
        let tamanoTipo = 'normal';

        if (tipo > 0.85) {
            cantidad = 80;
            tamanoTipo = 'grande';
        } else if (tipo > 0.6) {
            cantidad = 60;
        } else {
            cantidad = 35;
        }

        for (let i = 0; i < cantidad; i++) {
            this.particulas.push(new Particula(x, y, color, tamanoTipo));
        }

        if (Math.random() > 0.5) {
            const colorSec = colorAleatorio();
            for (let i = 0; i < 15; i++) {
                this.particulas.push(new Particula(x, y, colorSec, 'normal'));
            }
        }
    }

    actualizar() {
        this.particulas = this.particulas.filter(p => !p.actualizar());
        this.terminada = this.particulas.length === 0;
    }

    dibujar() {
        this.particulas.forEach(p => p.dibujar());
    }
}

// ================================================================
//  ESTADO GLOBAL
// ================================================================
const cohetes = [];
const explosiones = [];

// ================================================================
//  LANZAR UN COHETE
// ================================================================
function lanzarCohete() {
    const x = W * (0.15 + Math.random() * 0.7);
    const targetY = H * (0.1 + Math.random() * 0.35);
    const color = colorAleatorio();
    cohetes.push(new Cohete(x, targetY, color));
}

// ================================================================
//  LOOP PRINCIPAL
// ================================================================
function animar() {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(0, 0, W, H);

    ctx.globalCompositeOperation = 'lighter';

    for (let i = cohetes.length - 1; i >= 0; i--) {
        const cohete = cohetes[i];
        const explotar = cohete.actualizar();

        if (explotar) {
            explosiones.push(new Explosion(cohete.x, cohete.y, cohete.color));
            cohetes.splice(i, 1);
        } else {
            cohete.dibujar();
        }
    }

    for (let i = explosiones.length - 1; i >= 0; i--) {
        const ex = explosiones[i];
        ex.actualizar();
        ex.dibujar();

        if (ex.terminada) {
            explosiones.splice(i, 1);
        }
    }

    ctx.globalCompositeOperation = 'source-over';

    requestAnimationFrame(animar);
}

animar();

// ================================================================
//  LLUVIA CONTINUA
// ================================================================
function lluviaFuegos() {
    lanzarCohete();
    const siguiente = 400 + Math.random() * 800;
    setTimeout(lluviaFuegos, siguiente);
}

setTimeout(() => {
    for (let i = 0; i < 5; i++) {
        setTimeout(lanzarCohete, i * 200);
    }
    setTimeout(lluviaFuegos, 1500);
}, 500);

// ================================================================
//  ✅ ABRIR WHATSAPP DESPUÉS DE LOS FUEGOS ARTIFICIALES
//  - Esperamos 4.5 segundos (tiempo para ver los fuegos)
//  - Recuperamos los datos del formulario
//  - Abrimos WhatsApp automáticamente
// ================================================================
const NUMERO_WHATSAPP = "573142739961";

setTimeout(() => {
    const pendiente = sessionStorage.getItem('rsvp_pendiente');

    if (pendiente === 'true') {
        const nombre = sessionStorage.getItem('rsvp_nombre') || 'Invitado';
        const asistencia = sessionStorage.getItem('rsvp_asistencia') || '';
        const personas = sessionStorage.getItem('rsvp_personas') || '1';

        const mensaje =
            `¡Hola! Confirmo mi asistencia a los XV años de Keidy Julieth 💖%0A%0A` +
            `*Nombre:* ${nombre}%0A` +
            `*Asistencia:* ${asistencia}%0A` +
            `*Personas:* ${personas}`;

        console.log('📱 Abriendo WhatsApp con la confirmación...');
        window.open(`https://wa.me/${NUMERO_WHATSAPP}?text=${mensaje}`, "_blank");

        // ✅ Limpiar los datos para que no se envíe de nuevo
        sessionStorage.removeItem('rsvp_pendiente');
        sessionStorage.removeItem('rsvp_nombre');
        sessionStorage.removeItem('rsvp_asistencia');
        sessionStorage.removeItem('rsvp_personas');
    }
}, 4500); // ✅ 4.5 segundos para disfrutar los fuegos artificiales

// ================================================================
//  INICIALIZAR NAVEGACIÓN
// ================================================================
window.InvitacionNav.init(
    "../08-confirmacion/confirmacion.html",
    null
);

console.log('🎆 Fuegos artificiales iniciados');