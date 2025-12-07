const progressBar = document.getElementById("progress-bar");

function updateProgressBar() {
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollPercent = scrollTop / (documentHeight - windowHeight);
  const progress = Math.min(scrollPercent * 100, 100);

  if (progressBar) {
    progressBar.style.transform = `scaleX(${progress / 100})`;
  }
}

// Scroll animatsiyalari uchun Intersection Observer
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const element = entry.target;
      element.style.opacity = "1";
      element.style.transform = "none";
      element.style.transition =
        "opacity 0.6s ease-out, transform 0.6s ease-out";
      observer.unobserve(element);
    }
  });
}, observerOptions);

// Barcha animatsiya qilinadigan elementlarni topish
function initScrollAnimations() {
  // Barcha inline style'li elementlarni topish
  const allElements = document.querySelectorAll("*");
  const animatedElements = [];

  allElements.forEach((element) => {
    const style = element.getAttribute("style") || "";
    if (
      style &&
      (style.includes("opacity: 0") ||
        style.includes("opacity:0") ||
        style.includes("transform: scale(0") ||
        style.includes("transform: translateY(60px)") ||
        style.includes("transform: translateX(-60px)") ||
        style.includes("transform: translateY(-60px)"))
    ) {
      animatedElements.push(element);
    }
  });

  animatedElements.forEach((element) => {
    observer.observe(element);
  });
}

// Banner kartalarini animatsiya qilish
function initBannerCardsAnimation() {
  const bannerCards = document.querySelectorAll(".banner-card");

  if (bannerCards.length === 0) return;

  // Intersection Observer yaratish
  const bannerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const card = entry.target;
          const delay = parseInt(card.getAttribute("data-delay")) || 0;

          setTimeout(() => {
            card.classList.add("animate");
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, delay);

          bannerObserver.unobserve(card);
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  // Har bir kartani observe qilish
  bannerCards.forEach((card) => {
    bannerObserver.observe(card);
  });
}

// Banner orqa fond elementlariga dinamik animatsiyalar qo'shish
function initBannerBackgroundAnimations() {
  const homeSection = document.getElementById("home");
  if (!homeSection) return;

  // Qo'shimcha animatsiyali elementlar yaratish
  const animatedContainer = homeSection.querySelector(
    ".absolute.inset-0.overflow-hidden"
  );
  if (!animatedContainer) return;

  // Qo'shimcha floating particles
  for (let i = 0; i < 3; i++) {
    const particle = document.createElement("div");
    particle.className = "banner-background-particle";
    particle.style.cssText = `
      position: absolute;
      width: ${100 + Math.random() * 150}px;
      height: ${100 + Math.random() * 150}px;
      background: radial-gradient(circle, 
        rgba(${i % 2 === 0 ? "2, 6, 111" : "255, 140, 66"}, ${
      0.08 + Math.random() * 0.05
    }) 0%, 
        transparent 70%);
      border-radius: 50%;
      pointer-events: none;
      z-index: 0;
      top: ${Math.random() * 100}%;
      left: ${Math.random() * 100}%;
      animation: bannerBackgroundParticleMove ${
        15 + Math.random() * 20
      }s ease-in-out infinite;
      animation-delay: ${Math.random() * 5}s;
    `;
    animatedContainer.appendChild(particle);
  }

  // Scroll parallax effekt
  let lastScroll = 0;
  window.addEventListener(
    "scroll",
    () => {
      const scrollY = window.pageYOffset;
      const homeSection = document.getElementById("home");
      if (!homeSection) return;

      const sectionTop = homeSection.offsetTop;
      const sectionHeight = homeSection.offsetHeight;
      const scrollProgress = Math.max(
        0,
        Math.min(1, (scrollY - sectionTop + window.innerHeight) / sectionHeight)
      );

      // Background elementlarni parallax qilish
      const backgroundElements = homeSection.querySelectorAll(
        ".absolute[class*='animate-float']"
      );
      backgroundElements.forEach((element, index) => {
        const speed = 0.3 + (index % 3) * 0.1;
        const offset = scrollProgress * 50 * speed;
        element.style.transform = `translateY(${offset}px) ${
          element.style.transform || ""
        }`;
      });

      lastScroll = scrollY;
    },
    { passive: true }
  );
}

// Smooth scroll uchun anchor linklar
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href !== "#" && href.length > 1) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  });
});

