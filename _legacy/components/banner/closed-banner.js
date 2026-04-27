// Registration Closed Banner - GSAP Animation
function initRegistrationBanner() {
  const banner = document.getElementById('registration-closed-banner');

  if (!banner) {
    console.warn('Registration banner not found');
    return;
  }

  // Animate banner in on page load
  gsap.to(banner, {
    y: '0%',
    opacity: 1,
    duration: 1.2,
    ease: 'elastic.out(1, 0.5)',
    delay: 0.3
  });

  // Subtle pulse effect on text
  gsap.to('.banner-text', {
    scale: 1.02,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });

  // Add body class for spacing
  document.body.classList.add('has-banner');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRegistrationBanner);
} else {
  initRegistrationBanner();
}
