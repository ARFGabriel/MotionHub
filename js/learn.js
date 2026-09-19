/* =========================================================
   BIBLIOTHÈQUE DE CONNAISSANCES (« Apprendre »)
   Navigation par catégorie, recherche, lecture d'article.
   100% web (aucune dépendance desktop).
   ========================================================= */
(function (MH) {
  "use strict";

  var utils = MH.utils;
  var filter = { category: "all", query: "" };

  MH.learn = { init: init };

  function catLabel(id) {
    var c = (MH.learnCategories || []).filter(function (x) { return x.id === id; })[0];
    return c ? c.label : id;
  }
  function catIcon(id) {
    var c = (MH.learnCategories || []).filter(function (x) { return x.id === id; })[0];
    return c ? c.icon : "fa-book";
  }

  function init() {
    var list = utils.$("#learn-list");
    if (!list) return;

    buildCats();
    render();

    var search = utils.$("#learn-search");
    if (search) {
      search.addEventListener("input", function () {
        filter.query = search.value.trim().toLowerCase();
        render();
      });
    }
  }

  function buildCats() {
    var bar = utils.$("#learn-cats");
    if (!bar) return;
    var cats = [{ id: "all", label: "Tous" }].concat(MH.learnCategories || []);
    bar.innerHTML = "";
    cats.forEach(function (c) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "exp-filter-btn" + (c.id === filter.category ? " active" : "");
      btn.textContent = c.label;
      btn.addEventListener("click", function () {
        filter.category = c.id;
        utils.$$(".exp-filter-btn", bar).forEach(function (b) { b.classList.toggle("active", b === btn); });
        render();
      });
      bar.appendChild(btn);
    });
  }

  function articleText(a) {
    var parts = [a.title, a.summary, catLabel(a.category)];
    (a.body || []).forEach(function (b) {
      if (b.p) parts.push(b.p);
      if (b.h) parts.push(b.h);
      if (b.tip) parts.push(b.tip);
      if (b.ul) parts.push(b.ul.join(" "));
    });
    return parts.join(" ").toLowerCase();
  }

  function matches(a) {
    if (filter.category !== "all" && a.category !== filter.category) return false;
    if (filter.query && articleText(a).indexOf(filter.query) === -1) return false;
    return true;
  }

  function render() {
    var list = utils.$("#learn-list");
    list.innerHTML = "";
    var count = 0;

    (MH.learnArticles || []).forEach(function (a) {
      if (!matches(a)) return;
      count++;
      var card = document.createElement("button");
      card.type = "button";
      card.className = "card exp-card learn-card";
      card.innerHTML =
        "<div>" +
        '<span class="exp-cat"><i class="fas ' + catIcon(a.category) + '"></i> ' + utils.escapeHtml(catLabel(a.category)) + "</span>" +
        '<div class="exp-title">' + utils.escapeHtml(a.title) + "</div>" +
        '<div class="exp-desc-short">' + utils.escapeHtml(a.summary) + "</div>" +
        "</div>" +
        '<i class="fas fa-arrow-right exp-icon"></i>';
      card.addEventListener("click", function () { openArticle(a); });
      list.appendChild(card);
    });

    var empty = utils.$("#learn-empty");
    if (empty) empty.hidden = count > 0;
  }

  function openArticle(a) {
    var el = utils.$("#learn-article");
    var blocks = (a.body || [])
      .map(function (b) {
        if (b.h) return "<h4>" + utils.escapeHtml(b.h) + "</h4>";
        if (b.p) return "<p>" + utils.escapeHtml(b.p) + "</p>";
        if (b.ul) return "<ul>" + b.ul.map(function (i) { return "<li>" + utils.escapeHtml(i) + "</li>"; }).join("") + "</ul>";
        if (b.tip) return '<div class="learn-tip"><i class="fas fa-lightbulb"></i> ' + utils.escapeHtml(b.tip) + "</div>";
        return "";
      })
      .join("");

    el.innerHTML =
      '<button class="mini-btn learn-back"><i class="fas fa-arrow-left"></i> Retour</button>' +
      '<span class="exp-cat"><i class="fas ' + catIcon(a.category) + '"></i> ' + utils.escapeHtml(catLabel(a.category)) + "</span>" +
      "<h3 class=\"learn-title\">" + utils.escapeHtml(a.title) + "</h3>" +
      '<p class="learn-summary muted">' + utils.escapeHtml(a.summary) + "</p>" +
      '<div class="learn-body">' + blocks + "</div>";

    el.querySelector(".learn-back").addEventListener("click", closeArticle);
    utils.$("#learn-browse").hidden = true;
    el.hidden = false;
    el.scrollIntoView({ block: "start" });
  }

  function closeArticle() {
    utils.$("#learn-article").hidden = true;
    utils.$("#learn-browse").hidden = false;
  }
})(window.MH = window.MH || {});
