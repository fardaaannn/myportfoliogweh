/**
 * ===== Configuration Constants =====
 * Central place for magic numbers and configuration
 */
const CONFIG = {
  // Loader timing
  LOADER_DELAY: 800,
  
  // Cursor settings
  CURSOR_TRAIL_COUNT: 8,
  CURSOR_FOLLOW_SPEED: 0.15,
  
  // Animation timings
  TOAST_DURATION: 3000,
  TYPING_SPEED: 100,
  TYPING_DELETE_SPEED: 50,
  TYPING_PAUSE_END: 2000,
  TYPING_PAUSE_START: 500,
  
  // Scroll reveal
  REVEAL_DELAY_INCREMENT: 100,
  REVEAL_THRESHOLD: 0.1,
  
  // WhatsApp
  WA_NUMBER: '6285176849339',
  
  // Padding
  NAV_PADDING_OFFSET: 20
};

// ===== Dynamic Body Padding (for mobile responsiveness) =====
function setBodyPadding() {
  const nav = document.querySelector('nav');
  if (nav) {
    const navHeight = nav.offsetHeight;
    document.body.style.paddingTop = (navHeight + CONFIG.NAV_PADDING_OFFSET) + 'px';
  }
}

// ===== Dark Mode Toggle =====
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.checked = savedTheme === 'dark';
    themeToggle.addEventListener('change', toggleTheme);
  }
}

function toggleTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const newTheme = themeToggle && themeToggle.checked ? 'dark' : 'light';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

// ===== Hamburger Menu =====
function initHamburger() {
  const hamburger = document.querySelector('.hamburger');
  const menu = document.querySelector('.menu');
  
  if (hamburger && menu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      menu.classList.toggle('active');
    });
    
    // Close menu when clicking a link
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        menu.classList.remove('active');
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !menu.contains(e.target)) {
        hamburger.classList.remove('active');
        menu.classList.remove('active');
      }
    });
  }
}

// ===== Scroll Reveal Animation =====
function initScrollReveal() {
  const cards = document.querySelectorAll('.kartu-ios');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * CONFIG.REVEAL_DELAY_INCREMENT);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: CONFIG.REVEAL_THRESHOLD,
    rootMargin: '0px 0px -50px 0px'
  });
  
  cards.forEach(card => observer.observe(card));
}

// ===== Skill Progress Animation =====
function initSkillBars() {
  const skillBars = document.querySelectorAll('.skill-progress');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const width = entry.target.getAttribute('data-width');
        entry.target.style.width = width + '%';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  skillBars.forEach(bar => observer.observe(bar));
}

// ===== Form Validation =====
function initFormValidation() {
  const form = document.querySelector('form');
  
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      const inputs = form.querySelectorAll('input, textarea');
      
      inputs.forEach(input => {
        const errorMsg = input.parentElement.querySelector('.error-message');
        
        // Reset state
        input.classList.remove('error', 'success');
        if (errorMsg) errorMsg.style.display = 'none';
        
        // Validate
        if (input.hasAttribute('required') && !input.value.trim()) {
          isValid = false;
          input.classList.add('error');
          if (errorMsg) {
            errorMsg.textContent = 'Field ini wajib diisi';
            errorMsg.style.display = 'block';
          }
        } else if (input.type === 'email' && input.value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(input.value)) {
            isValid = false;
            input.classList.add('error');
            if (errorMsg) {
              errorMsg.textContent = 'Format email tidak valid';
              errorMsg.style.display = 'block';
            }
          } else {
            input.classList.add('success');
          }
        } else if (input.value.trim()) {
          input.classList.add('success');
        }
      });
      
      if (isValid) {
        // Get form values
        const nama = document.getElementById('nama')?.value || '';
        const pesan = document.getElementById('pesan')?.value || '';
        
        // Format WhatsApp message
        const waMessage = `*Pesan dari Website Fardan.Dev*%0A%0A` +
          `*Nama:* ${nama}%0A%0A` +
          `*Pesan:*%0A${pesan}`;
        
        // WhatsApp number (Indonesia: 62)
        const waUrl = `https://wa.me/${CONFIG.WA_NUMBER}?text=${waMessage}`;
        
        // Open WhatsApp
        window.open(waUrl, '_blank');
        
        showToast('Membuka WhatsApp... 📱');
        form.reset();
        inputs.forEach(input => input.classList.remove('success'));
      }
    });
    
    // Real-time validation on blur
    form.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('blur', function() {
        if (this.value.trim()) {
          this.classList.remove('error');
          this.classList.add('success');
          const errorMsg = this.parentElement.querySelector('.error-message');
          if (errorMsg) errorMsg.style.display = 'none';
        }
      });
    });
  }
}

// ===== Toast Notification =====
function showToast(message) {
  // Remove existing toast
  const existingToast = document.querySelector('.toast');
  if (existingToast) existingToast.remove();
  
  // Create new toast
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  // Show toast
  setTimeout(() => toast.classList.add('show'), 100);
  
  // Hide toast after configured duration
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, CONFIG.TOAST_DURATION);
}

