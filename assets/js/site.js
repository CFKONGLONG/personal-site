/* =========================================================
   陈科宏的个人主页 · 交互
   主题切换 / 移动端菜单 / 滚动显现 / 卡片聚光 / 导航高亮
   ========================================================= */
(function () {
  'use strict';

  var root = document.documentElement;
  var body = document.body;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 主题 ---------- */
  var themeToggle = document.getElementById('theme-toggle');
  var metaTheme = document.querySelector('meta[name="theme-color"]:not([media])');
  var themeColors = { light: '#f6f2ea', dark: '#0c0c0e' };

  function paintThemeUi() {
    var isDark = root.dataset.theme === 'dark';
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', String(isDark));
      themeToggle.setAttribute('aria-label', isDark ? '切换到亮色主题' : '切换到暗色主题');
    }
    if (metaTheme) metaTheme.setAttribute('content', themeColors[root.dataset.theme] || themeColors.light);
  }

  if (themeToggle) {
    paintThemeUi();
    themeToggle.addEventListener('click', function () {
      var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) {}
      paintThemeUi();
    });
  }

  /* 系统主题跟随：用户没有手动选过时，随系统切换 */
  var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  var onSchemeChange = function (event) {
    var saved = null;
    try { saved = localStorage.getItem('theme'); } catch (e) {}
    if (saved) return;
    root.dataset.theme = event.matches ? 'dark' : 'light';
    paintThemeUi();
  };
  if (mediaQuery.addEventListener) mediaQuery.addEventListener('change', onSchemeChange);
  else if (mediaQuery.addListener) mediaQuery.addListener(onSchemeChange);

  /* ---------- 头部滚动状态 ---------- */
  var header = document.getElementById('site-header');
  var ticking = false;

  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }
  }, { passive: true });
  onScroll();

  /* ---------- 移动端菜单 ---------- */
  var menuBtn = document.getElementById('menu-btn');
  var nav = document.getElementById('nav');

  function setMenu(open) {
    body.classList.toggle('menu-open', open);
    if (menuBtn) {
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
    }
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      setMenu(!body.classList.contains('menu-open'));
    });
  }
  if (nav) {
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) setMenu(false);
    });
  }
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') setMenu(false);
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 860) setMenu(false);
  });

  /* ---------- 滚动淡入 ---------- */
  var revealItems = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));

  if ('IntersectionObserver' in window && !reducedMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealItems.forEach(function (item) { revealObserver.observe(item); });
  } else {
    revealItems.forEach(function (item) { item.classList.add('is-visible'); });
  }

  /* ---------- 导航高亮 ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));
  var sections = navLinks
    .map(function (link) {
      var id = link.getAttribute('href');
      return id && id.charAt(0) === '#' ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  function markActive(id) {
    navLinks.forEach(function (link) {
      link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
    });
  }

  if ('IntersectionObserver' in window && sections.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      var visible = entries.filter(function (entry) { return entry.isIntersecting; });
      if (!visible.length) return;
      visible.sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; });
      markActive(visible[0].target.id);
    }, { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5] });

    sections.forEach(function (section) { navObserver.observe(section); });
  }

  /* ---------- 卡片跟随光斑 ---------- */
  if (!reducedMotion && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('[data-spotlight]').forEach(function (card) {
      card.addEventListener('pointermove', function (event) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', (event.clientX - rect.left) + 'px');
        card.style.setProperty('--my', (event.clientY - rect.top) + 'px');
      });
    });
  }

  /* ---------- 复制联系方式 ---------- */
  function legacyCopy(text) {
    var area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.top = '-1000px';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    var ok = false;
    try {
      ok = document.execCommand('copy');
    } catch (e) {
      ok = false;
    }
    document.body.removeChild(area);
    return ok;
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(function () {
        if (!legacyCopy(text)) throw new Error('copy failed');
      });
    }
    return legacyCopy(text)
      ? Promise.resolve()
      : Promise.reject(new Error('copy failed'));
  }

  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var label = btn.textContent;
      copyText(btn.getAttribute('data-copy') || '')
        .then(function () {
          btn.textContent = '已复制';
          btn.classList.add('is-copied');
        })
        .catch(function () {
          btn.textContent = '复制失败';
        })
        .then(function () {
          setTimeout(function () {
            btn.textContent = label;
            btn.classList.remove('is-copied');
          }, 1600);
        });
    });
  });

  /* ---------- 年份 ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
