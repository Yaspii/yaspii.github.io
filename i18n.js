// Yaspii language switcher: English text is read from the page, zh/th come from lang-*.js.
(function () {
  const LANGS = ["en", "zh", "th"];
  const YI = (window.YI = window.YI || {});
  const els = [...document.querySelectorAll("[data-i18n],[data-i18n-html],[data-i18n-ph],[data-i18n-aria]")];
  const meta = document.querySelector('meta[name="description"]');
  const en = { "meta.title": document.title, "meta.desc": meta ? meta.content : "",
    "msg.invalid": "Enter a valid email address, like you@example.com.",
    "msg.soon": "The waitlist opens very soon. Please check back in a few days.",
    "msg.sending": "Sending…", "msg.ok": "You're on the list. We'll be in touch before the first drop.",
    "msg.err": "That did not go through. Please try again in a minute." };
  els.forEach(el => {
    const d = el.dataset;
    if (d.i18n) en[d.i18n] = el.textContent;
    if (d.i18nHtml) en[d.i18nHtml] = el.innerHTML;
    if (d.i18nPh) en[d.i18nPh] = el.placeholder;
    if (d.i18nAria) en[d.i18nAria] = el.getAttribute("aria-label");
  });
  YI.en = Object.assign(en, YI.en || {});
  let cur = "en";
  window.YT = k => (YI[cur] && YI[cur][k]) || en[k] || k;

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
    document.documentElement.lang = lang === "zh" ? "zh-CN" : lang;
    document.title = t("meta.title");
    if (meta) meta.content = t("meta.desc");
    document.querySelectorAll("[data-lang]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
    window.YASPII_LANG = lang;
    document.dispatchEvent(new CustomEvent("yaspii:lang", { detail: lang }));
  }

  document.querySelectorAll("[data-lang]").forEach(b => b.addEventListener("click", () => {
    apply(b.dataset.lang);
    try { localStorage.setItem("yaspii-lang", b.dataset.lang); } catch (e) {}
  }));

  let start = null;
  try { start = new URLSearchParams(location.search).get("lang"); } catch (e) {}
  if (!LANGS.includes(start)) { try { start = localStorage.getItem("yaspii-lang"); } catch (e) {} }
  if (!LANGS.includes(start)) {
    const n = (navigator.language || "en").toLowerCase();
    start = n.startsWith("zh") ? "zh" : n.startsWith("th") ? "th" : "en";
  }
  apply(start);
})();
