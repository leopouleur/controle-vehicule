// Feuille « PIECES » : reproduction de la feuille papier (recto + verso), ligne par ligne, telle qu'elle est imprimée.
// Une ligne = [hauteur, cellule gauche, cellule droite] ; hauteur en pixels du scan d'origine (1600 px de large = A4).
// Cellule = Cel(texte, référence, options) — le texte peut contenir **gras**. Options :
//   gras: "hbgd" (contour épais : haut / bas / gauche / droite), taille (pt, plus grand que d'habitude), rouge,
//   trait (longueur en mm d'un blanc à remplir à la main), groupe, alias (autres noms reconnus dans un commentaire).
// Ce sont les pièces d'origine : les corrections faites dans l'application sont gardées à part sur l'appareil.
function feuilleOrigine() {
  const Cel = (aff, ref = "", o = {}) => ({ nom: aff.replace(/\*\*/g, ""), ref, ...(aff.includes("**") ? { aff } : {}), ...o });
  const E = t => ({ nom: t, ref: "", etiquette: true });
  const A = { groupe: "Ancien T" }, T = { groupe: "T EVO" };
  const _ = null;
  const pages = [
    [ // ---- recto
      [48.5, Cel("Bouch gasoil", "74 24 361 273"), { speciale: "batterie" }],
      [48.5, Cel("Bouch ADblue", "74 82 335 595"), { absorbee: true }],
      [48.5, Cel("Tirant porte", "74 82 181 187"), Cel("Batterie 225AH", "74 24 150 283")],
      [48.5, Cel("Essuie-glace", "74 82 559 001"), Cel("Batterie AGM", "74 24 112 365")],
      [48.5, Cel("Plaq de frein", "74 24 204 887"), Cel("Bat GEL **REG**", "74 24 151 762", { rouge: true })],
      [48.5, Cel("Main rouge", "74 23 369 953"), Cel("Mise air libre", "74 21 743 197")],
      [48.5, Cel("Main jaune", "74 23 369 951"), Cel("PRE FILTRE GO", "74 24 225 139")],
      [48.5, Cel("Kit moteur", "74 24 557 749"), Cel("FILTRE GASOIL", "74 23 889 561")],
      [48.5, Cel("Filtre à air", "74 21 337 443"), Cel("**Assise**", "7482699679")],
      [48.5, Cel("Filtrer BV", "74 22 051 238", { alias: ["Filtre BV"] }), Cel("Filtre direction", "5000 820 895")],
      [48.5, Cel("FEU GABARIT", "74 82 392 733"), Cel("Filtre de clim", "74 23 515 403")],
      [48.5, Cel("Flex échap", "74 23 656 441"), Cel("Filtre dessicat", "74 24 623 237")],
      [48.5, Cel("Collier", "74 22 907 383"), Cel("FILTRE D'HAB", "74 23 515 125")],
      [48.5, Cel("Collier", "74 23 122 882"), Cel("SILENCIEUX APM", "5010 612 351")],
      [48.5, Cel("Joint échap", "74 21 758 870"), Cel("Extincteur 2kg", "7420839235")],
      [48.5, Cel("Joint échap", "74 21 758 872"), Cel("Extincteur 6kg", "RESI800600")],
      [48.5, Cel("Colson", "015"), Cel("Ampoule 21w", "50 03 097 059")],
      [48.5, Cel("Colson", "018"), Cel("Navettes", "74 00 182 048")],
      [48.5, Cel("G ADBLUE", "74 24 487 147"), Cel("Sans culot 5w", "74 00 982 560")],
      [48.5, Cel("P ADBLUE", "74 24 487 144"), Cel("Avec culot 5w", "74 00 992 519")],
      [54.3, Cel("DEGRIPANT", "BAR5342"), Cel("H 7", "5001 865 601", { taille: 13 })],
      [54.3, Cel("NETOYANT FREIN", "BAR5352", { alias: ["Nettoyant frein"] }), Cel("H 11", "74 00 992 099", { taille: 13 })],
      [54.3, Cel("SERRURE DEF", "74 23 317 182"), Cel("JOINT VID", "74 20 579 690", { taille: 13 })],
      [54.3, Cel("KIT EVO", "74 24 286 812"), Cel("JOINT PONT", "74 00 949 329", { taille: 13 })],
      [54.3, Cel("AIR EVO", "74 23 743 840"), _],
      [54.3, _, _],
      [54.3, _, _],
      [54.3, _, _],
      [49, Cel("Enjoliveurs", "74 22 709 903"), Cel("Capot **DROIT**", "74 21 094 449")],
      [49, Cel("C écrous **Av**", "74 24 424 790"), Cel("Capot **COUDÉ**", "74 21 094 450")],
      [49, Cel("C écrous **Ar**", "74 20 563 993"), Cel("SUP CHEMINE", "74 22 080 239", { alias: ["Sup cheminée"] })],
      [49, Cel("goulotte inf", "74 23 091 816"), Cel("CRICK", "74 23 626 221")],
      [49, Cel("Tuyau d'air", "74 23 889 354"), Cel("Joint porte **G**", "74 24 402 134", { gras: "hgd" })],
      [49, Cel("Cordon **7** b", "74 24 277 244"), Cel("Cache pous **G**", "74 82 289 168", { gras: "gd" })],
      [49, Cel("Cordon **Y**", "74 24 511 906"), Cel("Leche vit **G**", "74 82 119 856", { gras: "gd" })],
      [49, Cel("Cordon **15** B", "74 24 511 912"), Cel("Reflechissant **G**", "74 84 817 996", { gras: "gdb" })],
      [49, Cel("Passerelles", "74 22 570 310"), Cel("insono G", "74 24 052 081", { gras: "hgdb" })],
      [49, Cel("Plaque **Sup** E", "74 23 717 977"), Cel("Joint porte **D**", "74 24 402 141", { gras: "hgdb" })]
    ],
    [ // ---- verso
      [48, Cel("Plaque **Lat** E", "74 23 082 064"), Cel("Cache pous **D**", "74 82 289 186", { gras: "hgd" })],
      [49, Cel("Volant", "74 23 280 501"), Cel("Leche vit **D**", "74 82 122 194", { gras: "gd" })],
      [50, Cel("Lot de Bord", "74 23 060 761"), Cel("Reflechissant **D**", "74 84 817 998", { gras: "gdb" })],
      [48, Cel("Kit triangles", "74 85 143 162"), Cel("insono D", "74 24 052 097", { gras: "hgd" })],
      [49, Cel("Ailes **AR AR**", "74 21 094 394", { alias: ["Ailes AR"] }), Cel("**NCNP00022**", "", { gras: "gd" })],
      [50, Cel("Calot d’aile", "74 21 094 390"), Cel("ECROU P", "74 20 920 408", { gras: "gdb" })],
      [50, Cel("Support desy", "74 78 557 483"), Cel("ceinture chauf", "74 82 617 315", { gras: "hgdb" })],
      [48.5, Cel("Coussins d’air", "74 21 978 494"), Cel("ANTENNE", "74 23 037 107")],
      [48.5, Cel("Kit courroie", "", { trait: 31 }), Cel("Capot **G**", "74 23 315 401")],
      [48, Cel("Kit courroie", "", { trait: 31 }), Cel("Capot D", "74 23 315 436")],
      [49, Cel("**KIT VISCOPE**"), Cel("**KIT PMT S**", "", { trait: 12 })],
      [54, Cel("**KIT B 100**"), Cel("**KIT FRIGO**", "", { taille: 13 })],
      [48.5, _, _],
      [48.5, _, _],
      [48.5, _, _],
      [48.5, _, _],
      [49, E("ancien T"), E("T EVO")],
      [48.5, Cel("coque de clef", "74 23 775 835", A), Cel("coque de clef", "74 24 448 991", T)],
      [48.5, Cel("par choc av", "74 82 594 229", A), Cel("par choc av", "74 78 520 869", T)],
      [49, Cel("coin G", "74 23 381 300", A), Cel("coin G", "74 84 901 130", T)],
      [48.5, _, Cel("cache G", "74 78 513 768", T)],
      [48.5, Cel("coin D", "74 23 381 302", A), Cel("coin D", "74 84 901 145", T)],
      [49, _, Cel("cache D", "74 78 513 766", T)],
      [49, Cel("marche pied G", "74 23 315 557", A), Cel("marche pied G", "74 23 591 438", T)],
      [49, Cel("marche pied D", "74 23 315 433", A), Cel("enjoliveur G", "74 23 588 902", T)],
      [49, _, Cel("marche pied D", "74 23 591 439", T)],
      [55, Cel("H pass", "74 23 677 873", A), Cel("enjoliveur D", "74 23 588 905", { ...T, taille: 13 })],
      [54, Cel("H chauf AVEC", "74 23 677 877", A), Cel("enjo de phare G", "74 84 905 278", { ...T, taille: 13 })],
      [54, Cel("SANS ap tête", "74 23 677 872", A), Cel("enjo de phare D", "74 84 901 151", { ...T, taille: 13 })],
      [55, Cel("tapis MOQ", "74 84 526 409", A), _],
      [54, Cel("tapis C", "74 21 514 904", A), _],
      [49, _, _],
      [49, _, _],
      [49, _, _],
      [49, _, _]
    ]
  ];
  return pages.map((page, pi) => page.map(([h, g, d], ri) => {
    const cel = (c, cote) => Object.assign({ nom: "", ref: "" }, c, { id: `p${pi + 1}l${ri + 1}${cote}` });
    return { h, g: cel(g, "g"), d: cel(d, "d") };
  }));
}

