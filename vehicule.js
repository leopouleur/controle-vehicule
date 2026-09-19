// Onglet 2 : « Véhicule »
const VEHICULE_CHAMPS = [
  { id: "immat", label: "Immatriculation", type: "text", ph: "AB-123-CD" },
  { id: "vin", label: "N° OR", type: "text" },
  { id: "marque", label: "Marque", type: "text" },
  { id: "modele", label: "Modèle", type: "text" },
  { id: "km", label: "Kilométrage", type: "number", ph: "0" },
  { id: "date", label: "Date du contrôle", type: "date" },
  { id: "controleur", label: "Contrôleur", type: "text", full: true },
  { id: "remarques", label: "Remarques générales", type: "textarea", full: true }
];

function renderVehicule() {
  const root = document.getElementById("tab-vehicule");
  const f = curFiche();
  if (!f) {
    root.innerHTML = `<div class="card empty">
      <p>Choisissez d'abord un type de contrôle.</p>
      <button class="primary-btn" type="button" id="back-choix">Choisir un contrôle</button></div>`;
    document.getElementById("back-choix").addEventListener("click", () => showTab("choix"));
    return;
  }
  if (!state.vehicule.date) state.vehicule.date = new Date().toISOString().slice(0, 10);

  const champs = VEHICULE_CHAMPS.map(c => {
    const val = esc(state.vehicule[c.id] ?? "");
    const input = c.type === "textarea"
      ? `<textarea id="v-${c.id}">${val}</textarea>`
      : `<input id="v-${c.id}" type="${c.type}" value="${val}" placeholder="${c.ph || ""}"
           ${c.type === "number" ? 'inputmode="numeric"' : ""}
           ${c.id === "immat" ? 'autocapitalize="characters"' : ""}>`;
    return `<div class="${c.full ? "full" : ""}"><label for="v-${c.id}">${c.label}</label>${input}</div>`;
  }).join("");

  root.innerHTML = `
    <div class="card"><h2>${esc(f.nom)} — informations du véhicule</h2><div class="grid">${champs}</div></div>
    <button class="primary-btn" id="go-checklist" type="button">Passer à la checklist →</button>`;

  VEHICULE_CHAMPS.forEach(c => {
    const el = document.getElementById("v-" + c.id);
    el.addEventListener("input", () => { state.vehicule[c.id] = el.value; });
  });
  document.getElementById("go-checklist").addEventListener("click", () => showTab("checklist"));
}
