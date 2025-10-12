/**
 * تحميل صور من tools/images.csv
 * - يصدر نسختين: <id>.webp (330) و <id>@2x.webp (660)
 * - جودة عالية + بدون قصّ (contain + padding)
 * - محاولات إعادة مع User-Agent
 * - يمنع تكبير مفرط ويحذّر لو الصورة الأصلية صغيرة
 */

import fs from "node:fs/promises";
import path from "node:path";
import fetch from "node-fetch";
import sharp from "sharp";
import { parse } from "csv-parse/sync";

const ROOT = process.cwd();
const DATA_PATH = path.join(ROOT, "src", "data", "products.json");
const CSV_PATH  = path.join(ROOT, "tools", "images.csv");
const OUT_DIR   = path.join(ROOT, "public", "assets", "img");

// إعدادات
const QUALITY = 92;         // جودة WebP أعلى
const EFFORT  = 5;          // مجهود ضغط (0-6)
const SHARPEN = true;       // حِدّة خفيفة
const TARGET  = 330;
const RETINA  = 660;        // 2x
const FIT_MODE = "contain"; // "contain" = بلا قصّ, "cover" = قصّ ذكي
const BG_COLOR = "#ffffff"; // خلفية بيضاء أنضف للمنتجات
const PADDING  = 14;        // بادينج داخلي عند contain
const SCALE_LIMIT = 1.2;    // أقصى تكبير للصورة الصغيرة = 120%
const RETRIES = 3;          // عدد محاولات التحميل
const RETRY_DELAY_MS = 800; // تأخير بين المحاولات

function sleep(ms){ return new Promise(r=>setTimeout(r, ms)); }

async function ensureDir(p){ await fs.mkdir(p, { recursive: true }); }

async function download(url){
  let lastErr;
  for (let i=1;i<=RETRIES;i++){
    try{
      const res = await fetch(url, {
        timeout: 25000,
        headers: {
          // بعض المواقع ترفض بدون User-Agent
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) SalemForNetBot/1.0",
          "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9,ar;q=0.8"
        }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 5120) {
        // أقل من ~5KB غالباً أيقونة/صغيرة جداً
        console.warn(`⚠️ الملف صغير جداً (${Math.round(buf.length/1024)}KB): ${url}`);
      }
      return buf;
    }catch(e){
      lastErr = e;
      console.warn(`⟳ محاولة ${i}/${RETRIES} فشلت: ${e.message}`);
      if (i<RETRIES) await sleep(RETRY_DELAY_MS*i);
    }
  }
  throw lastErr;
}

async function makeImage(buf, size){
  let img = sharp(buf).rotate(); // احترم EXIF
  const meta = await img.metadata();

  // لو الصورة الأصلية صغيرة جداً:
  if ((meta.width||0) < size/2 || (meta.height||0) < size/2) {
    console.warn(`⚠️ الأصلية صغيرة (${meta.width}x${meta.height}) بالنسبة لـ ${size} — سيظهر حواف/بلور بسيط.`);
  }

  if (FIT_MODE === "cover"){
    // قصّ ذكي يركز على المحتوى
    img = img.resize(size, size, { fit: "cover", position: "entropy", withoutEnlargement: false });
  } else {
    // احتواء بدون قصّ + بادينج + خلفية
    // منع تكبير مبالغ فيه: حد أقصى SCALE_LIMIT
    let innerW = size - PADDING*2;
    let innerH = size - PADDING*2;
    if (meta.width && meta.height){
      const scaleW = innerW / meta.width;
      const scaleH = innerH / meta.height;
      const scale  = Math.min(scaleW, scaleH, SCALE_LIMIT);
      innerW = Math.floor(meta.width * scale);
      innerH = Math.floor(meta.height * scale);
    }
    img = img
      .resize(innerW, innerH, { fit: "inside", withoutEnlargement: true })
      .extend({ top: PADDING, bottom: PADDING, left: PADDING, right: PADDING, background: BG_COLOR })
      .resize(size, size, { fit: "contain", background: BG_COLOR })
      .flatten({ background: BG_COLOR });
  }

  if (SHARPEN) img = img.sharpen(0.6);
  return img.webp({ quality: QUALITY, effort: EFFORT }).toBuffer();
}

function indexBy(arr, key){
  const m = new Map();
  for (const x of arr) {
    const k = (x[key] || "").toString().trim().toLowerCase();
    if (k) m.set(k, x);
  }
  return m;
}

function detectDelimiter(firstLine){
  if (firstLine.includes(";")) return ";";
  if (firstLine.includes("\t")) return "\t";
  return ",";
}

async function main(){
  console.log("🚀 جاري تحميل الصور من:", CSV_PATH);
  await ensureDir(OUT_DIR);

  const products = JSON.parse(await fs.readFile(DATA_PATH, "utf8"));
  const byId  = indexBy(products, "id");
  const bySku = indexBy(products, "sku");

  const csvRaw = await fs.readFile(CSV_PATH, "utf8");
  const delimiter = detectDelimiter(csvRaw.split(/\r?\n/,1)[0] || ",");
  const rows = parse(csvRaw, { columns: true, skip_empty_lines: true, trim: true, delimiter });

  let ok=0, fail=0, changed=0, skipped=0;

  for (const row of rows){
    const idRaw = (row.id||"").trim();
    const skuRaw = (row.sku||"").trim();
    const image_url = (row.image_url||"").trim();
    if (!image_url) { skipped++; continue; }

    let p = byId.get(idRaw.toLowerCase());
    if (!p && skuRaw) p = bySku.get(skuRaw.toLowerCase());

    if (!p) {
      console.warn(`⚠️ المنتج غير موجود (id="${idRaw}" sku="${skuRaw}")`);
      fail++; continue;
    }

    const finalId = p.id;
    try{
      console.log(`⬇️ ${finalId} ...`);
      const raw = await download(image_url);

      const out330 = await makeImage(raw, TARGET);
      const out660 = await makeImage(raw, RETINA);

      const f330 = path.join(OUT_DIR, `${finalId}.webp`);
      const f660 = path.join(OUT_DIR, `${finalId}@2x.webp`);

      await fs.writeFile(f330, out330);
      await fs.writeFile(f660, out660);

      const newImg = `/assets/img/${finalId}.webp`;
      const newImg2x = `/assets/img/${finalId}@2x.webp`;
      if (p.image !== newImg) { p.image = newImg; changed++; }
      p.image_2x = newImg2x;
      p.image_url = image_url;

      ok++;
      console.log(`✅ ${finalId} تم الحفظ (330 و @2x).`);
    }catch(e){
      console.warn(`❌ ${finalId} فشل: ${e.message}`);
      fail++;
    }
  }

  if (changed>0){
    await fs.writeFile(DATA_PATH, JSON.stringify(products, null, 2), "utf8");
    console.log(`💾 تم تحديث products.json (${changed} تعديل).`);
  }

  console.log(`\n📦 النتائج: ✅ ${ok} - ❌ ${fail} - ⏭️ بدون رابط: ${skipped}`);
  console.log(`انتهى ✅ (MODE=${FIT_MODE}, QUALITY=${QUALITY})`);
}

main().catch(err=>{ console.error("🔥 خطأ:", err); process.exit(1); });