// Button hover effektlari
document.querySelectorAll('button, a[class*="bg-"]').forEach((button) => {
  button.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-2px)";
  });

  button.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0)";
  });
});

// Grid scroll animatsiyasi va Swiper CSS qo'shish
const style = document.createElement("style");
style.textContent = `
        @keyframes grid-scroll {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 20px 20px;
          }
        }
        
        /* Custom Infinite Carousel Styles */
        .infinite-carousel {
          width: 100%;
          position: relative;
          overflow: hidden;
          padding: 20px 0 60px;
        }
        
        .carousel-track {
          display: flex;
          gap: 32px;
          will-change: transform;
          width: max-content;
        }
        
        .carousel-slide {
          flex: 0 0 auto;
          width: calc((100% - 96px) / 4);
          max-width: 390px;
          transition: transform 0.3s ease, opacity 0.3s ease;
        }
        
        .carousel-slide:hover {
          transform: translateY(-5px);
        }
        
        /* Infinite scroll animation - seamless loop */
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .advisory-board-carousel .carousel-track {
          animation: scroll 15s linear infinite;
        }
        
        .team-carousel .carousel-track {
          animation: scroll 18s linear infinite;
        }
        
        .testimonials-carousel .carousel-track {
          animation: scroll 20s linear infinite;
        }
        
        /* Pause on hover */
        .infinite-carousel:hover .carousel-track {
          animation-play-state: paused;
        }
        
        /* Responsive */
        @media (max-width: 1280px) {
          .carousel-slide {
            width: 350px;
            max-width: 350px;
          }
        }
        
        @media (max-width: 1024px) {
          .carousel-slide {
            width: 400px;
            max-width: 400px;
          }
        }
        
        @media (max-width: 768px) {
          .carousel-slide {
            width: 450px;
            max-width: 450px;
          }
          .carousel-track {
            gap: 20px;
          }
        }
        
        @media (max-width: 640px) {
          .carousel-slide {
            width: 320px;
            max-width: 320px;
          }
        }
        
        /* Banner Cards Animations */
        @keyframes bannerCardFadeIn {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
          opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes bannerIconPulse {
          0%, 100% {
            transform: scale(1) rotate(0deg);
          }
          50% {
            transform: scale(1.1) rotate(5deg);
          }
        }
        
        @keyframes bannerIconFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        
        @keyframes bannerNumberCount {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .banner-card {
          position: relative;
          overflow: hidden;
        }
        
        .banner-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(2, 6, 111, 0.1), transparent);
          transition: left 0.5s ease;
        }
        
        .banner-card:hover::before {
          left: 100%;
        }
        
        .banner-card:hover {
          transform: translateY(-5px) scale(1.02);
          border-color: #FF8C42;
        }
        
        .banner-icon-wrapper {
          position: relative;
          display: inline-block;
        }
        
        .banner-icon {
          transition: all 0.3s ease;
        }
        
        .banner-card:hover .banner-icon {
          animation: bannerIconFloat 1.5s ease-in-out infinite;
          color: #FF8C42;
        }
        
        .banner-number {
          transition: all 0.3s ease;
          font-weight: 700;
        }
        
        .banner-card:hover .banner-number {
          transform: scale(1.1);
          color: #FF8C42;
        }
        
        .banner-card.animate {
          animation: bannerCardFadeIn 0.6s ease-out forwards;
        }
        
        .banner-card.animate .banner-icon {
          animation: bannerIconPulse 2s ease-in-out infinite;
          animation-delay: 0.3s;
        }
        
        .banner-card.animate .banner-number {
          animation: bannerNumberCount 0.8s ease-out forwards;
          animation-delay: 0.2s;
        }
        
        /* Banner Background Animations */
        @keyframes backgroundParticleFloat {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.1;
          }
          25% {
            transform: translate(30px, -30px) scale(1.1);
            opacity: 0.15;
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
            opacity: 0.12;
          }
          75% {
            transform: translate(20px, 30px) scale(1.05);
            opacity: 0.18;
          }
        }
        
        @keyframes backgroundParticlePulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.1;
          }
          50% {
            transform: scale(1.3);
            opacity: 0.2;
          }
        }
        
        @keyframes backgroundOrbGlow {
          0%, 100% {
            opacity: 0.2;
            filter: blur(100px);
          }
          50% {
            opacity: 0.35;
            filter: blur(120px);
          }
        }
        
        @keyframes backgroundGridParallax {
          0% {
            background-position: 0 0;
            opacity: 0.05;
          }
          50% {
            background-position: 50px 50px;
            opacity: 0.08;
          }
          100% {
            background-position: 100px 100px;
            opacity: 0.05;
          }
        }
        
        @keyframes backgroundPatternShift {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 40px 40px;
          }
        }
        
        /* Enhanced background animations */
        #home .absolute.inset-0[style*="radial-gradient"] {
          animation: backgroundPatternShift 20s linear infinite, backgroundGridParallax 15s ease-in-out infinite;
        }
        
        #home .absolute[class*="animate-float-particles"] {
          animation: backgroundParticleFloat 25s ease-in-out infinite, backgroundParticlePulse 8s ease-in-out infinite;
        }
        
        #home .absolute[class*="animate-float-particles-delayed"] {
          animation: backgroundParticleFloat 30s ease-in-out infinite, backgroundParticlePulse 10s ease-in-out infinite;
          animation-delay: 2s;
        }
        
        #home .absolute[class*="animate-float-particles-slow"] {
          animation: backgroundParticleFloat 35s ease-in-out infinite, backgroundParticlePulse 12s ease-in-out infinite;
          animation-delay: 1s;
        }
        
        #home .absolute[class*="animate-float-particles-delayed-2"] {
          animation: backgroundParticleFloat 28s ease-in-out infinite, backgroundParticlePulse 9s ease-in-out infinite;
          animation-delay: 3s;
        }
        
        #home .absolute[class*="animate-gradient-orb"] {
          animation: gradient-orb 25s linear infinite, backgroundOrbGlow 6s ease-in-out infinite;
        }
        
        #home .absolute[class*="animate-gradient-orb-reverse"] {
          animation: gradient-orb-reverse 30s linear infinite, backgroundOrbGlow 7s ease-in-out infinite;
        }
        
        #home .absolute[style*="linear-gradient"][style*="background-image"] {
          animation: backgroundGridParallax 20s ease-in-out infinite;
        }
        
        /* Additional floating elements */
        #home::before {
          content: '';
          position: absolute;
          top: 10%;
          right: 15%;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(2, 6, 111, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          animation: backgroundParticleFloat 20s ease-in-out infinite;
          pointer-events: none;
          z-index: 0;
        }
        
        #home::after {
          content: '';
          position: absolute;
          bottom: 15%;
          left: 20%;
          width: 150px;
          height: 150px;
          background: radial-gradient(circle, rgba(255, 140, 66, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          animation: backgroundParticleFloat 18s ease-in-out infinite reverse;
          pointer-events: none;
          z-index: 0;
        }
      `;
