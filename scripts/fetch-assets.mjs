/**
 * Downloads the FoodieBites imagery into public/images.
 *
 * - Dish photos come from Wikimedia Commons (freely licensed; attribution is
 *   written to public/images/ATTRIBUTION.md).
 * - Hero / people photos come from Unsplash (Unsplash License).
 *
 * Run with: node scripts/fetch-assets.mjs
 * The script is idempotent: existing files are skipped unless --force is passed.
 */
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const OUT_DIR = path.join(process.cwd(), "public", "images");
const force = process.argv.includes("--force");
const UA = "FoodieBites-demo/1.0 (educational demo)";

/** @type {{ name: string, commons?: string[], unsplash?: string, width?: number, height?: number }[]} */
const assets = [
  // --- Dishes (Wikimedia Commons) ---
  { name: "dish-carbonara", commons: ["Spaghetti alla Carbonara (Madrid).JPG", "Espaguetis carbonara.jpg"] },
  { name: "dish-margherita-pizza", commons: ["Margherita pizza on plate.jpg", "Pizza-napoletana.jpg"] },
  { name: "dish-mushroom-risotto", commons: ["Mushroom risotto (24413786242).jpg", "Risotto ai funghi.jpg", "Risotto.jpg"] },
  { name: "dish-french-fries", commons: ["Truffle oil french fries (33024792848).jpg", "Cajun fries from Popeyes Louisiana Kitchen, Stratford, Ontario, 2025-08-04.jpg"] },
  { name: "dish-spring-rolls", commons: ["Golden Vegetable Spring Rolls Served with Dipping Sauce.jpg", "Spring roll 5.jpg"] },
  { name: "dish-tomato-soup", commons: ["Tomato soup.jpg", "Tomato soup and grilled cheese.JPG"] },
  { name: "dish-beef-tacos", commons: ["Tacos al pastor con piña.jpg", "001 Tacos de carnitas, carne asada y al pastor.jpg"] },
  { name: "dish-quesadilla", commons: ["Chicken quesadilla - Massachusetts.jpg", "Quesadilla plate, New Orleans November 2016.jpg"] },
  { name: "dish-shawarma", commons: ["Chicken Shawarma Wrap - Lavash 2024-09-11.jpg", "Chicken Shawarma (94298).jpg"] },
  { name: "dish-biryani", commons: ["Dum Biryani Plate.jpg", "Biryani Home.jpg"] },
  { name: "dish-grilled-salmon", commons: ["Grilled salmon.jpg", "Grilled salmon (27426046515).jpg"] },
  { name: "dish-fish-curry", commons: ["Fish-curry-rice, Goan-style 02.jpg", "Meen curry (fish curry) from Kerala, traditionally prepared in earthern pot.jpg"] },
  { name: "dish-club-sandwich", commons: ["Club-sandwich.jpg", "Classic Club Sandwich, Dôme East Fremantle, 2026 (02).jpg"] },
  { name: "dish-chow-mein", commons: ["Chicken Chow mein 1.jpg", "Chow Mein in Meerut, India.jpg"] },
  { name: "dish-mango-smoothie", commons: ["Fresh-mango-smoothie 01.jpg", "Mango Smoothie, Petra Restaurant, 2026 (01).jpg"] },

  // --- Hero / sections / people (Unsplash) ---
  { name: "hero-plate", unsplash: "1546069901-ba9599a7e63c", width: 1100, height: 1100 },
  { name: "reservation", unsplash: "1600891964092-4316c288032e", width: 1000, height: 1000 },
  { name: "service-chef", unsplash: "1577219491135-ce391730fb2c", width: 900, height: 900 },
  { name: "chef-1", unsplash: "1583394293214-28ded15ee548", width: 700, height: 800 },
  { name: "chef-2", unsplash: "1595273670150-bd0c3c392e46", width: 700, height: 800 },
  { name: "chef-3", unsplash: "1622021142947-da7dedc7c39a", width: 700, height: 800 },
  { name: "chef-4", unsplash: "1600565193348-f74bd3c7ccdf", width: 700, height: 800 },
  { name: "avatar-1", unsplash: "1544005313-94ddf0286df2", width: 300, height: 300 },
  { name: "avatar-2", unsplash: "1500648767791-00dcc994a43e", width: 300, height: 300 },
  { name: "avatar-3", unsplash: "1494790108377-be9c29b29330", width: 300, height: 300 },
];

async function fetchJson(url, attempts = 4) {
  let lastError;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, { headers: { "user-agent": UA } });
      return await res.json();
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

async function commonsThumb(title) {
  const api =
    "https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*" +
    "&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=1200" +
    `&titles=${encodeURIComponent(`File:${title}`)}`;
  const json = await fetchJson(api);
  const page = Object.values(json.query?.pages ?? {})[0];
  if (!page || page.missing !== undefined || !page.imageinfo?.[0]) return null;
  const info = page.imageinfo[0];
  const meta = info.extmetadata ?? {};
  return {
    url: info.thumburl ?? info.url,
    attribution: `[${title}](${info.descriptionurl}) — ${meta.LicenseShortName?.value ?? "see source"}${
      meta.Artist?.value ? `, ${String(meta.Artist.value).replace(/<[^>]+>/g, "").slice(0, 80)}` : ""
    } (Wikimedia Commons)`,
  };
}

async function download(url, filePath) {
  const res = await fetch(url, { headers: { "user-agent": UA } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const type = res.headers.get("content-type") ?? "";
  if (!type.startsWith("image/")) throw new Error(`unexpected content-type ${type}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  if (buffer.byteLength < 5000) throw new Error("suspiciously small file");
  await writeFile(filePath, buffer);
  return buffer.byteLength;
}

await mkdir(OUT_DIR, { recursive: true });

const attributions = [
  "# Image attribution",
  "",
  "Dish photos are from Wikimedia Commons under the license noted next to each file.",
  "Hero, section, chef and avatar photos are from [Unsplash](https://unsplash.com) under the Unsplash License.",
  "Generated by `node scripts/fetch-assets.mjs`.",
  "",
];

for (const asset of assets) {
  const target = path.join(OUT_DIR, `${asset.name}.jpg`);
  if (existsSync(target) && !force) {
    console.log(`skip  ${asset.name}`);
    continue;
  }

  try {
    if (asset.commons) {
      let saved = false;
      for (const title of asset.commons) {
        const info = await commonsThumb(title);
        if (!info) continue;
        const bytes = await download(info.url, target);
        attributions.push(`- \`${asset.name}.jpg\` — ${info.attribution}`);
        console.log(`ok    ${asset.name} (${Math.round(bytes / 1024)} kB)`);
        saved = true;
        break;
      }
      if (!saved) throw new Error("no Commons candidate matched");
    } else if (asset.unsplash) {
      const { width = 1000, height = 1000 } = asset;
      const url = `https://images.unsplash.com/photo-${asset.unsplash}?w=${width}&h=${height}&fit=crop&crop=entropy&auto=format&q=80`;
      const bytes = await download(url, target);
      console.log(`ok    ${asset.name} (${Math.round(bytes / 1024)} kB)`);
    }
  } catch (error) {
    console.error(`FAIL  ${asset.name}: ${error.message}`);
  }
}

await writeFile(path.join(OUT_DIR, "ATTRIBUTION.md"), attributions.join("\n") + "\n");
console.log("done");
