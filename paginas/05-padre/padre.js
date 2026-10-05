/* ================================================================
   PADRE.JS - Sección "Mis Padres" + Hermano
   - Al tocar "Siguiente": mariposas cruzan → navega a Detalles
   ================================================================ */

console.log('🚀 padre.js cargando...');

// ================================================================
//  CREAR MARIPOSAS DE TRANSICIÓN
// ================================================================
function crearMariposasTransicion() {
    let contenedor = document.getElementById('mariposas-transicion');
    if (!contenedor) {
        contenedor = document.createElement('div');
        contenedor.id = 'mariposas-transicion';
        document.body.appendChild(contenedor);
    }

    contenedor.innerHTML = '';

    const totalMariposas = 20;
    for (let i = 0; i < totalMariposas; i++) {
        const mariposa = document.createElement('img');
        mariposa.src = '../../assets/img/mar1.png';
        mariposa.className = 'mariposa-transicion';
        mariposa.alt = '';

        const desdeIzquierda = i % 2 === 0;

        if (desdeIzquierda) {
            mariposa.classList.add('volar-derecha');
            mariposa.style.left = '-10%';
        } else {
            mariposa.classList.add('volar-izquierda');
            mariposa.style.left = '110%';
        }
        mariposa.style.bottom = '-10%';

        const tamaño = 90 + Math.random() * 90;
        mariposa.style.width = `${tamaño}px`;

        const retraso = i * 120;
        mariposa.style.animationDelay = `${retraso}ms`;

        const duracion = 2400 + Math.random() * 600;
        mariposa.style.animationDuration = `${duracion}ms`;

        contenedor.appendChild(mariposa);
    }

    console.log(`🦋 ${totalMariposas} mariposas creadas`);
}

// ================================================================
//  NAVEGAR A DETALLES
// ================================================================
function navegarADetalles() {
    const RUTA = '../07-detalles/detalles.html';

    console.log('🎯 Intentando navegar a:', RUTA);

    // Opción 1: Llamada directa al padre
    try {
        if (window.parent && window.parent !== window) {
            if (typeof window.parent.cambiarPagina === 'function') {
                console.log('✅ Usando parent.cambiarPagina()');
                window.parent.cambiarPagina(RUTA);
                return;
            }
        }
    } catch (e) {
        console.error('❌ Error llamando al padre:', e);
    }

    // Opción 2: postMessage
    try {
        if (window.parent && window.parent !== window) {
            window.parent.postMessage(
                { tipo: 'invitacion-nav', url: RUTA, direccion: 'next' },
                '*'
            );
            return;
        }
    } catch (e) {
        console.error('❌ Error con postMessage:', e);
    }

    // Opción 3: Navegar directamente
    window.location.href = RUTA;
}

// ================================================================
//  INTERCEPTAR EL BOTÓN "SIGUIENTE"
// ================================================================
function activarTransicionMariposas() {
    console.log('🔍 Buscando botón siguiente...');

    const btnNext = document.querySelector('.nav-next');
    if (!btnNext) {
        console.warn('⚠️ No se encontró .nav-next, reintentando...');
        setTimeout(activarTransicionMariposas, 300);
        return;
    }

    console.log('✅ Botón siguiente encontrado');

    const btnClone = btnNext.cloneNode(true);
    btnNext.parentNode.replaceChild(btnClone, btnNext);

    let yaActivo = false;

    btnClone.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();

        if (yaActivo) return;
        yaActivo = true;

        console.log('🦋 ¡Click detectado! Iniciando transición...');

        crearMariposasTransicion();

        setTimeout(() => {
            console.log('⏰ Navegando a Detalles...');
            navegarADetalles();
        }, 3400);
    });
}

window.addEventListener('load', () => {
    console.log('📄 Página cargada, activando transición...');
    setTimeout(activarTransicionMariposas, 100);
});

// ================================================================
//  INICIALIZAR NAVEGACIÓN
// ================================================================
window.InvitacionNav.init(
    "../04-invitacion/invitacion.html",
    "../07-detalles/detalles.html"
);