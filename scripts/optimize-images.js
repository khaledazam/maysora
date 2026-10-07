import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const imagesDir = path.resolve('public/images');

async function optimizeImages() {
  console.log('Optimizing images in:', imagesDir);

  // 1. Hero background: width 1440, quality 60
  const heroPath = path.join(imagesDir, 'hero_bg.jpg');
  if (fs.existsSync(heroPath)) {
    const heroBuffer = fs.readFileSync(heroPath);
    await sharp(heroBuffer)
      .resize({ width: 1440, withoutEnlargement: true })
      .webp({ quality: 60, effort: 6 })
      .toFile(path.join(imagesDir, 'hero_bg.webp'));

    console.log('hero_bg compressed.');
  }

  // 2. Financial consult image: 520x320 cover, quality 70
  const finPath = path.join(imagesDir, 'fin_consult.jpg');
  if (fs.existsSync(finPath)) {
    const finBuffer = fs.readFileSync(finPath);
    await sharp(finBuffer)
      .resize({ width: 520, height: 320, fit: 'cover' })
      .webp({ quality: 70, effort: 6 })
      .toFile(path.join(imagesDir, 'fin_consult.webp'));

    console.log('fin_consult compressed.');
  }

  // 3. Hajj VIP image: 520x320 cover, quality 70
  const hajjPath = path.join(imagesDir, 'hajj_vip.jpg');
  if (fs.existsSync(hajjPath)) {
    const hajjBuffer = fs.readFileSync(hajjPath);
    await sharp(hajjBuffer)
      .resize({ width: 520, height: 320, fit: 'cover' })
      .webp({ quality: 70, effort: 6 })
      .toFile(path.join(imagesDir, 'hajj_vip.webp'));

    console.log('hajj_vip compressed.');
  }

  // 4. Logo: 128x128 cover, quality 80
  const logoPath = path.join(imagesDir, 'logo.jpg');
  if (fs.existsSync(logoPath)) {
    const logoBuffer = fs.readFileSync(logoPath);
    await sharp(logoBuffer)
      .resize({ width: 128, height: 128, fit: 'cover' })
      .webp({ quality: 80, effort: 6 })
      .toFile(path.join(imagesDir, 'logo.webp'));

    console.log('logo compressed.');
  }

  console.log('All images optimized successfully!');
}

optimizeImages().catch(console.error);