document.head.appendChild(style);

// Custom Infinite Carousel Initialization
function initInfiniteCarousels() {
  const carousels = [
    { selector: ".advisory-board-carousel" },
    { selector: ".team-carousel" },
    { selector: ".testimonials-carousel" },
  ];

  carousels.forEach(({ selector }) => {
    const carousel = document.querySelector(selector);
    if (!carousel) return;

    const track = carousel.querySelector(".carousel-track");
    if (!track) return;

    // Check if already initialized
    if (track.dataset.initialized === "true") return;

    // Clone slides for seamless infinite loop
    const slides = Array.from(track.querySelectorAll(".carousel-slide"));
    if (slides.length === 0) return;

    // Duplicate all slides to create seamless loop
    slides.forEach((slide) => {
      const clone = slide.cloneNode(true);
      track.appendChild(clone);
    });

    // Mark as initialized
    track.dataset.initialized = "true";

    // Animation is handled by CSS with -50% transform for seamless loop
  });
}

// Event listenerlar
window.addEventListener("scroll", updateProgressBar);
window.addEventListener("resize", updateProgressBar);

// Initialize carousels
function initializeCarousels() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initInfiniteCarousels);
  } else {
    initInfiniteCarousels();
  }

  // Re-initialize on resize for responsive adjustments (only if not already initialized)
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Only re-init if carousels haven't been initialized yet
      const carousels = document.querySelectorAll(
        '.infinite-carousel .carousel-track[data-initialized="true"]'
      );
      if (carousels.length === 0) {
        initInfiniteCarousels();
      }
    }, 250);
  });
}

