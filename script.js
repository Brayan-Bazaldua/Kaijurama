// ==========================================
// SELECCIÓN DE ELEMENTOS DEL DOM
// ==========================================
const bloqueoAudio = document.getElementById('bloqueo-audio');
const btnEntrarJuego = document.getElementById('btn-entrar-juego');
const pantallaInicio = document.getElementById('pantalla-inicio');
const pantallaJuego = document.getElementById('pantalla-juego');
const btnComenzar = document.getElementById('btn-comenzar');
const btnReiniciar = document.getElementById('btn-reiniciar');
const btnSalir = document.getElementById('btn-salir'); 
const tablero = document.getElementById('tablero');
const txtMovimientos = document.getElementById('movimientos');
const txtTiempo = document.getElementById('tiempo');
const musicaFondo = document.getElementById('musica-fondo');
const btnMute = document.getElementById('btn-mute');
const modosContainer = document.getElementById('modos');
const modoBotones = document.querySelectorAll('.modo-juego');
const pantallaFinal = document.getElementById('pantalla-final');
const txtSubtitulo = document.getElementById('subtitulo-resultado');
const txtStats = document.getElementById('stats-resultado');
const btnReiniciarFinal = document.getElementById('btn-reiniciar-final');
const btnSalirFinal = document.getElementById('btn-salir-final');

// ==========================================
// EFECTOS DE SONIDO (SFX)
// ==========================================
const sfxVoltear = new Audio('audio/voltear.mp3');
const sfxAcierto = new Audio('audio/acierto.mp3');
const sfxError   = new Audio('audio/error.mp3');
const sfxBoton   = new Audio('audio/boton.mp3');

sfxVoltear.volume = 0.3;
sfxAcierto.volume = 0.4;
sfxError.volume   = 0.15; 
sfxBoton.volume   = 0.3;

let todoMuteado = false;

function reproducirSFX(audio) {
    if (todoMuteado) return; 
    audio.currentTime = 0; 
    audio.play().catch(() => {});
}

// ==========================================
// VARIABLES GLOBALES DE ESTADO
// ==========================================
let tiempoLimite = 0; 
let idIntervalo = null; 
let modoSeleccionado = ''; 

const iconos = [
    'img/01_goji.jpg', 
    'img/02_ghidora.jpg', 
    'img/03_mothra.jpg', 
    'img/04_rodan.jpg', 
    'img/05_anguirus.jpg', 
    'img/06_mecha.jpg', 
    'img/07_gigan.jpg', 
    'img/08_Godzilla_JR.jpg' 
];

let cartasDuplicadas = [...iconos, ...iconos];
let cartasVolteadas = [];
let movimientos = 0;
let parejasEncontradas = 0;

// ==========================================
// CONTROL DE AUDIO GENERAL
// ==========================================
btnMute.addEventListener('click', () => {
    todoMuteado = !todoMuteado; 
    
    if (musicaFondo) {
        musicaFondo.muted = todoMuteado;
    }

    btnMute.textContent = todoMuteado ? '🔇' : '🔊'; 

    if (!todoMuteado) {
        reproducirSFX(sfxBoton); 
    }
});

// ==========================================
// CONTROL DE FLUJO Y PANTALLAS
// ==========================================

btnEntrarJuego.addEventListener('click', () => {
    reproducirSFX(sfxBoton); 
    if (bloqueoAudio) bloqueoAudio.classList.add('oculto');
    if (pantallaInicio) pantallaInicio.classList.remove('oculto');
    
    if (musicaFondo) {
        musicaFondo.loop = true;
        musicaFondo.volume = 0.15; 
        musicaFondo.muted = todoMuteado; 
        musicaFondo.play().catch(() => {});
    }
});

btnComenzar.addEventListener('click', () => {
    reproducirSFX(sfxBoton); 
    btnComenzar.classList.add('oculto');
    if (modosContainer) modosContainer.classList.remove('oculto');
});

modoBotones.forEach(boton => {
    boton.addEventListener('click', (e) => {
        reproducirSFX(sfxBoton); 
        const tiempo = e.target.getAttribute('data-tiempo');
        
        tiempoLimite = tiempo === 'inf' ? Infinity : parseInt(tiempo);
        modoSeleccionado = e.target.textContent; 

        if (pantallaInicio) pantallaInicio.classList.add('oculto');
        if (pantallaJuego) pantallaJuego.classList.remove('oculto');
        inicializarJuego(); 
    });
});

function restaurarTiempoPorModo() {
    if (modoSeleccionado.includes("Baby")) {
        tiempoLimite = Infinity;
    } else if (modoSeleccionado.includes("JR")) {
        tiempoLimite = 90;
    } else if (modoSeleccionado.includes("King")) {
        tiempoLimite = 45;
    } else {
        tiempoLimite = 60; 
    }
}

btnReiniciar.addEventListener('click', () => {
    reproducirSFX(sfxBoton); 
    restaurarTiempoPorModo();
    inicializarJuego();
});

btnSalir.addEventListener('click', () => {
    reproducirSFX(sfxBoton); 
    clearInterval(idIntervalo); 
    
    if (pantallaJuego) pantallaJuego.classList.add('oculto');
    if (pantallaInicio) pantallaInicio.classList.remove('oculto');
    
    if (modosContainer) modosContainer.classList.add('oculto');
    btnComenzar.classList.remove('oculto');
});

