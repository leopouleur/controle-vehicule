// Export PDF : générateur minimal (Helvetica standard), sans bibliothèque externe.
// Deux fichiers distincts : la fiche de contrôle remplie, et (si des pièces sont cochées) la liste de pièces.

const MM = 72 / 25.4;
const PAGE_W = 210, PAGE_H = 297, MARGE = 10, BAS = 287;
const COUL = {
  texte: [29, 39, 51], gris: [107, 119, 133], trait: [190, 197, 206],
  ok: [30, 158, 88], warn: [224, 144, 11], ko: [211, 58, 58],
  accent: [223, 4, 2], fondSection: [228, 234, 244], fondTete: [223, 4, 2]
};

// --- Encodage WinAnsi ---------------------------------------------------
const WIN_SPECIAL = { "€": 128, "‚": 130, "ƒ": 131, "„": 132, "…": 133, "†": 134, "‡": 135, "ˆ": 136,
  "‰": 137, "Š": 138, "‹": 139, "Œ": 140, "Ž": 142, "‘": 145, "’": 146, "“": 147, "”": 148, "•": 149,
  "–": 150, "—": 151, "˜": 152, "™": 153, "š": 154, "›": 155, "œ": 156, "ž": 158, "Ÿ": 159 };
// Texte -> chaîne où 1 caractère = 1 octet WinAnsi
function winansi(s) {
  let out = "";
  for (const ch of String(s ?? "").normalize("NFC").replace(/≥/g, ">=").replace(/≤/g, "<=")) {
    const c = ch.codePointAt(0);
    if (ch === "\n") out += "\n";
    else if (c === 0xA0) out += " ";
    else if (c >= 32 && c < 127) out += ch;
    else if (c >= 160 && c <= 255) out += ch;
    else if (WIN_SPECIAL[ch]) out += String.fromCharCode(WIN_SPECIAL[ch]);
    else out += (c < 32 ? "" : "?");
  }
  return out;
}
function largeur(bytes, size, gras) {  // en mm
  const T = gras ? PDF_WB : PDF_W;
  let w = 0;
  for (let i = 0; i < bytes.length; i++) {
    const c = bytes.charCodeAt(i);
    w += c >= 32 ? T[c - 32] : 0;
  }
  return w * size / 1000 / MM;
}
// Retour à la ligne (mm)
function decouper(txt, maxW, size, gras) {
  const lignes = [];
  for (const para of winansi(txt).split("\n")) {
    let cur = "";
    for (let mot of para.split(/ +/)) {
      if (mot === "") continue;
      while (largeur(mot, size, gras) > maxW) {   // mot trop long : on le coupe
        let n = mot.length;
        while (n > 1 && largeur(mot.slice(0, n), size, gras) > maxW) n--;
        if (cur) { lignes.push(cur); cur = ""; }
        lignes.push(mot.slice(0, n)); mot = mot.slice(n);
      }
      const essai = cur ? cur + " " + mot : mot;
      if (largeur(essai, size, gras) <= maxW) cur = essai;
      else { lignes.push(cur); cur = mot; }
    }
    lignes.push(cur);
  }
  return lignes;
}

