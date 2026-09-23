// Onglet 4 : « Pièces à débiter » = la feuille papier « PIECES » (recto + verso), case par case.
//  - 1re petite colonne : toujours vide (case à cocher de la feuille papier)
//  - 2e petite colonne : quantité, à saisir ; une pièce écrite dans un commentaire de la checklist s'y met seule en quantité 1
//  - modification des noms / références : protégée par mot de passe
function updatePiecesBadge() {
  const b = document.getElementById("badge-pieces");
  const n = piecesADebiter().length;
  b.hidden = n === 0;
  b.textContent = n;
}

const ECHELLE_LIGNE = 0.7;   // pixels d'écran par pixel du scan d'origine (hauteur mini d'une ligne)

function texteCelluleHTML(c) {
  const segs = segmentsCellule(c).map(s => {
    const cls = [s.gras ? "b" : "", s.rouge ? "r" : ""].filter(Boolean).join(" ");
    return cls ? `<span class="${cls}">${esc(s.t)}</span>` : esc(s.t);
  }).join("");
  return segs + (c.trait ? `<span class="fe-trait" style="width:${(c.trait / 4).toFixed(1)}em"></span>` : "");
}

// Les deux petites cases (coche + quantité) d'un côté de la feuille
function petitesCasesHTML(c) {
  const piece = !c.etiquette && !c.speciale && c.nom.trim();
  const choisie = !!(piece && state.selection[c.id]);
  const qte = piece && !state.admin
    ? `<input type="number" data-qte="${c.id}" min="1" inputmode="numeric" value="${choisie ? esc(state.qtePieces[c.id] || "1") : ""}" aria-label="Quantité : ${esc(c.nom)}">`
    : "";
  return `<div class="fe-c fe-case"></div><div class="fe-c fe-qte">${qte}</div>`;
}

// La grande case (référence + dénomination)
function grandeCaseHTML(c) {
  if (c.absorbee) return "";
  const cls = ["fe-c", "fe-nom", c.taille ? "fe-grand" : "", ...(c.gras || "").split("").map(x => "g-" + x)].filter(Boolean).join(" ");
  if (c.speciale === "batterie") {
    const t = state.testBatterie;
    return `<div class="${cls} fe-batterie" style="grid-row: span 2">
      <div><b>TEST BATTERIE</b> (cocher choix) :</div>
      <div class="fe-bat-choix">
        <span class="fe-bat"><input type="checkbox" id="bat-changee" data-bat="changee" ${t.changee ? "checked" : ""}><label for="bat-changee">Changée</label></span>
        <span class="fe-bat"><input type="checkbox" id="bat-ok" data-bat="ok" ${t.ok ? "checked" : ""}><label for="bat-ok">Test OK</label></span>
      </div></div>`;
  }
  if (state.admin && !c.etiquette)
    return `<div class="${cls}"><input data-edit="${c.id}" data-champ="nom" value="${esc(c.nom)}" placeholder="Nom" aria-label="Nom de la pièce">
      <input data-edit="${c.id}" data-champ="ref" value="${esc(c.ref)}" placeholder="Référence" aria-label="Référence"></div>`;
  return `<div class="${cls}"><span class="fe-txt">${texteCelluleHTML(c)}</span></div>`;
}

function grilleHTML(page) {
  const lignes = page.map(l => `minmax(${Math.round(l.h * ECHELLE_LIGNE)}px, auto)`).join(" ");
  const cases = page.map(l => petitesCasesHTML(l.g) + grandeCaseHTML(l.g) + petitesCasesHTML(l.d) + grandeCaseHTML(l.d)).join("");
  return `<div class="fe-grille" style="grid-template-rows: ${lignes}">${cases}</div>`;
}

// En-tête de la feuille : NOM (contrôleur) et N° OR (OR magasin) viennent de l'onglet « Véhicule »
function enteteHTML() {
  const v = state.vehicule;
  const sous = [v.immat, v.date && dateFR(v.date)].filter(Boolean).join(" · ");
  return `<div class="fe-entete">
    <div class="fe-boite fe-boite-nom"><b>NOM :</b> ${esc(v.controleur || "")}${sous ? `<div class="fe-sous">${esc(sous)}</div>` : ""}</div>
    <div class="fe-boite fe-boite-or"><b>N° OR :</b> ${esc(v.orMagasin || "")}</div>
    <div class="fe-boite fe-titre">PIECES</div>
  </div>`;
}

