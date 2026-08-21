/* Schedyl — interactions */

(function () {
  "use strict";

  // ---------- Rotating hero word ----------
  const rotator = document.querySelector(".rotate__word");
  if (rotator) {
    const words = (rotator.dataset.words || "").split(",").filter(Boolean);
    let idx = 0;
    if (words.length > 1) {
      setInterval(() => {
        idx = (idx + 1) % words.length;
        rotator.style.animation = "none";
        rotator.textContent = words[idx];
        // force reflow to restart animation
        void rotator.offsetWidth;
        rotator.style.animation = "";
      }, 2200);
    }
  }

  // ---------- Count-up numbers ----------
  const counters = document.querySelectorAll(".count");
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count || "0");
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const value = target * eased;
      const decimals = Number.isInteger(target) ? 0 : 1;
      el.textContent = prefix + value.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  // ---------- Scroll reveal + counter trigger ----------
  const revealEls = document.querySelectorAll(".reveal");
  const counterObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.querySelectorAll(".count").forEach(animateCount);
          obs.unobserve(el);
        }
      });
    },
    { threshold: 0.4 }
  );

  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealEls.forEach((el) => {
    revealObserver.observe(el);
    if (el.querySelector(".count")) counterObserver.observe(el);
  });

  // ---------- Early access form ----------
  const form = document.getElementById("access-form");
  const note = document.getElementById("access-note");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector("input[type='email']");
      const value = input.value.trim();
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      if (!valid) {
        input.focus();
        note.textContent = "Please enter a valid email address.";
        note.classList.remove("success");
        return;
      }
      // Placeholder — no backend yet (in development)
      note.textContent = "You're on the list! We'll be in touch when Schedyl is ready for takeoff. ✈️";
      note.classList.add("success");
      form.reset();
    });
  }
})();
