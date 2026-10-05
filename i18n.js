// Langue de l'interface : français par défaut à chaque ouverture (jamais mémorisé), bosniaque en option
// via le drapeau en haut à gauche. Les PDF générés (pdf.js) restent toujours en français, quelle que soit
// la langue affichée, et les noms des points de contrôle et des pièces (fiches.js, catalogue.js) ne sont
// jamais traduits : seule l'interface (boutons, onglets, libellés, messages) change de langue.
let LANG = "fr";

const I18N = {
  fr: {
    "app.titre": "Contrôle véhicule",
    "app.nouveau": "Nouveau",
    "app.nouveau.confirm": "Démarrer un nouveau contrôle ? Le contrôle en cours reste enregistré, vous pourrez le reprendre depuis la liste.",
    "install.texte": "Installer l'application sur cette tablette pour l'utiliser comme une appli, même sans connexion.",
    "install.installer": "Installer",
    "install.fermer": "Fermer",

    "tabs.choix": "Type de contrôle",
    "tabs.vehicule": "Véhicule",
    "tabs.checklist": "Checklist",
    "tabs.pieces": "Pièces à débiter",
    "tabs.commande": "Pièces à commander",
    "tabs.historique": "Historique",

    "choix.titre": "Choisissez le type de contrôle",
    "choix.hint": "Sélectionnez la fiche à remplir. Vous passerez ensuite aux informations du véhicule puis à la checklist.",
    "choix.points": "points",
    "choix.rubriques": "rubriques",
    "choix.selectionne": "✓ Sélectionné",
    "choix.continuer": "Continuer → Véhicule",

    "commun.choisirDabord": "Choisissez d'abord un type de contrôle.",
    "commun.choisirControle": "Choisir un contrôle",

    "vehicule.titreSuffixe": "— informations du véhicule",
    "vehicule.champ.immat": "Immatriculation",
    "vehicule.champ.vin": "OR atelier",
    "vehicule.champ.orMagasin": "OR magasin",
    "vehicule.champ.date": "Date du contrôle",
    "vehicule.champ.controleur": "Contrôleur",
    "vehicule.champ.remarques": "Remarques générales",
    "vehicule.passer": "Passer à la checklist →",

    "etat.ok": "OK", "etat.chef": "CHEF", "etat.ko": "KO", "etat.afaire": "À faire", "etat.fait": "Fait",
    "checklist.toutOk": "Tout mettre OK",
    "checklist.exporter": "Exporter en PDF",
    "checklist.finTravaux": "Fin travaux :",
    "checklist.ok": "OK",
    "checklist.pasOk": "Pas OK",
    "checklist.qteViscosite": "Quantité / viscosité",
    "checklist.colPiece": "Pièce à débiter / à commander",
    "checklist.colCommentaire": "Commentaire",
    "checklist.nomPiece": "Nom de la pièce…",
    "checklist.defautKO": "Commentaire sur le défaut (KO)…",
    "checklist.exReglage": "Ex. Réglage des phares…",
    "checklist.ajouterCommentaire": "+ Commentaire",
    "checklist.travauxPlaceholder": "Décrire les travaux supplémentaires…",
    "checklist.qte": "Qté",
    "checklist.pillChef": "chef",
    "checklist.pillAfaire": "à faire",
    "checklist.finTravauxValides": "Fin de travaux : {fin}/{total} validés",
    "checklist.koSans": "⚠ {n} KO sans commentaire",
    "checklist.verdictKo": "⛔ Contrôle terminé : défauts (KO) à traiter",
    "checklist.verdictChef": "⚠️ Contrôle terminé : points à voir avec le chef",
    "checklist.verdictOk": "✅ Contrôle terminé : rien à signaler",

    "pieces.aide": "Saisissez la quantité dans la 2e petite colonne : elle est imprimée sur la feuille. Une pièce écrite dans un commentaire de la checklist s'y place seule en quantité 1, modifiable ici.",
    "pieces.exporter": "Exporter le contrôle en PDF",
    "pieces.verso": "Verso de la feuille",
    "pieces.nom": "NOM :",
    "pieces.nOr": "N° OR :",
    "pieces.titreFeuille": "PIECES",
    "pieces.verrouBtn": "🔒 Modifier les noms et références de la feuille",
    "pieces.motDePasse": "Mot de passe",
    "pieces.debloquer": "Débloquer",
    "pieces.motDePasseErreur": "Mot de passe incorrect.",
    "pieces.modeModif": "🔓 Mode modification",
    "pieces.verrouiller": "Verrouiller",
    "pieces.hintModif": "Modifiez directement le nom et la référence dans les cases de la feuille (une case vide se remplit pour ajouter une pièce, une case vidée retire la pièce). Les changements sont enregistrés sur cet appareil.",
    "pieces.retablir": "Rétablir la feuille d'origine",
    "pieces.retablirConfirm": "Confirmer : effacer mes modifications ?",
    "pieces.enregImpossible": "Enregistrement impossible sur cet appareil : les changements seront perdus à la fermeture.",
    "pieces.retabliOk": "Feuille d'origine rétablie.",
    "pieces.testBatterie": "TEST BATTERIE",
    "pieces.cocherChoix": "(cocher choix) :",
    "pieces.changee": "Changée",
    "pieces.testOk": "Test OK",
    "pieces.nomPlaceholder": "Nom",
    "pieces.refPlaceholder": "Référence",

    "commande.reperees": "Repérées dans les commentaires",
    "commande.hint": "Pièces citées dans un commentaire de la checklist qui ne correspondent à aucune pièce du catalogue « à débiter ». Pour les corriger, modifiez le commentaire dans l'onglet Checklist.",
    "commande.ajoutees": "Ajoutées manuellement",
    "commande.ajouterPiece": "+ Ajouter une pièce",
    "commande.exporter": "Exporter le contrôle en PDF",
    "commande.videDetectee": "Aucun commentaire ne signale de pièce à commander pour le moment.",
    "commande.videManuelle": "Aucune pièce ajoutée manuellement pour le moment.",
    "commande.denomination": "Dénomination de la pièce",
    "commande.retirer": "Retirer cette pièce",

    "historique.titre": "Historique des rapports",
    "historique.hint": "Reprenez un contrôle déjà commencé, ou retrouvez-en un déjà exporté.",
    "historique.vide": "Aucun rapport enregistré pour le moment. Il apparaîtra ici dès que vous aurez choisi une fiche.",
    "historique.sansImmat": "Sans immatriculation",
    "historique.controleDu": "Contrôle du {date}",
    "historique.pdfExporte": "PDF exporté",
    "historique.enCours": "en cours",
    "historique.supprimerConfirm": "Touchez à nouveau pour confirmer la suppression.",
    "historique.supprimer": "Supprimer ce rapport",

    "pdf.toastErreurPdf": "Impossible de créer le PDF : {msg}",
    "pdf.toastEnregistres": "PDF enregistrés : {noms}",
    "pdf.toastEnregistre": "PDF enregistré : {nom}",
    "pdf.toastAnnule": "Enregistrement annulé.",
    "pdf.toastEnregImpossible": "Enregistrement impossible ({detail}).",
    "pdf.toastGeneres": "PDF générés : {noms}",
    "pdf.toastGenere": "PDF généré : {nom}"
  },
  bs: {
    "app.titre": "Kontrola vozila",
    "app.nouveau": "Novo",
    "app.nouveau.confirm": "Započeti novu kontrolu? Kontrola u toku ostaje sačuvana, moći ćete je nastaviti iz liste.",
    "install.texte": "Instalirajte aplikaciju na ovaj tablet da je koristite kao aplikaciju, čak i bez interneta.",
    "install.installer": "Instaliraj",
    "install.fermer": "Zatvori",

    "tabs.choix": "Vrsta kontrole",
    "tabs.vehicule": "Vozilo",
    "tabs.checklist": "Checklist",
    "tabs.pieces": "Dijelovi za zaduženje",
    "tabs.commande": "Dijelovi za naručiti",
    "tabs.historique": "Historija",

    "choix.titre": "Odaberite vrstu kontrole",
    "choix.hint": "Odaberite karticu za popunjavanje. Zatim ćete preći na informacije o vozilu, pa na checklistu.",
    "choix.points": "tačaka",
    "choix.rubriques": "rubrika",
    "choix.selectionne": "✓ Odabrano",
    "choix.continuer": "Nastavi → Vozilo",

    "commun.choisirDabord": "Prvo odaberite vrstu kontrole.",
    "commun.choisirControle": "Odaberi kontrolu",

    "vehicule.titreSuffixe": "— informacije o vozilu",
    "vehicule.champ.immat": "Registarska oznaka",
    "vehicule.champ.vin": "RN radionica",
    "vehicule.champ.orMagasin": "RN magacin",
    "vehicule.champ.date": "Datum kontrole",
    "vehicule.champ.controleur": "Kontrolor",
    "vehicule.champ.remarques": "Opće napomene",
    "vehicule.passer": "Prijeđi na checklistu →",

    "etat.ok": "OK", "etat.chef": "ŠEF", "etat.ko": "KO", "etat.afaire": "Za uraditi", "etat.fait": "Urađeno",
    "checklist.toutOk": "Sve na OK",
    "checklist.exporter": "Izvezi u PDF",
    "checklist.finTravaux": "Kraj radova:",
    "checklist.ok": "OK",
    "checklist.pasOk": "Nije OK",
    "checklist.qteViscosite": "Količina / viskozitet",
    "checklist.colPiece": "Dio za zaduženje / naručivanje",
    "checklist.colCommentaire": "Komentar",
    "checklist.nomPiece": "Naziv dijela…",
    "checklist.defautKO": "Komentar o kvaru (KO)…",
    "checklist.exReglage": "Npr. Podešavanje farova…",
    "checklist.ajouterCommentaire": "+ Komentar",
    "checklist.travauxPlaceholder": "Opišite dodatne radove…",
    "checklist.qte": "Kol.",
    "checklist.pillChef": "šef",
    "checklist.pillAfaire": "za uraditi",
    "checklist.finTravauxValides": "Kraj radova: {fin}/{total} potvrđeno",
    "checklist.koSans": "⚠ {n} KO bez komentara",
    "checklist.verdictKo": "⛔ Kontrola završena: kvarovi (KO) za rješavanje",
    "checklist.verdictChef": "⚠️ Kontrola završena: tačke za provjeru sa šefom",
    "checklist.verdictOk": "✅ Kontrola završena: nema primjedbi",

    "pieces.aide": "Unesite količinu u 2. malu kolonu: ona se štampa na listu. Dio upisan u komentaru checkliste se tu sam postavlja u količini 1, što možete izmijeniti ovdje.",
    "pieces.exporter": "Izvezi kontrolu u PDF",
    "pieces.verso": "Poleđina lista",
    "pieces.nom": "IME :",
    "pieces.nOr": "BR. RN :",
    "pieces.titreFeuille": "DIJELOVI",
    "pieces.verrouBtn": "🔒 Izmijeni nazive i reference na listu",
    "pieces.motDePasse": "Lozinka",
    "pieces.debloquer": "Otključaj",
    "pieces.motDePasseErreur": "Pogrešna lozinka.",
    "pieces.modeModif": "🔓 Način izmjene",
    "pieces.verrouiller": "Zaključaj",
    "pieces.hintModif": "Izmijenite direktno naziv i referencu u poljima lista (prazno polje se popunjava za dodavanje dijela, ispraznjeno polje uklanja dio). Izmjene se čuvaju na ovom uređaju.",
    "pieces.retablir": "Vrati originalni list",
    "pieces.retablirConfirm": "Potvrdi: obrisati moje izmjene?",
    "pieces.enregImpossible": "Snimanje nije moguće na ovom uređaju: izmjene će biti izgubljene pri zatvaranju.",
    "pieces.retabliOk": "Originalni list vraćen.",
    "pieces.testBatterie": "TEST BATERIJE",
    "pieces.cocherChoix": "(označite izbor) :",
    "pieces.changee": "Zamijenjena",
    "pieces.testOk": "Test OK",
    "pieces.nomPlaceholder": "Naziv",
    "pieces.refPlaceholder": "Referenca",

    "commande.reperees": "Prepoznati u komentarima",
    "commande.hint": "Dijelovi navedeni u komentaru checkliste koji ne odgovaraju nijednom dijelu iz kataloga „za zaduženje“. Za ispravku izmijenite komentar u kartici Checklist.",
    "commande.ajoutees": "Ručno dodano",
    "commande.ajouterPiece": "+ Dodaj dio",
    "commande.exporter": "Izvezi kontrolu u PDF",
    "commande.videDetectee": "Trenutno nijedan komentar ne ukazuje na dio za naručiti.",
    "commande.videManuelle": "Trenutno nema ručno dodanih dijelova.",
    "commande.denomination": "Naziv dijela",
    "commande.retirer": "Ukloni ovaj dio",

    "historique.titre": "Historija izvještaja",
    "historique.hint": "Nastavite već započetu kontrolu, ili pronađite već izvezenu.",
    "historique.vide": "Trenutno nema sačuvanih izvještaja. Pojaviće se ovdje čim odaberete karticu.",
    "historique.sansImmat": "Bez registarske oznake",
    "historique.controleDu": "Kontrola od {date}",
    "historique.pdfExporte": "PDF izvezen",
    "historique.enCours": "u toku",
    "historique.supprimerConfirm": "Dodirnite ponovo za potvrdu brisanja.",
    "historique.supprimer": "Obriši ovaj izvještaj",

    "pdf.toastErreurPdf": "Nije moguće kreirati PDF: {msg}",
    "pdf.toastEnregistres": "PDF sačuvani: {noms}",
    "pdf.toastEnregistre": "PDF sačuvan: {nom}",
    "pdf.toastAnnule": "Snimanje otkazano.",
    "pdf.toastEnregImpossible": "Snimanje nije moguće ({detail}).",
    "pdf.toastGeneres": "PDF generisani: {noms}",
    "pdf.toastGenere": "PDF generisan: {nom}"
  }
};

