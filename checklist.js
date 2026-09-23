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
const norm = t => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[’‘]/g, "'").toLowerCase();

// Cherche les pièces dont le nom commence à correspondre à la fin du texte tapé.
function suggestions(text) {
  const base = text.trimEnd();
  const pieces = piecesConnues();
  if (!base || !pieces.length) return [];
  const mots = base.split(/\s+/);
  const res = [];
  pieces.forEach((p, i) => {
    const noms = nomsPiece(p).map(norm).filter(n => n.trim());
    for (let k = 0; k < mots.length; k++) {        // plus longue fin de phrase qui colle
      const brut = mots.slice(k).join(" "), fin = norm(brut);
      if (fin.length < 2) continue;
      const nom = noms.find(n => n.includes(fin));
      if (nom) { res.push({ i, cut: brut.length, pref: nom.startsWith(fin) ? 0 : 1 }); break; }
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
    const detail = [p.groupe, p.ref].filter(Boolean).join(" · ");
    return `<button type="button" data-pick="${m.i}" data-cut="${m.cut}">🔧 ${esc(p.nom)}${detail ? ` <small>· ${esc(detail)}</small>` : ""}</button>`;
  }).join("");
}

// --- Reconnaissance des pièces de la feuille « Pièces à débiter » dans le texte d'un commentaire ---
// Insensible aux accents et à la casse ; un nom ne compte que s'il est isolé (pas au milieu d'un autre mot).
const estMot = ch => !!ch && /[\p{L}\p{N}]/u.test(ch);
function normAvecCarte(t) {
  let n = "";
  const carte = [];   // carte[k] = position, dans le texte d'origine, du k-ème caractère normalisé
  for (let i = 0; i < t.length; i++) {
    const c = norm(t[i]);
    for (let k = 0; k < c.length; k++) { n += c[k]; carte.push(i); }
  }
  return { n, carte };
}
function occurrences(n, nom) {
  const res = [];
  for (let i = n.indexOf(nom); i !== -1; i = n.indexOf(nom, i + 1))
    if (!estMot(n[i - 1]) && !estMot(n[i + nom.length])) res.push(i);
  return res;
}
// Plages [début, fin[ du texte d'origine où apparaît le nom d'une des pièces données
function plagesPieces(t, pieces) {
  const { n, carte } = normAvecCarte(t);
  const noms = [...new Set(pieces.flatMap(nomsPiece).map(x => norm(x).trim()).filter(Boolean))]
    .sort((a, b) => b.length - a.length);   // les noms les plus longs d'abord (évite qu'un nom court en coupe un plus long)
  const res = [];
  noms.forEach(nom => occurrences(n, nom).forEach(s => {
    const a = carte[s], b = carte[s + nom.length - 1] + 1;
    if (!res.some(([x, y]) => a < y && b > x)) res.push([a, b]);
  }));
  return res.sort((p, q) => p[0] - q[0]);
}
// Sélectionne (quantité 1) toute pièce citée en toutes lettres dans le texte. Un nom porté par plusieurs pièces
// (ex. « Collier », « coin G ») reste ambigu : on choisit alors la bonne dans les suggestions.
function reconnaitrePieces(texte) {
  const t = String(texte ?? "");
  if (!t.trim()) return false;
  const { n } = normAvecCarte(t);
  const parNom = new Map();
  piecesConnues().forEach(p => nomsPiece(p).forEach(x => {
    const k = norm(x).trim();
    if (k) parNom.set(k, (parNom.get(k) || new Set()).add(p));
  }));
  let change = false;
  parNom.forEach((ps, nom) => {
    if (ps.size !== 1) return;
    const p = [...ps][0];
    if (!state.selection[p.id] && occurrences(n, nom).length && selectionnerPiece(p.id)) change = true;
  });
  return change;
}

// --- Surlignage des pièces « à débiter » dans le texte d'un commentaire ---
function surlignerPieces(texte) {
  const t = String(texte ?? "");
  if (!t) return "";
  let out = "", pos = 0;
  plagesPieces(t, piecesADebiter()).forEach(([a, b]) => {
    out += esc(t.slice(pos, a)) + `<span class="piece-trouvee">${esc(t.slice(a, b))}</span>`;
    pos = b;
  });
  return out + esc(t.slice(pos));
}
// --- Points « Contrôle niveau » et « Entretien selon PMS » : commentaire toujours en vert, jamais une pièce à commander ---
function estInfoVerte(cle) {
  if (!cle) return false;
  const f = curFiche();
  const [si, i] = cle.split(":").map(Number);
  const sec = f && f.sections[si];
  if (!sec) return false;
  if (sec.type === "pms") return true;
  const nom = sec.items && sec.items[i];
  return !!nom && norm(nom).includes("controle niveau");
}
function noteHL(cle, texte) {
  const t = String(texte ?? "");
  if (!t) return "";
  return estInfoVerte(cle) ? `<span class="note-verte">${esc(t)}</span>` : surlignerPieces(t);
}
function rafraichirSurlignage(ta) {
  const hl = ta.closest(".note-wrap")?.querySelector(".note-hl");
  if (!hl) return;
  hl.innerHTML = noteHL(ta.dataset.note, ta.value);
}

// --- Pièces à commander : tout commentaire non vide qui ne cite aucune pièce déjà « à débiter »
// (et qui n'est pas un point « Contrôle niveau », toujours exclu de cette liste) ---
function aPieceReconnue(texte) {
  return plagesPieces(String(texte ?? ""), piecesADebiter()).length > 0;
}
function estACommander(cle, texte) {
  const t = String(texte ?? "").trim();
  return !!t && !aPieceReconnue(t) && !estInfoVerte(cle);
}
function commandeHTML(cle, texte) {
  return `<div class="commande-qte" data-commande="${cle}" ${estACommander(cle, texte) ? "" : "hidden"}>
    <input type="number" class="qty" data-qte-commande="${cle}" min="1" inputmode="numeric"
      placeholder="Quantité à commander" value="${esc(state.qteCommande[cle] || "")}">
  </div>`;
}
function rafraichirCommande(cle, texte) {
  const div = document.querySelector(`[data-commande="${cle}"]`);
  if (div) div.hidden = !estACommander(cle, texte);
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
  const noteVisible = travaux || e.note || e.commentaire || e.open || ko;
  extra += noteVisible
    ? `<div class="note-split">
        <div class="note-col">
          <div class="col-label">Pièce à débiter / à commander</div>
          <div class="note-wrap"><div class="note-hl" aria-hidden="true">${noteHL(key, e.note)}</div>
            <textarea data-note="${key}" placeholder="Nom de la pièce…">${esc(e.note)}</textarea></div>
          <div class="sugg"></div>
          ${commandeHTML(key, e.note)}
        </div>
        <div class="commentaire-col">
          <div class="col-label">Commentaire</div>
          <textarea data-commentaire="${key}" class="${ko ? "ko-note" : ""}" placeholder="${ko ? "Commentaire sur le défaut (KO)…" : "Ex. Réglage des phares…"}">${esc(e.commentaire)}</textarea>
        </div>
      </div>`
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
      // Texte libre : jamais analysé, ne définit ni pièce à débiter ni pièce à commander.
      if (d.travauxCommentaire) {   // anciens rapports : les deux champs sont réunis en un seul
        d.travaux = [d.travaux, d.travauxCommentaire].filter(Boolean).join("\n");
        delete d.travauxCommentaire;
      }
      corps = `<div class="item"><textarea data-travaux placeholder="Décrire les travaux supplémentaires…">${esc(d.travaux)}</textarea></div>`;
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
        else if (e.v === "ko") { s.ko++; if (!(e.commentaire || "").trim()) s.koSans++; }
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
      selectionnerPiece(piece.id);             // la pièce passe sur la feuille « Pièces à débiter » en quantité 1 (avant le surlignage)
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
      if (e.v === "ko") document.querySelector(`[data-commentaire="${t.dataset.key}"]`)?.focus();  // saisie directe du commentaire
    } else if (t.dataset.fin) {               // fin de travaux
      const [si, i] = t.dataset.fin.split(":").map(Number);
      const e = d.items[t.dataset.fin];
      e.fin = e.fin === t.dataset.f ? undefined : t.dataset.f;
      refreshItem(si, i);
    } else if (t.dataset.addnote) {           // ouvrir le commentaire
      const [si, i] = t.dataset.addnote.split(":").map(Number);
      (d.items[t.dataset.addnote] ||= {}).open = true;
      refreshItem(si, i);
      document.querySelector(`[data-commentaire="${t.dataset.addnote}"]`)?.focus();
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
    if (el.dataset.note && !estInfoVerte(el.dataset.note) && reconnaitrePieces(el.value)) updatePiecesBadge();   // pièce citée en toutes lettres : quantité 1
    if (el.dataset.note) { (d.items[el.dataset.note] ||= {}).note = el.value; rafraichirCommande(el.dataset.note, el.value); }
    else if (el.dataset.commentaire) { (d.items[el.dataset.commentaire] ||= {}).commentaire = el.value; updateAll(); }
    else if (el.dataset.qty) (d.items[el.dataset.qty] ||= {}).qty = el.value;
    else if ("travaux" in el.dataset) d.travaux = el.value;
    else if (el.dataset.qteCommande) {
      const v = el.value.trim();
      if (v) state.qteCommande[el.dataset.qteCommande] = v; else delete state.qteCommande[el.dataset.qteCommande];
    }
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
