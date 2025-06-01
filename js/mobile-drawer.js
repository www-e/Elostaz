/**
 * Mobile drawer menu handler
 * Closes the mobile drawer menu when clicking outside of it
 */
document.addEventListener('DOMContentLoaded', () => {
    // Get the navbar toggler button and navbar collapse element
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (!navbarToggler || !navbarCollapse) return;
    
    // Function to close the navbar
    const closeNavbar = () => {
        if (navbarCollapse.classList.contains('show')) {
            navbarToggler.click();
        }
    };
    
    // Close navbar when clicking outside
    document.addEventListener('click', (event) => {
        // Check if the navbar is open and the click is outside the navbar
        const isNavbarOpen = navbarCollapse.classList.contains('show');
        const isClickInsideNavbar = navbarCollapse.contains(event.target);
        const isClickOnToggler = navbarToggler.contains(event.target);
        
        if (isNavbarOpen && !isClickInsideNavbar && !isClickOnToggler) {
            closeNavbar();
        }
    });
    
    // Also close navbar when clicking on a nav link (for better mobile UX)
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeNavbar();
        });
    });
    
    // Close navbar when pressing Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeNavbar();
        }
    });
});
