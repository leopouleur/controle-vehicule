// Onglet « Pièces à commander »
//  - vue d'ensemble des commentaires de la checklist repérés comme « à commander » (texte noir, lecture seule)
//  - ajout manuel de pièces avant export
function nouvelIdCommande() { return "m" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

// Mêmes règles que le PDF (construireCommandePdf, pdf.js) : tout commentaire non vide qui ne cite aucune
// pièce déjà « à débiter » et qui n'est pas un point « info » (Contrôle niveau / Entretien selon PMS).
function commandeDetectee() {
  const f = curFiche();
  if (!f) return [];
  const d = fdata();
  const res = [];
  f.sections.forEach((sec, si) => {
    if (sec.type === "travaux") {
      if (estACommander("travaux", d.travaux)) res.push({ cle: "travaux", texte: (d.travaux || "").trim() });
      return;
    }
    sec.items.forEach((_, i) => {
      const e = d.items[si + ":" + i] || {};
      if (estACommander(si + ":" + i, e.note)) res.push({ cle: si + ":" + i, texte: (e.note || "").trim() });
    });
  });
  return res;
}

function detecteeHTML() {
  const liste = commandeDetectee();
  if (!liste.length) return `<p class="hint empty-list">Aucun commentaire ne signale de pièce à commander pour le moment.</p>`;
  return liste.map(l => `
    <div class="sel-row">
      <span class="cn">${esc(l.texte)}</span>
      <input type="number" class="qte" data-qte-auto="${l.cle}" min="1" inputmode="numeric" placeholder="Qté"
        value="${esc(state.qteCommande[l.cle] || "")}" aria-label="Quantité">
    </div>`).join("");
}

function manuelleHTML() {
  if (!state.commandeManuelle.length) return `<p class="hint empty-list">Aucune pièce ajoutée manuellement pour le moment.</p>`;
  return state.commandeManuelle.map(m => `
    <div class="sel-row manuelle">
      <input type="text" data-manuelle-texte="${m.id}" value="${esc(m.texte)}" placeholder="Dénomination de la pièce" aria-label="Dénomination">
      <input type="number" class="qte" data-manuelle-qte="${m.id}" min="1" inputmode="numeric" placeholder="Qté"
        value="${esc(m.qte || "")}" aria-label="Quantité">
      <button type="button" class="del" data-manuelle-suppr="${m.id}" aria-label="Retirer cette pièce">✕</button>
    </div>`).join("");
}

function refreshCommande() {
  const a = document.getElementById("commande-detectee"), b = document.getElementById("commande-manuelle");
  if (a) a.innerHTML = detecteeHTML();
  if (b) b.innerHTML = manuelleHTML();
}

function renderCommande() {
  const root = document.getElementById("tab-commande");
  const f = curFiche();
  if (!f) {
    root.innerHTML = `<div class="card empty">
      <p>Choisissez d'abord un type de contrôle.</p>
      <button class="primary-btn" type="button" id="back-choix3">Choisir un contrôle</button></div>`;
    document.getElementById("back-choix3").addEventListener("click", () => showTab("choix"));
    return;
  }
  root.innerHTML = `
    <div class="card">
      <h2>Repérées dans les commentaires</h2>
      <p class="hint">Pièces citées dans un commentaire de la checklist qui ne correspondent à aucune pièce du catalogue
        « à débiter ». Pour les corriger, modifiez le commentaire dans l'onglet Checklist.</p>
      <div id="commande-detectee"></div>
    </div>
    <div class="card">
      <h2>Ajoutées manuellement</h2>
      <div id="commande-manuelle"></div>
      <button type="button" class="link" id="btn-ajout-commande">+ Ajouter une pièce</button>
    </div>
    <button class="primary-btn" id="pdf-commande" type="button">Exporter le contrôle en PDF</button>`;
  refreshCommande();

  document.getElementById("pdf-commande").addEventListener("click", exportPdf);

  document.getElementById("commande-detectee").addEventListener("input", ev => {
    const cle = ev.target.dataset.qteAuto; if (!cle) return;
    const v = ev.target.value.trim();
    if (v) state.qteCommande[cle] = v; else delete state.qteCommande[cle];
  });

  document.getElementById("btn-ajout-commande").addEventListener("click", () => {
    state.commandeManuelle.push({ id: nouvelIdCommande(), texte: "", qte: "" });
    refreshCommande();
    const champs = document.querySelectorAll("#commande-manuelle [data-manuelle-texte]");
    champs[champs.length - 1]?.focus();
  });

  document.getElementById("commande-manuelle").addEventListener("input", ev => {
    const idT = ev.target.dataset.manuelleTexte, idQ = ev.target.dataset.manuelleQte;
    const m = state.commandeManuelle.find(x => x.id === (idT || idQ));
    if (!m) return;
    if (idT) m.texte = ev.target.value; else m.qte = ev.target.value;
  });

  document.getElementById("commande-manuelle").addEventListener("click", ev => {
    const b = ev.target.closest("[data-manuelle-suppr]"); if (!b) return;
    state.commandeManuelle = state.commandeManuelle.filter(x => x.id !== b.dataset.manuelleSuppr);
    refreshCommande();
  });
}
