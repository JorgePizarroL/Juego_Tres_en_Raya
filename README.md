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
2. Abrir un servidor estático recomendado por el uso de módulos ES
   - Con VSCode y la extensión Live Server
3. Abrir en el navegador mediante el Live Server
4. Ingresar nombres de Jugador 1 y Jugador 2 y seleccionar quién empieza.
5. Jugar usando mouse

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

## Lista de comprobación de estándares – Tres en Raya (resumida)
## HTML5

 - Semántico: <header>, <main>, <section>, <form>

 - Idioma (lang="es"), charset y meta viewport presentes

 - Tablas con <thead> y <tbody>

## Accesibilidad

 - Navegación por teclado y foco visible.

 - Labels correctamente asociados a inputs.

 - aria-live usado para turno de jugadores.

 - Contraste de colores adecuado.

## CSS3

 - Diseño responsivo (media queries).

 - Uso de estados: :focus-visible, :disabled.

 - Flexbox y Grid para layout.

## JavaScript

 - Módulos ES (type="module").

 - Alternancia de turnos y bloqueo de celdas.

 - Detección de victoria/empate, contador de movimientos, cronómetro.

 - Revancha y Nuevo juego.

 - Persistencia en localStorage y exportación JSON.