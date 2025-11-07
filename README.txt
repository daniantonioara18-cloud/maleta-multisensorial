# Portal Educativo 3°–6° Básico

Sitio web estático con cursos (3° a 6°) y áreas (Lectura, Escritura, Cálculo) con **2 actividades** por área.
Al finalizar cada actividad, se muestra una **encuesta de satisfacción con estrellas** (1–5) y el progreso se guarda en `localStorage`.

## Cómo usar
1. Descarga y descomprime el ZIP.
2. Abre `index.html` en tu navegador (doble clic).
3. Navega por curso → área → actividad.
4. Tras revisar la respuesta, aparecerá la encuesta de estrellas. La valoración se guarda en el dispositivo.

## Estructura
- `index.html` — contenedor principal (SPA sencilla).
- `styles.css` — estilos modernos y accesibles.
- `app.js` — lógica de navegación, actividades, validación, progreso y encuesta.

## Personalización rápida
- Cambia preguntas y respuestas editando el objeto `ACTIVITIES` en `app.js`.
- Para agregar más actividades, añade más objetos dentro del arreglo de cada área.
- El progreso/valoraciones se guardan por **curso/área/actividad** en `localStorage` bajo la clave `educa_site_progress_v1`.

## Notas
- No requiere servidor. Funciona localmente.
- Cumple con accesibilidad básica (roles ARIA en estrellas) y diseño responsive.
