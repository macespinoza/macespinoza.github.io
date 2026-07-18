(function () {
  "use strict";

  // Año dinámico en el footer
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Menú móvil
  var navbar = document.getElementById("navbar");
  var navToggle = document.getElementById("navToggle");

  if (navbar && navToggle) {
    navToggle.addEventListener("click", function () {
      var isOpen = navbar.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    navbar.querySelectorAll(".navbar__links a").forEach(function (link) {
      link.addEventListener("click", function () {
        navbar.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Botón flotante de WhatsApp: aparece tras hacer scroll
  var floatingWa = document.getElementById("floatingWa");
  if (floatingWa) {
    var toggleFloatingWa = function () {
      if (window.scrollY > 480) {
        floatingWa.classList.add("is-visible");
      } else {
        floatingWa.classList.remove("is-visible");
      }
    };
    window.addEventListener("scroll", toggleFloatingWa, { passive: true });
    toggleFloatingWa();
  }

  // Badge de "Próximo evento": lee eventos.txt (texto plano, editable sin código)
  var eventBadge = document.getElementById("eventBadge");
  if (eventBadge) {
    fetch("eventos.txt")
      .then(function (res) {
        if (!res.ok) throw new Error("eventos.txt no encontrado");
        return res.text();
      })
      .then(function (text) {
        var today = new Date();
        today.setHours(0, 0, 0, 0);

        var events = text
          .split("\n")
          .map(function (line) { return line.trim(); })
          .filter(function (line) { return line && line.charAt(0) !== "#"; })
          .map(function (line) {
            var parts = line.split("|").map(function (p) { return p.trim(); });
            var date = new Date(parts[0] + "T00:00:00");
            return { date: date, title: parts[1] || "", url: parts[2] || "" };
          })
          .filter(function (ev) { return !isNaN(ev.date) && ev.date >= today && ev.title; })
          .sort(function (a, b) { return a.date - b.date; });

        if (!events.length) return;

        var next = events[0];
        var titleEl = document.getElementById("eventBadgeTitle");
        var dateEl = document.getElementById("eventBadgeDate");
        if (titleEl) titleEl.textContent = next.title;
        if (dateEl) {
          dateEl.textContent = next.date.toLocaleDateString("es-PE", {
            day: "numeric",
            month: "long",
            year: "numeric"
          });
        }
        if (next.url) {
          eventBadge.href = next.url;
        } else {
          eventBadge.removeAttribute("href");
          eventBadge.removeAttribute("target");
        }
        eventBadge.hidden = false;
      })
      .catch(function () {
        // Sin conexión a eventos.txt (p. ej. abierto con file://) o sin eventos: badge permanece oculto
      });
  }
})();
