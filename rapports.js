// Mémoire des rapports : permet de reprendre un contrôle commencé (ou déjà exporté) plus tard.
// Sauvegarde automatique et continue dans le navigateur de cet appareil (comme le catalogue).
const CLE_RAPPORTS = "controle-vehicule-rapports-v1";

function nouvelIdRapport() { return "r" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

function chargerRapports() {
  try { return JSON.parse(localStorage.getItem(CLE_RAPPORTS) || "{}") || {}; }
  catch (e) { return {}; }
}
function listeRapports() {
  return Object.values(chargerRapports()).sort((a, b) => b.majLe - a.majLe);
}

// Enregistre l'état courant sous state.rapportId (rien à faire tant qu'aucune fiche n'est choisie).
function sauverRapportCourant() {
  if (!state.fiche || !state.rapportId) return;
  const tous = chargerRapports();
  tous[state.rapportId] = {
    id: state.rapportId, fiche: state.fiche,
    vehicule: state.vehicule, selection: state.selection, qtePieces: state.qtePieces,
    qteCommande: state.qteCommande, commandeManuelle: state.commandeManuelle, testBatterie: state.testBatterie, data: state.data,
    majLe: Date.now(),
    exporteLe: tous[state.rapportId]?.exporteLe || null
  };
  try { localStorage.setItem(CLE_RAPPORTS, JSON.stringify(tous)); } catch (e) { /* stockage indisponible : tant pis */ }
}

// Marque le rapport courant comme exporté en PDF (reste dans la liste pour le rouvrir/le ré-exporter).
function marquerExporte() {
  if (!state.rapportId) return;
  const tous = chargerRapports();
  if (!tous[state.rapportId]) return;
  tous[state.rapportId].exporteLe = Date.now();
  try { localStorage.setItem(CLE_RAPPORTS, JSON.stringify(tous)); } catch (e) { /* stockage indisponible */ }
}

function supprimerRapport(id) {
  const tous = chargerRapports();
  delete tous[id];
  try { localStorage.setItem(CLE_RAPPORTS, JSON.stringify(tous)); } catch (e) { /* stockage indisponible */ }
  if (state.rapportId === id) {
    nouveauRapport();
    updateFicheName();
    updateBadge();
    updatePiecesBadge();
  }
}

// Remet l'état à zéro (utilisé par « Nouveau » et par la suppression du rapport en cours).
function nouveauRapport() {
  state.fiche = null;
  state.vehicule = {};
  state.data = {};
  state.selection = {};
  state.qtePieces = {};
  state.qteCommande = {};
  state.commandeManuelle = [];
  state.testBatterie = {};
  state.admin = false;
  state.rapportId = null;
  openCats.clear();
}

function reprendreRapport(id) {
  const r = chargerRapports()[id];
  if (!r) return;
  state.rapportId = r.id;
  state.fiche = r.fiche;
  state.vehicule = r.vehicule || {};
  state.selection = r.selection || {};
  state.qtePieces = r.qtePieces || {};
  state.qteCommande = r.qteCommande || {};
  state.commandeManuelle = r.commandeManuelle || [];
  state.testBatterie = r.testBatterie || {};
  state.data = r.data || {};
  state.admin = false;
  openCats.clear();
  updateFicheName();
  updateBadge();
  updatePiecesBadge();
  showTab("vehicule");
}

// --- Onglet « Historique » ---------------------------------------------------
function rapportLigneHTML(r) {
  const f = FICHES.find(x => x.id === r.fiche);
  const immat = (r.vehicule && r.vehicule.immat) ? r.vehicule.immat : "Sans immatriculation";
  const dateC = r.vehicule && r.vehicule.date ? "Contrôle du " + dateFR(r.vehicule.date) : "";
  const courant = r.id === state.rapportId;
  const meta = [dateC, r.exporteLe ? "PDF exporté" : "", courant ? "en cours" : ""].filter(Boolean).join(" · ");
  return `<div class="rapport-row ${courant ? "courant" : ""}" data-reprendre="${r.id}">
    <div class="rapport-info">
      <span class="rapport-titre">${esc(f ? f.nom : r.fiche)} · ${esc(immat)}</span>
      <span class="rapport-meta">${esc(meta)}</span>
    </div>
    <button type="button" class="del" data-suppr-rapport="${r.id}" aria-label="Supprimer ce rapport">✕</button>
  </div>`;
}

function renderHistorique() {
  const root = document.getElementById("tab-historique");
  const liste = listeRapports();
  root.innerHTML = liste.length
    ? `<div class="card">
        <h2>Historique des rapports <span class="count">${liste.length}</span></h2>
        <p class="hint">Reprenez un contrôle déjà commencé, ou retrouvez-en un déjà exporté.</p>
        ${liste.map(rapportLigneHTML).join("")}
      </div>`
    : `<div class="card empty"><p>Aucun rapport enregistré pour le moment. Il apparaîtra ici dès que vous aurez choisi une fiche.</p></div>`;
  initRapportsListeners(root);
}

function initRapportsListeners(root) {
  root.querySelectorAll("[data-reprendre]").forEach(el =>
    el.addEventListener("click", ev => {
      if (ev.target.closest("[data-suppr-rapport]")) return;
      reprendreRapport(el.dataset.reprendre);
    }));
  root.querySelectorAll("[data-suppr-rapport]").forEach(b =>
    b.addEventListener("click", ev => {
      ev.stopPropagation();
      if (!b.dataset.arme) {
        b.dataset.arme = "1"; b.classList.add("arme");
        toast("Touchez à nouveau pour confirmer la suppression.");
        setTimeout(() => { if (b.isConnected) { delete b.dataset.arme; b.classList.remove("arme"); } }, 3000);
        return;
      }
      supprimerRapport(b.dataset.supprRapport);
      renderHistorique();
    }));
}

// Sauvegarde automatique : débounce sur toute saisie/clic une fois une fiche choisie.
let sauveRapportT = null;
function planifierSauvegardeRapport() {
  clearTimeout(sauveRapportT);
  sauveRapportT = setTimeout(sauverRapportCourant, 400);
}
