const CLAVE = 'ppw-tresenraya:historial';

export function guardarPartida(datos) {
    const partidas = JSON.parse(localStorage.getItem(CLAVE)) || [];
    partidas.push(datos);
    localStorage.setItem(CLAVE, JSON.stringify(partidas));
}

export function obtenerPartidas() {
    return JSON.parse(localStorage.getItem(CLAVE)) || [];
}

export function limpiarHistorial() {
    localStorage.removeItem(CLAVE);
}

export function exportarJSON() {
    const data = obtenerPartidas();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'historial_tresenraya.json';
    a.click();
    URL.revokeObjectURL(url);
}


