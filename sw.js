const CACHE_NAME = 'alostaz-cache-v1';

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        console.log('Opened cache');
        
        // First, cache the HTML files
        const htmlFiles = [
          'index.html',
          'about.html',
          'grade1.html',
          'grade2.html',
          'grade3.html',
          'schedule.html'
        ];
        
        await Promise.all(
          htmlFiles.map(async (url) => {
            try {
              await cache.add(url);
              console.log(`Cached: ${url}`);
            } catch (err) {
              console.warn(`Failed to cache: ${url}`, err);
            }
          })
        );

        // Then cache the CSS files
        const cssFiles = [
          'css/styles.css',
          'css/mobile.css',
          'css/grade-styles.css',
          'css/about-styles.css'
        ];

        await Promise.all(
          cssFiles.map(async (url) => {
            try {
              await cache.add(url);
              console.log(`Cached: ${url}`);
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
