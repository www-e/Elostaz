const CACHE_NAME = 'alostaz-cache-v1';
// Detect if we're on GitHub Pages
const isGitHubPages = location.hostname === 'www-e.github.io';
const BASE_PATH = isGitHubPages ? '/Elostaz/' : './';

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        console.log('Opened cache');
        
        // First, cache the HTML files
        const htmlFiles = [
          `${BASE_PATH}index.html`,
          `${BASE_PATH}about.html`,
          `${BASE_PATH}grade1.html`,
          `${BASE_PATH}grade2.html`,
          `${BASE_PATH}grade3.html`,
          `${BASE_PATH}schedule.html`
        ];
        
        await Promise.all(
          htmlFiles.map(async (url) => {
            try {
              const request = new Request(url);
              const response = await fetch(request);
              if (response.ok) {
                await cache.put(request, response);
                console.log(`Cached: ${url}`);
              }
            } catch (err) {
              console.warn(`Failed to cache: ${url}`, err);
            }
          })
        );

        // Then cache the CSS files
        const cssFiles = [
          `${BASE_PATH}css/styles.css`,
          `${BASE_PATH}css/mobile.css`,
          `${BASE_PATH}css/grade-styles.css`,
          `${BASE_PATH}css/about-styles.css`
        ];

        await Promise.all(
          cssFiles.map(async (url) => {
            try {
              const request = new Request(url);
              const response = await fetch(request);
              if (response.ok) {
                await cache.put(request, response);
                console.log(`Cached: ${url}`);
              }
            } catch (err) {
              console.warn(`Failed to cache: ${url}`, err);
            }
          })
        );

        console.log('Initial caching complete');
      } catch (error) {
        console.error('Error during service worker installation:', error);
      }
    })()
  );
});

// Activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version if available
        if (response) {
          return response;
        }

        // Clone the request because it can only be used once
        const fetchRequest = event.request.clone();

        // Make network request and cache the response
        return fetch(fetchRequest).then(response => {
          // Check if response is valid
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response because it can only be used once
          const responseToCache = response.clone();

          // Cache the fetched response
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch(() => {
          // Return a fallback response if offline
          return new Response('Offline content not available');
        });
      })
  );
});
