class InstallPrompt {
    constructor() {
        this.deferredPrompt = null;
        this.installPromptElement = null;
        this.init();
    }

    init() {
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
                // If no install prompt is available, provide alternative instructions
                alert('لتثبيت التطبيق على هاتفك:\n1. افتح المتصفح (Chrome أو Safari)\n2. انقر على قائمة المتصفح (ثلاث نقاط)\n3. اختر "إضافة إلى الشاشة الرئيسية"');
            }
            this.hidePrompt();
        });

        // Close button click handler
        this.installPromptElement.querySelector('.close-button').addEventListener('click', () => {
            this.hidePrompt();
        });

        // Listen for app installed event
        window.addEventListener('appinstalled', () => {
            this.hidePrompt();
            this.deferredPrompt = null;
        });
    }

    showPrompt() {
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
