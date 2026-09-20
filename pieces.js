// Onglet 4 : « Pièces à débiter »
//  - tout le monde : cocher les pièces du catalogue
//  - ajout / modification / suppression de pièces et références : protégés par mot de passe
function updatePiecesBadge() {
  const b = document.getElementById("badge-pieces");
  const n = piecesADebiter().length;
  b.hidden = n === 0;
  b.textContent = n;
}

function refHTML(ref) { return ref ? `<b class="cr">${esc(ref)}</b>` : `<span class="cr vide">réf. à saisir</span>`; }

// Carte « À débiter » (lecture seule + retrait)
function aDebiterHTML() {
  const cochees = piecesADebiter();
  if (!cochees.length)
    return `<p class="hint empty-list">Aucune pièce pour le moment. Cochez des pièces dans le catalogue ci-dessous.</p>`;
  return cochees.map(p => `
    <div class="sel-row">
      <span class="cn">${esc(p.nom)}</span>${refHTML(p.ref)}
      <input type="number" class="qte" data-qte="${p.id}" min="1" inputmode="numeric" placeholder="Qté"
        value="${esc(state.qtePieces[p.id] || "")}" aria-label="Quantité pour ${esc(p.nom)}">
      <button type="button" class="del" data-unsel="${p.id}" aria-label="Retirer ${esc(p.nom)}">✕</button>
    </div>`).join("");
}
function refreshADebiter() {
  document.getElementById("a-debiter").innerHTML = aDebiterHTML();
  const n = piecesADebiter().length;
  document.getElementById("pieces-count").textContent = n ? `${n} pièce${n > 1 ? "s" : ""}` : "";
  updatePiecesBadge();
}

const chercheur = p => norm(p.nom + " " + p.ref + " " + p.ref.replace(/\s/g, ""));

function catalogueHTML() {
  return GROUPES.map(g => {
    const items = CATALOGUE.filter(p => p.groupe === g);
    if (!items.length && !state.admin) return "";
    const rows = items.map(p => state.admin
      ? `<div class="edit-row" data-id="${p.id}">
           <input data-champ="nom" value="${esc(p.nom)}" aria-label="Nom de la pièce">
           <input data-champ="ref" value="${esc(p.ref)}" aria-label="Référence" placeholder="Référence">
           <button type="button" class="del" data-suppr="${p.id}" aria-label="Supprimer ${esc(p.nom)}">✕</button>
         </div>`
      : `<label class="cat-row" data-s="${esc(chercheur(p))}">
           <input type="checkbox" id="c-${p.id}" data-id="${p.id}" ${state.selection[p.id] ? "checked" : ""}>
           <span class="cn">${esc(p.nom)}</span>${refHTML(p.ref)}
         </label>`).join("");
    return `<section class="grp"><h3>${esc(g)}</h3>${rows}</section>`;
  }).join("") + `<p class="hint no-result" hidden>Aucune pièce ne correspond.</p>`;
}

// Bandeau du haut du catalogue : verrou / déverrouillage / formulaire d'ajout
function gestionHTML() {
  if (!state.admin) {
    return `<button type="button" class="lock-btn" id="btn-unlock">🔒 Ajouter ou modifier des pièces</button>
      <form id="unlock-form" class="unlock" autocomplete="off" hidden>
        <label for="mdp">Mot de passe</label>
        <div class="unlock-line">
          <input id="mdp" type="password" inputmode="numeric" autocomplete="off">
          <button class="primary-btn" type="submit">Débloquer</button>
        </div>
        <p id="mdp-err" class="err" hidden>Mot de passe incorrect.</p>
      </form>`;
  }
  return `<div class="admin-bar"><span>🔓 Mode modification</span>
      <button type="button" class="lock-btn" id="btn-lock">Verrouiller</button></div>
    <form id="piece-form" class="piece-add" autocomplete="off">
      <div><label for="new-nom">Nom de la pièce</label><input id="new-nom" required></div>
      <div><label for="new-ref">Référence</label><input id="new-ref"></div>
      <div class="full"><label for="new-groupe">Rubrique</label>
        <select id="new-groupe">${GROUPES.map(g => `<option>${esc(g)}</option>`).join("")}</select></div>
      <button class="primary-btn" type="submit">Ajouter au catalogue</button>
    </form>
    <p class="hint">Les noms et références se modifient directement dans la liste ci-dessous ; les changements sont enregistrés sur cet appareil.</p>
    <button type="button" class="link" id="btn-origine">Rétablir le catalogue d'origine</button>`;
}

