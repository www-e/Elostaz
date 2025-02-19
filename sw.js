const CACHE_NAME = 'elostaz-cache-v1';
const DYNAMIC_CACHE = 'elostaz-dynamic-v1';

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
    `${BASE_PATH}/assets/icons/edu.ico`,
    `${BASE_PATH}/components/install-prompt/install-prompt.css`,
    `${BASE_PATH}/components/install-prompt/install-prompt.js`,
    // External resources
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.rtl.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
    'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
    'https://unpkg.com/aos@next/dist/aos.css'
];

// Install event - cache initial assets
self.addEventListener('install', event => {
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
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        Promise.all([
            caches.keys().then(keys => {
                return Promise.all(
                    keys.filter(key => ![CACHE_NAME, DYNAMIC_CACHE].includes(key))
                        .map(key => {
                            console.log('Deleting old cache:', key);
                            return caches.delete(key);
                        })
                );
            }),
            clients.claim()
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
