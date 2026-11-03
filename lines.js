/* Fashion & Business pages: waitlist form and film slot.
   To add a film: set data-film="img/xx-film.mp4" (and data-poster) on #line-film. */
(function () {
  const FORM_ENDPOINT = "";
  document.querySelectorAll("form.waitlist").forEach(form => {
    const note = form.querySelector(".note");
    form.addEventListener("submit", async e => {
      e.preventDefault();
      const email = form.email.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { note.textContent = YT("msg.invalid"); form.email.focus(); return; }
      if (!FORM_ENDPOINT) { note.textContent = YT("msg.soon"); return; }
      note.textContent = YT("msg.sending");
      try {
        const r = await fetch(FORM_ENDPOINT, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(form) });
        if (!r.ok) throw new Error();
        form.reset(); note.textContent = YT("msg.ok");
      } catch (err) { note.textContent = YT("msg.err"); }
    });
  });
  const box = document.getElementById("line-film");
  if (box && box.dataset.film) {
    const v = document.createElement("video");
    v.src = box.dataset.film; v.controls = true; v.playsInline = true; v.preload = "metadata";
    if (box.dataset.poster) v.poster = box.dataset.poster;
    box.replaceChildren(v);
  }
})();
