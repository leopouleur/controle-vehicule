// Onglet 3 : « Checklist » (générée depuis la fiche choisie)
const CHOIX = {
  std:    [{ v: "ok", l: "OK" }, { v: "chef", l: "CHEF" }, { v: "ko", l: "KO" }],
  diag:   [{ v: "ok", l: "OK" }, { v: "ko", l: "KO" }],
  pms:    [{ v: "afaire", l: "À faire" }, { v: "ok", l: "OK" }],
  amelio: [{ v: "afaire", l: "À faire" }, { v: "fait", l: "Fait" }]
};
// Une valeur qui demande une intervention -> on propose « Fin travaux »
function besoinTravaux(type, v) {
  return (type === "std" && (v === "chef" || v === "ko")) ||
         (type === "diag" && v === "ko") ||
         ((type === "pms" || type === "amelio") && v === "afaire");
}
// Sections qui comptent dans l'avancement (les améliorations sont facultatives)
const compte = s => s.type === "std" || s.type === "diag" || s.type === "pms";
const openCats = new Set();

// --- Suggestions de pièces (depuis l'onglet « Pièces à débiter ») ---
const norm = t => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

// Cherche les pièces dont le nom commence à correspondre à la fin du texte tapé.
function suggestions(text) {
  const base = text.trimEnd();
  const pieces = piecesConnues();
  if (!base || !pieces.length) return [];
  const mots = base.split(/\s+/);
  const res = [];
  pieces.forEach((p, i) => {
    if (!p.nom.trim()) return;
    const nom = norm(p.nom);
    for (let k = 0; k < mots.length; k++) {        // plus longue fin de phrase qui colle
      const fin = mots.slice(k).join(" ");
      if (fin.length >= 2 && nom.includes(norm(fin))) { res.push({ i, cut: fin.length, pref: nom.startsWith(norm(fin)) ? 0 : 1 }); break; }
    }
  });
  return res.sort((a, b) => a.pref - b.pref).slice(0, 6);
}
function texteInsere(p) { return p.nom; }   // pas de référence dans le texte inséré

function showSugg(ta) {
  const box = ta.closest(".note-wrap")?.nextElementSibling;
  if (!box || !box.classList.contains("sugg")) return;
  box.innerHTML = suggestions(ta.value).map(m => {
    const p = piecesConnues()[m.i];
    return `<button type="button" data-pick="${m.i}" data-cut="${m.cut}">🔧 ${esc(p.nom)}${p.ref ? ` <small>· ${esc(p.ref)}</small>` : ""}</button>`;
  }).join("");
}