// Old Swiper initialization (removed)
function initializeSwipersOnce() {
  // Swiper removed - using custom carousel instead
  if (false) {
    // Swiper kutubxonasi yuklanmaguncha kutish
    let attempts = 0;
    const maxAttempts = 50; // 5 soniya (50 * 100ms)
    const checkSwiper = setInterval(() => {
      attempts++;
      if (typeof Swiper !== "undefined") {
        clearInterval(checkSwiper);
        initSwipers();
      } else if (attempts >= maxAttempts) {
        clearInterval(checkSwiper);
        console.error("Swiper kutubxonasi yuklanmadi");
      }
    }, 100);
  }
}

// Navbar blur effect on scroll
function initNavbarBlur() {
  const navbar = document.getElementById("navbar");
  if (!navbar) {
    console.error("Navbar element not found!");
    return;
  }

  console.log("Navbar found, initializing blur effect...");

  // Set initial background
  navbar.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
  navbar.style.backdropFilter = "blur(8px)";
  navbar.style.webkitBackdropFilter = "blur(8px)";

  const handleScroll = () => {
    const scrollY =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      window.scrollY;

    if (scrollY > 50) {
      navbar.classList.add("navbar-scrolled");
      navbar.style.backdropFilter = "blur(20px)";
      navbar.style.webkitBackdropFilter = "blur(20px)";
      navbar.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
      navbar.style.boxShadow = "0 4px 24px rgba(2, 6, 111, 0.1)";
    } else {
      navbar.classList.remove("navbar-scrolled");
      navbar.style.backdropFilter = "blur(8px)";
      navbar.style.webkitBackdropFilter = "blur(8px)";
      navbar.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
      navbar.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.05)";
    }
  };

  // Add scroll listener
  window.addEventListener("scroll", handleScroll, { passive: true });

  // Initial check
  handleScroll();

  console.log("Navbar blur initialized successfully");
}

// DOM yuklanganda
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    updateProgressBar();
    initScrollAnimations();
    initBannerCardsAnimation();
    initBannerBackgroundAnimations();
    initializeCarousels();
    initNavbarBlur();
  });
} else {
  updateProgressBar();
  initScrollAnimations();
  initBannerCardsAnimation();
  initBannerBackgroundAnimations();
  initializeCarousels();
  initNavbarBlur();
}

// Sayt to'liq yuklanganda
window.addEventListener("load", () => {
  updateProgressBar();
  // Carousel'ni initialize qilish
  setTimeout(initInfiniteCarousels, 100);
});

// Resize event'ida Swiper'ni update qilish
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (advisorySwiper) {
      try {
        advisorySwiper.update();
      } catch (e) {
        console.warn("Error updating advisory swiper:", e);
      }
    }
    if (teamSwiper) {
      try {
        teamSwiper.update();
      } catch (e) {
        console.warn("Error updating team swiper:", e);
      }
    }
    if (testimonialsSwiper) {
      try {
        testimonialsSwiper.update();
      } catch (e) {
        console.warn("Error updating testimonials swiper:", e);
      }
    }
  }, 250);
});