// --- Persistance : les corrections (nom / référence d'une case) sont gardées dans le navigateur de cet appareil ---
const CLE_FEUILLE = "controle-vehicule-feuille-v1";
function toutesCellules() {
  return FEUILLE.flatMap(page => page.flatMap(l => [l.g, l.d])).filter(c => !c.absorbee);
}
function cellulesEditables() { return toutesCellules().filter(c => !c.etiquette && !c.speciale); }
function chargerFeuille() {
  const f = feuilleOrigine();
  try {
    const o = JSON.parse(localStorage.getItem(CLE_FEUILLE) || "{}") || {};
    f.flatMap(page => page.flatMap(l => [l.g, l.d])).forEach(c => {
      if (o[c.id] && !c.etiquette && !c.speciale && !c.absorbee) {
        const avant = c.nom;
        c.nom = String(o[c.id].nom || ""); c.ref = String(o[c.id].ref || ""); c.modifie = true;
        if (c.nom !== avant) { delete c.aff; delete c.alias; }   // nom changé : plus de mise en forme ni d'alias d'origine
      }
    });
  } catch (e) { /* stockage indisponible : on retombe sur la feuille d'origine */ }
  return f;
}
let FEUILLE = chargerFeuille();
function sauverFeuille() {
  const o = {};
  cellulesEditables().forEach(c => { if (c.modifie) o[c.id] = { nom: c.nom, ref: c.ref }; });
  try { localStorage.setItem(CLE_FEUILLE, JSON.stringify(o)); return true; }
  catch (e) { return false; }
}

