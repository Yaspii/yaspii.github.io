// Yaspii language switcher. English is read from the page; other languages load lazily from lang-xx.js.
(function () {
  const LANGS = {
    en: { name: "English", html: "en" },
    th: { name: "ไทย", html: "th" },
    zh: { name: "中文", html: "zh-CN" },
    vi: { name: "Tiếng Việt", html: "vi", font: "Be+Vietnam+Pro:wght@400;600;800" },
    id: { name: "Bahasa Indonesia", html: "id" },
    ms: { name: "Bahasa Melayu", html: "ms" },
    fil: { name: "Filipino", html: "fil" },
    km: { name: "ខ្មែរ", html: "km", font: "Noto+Sans+Khmer:wght@400;600;800" },
    lo: { name: "ລາວ", html: "lo", font: "Noto+Sans+Lao:wght@400;600;800" },
    my: { name: "မြန်မာ", html: "my", font: "Noto+Sans+Myanmar:wght@400;600;800" }
  };
  const EXTRA_EN = {"nav.sport": "SPORT", "nav.fashion": "FASHION", "nav.business": "BUSINESS", "nav.menu": "Menu", "nav.close": "Close menu", "nav.lang": "Language", "nav.soon": "Soon", "nav.lines": "Collections", "nav.shop": "Shop by category", "cat.tops": "Tops", "cat.bottoms": "Bottoms", "cat.sets": "Sets", "cat.outer": "Outerwear", "cat.dresses": "Dresses", "cat.shirts": "Shirts", "cat.trousers": "Trousers", "cat.blazers": "Blazers", "cat.knit": "Knitwear", "cat.shoes": "Shoes", "cat.eyewear": "Eyewear", "cat.acc": "Accessories", "cat.bags": "Bags", "hf.on": "Sound on", "hf.off": "Sound off", "hf.pause": "Pause", "hf.play": "Play", "film.soon": "Film in production", "opt.trail": "Trail running", "opt.walking": "Walking & hiking", "opt.cycling": "Cycling", "opt.swimming": "Swimming", "opt.triathlon": "Triathlon", "opt.hiit": "HIIT & CrossFit", "opt.barre": "Barre", "opt.dance": "Dance", "opt.boxing": "Boxing & Muay Thai", "opt.martial": "Martial arts", "opt.tennis": "Tennis", "opt.badminton": "Badminton", "opt.pickleball": "Pickleball & padel", "opt.tabletennis": "Table tennis", "opt.football": "Football", "opt.basketball": "Basketball", "opt.volleyball": "Volleyball", "opt.golf": "Golf", "opt.climbing": "Climbing", "opt.surfing": "Surfing & water sports", "opt.skate": "Skateboarding", "opt.other": "Other", "opt.running": "Running", "opt.gym": "Gym & strength", "fa.title": "Yaspii Fashion", "fa.desc": "Yaspii Fashion: a point of view worn with intent — attitude, craft and staying power.", "fa.eyebrow": "Yaspii Fashion · Collection 01", "fa.h1": "Style is a stance.", "fa.lede": "Fashion with a point of view, worn with intent, built to stay. Our first collection is in the studio now.", "fa.film": "Fashion film", "fa.look.eyebrow": "Lookbook", "fa.look.h2": "One city. One night. Six looks.", "fa.look": "Look", "fa.statement": "Not made to blend in. Made to be remembered.", "fa.cats.h2": "Coming to the collection", "fa.join.h2": "Get the first look.", "fa.join.p": "Join the list and we will send you the lookbook the day the collection drops.", "fa.footer": "Worn on your own terms.", "fa.cm.eyebrow": "Commute", "fa.cm.h2": "Same faces. Office hours.", "fa.cm.p": "Our tailoring in deep forest green, cut for the walk to work at 33°C.", "bu.title": "Yaspii Business", "bu.desc": "Yaspii Business: business casual for tropical cities, tailored lines that stay relaxed in the heat.", "bu.eyebrow": "Yaspii Business · Collection 01", "bu.h1": "Sharp at nine. Still sharp at six.", "bu.lede": "Business casual for cities where the commute is a walk in the heat. Tailored lines with an easy, relaxed fit.", "bu.film": "Business film", "bu.look.eyebrow": "Lookbook", "bu.look.h2": "From the meeting to the street.", "bu.statement": "A city wardrobe for people who walk to work at 33°C.", "bu.cats.h2": "Coming to the collection", "bu.join.h2": "Be first in the fitting room.", "bu.join.p": "Join the list for fitting invitations and the launch date of the first business collection.", "bu.footer": "Tailored for the tropics.", "line.cta": "Join the waitlist →"};
  const YI = (window.YI = window.YI || {});
  const els = [...document.querySelectorAll("[data-i18n],[data-i18n-html],[data-i18n-ph],[data-i18n-aria]")];
  const meta = document.querySelector('meta[name="description"]');
  const en = Object.assign({}, EXTRA_EN, { "meta.title": document.title, "meta.desc": meta ? meta.content : "",
    "msg.invalid": "Enter a valid email address, like you@example.com.",
    "msg.soon": "The waitlist opens very soon. Please check back in a few days.",
    "msg.sending": "Sending…", "msg.ok": "You're on the list. We'll be in touch before the first drop.",
    "msg.err": "That did not go through. Please try again in a minute." });
  const titleKey = document.documentElement.dataset.titleKey, descKey = document.documentElement.dataset.descKey;
  els.forEach(el => {
    const d = el.dataset;
    if (d.i18n) en[d.i18n] = el.textContent;
    if (d.i18nHtml) en[d.i18nHtml] = el.innerHTML;
    if (d.i18nPh) en[d.i18nPh] = el.placeholder;
    if (d.i18nAria) en[d.i18nAria] = el.getAttribute("aria-label");
  });
  YI.en = Object.assign(en, YI.en || {});
  let cur = "en";
  window.YT = k => (YI[cur] && YI[cur][k] != null ? YI[cur][k] : en[k] != null ? en[k] : k);

  const loaded = { en: Promise.resolve() };
  function load(lang) {
    if (YI[lang]) return Promise.resolve();
    if (!loaded[lang]) loaded[lang] = new Promise((ok, bad) => {
      const s = document.createElement("script"); s.src = "lang-" + lang + ".js?v=20261114"; s.onload = ok; s.onerror = bad;
      document.head.appendChild(s);
    });
    return loaded[lang];
  }
  function font(lang) {
    const f = LANGS[lang] && LANGS[lang].font; if (!f || document.getElementById("font-" + lang)) return;
    const l = document.createElement("link"); l.id = "font-" + lang; l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=" + f + "&display=swap"; document.head.appendChild(l);
  }

  function apply(lang) {
    if (!YI[lang]) lang = "en";
    cur = lang;
    const t = k => (YI[lang][k] != null ? YI[lang][k] : en[k]);
    els.forEach(el => {
      const d = el.dataset;
      if (d.i18n) el.textContent = t(d.i18n);
      if (d.i18nHtml) el.innerHTML = t(d.i18nHtml);
      if (d.i18nPh) el.placeholder = t(d.i18nPh);
      if (d.i18nAria) el.setAttribute("aria-label", t(d.i18nAria));
    });
    document.documentElement.lang = LANGS[lang].html;
    document.title = titleKey ? t(titleKey) : t("meta.title");
    if (meta) meta.content = descKey ? t(descKey) : t("meta.desc");
    document.querySelectorAll("select[data-lang-select]").forEach(s => { s.value = lang; });
    window.YASPII_LANG = lang;
    document.dispatchEvent(new CustomEvent("yaspii:lang", { detail: lang }));
  }
  function choose(lang, save) {
    if (!LANGS[lang]) lang = "en";
    font(lang);
    load(lang).then(() => apply(lang), () => apply("en"));
    if (save) { try { localStorage.setItem("yaspii-lang", lang); } catch (e) {} }
  }
  window.YASPII_SET_LANG = l => choose(l, true);

  document.querySelectorAll("select[data-lang-select]").forEach(s => {
    if (!s.options.length) for (const [k, v] of Object.entries(LANGS)) { const o = document.createElement("option"); o.value = k; o.textContent = v.name; o.lang = v.html; s.appendChild(o); }
    s.addEventListener("change", () => choose(s.value, true));
  });

  let start = null;
  try { start = new URLSearchParams(location.search).get("lang"); } catch (e) {}
  if (!LANGS[start]) { try { start = localStorage.getItem("yaspii-lang"); } catch (e) {} }
  if (!LANGS[start]) {
    const n = (navigator.language || "en").toLowerCase(), p = n.split("-")[0];
    start = p === "tl" ? "fil" : LANGS[p] ? p : "en";
  }
  choose(start, false);
  window.addEventListener("pageshow", e => {
    if (!e.persisted) return;
    let l = null; try { l = localStorage.getItem("yaspii-lang"); } catch (err) {}
    if (LANGS[l] && l !== cur) choose(l, false);
  });
})();
