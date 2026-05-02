(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canvas = document.createElement("canvas");
  canvas.className = "futuristic-starfield";
  canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);

  const particleLayer = document.createElement("div");
  particleLayer.className = "floating-particles";
  particleLayer.setAttribute("aria-hidden", "true");
  const particleCount = window.innerWidth < 768 ? 7 : 14;
  particleLayer.innerHTML = Array.from({ length: particleCount }, (_, index) => (
    `<span style="--x:${Math.random() * 100}vw;--y:${Math.random() * 100}vh;--d:${8 + Math.random() * 10}s;--delay:${index * -0.7}s;"></span>`
  )).join("");
  document.body.prepend(particleLayer);

  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let stars = [];
  let raf = 0;

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = width < 768 ? 55 : 110;
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.4 + 0.35,
      vx: Math.random() * 0.18 + 0.04,
      alpha: Math.random() * 0.6 + 0.25,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    stars.forEach((star) => {
      ctx.globalAlpha = star.alpha;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
      star.x += star.vx;
      if (star.x > width + 4) {
        star.x = -4;
        star.y = Math.random() * height;
      }
    });
    ctx.globalAlpha = 1;
    if (!reduceMotion) {
      raf = window.requestAnimationFrame(draw);
    }
  }

  resize();
  draw();
  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("beforeunload", () => window.cancelAnimationFrame(raf));

  document.querySelectorAll(".brand-panel, .left-panel").forEach((panel) => {
    if (panel.querySelector(".ym-menu-toggle")) return;

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "ym-menu-toggle";
    toggle.setAttribute("aria-label", "Open menu");
    toggle.setAttribute("aria-expanded", "false");
    toggle.textContent = "☰";

    toggle.addEventListener("click", () => {
      const isOpen = panel.classList.toggle("ym-menu-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
      toggle.textContent = isOpen ? "×" : "☰";
    });

    panel.appendChild(toggle);
  });

  const hero = document.getElementById("heroScreen");
  const heroChooseLanguage = document.getElementById("heroChooseLanguage");
  const heroChooseLanguageNav = document.getElementById("heroChooseLanguageNav");
  const heroLaunchApp = document.getElementById("heroLaunchApp");
  const heroMenuButton = document.getElementById("heroMenuButton");
  const heroNav = document.querySelector(".hero-nav");
  const languageBackButton = document.getElementById("languageBackButton");

  function openLanguageSelection() {
    if (!hero) return;
    hero.classList.add("hero-exiting");
    window.setTimeout(() => {
      hero.classList.remove("active", "hero-exiting");
      if (typeof window.showScreen === "function") {
        window.showScreen("language");
      } else {
        document.querySelectorAll(".screen").forEach((screen) => screen.classList.remove("active"));
        document.getElementById("languageScreen")?.classList.add("active");
      }
    }, reduceMotion ? 0 : 260);
  }

  heroChooseLanguage?.addEventListener("click", openLanguageSelection);
  heroChooseLanguageNav?.addEventListener("click", openLanguageSelection);
  heroLaunchApp?.addEventListener("click", openLanguageSelection);

  languageBackButton?.addEventListener("click", () => {
    const heroScreen = document.getElementById("heroScreen");
    document.querySelectorAll(".screen").forEach((screen) => screen.classList.remove("active"));
    heroScreen?.classList.add("active");
  });

  heroMenuButton?.addEventListener("click", () => {
    const isOpen = heroNav?.classList.toggle("hero-menu-open");
    heroMenuButton.setAttribute("aria-expanded", String(Boolean(isOpen)));
    heroMenuButton.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    heroMenuButton.textContent = isOpen ? "\u00d7" : "\u2630";
  });
})();
