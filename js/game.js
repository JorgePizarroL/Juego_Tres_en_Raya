import { guardarPartida, obtenerPartidas, limpiarHistorial, exportarJSON } from './storage.js';

const form = document.getElementById('form-jugadores');
const tablero = document.getElementById('tablero');
const turnoDiv = document.getElementById('turno');
const seccionInicio = document.getElementById('inicio');
const seccionJuego = document.getElementById('juego');
const tablaHistorial = document.querySelector('#tabla_historial tbody');

let jugador1, jugador2, jugadorActual;
let tableroEstado = [];
let movimientos = 0;
let tiempoInicio;

// --- INICIO DEL JUEGO ---
form.addEventListener('submit', (e) => {
  e.preventDefault();
  jugador1 = document.getElementById('j1').value.trim();
  jugador2 = document.getElementById('j2').value.trim();
  jugadorActual = document.getElementById('empieza').value;
  iniciarJuego();
});

function iniciarJuego() {
  tableroEstado = Array(9).fill(null);
  movimientos = 0;
  tiempoInicio = Date.now();
  seccionInicio.hidden = true;
  seccionJuego.hidden = false;
  dibujarTablero();
  actualizarTurno();
}

function dibujarTablero() {
  tablero.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const celda = document.createElement('button');
    celda.classList.add('celda');
    celda.dataset.indice = i;
    celda.addEventListener('click', () => jugar(i));
    celda.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') jugar(i);
    });
    tablero.appendChild(celda);
  }
}

function jugar(indice) {
  if (tableroEstado[indice]) return;
  tableroEstado[indice] = jugadorActual;
  movimientos++;
  actualizarVista();

  if (verificarGanador()) {
    terminarPartida(`${obtenerNombre(jugadorActual)} gana 🎉`);
  } else if (movimientos === 9) {
    terminarPartida('Empate 😐');
  } else {
    jugadorActual = jugadorActual === 'X' ? 'O' : 'X';
    actualizarTurno();
  }
}

function actualizarVista() {
  tablero.querySelectorAll('.celda').forEach((c, i) => {
    c.textContent = tableroEstado[i] || '';
    c.disabled = !!tableroEstado[i];
  });
}

function actualizarTurno() {
  turnoDiv.textContent = `Juega: ${obtenerNombre(jugadorActual)} (${jugadorActual})`;
}

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

function obtenerNombre(simbolo) {
  return simbolo === 'X' ? jugador1 : jugador2;
}

function terminarPartida(mensaje) {
  turnoDiv.textContent = mensaje;
  tablero.querySelectorAll('.celda').forEach(c => c.disabled = true);

  const duracion = Math.floor((Date.now() - tiempoInicio) / 1000);
  const registro = {
    jugador1,
    jugador2,
    ganador: mensaje.includes('gana') ? jugadorActual : 'Empate',
    duracion: `${Math.floor(duracion / 60)}:${String(duracion % 60).padStart(2, '0')}`,
    movimientos,
    fecha: new Date().toISOString()
  };
  guardarPartida(registro);
  mostrarHistorial();
}

// --- BOTONES ---
document.getElementById('btn-revancha').addEventListener('click', iniciarJuego);
document.getElementById('btn-nuevo').addEventListener('click', () => location.reload());
document.getElementById('btn-filtrar').addEventListener('click', aplicarFiltros);

function mostrarHistorial(filtro = {}) {
  const datos = obtenerPartidas();
  let lista = datos;

  if (filtro.ganador && filtro.ganador !== 'todos') {
    lista = lista.filter(p => p.ganador === filtro.ganador);
  }
  if (filtro.inicio) lista = lista.filter(p => p.fecha >= filtro.inicio);
  if (filtro.fin) lista = lista.filter(p => p.fecha <= filtro.fin);

  tablaHistorial.innerHTML = '';
  lista.forEach(p => {
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

function aplicarFiltros() {
  const ganador = document.getElementById('filtro-ganador').value;
  const inicio = document.getElementById('filtro-inicio').value;
  const fin = document.getElementById('filtro-fin').value;
  mostrarHistorial({ ganador, inicio, fin });
}

mostrarHistorial();
