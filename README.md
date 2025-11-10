# Tres en Raya

## Descripción del juego
Tres en Raya es un juego clásico para dos jugadores.  
Los jugadores se registran con su nombre, eligen quién empieza y juegan en un tablero interactivo de 3x3.  
El objetivo es alinear tres símbolos iguales en horizontal, vertical o diagonal.  

El juego incluye:
- Mensaje de turno activo.
- Detección automática de ganador o empate.
- Historial de partidas con información de ganador, tiempo, movimientos y fecha.
- Posibilidad de exportar el historial en JSON y limpiar el historial guardado.

---

## Instrucciones de ejecución local

1. Clonar o descargar el proyecto.
2. Abrir una terminal en la carpeta raíz del proyecto (`/tresenraya`).
3. Servir el proyecto con un servidor estático

## Decisiones técnicas 
Almacenamiento

Se utiliza localStorage para persistir el historial de partidas, porque:

Es fácil de implementar y suficiente para proyectos pequeños.

Permite guardar y recuperar datos entre sesiones.

## Estructura de datos

Cada partida se almacena como un objeto:

- jugador1: Nombre del jugador 1
- jugador2: Nombre del jugador 2
- ganador: Nombre del ganador o Empate
- duracion: MM:SS
- movimientos: 
- fecha": "2025-11-09T18:23:45.000Z"
