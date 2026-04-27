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