// ===== Initialize Everything =====
document.addEventListener('DOMContentLoaded', () => {
  initRandomLoader(); // Initialize random loader first
  initTheme();
  initHamburger();
  initScrollReveal();
  initSkillBars();
  initFormValidation();
  initTypingAnimation();
  initParticles();
  initCustomCursor();
  setBodyPadding();
  hideLoader();
  initChatbot(); // AI Chatbot
});

// Update padding on resize for responsiveness
window.addEventListener('resize', setBodyPadding);

// ===== Custom Cursor Effect =====
function initCustomCursor() {
  // Don't init on touch devices
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    return;
  }
  
  // Create cursor elements
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  document.body.appendChild(cursor);
  
  const cursorDot = document.createElement('div');
  cursorDot.className = 'cursor-dot';
  document.body.appendChild(cursorDot);
  
  // Create trail elements
  const trailCount = CONFIG.CURSOR_TRAIL_COUNT;
  const trails = [];
  for (let i = 0; i < trailCount; i++) {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.opacity = (1 - (i / trailCount)) * 0.5;
    trail.style.width = (6 - (i * 0.5)) + 'px';
    trail.style.height = (6 - (i * 0.5)) + 'px';
    document.body.appendChild(trail);
    trails.push({
      element: trail,
      x: 0,
      y: 0
    });
  }
  
  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  
  // Track mouse movement
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Update dot position immediately
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
  });
  
  // Smooth cursor animation
  function animateCursor() {
    // Smooth follow for main cursor
    cursorX += (mouseX - cursorX) * CONFIG.CURSOR_FOLLOW_SPEED;
    cursorY += (mouseY - cursorY) * CONFIG.CURSOR_FOLLOW_SPEED;
    
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    
    // Animate trails
    let prevX = mouseX;
    let prevY = mouseY;
    
    trails.forEach((trail, index) => {
      const speed = 0.2 - (index * 0.015);
      trail.x += (prevX - trail.x) * speed;
      trail.y += (prevY - trail.y) * speed;
      
      trail.element.style.left = trail.x + 'px';
      trail.element.style.top = trail.y + 'px';
      
      prevX = trail.x;
      prevY = trail.y;
    });
    
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
  
  // Hover effects for interactive elements
  const hoverElements = document.querySelectorAll('a, button, .kartu-ios, .project-card, .social-link, input, textarea, .theme-switch');
  
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
    });
  });
  
  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorDot.style.opacity = '0';
    trails.forEach(trail => trail.element.style.opacity = '0');
  });
  
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    cursorDot.style.opacity = '1';
    trails.forEach((trail, i) => trail.element.style.opacity = (1 - (i / trailCount)) * 0.5);
  });
}

// ===== Sequential Loading Animation =====
function initRandomLoader() {
  const loaderContents = document.querySelectorAll('.loader-content');
  if (loaderContents.length === 0) return;
  
  // Get current loader index from localStorage, default to 0
  let currentIndex = parseInt(localStorage.getItem('loaderIndex') || '0');
  
  // Make sure index is valid
  if (currentIndex >= loaderContents.length || currentIndex < 0) {
    currentIndex = 0;
  }
  
  // Activate the current loader
  loaderContents[currentIndex].classList.add('active');
  
  // Save next index for next page load (cycles through 0-6)
  const nextIndex = (currentIndex + 1) % loaderContents.length;
  localStorage.setItem('loaderIndex', nextIndex.toString());
}

function hideLoader() {
  const loader = document.querySelector('.loader-wrapper');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, CONFIG.LOADER_DELAY);
  }
}

// ===== Typing Animation =====
function initTypingAnimation() {
  const typingElement = document.getElementById('typing-text');
  if (!typingElement) return;
  
  const words = ['Mager', 'Pelajar', 'Sleepy Head', 'Rebahaner'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = CONFIG.TYPING_SPEED;
  
  function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      typingElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = CONFIG.TYPING_DELETE_SPEED;
    } else {
      typingElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = CONFIG.TYPING_SPEED;
    }
    
    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typeSpeed = CONFIG.TYPING_PAUSE_END;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = CONFIG.TYPING_PAUSE_START;
    }
    
    setTimeout(type, typeSpeed);
  }
  
  type();
}

