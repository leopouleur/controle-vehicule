// Onglet 1 : « Type de contrôle »
function renderChoix() {
  const root = document.getElementById("tab-choix");
  const cartes = FICHES.map(f => {
    const nbSec = f.sections.length;
    const sel = f.id === state.fiche;
    return `<button type="button" class="fiche-card ${sel ? "sel" : ""}" data-fiche="${f.id}">
      <span class="fiche-titre">${esc(f.nom)}</span>
      <span class="fiche-meta">${countPoints(f)} ${t("choix.points")} · ${nbSec} ${t("choix.rubriques")}</span>
      ${sel ? `<span class="fiche-check">${t("choix.selectionne")}</span>` : ""}
    </button>`;
  }).join("");

  root.innerHTML = `
    <div class="card">
      <h2>${t("choix.titre")}</h2>
      <p class="hint">${t("choix.hint")}</p>
      <div class="fiche-list">${cartes}</div>
    </div>
    ${state.fiche ? `<button class="primary-btn" id="go-vehicule" type="button">${t("choix.continuer")}</button>` : ""}`;

  root.querySelectorAll("[data-fiche]").forEach(b =>
    b.addEventListener("click", () => {
      state.fiche = b.dataset.fiche;
      if (!state.rapportId) state.rapportId = nouvelIdRapport();
      updateFicheName();
      sauverRapportCourant();
      renderChoix();
      renderChecklist();
      showTab("vehicule");
    }));
  const go = document.getElementById("go-vehicule");
  if (go) go.addEventListener("click", () => showTab("vehicule"));
}
