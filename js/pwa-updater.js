// Handle PWA updates
let refreshing = false;

// Listen for service worker updates
navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
});

// Listen for update messages from service worker
navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'CACHE_UPDATED') {
        // Show update notification to user
        const updateNotification = document.createElement('div');
        updateNotification.className = 'update-notification';
        updateNotification.innerHTML = `
            <div class="update-content">
                تم تحديث التطبيق! يرجى تحديث الصفحة للحصول على أحدث التغييرات.
                <button onclick="window.location.reload()">تحديث الآن</button>
            </div>
        `;
        document.body.appendChild(updateNotification);

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .update-notification {
                position: fixed;
                bottom: 20px;
                left: 20px;
                right: 20px;
                background: #2e1269;
                color: white;
                padding: 16px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                z-index: 10000;
                text-align: center;
                direction: rtl;
            }
            .update-notification button {
                margin-right: 10px;
                padding: 8px 16px;
                border: none;
                border-radius: 4px;
                background: white;
                color: #2e1269;
                cursor: pointer;
            }
        `;
        document.head.appendChild(style);
    }
});

// Check for service worker updates periodically
async function checkForUpdates() {
    if (!navigator.serviceWorker) return;
    
    const registration = await navigator.serviceWorker.ready;
    try {
        await registration.update();
    } catch (err) {
        console.error('Error checking for updates:', err);
    }
}

// Check for updates every 30 minutes
setInterval(checkForUpdates, 30 * 60 * 1000);
// Also check when the page becomes visible again
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        checkForUpdates();
    }
});

// Cache version
const CACHE_VERSION = 'v2025-1';

// Files to cache
const filesToCache = [
    '/',
    '/index.html',
    '/pages/registration.html',
    '/css/styles.css',
    '/css/navbar.css',
    '/css/mobile.css',
    '/css/registration.css',
    '/css/tags.css',
    '/js/DOMloader.js',
    '/js/theme.js',
    '/js/main.js',
    '/js/ActiveState.js',
    '/js/form-validation.js',
    '/js/navbar.js',
    '/js/registration.js',
    '/js/registration-service.js',
    '/js/components/success-modal.js',
    '/js/supabase-client.js',
    '/assets/icons/edu.ico',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.rtl.min.css',
    'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
    'https://html2canvas.hertzen.com/dist/html2canvas.min.js',
    'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'
];

// Install event - cache files
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_VERSION)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(filesToCache);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_VERSION) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                // Clone the request
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(
                    response => {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response
                        const responseToCache = response.clone();

                        caches.open(CACHE_VERSION)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});
