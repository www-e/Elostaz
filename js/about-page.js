/**
 * About Page - GSAP Animations
 * Handles timeline, statistics, and scroll-triggered animations
 */

// Initialize all animations when DOM is ready
function initAboutPageAnimations() {
  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  // Timeline animations
  initTimelineAnimations();

  // Statistics counter animations
  initStatisticsAnimations();

  // Collaboration cards animations
  initCollaborationsAnimations();

  // Curriculum cards animations
  initCurriculumAnimations();

  // Methodology cards animations
  initMethodologyAnimations();

  // Hero section parallax
  initHeroParallax();
}

/**
 * Timeline Section Animations
 */
function initTimelineAnimations() {
  const timelineItems = document.querySelectorAll('.timeline-item');

  // Stagger animation for timeline items
  gsap.to(timelineItems, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.timeline-section',
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse'
    }
  });

  // Animate timeline line drawing
  gsap.from('.timeline::before', {
    scaleY: 0,
    transformOrigin: 'top center',
    duration: 1.5,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.timeline-section',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  });

  // Hover effects for timeline items
  timelineItems.forEach(item => {
    const content = item.querySelector('.timeline-content');

    content.addEventListener('mouseenter', () => {
      gsap.to(content, {
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    content.addEventListener('mouseleave', () => {
      gsap.to(content, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
  });
}

/**
 * Statistics Counter Animations
 */
function initStatisticsAnimations() {
  const statCards = document.querySelectorAll('.stat-card');
  const statNumbers = document.querySelectorAll('.stat-number');

  // Animate stat cards entrance
  gsap.to(statCards, {
    opacity: 1,
    scale: 1,
    duration: 0.6,
    stagger: 0.15,
    ease: 'back.out(1.7)',
    scrollTrigger: {
      trigger: '.statistics-section',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  });

  // Animate counters
  statNumbers.forEach(number => {
    const targetValue = parseInt(number.getAttribute('data-target'));

    gsap.to(number, {
      innerHTML: targetValue,
      duration: 2,
      ease: 'power2.out',
      snap: { innerHTML: 1 },
      scrollTrigger: {
        trigger: '.statistics-section',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      onUpdate: function() {
        // Add + sign for large numbers
        const value = Math.round(this.targets()[0].innerHTML);
        if (value >= 1000) {
          this.targets()[0].innerHTML = value + '+';
        } else if (value >= 6 && value < 10) {
          this.targets()[0].innerHTML = value + '+';
        }
      }
    });
  });
}

/**
 * Collaboration Cards Animations
 */
function initCollaborationsAnimations() {
  const cards = document.querySelectorAll('.collaboration-card');

  // Stagger entrance animation
  gsap.to(cards, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.collaborations-section',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  });

  // Hover effects
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        y: -10,
        boxShadow: '0 12px 20px rgba(0, 0, 0, 0.15)',
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        y: 0,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        duration: 0.3,
        ease: 'power2.out'
      });
    });
  });
}

/**
 * Curriculum Cards Animations
 */
function initCurriculumAnimations() {
  const cards = document.querySelectorAll('.curriculum-card');

  // Slide in from left
  gsap.to(cards, {
    opacity: 1,
    x: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.curriculum-section',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  });

  // Hover effects
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        x: 10,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        x: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
  });
}

/**
 * Methodology Cards Animations
 */
function initMethodologyAnimations() {
  const cards = document.querySelectorAll('.methodology-card');

  // Scale in animation
  gsap.to(cards, {
    opacity: 1,
    scale: 1,
    duration: 0.6,
    stagger: 0.1,
    ease: 'back.out(1.7)',
    scrollTrigger: {
      trigger: '.methodology-section',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  });

  // Hover effects
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        scale: 1.03,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
  });
}

/**
 * Hero Section Parallax Effect
 */
function initHeroParallax() {
  const heroSection = document.querySelector('.hero-section');

  if (!heroSection) return;

  gsap.to(heroSection, {
    backgroundPositionY: '50%',
    ease: 'none',
    scrollTrigger: {
      trigger: heroSection,
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });
}

/**
 * Filter functionality for collaboration cards
 */
function initCollaborationFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.collaboration-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter');

      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // Filter cards
      cards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-governorate') === filter) {
          gsap.to(card, {
            display: 'block',
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: 'power2.out'
          });
        } else {
          gsap.to(card, {
            opacity: 0,
            scale: 0.8,
            duration: 0.4,
            ease: 'power2.out',
            onComplete: () => {
              card.style.display = 'none';
            }
          });
        }
      });
    });
  });
}

// Initialize everything when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initAboutPageAnimations();
    initCollaborationFilters();
  });
} else {
  initAboutPageAnimations();
  initCollaborationFilters();
}