// ===== Starfield Background =====
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let stars = [];
  let shootingStars = [];
  let mouse = { x: null, y: null };
  
  // Resize canvas
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', () => {
    resizeCanvas();
    createStars();
    if (typeof createShapes === 'function') createShapes();
  });
  
  // Track mouse for subtle glow effect
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });
  
  // Star class
  class Star {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.baseOpacity = Math.random() * 0.5 + 0.3;
      this.opacity = this.baseOpacity;
      this.twinkleSpeed = Math.random() * 0.02 + 0.01;
      this.twinkleOffset = Math.random() * Math.PI * 2;
      // Movement like original particles
      this.speedX = Math.random() * 0.3 - 0.15;
      this.speedY = Math.random() * 0.3 - 0.15;
      // Star color (slightly different hues of white/blue)
      const colorChoice = Math.random();
      if (colorChoice < 0.7) {
        this.color = { r: 255, g: 255, b: 255 }; // White
      } else if (colorChoice < 0.85) {
        this.color = { r: 200, g: 220, b: 255 }; // Blue-ish
      } else {
        this.color = { r: 255, g: 240, b: 200 }; // Yellow-ish
      }
    }
    
    update(time) {
      // Twinkling effect
      this.opacity = this.baseOpacity + Math.sin(time * this.twinkleSpeed + this.twinkleOffset) * 0.3;
      this.opacity = Math.max(0.1, Math.min(1, this.opacity));
      
      // Movement
      this.x += this.speedX;
      this.y += this.speedY;
      
      // Mouse interaction - stars move away from cursor
      if (mouse.x && mouse.y) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 100) {
          this.x -= dx * 0.02;
          this.y -= dy * 0.02;
        }
      }
      
      // Wrap around edges
      if (this.x > canvas.width) this.x = 0;
      if (this.x < 0) this.x = canvas.width;
      if (this.y > canvas.height) this.y = 0;
      if (this.y < 0) this.y = canvas.height;
    }
    
    draw() {
      const { r, g, b } = this.color;
      
      // Draw glow for brighter stars
      if (this.size > 1.5) {
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 4);
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${this.opacity * 0.3})`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Draw star core
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // Shooting Star class
  class ShootingStar {
    constructor() {
      this.reset();
    }
    
    reset() {
      // Random starting position across the entire top
      this.x = Math.random() * canvas.width;
      this.y = -10;
      this.length = Math.random() * 100 + 60;
      this.speed = Math.random() * 18 + 12;
      this.opacity = 1;
      // Angle varies between 30 and 60 degrees (going down-right or down-left)
      const goLeft = Math.random() > 0.5;
      if (goLeft) {
        this.angle = Math.PI * 0.6 + (Math.random() * 0.3); // Goes down-left
      } else {
        this.angle = Math.PI * 0.15 + (Math.random() * 0.3); // Goes down-right
      }
      this.active = false;
    }
    
    activate() {
      this.active = true;
      this.x = Math.random() * canvas.width;
      this.y = -10;
      this.opacity = 1;
      // Re-randomize angle on activation
      const goLeft = Math.random() > 0.5;
      if (goLeft) {
        this.angle = Math.PI * 0.6 + (Math.random() * 0.3);
      } else {
        this.angle = Math.PI * 0.15 + (Math.random() * 0.3);
      }
    }
    
    update() {
      if (!this.active) return;
      
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      this.opacity -= 0.01;
      
      if (this.y > canvas.height || this.x > canvas.width || this.opacity <= 0) {
        this.reset();
      }
    }
    
    draw() {
      if (!this.active) return;
      
      const tailX = this.x - Math.cos(this.angle) * this.length;
      const tailY = this.y - Math.sin(this.angle) * this.length;
      
      const gradient = ctx.createLinearGradient(tailX, tailY, this.x, this.y);
      gradient.addColorStop(0, 'transparent');
      gradient.addColorStop(0.8, `rgba(255, 255, 255, ${this.opacity * 0.5})`);
      gradient.addColorStop(1, `rgba(255, 255, 255, ${this.opacity})`);
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(this.x, this.y);
      ctx.stroke();
      
      // Bright head
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // Create stars
  function createStars() {
    stars = [];
    const starCount = Math.floor((canvas.width * canvas.height) / 8000);
    for (let i = 0; i < starCount; i++) {
      stars.push(new Star());
    }
  }
  
  // Geometric Shape class for light mode
  class GeometricShape {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 20 + 10;
      this.speedX = Math.random() * 0.5 - 0.25;
      this.speedY = Math.random() * 0.5 - 0.25;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.02;
      this.opacity = Math.random() * 0.15 + 0.05;
      // Shape types: 0=triangle, 1=square, 2=hexagon, 3=circle
      this.type = Math.floor(Math.random() * 4);
      // Colors using accent blue with variations
      const hue = 210 + Math.random() * 30 - 15;
      this.color = `hsla(${hue}, 80%, 60%, ${this.opacity})`;
      this.strokeColor = `hsla(${hue}, 80%, 50%, ${this.opacity * 0.5})`;
    }
    
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.rotation += this.rotationSpeed;
      
      // Mouse interaction
      if (mouse.x && mouse.y) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 120) {
          this.x -= dx * 0.01;
          this.y -= dy * 0.01;
        }
      }
      
      // Wrap around
      if (this.x > canvas.width + this.size) this.x = -this.size;
      if (this.x < -this.size) this.x = canvas.width + this.size;
      if (this.y > canvas.height + this.size) this.y = -this.size;
      if (this.y < -this.size) this.y = canvas.height + this.size;
    }
    
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.fillStyle = this.color;
      ctx.strokeStyle = this.strokeColor;
      ctx.lineWidth = 1;
      
      ctx.beginPath();
      
      switch(this.type) {
        case 0: // Triangle
          ctx.moveTo(0, -this.size);
          ctx.lineTo(this.size * 0.866, this.size * 0.5);
          ctx.lineTo(-this.size * 0.866, this.size * 0.5);
          ctx.closePath();
          break;
        case 1: // Square
          ctx.rect(-this.size/2, -this.size/2, this.size, this.size);
          break;
        case 2: // Hexagon
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const x = Math.cos(angle) * this.size * 0.7;
            const y = Math.sin(angle) * this.size * 0.7;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          break;
        case 3: // Circle
          ctx.arc(0, 0, this.size * 0.5, 0, Math.PI * 2);
          break;
      }
      
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  }
  
  // Array for geometric shapes
  let shapes = [];
  
  // Create geometric shapes for light mode
  function createShapes() {
    shapes = [];
    const shapeCount = Math.floor((canvas.width * canvas.height) / 25000);
    for (let i = 0; i < shapeCount; i++) {
      shapes.push(new GeometricShape());
    }
  }
  
  // Initialize shapes
  createShapes();
  
  // Create shooting stars (more of them!)
  for (let i = 0; i < 8; i++) {
    shootingStars.push(new ShootingStar());
  }
  
  // Initialize stars
  createStars();
  
  // Randomly trigger shooting stars (more frequently!)
  setInterval(() => {
    const inactiveStars = shootingStars.filter(s => !s.active);
    if (inactiveStars.length > 0 && Math.random() < 0.9) {
      inactiveStars[0].activate();
    }
  }, 100);
  
  // Draw night sky gradient
  function drawSkyGradient() {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0a0a1a'); // Deep space
    gradient.addColorStop(0.3, '#0d1528'); // Dark blue
    gradient.addColorStop(0.6, '#1a1a2e'); // Purple tint
    gradient.addColorStop(1, '#16213e'); // Horizon
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  
  // Light mode alternative - subtle blue gradient
  function drawLightSky() {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(135, 206, 250, 0.1)');
    gradient.addColorStop(1, 'rgba(240, 248, 255, 0.1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  
  // Mouse glow effect
  function drawMouseGlow() {
    if (!mouse.x || !mouse.y) return;
    
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (!isDark) return;
    
    const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 150);
    gradient.addColorStop(0, 'rgba(100, 150, 255, 0.05)');
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 150, 0, Math.PI * 2);
    ctx.fill();
  }
  
  let time = 0;
  
  // Animation loop
  function animate() {
    time++;
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw sky (only visible in dark mode)
    if (isDark) {
      drawSkyGradient();
      drawMouseGlow();
    } else {
      drawLightSky();
    }
    
    // Update and draw stars (dark mode) or shapes (light mode)
    if (isDark) {
      stars.forEach(star => {
        star.update(time);
        star.draw();
      });
      
      // Shooting stars (dark mode only)
      shootingStars.forEach(star => {
        star.update();
        star.draw();
      });
    } else {
      // Light mode: Geometric shapes
      shapes.forEach(shape => {
        shape.update();
        shape.draw();
      });
    }
    
    requestAnimationFrame(animate);
  }
  
  animate();
}

// ===== AI Chatbot =====
function initChatbot() {
  // ⚠️ GANTI API KEY INI dengan API key kamu dari https://aistudio.google.com/apikey
  const GEMINI_API_KEY = 'AIzaSyBB2MqXZVvLK0kU-WW-majWO524oud-qqU';
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemma-3-4b-it:generateContent?key=${GEMINI_API_KEY}`;
  
  // ===== 1. CONTEXT-AWARE: Detect current page =====
  function getPageContext() {
    const path = window.location.pathname.toLowerCase();
    const fileName = path.split('/').pop() || 'index.html';
    
    if (fileName.includes('profil')) return 'Profil';
    if (fileName.includes('skills') || fileName.includes('skill')) return 'Skills';
    if (fileName.includes('project')) return 'Projects';
    if (fileName.includes('kontak') || fileName.includes('contact')) return 'Kontak';
    return 'Home';
  }
  
  const currentPage = getPageContext();

  // ===== PERSONALITY SYSTEM =====
  // Gen Z personality only (hardcoded, no switching)
  const currentPersonality = 'genz';

  // Shared data block for both prompts
  const SHARED_DATA = `📋 DATA FARDAN:
Nama: Fardan Azzuhri | Web: Fardan.Dev | Status: Pelajar & Web Dev pemula, belajar dari nol
GitHub: fardaaannn | IG: @aku_fardann | Email: fardaaannn@gmail.com

🛠️ SKILLS: HTML, CSS, JavaScript (masih terus belajar!)

🚀 PROJECT:
1. MyKeuanganGweh — app keuangan pribadi (HTML/CSS/JS) → fardaaannn.github.io/dompetku/
2. MyCatatanGweh — app catatan digital, ada dark mode (HTML/CSS/JS) → fardaaannn.github.io/mycatatangweh/
3. MyKasGweh — app kas berbasis Next.js → mykasgweh.vercel.app

😎 FUN FACTS: Suka hampir semua makanan halal. Langkah belajar: nyalain laptop → buka VS Code → tidur 😴. Jadwal coding: Senin nonton Netflix, Selasa nonton YouTube (becanda!). Motto: santai tapi tetap produktif 🚀

🌐 WEBSITE INI: 5 halaman (Home, Profil, Skills, Projects, Kontak), dark/light mode, 7 loading animation random, custom cursor, starfield background, glassmorphism design, responsive.

📍 KONTEKS: Pengunjung lagi di halaman "${currentPage}".`;

  // ✨ Gen Z (Dynamic Prompt based on Gender)
  function getGenZPrompt() {
    const call = getGenderCall();
    return `Kamu adalah "Sawit Ai", asisten AI di website portfolio Fardan Azzuhri. Kepribadianmu: GEN Z ABIS, OVERLY DRAMATIC, HYPE, dan HEBOH. Lo ngomongnya pake bahasa Gen Z Indonesia yang penuh slang: "${call}", "slay", "literally", "no cap", "lowkey", "highkey", "vibe", "periodt", "sus", "sigma", "brainrot", "skibidi", "rizz", "fr fr", "ngl", "it's giving", "ate that", "purr", "queen/king", "main character energy", dll. Lo BANYAK pake emoji dan capslock buat emphasis.

CONTOH GAYA JAWAB:
- "OMG ${call}!! Lo nanya soal Fardan?? Literally the most sigma dev ever no cap 💅✨🔥"
- "Ngl project-nya tuh lowkey fire ${call}, it's giving main character energy 🚀💀"
- "PERIODT!! Skill-nya emang masih vibes learning arc tapi ATE THAT sih fr fr 💅"
- "${call} THAT'S SO SUS 😭💀 tapi oke gue jawab cuz I'm generous like that ✨"
- "No cap this website hit different, it's giving premium sigma vibes purr 🔥"

${SHARED_DATA}

📏 ATURAN:
- Singkat & padat (1-3 kalimat), tapi bisa lebih expressive
- HARUS pake bahasa Gen Z (${call}, slay, literally, no cap, lowkey, dll)
- Overly dramatic dan hype tentang APAPUN
- BANYAK emoji (minimal 2-3 per jawaban)
- Pake CAPSLOCK buat emphasis
- Boleh pake formatting: **bold**
- JANGAN pake backtick/inline code untuk kata-kata biasa
- Jangan share info yang nggak ada di data
- JANGAN offensive/rasis/SARA
- JANGAN PERNAH menunjukkan emosi/ekspresi/aksi dalam bentuk apapun. Contoh yang DILARANG: *gasping*, (terharu), menghela napas, *crying*, (screaming), dll. Cukup jawab langsung tanpa narasi ekspresi.

🌍 MULTILINGUAL: If someone asks in English, reply in English but keep the Gen Z energy. Match the language but KEEP THE VIBES.`;
  }

  // 😠 Jutek (Hardcoded, no switching)
  const PROMPT_JUTEK = `Kamu adalah "Pria Sawit Ai", asisten AI di website portfolio Fardan Azzuhri. Kepribadianmu: JUTEK, MALAS, SOK SIBUK, tapi sebenarnya PEDULI. Lo ngomongnya pake bahasa Indonesia sehari-hari yang singkat, padat, dan cenderung ketus. Lo jarang pake emoji, kalo pake pun cuma satu atau dua yang pas.

CONTOH GAYA JAWAB:
- "Nanya soal Fardan? Ya udah, dia web dev pemula."
- "Projectnya? Cek aja sendiri, udah ada linknya kan."
- "Skillnya masih belajar. Udah, gitu aja."
- "Koneksi internet lo jelek kali, makanya error."

${SHARED_DATA}

📏 ATURAN:
- Singkat & padat (1-2 kalimat), cenderung ketus.
- JANGAN pake emoji berlebihan.
- JANGAN pake capslock.
- JANGAN pake formatting: **bold**.
- JANGAN pake backtick/inline code untuk kata-kata biasa.
- Jangan share info yang nggak ada di data.
- JANGAN offensive/rasis/SARA.
- JANGAN PERNAH menunjukkan emosi/ekspresi/aksi dalam bentuk apapun. Contoh yang DILARANG: *gasping*, (terharu), menghela napas, *crying*, (screaming), dll. Cukup jawab langsung tanpa narasi ekspresi.

🌍 MULTILINGUAL: If someone asks in English, reply in English but keep the jutek energy. Match the language but KEEP THE VIBES.`;

  // Greeting per personality per page
  function getGreeting(personality) {
    const call = getGenderCall();
    const greetings = {
      jutek: {
        Profil: 'Oh, lo lagi di halaman Profil. Mau kepo soal Fardan? Ya udah tanya aja, gue jawab kalo mood.',
        Skills: 'Lo lagi di halaman Skills. Mau tau skill Fardan? Tanya aja, tapi jangan nanya yang aneh-aneh.',
        Projects: 'Lo lagi ngecek Projects. Mau tanya soal project? Silakan, gue lagi baik hari ini.',
        Kontak: 'Lo di halaman Kontak. Mau hubungin Fardan? Ya hubungin aja langsung, ngapain nanya gue.',
        Home: 'Yo. Gue Pria Sawit Ai, asisten AI-nya Fardan. Mau nanya? Ketik aja, gue jawab kalo gue mau.'
      },
      genz: {
        Profil: `OMG ${call}!! 💅✨ Lo lagi di halaman Profil! Mau kepo soal Fardan? LITERALLY tanya aja ${call}, I got u!! 🔥`,
        Skills: `YOOO ${call}!! 🚀 Lo lagi di halaman Skills nih! Mau tau skill Fardan yang sigma banget? TANYA AJA no cap! ✨`,
        Projects: `BESTIE AHHH!! 💀🔥 Lo ngecek Projects! Lowkey project-nya fire banget sih, mau tau lebih? ASK MEEE!! ✨`, // Kept bestie here for variety or change to call if preferred
        Kontak: `HIII ${call}!! 💅 Lo lagi di Kontak! Mau reach out ke Fardan? That's so slay of u, tanya aja!! 🫶✨`,
        Home: `OMG HAI ${call}!! ✨🔥 Gue Sawit Ai, asisten AI-nya Fardan yang literally the most iconic! Mau nanya? GAS ${call}!! 💅`
      }
    };
    return greetings[personality]?.[currentPage] || greetings[personality]?.Home;
  }

  function getInitReply(personality) {
    const call = getGenderCall();
    if (personality === 'genz') {
      return `YASS ${call} gue Sawit Ai!! ✨💅 Tanya apa aja soal Fardan, gue spill semuanya no cap!! 🔥`;
    }
    return 'Iye iye gue Pria Sawit Ai. Mau nanya? Tanya aja, gue jawab kalo mood.';
  }

  function getActivePrompt() {
    return currentPersonality === 'genz' ? getGenZPrompt() : PROMPT_JUTEK;
  }

  // Initialize conversation with system context
  let conversationHistory = [];
  let isProcessing = false;
  let isChatOpen = false;

  // ===== 4. SOUND NOTIFICATION (Web Audio API) =====
  function playNotifSound() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      
      // First tone
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.frequency.value = 830;
      osc1.type = 'sine';
      gain1.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      osc1.start(audioCtx.currentTime);
      osc1.stop(audioCtx.currentTime + 0.15);

      // Second tone (higher)
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.frequency.value = 1200;
      osc2.type = 'sine';
      gain2.gain.setValueAtTime(0.15, audioCtx.currentTime + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc2.start(audioCtx.currentTime + 0.12);
      osc2.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      // Audio not available, skip silently
    }
  }

  // ===== 3. MARKDOWN SUPPORT =====
  function renderMarkdown(text) {
    let html = text
      // Escape HTML first
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // Strip backticks
      .replace(/`/g, '')
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Links
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      // Auto-link URLs
      .replace(/(^|[^"'])(https?:\/\/[^\s<]+)/g, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')
      // Line breaks
      .replace(/\n/g, '<br>');
    return html;
  }

  // ===== 2. CHAT HISTORY (localStorage) =====
  const PERSONALITY_KEY = 'chatbot_personality';
  const HISTORY_KEY = 'chatbot_history';
  const CONV_KEY = 'chatbot_conversation'; // For maintaining context
  const GENDER_KEY = 'chatbot_gender'; // New: Save gender preference


  let userGender = localStorage.getItem(GENDER_KEY); // 'male' or 'female' or null

  function saveChatHistory(messages) {
    try {
      // Save only last 50 messages
      const toSave = messages.slice(-50);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(toSave));
    } catch (e) { /* Storage full, skip */ }
  }

  function loadChatHistory() {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) { return null; }
  }

  function saveConvHistory() {
    try {
      localStorage.setItem(CONV_KEY, JSON.stringify(conversationHistory.slice(-20)));
    } catch (e) { /* skip */ }
  }

  function loadConvHistory() {
    try {
      const saved = localStorage.getItem(CONV_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.length >= 2) return parsed;
      }
    } catch (e) { /* skip */ }
    return null;
  }

  function clearChatHistory() {
    localStorage.removeItem(HISTORY_KEY);
    localStorage.removeItem(CONV_KEY);
    // Do not remove GENDER_KEY or PERSONALITY_KEY
    messagesContainer.innerHTML = '';
    conversationHistory = [
      { role: 'user', parts: [{ text: getActivePrompt() }] },
      { role: 'model', parts: [{ text: getInitReply(currentPersonality) }] }
    ];
    addMessage(getGreeting(currentPersonality), 'bot', false);
  }

  // Create chatbot HTML
  const chatbotHTML = `
    <button class="chatbot-toggle" id="chatbot-toggle" title="Chat dengan Sawit Ai">🌴</button>
    <div class="chatbot-window" id="chatbot-window">
      <!-- Gender Selection Overlay -->
      <div id="gender-selection" style="display: none; position: absolute; inset: 0; background: var(--bg-secondary); z-index: 2000; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 20px; padding: 20px;">
        <h3>Pilih Panggilanmu ✨</h3>
        <p>Biar kita makin akrab, lo mau dipanggil apa?</p>
        <div style="display: flex; gap: 15px;">
          <button class="gender-btn" data-gender="male" style="padding: 10px 20px; background: #007aff; color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: bold;">👑 KING</button>
          <button class="gender-btn" data-gender="female" style="padding: 10px 20px; background: #ff3b30; color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: bold;">👑 QUEEN</button>
        </div>
      </div>

      <div class="chatbot-header">
        <div class="chatbot-avatar">🌴</div>
        <div class="chatbot-header-info">
          <h4>Sawit Ai</h4>
          <p><span class="chatbot-status-dot"></span>Online — ${currentPage}</p>
        </div>
        <button class="chatbot-clear-btn" id="chatbot-clear" title="Hapus riwayat chat">🗑️</button>
      </div>
      <div class="chatbot-messages" id="chatbot-messages"></div>
      <div class="chatbot-input">
        <input type="text" id="chatbot-input-field" placeholder="Ketik pesan..." autocomplete="off">
        <button id="chatbot-send" title="Kirim">➤</button>
      </div>
      <p style="font-size: 10px; color: #666; text-align: center; margin-bottom: 10px;">Sawit Ai can make mistakes. So, please recheck the responses.</p>
    </div>
  `;

  // Inject chatbot into page
  const chatbotContainer = document.createElement('div');
  chatbotContainer.innerHTML = chatbotHTML;
  document.body.appendChild(chatbotContainer);

  // Get elements
  const toggleBtn = document.getElementById('chatbot-toggle');
  const chatWindow = document.getElementById('chatbot-window');
  const messagesContainer = document.getElementById('chatbot-messages');
  const inputField = document.getElementById('chatbot-input-field');
  const sendBtn = document.getElementById('chatbot-send');
  const clearBtn = document.getElementById('chatbot-clear');

  // Load chat history or show context-aware greeting
  const savedMessages = loadChatHistory();
  const savedConv = loadConvHistory();
  
  if (savedMessages && savedMessages.length > 0) {
    // Restore saved messages
    savedMessages.forEach(msg => {
      addMessage(msg.text, msg.type, false);
    });
    // Restore conversation history
    if (savedConv) {
      conversationHistory = savedConv;
    } else {
      // If messages exist but conv history is lost, re-init conv history
      conversationHistory = [
        { role: 'user', parts: [{ text: getActivePrompt() }] },
        { role: 'model', parts: [{ text: getInitReply(currentPersonality) }] }
      ];
    }
  } else {
    // Show context-aware greeting
    conversationHistory = [
      { role: 'user', parts: [{ text: getActivePrompt() }] },
      { role: 'model', parts: [{ text: getInitReply(currentPersonality) }] }
    ];
    addMessage(getGreeting(currentPersonality), 'bot', false);
  }

  // Toggle chat window
  toggleBtn.addEventListener('click', () => {
    isChatOpen = chatWindow.classList.toggle('open');
    toggleBtn.classList.toggle('active');
    toggleBtn.innerHTML = isChatOpen ? '✕' : '<img src="Logo Pria Sawit Ai.png" alt="Logo" style="width: 100%; height: 100%; object-fit: cover;">';
    
    if (isChatOpen) {
      if (!userGender) {
        document.getElementById('gender-selection').style.display = 'flex';
      } else {
        setTimeout(() => inputField.focus(), 300);
      }
    }
  });

  // Gender Selection Logic
  document.querySelectorAll('.gender-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      userGender = e.target.getAttribute('data-gender');
      localStorage.setItem(GENDER_KEY, userGender);
      document.getElementById('gender-selection').style.display = 'none';
      
      // Update greeting after selection
      if (conversationHistory.length === 2) { // Only initial prompt and reply
        messagesContainer.innerHTML = ''; // Clear existing greeting
        addMessage(getGreeting(currentPersonality), 'bot', false);
      }
      setTimeout(() => inputField.focus(), 300);
    });
  });

  // Clear chat button
  clearBtn.addEventListener('click', clearChatHistory);

  // Send message on Enter
  inputField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Send message on button click
  sendBtn.addEventListener('click', sendMessage);

  // Add message to chat (with markdown support for bot)
  function addMessage(text, type, save = true) {
    const msg = document.createElement('div');
    msg.className = `chat-message ${type}`;
    
    if (type === 'bot') {
      // Render markdown for bot messages
      msg.innerHTML = renderMarkdown(text);
    } else {
      msg.textContent = text;
    }
    
    messagesContainer.appendChild(msg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Save to localStorage
    if (save) {
      const currentMessages = loadChatHistory() || [];
      currentMessages.push({ text, type });
      saveChatHistory(currentMessages);
    }
  }

  // Show typing indicator
  function showTyping() {
    const typing = document.createElement('div');
    typing.className = 'chat-typing';
    typing.id = 'typing-indicator';
    typing.innerHTML = '<span></span><span></span><span></span>';
    messagesContainer.appendChild(typing);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Remove typing indicator
  function hideTyping() {
    const typing = document.getElementById('typing-indicator');
    if (typing) typing.remove();
  }

  // Send message to Gemini API
  async function sendMessage() {
    const text = inputField.value.trim();
    if (!text || isProcessing) return;

    // Check if API key is set
    if (GEMINI_API_KEY === 'MASUKKAN_API_KEY_DISINI') {
      addMessage(text, 'user');
      inputField.value = '';
      addMessage('⚠️ API key belum di-set. Minta Fardan untuk menambahkan Gemini API key di script.js ya!', 'bot');
      return;
    }

    isProcessing = true;
    sendBtn.disabled = true;

    // Add user message
    addMessage(text, 'user');
    inputField.value = '';

    // Show typing indicator
    showTyping();

    // Add to conversation history
    conversationHistory.push({ role: 'user', parts: [{ text }] });

    try {
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: conversationHistory,
          generationConfig: {
            temperature: 0.85,
            maxOutputTokens: 1024,
            topP: 0.9
          }
        })
      });

      const data = await response.json();
      hideTyping();

      if (data.error) {
        console.error('Gemini API Error:', data.error);
        addMessage(`Maaf, ada error dari API: ${data.error.message || 'Unknown error'} 😅`, 'bot');
        conversationHistory.pop();
      } else if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        const botReply = data.candidates[0].content.parts[0].text;
        addMessage(botReply, 'bot');
        conversationHistory.push({ role: 'model', parts: [{ text: botReply }] });
        saveConvHistory();
        
        // Sound notification if chat is closed
        if (!isChatOpen) {
          playNotifSound();
        }
        
        // Keep history manageable
        if (conversationHistory.length > 20) {
          conversationHistory = conversationHistory.slice(-20);
          saveConvHistory();
        }
      } else {
        console.error('Unexpected response:', data);
        addMessage('Maaf, respons tidak terduga 😅 Coba lagi ya!', 'bot');
        conversationHistory.pop();
      }
    } catch (error) {
      hideTyping();
      console.error('Chatbot fetch error:', error);
      addMessage('Gagal terhubung ke AI. Pastikan koneksi internet kamu lancar ya! 🌐', 'bot');
      conversationHistory.pop();
    }

    isProcessing = false;
    sendBtn.disabled = false;
    inputField.focus();
  }
}

// ===== Music Playlist Player =====
const musicPlayer = {
  playlist: [
    'Different Heaven - Safe And Sound _ House _ NCS - Copyright Free Music.mp3',
    'After Dark.mp3',
    'Cup Of Joe.mp3',
    'Hunter X Hunter.mp3'
  ],
  currentIndex: 0,
  isLooping: false,
  isPlaying: false,
  audio: document.getElementById('audioKu'),
  
  // UI Elements
  btnPrev: document.getElementById('btnPrev'),
  btnPlay: document.getElementById('btnPlay'),
  btnNext: document.getElementById('btnNext'),
  btnLoop: document.getElementById('btnLoop'),
  
  init() {
    if (!this.audio) return;
    
    // Set initial song
    this.audio.src = this.playlist[this.currentIndex];
    
    // Event Listeners
    this.btnPrev?.addEventListener('click', () => this.prevSong());
    this.btnPlay?.addEventListener('click', () => this.togglePlay());
    this.btnNext?.addEventListener('click', () => this.nextSong());
    this.btnLoop?.addEventListener('click', () => this.toggleLoop());
    
    // Auto-play next song when ended
    this.audio.addEventListener('ended', () => {
      if (this.isLooping) {
        this.audio.currentTime = 0;
        this.audio.play();
      } else {
        this.nextSong();
      }
    });
    
    // Update play button when paused/played externally
    this.audio.addEventListener('play', () => this.updatePlayButton(true));
    this.audio.addEventListener('pause', () => this.updatePlayButton(false));
  },
  
  togglePlay() {
    if (this.audio.paused) {
      this.audio.play();
      this.isPlaying = true;
    } else {
      this.audio.pause();
      this.isPlaying = false;
    }
    this.updatePlayButton(this.isPlaying);
  },
  
  updatePlayButton(isPlaying) {
    if (this.btnPlay) {
      this.btnPlay.innerHTML = isPlaying ? '⏸️' : '🎵';
      this.btnPlay.title = isPlaying ? 'Jeda' : 'Putar';
      this.btnPlay.style.backgroundColor = isPlaying ? '#ff3b30' : ''; // Red when playing
    }
  },
  
  nextSong() {
    this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
    this.loadAndPlay();
  },
  
  prevSong() {
    this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
    this.loadAndPlay();
  },
  
  loadAndPlay() {
    this.audio.src = this.playlist[this.currentIndex];
    this.audio.play();
    this.isPlaying = true;
    this.updatePlayButton(true);
    
    // Optional: Show toast which song is playing
    const songName = this.playlist[this.currentIndex].replace('.mp3', '');
    if (typeof showToast === 'function') {
      showToast(`🎵 Memutar: ${songName}`);
    }
  },
  
  toggleLoop() {
    this.isLooping = !this.isLooping;
    if (this.btnLoop) {
      this.btnLoop.innerHTML = this.isLooping ? '🔂' : '🔁';
      this.btnLoop.title = this.isLooping ? 'Loop: On' : 'Loop: Off';
      this.btnLoop.style.backgroundColor = this.isLooping ? 'var(--accent)' : '';
      this.btnLoop.style.color = this.isLooping ? 'white' : '';
    }
    if (typeof showToast === 'function') {
      showToast(this.isLooping ? 'Loop Mode: ON 🔂' : 'Loop Mode: OFF 🔁');
    }
  }
};

// Initialize Music Player when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  musicPlayer.init();
});