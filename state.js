// État de l'application, en mémoire uniquement (aucun stockage persistant).
const state = {
  fiche: null,     // id de la fiche choisie
  vehicule: {},
  selection: {},   // pièces du catalogue cochées : { id: true }
  qtePieces: {},   // quantité saisie pour une pièce à débiter : { id: "2" }
  qteCommande: {}, // quantité saisie pour un commentaire « à commander » : { "si:i" ou "travaux": "2" }
  commandeManuelle: [], // pièces à commander ajoutées à la main : [{ id, texte, qte }]
  testBatterie: {},     // bloc « TEST BATTERIE » de la feuille de pièces : { changee: true, ok: true }
  admin: false,    // mode modification du catalogue (déverrouillé par mot de passe)    // infos du véhicule (partagées entre fiches)
  data: {},        // ficheId -> { items: { "sec:idx": {v, note, qty, fin, open} }, travaux: "" }
  rapportId: null  // id du rapport en cours dans la mémoire des rapports (rapports.js), une fois une fiche choisie
};

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function curFiche() { return FICHES.find(f => f.id === state.fiche) || null; }
function fdata() {
  return (state.data[state.fiche] ||= { items: {}, travaux: "" });
}
function countPoints(f) { return f.sections.reduce((n, s) => n + s.items.length, 0); }