function renderPieces() {
  const root = document.getElementById("tab-pieces");
  root.innerHTML = `
    <div class="card">
      <h2>Pièces à débiter <span id="pieces-count" class="count"></span></h2>
      <div id="a-debiter"></div>
    </div>
    <button class="primary-btn" id="pdf-pieces" type="button">Exporter le contrôle en PDF</button>

    <div class="card mt">
      <h2>Catalogue des pièces</h2>
      <div id="gestion">${gestionHTML()}</div>
      ${state.admin ? "" : `<label for="cat-search">Rechercher un nom ou une référence</label>
        <input id="cat-search" type="search" placeholder="ex. filtre, capot, 74 24…" autocomplete="off">`}
      <div id="catalogue">${catalogueHTML()}</div>
    </div>`;
  refreshADebiter();
  document.getElementById("pdf-pieces").addEventListener("click", exportPdf);
  document.getElementById("a-debiter").addEventListener("click", ev => {
    const b = ev.target.closest("[data-unsel]"); if (!b) return;
    delete state.selection[b.dataset.unsel];
    delete state.qtePieces[b.dataset.unsel];
    const cb = document.getElementById("c-" + b.dataset.unsel); if (cb) cb.checked = false;
    refreshADebiter();
  });
  document.getElementById("a-debiter").addEventListener("input", ev => {
    const id = ev.target.dataset.qte; if (!id) return;
    const v = ev.target.value.trim();
    if (v) state.qtePieces[id] = v; else delete state.qtePieces[id];
  });
  const cat = document.getElementById("catalogue");

  if (!state.admin) {
    // --- Utilisation normale : cocher, chercher, déverrouiller
    cat.addEventListener("change", ev => {
      const id = ev.target.dataset.id; if (!id) return;
      if (ev.target.checked) state.selection[id] = true;
      else { delete state.selection[id]; delete state.qtePieces[id]; }
      refreshADebiter();
    });
    document.getElementById("cat-search").addEventListener("input", ev => {
      const mots = norm(ev.target.value).split(/\s+/).filter(Boolean);
      let vus = 0;
      cat.querySelectorAll(".cat-row").forEach(r => { const ok = mots.every(m => r.dataset.s.includes(m)); r.hidden = !ok; if (ok) vus++; });
      cat.querySelectorAll(".grp").forEach(g => { g.hidden = !g.querySelector(".cat-row:not([hidden])"); });
      cat.querySelector(".no-result").hidden = vus > 0;
    });
    const form = document.getElementById("unlock-form");
    document.getElementById("btn-unlock").addEventListener("click", () => {
      form.hidden = !form.hidden;
      if (!form.hidden) document.getElementById("mdp").focus();
    });
    form.addEventListener("submit", async ev => {
      ev.preventDefault();
      const champ = document.getElementById("mdp"), err = document.getElementById("mdp-err");
      if (await verifierMotDePasse(champ.value)) { state.admin = true; renderPieces(); return; }
      err.hidden = false; champ.value = ""; champ.focus();
    });
    return;
  }

  // --- Mode modification (déverrouillé)
  const avertir = ok => { if (!ok) toast("Enregistrement impossible sur cet appareil : les changements seront perdus à la fermeture."); };
  document.getElementById("btn-lock").addEventListener("click", () => { state.admin = false; renderPieces(); });
  document.getElementById("piece-form").addEventListener("submit", ev => {
    ev.preventDefault();
    const nom = document.getElementById("new-nom"), ref = document.getElementById("new-ref");
    if (!nom.value.trim()) { nom.focus(); return; }
    CATALOGUE.push({ id: nouvelIdPiece(), nom: nom.value.trim(), ref: ref.value.trim(), groupe: document.getElementById("new-groupe").value });
    avertir(sauverCatalogue());
    const g = document.getElementById("new-groupe").value;
    renderPieces();
    document.getElementById("new-groupe").value = g;
    document.getElementById("new-nom").focus();
    toast("Pièce ajoutée au catalogue.");
  });
  cat.addEventListener("input", ev => {
    const row = ev.target.closest(".edit-row"); if (!row || !ev.target.dataset.champ) return;
    const p = CATALOGUE.find(x => x.id === row.dataset.id); if (!p) return;
    p[ev.target.dataset.champ] = ev.target.value;
    clearTimeout(cat.t); cat.t = setTimeout(() => { avertir(sauverCatalogue()); refreshADebiter(); }, 300);
  });
  cat.addEventListener("click", ev => {
    const b = ev.target.closest("[data-suppr]"); if (!b) return;
    const p = CATALOGUE.find(x => x.id === b.dataset.suppr);
    if (!b.dataset.arme) {  // premier clic : demande de confirmation
      b.dataset.arme = "1"; b.textContent = "Supprimer ?"; b.classList.add("arme");
      setTimeout(() => { if (b.isConnected) { delete b.dataset.arme; b.textContent = "✕"; b.classList.remove("arme"); } }, 3000);
      return;
    }
    CATALOGUE = CATALOGUE.filter(x => x.id !== p.id); delete state.selection[p.id]; delete state.qtePieces[p.id];
    avertir(sauverCatalogue()); renderPieces();
  });
  const origine = document.getElementById("btn-origine");
  origine.addEventListener("click", () => {
    if (!origine.dataset.arme) {
      origine.dataset.arme = "1"; origine.textContent = "Confirmer : effacer mes modifications ?";
      setTimeout(() => { if (origine.isConnected) { delete origine.dataset.arme; origine.textContent = "Rétablir le catalogue d'origine"; } }, 4000);
      return;
    }
    CATALOGUE = CATALOGUE_ORIGINE.map(p => ({ ...p }));
    Object.keys(state.selection).forEach(id => { if (!CATALOGUE.some(p => p.id === id)) { delete state.selection[id]; delete state.qtePieces[id]; } });
    avertir(sauverCatalogue()); renderPieces(); toast("Catalogue d'origine rétabli.");
  });
}
