import '../saas/main.scss';

let cajaSeleccionada = null;
let segundaCajaSeleccionada = null;
let bloqueandoCajas = false;
let cronometroInterval;
let tiempoInicial;

function initGame() {
    let boxes = document.querySelectorAll('.box');
    boxes.forEach(box => {
        box.addEventListener('click', revealImage);
        box.style.backgroundImage = 'none';
        box.style.pointerEvents = 'auto';
    });

    // Cargar estado guardado en LocalStorage al inicio del juego
    cargarEstadoJuego();

    // Start Timer
    let botonCronometro = document.getElementById("iniciarCronometro");
    botonCronometro.addEventListener('click', iniciarCronometro);

    // Reset Game
    let botonReiniciar = document.getElementById("reiniciarJuego");
    botonReiniciar.addEventListener('click', reiniciarJuego);

    // Cargar estado del cronómetro si existe
    cargarCronometroDesdeLocalStorage();

    // Shuffle images
    barajarImagenes();
}

function cargarCronometroDesdeLocalStorage() {
    let cronometroGuardado = localStorage.getItem('cronometro');

    if (cronometroGuardado) {
        let tiempo = JSON.parse(cronometroGuardado);
        tiempoInicial = Date.now() - (tiempo.minutos * 60 + tiempo.segundos) * 1000;

        cronometroInterval = setInterval(() => {
            let tiempoTranscurrido = Math.floor((Date.now() - tiempoInicial) / 1000);
            let minutos = Math.floor(tiempoTranscurrido / 60);
            let segundos = tiempoTranscurrido % 60;
            document.getElementById('cronometro').textContent = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;

            // Guardar el estado del cronómetro en LocalStorage
            localStorage.setItem('cronometro', JSON.stringify({
                minutos: minutos,
                segundos: segundos
            }));
        }, 1000);
    }
}

function revealImage(event) {
    if (bloqueandoCajas) return;

    let box = event.target;

    if (box.style.pointerEvents === 'none') {
        return;
    }

    if (!cajaSeleccionada) {
        cajaSeleccionada = box;
        mostrarImagen(cajaSeleccionada);
    } else if (!segundaCajaSeleccionada) {
        segundaCajaSeleccionada = box;
        mostrarImagen(segundaCajaSeleccionada);

        setTimeout(compararImagenes, 1000);
    }
}

function mostrarImagen(box) {
    let rutaCompletaImagen = box.getAttribute('data-image-url');
    box.style.backgroundImage = rutaCompletaImagen;
    box.style.backgroundSize = 'cover';
    box.style.backgroundPosition = 'center';
}

function compararImagenes() {
    if (!cajaSeleccionada || !segundaCajaSeleccionada) return;

    let imagenSeleccionada = cajaSeleccionada.getAttribute('data-image-url');
    let imagenActual = segundaCajaSeleccionada.getAttribute('data-image-url');

    if (imagenSeleccionada === imagenActual) {
        cajaSeleccionada.style.pointerEvents = 'none';
        segundaCajaSeleccionada.style.pointerEvents = 'none';

        // Guardar estado actualizado en LocalStorage
        guardarEstadoJuego();
    } else {
        cajaSeleccionada.style.backgroundImage = 'none';
        segundaCajaSeleccionada.style.backgroundImage = 'none';
    }

    cajaSeleccionada = null;
    segundaCajaSeleccionada = null;
    bloqueandoCajas = false;

    verificarFinJuego();
}

function verificarFinJuego() {
    let boxes = document.querySelectorAll('.box');
    let juegoTerminado = true;

    boxes.forEach(box => {
        if (box.style.pointerEvents !== 'none') {
            juegoTerminado = false;
        }
    });

    if (juegoTerminado) {
        clearInterval(cronometroInterval);
        alert('¡Felicidades! ¡Has encontrado todas las parejas!');
    }
}

function iniciarCronometro() {
    tiempoInicial = Date.now();
    clearInterval(cronometroInterval);

    cronometroInterval = setInterval(() => {
        let tiempoTranscurrido = Math.floor((Date.now() - tiempoInicial) / 1000);
        let minutos = Math.floor(tiempoTranscurrido / 60);
        let segundos = tiempoTranscurrido % 60;
        document.getElementById('cronometro').textContent = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;

        // Guardar el estado del cronómetro en LocalStorage
        localStorage.setItem('cronometro', JSON.stringify({
            minutos: minutos,
            segundos: segundos
        }));
    }, 1000);
}

function reiniciarJuego() {
    clearInterval(cronometroInterval);
    document.getElementById('cronometro').textContent = '00:00';

    let boxes = document.querySelectorAll('.box');
    boxes.forEach(box => {
        box.style.backgroundImage = 'none';
        box.style.pointerEvents = 'auto';
    });

    barajarImagenes();

    // Limpiar LocalStorage al reiniciar el juego
    localStorage.removeItem('juegoEstado');
    localStorage.removeItem('cronometro');
}

function barajarImagenes() {
    let boxes = document.querySelectorAll('.box');
    let imagenes = [];

    for (let i = 1; i <= 15; i++) {
        imagenes.push(`url("./img8/img${i}.png")`);
        imagenes.push(`url("./img8/img${i}.png")`);
    }

    imagenes.sort(() => Math.random() - 0.5);

    boxes.forEach((box, index) => {
        box.setAttribute('data-image-url', imagenes[index]);
    });
}

function guardarEstadoJuego() {
    let estadoJuego = [];

    let boxes = document.querySelectorAll('.box');
    boxes.forEach(box => {
        if (box.style.pointerEvents === 'none') {
            estadoJuego.push({
                id: box.id,
                backgroundImage: box.style.backgroundImage
            });
        }
    });

    localStorage.setItem('juegoEstado', JSON.stringify(estadoJuego));
}

function cargarEstadoJuego() {
    let estadoGuardado = localStorage.getItem('juegoEstado');

    if (estadoGuardado) {
        let estadoJuego = JSON.parse(estadoGuardado);

        estadoJuego.forEach(item => {
            let box = document.getElementById(item.id);
            box.style.backgroundImage = item.backgroundImage;
            box.style.backgroundSize = 'cover';
            box.style.backgroundPosition = 'center';
            box.style.pointerEvents = 'none';
        });
    }

    // Cargar estado del cronómetro si existe
    let cronometroGuardado = localStorage.getItem('cronometro');

    if (cronometroGuardado) {
        let tiempo = JSON.parse(cronometroGuardado);
        document.getElementById('cronometro').textContent = `${tiempo.minutos.toString().padStart(2, '0')}:${tiempo.segundos.toString().padStart(2, '0')}`;
    }
}

window.onload = initGame;
