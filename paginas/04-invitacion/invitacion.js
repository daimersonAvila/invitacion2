/* ================================================================
   INVITACION.JS - Sección de dedicatoria
   - Pétalos blancos cayendo
   - Mariposas animadas 100% con CSS
   - Inicializa la navegación
   ================================================================ */

// ================================================================
//  ✅ CREAR PÉTALOS BLANCOS CAYENDO
// ================================================================
function crearPetalos() {
    const contenedor = document.getElementById('petalos-container');

    if (!contenedor) {
        console.warn('⚠️ No se encontró #petalos-container');
        return;
    }

    // ✅ Imágenes de pétalos (mayoría blancos)
    const IMAGENES = [
        '../../assets/img/petBla.png',
        '../../assets/img/petBla.png',
        '../../assets/img/petBla.png',
        '../../assets/img/pe1.png',
        '../../assets/img/pe2.png'
    ];

    // ✅ Tipos de caída disponibles
    const TIPOS_CAIDA = [
        'caida-normal',
        'caida-izquierda',
        'caida-rapida',
        'caida-zigzag'
    ];

    // ✅ Cantidad de pétalos
    const CANTIDAD_PETALOS = 25;

    for (let i = 0; i < CANTIDAD_PETALOS; i++) {
        const petalo = document.createElement('img');

        petalo.src = IMAGENES[Math.floor(Math.random() * IMAGENES.length)];
        petalo.alt = '';
        petalo.className = 'petalo';

        // Posición horizontal aleatoria
        petalo.style.left = Math.random() * 100 + '%';

        // ✅ Tamaño grande: entre 45px y 80px
        const tamaño = 45 + Math.random() * 35;
        petalo.style.width = tamaño + 'px';

        // Tipo de caída aleatorio
        const tipoCaida = TIPOS_CAIDA[Math.floor(Math.random() * TIPOS_CAIDA.length)];
        petalo.classList.add(tipoCaida);

        // Duración aleatoria (entre 10s y 16s)
        const duracion = 10 + Math.random() * 6;
        petalo.style.animationDuration = duracion + 's';

        // Retraso aleatorio (0-10s) para que no empiecen todas juntas
        const retraso = Math.random() * 10;
        petalo.style.animationDelay = retraso + 's';

        // Opacidad variable
        petalo.style.opacity = 0.7 + Math.random() * 0.3;

        contenedor.appendChild(petalo);
    }

    console.log(`🌸 ${CANTIDAD_PETALOS} pétalos blancos creados`);
}

// Iniciar cuando la página cargue
window.addEventListener('load', crearPetalos);

// ================================================================
//  ✅ INICIALIZAR NAVEGACIÓN
// ================================================================
window.InvitacionNav.init(
    "../03-keidy/keidy.html",
    "../05-padre/padre.html"
);

console.log('✅ invitacion.js cargado');