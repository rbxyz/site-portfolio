// Service Worker para cache de imagens e otimização de performance
const CACHE_NAME = 'portfolio-cache-v1';
const IMAGE_CACHE_NAME = 'portfolio-images-v1';

// URLs para cache estático
const STATIC_CACHE_URLS = [
    '/',
    '/sobre',
    '/contato',
    '/pages/projects',
    '/logo.png',
    '/Foto_Perfil.jpg'
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching static files');
                return cache.addAll(STATIC_CACHE_URLS);
            })
            .then(() => {
                // Forçar ativação imediata
                return self.skipWaiting();
            })
    );
});

// Ativar Service Worker
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');

    event.waitUntil(
        // Limpar caches antigos
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME && cacheName !== IMAGE_CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            // Assumir controle de todas as páginas
            return self.clients.claim();
        })
    );
});

// Interceptar requisições
self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);

    // Apenas interceptar requests GET
    if (request.method !== 'GET') {
        return;
    }

    // Estratégia para imagens (Cache First)
    if (request.destination === 'image' ||
        url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/i) ||
        url.hostname === 'api.screenshotone.com') {

        event.respondWith(
            caches.open(IMAGE_CACHE_NAME)
                .then((cache) => {
                    return cache.match(request)
                        .then((cachedResponse) => {
                            if (cachedResponse) {
                                console.log('Image from cache:', request.url);
                                return cachedResponse;
                            }

                            // Se não estiver no cache, buscar da rede
                            return fetch(request)
                                .then((networkResponse) => {
                                    // Verificar se a resposta é válida
                                    if (networkResponse && networkResponse.status === 200) {
                                        console.log('Caching image:', request.url);
                                        // Clonar a resposta antes de cachear
                                        const responseToCache = networkResponse.clone();
                                        cache.put(request, responseToCache);
                                    }
                                    return networkResponse;
                                })
                                .catch((error) => {
                                    console.error('Failed to fetch image:', request.url, error);
                                    // Retornar uma imagem placeholder se disponível
                                    return cache.match('/placeholder-image.png') ||
                                        new Response('', { status: 404, statusText: 'Image not found' });
                                });
                        });
                })
        );
        return;
    }

    // Estratégia para páginas e recursos estáticos (Network First com fallback para cache)
    if (url.origin === self.location.origin) {
        event.respondWith(
            fetch(request)
                .then((networkResponse) => {
                    // Se a rede funcionar, cachear e retornar
                    if (networkResponse && networkResponse.status === 200) {
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(request, responseToCache);
                            });
                    }
                    return networkResponse;
                })
                .catch(() => {
                    // Se a rede falhar, tentar o cache
                    return caches.match(request)
                        .then((cachedResponse) => {
                            if (cachedResponse) {
                                console.log('Page from cache:', request.url);
                                return cachedResponse;
                            }
                            // Se não estiver no cache, retornar página offline
                            return caches.match('/') ||
                                new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
                        });
                })
        );
    }
});

// Gerenciar cache de imagens - limpar imagens antigas
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'CLEAN_IMAGE_CACHE') {
        event.waitUntil(
            caches.open(IMAGE_CACHE_NAME)
                .then((cache) => {
                    return cache.keys()
                        .then((keys) => {
                            // Manter apenas os últimos 50 itens no cache de imagens
                            if (keys.length > 50) {
                                const keysToDelete = keys.slice(0, keys.length - 50);
                                return Promise.all(
                                    keysToDelete.map((key) => cache.delete(key))
                                );
                            }
                        });
                })
        );
    }

    if (event.data && event.data.type === 'PREFETCH_IMAGES') {
        const urls = event.data.urls || [];
        event.waitUntil(
            caches.open(IMAGE_CACHE_NAME)
                .then((cache) => {
                    return Promise.all(
                        urls.map((url) => {
                            return fetch(url)
                                .then((response) => {
                                    if (response && response.status === 200) {
                                        return cache.put(url, response);
                                    }
                                })
                                .catch((error) => {
                                    console.warn('Failed to prefetch image:', url, error);
                                });
                        })
                    );
                })
        );
    }
});

// Limpar cache automaticamente a cada 24 horas
self.addEventListener('sync', (event) => {
    if (event.tag === 'cache-cleanup') {
        event.waitUntil(
            Promise.all([
                // Limpar cache de imagens antigas
                caches.open(IMAGE_CACHE_NAME)
                    .then((cache) => {
                        return cache.keys()
                            .then((keys) => {
                                const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
                                return Promise.all(
                                    keys.map((request) => {
                                        return cache.match(request)
                                            .then((response) => {
                                                if (response) {
                                                    const dateHeader = response.headers.get('date');
                                                    const responseDate = dateHeader ? new Date(dateHeader).getTime() : 0;
                                                    if (responseDate < oneDayAgo) {
                                                        return cache.delete(request);
                                                    }
                                                }
                                            });
                                    })
                                );
                            });
                    })
            ])
        );
    }
});
