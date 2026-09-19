// Catalogue des pièces (repris de la feuille papier « PIECES »).
// Format : [nom, référence, groupe]. Une référence vide se remplit à la main sur la feuille papier.
// Ce sont les pièces d'origine : les ajouts / corrections faits dans l'application sont gardés à part sur l'appareil.
const CATALOGUE_BRUT = [
  // --- Général : feuille 1, colonne de gauche
  ["Bouch gasoil", "74 24 361 273"], ["Bouch ADblue", "74 82 335 595"], ["Tirant porte", "74 82 181 187"],
  ["Essuie-glace", "74 82 559 001"], ["Plaq de frein", "74 24 204 887"], ["Main rouge", "74 23 369 953"],
  ["Main jaune", "74 23 369 951"], ["Kit moteur", "74 24 557 749"], ["Filtre à air", "74 21 337 443"],
  ["Filtre BV", "74 22 051 238"], ["Feu gabarit", "74 82 392 733"], ["Flex échap", "74 23 656 441"],
  ["Collier", "74 22 907 383"], ["Collier", "74 23 122 882"], ["Joint échap", "74 21 758 870"],
  ["Joint échap", "74 21 758 872"], ["Colson", "015"], ["Colson", "018"],
  ["G ADBLUE", "74 24 487 147"], ["P ADBLUE", "74 24 487 144"], ["Dégripant", "BAR5342"],
  ["Nettoyant frein", "BAR5352"], ["Serrure DEF", "74 23 317 182"], ["Kit EVO", "74 24 286 812"],
  ["Air EVO", "74 23 743 840"], ["Enjoliveurs", "74 22 709 903"], ["C écrous Av", "74 24 424 790"],
  ["C écrous Ar", "74 20 563 993"], ["Goulotte inf", "74 23 091 816"], ["Tuyau d'air", "74 23 889 354"],
  ["Cordon 7 b", "74 24 277 244"], ["Cordon Y", "74 24 511 906"], ["Cordon 15 B", "74 24 511 912"],
  ["Passerelles", "74 22 570 310"], ["Plaque Sup E", "74 23 717 977"],
  // --- Général : feuille 1, colonne de droite
  ["Batterie 225AH", "74 24 150 283"], ["Batterie AGM", "74 24 112 365"], ["Bat GEL REG", "74 24 151 762"],
  ["Mise air libre", "74 21 743 197"], ["Pré filtre GO", "74 24 225 139"], ["Filtre gasoil", "74 23 889 561"],
  ["Assise", "7482699679"], ["Filtre direction", "5000 820 895"], ["Filtre de clim", "74 23 515 403"],
  ["Filtre dessicat", "74 24 623 237"], ["Filtre d'hab", "74 23 515 125"], ["Silencieux APM", "5010 612 351"],
  ["Extincteur 2kg", "7420839235"], ["Extincteur 6kg", "RESI800600"], ["Ampoule 21w", "50 03 097 059"],
  ["Navettes", "74 00 182 048"], ["Sans culot 5w", "74 00 982 560"], ["Avec culot 5w", "74 00 992 519"],
  ["H 7", "5001 865 601"], ["H 11", "74 00 992 099"], ["Joint VID", "74 20 579 690"],
  ["Joint pont", "74 00 949 329"], ["Capot droit", "74 21 094 449"], ["Capot coudé", "74 21 094 450"],
  ["Sup cheminée", "74 22 080 239"], ["Crick", "74 23 626 221"],
  ["Joint porte G", "74 24 402 134"], ["Cache pous G", "74 82 289 168"], ["Lèche vit G", "74 82 119 856"],
  ["Réfléchissant G", "74 84 817 996"], ["Insono G", "74 24 052 081"], ["Joint porte D", "74 24 402 141"],
  // --- Général : feuille 2 (haut)
  ["Plaque Lat E", "74 23 082 064"], ["Volant", "74 23 280 501"], ["Lot de bord", "74 23 060 761"],
  ["Kit triangles", "74 85 143 162"], ["Ailes AR", "74 21 094 394"], ["Calot d'aile", "74 21 094 390"],
  ["Support desy", "74 78 557 483"], ["Coussins d'air", "74 21 978 494"],
  ["Kit courroie", ""], ["Kit courroie", ""], ["Kit viscope", ""], ["Kit B 100", ""],
  ["Cache pous D", "74 82 289 186"], ["Lèche vit D", "74 82 122 194"], ["Réfléchissant D", "74 84 817 998"],
  ["Insono D", "74 24 052 097"], ["NCNP00022", "NCNP00022"], ["Écrou P", "74 20 920 408"],
  ["Ceinture chauf", "74 82 617 315"], ["Antenne", "74 23 037 107"], ["Capot G", "74 23 315 401"],
  ["Capot D", "74 23 315 436"], ["Kit PMT S", ""], ["Kit frigo", ""],
  // --- Ancien T
  ["Coque de clef", "74 23 775 835", "Ancien T"], ["Par choc av", "74 82 594 229", "Ancien T"],
  ["Coin G", "74 23 381 300", "Ancien T"], ["Coin D", "74 23 381 302", "Ancien T"],
  ["Marche pied G", "74 23 315 557", "Ancien T"], ["Marche pied D", "74 23 315 433", "Ancien T"],
  ["H pass", "74 23 677 873", "Ancien T"], ["H chauf AVEC", "74 23 677 877", "Ancien T"],
  ["H chauf SANS ap tête", "74 23 677 872", "Ancien T"], ["Tapis MOQ", "74 84 526 409", "Ancien T"],
  ["Tapis C", "74 21 514 904", "Ancien T"],
  // --- T EVO
  ["Coque de clef", "74 24 448 991", "T EVO"], ["Par choc av", "74 78 520 869", "T EVO"],
  ["Coin G", "74 84 901 130", "T EVO"], ["Cache G", "74 78 513 768", "T EVO"],
  ["Coin D", "74 84 901 145", "T EVO"], ["Cache D", "74 78 513 766", "T EVO"],
  ["Marche pied G", "74 23 591 438", "T EVO"], ["Enjoliveur G", "74 23 588 902", "T EVO"],
  ["Marche pied D", "74 23 591 439", "T EVO"], ["Enjoliveur D", "74 23 588 905", "T EVO"],
  ["Enjo de phare G", "74 84 905 278", "T EVO"], ["Enjo de phare D", "74 84 901 151", "T EVO"]
];
const GROUPES = ["Général", "Ancien T", "T EVO"];
const CATALOGUE_ORIGINE = CATALOGUE_BRUT.map((p, i) => ({ id: "c" + i, nom: p[0], ref: p[1], groupe: p[2] || "Général" }));

