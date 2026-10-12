// node tools/imagenes.js — rehace assets/og.jpg (la vista previa de WhatsApp),
// assets/icon-180.png y assets/favicon.png a partir de assets/icon-512.png.
// Necesita playwright-core y un Chromium. En la máquina de desarrollo no hay
// navegador: vale el que monta scripts/store-screenshots/setup.sh del repo de
// EL TOP JOHN, cargando antes su env.sh.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

const OUT = path.resolve(__dirname, '../assets');
const ICON = `file://${OUT}/icon-512.png`;
const TMP = require('os').tmpdir();

const og = (eyebrow, lines) => `<!doctype html><meta charset="utf-8"><style>
  html,body{margin:0;width:1200px;height:630px;overflow:hidden}
  body{background:repeating-conic-gradient(from 3deg at 78% 50%, #FFE135 0 7.5deg, #F7CE0E 7.5deg 15deg);font-family:Roboto,sans-serif;color:#000}
  .t{position:absolute;left:72px;top:64px}
  .e{font-size:25px;font-weight:700;letter-spacing:.17em;text-transform:uppercase;color:#00668F;margin:0 0 14px}
  h1{margin:0;font-size:168px;font-weight:900;line-height:.9;letter-spacing:-.035em}
  h1 span{display:block} .j{color:#C2185B}
  .c{position:absolute;left:72px;bottom:66px;background:#fff;border:6px solid #000;box-shadow:10px 10px 0 #000;padding:16px 28px;font-size:40px;font-weight:700;line-height:1.25}
  .c span{display:block;white-space:nowrap}
  img{position:absolute;right:84px;top:119px;width:380px;height:380px;border:6px solid #000;box-shadow:12px 12px 0 #000}
</style><div class="t"><p class="e">${eyebrow}</p><h1><span>ME LA</span><span class="j">JUEGO</span></h1></div>
<div class="c">${lines.map((l) => `<span>${l}</span>`).join('')}</div>
<img src="${ICON}">`;

const img = (size) => `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:#FFE135}img{display:block;width:${size}px;height:${size}px}</style><img src="${ICON}">`;

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const shoot = async (html, w, h, out, opts) => {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    const f = `${TMP}/_gen.html`;
    fs.writeFileSync(f, html);
    await page.goto('file://' + f);
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `${OUT}/${out}`, ...opts });
    await page.close();
    console.log(out, Math.round(fs.statSync(`${OUT}/${out}`).size / 1024) + ' KB');
  };

  await shoot(og('Trivial de fiesta · un solo móvil', ['Si fallas, pierdes una vida.', 'El último en pie gana.']), 1200, 630, 'og.jpg', { type: 'jpeg', quality: 88 });
  await shoot(img(180), 180, 180, 'icon-180.png', { type: 'png' });
  await shoot(img(64), 64, 64, 'favicon.png', { type: 'png' });
  await browser.close();
})();
