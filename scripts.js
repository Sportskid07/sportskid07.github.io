document.addEventListener("DOMContentLoaded", () => {
  /* HERO SLIDER */
  const slider = document.getElementById("heroSlider");
  const slides = slider.querySelectorAll(".slide");
  const dotsWrap = document.getElementById("heroDots");
  let active = 0;
  let timer;

  // create dots
  slides.forEach((_, i) => {
    const btn = document.createElement("button");
    btn.className = "dot" + (i === 0 ? " active" : "");
    btn.type = "button";
    btn.setAttribute("aria-label", "Go to slide " + (i + 1));
    btn.addEventListener("click", () => goTo(i, true));
    dotsWrap.appendChild(btn);
  });
  const dots = dotsWrap.querySelectorAll(".dot");

  function update() {
    slides.forEach((s, i) => s.classList.toggle("active", i === active));
    dots.forEach((d, i) => d.classList.toggle("active", i === active));
  }

  function next() {
    active = (active + 1) % slides.length;
    update();
  }

  function goTo(i, manual = false) {
    active = i;
    update();
    if (manual) pause();
  }

  function start() {
    timer = setInterval(next, 4500);
  }

  function pause() {
    clearInterval(timer);
    setTimeout(start, 6000);
  }

  slider.addEventListener("mouseenter", () => clearInterval(timer));
  slider.addEventListener("mouseleave", start);

  start();
});
/* ---------- MVM: small interactions: collapsible news + scroll fade ---------- */
(function () {
  // Collapsible / accordion for update cards (mobile)
  function initCollapsibleNews() {
    const articles = document.querySelectorAll('.updates article');
    if (!articles.length) return;
    // add toggle buttons for small screens
    articles.forEach((art) => {
      // already has summary/details? if not, create simple structure
      if (!art.querySelector('.summary')) {
        const children = Array.from(art.childNodes);
        const h = art.querySelector('h4');
        const p = art.querySelector('p');
        const time = art.querySelector('.date') || art.querySelector('time');
        // wrap existing p as .summary and create .details if needed
        if (p) p.classList.add('summary');
        // details placeholder (for expansion)
        const details = document.createElement('div');
        details.className = 'details';
        details.innerHTML = '<p class="muted">Read full update on the News page.</p>';
        art.appendChild(details);
      }

      // add a toggle button if not present
      if (!art.querySelector('.toggle-btn')) {
        const btn = document.createElement('button');
        btn.className = 'toggle-btn';
        btn.type = 'button';
        btn.innerText = 'Read more';
        btn.addEventListener('click', function () {
          const details = art.querySelector('.details');
          const isOpen = details.style.display === 'block';
          details.style.display = isOpen ? 'none' : 'block';
          btn.innerText = isOpen ? 'Read more' : 'Collapse';
          if (!isOpen) details.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
        art.appendChild(btn);
      }
    });
  }

  // Fade-in on scroll (adds .visible to elements)
  function initScrollFade() {
    const observers = [];
    const items = document.querySelectorAll('.institutions, .updates, .mvm-channel, .inst-card, .updates article, .video-card');
    if (!items.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          // optionally unobserve after visible
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach((el) => {
      el.classList.add('fade-in');
      io.observe(el);
    });
    observers.push(io);
  }

  // init on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    initCollapsibleNews();
    initScrollFade();
  });

})();
/* scripts.js — slider + video handling + small interactions */
document.addEventListener("DOMContentLoaded", () => {
  /* GENERIC SLIDER + VIDEO AWARE LOGIC */
  const slider = document.getElementById("heroSlider");
  const slides = Array.from(slider.querySelectorAll(".slide"));
  const dotsWrap = document.getElementById("heroDots");
  let active = 0;
  let timer = null;
  const intervalMs = 4800;
  let autoplay = true;

  // create dots
  slides.forEach((s, i) => {
    const btn = document.createElement("button");
    btn.className = "dot" + (i === 0 ? " active" : "");
    btn.type = "button";
    btn.setAttribute("aria-label", "Go to slide " + (i + 1));
    btn.dataset.index = i;
    btn.addEventListener("click", () => goTo(i, true));
    dotsWrap.appendChild(btn);
  });
  const dots = Array.from(dotsWrap.children);

  // prev/next
  slider.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      if (action === 'next') next();
      else prev();
    });
  });

  // helpers to control video in current slide (if any)
  function currentVideo() {
    const slide = slides[active];
    if (!slide) return null;
    return slide.querySelector('video');
  }
  function pauseCurrentVideo() {
    const v = currentVideo();
    if (v && !v.paused) v.pause();
  }
  function playCurrentVideo() {
    const v = currentVideo();
    if (v && v.paused) {
      // attempt to play (muted by default to allow autoplay on mobile)
      v.muted = false; // let user unmute via controls; we keep it muted on autoplay start
      v.play().catch(()=>{/* playback prevented */});
    }
  }

  // update display
  function update() {
    slides.forEach((s, idx) => {
      const isActive = idx === active;
      s.classList.toggle('active', isActive);
      s.setAttribute('aria-hidden', (!isActive).toString());
    });
    dots.forEach((d, idx) => d.classList.toggle('active', idx === active));
  }

  function next() { goTo((active + 1) % slides.length); }
  function prev() { goTo((active - 1 + slides.length) % slides.length); }
  function goTo(i, userTriggered = false) {
    // if leaving a slide with video, pause it
    const prevVideo = slides[active].querySelector('video');
    if (prevVideo && !prevVideo.paused) {
      try { prevVideo.pause(); prevVideo.currentTime = 0; } catch (e) {}
    }

    active = i;
    update();

    // if new slide has a video and we auto-advance into it, we pause autoplay
    const v = currentVideo();
    if (v) {
      // show video controls, don't autoplay the video from JS; allow user to play
      // however, if autoplay triggered the video slide, keep autoplay paused
      pauseAutoplay();
      // ensure video is visible and paused initially
      try { v.pause(); v.currentTime = 0; } catch(e){}
      // add event listeners to manage autoplay/resume
      v.addEventListener('play', () => pauseAutoplay());
      v.addEventListener('ended', () => resumeAutoplayAfterDelay(1200));
    } else {
      // if no video, resume autoplay (after a short delay so user sees slide)
      if (!userTriggered) {
        pauseAutoplay(0);
        startAutoplay();
      } else {
        // if user clicked, pause autoplay briefly
        pauseAutoplay(6000);
      }
    }
  }

  // autoplay management
  function startAutoplay() {
    stopAutoplay();
    if (!autoplay) return;
    timer = setInterval(() => {
      // do not advance if current slide contains playing video
      const v = currentVideo();
      if (v && !v.paused) return;
      next();
    }, intervalMs);
  }
  function stopAutoplay() { if (timer) { clearInterval(timer); timer = null; } }
  function pauseAutoplay(ms = 6000) {
    stopAutoplay();
    if (ms > 0) {
      setTimeout(() => { if (autoplay) startAutoplay(); }, ms);
    }
  }
  function resumeAutoplayAfterDelay(ms = 1000) {
    stopAutoplay();
    setTimeout(() => { if (autoplay) startAutoplay(); }, ms);
  }

  // pause autoplay on hover/focus
  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', () => { if (autoplay) startAutoplay(); });
  slider.addEventListener('focusin', stopAutoplay);
  slider.addEventListener('focusout', () => { if (autoplay) startAutoplay(); });

  // keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  // initialize
  update();
  startAutoplay();

  // Extras: make the hero video responsive and accessible
  const heroVideo = document.getElementById('heroVideo');
  if (heroVideo) {
    // ensure controls are available on mobile; let user unmute
    heroVideo.controls = true;
    heroVideo.setAttribute('playsinline', '');
    heroVideo.addEventListener('play', () => {
      // when user plays the video, stop slider autoplay so video isn't interrupted
      pauseAutoplay(3600000); // long pause while user watches (1 hour)
    });
    heroVideo.addEventListener('pause', () => {
      // resume autoplay after short delay
      resumeAutoplayAfterDelay(1200);
    });
    // if the video is clicked on mobile, toggle controls / mute handling
    heroVideo.addEventListener('click', () => {
      // clicking toggles play/pause
      if (heroVideo.paused) heroVideo.play().catch(()=>{});
      else heroVideo.pause();
    });
  }

  /* ------------- small page interactions (collapsible news + fade-in) ------------- */
  // If you appended the earlier extras, they will run — keep that behavior as is.
  // (If you have the collapsible/fade code below in the same file, it will co-exist.)
});
const v = currentVideo();
if (v) {
  pauseAutoplay();
  try { v.pause(); v.currentTime = 0; } catch(e){}
  v.addEventListener('play', () => pauseAutoplay());
  v.addEventListener('ended', () => resumeAutoplayAfterDelay(1200));
}
// ensure JS does not override CSS height
const sliderEl = document.querySelector('.slider');
if (sliderEl) {
  sliderEl.style.height = ''; // clear any inline height set earlier
}

