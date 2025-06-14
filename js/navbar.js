// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
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

function createNavbar() {
    const navbar = document.createElement('nav');
    navbar.className = 'navbar';
    navbar.innerHTML = `
        <div class="navbar-container">
            <a href="/" class="logo">
                <img src="/assets/icons/edu.ico" alt="Logo">
                <span>مركز أ/ أشرف حسن</span>
            </a>
            
            <div class="nav-links">
                <a href="/" class="nav-link">الرئيسية</a>
                <a href="/pages/about.html" class="nav-link">عن المركز</a>
                <a href="/pages/schedule.html" class="nav-link">المواعيد</a>
                <a href="/pages/registration.html" class="nav-link">حجز 2025/2026</a>
                <a href="/pages/statistics.html" class="nav-link">مراجعة الإحصائيات</a>
                <a href="/pages/signin.html" class="nav-link signin-btn">
                    <i class="fas fa-sign-in-alt"></i>
                    تسجيل الدخول
                </a>
            </div>
            
            <button class="mobile-menu-btn">
                <i class="fas fa-bars"></i>
            </button>
        </div>
    `;
    
    // ... rest of the code ...
}
