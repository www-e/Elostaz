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
            // Remove /Elostaz from path when calculating depth
            const adjustedPath = path.replace('/Elostaz', '');
            const adjustedDepth = (adjustedPath.match(/\//g) || []).length;
            return '../'.repeat(Math.max(0, adjustedDepth));
        }
        
        // Local development
        return '../'.repeat(Math.max(0, depth - 1));
    },

    updateIconPaths: () => {
        const currentPath = window.location.pathname;
        const inSubfolder = currentPath.split('/').length > 2;
        const relativePath = PathHandler.getRelativePath();
        
        // Update all icon and manifest links
        document.querySelectorAll('link[rel*="icon"], link[rel="manifest"], link[rel="apple-touch-icon"]').forEach(link => {
            const href = link.getAttribute('href');
            if (href && (href.includes('assets/') || href.includes('manifest.json'))) {
                // For assets in root directory
                if (href.startsWith('./') || href.startsWith('/')) {
                    link.href = relativePath + href.replace(/^\.\/|^\//, '');
                } else {
                    link.href = relativePath + href;
                }
            }
        });
    }
};

// Run when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    PathHandler.updateIconPaths();
});
