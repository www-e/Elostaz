// Path handler for both local and GitHub Pages environments
const PathHandler = {
    isGitHubPages: () => window.location.hostname === 'www-e.github.io',
    
    getBasePath: () => {
        return PathHandler.isGitHubPages() ? '/Elostaz' : '';
    },

    getAssetPath: (relativePath) => {
        const base = PathHandler.getBasePath();
        // Remove leading slash if present
        const cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
        return `${base}/${cleanPath}`;
    },

    // Get relative path based on current page depth
    getRelativePath: () => {
        const path = window.location.pathname;
        const depth = (path.match(/\//g) || []).length;
        const isGitHub = PathHandler.isGitHubPages();
        
        // Adjust for GitHub Pages
        if (isGitHub) {
            return '/Elostaz/'; // Always return absolute path for GitHub Pages
        }
        
        // Local development
        return '../'.repeat(Math.max(0, depth - 1));
    },

    updatePaths: () => {
        const isGitHub = PathHandler.isGitHubPages();
        const basePath = PathHandler.getBasePath();
        
        // Handle manifest
        const existingManifest = document.querySelector('link[rel="manifest"]');
        if (!existingManifest) {
            const manifestLink = document.createElement('link');
            manifestLink.rel = 'manifest';
            manifestLink.href = isGitHub ? `${basePath}/manifest.json` : './manifest.json';
            document.head.appendChild(manifestLink);
        }

        // Update all icon links
        document.querySelectorAll('link[rel*="icon"], link[rel="apple-touch-icon"]').forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.includes('assets/')) {
                if (isGitHub) {
                    // Use absolute paths for GitHub Pages
                    link.href = `${basePath}/${href.replace(/^\.\/|^\//, '')}`;
                } else {
                    // Use relative paths for local development
                    const relativePath = PathHandler.getRelativePath();
                    link.href = relativePath + href.replace(/^\.\/|^\//, '');
                }
            }
        });
    },
    
    // Check if the current page is the index/home page
    isIndexPage: () => {
        const path = window.location.pathname;
        const isGitHub = PathHandler.isGitHubPages();
        const basePath = PathHandler.getBasePath();
        
        if (isGitHub) {
            // For GitHub Pages, the paths will be like:
            // /Elostaz/ or /Elostaz/index.html
            return path === `${basePath}/` || 
                   path === `${basePath}/index.html`;
        } else {
            // For local or other hosts, the paths will be like:
            // / or /index.html
            return path === '/' || 
                   path === '/index.html' || 
                   path.endsWith('/index.html') || 
                   (path.endsWith('/') && !path.includes('/pages/'));
        }
    }
};

// Expose PathHandler to global scope for other scripts
window.PathHandler = PathHandler;

// Run when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', PathHandler.updatePaths);
} else {
    PathHandler.updatePaths();
}
