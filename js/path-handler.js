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
    }
};

// Run when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', PathHandler.updatePaths);
} else {
    PathHandler.updatePaths();
}