btnReiniciarFinal.addEventListener('click', () => {
    reproducirSFX(sfxBoton);
    pantallaFinal.classList.add('oculto');
    pantallaJuego.classList.remove('oculto'); 
    restaurarTiempoPorModo();
    inicializarJuego();
});

btnSalirFinal.addEventListener('click', () => {
    reproducirSFX(sfxBoton);
    pantallaFinal.classList.add('oculto');
    pantallaInicio.classList.remove('oculto');
    
    if (modosContainer) modosContainer.classList.add('oculto');
    btnComenzar.classList.remove('oculto');
});

// ==========================================
// GESTIÓN DEL TEMPORIZADOR
// ==========================================
function iniciarTemporizador() {
    clearInterval(idIntervalo);

    if (tiempoLimite === Infinity) {
        txtTiempo.textContent = "Infinito";
        return; 
    }

    txtTiempo.textContent = `${tiempoLimite}s`;

    idIntervalo = setInterval(() => {
        tiempoLimite--;
        txtTiempo.textContent = `${tiempoLimite}s`;

        if (tiempoLimite <= 0) {
            clearInterval(idIntervalo);
            
            const cartas = document.querySelectorAll('.carta');
            cartas.forEach(carta => carta.removeEventListener('click', voltearCarta));

            reproducirSFX(sfxError); 
            
            setTimeout(() => {
                mostrarPantallaFinal(false);
            }, 100);
        }
    }, 1000);
}

// ==========================================
// LÓGICA DEL JUEGO (MEMORAMA)
// ==========================================

function barajar(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function inicializarJuego() {
    tablero.innerHTML = '';
    cartasVolteadas = [];
    movimientos = 0;
    parejasEncontradas = 0;
    txtMovimientos.textContent = movimientos;

    const cartasBarajadas = barajar([...cartasDuplicadas]);

    cartasBarajadas.forEach(ruta => {
        const carta = document.createElement('div');
        carta.classList.add('carta');
        carta.dataset.icon = ruta; 

        const anguloAleatorio = (Math.random() * 20) - 10;
        carta.style.setProperty('--inclinacion', `rotate(${anguloAleatorio}deg)`);
        carta.style.transform = `rotate(${anguloAleatorio}deg)`;

        carta.innerHTML = `
            <div class="cara atras"></div>
            <div class="cara frente" style="background-image: url('${ruta}');"></div>
        `;

        carta.addEventListener('click', voltearCarta);
        tablero.appendChild(carta);
    });
    
    iniciarTemporizador();
}

function voltearCarta() {
    if (cartasVolteadas.length === 2 || this.classList.contains('volteada')) return;

    reproducirSFX(sfxVoltear);

    this.classList.add('volteada');
    cartasVolteadas.push(this);

    if (cartasVolteadas.length === 2) {
        movimientos++;
        txtMovimientos.textContent = movimientos;
        verificarPareja();
    }
}

function verificarPareja() {
    const [carta1, carta2] = cartasVolteadas;

    if (carta1.dataset.icon === carta2.dataset.icon) {
        reproducirSFX(sfxAcierto);

        carta1.classList.add('acierto');
        carta2.classList.add('acierto');

        cartasVolteadas = [];
        parejasEncontradas++;

        if (parejasEncontradas === iconos.length) {
            clearInterval(idIntervalo); 
            
            setTimeout(() => {
                mostrarPantallaFinal(true);
            }, 500);
        }
    } else {
        setTimeout(() => {
            carta1.classList.add('error');
            reproducirSFX(sfxError);
            carta2.classList.add('error');
        }, 400);

        setTimeout(() => {
            carta1.classList.remove('volteada', 'error');
            carta2.classList.remove('volteada', 'error');
            cartasVolteadas = [];
        }, 1000);
    }
}

// ==========================================
// GESTIÓN DE LA PANTALLA FINAL
// ==========================================
function mostrarPantallaFinal(victoria = true) {
    pantallaJuego.classList.add("oculto");
    pantallaFinal.classList.remove("oculto");

    if (!victoria) {
        txtSubtitulo.innerText = "Fin del juego. El tiempo ha concluido.";
        txtStats.innerHTML = `Intentos realizados: <b>${movimientos} parejas</b>`;
        return;
    }

    let mensajeModo = "";
    if (modoSeleccionado.includes("Baby")) {
        mensajeModo = "Tablero completado. Modo Calentamiento finalizado.";
    } else if (modoSeleccionado.includes("JR")) {
        mensajeModo = "Nivel completado con éxito.";
    } else if (modoSeleccionado.includes("King")) {
        mensajeModo = "Nivel máximo completado con éxito.";
    } else {
        mensajeModo = "Desafío completado con éxito.";
    }

    txtSubtitulo.innerText = mensajeModo;
    
    txtStats.innerHTML = `
        Tiempo restante: <b>${modoSeleccionado.includes("Baby") ? 'N/A' : tiempoLimite + 's'}</b><br>
        Intentos totales: <b>${movimientos} parejas</b>
    `;
}

