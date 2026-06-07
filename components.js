// ============================================================================
// Shared site chrome (loader, particle canvas, nav, footer)
// ----------------------------------------------------------------------------
// These elements used to be copy-pasted into all 5 HTML pages. They now live
// here as a single source of truth and are injected at runtime. This file is
// loaded BEFORE script.js so the markup exists by the time script.js runs its
// DOMContentLoaded init (which queries nav, .loader-wrapper, #audioKu, etc).
//
// Note: nav and .loader-wrapper are `position: fixed`, so injecting them does
// not cause layout shift. The rest of the page content stays in each HTML file.
// ============================================================================
(function () {
  "use strict";

  const LOADER_HTML = `
    <!-- Loading Animation - Random 7 Styles -->
    <div class="loader-wrapper">
      <div class="loader-content loader-morphing">
        <div class="blob"></div>
        <div class="morphing-logo"><span>F</span><span>a</span><span>r</span><span>d</span><span>a</span><span>n</span><span>.</span><span>D</span><span>e</span><span>v</span></div>
        <div class="loader-text">Loading...</div>
      </div>
      <div class="loader-content loader-glitch">
        <div class="scanlines"></div>
        <div class="glitch-logo">Fardan.Dev</div>
        <div class="loader-text">INITIALIZING_</div>
      </div>
      <div class="loader-content loader-progress">
        <div class="logo">Fardan.Dev</div>
        <div class="progress-bar"><div class="progress-fill"></div></div>
        <div class="loader-text">Loading assets...</div>
      </div>
      <div class="loader-content loader-letter">
        <div class="letter-reveal"><span>F</span><span>a</span><span>r</span><span>d</span><span>a</span><span>n</span><span>.</span><span>D</span><span>e</span><span>v</span></div>
        <div class="loader-text">Loading...</div>
      </div>
      <div class="loader-content loader-orbit">
        <div class="orbit-container">
          <div class="center-logo">F.Dev</div>
          <div class="orbit orbit-1"><div class="planet"></div></div>
          <div class="orbit orbit-2"><div class="planet"></div></div>
          <div class="orbit orbit-3"><div class="planet"></div></div>
        </div>
        <div class="loader-text">Launching...</div>
      </div>
      <div class="loader-content loader-wave">
        <div class="wave-logo">Fardan.Dev</div>
        <div class="wave-container"><div class="wave"></div></div>
        <div class="loader-text">Loading...</div>
      </div>
      <div class="loader-content loader-skeleton">
        <div class="skeleton-box">
          <div class="skeleton-header">
            <div class="skeleton skeleton-avatar"></div>
            <div class="skeleton-text">
              <div class="skeleton skeleton-title"></div>
              <div class="skeleton skeleton-subtitle"></div>
            </div>
          </div>
          <div class="skeleton skeleton-line"></div>
          <div class="skeleton skeleton-line"></div>
          <div class="skeleton skeleton-line"></div>
        </div>
        <div class="loader-text">Loading content...</div>
      </div>
    </div>

    <!-- Particle Background -->
    <canvas id="particles-canvas"></canvas>`;

  // Single source of truth for the navigation links.
  const NAV_LINKS = [
    { href: "index.html", label: "Home" },
    { href: "profil.html", label: "Profil" },
    { href: "skills.html", label: "Skills" },
    { href: "projects.html", label: "Projects" },
    { href: "kontak.html", label: "Kontak" },
  ];

  // Determine the current page filename to mark the active link.
  function currentPage() {
    const path = window.location.pathname;
    const file = path.substring(path.lastIndexOf("/") + 1);
    return file === "" ? "index.html" : file;
  }

  function buildNav() {
    const active = currentPage();
    const links = NAV_LINKS.map((l) => {
      const isActive = l.href === active;
      return `<a href="${l.href}"${isActive ? ' class="active"' : ""}>${l.label}</a>`;
    }).join("\n        ");

    return `
    <nav>
      <div class="hamburger">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div class="menu">
        ${links}
      </div>
      <div class="nav-right">
        <div class="music-controls">
          <button id="btnPrev" class="music-btn" title="Lagu Sebelumnya">⏮️</button>
          <button id="btnPlay" class="music-btn" title="Putar/Jeda">🎵</button>
          <button id="btnNext" class="music-btn" title="Lagu Selanjutnya">⏭️</button>
          <button id="btnLoop" class="music-btn" title="Loop: Off">🔁</button>
        </div>

        <audio id="audioKu">
          <source src="" type="audio/mpeg" />
        </audio>

        <label class="theme-switch">
          <input type="checkbox" id="theme-toggle" />
          <span class="slider">
            <span class="sun-icon">☀️</span>
            <span class="moon-icon">🌙</span>
          </span>
        </label>
      </div>
    </nav>`;
  }

  const FOOTER_HTML = `
    <footer>
      <p>Made with ❤️ by <strong>Fardan Azzuhri</strong></p>
      <p>© 2026 Fardan.Dev - All rights reserved</p>
      <div class="social-links">
        <a href="https://github.com/fardaaannn" target="_blank" rel="noopener noreferrer" class="social-link" title="GitHub">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
        </a>
        <a href="https://www.instagram.com/aku_fardann/" target="_blank" rel="noopener noreferrer" class="social-link" title="Instagram">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
        </a>
        <a href="mailto:fardaaannn@gmail.com" class="social-link" title="Email">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
        </a>
      </div>
    </footer>`;

  // Inject chrome. This script runs synchronously at the end of <body>, before
  // script.js, so all page content is already parsed.
  document.body.insertAdjacentHTML("afterbegin", LOADER_HTML + buildNav());
  document.body.insertAdjacentHTML("beforeend", FOOTER_HTML);
})();
