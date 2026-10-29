/* Yaspii campaign gallery.
   To add a photo: put the file in img/ and add one line to MEDIA.
   To add the brand film: fill in FILM (mp4 in video/, poster image in img/). */
(function () {
  const MEDIA = [
    { type: "image", src: "img/run-bangkok-720.webp", w: 720, h: 1280,
      label: { en: "Run · Bangkok, 05:30", zh: "跑步 · 曼谷 清晨 5:30", th: "วิ่ง · กรุงเทพฯ 05:30 น." },
      alt: { en: "A runner in a green Yaspii tank and black shorts on a Bangkok road at sunrise",
             zh: "清晨的曼谷街道上，穿绿色 Yaspii 背心和黑色短裤跑步的女生",
             th: "นักวิ่งสวมเสื้อกล้าม Yaspii สีเขียวและกางเกงขาสั้นสีดำบนถนนในกรุงเทพฯ ยามเช้า" } },
    { type: "image", src: "img/ride-coast-720.webp", w: 720, h: 1280,
      label: { en: "Ride · Coast road", zh: "骑行 · 海岸公路", th: "ปั่น · ถนนเลียบทะเล" },
      alt: { en: "A cyclist in a green Yaspii jersey and black bib shorts on a coastal road",
             zh: "海边公路上，穿绿色 Yaspii 骑行服骑车的女生",
             th: "นักปั่นสวมเสื้อปั่น Yaspii สีเขียวบนถนนเลียบชายฝั่ง" } },
    { type: "image", src: "img/tennis-court-720.webp", w: 720, h: 1280,
      label: { en: "Tennis · Match point", zh: "网球 · 赛点", th: "เทนนิส · แมตช์พอยต์" },
      alt: { en: "A tennis player in a green Yaspii dress tossing the ball to serve",
             zh: "穿绿色 Yaspii 网球裙、抛球准备发球的女生",
             th: "นักเทนนิสสวมชุดเดรส Yaspii สีเขียวกำลังโยนลูกเพื่อเสิร์ฟ" } },
    { type: "image", src: "img/trail-inthanon-720.webp", w: 720, h: 1280,
      label: { en: "Trail · Doi Inthanon, 2,565 m", zh: "徒步 · 因他暖山 2565 米", th: "เดินป่า · ดอยอินทนนท์ 2,565 ม." },
      alt: { en: "A hiker in a green Yaspii rain jacket and black leggings climbing a misty mountain trail",
             zh: "雾中山道上，穿绿色 Yaspii 冲锋衣和黑色紧身裤攀登的女生",
             th: "นักเดินป่าสวมแจ็กเก็ต Yaspii สีเขียวและเลกกิ้งสีดำปีนเส้นทางบนภูเขาท่ามกลางหมอก" } },
    { type: "image", src: "img/yoga-maechaem-720.webp", w: 720, h: 1280,
      label: { en: "Yoga · Mae Chaem, 06:10", zh: "瑜伽 · 湄占梯田 清晨 6:10", th: "โยคะ · แม่แจ่ม 06:10 น." },
      alt: { en: "A woman in a green Yaspii yoga set holding tree pose above rice terraces at sunrise",
             zh: "日出时的梯田上，穿绿色 Yaspii 瑜伽套装做树式的女生",
             th: "ผู้หญิงสวมชุดโยคะ Yaspii สีเขียวทำท่าต้นไม้เหนือนาขั้นบันไดยามพระอาทิตย์ขึ้น" } }
  ];
  const FILM = { src: "yaspii-film.mp4", poster: "img/film-poster.jpg" }; /* English subtitles are burned into the video */
  const SUB_LABEL = { en: "English", zh: "中文", th: "ไทย" };

  const T = {
    en: { soon: "Photo coming soon", film: "Brand film", filmSoon: "Coming soon", prev: "Previous photos", next: "Next photos", close: "Close", open: "View larger" },
    zh: { soon: "照片即将上线", film: "品牌影片", filmSoon: "即将上线", prev: "上一组照片", next: "下一组照片", close: "关闭", open: "查看大图" },
    th: { soon: "ภาพกำลังจะมา", film: "ภาพยนตร์แบรนด์", filmSoon: "เร็ว ๆ นี้", prev: "ภาพก่อนหน้า", next: "ภาพถัดไป", close: "ปิด", open: "ดูภาพใหญ่" }
  };
  const track = document.getElementById("cp-track");
  const filmBox = document.getElementById("cp-film");
  const dlg = document.getElementById("cp-dialog");
  if (!track) return;
  const lang = () => (T[window.YASPII_LANG] ? window.YASPII_LANG : "en");
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };

  function render() {
    const L = lang(), t = T[L];
    track.replaceChildren(...MEDIA.map((m, i) => {
      const li = el("li", "cp-item" + (m.type === "soon" ? " cp-soon" : ""));
      if (m.type === "image") {
        const b = el("button", "cp-open"); b.type = "button"; b.setAttribute("aria-label", t.open + ": " + m.label[L]);
        const img = el("img"); img.src = m.src; img.width = m.w; img.height = m.h; img.alt = m.alt[L]; img.loading = i < 2 ? "eager" : "lazy"; img.decoding = "async";
        b.append(img); b.addEventListener("click", () => openLarge(m));
        li.append(b, el("p", "cp-cap", m.label[L]));
      } else {
        const box = el("div", "cp-ph"); box.append(el("span", "cp-ph-sport", m.label[L]), el("span", "cp-ph-note", t.soon));
        li.append(box);
      }
      return li;
    }));
    document.getElementById("cp-prev").setAttribute("aria-label", t.prev);
    document.getElementById("cp-next").setAttribute("aria-label", t.next);
    if (filmBox) {
      if (FILM) {
        let v = filmBox.querySelector("video");
        if (!v) {
          v = el("video"); v.controls = true; v.playsInline = true; v.preload = "metadata"; v.poster = FILM.poster || ""; v.src = FILM.src;
          v.setAttribute("aria-label", t.film);
          for (const k of Object.keys(FILM.subs || {})) {
            const tr = el("track"); tr.kind = "subtitles"; tr.srclang = k; tr.label = SUB_LABEL[k]; tr.src = FILM.subs[k]; tr.dataset.lang = k;
            v.append(tr);
          }
          filmBox.replaceChildren(v); filmBox.classList.add("has-film");
        }
        v.setAttribute("aria-label", t.film);
        /* Show subtitles in the page language; English VO + English page = subtitles still on for sound-off viewing. */
        for (const tt of v.textTracks) tt.mode = tt.language === L ? "showing" : "disabled";
      } else {
        const ph = el("div", "cp-film-ph");
        const play = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        play.setAttribute("viewBox", "0 0 64 64"); play.setAttribute("aria-hidden", "true");
        play.innerHTML = '<circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" stroke-width="2"/><path d="M26 20 L46 32 L26 44 Z" fill="currentColor"/>';
        ph.append(play, el("span", "cp-film-t", t.film), el("span", "cp-film-s", t.filmSoon));
        filmBox.replaceChildren(ph);
      }
    }
    if (dlg) dlg.querySelector(".cp-close").setAttribute("aria-label", t.close);
  }

  function openLarge(m) {
    if (!dlg || !dlg.showModal) { window.open(m.src, "_blank"); return; }
    const img = dlg.querySelector("img"); img.src = m.src; img.alt = m.alt[lang()];
    dlg.showModal();
  }
  if (dlg) {
    dlg.querySelector(".cp-close").addEventListener("click", () => dlg.close());
    dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
  }
  const step = dir => track.scrollBy({ left: dir * (track.firstElementChild ? track.firstElementChild.offsetWidth + 16 : 300), behavior: "smooth" });
  document.getElementById("cp-prev").addEventListener("click", () => step(-1));
  document.getElementById("cp-next").addEventListener("click", () => step(1));

  document.addEventListener("yaspii:lang", render);
  render();
})();