const techStackIcons = {
  frontend: [
    {
      name: "React.js",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1150px-React-icon.svg.png",
      color: "#61DAFB",
    },
    {
      name: "Tailwind CSS",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tailwind_CSS_Logo.svg/2560px-Tailwind_CSS_Logo.svg.png",
      color: "#06B6D4",
    },
    {
      name: "TypeScript",
      icon: "https://cdn-icons-png.flaticon.com/512/5968/5968381.png",
      color: "#3178C6",
    },
    {
      name: "Next Js",
      icon: "https://assets.streamlinehq.com/image/private/w_300,h_300,ar_1/f_auto/v1/icons/2/nextjs-dqhvgu9iwvacgwnwl8bs25.png/nextjs-ghnqttyc6ffbnqnn8xlrpj.png?_a=DATAg1AAZAA0",
      color: "#3178C6",
    },
    {
      name: "Zustand",
      icon: "https://www.pedroalonso.net/blog/zustand-intro/zustand.png",
      color: "#3178C6",
    },
    {
      name: "Tanstack Query",
      icon: "https://images.seeklogo.com/logo-png/43/1/react-query-logo-png_seeklogo-435661.png",
      color: "#3178C6",
    },
    {
      name: "Redux",
      icon: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/redux-icon.png",
      color: "#3178C6",
    },
  ],
  backend: [
    {
      name: "Django",
      icon: "https://www.svgrepo.com/show/373554/django.svg",
      color: "#092E20",
    },
    {
      name: "Django REST",
      icon: "https://media2.dev.to/dynamic/image/width=1280,height=720,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fpdlelneo05ui6m4l1cqj.png ",
      color: "#092E20",
    },
    {
      name: "Python",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/2048px-Python-logo-notext.svg.png",
      color: "#3776AB",
    },
  ],
  database: [
    {
      name: "PostgreSQL",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Postgresql_elephant.svg/993px-Postgresql_elephant.svg.png",
      color: "#336791",
    },
    {
      name: "Redis",
      icon: "https://images.icon-icons.com/2415/PNG/512/redis_original_wordmark_logo_icon_146369.png",
      color: "#DC382D",
    },
  ],
  storage: [
    {
      name: "AWS S3",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Amazon-S3-Logo.svg/1712px-Amazon-S3-Logo.svg.png",
      color: "#FF9900",
    },
    {
      name: "MinIO",
      icon: "https://images.seeklogo.com/logo-png/34/1/minio-logo-png_seeklogo-340054.png",
      color: "#FF9900",
    },
  ],
  aiml: [
    {
      name: "GPT-4 API",
      icon: "https://vukrosic.gallerycdn.vsassets.io/extensions/vukrosic/all-in-one-ai-interface/0.0.6/1684273672176/Microsoft.VisualStudio.Services.Icons.Default",
      color: "#10A37F",
    },
    {
      name: "TensorFlow",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Tensorflow_logo.svg/449px-Tensorflow_logo.svg.png",
      color: "#FF6F00",
    },

    {
      name: "scikit-learn",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Scikit_learn_logo_small.svg/2560px-Scikit_learn_logo_small.svg.png",
      color: "#F7931E",
    },
  ],
  fintech: [
    {
      name: "Escrow API",
      icon: "https://cdn-icons-png.flaticon.com/512/14597/14597072.png",
      color: "#10B981",
    },
    {
      name: "Islomiy Nasiya",
      icon: "https://png.pngtree.com/png-vector/20250905/ourmid/pngtree-stylized-3d-dollar-sign-icon-in-glossy-green-with-metallic-highlights-png-image_17370346.webp",
      color: "#10B981",
    },
  ],
  logistics: [
    {
      name: "Courier APIs",
      icon: "https://cdn-icons-png.flaticon.com/512/9815/9815930.png",
      color: "#FF8C42",
    },
  ],
  infrastructure: [
    {
      name: "AWS S3",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Amazon-S3-Logo.svg/1712px-Amazon-S3-Logo.svg.png",
      color: "#FF9900",
    },
    {
      name: "Docker",
      icon: "https://cdn-icons-png.flaticon.com/512/919/919853.png",
      color: "#2496ED",
    },
  ],
};