function t(cle, vars) {
  let s = (I18N[LANG] && I18N[LANG][cle]) ?? I18N.fr[cle] ?? cle;
  if (vars) Object.keys(vars).forEach(k => { s = s.replaceAll("{" + k + "}", vars[k]); });
  return s;
}

const DRAPEAUX_LANGUE = { fr: "🇫🇷", bs: "🇧🇦" };
function appliquerLangueStatique() {
  document.documentElement.lang = LANG;
  document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-aria]").forEach(el => { el.setAttribute("aria-label", t(el.dataset.i18nAria)); });
  const btn = document.getElementById("btn-langue");
  if (btn) {
    btn.textContent = DRAPEAUX_LANGUE[LANG];
    const autre = LANG === "fr" ? "Bosanski" : "Français";
    btn.setAttribute("aria-label", LANG === "fr" ? "Changer la langue" : "Promijeni jezik");
    btn.title = (LANG === "fr" ? "Langue : Français" : "Jezik: Bosanski") + " · " + autre;
  }
}
function definirLangue(l) {
  if (l !== "fr" && l !== "bs") return;
  LANG = l;
  appliquerLangueStatique();
  if (typeof ongletCourant !== "undefined" && typeof renderOnglet === "function") renderOnglet(ongletCourant);
}
document.getElementById("btn-langue")?.addEventListener("click", () => definirLangue(LANG === "fr" ? "bs" : "fr"));
appliquerLangueStatique();
