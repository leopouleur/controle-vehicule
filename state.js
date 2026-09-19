// État de l'application, en mémoire uniquement (aucun stockage persistant).
const state = {
  fiche: null,     // id de la fiche choisie
  vehicule: {},
  selection: {},   // pièces du catalogue cochées : { id: true }
  admin: false,    // mode modification du catalogue (déverrouillé par mot de passe)    // infos du véhicule (partagées entre fiches)
  data: {}         // ficheId -> { items: { "sec:idx": {v, note, qty, fin, open} }, travaux: "" }
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