// Helper function to convert hex to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Technology Stack Filter Handler
function initTechStackSelect() {
  const filterButtons = document.querySelectorAll(".tech-filter-btn");
  const container = document.getElementById("tech-icons-container");

  if (!filterButtons.length || !container) return;

  // Get all technologies with their categories
  const allTechnologies = [];
  Object.keys(techStackIcons).forEach((category) => {
    techStackIcons[category].forEach((tech) => {
      allTechnologies.push({ ...tech, category });
    });
  });

  // Render technologies
  function renderTechnologies(filter = "all") {
    const filtered =
      filter === "all"
        ? allTechnologies
        : allTechnologies.filter((tech) => tech.category === filter);

    container.innerHTML = filtered
      .map((tech, index) => {
        const techColor = tech.color || "#10B981";
        const rgbColor = hexToRgb(techColor);
        const rgbaColor = rgbColor
          ? `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.2)`
          : "rgba(16, 185, 129, 0.2)";
        const rgbaShadow = rgbColor
          ? `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.3)`
          : "rgba(16, 185, 129, 0.3)";

        return `
            <div 
              class="tech-icon-card bg-white border-2 border-[#E5E7EB] rounded-xl p-6 transition-all duration-500 flex flex-col items-center justify-center text-center group cursor-pointer transform hover:-translate-y-2"
              data-category="${tech.category}"
              data-tech-color="${techColor}"
              data-rgba-color="${rgbaColor}"
              data-rgba-shadow="${rgbaShadow}"
              style="animation-delay: ${
                index * 0.05
              }s; opacity: 0; border-color: ${techColor}40;"
            >
              <div class="relative mb-4">
                <div class="absolute inset-0 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" style="background: ${rgbaColor};"></div>
                <div class="relative text-5xl group-hover:scale-125 transition-transform duration-500 group-hover:rotate-6" style="filter: drop-shadow(0 0 12px ${techColor}CC);">${
          tech.icon.startsWith("http") ||
          tech.icon.startsWith("https") ||
          tech.icon.startsWith("/")
            ? `<img src="${tech.icon}" alt="${tech.name}" class="w-12 h-12 object-contain" />`
            : tech.icon
        }</div>
              </div>
              <div class="text-[14px] font-bold transition-colors duration-300 uppercase" style="color: ${techColor};">${
          tech.name
        }</div>
              <div class="mt-2 text-[11px] text-[#6B7280] opacity-0 group-hover:opacity-100 transition-opacity duration-300">${
                tech.category.charAt(0).toUpperCase() + tech.category.slice(1)
              }</div>
            </div>
          `;
      })
      .join("");

    // Add hover effects to cards
    const cards = container.querySelectorAll(".tech-icon-card");
    cards.forEach((card) => {
      const techColor = card.getAttribute("data-tech-color");
      const rgbaShadow = card.getAttribute("data-rgba-shadow");

      card.addEventListener("mouseenter", function () {
        this.style.borderColor = techColor;
        this.style.boxShadow = `0 8px 24px ${rgbaShadow}`;
      });

      card.addEventListener("mouseleave", function () {
        this.style.borderColor = `${techColor}40`;
        this.style.boxShadow = "none";
      });
    });

    // Fade in animation
    setTimeout(() => {
      cards.forEach((card) => {
        card.style.opacity = "1";
        card.style.animation = "fadeInUp 0.6s ease-out forwards";
      });
    }, 50);
  }

  // Filter button click handlers
  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const filter = this.getAttribute("data-filter");

      // Update active state
      filterButtons.forEach((btn) => {
        btn.classList.remove(
          "active",
          "bg-gradient-to-r",
          "from-[#02066F]",
          "to-[#FF8C42]",
          "hover:shadow-[0_4px_12px_rgba(2,6,111,0.3)]"
        );
        btn.classList.add(
          "bg-white",
          "border-2",
          "border-[#E5E7EB]",
          "text-[#374151]",
          "hover:border-[#02066F]",
          "hover:text-[#02066F]",
          "hover:shadow-[0_2px_8px_rgba(2,6,111,0.1)]"
        );
        if (btn.classList.contains("text-white")) {
          btn.classList.remove("text-white");
        }
      });

      this.classList.add(
        "active",
        "bg-[#02066F]",
        "text-white",
        "border-[#02066F]",
        "hover:shadow-[0_4px_12px_rgba(2,6,111,0.3)]"
      );
      this.classList.remove(
        "bg-white",
        "border-2",
        "border-[#E5E7EB]",
        "text-[#374151]",
        "hover:border-[#02066F]",
        "hover:text-[#02066F]",
        "hover:shadow-[0_2px_8px_rgba(2,6,111,0.1)]"
      );

      // Render filtered technologies
      renderTechnologies(filter);
    });
  });

  // Initial render with all technologies
  renderTechnologies("all");
}

