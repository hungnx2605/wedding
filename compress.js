const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const inputDir = "./assets/images/randomImage";
const outputDir = "./assets/images/webp";

fs.mkdirSync(outputDir, { recursive: true });

fs.readdirSync(inputDir).forEach((file) => {
  const ext = path.extname(file).toLowerCase();
  if (![".jpg", ".jpeg", ".png"].includes(ext)) return;

  sharp(path.join(inputDir, file))
    .webp({ quality: 75 })
    .toFile(path.join(outputDir, path.basename(file, ext) + ".webp"))
    .then(() => console.log(`✅ Done: ${file}`))
    .catch((err) => console.error(`❌ Error: ${file}`, err));
});
