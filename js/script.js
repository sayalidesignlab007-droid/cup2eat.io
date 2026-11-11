/* ==========================================================
   CUP2EAT – Site behaviour (vanilla JS, no dependencies)
   Settings live in js/config.js
   ========================================================== */
(function () {
  "use strict";

  var CFG = window.CUP2EAT_CONFIG || {};
  var C = CFG.contact || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Apply config to the page ---------- */
  function waLink(text) {
    var num = String(C.whatsappNumber || "").replace(/\D/g, "");
    return "https://wa.me/" + num + "?text=" + encodeURIComponent(text || CFG.whatsappMessage || "");
  }

  $$("[data-cfg]").forEach(function (el) {
    var v = C[el.getAttribute("data-cfg")];
    if (v) el.textContent = v;
  });
  $$("[data-cfg-href]").forEach(function (el) {
    var k = el.getAttribute("data-cfg-href");
    if (k === "tel" && C.phoneTel) el.href = "tel:" + C.phoneTel;
    else if (k === "mail" && C.email) el.href = "mailto:" + C.email;
    else if (k === "instagram" && C.instagramUrl) el.href = C.instagramUrl;
  });
  $$("[data-wa]").forEach(function (el) { el.href = waLink(); });

  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Toasts ---------- */
  var toastBox = $("#toasts");
  function toast(msg, type) {
    if (!toastBox) return;
    $$(".toast", toastBox).forEach(function (old) { if (old.textContent === msg) old.remove(); });
    var t = document.createElement("div");
    t.className = "toast" + (type === "error" ? " error" : "");
    t.textContent = msg;
    toastBox.appendChild(t);
    setTimeout(function () {
      t.style.transition = "opacity .3s";
      t.style.opacity = "0";
      setTimeout(function () { t.remove(); }, 320);
    }, 4800);
  }

  /* ---------- Header + mobile menu ---------- */
  var header = $("#siteHeader");
  var toggle = $("#menuToggle");
  var nav = $("#primaryNav");

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    nav.classList.toggle("open", open);
    header.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  toggle.addEventListener("click", function () {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });
  $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("click", function (e) {
    if (toggle.getAttribute("aria-expanded") === "true" && !header.contains(e.target)) setMenu(false);
  });
  window.addEventListener("resize", function () {
    if (window.innerWidth >= 960) setMenu(false);
  });

  /* ---------- Overlay manager (only one popup at a time) ---------- */
  var current = null;       // currently open overlay element
  var lastTrigger = null;   // element to return focus to
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function openOverlay(el, trigger) {
    if (current && current !== el) closeOverlay(true);
    if (!current) lastTrigger = trigger || document.activeElement;
    current = el;
    el.hidden = false;
    void el.offsetWidth; // reflow so the transition runs
    el.classList.add("show");
    document.body.classList.add("no-scroll");
    setMenu(false);
    var first = $("input, select, textarea", el) || $("[data-close]", el) || $(FOCUSABLE, el);
    if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, 30);
  }

  function closeOverlay(immediate) {
    if (!current) return;
    var el = current;
    current = null;
    el.classList.remove("show");
    var finish = function () { el.hidden = true; };
    if (immediate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) finish();
    else setTimeout(finish, 300);
    document.body.classList.remove("no-scroll");
    if (lastTrigger && lastTrigger.focus && document.contains(lastTrigger)) lastTrigger.focus({ preventScroll: true });
  }

  $$(".overlay").forEach(function (ov) {
    ov.addEventListener("click", function (e) {
      var t = e.target;
      if (t === ov || t.classList.contains("lb-dialog")) closeOverlay();
      else if (t.closest("[data-close]")) closeOverlay();
    });
  });

  document.addEventListener("keydown", function (e) {
    if (!current) {
      if (e.key === "Escape" && nav.classList.contains("open")) { setMenu(false); toggle.focus(); }
      return;
    }
    if (e.key === "Escape") { e.preventDefault(); closeOverlay(); return; }
    if (current.id === "lightbox") {
      if (e.key === "ArrowLeft") { e.preventDefault(); lbStep(-1); return; }
      if (e.key === "ArrowRight") { e.preventDefault(); lbStep(1); return; }
    }
    if (e.key === "Tab") { // focus trap
      var f = $$(FOCUSABLE, current).filter(function (n) { return n.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- Enquiry modal triggers ---------- */
  var enquiryModal = $("#enquiryModal");
  var modalForm = $("#modalForm");
  var modalNote = $("#modalNote");

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-enquire]");
    if (!btn) return;
    e.preventDefault();
    var type = btn.getAttribute("data-enquire-type");
    var note = btn.getAttribute("data-enquire-note");
    if (type) modalForm.elements.type.value = type;
    if (note) {
      modalNote.textContent = "Enquiring about: " + note;
      modalNote.hidden = false;
      if (!modalForm.elements.message.value) modalForm.elements.message.value = "I'd like to know more about: " + note + ".";
    } else {
      modalNote.hidden = true;
    }
    openOverlay(enquiryModal, btn.id === "offerCta" ? lastTrigger : btn);
  });

  /* ---------- Form validation + submission ---------- */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function setError(input, msg) {
    var field = input.closest(".field");
    var err = $(".err", field);
    field.classList.toggle("invalid", !!msg);
    if (msg) input.setAttribute("aria-invalid", "true"); else input.removeAttribute("aria-invalid");
    if (err) err.textContent = msg || "";
  }

  function validate(form) {
    var f = form.elements;
    var firstBad = null;
    function check(input, msg) {
      setError(input, msg);
      if (msg && !firstBad) firstBad = input;
    }
    var name = f.name.value.trim();
    check(f.name, !name ? "Please enter your full name." : name.length < 2 ? "Name looks too short." : "");

    var phone = f.phone.value.trim();
    var digits = phone.replace(/\D/g, "");
    check(f.phone, !phone ? "Please enter your phone number."
      : (!/^\+?[\d\s\-()]+$/.test(phone) || digits.length < 10 || digits.length > 13)
        ? "Enter a valid phone number (10 to 13 digits)." : "");

    var email = f.email.value.trim();
    check(f.email, !email ? "Please enter your email address." : !EMAIL_RE.test(email) ? "Enter a valid email, e.g. name@example.com." : "");

    check(f.type, !f.type.value ? "Please choose an enquiry type." : "");

    if (firstBad) firstBad.focus();
    return !firstBad;
  }

  function collect(form) {
    var f = form.elements;
    return {
      name: f.name.value.trim(),
      phone: f.phone.value.trim(),
      email: f.email.value.trim(),
      type: f.type.value,
      quantity: f.quantity.value.trim(),
      message: f.message.value.trim()
    };
  }

  function waText(d) {
    var lines = [
      "Hello CUP2EAT, I'd like to make an enquiry.",
      "",
      "Name: " + d.name,
      "Phone: " + d.phone,
      "Email: " + d.email,
      "Enquiry type: " + d.type
    ];
    if (d.quantity) lines.push("Quantity / requirement: " + d.quantity);
    if (d.message) lines.push("Message: " + d.message);
    return lines.join("\n");
  }

  function setStatus(form, msg, cls) {
    var s = $(".form-status", form);
    s.className = "form-status" + (cls ? " " + cls : "");
    s.textContent = msg || "";
  }

  function wireForm(form) {
    form.addEventListener("input", function (e) {
      var t = e.target;
      if (t.closest(".field.invalid")) setError(t, "");
    });
    form.addEventListener("change", function (e) {
      var t = e.target;
      if (t.closest(".field.invalid")) setError(t, "");
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      setStatus(form, "");
      if (!validate(form)) {
        toast("Please check the highlighted fields.", "error");
        return;
      }
      var data = collect(form);
      var submitBtn = $('button[type="submit"]', form);

      // No endpoint configured: do NOT pretend anything was sent.
      if (!CFG.formEndpoint) {
        window.open(waLink(waText(data)), "_blank", "noopener");
        var msg = "This form isn't connected to email yet, so WhatsApp was opened with your details. Please press send there to complete your enquiry.";
        setStatus(form, msg, "");
        toast("WhatsApp opened with your details. Press send there to complete your enquiry.");
        return;
      }

      var original = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
      fetch(CFG.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data)
      }).then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        form.reset();
        setStatus(form, "Thank you! Your enquiry has been sent. We'll get back to you soon.", "ok");
        toast("Enquiry sent. Thank you!");
        if (form === modalForm) setTimeout(function () { if (current === enquiryModal) closeOverlay(); setStatus(form, ""); }, 2600);
      }).catch(function () {
        setStatus(form, "Sorry, we couldn't send your enquiry. Please try again, or contact us on WhatsApp or by phone.", "error");
        toast("Couldn't send your enquiry. Please try again.", "error");
      }).then(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = original;
      });
    });
  }
  $$("form.enquiry-form").forEach(wireForm);

  /* ---------- FAQ accordion ---------- */
  $$(".faq-q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      $$(".faq-q").forEach(function (b) {
        b.setAttribute("aria-expanded", "false");
        document.getElementById(b.getAttribute("aria-controls")).classList.remove("open");
      });
      if (!open) {
        btn.setAttribute("aria-expanded", "true");
        document.getElementById(btn.getAttribute("aria-controls")).classList.add("open");
      }
    });
  });

  /* ---------- Gallery lightbox ---------- */
  var lightbox = $("#lightbox");
  var lbImg = $("#lbImg");
  var lbCap = $("#lbCap");
  var galleryBtns = $$(".g-btn");
  var lbIndex = 0;

  function lbShow(i) {
    lbIndex = (i + galleryBtns.length) % galleryBtns.length;
    var b = galleryBtns[lbIndex];
    lbImg.src = b.getAttribute("data-full");
    lbImg.alt = b.getAttribute("data-alt") || "";
    lbCap.textContent = b.getAttribute("data-alt") || "";
  }
  function lbStep(d) { lbShow(lbIndex + d); }

  galleryBtns.forEach(function (b, i) {
    b.addEventListener("click", function () { lbShow(i); openOverlay(lightbox, b); });
  });
  $("#lbPrev").addEventListener("click", function () { lbStep(-1); });
  $("#lbNext").addEventListener("click", function () { lbStep(1); });

  var touchX = null;
  lightbox.addEventListener("touchstart", function (e) { touchX = e.changedTouches[0].clientX; }, { passive: true });
  lightbox.addEventListener("touchend", function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(dx) > 50) lbStep(dx < 0 ? 1 : -1);
  }, { passive: true });

  /* ---------- Scroll reveal ---------- */
  var reveals = $$(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in-view"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -5% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ---------- Testimonials (only with genuine reviews in config) ---------- */
  var tList = Array.isArray(CFG.testimonials) ? CFG.testimonials.filter(function (t) { return t && t.quote && t.name; }) : [];
  if (tList.length) {
    var box = $("#testimonials");
    tList.forEach(function (t) {
      var bq = document.createElement("blockquote");
      var p = document.createElement("p");
      var c = document.createElement("cite");
      p.textContent = t.quote;
      c.textContent = t.name;
      bq.appendChild(p);
      bq.appendChild(c);
      box.appendChild(bq);
    });
    box.hidden = false;
  }

  /* ---------- Intro / offer popup (only if a real offer is configured) ---------- */
  var offer = CFG.offer || {};
  if (offer.enabled && offer.title && offer.text) {
    var seen = false;
    try { seen = sessionStorage.getItem("cup2eat_offer_seen") === "1"; } catch (err) { /* storage unavailable */ }
    if (!seen) {
      $("#offer-title").textContent = offer.title;
      $("#offer-text").textContent = offer.text;
      if (offer.buttonLabel) $("#offerCta").textContent = offer.buttonLabel;
      setTimeout(function () {
        if (current) return; // never stack popups
        openOverlay($("#offerModal"), null);
        try { sessionStorage.setItem("cup2eat_offer_seen", "1"); } catch (err) { /* ignore */ }
      }, Math.max(2000, offer.delayMs || 6000));
    }
  }
})();
