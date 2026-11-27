(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  var mb = $('.menu'), nav = $('.nav');
  if (mb) {
    mb.addEventListener('click', function () { var o = nav.classList.toggle('open'); mb.setAttribute('aria-expanded', o); });
    $$('.nav a').forEach(function (a) { a.addEventListener('click', function () { nav.classList.remove('open'); }); });
  }

  /* work filter */
  $$('.tab').forEach(function (t) {
    t.addEventListener('click', function () {
      $$('.tab').forEach(function (x) { x.setAttribute('aria-pressed', x === t ? 'true' : 'false'); });
      var f = t.dataset.filter;
      $$('.wcard').forEach(function (c) { c.hidden = !(f === 'all' || c.dataset.cat.split(' ').indexOf(f) > -1); });
    });
  });

  /* hero: self-playing 3D cover showcase */
  var stage = $('#stage'), books = $$('#deck .book'), n = books.length;
  if (!stage || !n) { return; }
  var caption = $('#caption'), dotsWrap = $('#dots'), playBtn = $('#play');
  var active = 0, timer = null, playing = !reduce, hover = false, prev = [];
  var dots = books.map(function (b, i) {
    var d = document.createElement('button'); d.type = 'button'; d.className = 'dot';
    d.setAttribute('aria-label', 'Show ' + b.dataset.title);
    d.addEventListener('click', function () { go(i, true); });
    dotsWrap.insertBefore(d, playBtn); return d;
  });
  var signed = function (i, a) { var h = Math.floor(n / 2); return ((i - a + n + h) % n) - h; };
  function layout(first) {
    var w = stage.clientWidth, h = books[0].offsetHeight || 300, unit = Math.min(w * 0.27, h * 0.62);
    books.forEach(function (b, i) {
      var o = signed(i, active), ao = Math.abs(o);
      var x = (o < 0 ? -1 : 1) * (ao === 0 ? 0 : ao === 1 ? unit * 1.22 : unit * 2.0);
      var z = -ao * 140, r = -o * 40, s = ao === 0 ? 1.18 : ao === 1 ? 0.92 : 0.78;
      var jump = !first && prev[i] !== undefined && Math.abs(prev[i] - o) > 2;
      if (jump) { b.style.transition = 'none'; }
      b.style.transform = 'translate(-50%,-50%) translateX(' + x + 'px) translateZ(' + z + 'px) rotateY(' + r + 'deg) scale(' + s + ')';
      b.style.opacity = ao === 0 ? 1 : ao === 1 ? 0.95 : 0.55; b.style.zIndex = 10 - ao;
      if (jump) { void b.offsetWidth; b.style.transition = ''; }
      prev[i] = o;
    });
    var cur = books[active];
    caption.innerHTML = '<strong></strong><span></span>';
    caption.children[0].textContent = cur.dataset.title;
    caption.children[1].textContent = cur.dataset.note;
    dots.forEach(function (d, i) { d.setAttribute('aria-current', i === active ? 'true' : 'false'); });
  }
  function go(i, user) { active = ((i % n) + n) % n; layout(); if (user) { restart(); } }
  function tick() { if (playing && !hover && !document.hidden) { go(active + 1); } }
  function restart() { clearInterval(timer); if (playing) { timer = setInterval(tick, 2000); } }
  function setPlaying(p) {
    playing = p; playBtn.setAttribute('aria-pressed', p ? 'false' : 'true');
    playBtn.setAttribute('aria-label', p ? 'Pause the showcase' : 'Play the showcase'); restart();
  }
  playBtn.addEventListener('click', function () { setPlaying(!playing); });
  stage.addEventListener('mouseenter', function () { hover = true; });
  stage.addEventListener('mouseleave', function () { hover = false; });
  stage.addEventListener('focusin', function () { hover = true; });
  stage.addEventListener('focusout', function () { hover = false; });
  stage.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { go(active + 1, true); e.preventDefault(); }
    if (e.key === 'ArrowLeft') { go(active - 1, true); e.preventDefault(); }
  });
  books.forEach(function (b, i) { b.addEventListener('click', function () { if (i === active) { location.hash = '#work'; } else { go(i, true); } }); });
  window.addEventListener('resize', function () { layout(true); });
  layout(true); restart();
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { en.forEach(function (e) { hover = !e.isIntersecting; }); }).observe(stage);
  }
})();
