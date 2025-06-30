// ===== Service Worker para Notas de la Princesa =====
// Versión: 1.0.0

const CACHE_NAME = 'notas-princesa-v1.0.0';
const STATIC_CACHE = 'qnota-static-v1.0.0';
const DYNAMIC_CACHE = 'qnota-dynamic-v1.0.0';

// Archivos a cachear estáticamente
const STATIC_FILES = [
    '/',
    '/index.html',
    '/style.css',
    '/main.js',
    '/manifest.json',
    'https://fonts.googleapis.com/css2?family=Pacifico&family=Poppins:wght@300;400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-solid-900.woff2'
];

// Archivos de iconos (si existen)
const ICON_FILES = [
    '/assets/icon-72.png',
    '/assets/icon-96.png',
    '/assets/icon-128.png',
    '/assets/icon-144.png',
    '/assets/icon-152.png',
    '/assets/icon-192.png',
    '/assets/icon-384.png',
    '/assets/icon-512.png'
];

// ===== INSTALACIÓN =====
self.addEventListener('install', (event) => {
    console.log('✨ Service Worker instalando...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('📦 Cacheando archivos estáticos...');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('✅ Archivos estáticos cacheados');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('❌ Error cacheando archivos:', error);
            })
    );
});

// ===== ACTIVACIÓN =====
self.addEventListener('activate', (event) => {
    console.log('🚀 Service Worker activando...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        // Eliminar caches antiguos
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('🗑️ Eliminando cache antiguo:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ Service Worker activado');
                return self.clients.claim();
            })
    );
});

// ===== INTERCEPTAR PETICIONES =====
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Estrategia: Cache First para archivos estáticos
    if (isStaticFile(request)) {
        event.respondWith(handleStaticFiles(request));
    }
    // Estrategia: Network First para API calls
    else if (isApiCall(request)) {
        event.respondWith(handleApiCalls(request));
    }
    // Estrategia: Stale While Revalidate para otros recursos
    else {
        event.respondWith(handleOtherRequests(request));
    }
});

// ===== FUNCIONES AUXILIARES =====

// Verificar si es un archivo estático
function isStaticFile(request) {
    const url = new URL(request.url);
    const staticExtensions = ['.html', '.css', '.js', '.json', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.woff', '.woff2', '.ttf'];
    const isStatic = staticExtensions.some(ext => url.pathname.endsWith(ext));
    const isLocal = url.origin === self.location.origin;
    const isFont = url.href.includes('fonts.googleapis.com') || url.href.includes('cdnjs.cloudflare.com');
    
    return isStatic || isLocal || isFont;
}

// Verificar si es una llamada a API
function isApiCall(request) {
    const url = new URL(request.url);
    return url.pathname.startsWith('/api/') || url.hostname.includes('api.');
}

// Manejar archivos estáticos (Cache First)
function handleStaticFiles(request) {
    return caches.match(request)
        .then((response) => {
            if (response) {
                console.log('📦 Sirviendo desde cache:', request.url);
                return response;
            }
            
            console.log('🌐 Descargando archivo:', request.url);
            return fetch(request)
                .then((response) => {
                    // Solo cachear respuestas exitosas
                    if (response.status === 200) {
                        const responseClone = response.clone();
                        caches.open(STATIC_CACHE)
                            .then((cache) => {
                                cache.put(request, responseClone);
                            });
                    }
                    return response;
                })
                .catch(() => {
                    // Fallback para archivos HTML
                    if (request.destination === 'document') {
                        return caches.match('/index.html');
                    }
                });
        });
}

// Manejar llamadas a API (Network First)
function handleApiCalls(request) {
    return fetch(request)
        .then((response) => {
            // Cachear respuestas exitosas
            if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(DYNAMIC_CACHE)
                    .then((cache) => {
                        cache.put(request, responseClone);
                    });
            }
            return response;
        })
        .catch(() => {
            // Fallback a cache si no hay conexión
            return caches.match(request);
        });
}

// Manejar otros requests (Stale While Revalidate)
function handleOtherRequests(request) {
    return caches.match(request)
        .then((cachedResponse) => {
            const fetchPromise = fetch(request)
                .then((response) => {
                    // Cachear respuestas exitosas
                    if (response.status === 200) {
                        const responseClone = response.clone();
                        caches.open(DYNAMIC_CACHE)
                            .then((cache) => {
                                cache.put(request, responseClone);
                            });
                    }
                    return response;
                })
                .catch(() => {
                    // Si falla la red, devolver cached response
                    return cachedResponse;
                });

            // Devolver cached response inmediatamente si existe
            return cachedResponse || fetchPromise;
        });
}

// ===== MANEJO DE MENSAJES =====
self.addEventListener('message', (event) => {
    const { type, data } = event.data;

    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
            
        case 'GET_VERSION':
            event.ports[0].postMessage({ version: CACHE_NAME });
            break;
            
        case 'CLEAR_CACHE':
            clearAllCaches()
                .then(() => {
                    event.ports[0].postMessage({ success: true });
                })
                .catch((error) => {
                    event.ports[0].postMessage({ success: false, error: error.message });
                });
            break;
    }
});

// Limpiar todos los caches
function clearAllCaches() {
    return caches.keys()
        .then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    return caches.delete(cacheName);
                })
            );
        });
}

// ===== MANEJO DE PUSH NOTIFICACIONES =====
self.addEventListener('push', (event) => {
    console.log('📱 Push notification recibida');
    
    const options = {
        body: event.data ? event.data.text() : '¡Nueva actualización disponible!',
        icon: '/assets/icon-192.png',
        badge: '/assets/icon-72.png',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Abrir App',
                icon: '/assets/icon-96.png'
            },
            {
                action: 'close',
                title: 'Cerrar',
                icon: '/assets/icon-96.png'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('Notas de la Princesa', options)
    );
});

// ===== MANEJO DE CLICKS EN NOTIFICACIONES =====
self.addEventListener('notificationclick', (event) => {
    console.log('👆 Notificación clickeada');
    
    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// ===== MANEJO DE SINCRONIZACIÓN EN BACKGROUND =====
self.addEventListener('sync', (event) => {
    console.log('🔄 Sincronización en background:', event.tag);
    
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

function doBackgroundSync() {
    // Aquí se pueden realizar tareas en background
    // como sincronizar datos, enviar analytics, etc.
    console.log('🔄 Ejecutando sincronización en background...');
    return Promise.resolve();
}

// ===== MANEJO DE ERRORES =====
self.addEventListener('error', (event) => {
    console.error('❌ Error en Service Worker:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
    console.error('❌ Promise rechazada en Service Worker:', event.reason);
});

console.log('✨ Service Worker cargado para Notas de la Princesa! 💖'); 