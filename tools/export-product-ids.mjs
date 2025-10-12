/**
 * يقرأ src/data/products.json ويولّد tools/images.csv
 * الأعمدة: id,name_ar,category,sku,image_url
 * هتفتح الملف وتملأ عمود image_url باللينكات المباشرة للصور
 */

import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const DATA_PATH = path.join(ROOT, "src", "data", "products.json");
const CSV_PATH  = path.join(ROOT, "tools", "images.csv");

function sanitize(val) {
  return String(val ?? "")
    .replace(/[\r\n]+/g, " ")
    .replace(/,/g, " ")
    .trim();
}

async function main() {
  // تأكد ان ملف المنتجات موجود
  const raw = await fs.readFile(DATA_PATH, "utf8");
  const products = JSON.parse(raw);

  // تأكد مجلد tools موجود
  await fs.mkdir(path.join(ROOT, "tools"), { recursive: true });

  // حضّر CSV
  const header = "id,name_ar,category,sku,image_url\n";
  const lines = products.map(p => {
    const id  = sanitize(p.id);
    const nm  = sanitize(p.name_ar || p.name_en || "");
    const cat = sanitize(p.category);
    const sku = sanitize(p.sku);
    return `${id},${nm},${cat},${sku},`;
  });

  await fs.writeFile(CSV_PATH, header + lines.join("\n"), "utf8");
  console.log("✅ تم إنشاء tools/images.csv من products.json");
  console.log("↪ افتح الملف وحط رابط كل صورة في عمود image_url (رابط مباشر .jpg/.png/.webp)");
}

main().catch(err => { console.error("❌ Error:", err); process.exit(1); });
