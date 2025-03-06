const CACHE_VERSION = 'v5-20250306';  // Incrementing version to force cache refresh
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
    `${BASE_PATH}/pages/update-password.html`,
    `${BASE_PATH}/pages/fix-firebase-password.html`,
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
    `${BASE_PATH}/js/password-utils.js`,
    `${BASE_PATH}/js/firebase-config.js`,
    `${BASE_PATH}/js/firebase-database.js`,
    `${BASE_PATH}/js/database-adapter.js`,
    `${BASE_PATH}/js/data-migration.js`,
    `${BASE_PATH}/js/settings.js`,
    `${BASE_PATH}/js/profile-attendance.js`,
    `${BASE_PATH}/js/secondTermValidator.js`,
    `${BASE_PATH}/js/admin.js`,
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

// Activate event - clean up old caches and notify clients
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
    // Don't cache Firebase API requests
    if (url.includes('firebaseio.com') || url.includes('googleapis.com')) {
        return false;
    }
    
    const fileExtensions = ['.html', '.css', '.js', '.json', '.ico', '.png', '.jpg', '.jpeg', '.gif', '.svg'];
    return fileExtensions.some(ext => url.toLowerCase().endsWith(ext));
}

// Fetch event - serve from cache first, then network
self.addEventListener('fetch', event => {
    // Skip Firebase-related requests and cross-origin requests
    if (event.request.url.includes('firebasestorage.googleapis.com') || 
        event.request.url.includes('firebaseio.com') ||
        event.request.url.includes('googleapis.com') ||
        event.request.url.includes('firebase') ||
        event.request.url.includes('gstatic') ||
        !event.request.url.startsWith(self.location.origin)) {
        return;
    }

    // Special handling for database.js to ensure it's always fresh
    if (event.request.url.includes('database.js')) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    return response;
                })
                .catch(() => {
                    return caches.match(event.request);
                })
        );
        return;
    }

    // Handle other requests with cache-first strategy
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request)
                    .then(response => {
                        // Don't cache non-successful responses
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response - we need one to return and one to cache
                        const responseToCache = response.clone();
                        
                        // Store in dynamic cache
                        caches.open(DYNAMIC_CACHE)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(error => {
                        console.error('[Service Worker] Fetch failed:', error);
                        
                        // For HTML pages, return a fallback
                        if (event.request.headers.get('accept').includes('text/html')) {
                            return caches.match(`${BASE_PATH}/index.html`);
                        }
                        
                        return new Response('Network error', { 
                            status: 408, 
                            headers: { 'Content-Type': 'text/plain' } 
                        });
                    });
            })
    );
});

// Listen for messages from clients
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Function to check for updates
function checkForUpdates() {
    console.log('[Service Worker] Checking for updates...');
    self.registration.update();
}

// Check for updates every hour
setInterval(checkForUpdates, 60 * 60 * 1000);
