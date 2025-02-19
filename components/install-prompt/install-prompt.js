class InstallPrompt {
    constructor() {
        this.deferredPrompt = null;
        this.installPromptElement = null;
        this.init();
    }

    init() {
        // Check if app is already installed
        if (window.matchMedia('(display-mode: standalone)').matches || 
            window.navigator.standalone === true) {
            return; // Don't show prompt if already installed
        }

        // Create modal element
        const modal = document.createElement('div');
        modal.className = 'install-prompt';
        modal.innerHTML = `
            <div class="install-prompt-header">تحميل التطبيق</div>
            <div class="install-prompt-content">
                قم بتثبيت تطبيق مركز أ/ أشرف حسن للرياضيات على جهازك للوصول السريع والاستخدام بدون إنترنت
            </div>
            <div class="install-prompt-buttons">
                <button class="install-button">تثبيت التطبيق</button>
                <button class="close-button">لاحقاً</button>
            </div>
        `;
        document.body.appendChild(modal);
        this.installPromptElement = modal;

        // Add event listeners
        this.addEventListeners();
        
        // Show prompt after a short delay
        setTimeout(() => this.showPrompt(), 2000);
    }

    addEventListeners() {
        // Listen for beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
        });

        // Install button click handler
        this.installPromptElement.querySelector('.install-button').addEventListener('click', () => {
            if (this.deferredPrompt) {
                this.installApp();
            } else {
                // Create a styled modal for alternative instructions
                const modal = document.createElement('div');
                modal.className = 'install-instructions-modal';
                modal.innerHTML = `
                    <div class="modal-content">
                        <div class="modal-header">تثبيت التطبيق</div>
                        <div class="modal-body">
                            <p>لتثبيت التطبيق على هاتفك:</p>
                            <ol>
                                <li>في متصفح Chrome:
                                    <ul>
                                        <li>انقر على قائمة المتصفح (⋮)</li>
                                        <li>اختر "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية"</li>
                                    </ul>
                                </li>
                                <li>في متصفح Safari (iOS):
                                    <ul>
                                        <li>انقر على زر المشاركة (↑)</li>
                                        <li>اختر "إضافة إلى الشاشة الرئيسية"</li>
                                    </ul>
                                </li>
                            </ol>
                        </div>
                        <button class="modal-close">إغلاق</button>
                    </div>
                `;
                document.body.appendChild(modal);
                
                modal.querySelector('.modal-close').addEventListener('click', () => {
                    modal.remove();
                });
            }
            this.hidePrompt();
        });

        // Close button click handler
        this.installPromptElement.querySelector('.close-button').addEventListener('click', () => {
            this.hidePrompt();
            // Store in localStorage that user dismissed the prompt
            localStorage.setItem('installPromptDismissed', Date.now());
        });

        // Listen for app installed event
        window.addEventListener('appinstalled', () => {
            this.hidePrompt();
            this.deferredPrompt = null;
            // Store that app was installed
            localStorage.setItem('appInstalled', 'true');
        });
    }

    showPrompt() {
        // Check if user recently dismissed the prompt (within 24 hours)
        const lastDismissed = localStorage.getItem('installPromptDismissed');
        if (lastDismissed) {
            const hoursSinceDismissed = (Date.now() - parseInt(lastDismissed)) / (1000 * 60 * 60);
            if (hoursSinceDismissed < 24) {
                return;
            }
        }
        
        // Check if app is already installed
        if (localStorage.getItem('appInstalled') === 'true') {
            return;
        }

        this.installPromptElement.classList.add('show');
    }

    hidePrompt() {
        this.installPromptElement.classList.remove('show');
    }

    async installApp() {
        if (!this.deferredPrompt) return;

        try {
            const result = await this.deferredPrompt.prompt();
            console.log(`Install prompt result: ${result}`);
            this.deferredPrompt = null;
        } catch (err) {
            console.error('Error during installation:', err);
        }
    }
}

// Initialize the install prompt
document.addEventListener('DOMContentLoaded', () => {
    new InstallPrompt();
});
