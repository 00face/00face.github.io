const scrollContainer = document.getElementById("scroll-container");
const diagonalSections = Array.from(
  document.querySelectorAll(".diagonal-scroll > section")
);
const hamburgerBtn = document.getElementById("hamburger-btn");
const navLeftCenter = document.getElementById("nav-left-center");
const navOverlay = document.getElementById("nav-overlay");
const navLinks = document.querySelectorAll(".nav-link");

let currentSection = 0;
let isAnimating = false;

function toggleMobileNav() {
  if (!hamburgerBtn || !navLeftCenter || !navOverlay) return;
  const isActive = navLeftCenter.classList.contains("active");
  if (isActive) closeMobileNav();
  else openMobileNav();
}

function openMobileNav() {
  hamburgerBtn.classList.add("active");
  navLeftCenter.classList.add("active");
  navOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeMobileNav() {
  hamburgerBtn.classList.remove("active");
  navLeftCenter.classList.remove("active");
  navOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

if (hamburgerBtn) hamburgerBtn.addEventListener("click", toggleMobileNav);
if (navOverlay) navOverlay.addEventListener("click", closeMobileNav);

navLinks.forEach((link) => {
  link.addEventListener("click", closeMobileNav);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && navLeftCenter?.classList.contains("active")) {
    closeMobileNav();
  }
});

function getCenterCoords() {
  return {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  };
}

function layoutSections() {
  if (!diagonalSections.length) return;

  const center = getCenterCoords();

  diagonalSections.forEach((section, idx) => {
    section.classList.remove("active", "left", "right", "offscreen");

    if (idx === currentSection) {
      section.style.left = `${center.x}px`;
      section.style.top = `${center.y}px`;
      section.classList.add("active");
    } else if (idx < currentSection) {
      section.style.left = `${center.x - 260}px`;
      section.style.top = `${center.y - 260}px`;
      section.classList.add("left");
    } else if (idx > currentSection) {
      section.style.left = `${center.x + 260}px`;
      section.style.top = `${center.y + 260}px`;
      section.classList.add("right");
    }

    if (Math.abs(idx - currentSection) > 1) {
      section.classList.add("offscreen");
      section.style.left = `${center.x + (idx - currentSection) * 380}px`;
      section.style.top = `${center.y + (idx - currentSection) * 380}px`;
    }
  });

  diagonalSections.forEach((section, idx) => {
    if (idx === currentSection) {
      section.style.overflowY = "auto";
      section.tabIndex = 0;
    } else {
      section.style.overflow = "hidden";
      section.tabIndex = -1;
    }
  });
}

function canVerticallyScroll(el, direction) {
  if (!el) return false;
  if (direction > 0) {
    return el.scrollTop + el.clientHeight < el.scrollHeight - 2;
  }
  return el.scrollTop > 2;
}

function animateToSection(idx) {
  if (isAnimating) return;
  if (idx < 0 || idx >= diagonalSections.length) return;

  isAnimating = true;
  currentSection = idx;
  layoutSections();

  setTimeout(() => {
    isAnimating = false;
  }, 620);
}

function wheelHandler(e) {
  const delta = e.deltaY || e.detail || e.wheelDelta;
  const activeSection = diagonalSections[currentSection];

  if (
    (delta > 0 && canVerticallyScroll(activeSection, 1)) ||
    (delta < 0 && canVerticallyScroll(activeSection, -1))
  ) {
    return;
  }

  e.preventDefault();

  if (delta > 0 && currentSection < diagonalSections.length - 1) {
    animateToSection(currentSection + 1);
    setTimeout(() => {
      diagonalSections[currentSection].scrollTop = 0;
    }, 35);
  } else if (delta < 0 && currentSection > 0) {
    animateToSection(currentSection - 1);
    setTimeout(() => {
      const el = diagonalSections[currentSection];
      el.scrollTop = el.scrollHeight;
    }, 35);
  }
}

let startY = null;

if (scrollContainer) {
  scrollContainer.addEventListener("touchstart", function (e) {
    if (e.touches && e.touches.length === 1) {
      startY = e.touches[0].clientY;
    }
  });

  scrollContainer.addEventListener("touchend", function (e) {
    if (startY === null) return;
    const el = diagonalSections[currentSection];
    const endY = e.changedTouches[0].clientY;

    if (Math.abs(endY - startY) > 40) {
      if (
        endY < startY &&
        !canVerticallyScroll(el, 1) &&
        currentSection < diagonalSections.length - 1
      ) {
        animateToSection(currentSection + 1);
        setTimeout(() => {
          diagonalSections[currentSection].scrollTop = 0;
        }, 37);
      } else if (
        endY > startY &&
        !canVerticallyScroll(el, -1) &&
        currentSection > 0
      ) {
        animateToSection(currentSection - 1);
        setTimeout(() => {
          diagonalSections[currentSection].scrollTop =
            diagonalSections[currentSection].scrollHeight;
        }, 37);
      }
    }

    startY = null;
  });
}

window.addEventListener("keydown", function (e) {
  const el = diagonalSections[currentSection];
  if (!el) return;

  if (e.key === "ArrowDown" || e.key === " " || e.key === "PageDown") {
    if (
      !canVerticallyScroll(el, 1) &&
      currentSection < diagonalSections.length - 1
    ) {
      animateToSection(currentSection + 1);
      setTimeout(() => {
        diagonalSections[currentSection].scrollTop = 0;
      }, 30);
      e.preventDefault();
    }
  } else if (e.key === "ArrowUp" || e.key === "PageUp") {
    if (!canVerticallyScroll(el, -1) && currentSection > 0) {
      animateToSection(currentSection - 1);
      setTimeout(() => {
        diagonalSections[currentSection].scrollTop =
          diagonalSections[currentSection].scrollHeight;
      }, 30);
      e.preventDefault();
    }
  }
});

diagonalSections.forEach((section) => {
  section.addEventListener(
    "wheel",
    function (e) {
      if (section.classList.contains("active")) wheelHandler(e);
    },
    { passive: false }
  );
});

document.querySelectorAll(".nav-left-center a").forEach((link, i) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    animateToSection(i);
    if (navLeftCenter?.classList.contains("active")) closeMobileNav();
  });
});

window.addEventListener("resize", () => {
  layoutSections();
  if (navLeftCenter?.classList.contains("active")) closeMobileNav();
});

layoutSections();

document.getElementById("text-size-btn")?.addEventListener("click", function () {
  document.body.classList.toggle("large-text");
});

document.getElementById("contrast-btn")?.addEventListener("click", function () {
  document.body.classList.toggle("high-contrast");
});
