/**
 * Welcome Message with Discord Button
 * This script creates a welcoming popup message with a Discord button
 * that appears when users visit the site.
 */

// Create and initialize the welcome message component
function initializeWelcomeMessage() {
    // Create welcome message container
    const welcomeContainer = document.createElement('div');
    welcomeContainer.className = 'welcome-message-container';
    welcomeContainer.setAttribute('id', 'welcomeMessage');
    
    // Create welcome message content
    const welcomeContent = document.createElement('div');
    welcomeContent.className = 'welcome-message-content';
    
    // Create close button
    const closeButton = document.createElement('button');
    closeButton.className = 'welcome-close-btn';
    closeButton.innerHTML = '<i class="fas fa-times"></i>';
    closeButton.addEventListener('click', () => {
        hideWelcomeMessage();
        
        // Save to localStorage that the user has closed the message
        localStorage.setItem('welcomeMessageClosed', 'true');
    });
    
    // Create welcome message header
    const welcomeHeader = document.createElement('div');
    welcomeHeader.className = 'welcome-header';
    
    // Create celebration icons
    const celebrationIcons = document.createElement('div');
    celebrationIcons.className = 'celebration-icons';
    celebrationIcons.innerHTML = `
        <i class="fas fa-star"></i>
        <i class="fas fa-graduation-cap"></i>
        <i class="fas fa-award"></i>
        <i class="fas fa-star"></i>
    `;
    
    // Create welcome title
    const welcomeTitle = document.createElement('h3');
    welcomeTitle.textContent = 'أهلاً بك في مركز أ/ أشرف حسن للرياضيات!';
    
    // Create welcome message
    const welcomeMessage = document.createElement('p');
    welcomeMessage.textContent = 'نحن سعداء بزيارتك! انضم إلينا على سيرفر الديسكورد للتواصل المباشر والحصول على المساعدة والدعم.';
    
    // Create Discord button
    const discordButton = document.createElement('a');
    discordButton.className = 'discord-button';
    discordButton.href = 'https://discord.gg/mywT2j6CeW';
    discordButton.target = '_blank';
    discordButton.innerHTML = '<i class="fab fa-discord"></i> انضم إلى سيرفر الديسكورد';
    
    // Add pulse effect to Discord button
    discordButton.classList.add('pulse-effect');
    
    // Assemble the welcome message
    welcomeHeader.appendChild(celebrationIcons.cloneNode(true));
    welcomeHeader.appendChild(welcomeTitle);
    welcomeHeader.appendChild(celebrationIcons);
    
    welcomeContent.appendChild(closeButton);
    welcomeContent.appendChild(welcomeHeader);
    welcomeContent.appendChild(welcomeMessage);
    welcomeContent.appendChild(discordButton);
    
    welcomeContainer.appendChild(welcomeContent);
    
    // Add confetti elements for celebration effect
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.animationDelay = `${Math.random() * 5}s`;
        confetti.style.backgroundColor = getRandomColor();
        welcomeContainer.appendChild(confetti);
    }
    
    // Add to body
    document.body.appendChild(welcomeContainer);
    
    // Show welcome message with animation
    setTimeout(() => {
        welcomeContainer.classList.add('show');
    }, 1000);
    
    // Auto-hide after 15 seconds
    setTimeout(() => {
        hideWelcomeMessage();
    }, 15000);
}

// Hide welcome message with animation
function hideWelcomeMessage() {
    const welcomeContainer = document.getElementById('welcomeMessage');
    if (welcomeContainer) {
        welcomeContainer.classList.remove('show');
        setTimeout(() => {
            welcomeContainer.remove();
        }, 500);
    }
}

// Get random color for confetti from theme colors
function getRandomColor() {
    const colors = [
        'var(--primary)',
        'var(--primary-light)',
        'var(--secondary)',
        'var(--secondary-light)',
        'var(--accent)',
        'var(--accent-light)'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Check if we should show the welcome message
function shouldShowWelcomeMessage() {
    // If the user has explicitly closed the message, don't show it again
    return localStorage.getItem('welcomeMessageClosed') !== 'true';
}

// Initialize when DOM is loaded - only on index.html
document.addEventListener('DOMContentLoaded', function() {
    // Only show on index.html
    const path = window.location.pathname;
    
    // Check if this is the index page
    const isIndexPage = path === '/' || 
                       path === '/index.html' || 
                       path.endsWith('/index.html') || 
                       path.endsWith('/') && !path.includes('/pages/');
    
    // Only show on the index page and if the user hasn't closed it before
    if (isIndexPage && shouldShowWelcomeMessage()) {
        // Initialize welcome message on index page
        initializeWelcomeMessage();
    }
});

export { initializeWelcomeMessage };
