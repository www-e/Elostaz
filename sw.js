const CACHE_VERSION = 'v3';
const CACHE_NAME = `elostaz-cache-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `elostaz-dynamic-${CACHE_VERSION}`;

// Detect if we're on GitHub Pages and set the base path accordingly
const isGitHubPages = self.location.hostname === 'www-e.github.io';
const BASE_PATH = isGitHubPages ? '/Elostaz' : '';

// Add BASE_PATH to all assets
const ASSETS = [
    `${BASE_PATH}/`,
    `${BASE_PATH}/index.html`,
    `${BASE_PATH}/manifest.json`,
    `${BASE_PATH}/sw.js`,
    `${BASE_PATH}/pages/registration.html`,
    `${BASE_PATH}/pages/about.html`,
    `${BASE_PATH}/pages/schedule.html`,
    `${BASE_PATH}/pages/profile.html`,
    `${BASE_PATH}/pages/admin.html`,
    `${BASE_PATH}/pages/settings.html`,
    `${BASE_PATH}/pages/grades/grade1.html`,
    `${BASE_PATH}/pages/grades/grade2.html`,
    `${BASE_PATH}/pages/grades/grade3.html`,
    `${BASE_PATH}/css/styles.css`,
    `${BASE_PATH}/css/mobile.css`,
    `${BASE_PATH}/css/about-styles.css`,
    `${BASE_PATH}/css/grade-styles.css`,
    `${BASE_PATH}/css/registration.css`,
    `${BASE_PATH}/css/navbar.css`,
    `${BASE_PATH}/js/main.js`,
    `${BASE_PATH}/js/path-handler.js`,
    `${BASE_PATH}/js/registration.js`,
    `${BASE_PATH}/js/form-validation.js`,
    `${BASE_PATH}/js/google-sheets.js`,
    `${BASE_PATH}/js/ID_Flip.js`,
    `${BASE_PATH}/js/navbar.js`,
    `${BASE_PATH}/js/Private_form.js`,
    `${BASE_PATH}/js/ActiveState.js`,
    `${BASE_PATH}/js/DOMloader.js`,
    `${BASE_PATH}/js/theme.js`,
    `${BASE_PATH}/js/database.js`,
    `${BASE_PATH}/js/firebase-config.js`,
    `${BASE_PATH}/js/firebase-database.js`,
    `${BASE_PATH}/js/database-adapter.js`,
    `${BASE_PATH}/js/data-migration.js`,
    `${BASE_PATH}/js/settings.js`,
    `${BASE_PATH}/js/profile-attendance.js`,
    `${BASE_PATH}/js/secondTermValidator.js`,
    `${BASE_PATH}/assets/icons/edu.ico`,
    `${BASE_PATH}/components/login-component.js`,
    `${BASE_PATH}/components/install-prompt/install-prompt.css`,
    `${BASE_PATH}/components/install-prompt/install-prompt.js`,
    // External resources
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.rtl.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
    'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
    'https://unpkg.com/aos@next/dist/aos.css',
    // Firebase CDN resources
    'https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js',
    'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js',
    'https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js'
];

// Install event - cache initial assets
self.addEventListener('install', event => {
    console.log(`[Service Worker] Installing new version ${CACHE_VERSION}`);
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caching assets...');
                return Promise.allSettled(
                    ASSETS.map(asset =>
                        cache.add(asset).catch(error => {
                            console.error(`Failed to cache asset ${asset}:`, error);
                            return Promise.resolve(); // Continue with other assets
                        })
                    )
                );
            })
    );
    // Force activation of the new service worker
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log(`[Service Worker] Activating new version ${CACHE_VERSION}`);
    event.waitUntil(
        Promise.all([
            // Delete old caches
            caches.keys().then(keys => {
                return Promise.all(
                    keys.filter(key => {
                        return key.startsWith('elostaz-') && ![CACHE_NAME, DYNAMIC_CACHE].includes(key);
                    }).map(key => {
                        console.log('[Service Worker] Removing old cache:', key);
                        return caches.delete(key);
                    })
                );
            }),
            // Take control of all clients immediately
            clients.claim().then(() => {
                // Notify all clients about the update
                clients.matchAll().then(clients => {
                    clients.forEach(client => {
                        client.postMessage({
                            type: 'CACHE_UPDATED',
                            version: CACHE_VERSION,
                            reloadRequired: true
                        });
                    });
                });
            })
        ])
    );
});

// Helper function to normalize URLs
function normalizeUrl(url) {
    const urlObj = new URL(url, location.href);
    if (isGitHubPages) {
        // Remove /Elostaz from the beginning of the path if it exists
        urlObj.pathname = urlObj.pathname.replace(/^\/Elostaz/, '');
    }
    return urlObj.toString();
}

// Helper function to determine if a request should be cached
function shouldCache(url) {
    const fileExtensions = ['.html', '.css', '.js', '.json', '.ico', '.png', '.jpg', '.jpeg', '.gif', '.svg'];
    return fileExtensions.some(ext => url.toLowerCase().endsWith(ext));
}

// Fetch event - network first with cache fallback
self.addEventListener('fetch', event => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // Skip Chrome extensions and other non-http(s) requests
    if (!event.request.url.startsWith('http')) return;

    const normalizedUrl = normalizeUrl(event.request.url);
    
    // Check if this is a navigation request (HTML page)
    const isNavigationRequest = event.request.mode === 'navigate';

    // Special handling for manifest.json and icons
    if (event.request.url.includes('manifest.json') || 
        event.request.url.includes('/assets/icons/')) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    const clonedResponse = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, clonedResponse);
                    });
                    return response;
                })
                .catch(() => caches.match(event.request))
        );
        return;
    }

    // For navigation requests (like back button), prioritize network and don't show loading indicator
    if (isNavigationRequest) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    // Cache successful responses
                    if (response.ok && shouldCache(normalizedUrl)) {
                        const clonedResponse = response.clone();
                        caches.open(DYNAMIC_CACHE).then(cache => {
                            cache.put(event.request, clonedResponse);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    // Fallback to cache if network fails
                    return caches.match(event.request)
                        .then(cachedResponse => {
                            if (cachedResponse) {
                                return cachedResponse;
                            }
                            // If no cached response, return the index page
                            return caches.match(`${BASE_PATH}/index.html`);
                        });
                })
        );
        return;
    }

    // For non-navigation requests, use the original strategy
    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Cache successful responses
                if (response.ok && shouldCache(normalizedUrl)) {
                    const clonedResponse = response.clone();
                    caches.open(DYNAMIC_CACHE).then(cache => {
                        cache.put(event.request, clonedResponse);
                    });
                }
                return response;
            })
            .catch(() => {
                // Fallback to cache if network fails
                return caches.match(event.request)
                    .then(cachedResponse => {
                        if (cachedResponse) {
                            return cachedResponse;
                        }
                        // If the request is for an HTML page, return the offline page
                        if (event.request.headers.get('accept').includes('text/html')) {
                            return caches.match(`${BASE_PATH}/index.html`);
                        }
                        return new Response('Offline content not available');
                    });
            })
    );
});

// Handle service worker updates
self.addEventListener('message', event => {
    if (event.data === 'skipWaiting') {
        self.skipWaiting();
    }
});
