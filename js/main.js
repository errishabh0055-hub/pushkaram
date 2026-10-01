/**
 * PUSHKARAM RESORT - PREMIUM INTERACTION ENGINE
 * High-performance Vanilla JS for Navigation, Lightbox, Filtering, Accordions & Mobile Drawer
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Navigation Header Scroll Elevation
  const header = document.getElementById('siteHeader');
  let lastScrollY = window.scrollY;

  const handleHeaderScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScrollY = window.scrollY;
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // 2. Mobile Drawer Navigation
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (menuToggle && mobileNav) {
    const toggleMobileNav = (state) => {
      const isOpen = typeof state === 'boolean' ? state : !mobileNav.classList.contains('open');
      mobileNav.classList.toggle('open', isOpen);
      menuToggle.classList.toggle('active', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    menuToggle.addEventListener('click', () => toggleMobileNav());

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => toggleMobileNav(false));
    });

    // Close when clicking outside of mobile nav
    document.addEventListener('click', (e) => {
      if (mobileNav.classList.contains('open') && !mobileNav.contains(e.target) && !menuToggle.contains(e.target)) {
        toggleMobileNav(false);
      }
    });
  }

  // 3. Room Category Filter
  const roomFilterPills = document.querySelectorAll('.room-filter-pill');
  const roomRows = document.querySelectorAll('.room-editorial-row');

  if (roomFilterPills.length > 0 && roomRows.length > 0) {
    roomFilterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        roomFilterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const selectedFilter = pill.getAttribute('data-filter');

        roomRows.forEach(row => {
          const category = row.getAttribute('data-category');
          if (selectedFilter === 'all' || category === selectedFilter) {
            row.style.display = 'grid';
            row.style.opacity = '0';
            row.style.transform = 'translateY(12px)';
            requestAnimationFrame(() => {
              row.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              row.style.opacity = '1';
              row.style.transform = 'translateY(0)';
            });
          } else {
            row.style.display = 'none';
          }
        });
      });
    });
  }

  // 4. Photo Gallery Filtering
  const galleryPills = document.querySelectorAll('.gallery-pill');
  const galleryCards = document.querySelectorAll('.gallery-card');

  if (galleryPills.length > 0 && galleryCards.length > 0) {
    galleryPills.forEach(pill => {
      pill.addEventListener('click', () => {
        galleryPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const selectedCategory = pill.getAttribute('data-gallery-filter');

        galleryCards.forEach(card => {
          const cardCat = card.getAttribute('data-gallery-cat');
          if (selectedCategory === 'all' || cardCat === selectedCategory) {
            card.style.display = 'block';
            card.style.opacity = '0';
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.35s ease';
              card.style.opacity = '1';
            });
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 5. Interactive Lightbox Modal with Keyboard & Touch Support
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let activeGalleryItems = [];
  let currentActiveIndex = 0;

  function refreshActiveGallery() {
    activeGalleryItems = Array.from(document.querySelectorAll('.gallery-card'))
      .filter(card => card.style.display !== 'none')
      .map(card => ({
        src: card.getAttribute('data-full-img') || card.querySelector('img').src,
        title: card.querySelector('.gallery-overlay-title')?.textContent || 'Pushkaram Resort',
        category: card.querySelector('.gallery-overlay-cat')?.textContent || ''
      }));
  }

  function displayLightboxItem(index) {
    if (activeGalleryItems.length === 0) return;
    if (index < 0) index = activeGalleryItems.length - 1;
    if (index >= activeGalleryItems.length) index = 0;
    currentActiveIndex = index;

    const item = activeGalleryItems[currentActiveIndex];
    lightboxImg.src = item.src;
    lightboxCaption.textContent = item.title + (item.category ? ` • ${item.category}` : '');
  }

  galleryCards.forEach(card => {
    card.addEventListener('click', () => {
      refreshActiveGallery();
      const targetSrc = card.getAttribute('data-full-img') || card.querySelector('img').src;
      const foundIndex = activeGalleryItems.findIndex(item => item.src === targetSrc);
      if (foundIndex !== -1) {
        displayLightboxItem(foundIndex);
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeLightbox = () => {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      displayLightboxItem(currentActiveIndex - 1);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      displayLightboxItem(currentActiveIndex + 1);
    });
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  // Keyboard Navigation for Lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      displayLightboxItem(currentActiveIndex - 1);
    } else if (e.key === 'ArrowRight') {
      displayLightboxItem(currentActiveIndex + 1);
    }
  });

  // Touch Swipe for Mobile Lightbox
  let touchStartX = 0;
  let touchEndX = 0;

  if (lightboxModal) {
    lightboxModal.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightboxModal.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleLightboxSwipe();
    }, { passive: true });

    function handleLightboxSwipe() {
      const diffX = touchEndX - touchStartX;
      if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
          // Swiped right -> previous
          displayLightboxItem(currentActiveIndex - 1);
        } else {
          // Swiped left -> next
          displayLightboxItem(currentActiveIndex + 1);
        }
      }
    }
  }

  // 6. Modern FAQ Accordion with Dynamic Smooth Height
  const faqItems = document.querySelectorAll('.faq-accordion-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question-btn');
    const drawer = item.querySelector('.faq-answer-drawer');

    if (questionBtn && drawer) {
      questionBtn.addEventListener('click', () => {
        const isCurrentlyActive = item.classList.contains('active');

        // Close all other items for a clean single-open accordion feel
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherDrawer = otherItem.querySelector('.faq-answer-drawer');
            if (otherDrawer) {
              otherDrawer.style.maxHeight = null;
            }
          }
        });

        if (isCurrentlyActive) {
          item.classList.remove('active');
          drawer.style.maxHeight = null;
        } else {
          item.classList.add('active');
          drawer.style.maxHeight = (drawer.scrollHeight + 32) + 'px';
        }
      });
    }
  });

  // 7. Smooth Link Scroll with Sticky Header Offset
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href || href === '#' || !href.startsWith('#')) return;
      const targetElement = document.querySelector(href);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});