// Navbar functionality
function initNavbar() {
  const navbar = document.getElementById("navbar");
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuIcon = document.getElementById("menu-icon");
  const closeIcon = document.getElementById("close-icon");

  // Mobile menu toggle
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", function () {
      const isHidden = mobileMenu.classList.contains("hidden");
      if (isHidden) {
        mobileMenu.classList.remove("hidden");
        menuIcon.classList.add("hidden");
        closeIcon.classList.remove("hidden");
      } else {
        mobileMenu.classList.add("hidden");
        menuIcon.classList.remove("hidden");
        closeIcon.classList.add("hidden");
      }
    });
  }

  // Navbar scroll effect
  let lastScroll = 0;
  window.addEventListener("scroll", function () {
    const currentScroll = window.pageYOffset;

    if (navbar) {
      if (currentScroll > 100) {
        navbar.classList.add("shadow-lg");
        navbar.style.backgroundColor = "rgba(255, 255, 255, 0.98)";
      } else {
        navbar.classList.remove("shadow-lg");
        navbar.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
      }
    }

    lastScroll = currentScroll;
  });

  // Close mobile menu when clicking on a link
  const mobileLinks = mobileMenu?.querySelectorAll("a");
  mobileLinks?.forEach((link) => {
    link.addEventListener("click", function () {
      mobileMenu.classList.add("hidden");
      menuIcon.classList.remove("hidden");
      closeIcon.classList.add("hidden");
    });
  });
}

// Custom Cursor Animation
function initCustomCursor() {
  // Create cursor elements
  const cursor = document.createElement("div");
  cursor.className = "custom-cursor";
  const cursorDot = document.createElement("div");
  cursorDot.className = "custom-cursor-dot";
  const cursorTrail = document.createElement("div");
  cursorTrail.className = "custom-cursor-trail";

  document.body.appendChild(cursor);
  document.body.appendChild(cursorDot);
  document.body.appendChild(cursorTrail);

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  let dotX = 0;
  let dotY = 0;
  let trailX = 0;
  let trailY = 0;

  // Update cursor position
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Animate cursor
  function animateCursor() {
    // Main cursor (smooth follow)
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.left = cursorX + "px";
    cursor.style.top = cursorY + "px";

    // Dot cursor (faster follow)
    dotX += (mouseX - dotX) * 0.3;
    dotY += (mouseY - dotY) * 0.3;
    cursorDot.style.left = dotX + "px";
    cursorDot.style.top = dotY + "px";

    // Trail cursor (slower follow)
    trailX += (mouseX - trailX) * 0.05;
    trailY += (mouseY - trailY) * 0.05;
    cursorTrail.style.left = trailX + "px";
    cursorTrail.style.top = trailY + "px";

    requestAnimationFrame(animateCursor);
  }

  animateCursor();

  // Hover effects
  const interactiveElements = document.querySelectorAll(
    "a, button, .swiper-slide, .tech-icon-card, select"
  );
  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.style.transform = "scale(1.5)";
      cursor.style.borderColor = "#FF8C42";
      cursorDot.style.transform = "scale(1.5)";
      cursorDot.style.background = "#02066F";
      cursorTrail.style.width = "60px";
      cursorTrail.style.height = "60px";
      cursorTrail.style.borderColor = "rgba(255, 140, 66, 0.5)";
    });

    el.addEventListener("mouseleave", () => {
      cursor.style.transform = "scale(1)";
      cursor.style.borderColor = "#02066F";
      cursorDot.style.transform = "scale(1)";
      cursorDot.style.background = "#FF8C42";
      cursorTrail.style.width = "40px";
      cursorTrail.style.height = "40px";
      cursorTrail.style.borderColor = "rgba(2, 6, 111, 0.3)";
    });
  });

  // Hide default cursor on desktop
  if (window.innerWidth > 768) {
    document.body.style.cursor = "none";
  }
}

// Initialize on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function () {
    initTechStackSelect();
    initNavbar();
    initCustomCursor();
    initBannerCardsAnimation();
    initBannerBackgroundAnimations();
  });
} else {
  initTechStackSelect();
  initNavbar();
  initCustomCursor();
  initBannerCardsAnimation();
  initBannerBackgroundAnimations();
}