// --- Document PDF -----------------------------------------------------------
class PdfDoc {
  constructor() { this.pages = []; this.cur = null; }
  addPage() { this.cur = []; this.pages.push(this.cur); return this.pages.length - 1; }
  _c(rgb, stroke) { return rgb.map(v => (v / 255).toFixed(3)).join(" ") + (stroke ? " RG" : " rg"); }
  text(x, yBase, bytes, size, gras, rgb, alignDroite) {
    if (!bytes) return;
    const w = alignDroite ? largeur(bytes, size, gras) : 0;
    const esc = bytes.replace(/[\\()]/g, m => "\\" + m).replace(/[^\x20-\x7e]/g, m =>
      "\\" + m.charCodeAt(0).toString(8).padStart(3, "0"));
    this.cur.push(`${this._c(rgb || COUL.texte)} BT /F${gras ? 2 : 1} ${size} Tf ${((x - w) * MM).toFixed(2)} ${((PAGE_H - yBase) * MM).toFixed(2)} Td (${esc}) Tj ET`);
  }
  rect(x, y, w, h, fill, stroke, lw) {
    const p = `${(x * MM).toFixed(2)} ${((PAGE_H - y - h) * MM).toFixed(2)} ${(w * MM).toFixed(2)} ${(h * MM).toFixed(2)} re`;
    if (fill) this.cur.push(`${this._c(fill)} ${p} f`);
    if (stroke) this.cur.push(`${this._c(stroke, true)} ${((lw || 0.2) * MM).toFixed(2)} w ${p} S`);
  }
  build() {
    let out = "%PDF-1.4\n";
    const offs = [];
    const add = corps => { offs.push(out.length); out += `${offs.length} 0 obj\n${corps}\nendobj\n`; };
    const n = this.pages.length;
    add("<< /Type /Catalog /Pages 2 0 R >>");
    add(`<< /Type /Pages /Kids [${this.pages.map((_, i) => `${5 + 2 * i} 0 R`).join(" ")}] /Count ${n} >>`);
    add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");
    add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");
    this.pages.forEach((ops, i) => {
      add(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${(PAGE_W * MM).toFixed(2)} ${(PAGE_H * MM).toFixed(2)}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${6 + 2 * i} 0 R >>`);
      const flux = ops.join("\n");
      add(`<< /Length ${flux.length} >>\nstream\n${flux}\nendstream`);
    });
    const xref = out.length;
    out += `xref\n0 ${offs.length + 1}\n0000000000 65535 f \n` +
      offs.map(o => String(o).padStart(10, "0") + " 00000 n \n").join("") +
      `trailer\n<< /Size ${offs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
    const u8 = new Uint8Array(out.length);
    for (let i = 0; i < out.length; i++) u8[i] = out.charCodeAt(i) & 255;
    return new Blob([u8], { type: "application/pdf" });
  }
}

// --- Tableau avec sauts de page ------------------------------------------------
const TAILLE = 8, INTERLIGNE = 3.3, PAD = 0.7;
function tableau(doc, st, cols, entetes, lignes, piedHook) {
  const dessineEntete = () => {
    const h = 5.5; let x = MARGE;
    cols.forEach((w, i) => {
      doc.rect(x, st.y, w, h, COUL.fondTete);
      doc.text(x + 1.5, st.y + 3.8, winansi(entetes[i]), 7.5, true, [255, 255, 255]);
      x += w;
    });
    st.y += h;
  };
  const nouvellePage = () => { doc.addPage(); st.y = 12; dessineEntete(); };
  const mesure = l => {
    if (l.section) return { h: 5, lignes: null };
    if (l.full) {
      const L = decouper(l.cells[0].t || "", cols.reduce((a, b) => a + b, 0) - 3, TAILLE, false);
      return { h: Math.max(4.7, L.length * INTERLIGNE + 2 * PAD), cellules: [L] };
    }
    const cellules = l.cells.map((c, i) => decouper(c.t || "", cols[i] - 3, TAILLE, c.gras));
    const n = Math.max(1, ...cellules.map(c => c.length));
    return { h: Math.max(4.7, n * INTERLIGNE + 2 * PAD), cellules };
  };
  dessineEntete();
  lignes.forEach((l, idx) => {
    const m = mesure(l);
    let besoin = m.h;
    if (l.section) besoin += 5.5;                       // un titre ne reste pas seul en bas de page
    if (st.y + besoin > BAS) nouvellePage();
    if (l.section) {
      doc.rect(MARGE, st.y, PAGE_W - 2 * MARGE, m.h, COUL.fondSection, COUL.trait);
      doc.text(MARGE + 1.5, st.y + 3.8, winansi(l.section), 8.5, true, COUL.accent);
      st.y += m.h;
      return;
    }
    if (l.full) {
      doc.rect(MARGE, st.y, cols.reduce((a, b) => a + b, 0), m.h, null, COUL.trait);
      m.cellules[0].forEach((ligne, k) => doc.text(MARGE + 1.5, st.y + PAD + k * INTERLIGNE + 2.4, ligne, TAILLE, false));
      st.y += m.h;
      return;
    }
    let x = MARGE;
    l.cells.forEach((c, i) => {
      doc.rect(x, st.y, cols[i], m.h, null, COUL.trait);
      m.cellules[i].forEach((ligne, k) =>
        doc.text(x + 1.5, st.y + PAD + k * INTERLIGNE + 2.4, ligne, TAILLE, c.gras, c.couleur));
      x += cols[i];
    });
    st.y += m.h;
  });
}

// --- Contenu ------------------------------------------------------------------
const LIBELLE = { ok: "OK", chef: "CHEF", ko: "KO", afaire: "À FAIRE", fait: "FAIT" };
const COULEUR_ETAT = { ok: COUL.ok, fait: COUL.ok, chef: COUL.warn, afaire: COUL.warn, ko: COUL.ko };

function dateFR(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
  return m ? `${m[3]}/${m[2]}/${m[1]}` : (iso || "");
}

function construireChecklistPdf() {
  const f = curFiche(), d = fdata(), v = state.vehicule;
  const doc = new PdfDoc();
  doc.addPage();
  let y = 12;

  // En-tête
  doc.text(MARGE, y + 5, winansi(f.nom), 16, true, COUL.accent);
  doc.text(PAGE_W - MARGE, y + 5, winansi("CONTRÔLE DU VÉHICULE"), 9, true, COUL.gris, true);
  y += 9;
  doc.rect(MARGE, y, PAGE_W - 2 * MARGE, 0.5, COUL.accent);
  y += 3;

  // Bloc véhicule
  const champs = [
    ["Immatriculation", v.immat], ["OR atelier", v.vin], ["OR magasin", v.orMagasin],
    ["Kilométrage", v.km ? v.km + " km" : ""], ["Date du contrôle", dateFR(v.date)], ["Contrôleur", v.controleur]
  ];
  const colW = (PAGE_W - 2 * MARGE) / 4;
  champs.forEach(([lib, val], i) => {
    const x = MARGE + (i % 4) * colW, yy = y + Math.floor(i / 4) * 10.5;
    doc.text(x, yy + 2.5, winansi(lib), 6.5, false, COUL.gris);
    const t = decouper(val || "—", colW - 3, 9.5, true)[0] || "";
    doc.text(x, yy + 7, t, 9.5, true, COUL.texte);
  });
  y += 19.5;
  if ((v.remarques || "").trim()) {
    doc.text(MARGE, y + 2.5, winansi("Remarques générales"), 6.5, false, COUL.gris);
    const lignes = decouper(v.remarques, PAGE_W - 2 * MARGE, 8.5, false).slice(0, 4);
    lignes.forEach((l, k) => doc.text(MARGE, y + 6.5 + k * 3.8, l, 8.5, false, COUL.texte));
    y += 6.5 + lignes.length * 3.8 + 1;
  }

  // Bilan
  const s = stats();
  const bilan = `Bilan : ${s.ok} OK · ${s.chef} chef · ${s.ko} KO · ${s.afaire} à faire     Avancement : ${s.done}/${s.total}`;
  doc.text(MARGE, y + 3.5, winansi(bilan), 8.5, true, COUL.texte);
  y += 7;

  // Tableau de la checklist
  const cols = f.finTravaux ? [72, 18, 18, 82] : [78, 18, 94];
  const ent = f.finTravaux ? ["Point de contrôle", "État", "Fin travaux", "Commentaires"] : ["Point de contrôle", "État", "Commentaires"];
  const lignes = [];
  f.sections.forEach((sec, si) => {
    lignes.push({ section: sec.titre });
    if (sec.type === "travaux") {
      const texte = [(d.travaux || "").trim(), (d.travauxCommentaire || "").trim()].filter(Boolean).join(" — ");
      lignes.push({ cells: [{ t: texte || " \n \n " }], full: true });
      return;
    }
    sec.items.forEach((nom, i) => {
      const e = d.items[si + ":" + i] || {};
      const com = [sec.type === "pms" && e.qty ? "Qté / viscosité : " + e.qty : "", (e.note || "").trim(), (e.commentaire || "").trim()].filter(Boolean).join(" — ");
      let etat = "", couleurEtat;
      if (sec.type === "pms") {                 // « À faire » et « OK » peuvent être cochés en même temps
        etat = [e.afaire && LIBELLE.afaire, e.ok && LIBELLE.ok].filter(Boolean).join(" + ");
        couleurEtat = e.afaire ? COULEUR_ETAT.afaire : COULEUR_ETAT.ok;
      } else if (e.v) {
        etat = LIBELLE[e.v];
        couleurEtat = COULEUR_ETAT[e.v];
      }
      const cells = [
        { t: nom },
        { t: etat, gras: true, couleur: couleurEtat }
      ];
      if (f.finTravaux) cells.push({ t: e.fin === "ok" ? "OK" : e.fin === "nok" ? "PAS OK" : "", gras: true,
        couleur: e.fin === "ok" ? COUL.ok : COUL.ko });
      cells.push({ t: com });
      lignes.push({ cells });
    });
  });
  const st = { y };
  tableau(doc, st, cols, ent, lignes);

  // Notes de bas de page (regroupées pour tenir sur la même feuille)
  if (f.notes.length) {
    const lg = decouper(f.notes.join("     |     "), PAGE_W - 2 * MARGE, 7, false);
    if (st.y + 2 + lg.length * 3.2 > BAS + 3) { doc.addPage(); st.y = 12; }
    lg.forEach((l, k) => doc.text(MARGE, st.y + 4 + k * 3.2, l, 7, false, COUL.gris));
  }

  // Pieds de page
  const n = doc.pages.length;
  const pied = [f.nom, v.immat].filter(Boolean).join(" · ");
  for (let i = 0; i < n; i++) {
    doc.cur = doc.pages[i];
    doc.text(MARGE, 291, winansi(pied), 7, false, COUL.gris);
    doc.text(PAGE_W - MARGE, 291, winansi(`Page ${i + 1}/${n}`), 7, false, COUL.gris, true);
  }
  return doc.build();
}

// --- PDF « Pièces à débiter » : la feuille papier « PIECES » en entier (recto + verso), quantités remplies ---
// Uniquement s'il y a au moins une pièce à débiter (ou un test batterie coché).
function construirePiecesPdf() {
  const f = curFiche(), v = state.vehicule, tb = state.testBatterie;
  if (!piecesADebiter().length && !tb.changee && !tb.ok) return null;

  // Géométrie relevée sur la feuille scannée : 1 px du scan = PX mm ; colonnes = 2 petites cases, grande case, 2 petites cases, grande case
  const PX = 0.1306, X0 = 11.05, NOIR = [40, 52, 66], TEINTE = [238, 243, 248], ROUGE = [179, 50, 58], FIN = 0.2, EPAIS = 0.6;
  const XS = [X0];
  [70, 75.5, 513, 71, 80, 629.5].forEach(w => XS.push(XS[XS.length - 1] + w * PX));
  const doc = new PdfDoc();
  const hLigne = (x1, x2, y, ep, rgb) => doc.rect(x1, y - ep / 2, x2 - x1, ep, rgb || NOIR);
  const vLigne = (x, y1, y2, ep, rgb) => doc.rect(x - ep / 2, y1, ep, y2 - y1, rgb || NOIR);
  const bandeau = y => doc.rect(XS[0], y, XS[6] - XS[0], 0.9, COUL.accent);   // liseré rouge en haut de chaque page
  const base = (haut, h, taille) => haut + h / 2 + taille * 0.127;   // ligne de base d'un texte centré verticalement

  // Écrit des segments { t, gras, rouge, couleur } centrés dans [xa, xb] (taille réduite si ça dépasse) ; `apres` = blanc laissé après le texte
  const ecrireCentre = (segs, xa, xb, yb, taille, apres = 0) => {
    const mesure = s => segs.reduce((w, sg) => w + largeur(winansi(sg.t), s, sg.gras), 0) + apres;
    const dispo = xb - xa - 2.5;
    const s = mesure(taille) > dispo ? taille * dispo / mesure(taille) : taille;
    let x = (xa + xb) / 2 - mesure(s) / 2;
    segs.forEach(sg => {
      doc.text(x, yb, winansi(sg.t), s, sg.gras, sg.couleur || (sg.rouge ? ROUGE : COUL.texte));
      x += largeur(winansi(sg.t), s, sg.gras);
    });
    return x;
  };

  const dessinerGrille = (page, y0) => {
    const tops = [y0];
    page.forEach(l => tops.push(tops[tops.length - 1] + l.h * PX));
    const n = page.length, bas = tops[n];
    page.forEach((l, i) => [1, 4].forEach(k => doc.rect(XS[k], tops[i], XS[k + 1] - XS[k], tops[i + 1] - tops[i], TEINTE)));   // colonnes quantité teintées
    for (let i = 0; i <= n; i++) {                       // traits fins (la grande case fusionnée du test batterie n'est pas coupée)
      hLigne(XS[0], XS[5], tops[i], FIN);
      if (i === 0 || i === n || !page[i].d.absorbee) hLigne(XS[5], XS[6], tops[i], FIN);
    }
    XS.forEach(x => vLigne(x, y0, bas, FIN));
    page.forEach((l, i) => [[l.g, 2], [l.d, 5]].forEach(([c, k]) => {   // contours en gras
      const g = c.gras || "";
      if (g.includes("h")) hLigne(XS[k], XS[k + 1], tops[i], EPAIS, COUL.accent);
      if (g.includes("b")) hLigne(XS[k], XS[k + 1], tops[i + 1], EPAIS, COUL.accent);
      if (g.includes("g")) vLigne(XS[k], tops[i], tops[i + 1], EPAIS, COUL.accent);
      if (g.includes("d")) vLigne(XS[k + 1], tops[i], tops[i + 1], EPAIS, COUL.accent);
    }));
    page.forEach((l, i) => {
      const h = tops[i + 1] - tops[i];
      [[l.g, 0], [l.d, 3]].forEach(([c, k]) => {         // k = 1re petite case du côté ; la grande case est k + 2
        if (c.absorbee) return;
        const xa = XS[k + 2], xb = XS[k + 3];
        if (c.speciale === "batterie") {
          const hh = tops[i + 2] - tops[i];
          ecrireCentre([{ t: "TEST BATTERIE", gras: true }, { t: " (cocher choix) :", gras: false }], xa, xb, tops[i] + hh * 0.36, 10);
          const w = xb - xa;
          doc.text(xa + w * 0.17, tops[i] + hh * 0.74, winansi(`[${tb.changee ? "X" : " "}] Changée`), 10, false, COUL.texte);
          doc.text(xa + w * 0.58, tops[i] + hh * 0.74, winansi(`[${tb.ok ? "X" : " "}] Test OK`), 10, false, COUL.texte);
          return;
        }
        if (!c.nom.trim()) return;
        if (c.etiquette) { ecrireCentre([{ t: c.nom, gras: false }], xa, xb, base(tops[i], h, 11), 11); return; }
        const taille = c.taille || 11, yb = base(tops[i], h, taille);
        const fin = ecrireCentre(segmentsCellule(c), xa, xb, yb, taille, c.trait ? c.trait * 0.995 : 0);
        if (c.trait) hLigne(fin + 1, fin + c.trait * 0.995, yb + 0.6, FIN);   // blanc à remplir à la main
        if (state.selection[c.id])                                              // pièce à débiter : quantité (la 1re case reste vide)
          ecrireCentre([{ t: state.qtePieces[c.id] || "1", gras: true, couleur: COUL.accent }], XS[k + 1], XS[k + 2], base(tops[i], h, 12), 12);
      });
    });
    return bas;
  };

  // Recto : en-tête (NOM = contrôleur, N° OR = OR magasin) puis la grille
  doc.addPage();
  const hy = 8.5, hNom = 160 * PX, hTitre = 85 * PX;
  hLigne(XS[0], XS[6], hy, FIN);
  hLigne(XS[0], XS[5], hy + hNom, FIN);
  [XS[0], XS[5], XS[6]].forEach(x => vLigne(x, hy, hy + hNom + hTitre, FIN));
  bandeau(hy - 2.4);
  doc.text(XS[0] + 2.5, hy + 4.6, winansi("N O M"), 7.5, true, COUL.accent);
  doc.text(XS[0] + 2.5, hy + 11.5, winansi(v.controleur || ""), 15, true, COUL.texte);
  const sous = [v.immat && "Véhicule : " + v.immat, v.date && "Date : " + dateFR(v.date)].filter(Boolean).join("     ");
  if (sous) doc.text(XS[0] + 2.5, hy + 17.2, winansi(sous), 8.5, false, COUL.gris);
  doc.text(XS[5] + 2.5, hy + 4.6, winansi("N °   O R"), 7.5, true, COUL.accent);
  doc.text(XS[5] + 2.5, hy + 15, winansi(v.orMagasin || ""), 24, true, COUL.texte);
  ecrireCentre([{ t: "P I E C E S", gras: true, couleur: COUL.accent }], XS[0], XS[5], base(hy + hNom, hTitre, 22), 22);
  dessinerGrille(FEUILLE[0], hy + hNom + hTitre);

  // Verso : la suite de la feuille
  doc.addPage();
  bandeau(10 - 2.4);
  dessinerGrille(FEUILLE[1], 10);

  const n = doc.pages.length;
  const pied = ["Pièces à débiter", f.nom, v.immat].filter(Boolean).join(" · ");
  for (let i = 0; i < n; i++) {
    doc.cur = doc.pages[i];
    doc.text(MARGE, 293.5, winansi(pied), 7, false, COUL.gris);
    doc.text(PAGE_W - MARGE, 293.5, winansi(`Page ${i + 1}/${n}`), 7, false, COUL.gris, true);
  }
  return doc.build();
}

// --- PDF « Pièces à commander » : commentaires non vides qui ne citent aucune pièce déjà « à débiter »,
// plus les pièces ajoutées à la main dans l'onglet « Pièces à commander » ---
function construireCommandePdf() {
  const f = curFiche(), d = fdata(), v = state.vehicule;
  const lignes = [];
  f.sections.forEach((sec, si) => {
    if (sec.type === "travaux") {
      if (estACommander("travaux", d.travaux)) lignes.push({ qte: state.qteCommande.travaux || "1", texte: (d.travaux || "").trim() });
      return;
    }
    sec.items.forEach((_, i) => {
      const e = d.items[si + ":" + i] || {};
      if (estACommander(si + ":" + i, e.note)) lignes.push({ qte: state.qteCommande[si + ":" + i] || "1", texte: (e.note || "").trim() });
    });
  });
  state.commandeManuelle.forEach(m => {
    const texte = (m.texte || "").trim();
    if (texte) lignes.push({ qte: m.qte || "1", texte });
  });
  if (!lignes.length) return null;

  const doc = new PdfDoc();
  doc.addPage();
  let py = 12;
  doc.text(MARGE, py + 5, winansi("PIÈCES À COMMANDER"), 16, true, COUL.accent);
  doc.text(PAGE_W - MARGE, py + 5, winansi(f.nom), 9, true, COUL.gris, true);
  py += 9;
  doc.rect(MARGE, py, PAGE_W - 2 * MARGE, 0.5, COUL.accent);
  py += 5;
  const resume = [v.immat && "Véhicule : " + v.immat, v.date && "Date : " + dateFR(v.date),
    v.controleur && "Contrôleur : " + v.controleur, v.orMagasin && "N° OR : " + v.orMagasin]
    .filter(Boolean).join("     ");
  if (resume) { doc.text(MARGE, py + 2, winansi(resume), 9, false, COUL.texte); py += 7; }

  const st = { y: py };
  tableau(doc, st, [26, 164], ["Quantité", "Dénomination"],
    lignes.map(l => ({ cells: [
      { t: l.qte, gras: true, couleur: COUL.accent },
      { t: l.texte }
    ] })));

  const n = doc.pages.length;
  const pied = ["Pièces à commander", f.nom, v.immat].filter(Boolean).join(" · ");
  for (let i = 0; i < n; i++) {
    doc.cur = doc.pages[i];
    doc.text(MARGE, 291, winansi(pied), 7, false, COUL.gris);
    doc.text(PAGE_W - MARGE, 291, winansi(`Page ${i + 1}/${n}`), 7, false, COUL.gris, true);
  }
  return doc.build();
}

// --- Livraison du fichier -----------------------------------------------------
function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg; el.hidden = false;
  clearTimeout(toast.t); toast.t = setTimeout(() => { el.hidden = true; }, 3500);
}

async function exportPdf() {
  const f = curFiche();
  if (!f) { toast("Choisissez d'abord un type de contrôle."); return; }
  let checklistBlob, piecesBlob, commandeBlob;
  try {
    checklistBlob = construireChecklistPdf();
    piecesBlob = construirePiecesPdf();
    commandeBlob = construireCommandePdf();
  } catch (err) { toast("Impossible de créer le PDF : " + err.message); return; }

  const slug = t => String(t || "").trim().replace(/[^\w-]+/g, "_").replace(/^_+|_+$/g, "");
  const suffixe = ["_" + slug(f.nom), state.vehicule.immat && "_" + slug(state.vehicule.immat), state.vehicule.date && "_" + state.vehicule.date]
    .filter(Boolean).join("");
  const fichiers = [{ nom: "controle" + suffixe + ".pdf", data: checklistBlob }];
  if (piecesBlob) fichiers.push({ nom: "liste_pieces" + suffixe + ".pdf", data: piecesBlob });
  if (commandeBlob) fichiers.push({ nom: "pieces_a_commander" + suffixe + ".pdf", data: commandeBlob });

  let dl = null;
  try { dl = window.claude?.use ? await window.claude.use("downloads") : null; } catch (e) { dl = null; }
  if (dl) {
    try {
      for (const fi of fichiers) await dl.save({ filename: fi.nom, data: fi.data });
      marquerExporte();
      toast(fichiers.length > 1 ? "PDF enregistrés : " + fichiers.map(fi => fi.nom).join(", ") : "PDF enregistré : " + fichiers[0].nom);
    } catch (e) { toast(e && e.code === "declined" ? "Enregistrement annulé." : "Enregistrement impossible (" + ((e && (e.message || e.code)) || "erreur") + ")."); }
    return;
  }
  marquerExporte();
  fichiers.forEach(fi => {   // hors artefact : téléchargement classique
    const a = document.createElement("a");
    a.href = URL.createObjectURL(fi.data); a.download = fi.nom;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  });
  toast(fichiers.length > 1 ? "PDF générés : " + fichiers.map(fi => fi.nom).join(", ") : "PDF généré : " + fichiers[0].nom);
}