// --- Persistance : le catalogue modifié est gardé dans le navigateur de cet appareil ---
const CLE_CATALOGUE = "controle-vehicule-catalogue-v1";
function chargerCatalogue() {
  try {
    const a = JSON.parse(localStorage.getItem(CLE_CATALOGUE) || "null");
    if (Array.isArray(a) && a.every(p => p && typeof p.id === "string" && typeof p.nom === "string"))
      return a.map(p => ({ id: p.id, nom: p.nom, ref: String(p.ref || ""), groupe: GROUPES.includes(p.groupe) ? p.groupe : "Général" }));
  } catch (e) { /* stockage indisponible : on retombe sur le catalogue d'origine */ }
  return CATALOGUE_ORIGINE.map(p => ({ ...p }));
}
let CATALOGUE = chargerCatalogue();
function sauverCatalogue() {
  try { localStorage.setItem(CLE_CATALOGUE, JSON.stringify(CATALOGUE)); return true; }
  catch (e) { return false; }
}
function nouvelIdPiece() { return "u" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

// --- Verrou : empreinte SHA-256 du mot de passe (le mot de passe lui-même n'est pas écrit dans le code) ---
const MDP_EMPREINTE = "a399428c00f4348aa76c0c97c601385c2711e7c84926f1f732e1c34a3468ccef";
async function verifierMotDePasse(saisie) {
  if (!(window.crypto && crypto.subtle)) return false;
  const oct = new TextEncoder().encode("controle-vehicule|" + saisie);
  const h = await crypto.subtle.digest("SHA-256", oct);
  return [...new Uint8Array(h)].map(b => b.toString(16).padStart(2, "0")).join("") === MDP_EMPREINTE;
}

// Pièces à débiter = pièces cochées dans le catalogue
function piecesADebiter() { return CATALOGUE.filter(p => state.selection[p.id]); }
// Pièces connues (proposées en suggestion dans les commentaires)
function piecesConnues() { return CATALOGUE; }
