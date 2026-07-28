document.addEventListener('DOMContentLoaded', () => {

  // Preloader
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => preloader.classList.add('hidden'), 800);
    });
    setTimeout(() => preloader.classList.add('hidden'), 3000);
  }

  // Hamburger Menu
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // Horizontal Slider
  const sliderTrack = document.querySelector('.slider-track');
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.slider-nav-dot');
  const prevBtn = document.querySelector('.slider-arrow.prev');
  const nextBtn = document.querySelector('.slider-arrow.next');
  const counterCurrent = document.querySelector('.slide-counter .current');
  const counterTotal = document.querySelector('.slide-counter .total');

  if (sliderTrack && slides.length > 0) {
    let currentSlide = 0;
    const totalSlides = slides.length;

    if (counterTotal) counterTotal.textContent = String(totalSlides).padStart(2, '0');

    function goToSlide(index) {
      if (index < 0) index = totalSlides - 1;
      if (index >= totalSlides) index = 0;

      currentSlide = index;
      sliderTrack.style.transform = `translateX(-${currentSlide * 100}vw)`;

      slides.forEach((s, i) => {
        s.classList.toggle('active', i === currentSlide);
      });

      dots.forEach((d, i) => {
        d.classList.toggle('active', i === currentSlide);
      });

      if (counterCurrent) {
        counterCurrent.textContent = String(currentSlide + 1).padStart(2, '0');
      }
    }

    goToSlide(0);

    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => goToSlide(i));
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (document.body.classList.contains('page-view')) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goToSlide(currentSlide + 1);
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goToSlide(currentSlide - 1);
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    sliderTrack.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    sliderTrack.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 60) {
        if (diff > 0) goToSlide(currentSlide + 1);
        else goToSlide(currentSlide - 1);
      }
    }, { passive: true });

    // Mouse wheel horizontal scroll
    let wheelTimeout;
    document.addEventListener('wheel', (e) => {
      if (document.body.classList.contains('page-view')) return;
      clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => {
        if (e.deltaY > 30) goToSlide(currentSlide + 1);
        else if (e.deltaY < -30) goToSlide(currentSlide - 1);
      }, 50);
    }, { passive: true });

    // Auto-advance
    let autoPlay = setInterval(() => goToSlide(currentSlide + 1), 7000);
    sliderTrack.addEventListener('mouseenter', () => clearInterval(autoPlay));
    sliderTrack.addEventListener('mouseleave', () => {
      autoPlay = setInterval(() => goToSlide(currentSlide + 1), 7000);
    });
  }

  // Scroll animations for page views
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-up, .fade-left, .fade-right').forEach(el => {
    observer.observe(el);
  });

  // Navbar scroll behavior
  const navbar = document.querySelector('.navbar');
  if (navbar && document.body.classList.contains('page-view')) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 80);
    });
  }

  // Contact form handling
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);

      const btn = contactForm.querySelector('.form-submit');
      const originalText = btn.textContent;
      btn.textContent = 'Message Sent!';
      btn.style.background = 'var(--color-accent)';
      btn.style.borderColor = 'var(--color-accent)';
      btn.style.color = 'var(--color-black)';

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.style.color = '';
        contactForm.reset();
      }, 3000);
    });
  }

  // Portfolio filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      portfolioItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = '';
          setTimeout(() => item.style.opacity = '1', 50);
        } else {
          item.style.opacity = '0';
          setTimeout(() => item.style.display = 'none', 400);
        }
      });
    });
  });

  // Lightbox
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
  const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;

  document.querySelectorAll('[data-lightbox]').forEach(el => {
    el.addEventListener('click', () => {
      if (lightbox && lightboxImg) {
        lightboxImg.src = el.dataset.lightbox;
        lightbox.classList.add('active');
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => lightbox.classList.remove('active'));
  }
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) lightbox.classList.remove('active');
    });
  }

  // Stat counter animation
  const statNumbers = document.querySelectorAll('.stat-number');
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        let count = 0;
        const step = Math.max(1, Math.floor(target / 60));
        const timer = setInterval(() => {
          count += step;
          if (count >= target) {
            count = target;
            clearInterval(timer);
          }
          el.textContent = count + suffix;
        }, 30);
        statObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => statObserver.observe(el));

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
