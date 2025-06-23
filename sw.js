// /sw.js

const CACHE_VERSION = 'v2025-5';
const CACHE_NAME = `elostaz-cache-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `elostaz-dynamic-${CACHE_VERSION}`;

// Define BASE_PATH as a constant string based on the environment.
const isGitHubPages = self.location.hostname === 'www-e.github.io';
const BASE_PATH = isGitHubPages ? '/Elostaz' : '';

// List of assets to cache during installation.
const ASSETS = [
    `${BASE_PATH}/`,
    `${BASE_PATH}/index.html`,
    `${BASE_PATH}/manifest.json`,
    `${BASE_PATH}/sw.js`,
    `${BASE_PATH}/pages/registration.html`,
    `${BASE_PATH}/pages/statistics.html`,
    `${BASE_PATH}/pages/about.html`,
    `${BASE_PATH}/pages/schedule.html`,
    `${BASE_PATH}/pages/grades/grade1.html`,
    `${BASE_PATH}/pages/grades/grade2.html`,
    `${BASE_PATH}/pages/grades/grade3.html`,
    `${BASE_PATH}/pages/admin.html`,
    `${BASE_PATH}/pages/profile.html`,
    `${BASE_PATH}/pages/signin.html`,
    `${BASE_PATH}/css/styles.css`,
    `${BASE_PATH}/css/mobile.css`,
    `${BASE_PATH}/css/about-styles.css`,
    `${BASE_PATH}/css/grade-styles.css`,
    `${BASE_PATH}/css/registration.css`,
    `${BASE_PATH}/css/navbar.css`,
    `${BASE_PATH}/css/tags.css`,
    `${BASE_PATH}/css/welcome-message.css`,
    `${BASE_PATH}/css/dropdown-fix.css`,
    `${BASE_PATH}/css/modal.css`,
    `${BASE_PATH}/css/admin.css`,
    `${BASE_PATH}/css/profile.css`,
    `${BASE_PATH}/css/auth.css`,
    `${BASE_PATH}/js/main.js`,
    `${BASE_PATH}/js/path-handler.js`,
    `${BASE_PATH}/js/registration.js`,
    `${BASE_PATH}/js/registration-service.js`,
    `${BASE_PATH}/js/statistics.js`,
    `${BASE_PATH}/js/statistics-service.js`,
    `${BASE_PATH}/js/form-validation.js`,
    `${BASE_PATH}/js/navbar.js`,
    `${BASE_PATH}/js/ActiveState.js`,
    `${BASE_PATH}/js/DOMloader.js`,
    `${BASE_PATH}/js/theme.js`,
    `${BASE_PATH}/js/secondTermValidator.js`,
    `${BASE_PATH}/js/supabase-client.js`,
    `${BASE_PATH}/js/ID_Flip.js`,
    `${BASE_PATH}/js/booking-form.js`,
    `${BASE_PATH}/js/contact-form.js`,
    `${BASE_PATH}/js/modal-handler.js`,
    `${BASE_PATH}/js/pwa-updater.js`,
    `${BASE_PATH}/js/mobile-drawer.js`,
    `${BASE_PATH}/js/admin/admin.js`,
    `${BASE_PATH}/js/profile/profile.js`,
    `${BASE_PATH}/js/auth/signin.js`,
    `${BASE_PATH}/js/components/success-modal.js`,
    `${BASE_PATH}/js/components/statistics-success-modal.js`,
    `${BASE_PATH}/js/components/duplicate-registration-modal.js`,
    `${BASE_PATH}/js/components/restricted-groups-modal.js`,
    `${BASE_PATH}/js/components/third-grade-modal.js`,
    `${BASE_PATH}/assets/icons/edu.ico`,
    `${BASE_PATH}/components/install-prompt/install-prompt.css`,
    `${BASE_PATH}/components/install-prompt/install-prompt.js`,
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.rtl.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
    'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
    'https://unpkg.com/aos@next/dist/aos.css',
    'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'
];

// Install event - cache initial assets
self.addEventListener('install', event => {
    console.log(`[Service Worker] Installing new version ${CACHE_VERSION}`);
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caching core assets...');
                return cache.addAll(ASSETS).catch(error => {
                    console.error('Failed to cache core assets:', error);
                });
            })
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log(`[Service Worker] Activating new version ${CACHE_VERSION}`);
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key.startsWith('elostaz-') && key !== CACHE_NAME && key !== DYNAMIC_CACHE)
                    .map(key => {
                        console.log('[Service Worker] Removing old cache:', key);
                        return caches.delete(key);
                    })
            );
        }).then(() => {
            return clients.claim();
        })
    );
});

// Fetch event - Network first, then cache
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then(response => {
                // If the request is successful, cache it and return it
                if (response.ok) {
                    const clonedResponse = response.clone();
                    caches.open(DYNAMIC_CACHE).then(cache => {
                        cache.put(event.request, clonedResponse);
                    });
                }
                return response;
            })
            .catch(() => {
                // If the network fails, try to get the response from the cache
                return caches.match(event.request)
                    .then(cachedResponse => {
                        if (cachedResponse) {
                            return cachedResponse;
                        }
                        // If the request is for an HTML page and it's not in cache, return the offline fallback page
                        if (event.request.headers.get('accept').includes('text/html')) {
                            return caches.match(`${BASE_PATH}/index.html`);
                        }
                        // For other assets, if not in cache, the request will fail (which is expected)
                        return new Response('Offline content not available.', {
                            status: 404,
                            statusText: 'Offline content not available.'
                        });
                    });
            })
    );
});

// Handle service worker updates
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});