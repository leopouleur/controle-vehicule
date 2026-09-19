// Point d'entrée : navigation par onglets, réinitialisation, service worker.
function showTab(name) {
  state.admin = false;   // le catalogue se reverrouille dès qu'on quitte l'onglet
  document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.dataset.tab === name));
  document.querySelectorAll(".panel").forEach(p => p.classList.toggle("active", p.id === "tab-" + name));
  if (name === "choix") renderChoix();
  if (name === "vehicule") renderVehicule();
  if (name === "checklist") renderChecklist();
  if (name === "pieces") renderPieces();
  window.scrollTo(0, 0);
}

function updateFicheName() {
  const f = curFiche();
  const el = document.getElementById("fiche-name");
  el.hidden = !f;
  el.textContent = f ? f.nom : "";
}

document.querySelectorAll(".tab").forEach(t =>
  t.addEventListener("click", () => showTab(t.dataset.tab)));

document.getElementById("btn-reset").addEventListener("click", () => {
  if (!confirm("Démarrer un nouveau contrôle ? Le contrôle en cours reste enregistré, vous pourrez le reprendre depuis la liste.")) return;
  nouveauRapport();
  updateFicheName();
  updateBadge();
  updatePiecesBadge();
  showTab("choix");
});

// Écran d'ouverture : le logo s'affiche brièvement (toucher l'écran pour passer)
(function () {
  const sp = document.getElementById("splash");
  if (!sp) return;
  const fermer = () => { sp.classList.add("hide"); setTimeout(() => sp.remove(), 500); };
  sp.addEventListener("click", fermer);
  setTimeout(fermer, 1600);
})();

initChecklist();
renderChoix();
updateBadge();

// Mémoire des rapports : sauvegarde automatique en continu dès qu'une fiche est choisie.
document.addEventListener("input", planifierSauvegardeRapport, true);
document.addEventListener("click", planifierSauvegardeRapport, true);

// PWA : fonctionnement hors ligne (met en cache l'application, pas vos données).
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}

// Installation sur l'appareil (tablette) : bandeau avec bouton « Installer ».
(function () {
  const banner = document.getElementById("install-banner");
  const btnInstall = document.getElementById("btn-install");
  const btnDismiss = document.getElementById("btn-install-dismiss");
  if (!banner || !btnInstall || !btnDismiss) return;

  const dejaInstallee = () =>
    window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;

  let prompt = null;

  window.addEventListener("beforeinstallprompt", e => {
    e.preventDefault();
    if (dejaInstallee()) return;
    prompt = e;
    banner.hidden = false;
  });

  btnInstall.addEventListener("click", async () => {
    if (!prompt) return;
    banner.hidden = true;
    prompt.prompt();
    await prompt.userChoice;
    prompt = null;
  });

  btnDismiss.addEventListener("click", () => { banner.hidden = true; });

  window.addEventListener("appinstalled", () => { banner.hidden = true; prompt = null; });
})();
