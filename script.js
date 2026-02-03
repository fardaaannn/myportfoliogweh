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
        }, index * 100);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
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
        const waNumber = '6285176849339';
        const waUrl = `https://wa.me/${waNumber}?text=${waMessage}`;
        
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
  
  // Hide toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ===== Initialize Everything =====
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initHamburger();
  initScrollReveal();
  initSkillBars();
  initFormValidation();
  initTypingAnimation();
  initParticles();
  hideLoader();
});

// ===== Loading Animation =====
function hideLoader() {
  const loader = document.querySelector('.loader-wrapper');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 800);
  }
}

// ===== Typing Animation =====
function initTypingAnimation() {
  const typingElement = document.getElementById('typing-text');
  if (!typingElement) return;
  
  const words = ['Mager', 'Pelajar', 'Sleeping Head', 'Rebahaner'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;
  
  function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      typingElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 50;
    } else {
      typingElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 100;
    }
    
    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typeSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 500; // Pause before new word
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