// Pièces = cases de la feuille qui ont un nom
let CATALOGUE = [];
function reconstruireCatalogue() { CATALOGUE = cellulesEditables().filter(c => c.nom.trim()); }
reconstruireCatalogue();
function nomsPiece(p) { return [p.nom, ...(p.alias || [])]; }
function retablirFeuille() { FEUILLE = feuilleOrigine(); sauverFeuille(); reconstruireCatalogue(); }

// Texte d'une case sous forme de segments [{ t, gras, rouge }] (nom avec **gras**, puis référence en gras)
function segmentsCellule(c) {
  const segs = [];
  (c.aff || c.nom).split("**").forEach((t, i) => { if (t) segs.push({ t, gras: i % 2 === 1, rouge: !!c.rouge }); });
  if (c.ref) { if (segs.length) segs.push({ t: " ", gras: false }); segs.push({ t: c.ref, gras: true }); }
  return segs;
}

// Sélectionne une pièce à débiter : quantité 1 par défaut, modifiable ensuite dans l'onglet « Pièces à débiter »
function selectionnerPiece(id) {
  if (state.selection[id]) return false;
  state.selection[id] = true;
  if (!state.qtePieces[id]) state.qtePieces[id] = "1";
  return true;
}

// --- Verrou : empreinte SHA-256 du mot de passe (le mot de passe lui-même n'est pas écrit dans le code) ---
const MDP_EMPREINTE = "a399428c00f4348aa76c0c97c601385c2711e7c84926f1f732e1c34a3468ccef";
async function verifierMotDePasse(saisie) {
  if (!(window.crypto && crypto.subtle)) return false;
  const oct = new TextEncoder().encode("controle-vehicule|" + saisie);
  const h = await crypto.subtle.digest("SHA-256", oct);
  return [...new Uint8Array(h)].map(b => b.toString(16).padStart(2, "0")).join("") === MDP_EMPREINTE;
}

// Pièces à débiter = pièces avec une quantité (choisies dans un commentaire, ou saisies sur la feuille)
function piecesADebiter() { return CATALOGUE.filter(p => state.selection[p.id]); }
// Pièces connues (reconnues / proposées en suggestion dans les commentaires)
function piecesConnues() { return CATALOGUE; }
