/* =========================================================
   TABLEAU DE BORD
   Widgets : projets, échéances, stockage, surveillances,
   accès rapides, astuce. Se dégrade proprement en mode web.
   ========================================================= */
(function (MH) {
  "use strict";

  var utils = MH.utils;
  var desktop = typeof window.motionHub !== "undefined" && window.motionHub.isDesktop;

  MH.dashboard = { init: init, refresh: refresh };

  function init() {
    // Salutation
    var g = utils.$("#dash-greeting");
    if (g) g.textContent = greeting() + " — " + new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });

    // Accès rapides
    utils.$$("#dash-quick [data-quick]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        onQuick(btn.dataset.quick);
      });
    });

    renderTip();
    renderActivity();
    if (MH.activity && MH.activity.onChange) MH.activity.onChange(renderActivity);
    refresh();
  }

  /* ---- Widget Activité récente ---- */
  function renderActivity() {
    if (!MH.activity) return;
    var items = MH.activity.list().slice(0, 6);
    if (!items.length) {
      setBody("#dash-activity", '<p class="muted">Aucune activité pour l\'instant.</p>');
      return;
    }
    var rows = items
      .map(function (a, i) {
        return (
          '<div class="activity-row" data-i="' + i + '"' + (a.output && desktop ? ' data-open="1"' : "") + ">" +
          '<span class="activity-type">' + utils.escapeHtml(a.type) + "</span>" +
          '<span class="activity-label">' + utils.escapeHtml(a.label) + "</span>" +
          '<span class="activity-time">' + ago(a.time) + "</span>" +
          "</div>"
        );
      })
      .join("");
    setBody("#dash-activity", rows);

    utils.$$("#dash-activity .activity-row[data-open]").forEach(function (row) {
      row.style.cursor = "pointer";
      row.addEventListener("click", function () {
        var a = items[parseInt(row.dataset.i, 10)];
        if (a && a.output) window.motionHub.shell.open(a.output);
      });
    });
  }

  function ago(ts) {
    var s = Math.round((Date.now() - ts) / 1000);
    if (s < 60) return "à l'instant";
    var m = Math.round(s / 60);
    if (m < 60) return "il y a " + m + " min";
    var h = Math.round(m / 60);
    if (h < 24) return "il y a " + h + " h";
    return "il y a " + Math.round(h / 24) + " j";
  }

  function greeting() {
    var h = new Date().getHours();
    if (h < 12) return "Bonjour";
    if (h < 18) return "Bon après-midi";
    return "Bonsoir";
  }

  function onQuick(action) {
    if (!MH.showTool) return;
    if (action === "add-project") {
      MH.showTool("projects");
      var b = utils.$("#add-project-btn");
      if (b && !b.disabled) b.click();
    } else if (action === "media" || action === "transcode") {
      MH.showTool("media");
    } else if (action === "watch") {
      MH.showTool("automation-watch");
    } else if (action === "code") {
      MH.showTool("code");
    } else if (action === "references") {
      MH.showTool("references");
    }
  }

  function refresh() {
    if (!desktop) {
      setBody("#dash-projects", '<p class="muted">Disponible dans l\'app desktop.</p>');
      setBody("#dash-deadlines", '<p class="muted">—</p>');
      setBody("#dash-storage", '<p class="muted">—</p>');
      setBody("#dash-watch", '<p class="muted">—</p>');
      return;
    }
    window.motionHub.projects.list().then(function (projects) {
      renderProjects(projects || []);
      renderDeadlines(projects || []);
      renderStorage(projects || []);
    });
    if (window.motionHub.watch && window.motionHub.watch.list) {
      window.motionHub.watch.list().then(renderWatch);
    }
  }

  function setBody(sel, html) {
    var el = utils.$(sel + " .dash-body");
    if (el) el.innerHTML = html;
  }

  /* ---- Widget Projets (mini-kanban) ---- */
  function renderProjects(projects) {
    var statuses = MH.projectStatuses || [];
    var chips = statuses
      .map(function (s) {
        var n = projects.filter(function (p) { return (p.status || "todo") === s.id; }).length;
        return '<button class="kanban-chip" data-status="' + s.id + '" style="--st:' + s.color + '"><span class="kanban-n">' + n + "</span> " + utils.escapeHtml(s.label) + "</button>";
      })
      .join("");
    setBody("#dash-projects",
      '<div class="dash-big">' + projects.length + '<span class="dash-big__unit"> projet' + (projects.length > 1 ? "s" : "") + "</span></div>" +
      '<div class="kanban-chips">' + chips + "</div>");

    utils.$$("#dash-projects .kanban-chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        MH.showTool("projects");
      });
    });
  }

  /* ---- Widget Échéances ---- */
  function renderDeadlines(projects) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var items = projects
      .filter(function (p) { return p.deadline && (p.status || "todo") !== "done"; })
      .map(function (p) {
        var d = new Date(p.deadline + "T00:00:00");
        var days = Math.round((d - today) / 86400000);
        return { name: p.name, days: days };
      })
      .sort(function (a, b) { return a.days - b.days; })
      .slice(0, 5);

    if (!items.length) {
      setBody("#dash-deadlines", '<p class="muted">Aucune échéance à venir.</p>');
      return;
    }
    var rows = items
      .map(function (it) {
        var label, cls;
        if (it.days < 0) { label = "en retard de " + -it.days + " j"; cls = "late"; }
        else if (it.days === 0) { label = "aujourd'hui"; cls = "soon"; }
        else if (it.days === 1) { label = "demain"; cls = "soon"; }
        else if (it.days <= 3) { label = "dans " + it.days + " j"; cls = "soon"; }
        else { label = "dans " + it.days + " j"; cls = "ok"; }
        return '<div class="deadline-row deadline-row--' + cls + '"><span>' + utils.escapeHtml(it.name) + "</span><span class=\"deadline-badge\">" + label + "</span></div>";
      })
      .join("");
    setBody("#dash-deadlines", rows);
  }

  /* ---- Widget Stockage ---- */
  function renderStorage(projects) {
    var withSize = projects.filter(function (p) { return typeof p.sizeBytes === "number"; });
    var totalTracked = withSize.reduce(function (a, p) { return a + p.sizeBytes; }, 0);
    var header =
      '<div class="dash-big">' + utils.formatSize(totalTracked) + '<span class="dash-big__unit"> suivis</span></div>' +
      (withSize.length < projects.length ? '<p class="muted mini">' + withSize.length + "/" + projects.length + " projets mesurés (calcule leur taille dans l'onglet Projets)</p>" : "");

    setBody("#dash-storage", header + '<div id="dash-disks"></div>');

    var paths = projects.map(function (p) { return p.path; });
    window.motionHub.system.diskSpace(paths).then(function (disks) {
      var el = utils.$("#dash-disks");
      if (!el) return;
      el.innerHTML = (disks || [])
        .map(function (d) {
          var used = d.total - d.free;
          var pct = d.total ? Math.round((used / d.total) * 100) : 0;
          return (
            '<div class="disk-row"><div class="disk-row__head"><span>' + utils.escapeHtml(d.drive) + "</span><span>" +
            utils.formatSize(d.free) + " libres / " + utils.formatSize(d.total) + "</span></div>" +
            '<div class="disk-bar"><div class="disk-bar__fill" style="width:' + pct + '%"></div></div></div>'
          );
        })
        .join("");
    });
  }

  /* ---- Widget Surveillances ---- */
  function renderWatch(watches) {
    watches = watches || [];
    if (!watches.length) {
      setBody("#dash-watch", '<p class="muted">Aucune surveillance active.</p>');
      return;
    }
    var rows = watches
      .map(function (w) {
        return '<div class="watch-mini"><i class="fas fa-circle-dot"></i> <span>' + utils.escapeHtml(shortPath(w.folder)) + "</span> <em>" + (w.mode === "proxy" ? "auto-proxy" : "notif") + "</em></div>";
      })
      .join("");
    setBody("#dash-watch", '<div class="dash-big">' + watches.length + '<span class="dash-big__unit"> active' + (watches.length > 1 ? "s" : "") + "</span></div>" + rows);
  }

  function shortPath(p) {
    var parts = p.split(/[\\/]/);
    return parts.length > 2 ? "…/" + parts.slice(-2).join("/") : p;
  }

  /* ---- Astuce du jour (expression aléatoire, stable par jour) ---- */
  function renderTip() {
    var exps = MH.expressions || [];
    if (!exps.length) return;
    var day = Math.floor(Date.now() / 86400000);
    var exp = exps[day % exps.length];
    setBody("#dash-tip",
      '<div class="tip-cat">' + utils.escapeHtml(exp.category || "") + "</div>" +
      '<div class="tip-title">' + utils.escapeHtml(exp.title) + "</div>" +
      '<p class="muted">' + utils.escapeHtml(exp.desc) + "</p>" +
      '<button class="mini-btn" id="tip-open"><i class="fas fa-arrow-right"></i> Voir l\'expression</button>');
    var btn = utils.$("#tip-open");
    if (btn) btn.addEventListener("click", function () {
      if (MH.showDetail) MH.showDetail(exp);
    });
  }
})(window.MH = window.MH || {});
