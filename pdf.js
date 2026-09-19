// Export PDF : générateur minimal (Helvetica standard), sans bibliothèque externe.
// Deux fichiers distincts : la fiche de contrôle remplie, et (si des pièces sont cochées) la liste de pièces.

const MM = 72 / 25.4;
const PAGE_W = 210, PAGE_H = 297, MARGE = 10, BAS = 287;
const COUL = {
  texte: [29, 39, 51], gris: [107, 119, 133], trait: [190, 197, 206],
  ok: [30, 158, 88], warn: [224, 144, 11], ko: [211, 58, 58],
  bleu: [31, 78, 140], fondSection: [228, 234, 244], fondTete: [31, 78, 140]
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
      doc.text(MARGE + 1.5, st.y + 3.8, winansi(l.section), 8.5, true, COUL.bleu);
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
  doc.text(MARGE, y + 5, winansi(f.nom), 16, true, COUL.bleu);
  doc.text(PAGE_W - MARGE, y + 5, winansi("CONTRÔLE DU VÉHICULE"), 9, true, COUL.gris, true);
  y += 9;
  doc.rect(MARGE, y, PAGE_W - 2 * MARGE, 0.5, COUL.bleu);
  y += 3;

  // Bloc véhicule
  const champs = [
    ["Immatriculation", v.immat], ["N° OR", v.vin], ["Marque", v.marque], ["Modèle", v.modele],
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
      lignes.push({ cells: [{ t: (d.travaux || "").trim() || " \n \n " }], full: true });
      return;
    }
    sec.items.forEach((nom, i) => {
      const e = d.items[si + ":" + i] || {};
      const com = [sec.type === "pms" && e.qty ? "Qté / viscosité : " + e.qty : "", (e.note || "").trim()].filter(Boolean).join(" — ");
      const cells = [
        { t: nom },
        { t: e.v ? LIBELLE[e.v] : "", gras: true, couleur: COULEUR_ETAT[e.v] }
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

// --- PDF « Liste de pièces » : document séparé, uniquement s'il y a des pièces cochées ---
function construirePiecesPdf() {
  const f = curFiche(), v = state.vehicule;
  const aDebiter = piecesADebiter();
  if (!aDebiter.length) return null;

  const doc = new PdfDoc();
  doc.addPage();
  let py = 12;
  doc.text(MARGE, py + 5, winansi("LISTE DE PIÈCES"), 16, true, COUL.bleu);
  doc.text(PAGE_W - MARGE, py + 5, winansi(f.nom), 9, true, COUL.gris, true);
  py += 9;
  doc.rect(MARGE, py, PAGE_W - 2 * MARGE, 0.5, COUL.bleu);
  py += 5;
  const resume = [v.immat && "Véhicule : " + v.immat, v.date && "Date : " + dateFR(v.date), v.controleur && "Contrôleur : " + v.controleur]
    .filter(Boolean).join("     ");
  if (resume) { doc.text(MARGE, py + 2, winansi(resume), 9, false, COUL.texte); py += 7; }
  const st = { y: py };
  tableau(doc, st, [14, 100, 76], ["N°", "Pièce", "Référence"],
    aDebiter.map((p, i) => ({ cells: [{ t: String(i + 1) }, { t: p.nom }, { t: p.ref, gras: true }] })));

  const n = doc.pages.length;
  const pied = ["Liste de pièces", f.nom, v.immat].filter(Boolean).join(" · ");
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
  let checklistBlob, piecesBlob;
  try {
    checklistBlob = construireChecklistPdf();
    piecesBlob = construirePiecesPdf();
  } catch (err) { toast("Impossible de créer le PDF : " + err.message); return; }

  const slug = t => String(t || "").trim().replace(/[^\w-]+/g, "_").replace(/^_+|_+$/g, "");
  const suffixe = ["_" + slug(f.nom), state.vehicule.immat && "_" + slug(state.vehicule.immat), state.vehicule.date && "_" + state.vehicule.date]
    .filter(Boolean).join("");
  const fichiers = [{ nom: "controle" + suffixe + ".pdf", data: checklistBlob }];
  if (piecesBlob) fichiers.push({ nom: "liste_pieces" + suffixe + ".pdf", data: piecesBlob });

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
