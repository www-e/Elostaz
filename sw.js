const CACHE_NAME = 'elostaz-cache-v1';
const DYNAMIC_CACHE = 'elostaz-dynamic-v1';

// Detect if we're on GitHub Pages and set the base path accordingly
const BASE_PATH = location.hostname === 'www-e.github.io' ? '/Elostaz' : '';

// Add BASE_PATH to all assets
const ASSETS = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/registration.html`,
  `${BASE_PATH}/about.html`,
  `${BASE_PATH}/css/styles.css`,
  `${BASE_PATH}/css/mobile.css`,
  `${BASE_PATH}/css/about-styles.css`,
  `${BASE_PATH}/css/grade-styles.css`,
  `${BASE_PATH}/registration.css`,
  `${BASE_PATH}/js/main.js`,
  `${BASE_PATH}/registration.js`,
  `${BASE_PATH}/assets/icons/edu.ico`,
  `${BASE_PATH}/components/install-prompt/install-prompt.css`,
  `${BASE_PATH}/components/install-prompt/install-prompt.js`,
  // External resources
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.rtl.min.css',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'
];

// Install event - cache initial assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching assets...');
        return cache.addAll(ASSETS).catch(error => {
          console.error('Error caching assets:', error);
          // Continue even if some assets fail to cache
          return Promise.resolve();
        });
      })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(keys => {
        return Promise.all(
          keys.filter(key => ![CACHE_NAME, DYNAMIC_CACHE].includes(key))
            .map(key => {
              console.log('Deleting old cache:', key);
              return caches.delete(key);
            })
        );
      }),
      // Take control of all clients
      clients.claim()
    ])
  );
});

// Helper function to normalize URLs
function normalizeUrl(url) {
  const urlObj = new URL(url, location.href);
  if (location.hostname === 'www-e.github.io') {
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
      .then(networkResponse => {
        // Clone the response before using it
        const responseToCache = networkResponse.clone();

        // Only cache successful responses
        if (networkResponse.ok && shouldCache(normalizedUrl)) {
          caches.open(DYNAMIC_CACHE)
            .then(cache => {
              cache.put(normalizedUrl, responseToCache);
            })
            .catch(error => {
              console.error('Error caching response:', error);
            });
        }

        return networkResponse;
      })
      .catch(() => {
        // Try to get from cache if network fails
        return caches.match(normalizedUrl)
          .then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // If the request was for an HTML page, return the offline page
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match(`${BASE_PATH}/`);
            }
            
            // Return a basic error response
            return new Response('Network error occurred', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' }
            });
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
