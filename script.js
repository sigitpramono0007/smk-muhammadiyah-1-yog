/* SMK Muhammadiyah 1 Yogyakarta — script.js */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  /* ---------- Hamburger menu ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('main-nav');
  function closeNav() {
    if (!toggle || !nav) return;
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    window.addEventListener('resize', function () { if (window.innerWidth > 900) closeNav(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });
  }

  /* ---------- Header: transparan di atas, putih saat di-scroll (beranda) ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 20);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Penanda menu aktif saat scroll (beranda satu halaman) ---------- */
  if (document.body.classList.contains('has-hero')) {
    var spyLinks = Array.prototype.slice.call(document.querySelectorAll('.main-nav a[href^="index.html#"]'));
    var spy = spyLinks.map(function (a) {
      return { a: a, el: document.getElementById(a.getAttribute('href').split('#')[1]) };
    }).filter(function (x) { return x.el; });
    function onSpy() {
      var y = window.scrollY + 140, current = spy[0];
      spy.forEach(function (x) { if (x.el.offsetTop <= y) current = x; });
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) current = spy[spy.length - 1];
      spy.forEach(function (x) {
        var on = x === current;
        x.a.classList.toggle('active', on);
        if (on) x.a.setAttribute('aria-current', 'true'); else x.a.removeAttribute('aria-current');
      });
    }
    onSpy();
    window.addEventListener('scroll', onSpy, { passive: true });
    window.addEventListener('resize', onSpy);
  }

  /* ---------- Fade-in saat scroll ---------- */
  var fadeEls = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window) {
    var fadeObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('visible');
          fadeObs.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    fadeEls.forEach(function (el, i) {
      el.style.transitionDelay = ((i % 4) * 90) + 'ms';
      fadeObs.observe(el);
    });
  } else {
    fadeEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- Count-up statistik ----------
     Ubah angka lewat atribut data-target (angka) dan data-suffix (mis. "+") di index.html */
  var counters = document.querySelectorAll('[data-target]');
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-target'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1800;
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target).toLocaleString('id-ID') + (p === 1 ? suffix : '');
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString('id-ID') + suffix;
    }
    requestAnimationFrame(step);
  }
  if (counters.length) {
    if ('IntersectionObserver' in window) {
      var cObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { animateCount(en.target); cObs.unobserve(en.target); }
        });
      }, { threshold: 0.5 });
      counters.forEach(function (c) { cObs.observe(c); });
    } else {
      counters.forEach(function (c) {
        c.textContent = parseInt(c.getAttribute('data-target'), 10).toLocaleString('id-ID') + (c.getAttribute('data-suffix') || '');
      });
    }
  }

  /* ---------- Berita: buka/tutup selengkapnya ---------- */
  var newsCards = document.querySelectorAll('.card[data-news]');
  newsCards.forEach(function (card) {
    var btn = card.querySelector('.read-more');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var open = card.classList.toggle('open');
      btn.textContent = open ? 'Tutup' : 'Baca selengkapnya';
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
  function openFromHash() {
    if (!location.hash) return;
    var card = document.querySelector('.card[data-news]' + location.hash);
    if (card && !card.classList.contains('open')) {
      var btn = card.querySelector('.read-more');
      if (btn) btn.click();
    }
  }
  openFromHash();
  window.addEventListener('hashchange', openFromHash);

  /* ---------- Lightbox galeri ---------- */
  var items = Array.prototype.slice.call(document.querySelectorAll('.gallery-item'));
  if (items.length) {
    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Tampilan foto');
    lb.innerHTML =
      '<button class="lb-btn lb-close" aria-label="Tutup">&times;</button>' +
      '<button class="lb-btn lb-prev" aria-label="Foto sebelumnya">&#8249;</button>' +
      '<figure><img alt=""><figcaption></figcaption></figure>' +
      '<button class="lb-btn lb-next" aria-label="Foto berikutnya">&#8250;</button>';
    document.body.appendChild(lb);
    var lbImg = lb.querySelector('img');
    var lbCap = lb.querySelector('figcaption');
    var idx = 0;

    function show(i) {
      idx = (i + items.length) % items.length;
      var img = items[idx].querySelector('img');
      lbImg.src = img.getAttribute('src');
      lbImg.alt = img.getAttribute('alt');
      lbCap.textContent = img.getAttribute('alt');
    }
    function openLb(i) { show(i); lb.classList.add('open'); document.body.style.overflow = 'hidden'; }
    function closeLb() { lb.classList.remove('open'); document.body.style.overflow = ''; }

    items.forEach(function (it, i) {
      it.setAttribute('tabindex', '0');
      it.addEventListener('click', function () { openLb(i); });
      it.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLb(i); } });
    });
    lb.querySelector('.lb-close').addEventListener('click', closeLb);
    lb.querySelector('.lb-prev').addEventListener('click', function (e) { e.stopPropagation(); show(idx - 1); });
    lb.querySelector('.lb-next').addEventListener('click', function (e) { e.stopPropagation(); show(idx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  }

  /* ---------- Form kontak (validasi sisi klien) ----------
     Form ini belum terhubung ke server. Untuk mengirim pesan sungguhan,
     sambungkan ke layanan seperti Formspree / EmailJS / backend sekolah. */
  var form = document.getElementById('contact-form');
  if (form) {
    var status = document.getElementById('form-status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll('.field').forEach(function (f) {
        var input = f.querySelector('input, textarea');
        var valid = input.value.trim() !== '';
        if (valid && input.type === 'email') valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
        f.classList.toggle('invalid', !valid);
        if (!valid) ok = false;
      });
      if (ok) {
        status.textContent = 'Terima kasih! Pesan Anda sudah kami terima dan akan segera dibalas.';
        status.classList.add('show');
        form.reset();
      } else {
        status.classList.remove('show');
      }
    });
  }

  /* ---------- Form pendaftaran (validasi sisi klien) ----------
     Belum terhubung ke server; sambungkan ke Google Form / Formspree / backend sekolah. */
  var dform = document.getElementById('daftar-form');
  if (dform) {
    var dstatus = document.getElementById('daftar-status');
    dform.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true, firstBad = null;
      dform.querySelectorAll('.field').forEach(function (f) {
        var valid = true;
        if (f.hasAttribute('data-radio')) {
          valid = !!f.querySelector('input[type=radio]:checked');
        } else if (f.hasAttribute('data-check')) {
          valid = f.querySelector('input[type=checkbox]').checked;
        } else {
          var input = f.querySelector('input, textarea, select');
          var v = input.value.trim();
          if (input.required && v === '') valid = false;
          else if (v !== '' && input.type === 'email') valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
          else if (v !== '' && input.dataset.pattern) valid = new RegExp(input.dataset.pattern).test(v.replace(/[\s-]/g, ''));
          if (input.id === 'pilihan2' && v !== '' && v === dform.pilihan1.value) valid = false;
        }
        f.classList.toggle('invalid', !valid);
        if (!valid) { ok = false; if (!firstBad) firstBad = f; }
      });
      if (ok) {
        dstatus.textContent = 'Terima kasih! Pendaftaran Anda sudah kami terima. Panitia akan menghubungi Anda melalui nomor HP/WhatsApp yang dicantumkan.';
        dstatus.classList.add('show');
        dform.reset();
        dstatus.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        dstatus.classList.remove('show');
        firstBad.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    dform.addEventListener('input', function (e) {
      var f = e.target.closest('.field'); if (f) f.classList.remove('invalid');
    });
    dform.addEventListener('change', function (e) {
      var f = e.target.closest('.field'); if (f) f.classList.remove('invalid');
    });
  }

  /* ---------- Tahun otomatis di footer ---------- */
  document.querySelectorAll('.js-year').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
