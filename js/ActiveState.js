// Handle active navigation state
document.addEventListener('DOMContentLoaded', () => {
    // Get current page path
    const currentPath = window.location.pathname;
    const currentHash = window.location.hash;
    
    // Remove all active classes first
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Set active class based on current page or section
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        
        if (href.includes('#')) {
            // For hash links (sections within a page)
            if (currentHash && href === currentHash) {
                link.classList.add('active');
            } else if (!currentHash && href === '#home' && currentPath.endsWith('index.html')) {
                link.classList.add('active');
            }
        } else {
            // For page links
            if (currentPath.endsWith(href)) {
                link.classList.add('active');
            }
        }
    });
    
    // Handle section scrolling for index page
    if (currentPath.endsWith('index.html') || currentPath.endsWith('/')) {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        
        window.addEventListener('scroll', () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollY >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }
});