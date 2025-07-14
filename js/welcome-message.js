document.addEventListener('DOMContentLoaded', () => {
    // Only run this on the homepage
    if (!window.PathHandler || !window.PathHandler.isIndexPage()) {
        return;
    }

    const MODAL_ID = 'welcome-schedule-modal';
    const DISMISSED_KEY = 'welcomeScheduleModalDismissed';

    // Check if the user has dismissed this modal before
    if (sessionStorage.getItem(DISMISSED_KEY)) {
        return;
    }

    // --- Create Modal HTML ---
    const modalElement = document.createElement('div');
    modalElement.className = 'welcome-message';
    modalElement.id = MODAL_ID;
    modalElement.innerHTML = `
        <div class="welcome-header">
            <h3 class="welcome-title">
                <i class="fas fa-bullhorn"></i>
                <span>مواعيد العام الجديد</span>
            </h3>
            <button class="welcome-close" aria-label="Close">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="welcome-content">
            <p>عاوز تعرف مواعيد <strong>2025/2026</strong> للصفوف الثانوية الثلاثة؟</p>
        </div>
        <div class="welcome-actions">
            <a href="pages/schedule.html" class="welcome-btn primary">
                <i class="fas fa-calendar-alt"></i>
                اضغط هنا
            </a>
            <button class="welcome-btn secondary">لاحقاً</button>
        </div>
    `;

    document.body.appendChild(modalElement);

    // --- Modal Logic ---
    const closeButton = modalElement.querySelector('.welcome-close');
    const laterButton = modalElement.querySelector('.welcome-btn.secondary');

    const hideModal = () => {
        modalElement.classList.remove('show');
        // Remember that the user dismissed it for this session
        sessionStorage.setItem(DISMISSED_KEY, 'true');
        setTimeout(() => {
            modalElement.remove();
        }, 500); // Wait for transition to finish
    };

    closeButton.addEventListener('click', hideModal);
    laterButton.addEventListener('click', hideModal);

    // Show the modal after a short delay
    setTimeout(() => {
        modalElement.classList.add('show');
    }, 1500); // 1.5-second delay
});