// Onglet 2 : « Véhicule »
const VEHICULE_CHAMPS = [
  { id: "immat", labelKey: "vehicule.champ.immat", type: "text", ph: "AB-123-CD" },
  { id: "vin", labelKey: "vehicule.champ.vin", type: "text" },
  { id: "orMagasin", labelKey: "vehicule.champ.orMagasin", type: "text" },
  { id: "date", labelKey: "vehicule.champ.date", type: "date" },
  { id: "controleur", labelKey: "vehicule.champ.controleur", type: "text", full: true },
  { id: "remarques", labelKey: "vehicule.champ.remarques", type: "textarea", full: true }
];

function renderVehicule() {
  const root = document.getElementById("tab-vehicule");
  const f = curFiche();
  if (!f) {
    root.innerHTML = `<div class="card empty">
      <p>${t("commun.choisirDabord")}</p>
      <button class="primary-btn" type="button" id="back-choix">${t("commun.choisirControle")}</button></div>`;
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
    return `<div class="${c.full ? "full" : ""}"><label for="v-${c.id}">${t(c.labelKey)}</label>${input}</div>`;
  }).join("");

  root.innerHTML = `
    <div class="card"><h2>${esc(f.nom)} ${t("vehicule.titreSuffixe")}</h2><div class="grid">${champs}</div></div>
    <button class="primary-btn" id="go-checklist" type="button">${t("vehicule.passer")}</button>`;

  VEHICULE_CHAMPS.forEach(c => {
    const el = document.getElementById("v-" + c.id);
    el.addEventListener("input", () => { state.vehicule[c.id] = el.value; });
  });
  document.getElementById("go-checklist").addEventListener("click", () => showTab("checklist"));
}
