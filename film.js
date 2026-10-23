// Yaspii 15s brand film, drawn live on a 16:9 canvas (same scenes as the MP4 teaser).
(function () {
  const cv = document.getElementById("film");
  if (!cv || !cv.getContext) return;
  const ctx = cv.getContext("2d");
  const W = 1920, H = 1080, DUR = 15, M = 150;
  const C = { mist: "#DDE8DC", mist2: "#B9CDBB", ink: "#173F33", muted: "#4C6B60", amber: "#C48612",
              amberL: "#E9B24A", deep: "#0F2A22", pale: "#E1ECE2" };
  const D = (s, w = 800) => `${w} ${s}px "Bricolage Grotesque", "Noto Sans Thai", "Noto Sans SC", system-ui, sans-serif`;
  const MONO = s => `500 ${s}px "JetBrains Mono", "Noto Sans Thai", "Noto Sans SC", ui-monospace, monospace`;
  const BODY = s => `600 ${s}px Figtree, "Noto Sans Thai", "Noto Sans SC", system-ui, sans-serif`;
  const EN = { label: "BANGKOK  ·  07:40  ·  OUTDOOR", temp: "AIR TEMPERATURE", rh: "RELATIVE HUMIDITY", train: "This is where you train.",
    s2: ["Most activewear", "is made for", "cool studios in London."], s3label: "YASPII IS BUILT FOR", s3: ["Heavy, hot,", "wet air."],
    chips: ["Odor-resistant", "Squat-proof", "Asian fit"], sub: "ACTIVEWEAR FOR THE TROPICS", btn: "Join the waitlist  ·  yaspii.com" };
  const L = () => (window.YI && window.YI[window.YASPII_LANG] && window.YI[window.YASPII_LANG].film) || EN;
  const MAXW = W - 2 * M;
  const clamp = x => Math.max(0, Math.min(1, x));
  const eo = t => 1 - Math.pow(1 - clamp(t), 3);
  const eio = t => { t = clamp(t); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  const pr = (t, a, b) => clamp((t - a) / (b - a));

  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const DROPS = Array.from({ length: 80 }, () => [60 + rnd() * (W - 120), 160 + rnd() * (H - 320), 5 + rnd() * 11, .6 + rnd() * .8, rnd() * 6.28]);

  function txt(s, x, y, font, color, alpha, align = "left", base = "top", track = 0) {
    if (alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = alpha; ctx.fillStyle = color; ctx.font = font;
    ctx.textAlign = align; ctx.textBaseline = base;
    if ("letterSpacing" in ctx) ctx.letterSpacing = track + "px";
    ctx.font = fit(font, s);
    ctx.fillText(s, x, y);
    ctx.restore();
  }
  function rise(t0, t, x, y, s, font, color, fade) {
    const k = eo(pr(t, t0, t0 + .55));
    if (k > 0) txt(s, x, y + 60 * (1 - k), font, color, k * fade);
  }
  function rr(x, y, w, h, r) {
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, w, h, r);
    else { ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  }
  function fit(font, s) {
    ctx.font = font; const w = ctx.measureText(s).width;
    return w <= MAXW ? font : font.replace(/(\d+)px/, (m, n) => Math.floor(n * MAXW / w) + "px");
  }
  function width(s, font) { ctx.font = fit(font, s); return ctx.measureText(s).width; }

  function droplets(t, alpha) {
    if (alpha <= 0) return;
    ctx.save(); ctx.strokeStyle = C.ink; ctx.fillStyle = C.ink; ctx.lineWidth = 3;
    DROPS.forEach(([x, y, r, sp, ph], i) => {
      const ap = pr(t, 2.2 + (i % 20) * .06, 2.6 + (i % 20) * .06);
      if (ap <= 0) return;
      const yy = y + (t - 2.2) * 26 * sp, R = r * eo(ap);
      ctx.globalAlpha = alpha * .47 * ap * (.6 + .4 * Math.sin(t * 2 + ph));
      ctx.beginPath(); ctx.ellipse(x, yy, R, R * 1.15, 0, 0, 7); ctx.stroke();
    });
    ctx.restore();
  }

  function frame(t) {
    ctx.setTransform(cv.width / W, 0, 0, cv.height / H, 0, 0);
    const wipe = eio(pr(t, 7.6, 8.3)), back = eio(pr(t, 12.4, 12.9));
    ctx.fillStyle = C.mist; ctx.fillRect(0, 0, W, H);
    if (wipe > 0 && back < 1) { ctx.fillStyle = C.deep; ctx.fillRect(0, H * (1 - wipe), W, H * wipe); }
    if (back > 0) { ctx.fillStyle = C.mist; ctx.fillRect(0, 0, W, H * back); }

    if (t < 5.3) {                                   // scene 1: the air you train in
      const a = 1 - eio(pr(t, 4.7, 5.2));
      const T = L();
      txt(T.label, M, 190, MONO(30), C.muted, a * eo(pr(t, .2, .8)), "left", "top", 3);
      if (t > .4) {
        txt(Math.round(24 + 8 * eo(pr(t, .4, 2))) + "°C", M - 8, 560, D(300), C.ink, a, "left", "alphabetic");
        txt(T.temp, M, 610, MONO(30), C.muted, a);
      }
      if (t > 2.2) {
        const k2 = eo(pr(t, 2.2, 3.8)), x = W / 2 + 50;
        txt(Math.round(40 + 40 * k2) + "%", x - 10, 560, D(300), C.amber, a * eo(pr(t, 2.2, 2.6)), "left", "alphabetic");
        txt(T.rh, x, 610, MONO(30), C.muted, a);
        ctx.globalAlpha = a; ctx.fillStyle = C.mist2; ctx.fillRect(x, 680, W - M - x, 10);
        ctx.fillStyle = C.amber; ctx.fillRect(x, 680, (W - M - x) * (.4 + .4 * k2), 10); ctx.globalAlpha = 1;
      }
      rise(3.6, t, M, 790, T.train, D(96, 700), C.ink, a);
      droplets(t, a * eo(pr(t, 2.2, 3)));
    }

    if (t > 5.1 && t < 8) {                          // scene 2: the problem
      const a = 1 - eio(pr(t, 7.4, 7.8)), f = D(120), T = L();
      rise(5.2, t, M, 250, T.s2[0], f, C.ink, a);
      rise(5.4, t, M, 400, T.s2[1], f, C.ink, a);
      rise(5.7, t, M, 600, T.s2[2], f, C.muted, a);
      const sk = eo(pr(t, 6.6, 7.1));
      if (sk > 0) {
        ctx.globalAlpha = a; ctx.fillStyle = C.amber;
        ctx.fillRect(M - 12, 600 + 120 * .56 - 7, (width(T.s2[2], f) + 24) * sk, 14);
        ctx.globalAlpha = 1;
      }
    }

    if (t > 8.1 && t < 12.6) {                       // scene 3: the promise
      const a = 1 - eio(pr(t, 12, 12.4)), f = D(160), T = L();
      rise(8.3, t, M, 220, T.s3label, MONO(34), C.amberL, a);
      rise(8.5, t, M, 320, T.s3[0], f, C.pale, a);
      rise(8.8, t, M, 510, T.s3[1], f, C.amberL, a);
      let x = M;
      T.chips.forEach((c, j) => {
        const k = eo(pr(t, 10 + j * .35, 10.5 + j * .35)), w = width(c, BODY(42)) + 64;
        if (k > 0) {
          const xx = x - 40 * (1 - k);
          ctx.save(); ctx.globalAlpha = k * a; ctx.strokeStyle = C.pale; ctx.lineWidth = 3;
          rr(xx, 800, w, 92, 46); ctx.stroke(); ctx.restore();
          txt(c, xx + 32, 846, BODY(42), C.pale, k * a, "left", "middle");
        }
        x += w + 24;
      });
    }

    if (t > 12.6) {                                  // scene 4: end card
      const k = eo(pr(t, 12.7, 13.4)), f = D(200), ww = width("yaspii", f), r = 26;
      const cx = W / 2 - (ww + r * 2 + 10) / 2, y = 520 + 50 * (1 - k);
      txt("yaspii", cx, y, f, C.ink, k, "left", "alphabetic");
      const dk = eo(pr(t, 13.1, 13.6));
      if (dk > 0) {
        const R = r * (.4 + .6 * dk);
        ctx.fillStyle = C.amber; ctx.beginPath(); ctx.arc(cx + ww + 10 + r, y - 4 - R, R, 0, 7); ctx.fill();
      }
      const k2 = eo(pr(t, 13.4, 14));
      if (k2 > 0) {
        txt(L().sub, W / 2, 620, MONO(30), C.muted, k2, "center", "middle", 4);
        const label = L().btn, bw = width(label, BODY(46)) + 96;
        ctx.save(); ctx.globalAlpha = k2; ctx.fillStyle = C.ink; rr(W / 2 - bw / 2, 720, bw, 110, 55); ctx.fill(); ctx.restore();
        txt(label, W / 2, 775, BODY(46), C.mist, k2, "center", "middle");
      }
    }

    if (t < 12.4) {                                  // corner marks
      const dark = wipe > .5;
      txt("yaspii", M, 110, D(44), dark ? C.pale : C.ink, 1, "left", "alphabetic");
      txt("DROP 01", W - M, 110, MONO(30), dark ? C.amberL : C.amber, 1, "right", "alphabetic");
    }
  }

  function size() {
    const d = Math.min(window.devicePixelRatio || 1, 2), w = cv.clientWidth || 960;
    cv.width = Math.round(w * d); cv.height = Math.round(w * 9 / 16 * d);
  }
  let still = false, visible = true, start = 0;
  try { still = matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
  function loop(now) {
    if (!start) start = now;
    if (visible) frame(((now - start) / 1000) % DUR);
    requestAnimationFrame(loop);
  }
  function go() {
    size();
    if (still) { frame(14.5); return; }
    requestAnimationFrame(loop);
  }
  window.addEventListener("resize", () => { size(); if (still) frame(14.5); });
  document.addEventListener("yaspii:lang", () => { if (still) frame(14.5); });
  if ("IntersectionObserver" in window) new IntersectionObserver(e => { visible = e[0].isIntersecting; }).observe(cv);
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(go, go);
})();
