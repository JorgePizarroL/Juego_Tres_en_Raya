import { guardarPartida, obtenerPartidas, limpiarHistorial, exportarJSON } from './storage.js';


const form = document.getElementById('form-jugadores');
const tablero = document.getElementById('tablero');
const turnoDiv = document.getElementById('turno');
const btnRevancha = document.getElementById('boton_revancha');
const btnNuevo = document.getElementById('boton_nuevo');
const btnExportar = document.getElementById('boton_exportar');
const btnLimpiar = document.getElementById('boton_limpiar');
const tablaHistorial = document.querySelector('#tabla_historial tbody');

let jugador1 = '';
let jugador2 = '';
let jugadorActual = '';
let tableroEstado = [];
let movimientos = 0;
let tiempoInicio = 0;
let jugadoresRegistrados = false;

// Inicializa el tablero siempre visible pero deshabilitado
dibujarTablero();
turnoDiv.textContent = 'Registra los jugadores para empezar';
btnRevancha.disabled = true;
btnNuevo.disabled = true;

// Evento: registro de jugadores
form.addEventListener('submit', (e) => {
    e.preventDefault();
    jugador1 = document.getElementById('j1').value.trim();
    jugador2 = document.getElementById('j2').value.trim();
    jugadorActual = document.getElementById('empezar').value;
    if (!jugador1 || !jugador2) return;
    jugadoresRegistrados = true;
    habilitarTablero();
    iniciarJuego();
});

// Habilita el tablero y botones
function habilitarTablero() {
    tablero.querySelectorAll('.celda').forEach(c => c.disabled = false);
    btnRevancha.disabled = false;
    btnNuevo.disabled = false;
    actualizarTurno();
}

// Dibuja las 9 celdas del tablero
function dibujarTablero() {
    tablero.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const celda = document.createElement('button');
        celda.classList.add('celda');
        celda.dataset.indice = i;
        celda.textContent = '';
        celda.disabled = true; // deshabilitado hasta registro
        celda.addEventListener('click', () => {
            if (jugadoresRegistrados) jugar(i);
        });
        celda.addEventListener('keydown', (e) => {
            if (jugadoresRegistrados && (e.key === 'Enter' || e.key === ' ')) jugar(i);
        });
        tablero.appendChild(celda);
    }
}

// Inicia la partida
function iniciarJuego() {
    tableroEstado = Array(9).fill(null);
    movimientos = 0;
    tiempoInicio = Date.now();
    actualizarVista();
    actualizarTurno();
}

// Maneja el turno y movimiento
function jugar(indice) {
    if (tableroEstado[indice]) return;
    tableroEstado[indice] = jugadorActual;
    movimientos++;
    actualizarVista();

    if (verificarGanador()) {
        terminarPartida(`${obtenerNombre(jugadorActual)} gana`);
    } else if (movimientos === 9) {
        terminarPartida('Empate');
    } else {
        jugadorActual = jugadorActual === 'X' ? 'O' : 'X';
        actualizarTurno();
    }
}

// Actualiza la vista del tablero
function actualizarVista() {
    tablero.querySelectorAll('.celda').forEach((c, i) => {
        c.textContent = tableroEstado[i] || '';
        c.disabled = !!tableroEstado[i] || !jugadoresRegistrados;
    });
}

// Actualiza el mensaje de turno
function actualizarTurno() {
    turnoDiv.textContent = jugadoresRegistrados 
        ? `Juega: ${obtenerNombre(jugadorActual)} (${jugadorActual})`
        : 'Registra los jugadores para empezar';
}

// Verifica ganador
function verificarGanador() {
    const lineas = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];
    return lineas.some(([a,b,c]) =>
        tableroEstado[a] && tableroEstado[a] === tableroEstado[b] && tableroEstado[a] === tableroEstado[c]
    );
}

// Obtiene el nombre según X/O
function obtenerNombre(simbolo) {
    return simbolo === 'X' ? jugador1 : jugador2;
}

// Termina partida, guarda historial
function terminarPartida(mensaje) {
    turnoDiv.textContent = mensaje;
    tablero.querySelectorAll('.celda').forEach(c => c.disabled = true);

    const duracion = Math.floor((Date.now() - tiempoInicio) / 1000);
    const registro = {
      jugador1,
      jugador2,
      ganador: mensaje.includes('gana') ? obtenerNombre(jugadorActual) : 'Empate',
      duracion: `${Math.floor(duracion / 60)}:${String(duracion % 60).padStart(2, '0')}`,
      movimientos,
      fecha: new Date().toISOString()
    } ;

    guardarPartida(registro);
    mostrarHistorial();
}

// Botones de control
btnRevancha.addEventListener('click', () => {
    if (!jugadoresRegistrados) return;
    iniciarJuego();
});

btnNuevo.addEventListener('click', () => location.reload());
btnExportar.addEventListener('click', exportarJSON);
btnLimpiar.addEventListener('click', () => {
    if (confirm('¿Seguro que quieres borrar el historial?')) {
        limpiarHistorial();
        mostrarHistorial();
    }
});

// Historial
function mostrarHistorial(filtro = {}) {
    let datos = obtenerPartidas();
    if (filtro.ganador && filtro.ganador !== 'todos') {
        datos = datos.filter(p => p.ganador === filtro.ganador);
    }
    if (filtro.inicio) datos = datos.filter(p => p.fecha >= filtro.inicio);
    if (filtro.fin) datos = datos.filter(p => p.fecha <= filtro.fin);

    tablaHistorial.innerHTML = '';
    datos.forEach(p => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${p.fecha}</td>
            <td>${p.jugador1}</td>
            <td>${p.jugador2}</td>
            <td>${p.ganador}</td>
            <td>${p.duracion}</td>
            <td>${p.movimientos}</td>
        `;
        tablaHistorial.appendChild(fila);
    });
}

// Filtrado
document.getElementById('btn-filtrar').addEventListener('click', () => {
    const ganador = document.getElementById('filtro-ganador').value;
    const inicio = document.getElementById('filtro-inicio').value;
    const fin = document.getElementById('filtro-fin').value;
    mostrarHistorial({ ganador, inicio, fin });
});

// Mostrar historial al cargar
mostrarHistorial();

