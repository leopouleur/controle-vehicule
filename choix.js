// Onglet 1 : « Type de contrôle »
function renderChoix() {
  const root = document.getElementById("tab-choix");
  const cartes = FICHES.map(f => {
    const nbSec = f.sections.length;
    const sel = f.id === state.fiche;
    return `<button type="button" class="fiche-card ${sel ? "sel" : ""}" data-fiche="${f.id}">
      <span class="fiche-titre">${esc(f.nom)}</span>
      <span class="fiche-meta">${countPoints(f)} points · ${nbSec} rubriques</span>
      ${sel ? '<span class="fiche-check">✓ Sélectionné</span>' : ""}
    </button>`;
  }).join("");

  root.innerHTML = `
    <div class="card">
      <h2>Choisissez le type de contrôle</h2>
      <p class="hint">Sélectionnez la fiche à remplir. Vous passerez ensuite aux informations du véhicule puis à la checklist.</p>
      <div class="fiche-list">${cartes}</div>
    </div>
    ${state.fiche ? '<button class="primary-btn" id="go-vehicule" type="button">Continuer → Véhicule</button>' : ""}`;

  root.querySelectorAll("[data-fiche]").forEach(b =>
    b.addEventListener("click", () => {
      state.fiche = b.dataset.fiche;
      updateFicheName();
      renderChoix();
      renderChecklist();
      showTab("vehicule");
    }));
  const go = document.getElementById("go-vehicule");
  if (go) go.addEventListener("click", () => showTab("vehicule"));
}