// Bandeau du bas : verrou / déverrouillage / rétablissement de la feuille d'origine
function gestionHTML() {
  if (!state.admin) {
    return `<button type="button" class="lock-btn" id="btn-unlock">🔒 Modifier les noms et références de la feuille</button>
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
    <p class="hint">Modifiez directement le nom et la référence dans les cases de la feuille (une case vide se remplit pour ajouter une pièce, une case vidée
      retire la pièce). Les changements sont enregistrés sur cet appareil.</p>
    <button type="button" class="link" id="btn-origine">Rétablir la feuille d'origine</button>`;
}

function renderPieces() {
  const root = document.getElementById("tab-pieces");
  root.innerHTML = `
    <p class="hint fe-aide">Saisissez la quantité dans la 2<sup>e</sup> petite colonne : elle est imprimée sur la feuille. Une pièce écrite
      dans un commentaire de la checklist s'y place seule en quantité 1, modifiable ici.</p>
    <div class="card" id="gestion">${gestionHTML()}</div>
    <button class="primary-btn btn-export" type="button">Exporter le contrôle en PDF</button>
    <div id="feuille-zone">
      <div class="feuille">${enteteHTML()}${grilleHTML(FEUILLE[0])}</div>
      <div class="fe-verso">Verso de la feuille</div>
      <div class="feuille">${grilleHTML(FEUILLE[1])}</div>
    </div>
    <button class="primary-btn btn-export mt" type="button">Exporter le contrôle en PDF</button>`;
  updatePiecesBadge();
  root.querySelectorAll(".btn-export").forEach(b => b.addEventListener("click", exportPdf));

  const zone = document.getElementById("feuille-zone");
  let sauveT = null;
  zone.addEventListener("input", ev => {
    const el = ev.target;
    if (el.dataset.qte) {                                   // quantité : vide (ou 0) = pas de pièce
      const id = el.dataset.qte, v = el.value.trim();
      if (v && Number(v) > 0) { state.selection[id] = true; state.qtePieces[id] = v; }
      else { delete state.selection[id]; delete state.qtePieces[id]; }
      updatePiecesBadge();
    } else if (el.dataset.edit) {                           // mode modification : nom / référence d'une case
      const c = cellulesEditables().find(x => x.id === el.dataset.edit); if (!c) return;
      c[el.dataset.champ] = el.value; c.modifie = true;
      if (el.dataset.champ === "nom") { delete c.aff; delete c.alias; }   // le nouveau nom remplace mise en forme et alias d'origine
      reconstruireCatalogue();                                             // les suggestions et la reconnaissance suivent tout de suite
      clearTimeout(sauveT);
      sauveT = setTimeout(() => {
        if (!sauverFeuille()) toast("Enregistrement impossible sur cet appareil : les changements seront perdus à la fermeture.");
        updatePiecesBadge();
      }, 300);
    }
  });
  zone.addEventListener("change", ev => {
    const k = ev.target.dataset.bat; if (!k) return;
    if (ev.target.checked) state.testBatterie[k] = true; else delete state.testBatterie[k];
  });

  if (!state.admin) {
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
  document.getElementById("btn-lock").addEventListener("click", () => { state.admin = false; renderPieces(); });
  const origine = document.getElementById("btn-origine");
  origine.addEventListener("click", () => {
    if (!origine.dataset.arme) {
      origine.dataset.arme = "1"; origine.textContent = "Confirmer : effacer mes modifications ?";
      setTimeout(() => { if (origine.isConnected) { delete origine.dataset.arme; origine.textContent = "Rétablir la feuille d'origine"; } }, 4000);
      return;
    }
    retablirFeuille();
    renderPieces(); toast("Feuille d'origine rétablie.");
  });
}
