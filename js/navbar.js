// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        // Check if href is a valid selector (not just '#')
        if (href && href !== '#') {
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const nav = document.querySelector('.floating-nav');
    if (window.scrollY > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Add profile and admin links to navbar
document.addEventListener('DOMContentLoaded', function() {
    // Import Database if it exists
    let Database;
    try {
        import('./database.js').then(module => {
            Database = module.default;
            updateNavbarLinks();
        });
    } catch (error) {
        console.log('Database module not loaded');
    }

    function updateNavbarLinks() {
        if (!Database) return;

        const navbarNav = document.querySelector('#navbarNav .navbar-nav');
        if (!navbarNav) return;

        // Check if links already exist to avoid duplicates
        if (document.querySelector('.profile-link') || document.querySelector('.admin-link')) {
            return;
        }

        // Add profile link
        const profileLi = document.createElement('li');
        profileLi.className = 'nav-item profile-link';
        
        const profileLink = document.createElement('a');
        profileLink.className = 'nav-link';
        profileLink.href = PathHandler.getBasePath() + '/pages/profile.html';
        profileLink.innerHTML = '<i class="fas fa-user ml-1"></i> الملف الشخصي';
        
        profileLi.appendChild(profileLink);
        navbarNav.appendChild(profileLi);

        // Add admin link
        const adminLi = document.createElement('li');
        adminLi.className = 'nav-item admin-link';
        
        const adminLink = document.createElement('a');
        adminLink.className = 'nav-link';
        adminLink.href = PathHandler.getBasePath() + '/pages/admin.html';
        adminLink.innerHTML = '<i class="fas fa-cog ml-1"></i> الإدارة';
        
        adminLi.appendChild(adminLink);
        navbarNav.appendChild(adminLi);

        // Set active state for current page
        const currentPath = window.location.pathname;
        if (currentPath.includes('/profile.html')) {
            profileLink.classList.add('active');
        } else if (currentPath.includes('/admin.html')) {
            adminLink.classList.add('active');
        }
    }
});
