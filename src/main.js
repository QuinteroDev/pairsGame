import '../saas/main.scss';
//8 Juguemos a adivinar las parejas. Debes distribuir en la página una cuadrícula de 6 x 5 cajas. De las 30 cajas habrá 15 distintas. 
//Cada par de cajas será de un color distinto. Inicialmente todas las cajas aparecerán negras. Cuando el usuario pinche sobre una caja, 
//se revelará su auténtico color. En ese momento debes arrastrar la caja al lugar donde creas que se encuentra su pareja. 
//Si aciertas, ambas cajas permanecerán boca arriba y ya no se podrá interactuar con ellas. Si fallas, las dos cajas volverán a su estado inicial. 
//El programa debe detectar cuándo están todas las cajas emparejadas y cuánto tiempo has tardado en resolverlo.

let cajaSeleccionada = null; // Para almacenar la caja actualmente seleccionada
let segundaCajaSeleccionada = null; // Para almacenar la segunda caja seleccionada
let bloqueandoCajas = false; // Para evitar múltiples selecciones simultáneas
let cronometroInterval;
let tiempoInicial;

function initGame() {
    let boxes = document.querySelectorAll('.box');
    boxes.forEach(box => {
        box.addEventListener('click', revealImage);
        box.style.backgroundImage = 'none';
        box.style.pointerEvents = 'auto';
    });

    // Botón de iniciar cronómetro
    let botonCronometro = document.getElementById("iniciarCronometro");
    botonCronometro.addEventListener('click', iniciarCronometro);

    // Botón de reiniciar juego
    let botonReiniciar = document.getElementById("reiniciarJuego");
    botonReiniciar.addEventListener('click', reiniciarJuego);

    // Resetear cronómetro
    document.getElementById('cronometro').textContent = '00:00';
    clearInterval(cronometroInterval);

    barajarImagenes(); // Barajar imágenes al inicio del juego
}

function revealImage(event) {
    if (bloqueandoCajas) return; // Si las cajas están bloqueadas, no hacer nada

    let box = event.target;

    // Si la caja ya está revelada, no hacer nada
    if (box.style.pointerEvents === 'none') {
        return;
    }

    // Si no hay ninguna caja seleccionada, seleccionar esta caja
    if (!cajaSeleccionada) {
        cajaSeleccionada = box;
        mostrarImagen(cajaSeleccionada);
    } else if (!segundaCajaSeleccionada) {
        segundaCajaSeleccionada = box;
        mostrarImagen(segundaCajaSeleccionada);

        // Comparar las dos imágenes después de un breve retraso
        setTimeout(compararImagenes, 1000);
    }
}

function mostrarImagen(box) {
    let rutaCompletaImagen = box.getAttribute('data-image-url');
    box.style.backgroundImage = rutaCompletaImagen;
    box.style.backgroundSize = 'cover';
    box.style.backgroundPosition = 'center';
    console.log('Imagen revelada:', rutaCompletaImagen);
}

function compararImagenes() {
    if (!cajaSeleccionada || !segundaCajaSeleccionada) return;

    let imagenSeleccionada = cajaSeleccionada.getAttribute('data-image-url');
    let imagenActual = segundaCajaSeleccionada.getAttribute('data-image-url');

    if (imagenSeleccionada === imagenActual) {
        // Si las imágenes son iguales, desactivar ambas cajas
        cajaSeleccionada.style.pointerEvents = 'none';
        segundaCajaSeleccionada.style.pointerEvents = 'none';
    } else {
        // Si las imágenes son diferentes, ocultar ambas cajas
        cajaSeleccionada.style.backgroundImage = 'none';
        segundaCajaSeleccionada.style.backgroundImage = 'none';
    }

    // Resetear las variables
    cajaSeleccionada = null;
    segundaCajaSeleccionada = null;
    bloqueandoCajas = false;

    // Verificar si el juego ha terminado
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
        alert('Congratulations! You have found all pairs!.');
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
    }, 1000);
}

function reiniciarJuego() {
    clearInterval(cronometroInterval); // Detener el cronómetro
    document.getElementById('cronometro').textContent = '00:00'; // Resetear el display del cronómetro
    
    let boxes = document.querySelectorAll('.box');
    boxes.forEach(box => {
        box.style.backgroundImage = 'none'; // Ocultar la imagen
        box.style.pointerEvents = 'auto'; // Reestablecer la interactividad de las cajas
    });

    barajarImagenes(); // Barajar las imágenes para la nueva partida
}

function barajarImagenes() {
    let boxes = document.querySelectorAll('.box');
    let imagenes = [];

    // Crear un array de URLs de imágenes
    for (let i = 1; i <= 15; i++) {
        imagenes.push(`url("./img8/img${i}.png")`);
        imagenes.push(`url("./img8/img${i}.png")`);
    }

    // Barajar el array de imágenes
    imagenes.sort(() => Math.random() - 0.5);

    // Asignar las imágenes barajadas a las cajas
    boxes.forEach((box, index) => {
        box.setAttribute('data-image-url', imagenes[index]); // Actualizar con la nueva imagen barajada
    });
}

window.onload = initGame;