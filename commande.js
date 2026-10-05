// Onglet « Pièces à commander »
//  - vue d'ensemble des commentaires de la checklist repérés comme « à commander » (texte noir, lecture seule)
//  - ajout manuel de pièces avant export
function nouvelIdCommande() { return "m" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

// Mêmes règles que le PDF (construireCommandePdf, pdf.js) : tout ce qui, dans le champ « Pièce à débiter / à commander »,
// ne cite aucune pièce déjà « à débiter » — même mêlé à une pièce reconnue dans le même champ — et qui n'est pas un point
// « info » (Contrôle niveau / Entretien selon PMS). Un retour à la ligne ou un « / » sépare plusieurs pièces dans le même champ.
function commandeDetectee() {
  const f = curFiche();
  if (!f) return [];
  const d = fdata();
  const res = [];
  f.sections.forEach((sec, si) => {
    sec.items.forEach((_, i) => {
      const e = d.items[si + ":" + i] || {};
      const cle = si + ":" + i;
      segmentsACommander(cle, e.note).forEach((texte, k) => res.push({ cle: cle + ":" + k, texte }));
    });
  });
  return res;
}

function detecteeHTML() {
  const liste = commandeDetectee();
  if (!liste.length) return `<p class="hint empty-list">${t("commande.videDetectee")}</p>`;
  return liste.map(l => `
    <div class="sel-row">
      <span class="cn">${esc(l.texte)}</span>
      <input type="number" class="qte" data-qte-auto="${l.cle}" min="1" inputmode="numeric" placeholder="${t("checklist.qte")}"
        value="${esc(state.qteCommande[l.cle] || "")}" aria-label="${t("checklist.qte")}">
    </div>`).join("");
}

function manuelleHTML() {
  if (!state.commandeManuelle.length) return `<p class="hint empty-list">${t("commande.videManuelle")}</p>`;
  return state.commandeManuelle.map(m => `
    <div class="sel-row manuelle">
      <input type="text" data-manuelle-texte="${m.id}" value="${esc(m.texte)}" placeholder="${t("commande.denomination")}" aria-label="${t("commande.denomination")}">
      <input type="number" class="qte" data-manuelle-qte="${m.id}" min="1" inputmode="numeric" placeholder="${t("checklist.qte")}"
        value="${esc(m.qte || "")}" aria-label="${t("checklist.qte")}">
      <button type="button" class="del" data-manuelle-suppr="${m.id}" aria-label="${t("commande.retirer")}">✕</button>
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
      <p>${t("commun.choisirDabord")}</p>
      <button class="primary-btn" type="button" id="back-choix3">${t("commun.choisirControle")}</button></div>`;
    document.getElementById("back-choix3").addEventListener("click", () => showTab("choix"));
    return;
  }
  root.innerHTML = `
    <div class="card">
      <h2>${t("commande.reperees")}</h2>
      <p class="hint">${t("commande.hint")}</p>
      <div id="commande-detectee"></div>
    </div>
    <div class="card">
      <h2>${t("commande.ajoutees")}</h2>
      <div id="commande-manuelle"></div>
      <button type="button" class="link" id="btn-ajout-commande">${t("commande.ajouterPiece")}</button>
    </div>
    <button class="primary-btn" id="pdf-commande" type="button">${t("commande.exporter")}</button>`;
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
