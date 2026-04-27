// Loader functionality
document.addEventListener('DOMContentLoaded', () => {
    const loader = document.querySelector('.loader-wrapper');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('fade-out');
        }, 250);
    }
});

// Show loader before page unload
window.addEventListener('beforeunload', () => {
    const loader = document.querySelector('.loader-wrapper');
    if (loader) {
        loader.classList.remove('fade-out');
    }
});