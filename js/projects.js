/* =========================================================
   GESTION DES PROJETS (mode desktop / Electron)
   Utilise le pont `window.motionHub` exposé par le preload.
   Se dégrade proprement dans un navigateur classique.
   ========================================================= */
(function (MH) {
  "use strict";

  var utils = MH.utils;
  var desktop = typeof window.motionHub !== "undefined" && window.motionHub.isDesktop;

  MH.projects = { init: init, isDesktop: desktop };

  function init() {
    var grid = utils.$("#projects-grid");
    if (!grid) return;

    var webNotice = utils.$("#projects-web-notice");
    var emptyNotice = utils.$("#projects-empty");
    var addBtn = utils.$("#add-project-btn");

    // Mode navigateur : on affiche l'info et on désactive l'ajout.
    if (!desktop) {
      if (webNotice) webNotice.hidden = false;
      if (addBtn) addBtn.disabled = true;
      return;
    }

    var filterBar = utils.$("#proj-filters");
    var allProjects = [];
    var statusFilter = "all";

    addBtn.addEventListener("click", onAddProject);
    refresh();

    function onAddProject() {
      window.motionHub
        .pickFolder()
        .then(function (folder) {
          if (!folder) return;
          return window.motionHub.projects.add(folder);
        })
        .then(function (res) {
          if (!res) return;
          if (res.added === false && res.reason === "exists") {
            utils.toast("Ce projet est déjà dans la liste.", "warn");
          } else {
            utils.toast("Projet ajouté !", "success");
          }
          allProjects = res.projects;
          renderAll();
        })
        .catch(function (err) {
          utils.toast("Erreur : " + err.message, "error");
        });
    }

    function refresh() {
      window.motionHub.projects.list().then(function (list) {
        allProjects = list || [];
        renderAll();
      });
    }

    function statusMeta(id) {
      var s = (MH.projectStatuses || []).filter(function (x) { return x.id === id; })[0];
      return s || MH.projectStatuses[0];
    }

    function renderAll() {
      buildFilters();
      render();
    }

    function buildFilters() {
      if (!filterBar) return;
      filterBar.hidden = allProjects.length === 0;
      var defs = [{ id: "all", label: "Tous", color: "#ffffff" }].concat(MH.projectStatuses || []);
      filterBar.innerHTML = "";
      defs.forEach(function (def) {
        var n = def.id === "all" ? allProjects.length : allProjects.filter(function (p) { return (p.status || "todo") === def.id; }).length;
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "exp-filter-btn" + (def.id === statusFilter ? " active" : "");
        btn.innerHTML = utils.escapeHtml(def.label) + ' <span class="filter-count">' + n + "</span>";
        btn.addEventListener("click", function () {
          statusFilter = def.id;
          render();
          utils.$$(".exp-filter-btn", filterBar).forEach(function (b) { b.classList.toggle("active", b === btn); });
        });
        filterBar.appendChild(btn);
      });
    }

    function render() {
      grid.innerHTML = "";
      var list = allProjects.filter(function (p) {
        return statusFilter === "all" || (p.status || "todo") === statusFilter;
      });
      if (emptyNotice) emptyNotice.hidden = allProjects.length > 0;

      list.forEach(function (p) {
        var st = statusMeta(p.status || "todo");
        var card = document.createElement("div");
        card.className = "card project-card";
        card.innerHTML =
          '<div class="project-card__thumb"><i class="fas fa-clapperboard"></i></div>' +
          '<div class="project-card__head">' +
          '<i class="fas fa-folder"></i>' +
          '<span class="project-card__name">' + utils.escapeHtml(p.name) + "</span>" +
          '<span class="drive-badge">' + utils.escapeHtml(p.drive || "?") + "</span>" +
          "</div>" +
          '<span class="status-pill" style="--st:' + st.color + '"><span class="status-dot"></span>' + utils.escapeHtml(st.label) + "</span>" +
          (p.client ? '<span class="project-client"><i class="fas fa-user"></i> ' + utils.escapeHtml(p.client) + "</span>" : "") +
          (p.deadline ? '<span class="project-deadline"><i class="fas fa-calendar"></i> ' + utils.escapeHtml(p.deadline) + "</span>" : "") +
          '<div class="project-card__path" title="' + utils.escapeHtml(p.path) + '">' + utils.escapeHtml(p.path) + "</div>" +
          renderTags(p.tags) +
          '<div class="project-card__actions">' +
          '<button class="mini-btn" data-act="open"><i class="fas fa-folder-open"></i> Dossier</button>' +
          '<button class="mini-btn" data-act="source"><i class="fas fa-file-video"></i> Source</button>' +
          '<button class="mini-btn" data-act="inspect"><i class="fas fa-folder-tree"></i> Explorer</button>' +
          '<button class="mini-btn" data-act="details"><i class="fas fa-pen"></i> Détails</button>' +
          '<button class="mini-btn mini-btn--danger" data-act="remove"><i class="fas fa-xmark"></i></button>' +
          "</div>" +
          '<div class="project-card__tree" hidden></div>' +
          buildDetailsPanel(p);

        card.querySelector('[data-act="open"]').addEventListener("click", function () {
          window.motionHub.shell.open(p.path);
        });
        card.querySelector('[data-act="source"]').addEventListener("click", function () {
          window.motionHub.projects.mainFile(p.path).then(function (main) {
            if (main) window.motionHub.shell.open(main.path);
            else utils.toast("Aucun fichier projet (.aep, .blend…) trouvé.", "warn");
          });
        });
        card.querySelector('[data-act="remove"]').addEventListener("click", function () {
          window.motionHub.projects.remove(p.id).then(function (list) {
            allProjects = list;
            renderAll();
            utils.toast("Projet retiré (fichiers intacts).", "success");
          });
        });
        card.querySelector('[data-act="inspect"]').addEventListener("click", function () {
          toggleTree(card, p.path);
        });
        card.querySelector('[data-act="details"]').addEventListener("click", function () {
          var panel = card.querySelector(".project-details");
          panel.hidden = !panel.hidden;
        });

        wireDetails(card, p);
        grid.appendChild(card);
        loadThumbnail(card, p.path);
      });
    }

    function renderTags(tags) {
      if (!tags || !tags.length) return "";
      return '<div class="project-tags">' + tags.map(function (t) {
        return '<span class="tag-chip">' + utils.escapeHtml(t) + "</span>";
      }).join("") + "</div>";
    }

    function buildDetailsPanel(p) {
      var opts = (MH.projectStatuses || []).map(function (s) {
        return '<option value="' + s.id + '"' + ((p.status || "todo") === s.id ? " selected" : "") + ">" + s.label + "</option>";
      }).join("");
      return (
        '<div class="project-details" hidden>' +
        '<div class="field-row">' +
        '<div><label>Statut</label><select data-f="status">' + opts + "</select></div>" +
        '<div><label>Deadline</label><input type="date" data-f="deadline" value="' + utils.escapeHtml(p.deadline || "") + '"></div>' +
        "</div>" +
        '<label>Client</label><input type="text" data-f="client" placeholder="Nom du client" value="' + utils.escapeHtml(p.client || "") + '">' +
        '<label>Tags (séparés par des virgules)</label><input type="text" data-f="tags" placeholder="promo, 3D, urgent" value="' + utils.escapeHtml((p.tags || []).join(", ")) + '">' +
        '<label>Notes</label><textarea data-f="notes" rows="2" placeholder="Notes libres…">' + utils.escapeHtml(p.notes || "") + "</textarea>" +
        '<label>Sous-tâches</label>' +
        '<div class="subtasks" data-tasks></div>' +
        '<div class="subtask-add"><input type="text" data-f="newtask" placeholder="Nouvelle tâche…"><button class="mini-btn" data-act="addtask"><i class="fas fa-plus"></i></button></div>' +
        '<div class="project-size">' +
        '<span class="project-size__val">' + (p.sizeBytes != null ? "Taille : " + utils.formatSize(p.sizeBytes) + (p.sizeFiles ? " · " + p.sizeFiles + " fichiers" : "") : "Taille non calculée") + "</span>" +
        '<div class="detail-actions">' +
        '<button class="mini-btn" data-act="size"><i class="fas fa-weight-hanging"></i> Calculer</button>' +
        '<button class="mini-btn" data-act="backup"><i class="fas fa-copy"></i> Sauvegarder</button>' +
        "</div>" +
        "</div>" +
        "</div>"
      );
    }

    function wireDetails(card, p) {
      var panel = card.querySelector(".project-details");
      // Sauvegarde d'un champ.
      function save(patch, opts) {
        window.motionHub.projects.update(p.id, patch).then(function (updated) {
          Object.assign(p, updated);
          if (opts && opts.rerender) { renderAll(); }
          else if (opts && opts.toast) { utils.toast("Enregistré.", "success"); }
        });
      }
      panel.querySelector('[data-f="status"]').addEventListener("change", function (e) {
        save({ status: e.target.value }, { rerender: true });
      });
      panel.querySelector('[data-f="deadline"]').addEventListener("change", function (e) {
        save({ deadline: e.target.value }, { rerender: true });
      });
      panel.querySelector('[data-f="client"]').addEventListener("change", function (e) {
        save({ client: e.target.value.trim() }, { rerender: true });
      });
      panel.querySelector('[data-f="tags"]').addEventListener("change", function (e) {
        var tags = e.target.value.split(",").map(function (t) { return t.trim(); }).filter(Boolean);
        save({ tags: tags }, { rerender: true });
      });
      panel.querySelector('[data-f="notes"]').addEventListener("change", function (e) {
        save({ notes: e.target.value }, { toast: true });
      });
      panel.querySelector('[data-act="size"]').addEventListener("click", function () {
        var valEl = panel.querySelector(".project-size__val");
        valEl.textContent = "Calcul en cours…";
        window.motionHub.fs.folderSize(p.path).then(function (r) {
          valEl.textContent = "Taille : " + utils.formatSize(r.size) + " · " + r.files + " fichiers";
          save({ sizeBytes: r.size, sizeFiles: r.files });
        }).catch(function (err) {
          valEl.textContent = "Erreur : " + err.message;
        });
      });

      // Sauvegarde (copie) vers un autre disque
      panel.querySelector('[data-act="backup"]').addEventListener("click", function () {
        var btn = panel.querySelector('[data-act="backup"]');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Copie…';
        window.motionHub.projects
          .backup(p.path)
          .then(function (res) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-copy"></i> Sauvegarder';
            if (res && res.canceled) return;
            utils.toast("Sauvegarde terminée.", "success");
            if (MH.activity) MH.activity.log({ type: "Backup", label: p.name, output: res.dest });
          })
          .catch(function (err) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-copy"></i> Sauvegarder';
            utils.toast("Erreur : " + err.message, "error");
          });
      });

      // Sous-tâches
      var tasksEl = panel.querySelector("[data-tasks]");
      function renderTasks() {
        var tasks = p.tasks || [];
        if (!tasks.length) {
          tasksEl.innerHTML = '<p class="muted mini">Aucune tâche.</p>';
          return;
        }
        tasksEl.innerHTML = "";
        tasks.forEach(function (t, i) {
          var row = document.createElement("div");
          row.className = "subtask-item" + (t.done ? " done" : "");
          row.innerHTML =
            '<input type="checkbox"' + (t.done ? " checked" : "") + ">" +
            '<span class="subtask-text">' + utils.escapeHtml(t.text) + "</span>" +
            '<button class="subtask-del"><i class="fas fa-xmark"></i></button>';
          row.querySelector("input").addEventListener("change", function (e) {
            p.tasks[i].done = e.target.checked;
            save({ tasks: p.tasks });
            renderTasks();
          });
          row.querySelector(".subtask-del").addEventListener("click", function () {
            p.tasks.splice(i, 1);
            save({ tasks: p.tasks });
            renderTasks();
          });
          tasksEl.appendChild(row);
        });
      }
      renderTasks();

      panel.querySelector('[data-act="addtask"]').addEventListener("click", function () {
        var inp = panel.querySelector('[data-f="newtask"]');
        var text = (inp.value || "").trim();
        if (!text) return;
        if (!p.tasks) p.tasks = [];
        p.tasks.push({ text: text, done: false });
        inp.value = "";
        save({ tasks: p.tasks });
        renderTasks();
      });
    }

    // Cherche le rendu le plus récent et affiche sa miniature.
    function loadThumbnail(card, projectPath) {
      var thumb = card.querySelector(".project-card__thumb");
      window.motionHub.media
        .latestRender(projectPath)
        .then(function (render) {
          if (!render) return;
          return window.motionHub.media.thumbnail(render.path).then(function (dataUrl) {
            thumb.style.backgroundImage = "url('" + dataUrl + "')";
            thumb.classList.add("has-thumb");
            thumb.title = "Rendu : " + render.path.split(/[\\/]/).pop();
            thumb.addEventListener("click", function () {
              window.motionHub.shell.open(render.path);
            });
          });
        })
        .catch(function () {
          /* pas de rendu / codec illisible : on garde l'icône par défaut */
        });
    }

    function toggleTree(card, dirPath) {
      var tree = card.querySelector(".project-card__tree");
      if (!tree.hidden) {
        tree.hidden = true;
        tree.innerHTML = "";
        return;
      }
      tree.hidden = false;
      renderDir(tree, dirPath);
    }

    // Affiche le contenu d'un dossier dans `container`.
    // Les sous-dossiers sont dépliables à la demande (chargement paresseux).
    function renderDir(container, dirPath) {
      container.innerHTML = '<p class="muted tree-loading">Lecture…</p>';
      window.motionHub.fs
        .readDir(dirPath)
        .then(function (entries) {
          entries.sort(function (a, b) {
            if (a.isDir === b.isDir) return a.name.localeCompare(b.name);
            return a.isDir ? -1 : 1;
          });
          container.innerHTML = "";
          if (!entries.length) {
            container.innerHTML = '<p class="muted">Dossier vide.</p>';
            return;
          }
          entries.forEach(function (e) {
            container.appendChild(e.isDir ? buildFolderRow(e) : buildFileRow(e));
          });
        })
        .catch(function (err) {
          container.innerHTML = '<p class="muted">Erreur : ' + utils.escapeHtml(err.message) + "</p>";
        });
    }

    function buildFileRow(e) {
      var type = matchType(e);
      var row = document.createElement("div");
      row.className = "file-item " + type.cls;
      row.innerHTML =
        '<i class="fas ' + type.icon + '"></i>' +
        '<span class="file-name">' + utils.escapeHtml(e.name) + "</span>" +
        '<span class="file-size">' + utils.formatSize(e.size) + "</span>";
      row.addEventListener("dblclick", function () {
        window.motionHub.shell.open(e.path);
      });
      return row;
    }

    function buildFolderRow(e) {
      var wrap = document.createElement("div");
      wrap.className = "tree-folder";

      var row = document.createElement("div");
      row.className = "file-item folder-row";
      row.innerHTML =
        '<i class="fas fa-chevron-right chevron"></i>' +
        '<i class="fas fa-folder"></i>' +
        '<span class="file-name">' + utils.escapeHtml(e.name) + "</span>";

      var children = document.createElement("div");
      children.className = "tree-children";
      children.hidden = true;
      var loaded = false;

      row.addEventListener("click", function () {
        var open = children.hidden;
        children.hidden = !open;
        row.classList.toggle("open", open);
        if (open && !loaded) {
          loaded = true;
          renderDir(children, e.path);
        }
      });

      wrap.appendChild(row);
      wrap.appendChild(children);
      return wrap;
    }

    function matchType(entry) {
      if (entry.isDir) return { icon: "fa-folder", cls: "" };
      for (var i = 0; i < MH.fileTypes.length; i++) {
        if (MH.fileTypes[i].exts.indexOf(entry.ext) !== -1) {
          return { icon: MH.fileTypes[i].icon, cls: MH.fileTypes[i].cls };
        }
      }
      return { icon: "fa-file", cls: "" };
    }
  }
})(window.MH = window.MH || {});