// --- Surlignage des pièces déjà « à débiter » dans le texte d'un commentaire ---
function surlignerPieces(texte) {
  const t = String(texte ?? "");
  if (!t) return "";
  const noms = [...new Set(piecesADebiter().map(p => p.nom.trim()).filter(Boolean))]
    .sort((a, b) => b.length - a.length);   // les noms les plus longs d'abord (évite qu'un nom court en coupe un plus long)
  if (!noms.length) return esc(t);
  const motif = new RegExp("(" + noms.map(n => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") + ")", "gi");
  let out = "", pos = 0, m;
  while ((m = motif.exec(t))) {
    out += esc(t.slice(pos, m.index)) + `<span class="piece-trouvee">${esc(m[0])}</span>`;
    pos = motif.lastIndex;
  }
  return out + esc(t.slice(pos));
}
function rafraichirSurlignage(ta) {
  const hl = ta.closest(".note-wrap")?.querySelector(".note-hl");
  if (hl) hl.innerHTML = surlignerPieces(ta.value);
}

function itemHTML(f, si, i) {
  const sec = f.sections[si];
  const key = si + ":" + i;
  const e = fdata().items[key] || {};
  // PMS : « À faire » et « OK » sont deux cases indépendantes (les deux peuvent rester cochées).
  const pms = sec.type === "pms";
  const btns = CHOIX[sec.type].map(c =>
    `<button type="button" data-key="${key}" data-v="${c.v}" class="${(pms ? e[c.v] : e.v === c.v) ? "sel" : ""}">${c.l}</button>`).join("");
  const travaux = pms ? !!e.afaire : (e.v && besoinTravaux(sec.type, e.v));

  let extra = "";
  if (sec.type === "pms") {
    extra += `<input class="qty" data-qty="${key}" value="${esc(e.qty)}" placeholder="Quantité / viscosité">`;
  }
  if (f.finTravaux && travaux) {
    extra += `<div class="fin"><span>Fin travaux :</span>
      <button type="button" data-fin="${key}" data-f="ok" class="${e.fin === "ok" ? "sel" : ""}">OK</button>
      <button type="button" data-fin="${key}" data-f="nok" class="${e.fin === "nok" ? "sel" : ""}">Pas OK</button></div>`;
  }
  const ko = e.v === "ko";
  const noteVisible = travaux || e.note || e.open || ko;
  extra += noteVisible
    ? `<div class="note-wrap"><div class="note-hl" aria-hidden="true">${surlignerPieces(e.note)}</div><textarea data-note="${key}" class="${ko ? "ko-note" : ""}" placeholder="${ko ? "Commentaire sur le défaut (KO)…" : "Commentaires…"}">${esc(e.note)}</textarea></div><div class="sugg"></div>`
    : `<button type="button" class="link" data-addnote="${key}">+ Commentaire</button>`;

  return `<div class="item" id="it-${si}-${i}"><div class="name">${esc(sec.items[i])}</div>
    <div class="choices">${btns}</div>${extra}</div>`;
}

function renderChecklist() {
  const root = document.getElementById("tab-checklist");
  const f = curFiche();
  if (!f) {
    root.innerHTML = `<div class="card empty">
      <p>Choisissez d'abord un type de contrôle.</p>
      <button class="primary-btn" type="button" id="back-choix2">Choisir un contrôle</button></div>`;
    document.getElementById("back-choix2").addEventListener("click", () => showTab("choix"));
    updateBadge();
    return;
  }
  const d = fdata();
  const secs = f.sections.map((sec, si) => {
    let corps;
    if (sec.type === "travaux") {
      corps = `<div class="item"><div class="note-wrap"><div class="note-hl" aria-hidden="true">${surlignerPieces(d.travaux)}</div><textarea data-travaux placeholder="Décrire les travaux supplémentaires…">${esc(d.travaux)}</textarea></div><div class="sugg"></div></div>`;
    } else {
      corps = sec.items.map((_, i) => itemHTML(f, si, i)).join("");
    }
    const cnt = sec.type === "travaux" ? "" : `<span class="count" data-count="${si}"></span>`;
    return `<details class="cat" data-cat="${si}" ${openCats.has(si) ? "open" : ""}>
      <summary><span>${esc(sec.titre)}</span>${cnt}</summary>${corps}</details>`;
  }).join("");

  const notes = f.notes.length
    ? `<div class="card notes">${f.notes.map(n => `<div>${esc(n)}</div>`).join("")}</div>` : "";

  root.innerHTML = `
    <div class="card" id="summary-card"></div>
    <div class="toolbar">
      <button type="button" id="all-ok">Tout mettre OK</button>
      <button type="button" id="pdf" class="accent">Exporter en PDF</button>
    </div>
    ${secs}${notes}`;
  updateAll();
}

function stats() {
  const f = curFiche(), d = fdata();
  const s = { koSans: 0, ok: 0, chef: 0, ko: 0, afaire: 0, fait: 0, total: 0, done: 0, fin: 0, aTraiter: 0 };
  f.sections.forEach((sec, si) => {
    sec.items.forEach((_, i) => {
      const e = d.items[si + ":" + i] || {};
      if (sec.type === "pms") {                  // « À faire » et « OK » comptent indépendamment
        if (compte(sec)) { s.total++; if (e.afaire || e.ok) s.done++; }
        if (e.ok) s.ok++;
        if (e.afaire) { s.afaire++; s.aTraiter++; if (e.fin === "ok") s.fin++; }
        return;
      }
      if (compte(sec)) { s.total++; if (e.v) s.done++; }
      if (e.v) {
        if (e.v === "ok") s.ok++;
        else if (e.v === "chef") s.chef++;
        else if (e.v === "ko") { s.ko++; if (!(e.note || "").trim()) s.koSans++; }
        else if (e.v === "afaire") s.afaire++;
        else if (e.v === "fait") s.fait++;
        if (besoinTravaux(sec.type, e.v)) { s.aTraiter++; if (e.fin === "ok") s.fin++; }
      }
    });
  });
  return s;
}

function updateAll() {
  const f = curFiche();
  if (!f) return;
  const d = fdata();
  f.sections.forEach((sec, si) => {
    if (sec.type === "travaux") return;
    const done = sec.items.filter((_, i) => {
      const e = d.items[si + ":" + i];
      return sec.type === "pms" ? !!(e && (e.afaire || e.ok)) : !!e?.v;
    }).length;
    const el = document.querySelector(`[data-count="${si}"]`);
    if (el) el.textContent = `${done}/${sec.items.length}`;
  });
  const s = stats();
  const pct = s.total ? Math.round(s.done / s.total * 100) : 0;
  let verdict = "";
  if (s.done === s.total) {
    verdict = s.ko > 0 ? "⛔ Contrôle terminé : défauts (KO) à traiter"
      : s.chef > 0 ? "⚠️ Contrôle terminé : points à voir avec le chef"
      : "✅ Contrôle terminé : rien à signaler";
  }
  const card = document.getElementById("summary-card");
  if (card) card.innerHTML = `
    <h2>${esc(f.nom)} — ${s.done}/${s.total} (${pct}%)</h2>
    <div class="progress"><div style="width:${pct}%"></div></div>
    <div class="summary">
      <span class="pill ok">${s.ok} OK</span>
      <span class="pill chef">${s.chef} chef</span>
      <span class="pill ko">${s.ko} KO</span>
      <span class="pill afaire">${s.afaire} à faire</span>
    </div>
    ${f.finTravaux && s.aTraiter ? `<div class="hint">Fin de travaux : ${s.fin}/${s.aTraiter} validés</div>` : ""}
    ${s.koSans ? `<div class="warn-line">⚠ ${s.koSans} KO sans commentaire</div>` : ""}
    <div class="verdict">${verdict}</div>`;
  updateBadge();
}

function updateBadge() {
  const badge = document.getElementById("badge");
  if (!curFiche()) { badge.hidden = true; return; }
  const s = stats();
  const n = s.ko + s.chef;
  badge.hidden = n === 0;
  badge.textContent = n;
}

function refreshItem(si, i) {
  const f = curFiche();
  const el = document.getElementById(`it-${si}-${i}`);
  if (el) el.outerHTML = itemHTML(f, si, i);
  updateAll();
}

function initChecklist() {
  const root = document.getElementById("tab-checklist");

  root.addEventListener("click", ev => {
    const f = curFiche(); if (!f) return;
    const d = fdata();
    const t = ev.target.closest("button"); if (!t) return;

    if (t.dataset.pick) {                     // insertion d'une pièce suggérée
      const box = t.closest(".sugg");
      const ta = box.previousElementSibling.querySelector("textarea");
      const base = ta.value.trimEnd();
      const piece = piecesConnues()[Number(t.dataset.pick)];
      ta.value = base.slice(0, base.length - Number(t.dataset.cut)) + texteInsere(piece);
      state.selection[piece.id] = true;        // coche aussi la pièce dans « Pièces à débiter » (avant le surlignage)
      ta.dispatchEvent(new Event("input", { bubbles: true }));   // enregistre dans l'état + surligne
      updatePiecesBadge();
      box.innerHTML = "";
      ta.focus();
      return;
    }
    if (t.dataset.v) {                        // choix d'un état
      const [si, i] = t.dataset.key.split(":").map(Number);
      const sec = f.sections[si];
      const e = d.items[t.dataset.key] || (d.items[t.dataset.key] = {});
      if (sec.type === "pms") {                 // « À faire » et « OK » : cases indépendantes
        e[t.dataset.v] = !e[t.dataset.v];
        if (!e.afaire) e.fin = undefined;
      } else {
        e.v = e.v === t.dataset.v ? undefined : t.dataset.v;  // 2e clic = désélection
        if (!e.v) e.fin = undefined;
      }
      refreshItem(si, i);
      if (e.v === "ko") document.querySelector(`[data-note="${t.dataset.key}"]`)?.focus();  // saisie directe du commentaire
    } else if (t.dataset.fin) {               // fin de travaux
      const [si, i] = t.dataset.fin.split(":").map(Number);
      const e = d.items[t.dataset.fin];
      e.fin = e.fin === t.dataset.f ? undefined : t.dataset.f;
      refreshItem(si, i);
    } else if (t.dataset.addnote) {           // ouvrir le commentaire
      const [si, i] = t.dataset.addnote.split(":").map(Number);
      (d.items[t.dataset.addnote] ||= {}).open = true;
      refreshItem(si, i);
      document.querySelector(`[data-note="${t.dataset.addnote}"]`)?.focus();
    } else if (t.id === "all-ok") {
      f.sections.forEach((sec, si) => {
        if (sec.type !== "std" && sec.type !== "diag") return;
        sec.items.forEach((_, i) => {
          const e = d.items[si + ":" + i] || (d.items[si + ":" + i] = {});
          if (!e.v) e.v = "ok";
        });
      });
      renderChecklist();
    } else if (t.id === "pdf") {
      exportPdf();
    }
  });

  root.addEventListener("input", ev => {
    const el = ev.target, d = fdata();
    if (el.dataset.note) { (d.items[el.dataset.note] ||= {}).note = el.value; updateAll(); }
    else if (el.dataset.qty) (d.items[el.dataset.qty] ||= {}).qty = el.value;
    else if ("travaux" in el.dataset) d.travaux = el.value;
    if (el.tagName === "TEXTAREA") { showSugg(el); rafraichirSurlignage(el); }
  });

  // Le surlignage doit suivre le défilement du texte dans la zone de commentaire.
  root.addEventListener("scroll", ev => {
    const ta = ev.target; if (ta.tagName !== "TEXTAREA") return;
    const hl = ta.closest(".note-wrap")?.querySelector(".note-hl");
    if (hl) { hl.scrollTop = ta.scrollTop; hl.scrollLeft = ta.scrollLeft; }
  }, true);

  root.addEventListener("toggle", ev => {
    const det = ev.target;
    if (det.matches && det.matches("details.cat")) {
      const si = Number(det.dataset.cat);
      det.open ? openCats.add(si) : openCats.delete(si);
    }
  }, true);

  // Impression : déplier toutes les rubriques
  let ouverts = [];
  window.addEventListener("beforeprint", () => {
    ouverts = [...root.querySelectorAll("details.cat:not([open])")];
    ouverts.forEach(d => d.setAttribute("open", ""));
  });
  window.addEventListener("afterprint", () => ouverts.forEach(d => d.removeAttribute("open")));
}
