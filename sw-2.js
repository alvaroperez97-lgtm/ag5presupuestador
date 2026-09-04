/* Service worker del Presupuestador AG5.
   Estrategia RED PRIMERO con caché de respaldo:
   - Si hay red, se sirve siempre la respuesta fresca de Netlify y se actualiza la caché.
   - Si no hay red, se sirve la última copia guardada (la app abre sin conexión).
   Nunca se sirve una versión vieja teniendo red disponible. */

const CACHE = 'ag5-presupuestador-v1';
const PRECACHE = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

// Instalación: guardamos el núcleo de la app y activamos sin esperar
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

// Activación: borramos cachés de versiones anteriores y tomamos el control de las pestañas abiertas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Peticiones: red primero; si falla, caché
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const mismoOrigen = url.origin === self.location.origin;
  // Recursos externos (Google Fonts, logo de la web corporativa): pasan directos a la red.
  // Sin conexión fallan de forma controlada: la app usa fuente de sistema y oculta el logo (onerror).
  if (!mismoOrigen) return;

  event.respondWith(
    fetch(req, { cache: 'no-store' })
      .then((res) => {
        if (res && res.ok) {
          const copia = res.clone();
          caches.open(CACHE).then((cache) => cache.put(req, copia));
        }
        return res;
      })
      .catch(async () => {
        const cacheada = await caches.match(req, { ignoreSearch: true });
        if (cacheada) return cacheada;
        // Navegación sin conexión y sin copia exacta: devolvemos la app
        if (req.mode === 'navigate') return caches.match('./index.html');
        return new Response('', { status: 503, statusText: 'Sin conexión' });
      })
  );
});
