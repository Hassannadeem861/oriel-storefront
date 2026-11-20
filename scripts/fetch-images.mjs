/**
 * Downloads curated Unsplash photographs (Unsplash License — free for commercial
 * use, no attribution required) and prepares optimised local WebP assets.
 *
 *   node scripts/fetch-images.mjs
 *
 * Product images:   public/images/products/<key>-1.webp  (main, 4:5)
 *                   public/images/products/<key>-2.webp  (detail crop, 4:5)
 * Editorial images: public/images/editorial/<key>.webp   (16:10)
 *
 * Images are stored locally so the storefront never depends on a third-party
 * CDN at runtime. Swap these for real product photography before launch.
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = (id, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=85&fm=jpg`;

export const PRODUCT_PHOTOS = {
  "h1-over-ear": "1546435770-a3e426bf472b",
  "h1-over-ear-alt": "1618366712010-f4ae9c647dcb",
  "studio-reference": "1484704849700-f032a568e944",
  "solstice-wireless": "1505740420928-5e560c06d30e",
  "classic-wired": "1583394838336-acd977736f90",
  "drift-earbuds": "1606220945770-b5b6c2c55bf1",
  "field-38": "1585123334904-845d60e97b29",
  "mono-36": "1523275335684-37898b6baf30",
  "open-heart": "1524805444758-089113d48a6d",
  "pulse-activity": "1617043786394-f977fa12eddf",
  "daypack-20": "1553062407-98eeb64c6a62",
  "heritage-rucksack": "1622560480605-d83c853bc5c3",
  "saddle-crossbody": "1600857062241-98e5dba7f214",
  "market-basket": "1590874103328-eac38a683ce7",
  "canvas-tote": "1544816155-12df9643f363",
  "loopback-crew": "1620799140408-edc6dcb6d633",
  "essential-tee": "1521572163474-6864f9cf17ab",
  "knit-poncho": "1434389677669-e08b4cac3105",
  "bomber-jacket": "1591047139829-d91aecb6caea",
  "biker-jacket": "1551028719-00167b16eac5",
  "selvedge-denim": "1604176354204-9268737828e4",
  "vessel-no3": "1612196808214-b8e1d6145a8c",
  "bottle-vases": "1565193566173-7a0ee3dbe261",
  "stoneware-cups": "1610701596007-11502861dcfa",
  "morning-mug": "1514228742587-6b1558fcca3d",
  "arc-task-lamp": "1507473885765-e6ed057f782c",
  "dome-pendant": "1513506003901-1e6a229e2d15",
  "cedar-candle": "1603006905003-be475563bc59",
  "heirloom-rug": "1600166898405-da9535204843",
  "turned-bud-vases": "1584589167171-541ce45f1eea",
  "mira-sofa": "1555041469-a586c61ea9bc",
  "loft-sofa": "1567016432779-094069958ea5",
  "tufted-chair": "1616627547584-bf28cee262db",
  "counter-stool": "1581539250439-c96689b516dd",
  "ash-stool": "1503602642458-232111445657",
  "shell-chair": "1592078615290-033ee584e267",
  "low-profile-keyboard": "1587829741301-dc798b83add3",
  "tessel-75": "1595225476474-87563907a212",
  "dot-grid-notebook": "1531346878377-a5be20888e57",
  "steel-bottle": "1602143407151-7111542de6e8",
  "contour-mouse": "1527864550417-7fd91fc51a46",
};

export const EDITORIAL_PHOTOS = {
  "lounge-interior": "1524758631624-e2822e304c36",
  "yellow-chair-room": "1586023492125-27b2c045efd7",
  "living-room": "1600210492486-724fe5c67fb0",
  "calm-living": "1616486338812-3dadae4b4ace",
  "terracotta-corner": "1618220179428-22790b461013",
  "white-room": "1519710164239-da123dc03ef4",
  "linen-sofa": "1578500494198-246f612d3b3d",
  "desk-setup": "1593642632559-0c6d3fc62b89",
  "desk-headphones": "1498049794561-7780e7231661",
  "wardrobe-flatlay": "1556905055-8f358a7a47b2",
  "wardrobe-rail": "1490481651871-ab68de25d43d",
  "coffee-ritual": "1511920170033-f8396924c348",
  "dried-flowers": "1513161455079-7dc1de15ef3e",
  "shelf-plants": "1534349762230-e0cadf78f5da",
  "leather-carry": "1622560480605-d83c853bc5c3",
};

/**
 * Retouching: soften dial printing that shows real watchmakers' names, so our
 * fictional brands are never presented with another company's trademark.
 * Regions are in the 1200 x 1500 framed image.
 */
const RETOUCH = {
  "open-heart": [{ left: 362, top: 712, width: 150, height: 125, color: "#ebe5da" }],
  "field-38": [{ left: 420, top: 515, width: 185, height: 120, color: "#e8e7e1" }],
};

async function retouch(key, buffer) {
  const regions = RETOUCH[key];
  if (!regions) return buffer;
  // Feathered patch in the dial's own colour: reads as a clean,
  // unbranded dial rather than a blur.
  const patches = await Promise.all(
    regions.map(async ({ color, ...r }) => {
      const svg = `<svg width="${r.width}" height="${r.height}"><defs><radialGradient id="g"><stop offset="55%" stop-color="${color}" stop-opacity="1"/><stop offset="100%" stop-color="${color}" stop-opacity="0"/></radialGradient></defs><ellipse cx="50%" cy="50%" rx="50%" ry="50%" fill="url(#g)"/></svg>`;
      return { input: Buffer.from(svg), left: r.left, top: r.top };
    })
  );
  return sharp(buffer).composite(patches).toBuffer();
}

/** Manual crop anchors where the automatic "attention" strategy misses the subject. */
const CROP_POSITION = {
  "vessel-no3": "centre",
};

async function download(id, w) {
  const res = await fetch(SRC(id, w));
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${id}`);
  return Buffer.from(await res.arrayBuffer());
}

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function run() {
  const productDir = path.join(ROOT, "public/images/products");
  const editorialDir = path.join(ROOT, "public/images/editorial");
  await fs.mkdir(productDir, { recursive: true });
  await fs.mkdir(editorialDir, { recursive: true });

  for (const [key, id] of Object.entries(PRODUCT_PHOTOS)) {
    const main = path.join(productDir, `${key}-1.webp`);
    const detail = path.join(productDir, `${key}-2.webp`);
    if ((await exists(main)) && (await exists(detail))) continue;
    const buf = await download(id, 1600);
    const raw = await sharp(buf)
      .resize(1200, 1500, {
        fit: "cover",
        position: CROP_POSITION[key] || sharp.strategy.attention,
      })
      .toBuffer();
    const framed = await retouch(key, raw);
    await sharp(framed).webp({ quality: 80 }).toFile(main);
    // Detail view: a tighter crop of the centre of the main frame.
    await sharp(framed)
      .extract({ left: 210, top: 262, width: 780, height: 975 })
      .resize(1200, 1500)
      .webp({ quality: 80 })
      .toFile(detail);
    console.log("product", key);
  }

  for (const [key, id] of Object.entries(EDITORIAL_PHOTOS)) {
    const out = path.join(editorialDir, `${key}.webp`);
    if (await exists(out)) continue;
    const buf = await download(id, 2200);
    await sharp(buf)
      .resize(2000, 1250, { fit: "cover", position: sharp.strategy.attention })
      .webp({ quality: 78 })
      .toFile(out);
    console.log("editorial", key);
  }
  console.log("Done.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
