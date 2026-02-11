// CUCU API Docs - Floating Cart CTA v3
// Cart icon FAB that follows scroll, owl popup on click
// Dark glassmorphism, AI startup aesthetic
// Prices from app.cucu.bo/api/public/plans (SaaS DB = single source of truth)
(function () {
  if (typeof window === 'undefined') return;

  var API = 'https://app.cucu.bo/api/public/plans?serviceType=API';
  var PLANS = [
    { name: 'Junior', price: 'Bs. 280', per: 'Bs. 0.98/factura', popular: false, url: 'https://app.cucu.bo/checkout?plan=junior&billing=monthly' },
    { name: 'Semi-Senior', price: 'Bs. 350', per: 'Bs. 0.52/factura', popular: false, url: 'https://app.cucu.bo/checkout?plan=semi-senior&billing=monthly' },
    { name: 'Senior', price: 'Bs. 420', per: 'Bs. 0.35/factura', popular: true, url: 'https://app.cucu.bo/checkout?plan=senior&billing=monthly' }
  ];

  function fetchPricing() {
    return fetch(API, { signal: AbortSignal.timeout(3000) })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (d && d.success && d.plans && d.plans.length) {
          PLANS = d.plans.map(function (p) {
            return {
              name: p.name,
              price: p.formattedPrices ? p.formattedPrices.monthly : ('Bs. ' + p.prices.monthly),
              per: p.formattedPrices ? (p.formattedPrices.usage + '/factura') : ('Bs. ' + p.usagePrice + '/factura'),
              popular: p.isPopular,
              url: 'https://app.cucu.bo/checkout?plan=' + p.slug + '&billing=monthly'
            };
          });
        }
      }).catch(function () {});
  }

  var CART_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>';
  var KEY = 'cucu_cta_v3';
  var isOpen = false;
  var mobile = function () { return window.innerWidth <= 768; };

  function css() {
    var s = document.createElement('style');
    s.textContent = '\
@keyframes cucuOrbit{0%,100%{box-shadow:0 0 20px rgba(99,102,241,.4),0 0 60px rgba(139,92,246,.12)}50%{box-shadow:0 0 30px rgba(99,102,241,.65),0 0 80px rgba(139,92,246,.25)}}\
@keyframes cucuSlide{from{opacity:0;transform:translateY(16px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}\
@keyframes cucuFade{from{opacity:0}to{opacity:1}}\
@keyframes cucuRing{0%{transform:scale(1);opacity:.5}100%{transform:scale(2);opacity:0}}\
@keyframes cucuBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}\
@keyframes cucuCartPop{0%{transform:scale(1)}50%{transform:scale(1.15) rotate(-5deg)}100%{transform:scale(1)}}\
#cucu-w{position:fixed;bottom:24px;right:24px;z-index:99999;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}\
#cucu-fab{width:58px;height:58px;border-radius:18px;border:none;cursor:pointer;\
background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#a855f7 100%);\
animation:cucuOrbit 3s ease-in-out infinite;\
display:flex;align-items:center;justify-content:center;position:relative;\
transition:transform .25s cubic-bezier(.34,1.56,.64,1),border-radius .3s;color:#fff}\
#cucu-fab:hover{transform:scale(1.1);border-radius:14px}\
#cucu-fab:active{transform:scale(.95)}\
#cucu-fab .ring{position:absolute;inset:-5px;border-radius:22px;border:2px solid rgba(99,102,241,.35);animation:cucuRing 2.8s ease-out infinite;pointer-events:none}\
#cucu-fab .badge{position:absolute;top:-4px;right:-4px;width:20px;height:20px;border-radius:50%;\
background:linear-gradient(135deg,#10b981,#059669);color:#fff;font-size:10px;font-weight:800;\
display:flex;align-items:center;justify-content:center;border:2px solid rgba(15,23,42,.8);\
box-shadow:0 2px 8px rgba(16,185,129,.4)}\
#cucu-fab svg{animation:cucuBounce 2.5s ease-in-out infinite}\
#cucu-pop{position:absolute;bottom:74px;right:0;width:340px;border-radius:24px;overflow:hidden;display:none;\
animation:cucuSlide .35s cubic-bezier(.16,1,.3,1);z-index:10001;\
background:rgba(10,15,30,.94);backdrop-filter:blur(32px) saturate(180%);-webkit-backdrop-filter:blur(32px) saturate(180%);\
border:1px solid rgba(99,102,241,.2);box-shadow:0 32px 80px rgba(0,0,0,.55),0 0 0 1px rgba(99,102,241,.1),0 0 60px rgba(99,102,241,.08)}\
#cucu-pop .glow{position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:200px;height:120px;\
background:radial-gradient(ellipse,rgba(99,102,241,.2),transparent 70%);pointer-events:none}\
#cucu-pop .hdr{text-align:center;padding:28px 24px 16px;position:relative}\
#cucu-pop .hdr img{width:72px;height:72px;object-fit:contain;margin-bottom:12px;\
filter:drop-shadow(0 0 20px rgba(99,102,241,.5));animation:cucuBounce 3s ease-in-out infinite}\
#cucu-pop .hdr h3{margin:0;font-size:18px;font-weight:800;letter-spacing:-.4px;\
background:linear-gradient(135deg,#e2e8f0,#c7d2fe);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}\
#cucu-pop .hdr p{margin:6px 0 0;font-size:12px;color:#64748b;line-height:1.4}\
#cucu-pop .plans{padding:4px 16px 8px}\
#cucu-pop .plan{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;margin-bottom:8px;\
border-radius:14px;text-decoration:none;color:inherit;transition:all .2s cubic-bezier(.16,1,.3,1);cursor:pointer;position:relative;overflow:hidden;\
background:rgba(30,41,59,.5);border:1px solid rgba(51,65,85,.5)}\
#cucu-pop .plan:hover{border-color:rgba(99,102,241,.6);transform:translateX(4px);background:rgba(30,41,59,.7);\
box-shadow:0 4px 20px rgba(99,102,241,.12)}\
#cucu-pop .plan.pop{border:1px solid rgba(99,102,241,.45);background:linear-gradient(135deg,rgba(99,102,241,.1),rgba(139,92,246,.06))}\
#cucu-pop .plan.pop .gbar{position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#6366f1,#8b5cf6,#06b6d4,#8b5cf6);\
background-size:200% 100%;animation:shimmer 3s linear infinite}\
@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}\
#cucu-pop .pname{font-size:14px;font-weight:600;color:#e2e8f0}\
#cucu-pop .pbadge{font-size:9px;font-weight:700;color:#fff;\
background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:2px 8px;border-radius:6px;text-transform:uppercase;letter-spacing:.5px;margin-left:8px}\
#cucu-pop .pper{font-size:11px;color:#10b981;font-weight:500;margin-top:3px}\
#cucu-pop .pprice{font-size:18px;font-weight:800;\
background:linear-gradient(135deg,#818cf8,#c084fc);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}\
#cucu-pop .pperiod{font-size:11px;color:#475569;margin-left:2px}\
#cucu-pop .ftr{text-align:center;padding:12px 16px 20px}\
#cucu-pop .ftr a{display:inline-flex;align-items:center;gap:8px;font-size:14px;font-weight:700;\
padding:10px 24px;border-radius:12px;text-decoration:none;color:#fff;\
background:linear-gradient(135deg,#6366f1,#8b5cf6);transition:all .2s;\
box-shadow:0 4px 16px rgba(99,102,241,.3)}\
#cucu-pop .ftr a:hover{transform:translateY(-1px);box-shadow:0 6px 24px rgba(99,102,241,.45)}\
#cucu-pop .ftr .sub{font-size:11px;color:#475569;margin-top:8px}\
#cucu-close{position:absolute;top:12px;right:16px;background:rgba(51,65,85,.5);border:none;width:28px;height:28px;\
border-radius:8px;font-size:18px;color:#94a3b8;cursor:pointer;display:flex;align-items:center;justify-content:center;\
z-index:10;transition:all .2s;line-height:1}\
#cucu-close:hover{background:rgba(99,102,241,.2);color:#c7d2fe}\
#cucu-mob{position:fixed;bottom:0;left:0;right:0;z-index:10000;display:none;\
background:linear-gradient(135deg,rgba(99,102,241,.97),rgba(139,92,246,.97));backdrop-filter:blur(12px);\
color:#fff;text-align:center;padding:16px 20px;font-size:15px;font-weight:700;cursor:pointer;\
font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;\
box-shadow:0 -8px 40px rgba(99,102,241,.35);border-top:1px solid rgba(255,255,255,.12);\
letter-spacing:.2px}\
#cucu-overlay{position:fixed;inset:0;z-index:10001;display:none;animation:cucuFade .2s;\
background:rgba(0,0,0,.65);backdrop-filter:blur(6px)}\
#cucu-sheet{position:absolute;bottom:0;left:0;right:0;max-height:85vh;overflow-y:auto;\
animation:cucuSlide .35s cubic-bezier(.16,1,.3,1);\
background:rgba(10,15,30,.96);backdrop-filter:blur(32px);border-radius:28px 28px 0 0;padding:20px 20px 36px;\
border-top:1px solid rgba(99,102,241,.25);\
font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}\
#cucu-sheet .handle{width:40px;height:4px;background:rgba(100,116,139,.4);border-radius:2px;margin:0 auto 20px;cursor:pointer}\
#cucu-sheet .mhdr{text-align:center;margin-bottom:20px}\
#cucu-sheet .mhdr img{width:72px;height:72px;object-fit:contain;margin-bottom:10px;filter:drop-shadow(0 0 16px rgba(99,102,241,.5))}\
#cucu-sheet .mhdr h3{margin:0;font-size:20px;font-weight:800;\
background:linear-gradient(135deg,#e2e8f0,#c7d2fe);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}\
#cucu-sheet .mhdr p{margin:6px 0 0;font-size:13px;color:#64748b}\
#cucu-sheet .mplan{display:flex;align-items:center;justify-content:space-between;padding:18px;margin-bottom:10px;\
border-radius:16px;text-decoration:none;color:inherit;\
background:rgba(30,41,59,.5);border:1px solid rgba(51,65,85,.5)}\
#cucu-sheet .mplan.pop{border-color:rgba(99,102,241,.45);background:linear-gradient(135deg,rgba(99,102,241,.1),rgba(139,92,246,.06))}\
#cucu-sheet .mname{font-size:16px;font-weight:600;color:#e2e8f0}\
#cucu-sheet .mbadge{font-size:10px;font-weight:700;color:#fff;\
background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:2px 8px;border-radius:6px;text-transform:uppercase;margin-left:8px}\
#cucu-sheet .mper{font-size:12px;color:#10b981;font-weight:500;margin-top:4px}\
#cucu-sheet .mprice{font-size:20px;font-weight:800;\
background:linear-gradient(135deg,#818cf8,#c084fc);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}\
#cucu-sheet .mperiod{font-size:12px;color:#475569;margin-left:2px}\
#cucu-sheet .mftr{text-align:center;padding:16px 0 0}\
#cucu-sheet .mftr a{display:inline-flex;align-items:center;gap:8px;font-size:15px;font-weight:700;\
padding:12px 28px;border-radius:14px;text-decoration:none;color:#fff;\
background:linear-gradient(135deg,#6366f1,#8b5cf6);box-shadow:0 4px 16px rgba(99,102,241,.3)}\
#cucu-sheet .mftr .sub{font-size:11px;color:#475569;margin-top:8px}\
';
    document.head.appendChild(s);
  }

  function popup() {
    var el = document.createElement('div');
    el.id = 'cucu-pop';
    el.innerHTML = '<div class="glow"></div>';

    var close = document.createElement('button');
    close.id = 'cucu-close';
    close.innerHTML = '&times;';
    close.onclick = function (e) { e.stopPropagation(); toggle(false); };
    el.appendChild(close);

    var hdr = document.createElement('div');
    hdr.className = 'hdr';
    hdr.innerHTML = '<img src="/logo/cucu-prefer-saluda.gif" alt="CUCU te saluda"/>' +
      '<h3>Empieza a facturar hoy</h3>' +
      '<p>Elige tu plan. Sandbox gratis, produccion desde Bs. 280/mes</p>';
    el.appendChild(hdr);

    var plans = document.createElement('div');
    plans.className = 'plans';
    PLANS.forEach(function (p) {
      var a = document.createElement('a');
      a.href = p.url; a.target = '_blank'; a.rel = 'noopener';
      a.className = 'plan' + (p.popular ? ' pop' : '');
      a.innerHTML = (p.popular ? '<div class="gbar"></div>' : '') +
        '<div><div style="display:flex;align-items:center"><span class="pname">' + p.name + '</span>' +
        (p.popular ? '<span class="pbadge">Popular</span>' : '') +
        '</div><div class="pper">' + p.per + '</div></div>' +
        '<div style="text-align:right"><span class="pprice">' + p.price + '</span><span class="pperiod">/mes</span></div>';
      plans.appendChild(a);
    });
    el.appendChild(plans);

    var ftr = document.createElement('div');
    ftr.className = 'ftr';
    ftr.innerHTML = '<a href="https://app.cucu.bo/signup">Obtener API Key gratuita &rarr;</a>' +
      '<div class="sub">Sin tarjeta de credito &middot; Sandbox ilimitado</div>';
    el.appendChild(ftr);

    return el;
  }

  function fab() {
    var btn = document.createElement('button');
    btn.id = 'cucu-fab';
    btn.innerHTML = '<span class="ring"></span>' + CART_SVG + '<span class="badge">3</span>';
    btn.onclick = function (e) { e.stopPropagation(); toggle(!isOpen); };
    return btn;
  }

  function mobileBar() {
    var bar = document.createElement('div');
    bar.id = 'cucu-mob';
    bar.innerHTML = CART_SVG + ' &nbsp;Ver Planes';
    bar.onclick = function () { toggle(!isOpen); };
    return bar;
  }

  function mobileSheet() {
    var ov = document.createElement('div');
    ov.id = 'cucu-overlay';
    ov.onclick = function (e) { if (e.target === ov) toggle(false); };

    var sh = document.createElement('div');
    sh.id = 'cucu-sheet';

    var handle = document.createElement('div');
    handle.className = 'handle';
    handle.onclick = function () { toggle(false); };
    sh.appendChild(handle);

    var mhdr = document.createElement('div');
    mhdr.className = 'mhdr';
    mhdr.innerHTML = '<img src="/logo/cucu-prefer-saluda.gif" alt="CUCU"/>' +
      '<h3>Empieza a facturar hoy</h3>' +
      '<p>Sandbox gratis, produccion desde Bs. 280/mes</p>';
    sh.appendChild(mhdr);

    PLANS.forEach(function (p) {
      var a = document.createElement('a');
      a.href = p.url; a.target = '_blank'; a.rel = 'noopener';
      a.className = 'mplan' + (p.popular ? ' pop' : '');
      a.innerHTML = '<div><div style="display:flex;align-items:center"><span class="mname">' + p.name + '</span>' +
        (p.popular ? '<span class="mbadge">Popular</span>' : '') +
        '</div><div class="mper">' + p.per + '</div></div>' +
        '<div style="text-align:right"><span class="mprice">' + p.price + '</span><span class="mperiod">/mes</span></div>';
      sh.appendChild(a);
    });

    var mftr = document.createElement('div');
    mftr.className = 'mftr';
    mftr.innerHTML = '<a href="https://app.cucu.bo/signup">Obtener API Key &rarr;</a>' +
      '<div class="sub">Sin tarjeta &middot; Sandbox ilimitado</div>';
    sh.appendChild(mftr);

    ov.appendChild(sh);
    return ov;
  }

  var wrap, pop, btn, mob, movl;

  function toggle(show) {
    isOpen = show;
    if (mobile()) {
      if (movl) movl.style.display = show ? 'block' : 'none';
    } else {
      if (pop) pop.style.display = show ? 'block' : 'none';
      if (btn && show) { btn.style.animation = 'cucuCartPop .4s ease'; setTimeout(function(){ btn.style.animation = 'cucuOrbit 3s ease-in-out infinite'; }, 400); }
    }
  }

  function resize() {
    if (mobile()) {
      if (wrap) wrap.style.display = 'none';
      if (mob) mob.style.display = 'block';
    } else {
      if (wrap) wrap.style.display = 'block';
      if (mob) mob.style.display = 'none';
      if (movl) movl.style.display = 'none';
    }
    if (isOpen) toggle(false);
  }

  function init() {
    try { if (sessionStorage.getItem(KEY)) return; } catch (e) {}
    css();

    wrap = document.createElement('div');
    wrap.id = 'cucu-w';
    pop = popup();
    btn = fab();
    wrap.appendChild(pop);
    wrap.appendChild(btn);
    document.body.appendChild(wrap);

    mob = mobileBar();
    movl = mobileSheet();
    document.body.appendChild(mob);
    document.body.appendChild(movl);

    document.addEventListener('click', function (e) {
      if (isOpen && !mobile() && !wrap.contains(e.target)) toggle(false);
    });

    resize();
    window.addEventListener('resize', resize);

    // Chase effect: cart follows scroll along right edge.
    // Uses CAPTURE PHASE scroll listener — guaranteed to catch scroll events
    // from ANY element (window, inner div, whatever Mintlify uses internally).
    var chaseCurrentY = 0;
    var chaseTargetY = 0;
    var lastScrollPct = 0;
    var CHASE_LERP = 0.04;
    var CHASE_RANGE = 0.60;   // 60% of viewport travel
    var REST_BOTTOM = 24;

    // Capture phase: intercepts ALL scroll events from ANY element in the DOM.
    // This is the nuclear option — no guessing which container scrolls.
    document.addEventListener('scroll', function (e) {
      var t = e.target;
      var top, max;
      if (t === document || t === document.documentElement || t === document.body) {
        top = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
        max = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) - window.innerHeight;
      } else if (t.scrollHeight && t.clientHeight) {
        top = t.scrollTop;
        max = t.scrollHeight - t.clientHeight;
      } else {
        return;
      }
      if (max > 50) {
        lastScrollPct = Math.max(0, Math.min(1, top / max));
      }
    }, true); // TRUE = capture phase — this is the key

    function chaseLoop() {
      if (!wrap) { requestAnimationFrame(chaseLoop); return; }

      chaseTargetY = lastScrollPct * window.innerHeight * CHASE_RANGE;

      var diff = chaseTargetY - chaseCurrentY;
      chaseCurrentY += diff * CHASE_LERP;

      if (!isOpen && !mobile()) {
        wrap.style.setProperty('bottom', (REST_BOTTOM + Math.round(chaseCurrentY)) + 'px', 'important');
      }

      requestAnimationFrame(chaseLoop);
    }

    requestAnimationFrame(chaseLoop);
  }

  fetchPricing().then(function () {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
  });
})();
