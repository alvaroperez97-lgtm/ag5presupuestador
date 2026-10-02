# CLAUDE.md

Presupuestador de cocinas de Almacén Grupo 5 (AG5). App HTML de un solo archivo (`index.html`) con service worker (`sw.js`), desplegada automáticamente en Netlify al hacer push a `main`.

## Reglas de entorno

1. **Validación con Node.** Node y `gh` están instalados en este Mac. Antes de cada commit, extrae el JavaScript de `index.html` y valídalo con `node --check` (y `node --check sw.js` si cambia). No hagas commit si falla.
2. **Push con git, no con el conector.** Las credenciales de GitHub están configuradas con `gh`. Haz commit y push directamente con `git`; no uses el conector de GitHub para escribir en el repo (solo, como mucho, para leer).
3. **El usuario no programa.** Explica cada cambio en lenguaje claro, sin jerga técnica: qué cambia en la app y cómo se nota al usarla. Pide confirmación explícita antes de hacer push a `main`, porque eso publica la app.
4. **Subir APP_BUILD en cambios funcionales.** Cualquier cambio que afecte al funcionamiento de la app debe incrementar `const APP_BUILD = 'AAAA-MM-DD.N'` en `index.html` (fecha del día y contador `N`), para que la app instalada detecte la nueva versión y muestre el aviso de actualización.
