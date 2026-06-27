/**
 * Generates the Developer ID card front/back images using canvas-kit (node-canvas).
 * Run: node scripts/generate-card-images.js
 * Output: public/images/developer-id-front.png
 *         public/images/developer-id-back.png
 *
 * NOTE: This script uses the Jimp-free approach: pure HTMLCanvas via the 'canvas'
 * npm package (node-canvas). If canvas is not installed, use the browser-based
 * generation path via the createCardCanvas() function in Lanyard.tsx instead.
 */

const path = require('path');
const fs = require('fs');

try {
  const { createCanvas, loadImage } = require('canvas');
  runWithCanvas(createCanvas, loadImage);
} catch {
  console.error('node-canvas not installed. Skipping card image generation.');
  console.log('The Lanyard will use the default card.glb texture instead.');
  process.exit(0);
}

async function runWithCanvas(createCanvas, loadImage) {
  const W = 512;
  const H = 728;

  // ── Front face ──────────────────────────────────────────────────
  const fCanvas = createCanvas(W, H);
  const fCtx = fCanvas.getContext('2d');

  // Background gradient
  const bg = fCtx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#0f1729');
  bg.addColorStop(0.5, '#131b36');
  bg.addColorStop(1, '#0a0f22');
  fCtx.fillStyle = bg;
  fCtx.fillRect(0, 0, W, H);

  // Border
  fCtx.strokeStyle = 'rgba(37,99,235,0.35)';
  fCtx.lineWidth = 2;
  fCtx.beginPath();
  fCtx.roundRect(12, 12, W - 24, H - 24, 12);
  fCtx.stroke();

  // Header
  fCtx.fillStyle = 'rgba(76,215,246,0.9)';
  fCtx.font = 'bold 13px "Courier New", monospace';
  fCtx.fillText('DEVELOPER ID', 28, 50);

  fCtx.fillStyle = 'rgba(37,99,235,0.3)';
  fCtx.fillRect(28, 60, W - 56, 1);

  // Photo area
  const px = 36, py = 82, pw = 110, ph = 148;
  fCtx.fillStyle = '#070d1f';
  fCtx.beginPath();
  fCtx.roundRect(px, py, pw, ph, 6);
  fCtx.fill();
  fCtx.strokeStyle = 'rgba(37,99,235,0.5)';
  fCtx.lineWidth = 1.5;
  fCtx.stroke();

  // Try to load the real profile photo
  const photoPath = path.join(__dirname, '..', 'public', 'images', 'profile', 'tito-profile.jpeg');
  if (fs.existsSync(photoPath)) {
    try {
      const photo = await loadImage(photoPath);
      // Crop center face region: target objectPosition 58% 30%
      const srcAspect = photo.width / photo.height;
      const destAspect = pw / ph;
      let sx, sy, sw, sh;
      if (srcAspect > destAspect) {
        sh = photo.height;
        sw = sh * destAspect;
        sx = photo.width * 0.58 - sw / 2;
        sy = 0;
      } else {
        sw = photo.width;
        sh = sw / destAspect;
        sx = 0;
        sy = photo.height * 0.30 - sh / 2;
      }
      // Clamp
      sx = Math.max(0, Math.min(sx, photo.width - sw));
      sy = Math.max(0, Math.min(sy, photo.height - sh));

      fCtx.save();
      fCtx.beginPath();
      fCtx.roundRect(px, py, pw, ph, 6);
      fCtx.clip();
      fCtx.drawImage(photo, sx, sy, sw, sh, px, py, pw, ph);
      fCtx.restore();
    } catch {
      // fallback label
      fCtx.fillStyle = 'rgba(76,215,246,0.3)';
      fCtx.font = '9px "Courier New", monospace';
      fCtx.textAlign = 'center';
      fCtx.fillText('[PHOTO]', px + pw / 2, py + ph / 2 + 3);
      fCtx.textAlign = 'start';
    }
  }

  // Name
  fCtx.fillStyle = '#dce1fb';
  fCtx.font = 'bold 16px "Segoe UI", sans-serif';
  fCtx.fillText('TITO PAMUNGKAS', 160, 104);
  fCtx.fillText('WARDANA', 160, 125);

  fCtx.fillStyle = '#c3c6d7';
  fCtx.font = '11px "Segoe UI", sans-serif';
  fCtx.fillText('Informatics Engineering', 160, 148);
  fCtx.fillText('UMRAH', 160, 166);

  // Divider
  fCtx.fillStyle = 'rgba(76,215,246,0.12)';
  fCtx.fillRect(28, 252, W - 56, 1);

  fCtx.fillStyle = 'rgba(76,215,246,0.9)';
  fCtx.font = 'bold 12px "Courier New", monospace';
  fCtx.fillText('ROLE', 28, 285);

  fCtx.fillStyle = '#dce1fb';
  fCtx.font = 'bold 14px "Segoe UI", sans-serif';
  fCtx.fillText('FULL-STACK DEVELOPER', 28, 312);

  fCtx.fillStyle = '#c3c6d7';
  fCtx.font = '11px "Segoe UI", sans-serif';
  fCtx.fillText('CYBERSECURITY ENTHUSIAST', 28, 334);

  fCtx.fillStyle = 'rgba(76,215,246,0.12)';
  fCtx.fillRect(28, 354, W - 56, 1);

  // Available dot
  fCtx.fillStyle = '#22c55e';
  fCtx.beginPath();
  fCtx.arc(36, 393, 5, 0, Math.PI * 2);
  fCtx.fill();
  fCtx.fillStyle = 'rgba(76,215,246,0.7)';
  fCtx.font = '10px "Courier New", monospace';
  fCtx.fillText('STATUS: AVAILABLE', 50, 397);

  fCtx.fillStyle = '#dce1fb';
  fCtx.font = '11px "Courier New", monospace';
  fCtx.fillText('ID: TPW-DEV-01', 28, 430);

  // Bottom
  fCtx.fillStyle = 'rgba(37,99,235,0.3)';
  fCtx.font = '8px "Courier New", monospace';
  fCtx.fillText('github.com/titopamungkas', W - 210, H - 36);

  // ── Back face ──────────────────────────────────────────────────
  const bCanvas = createCanvas(W, H);
  const bCtx = bCanvas.getContext('2d');

  const bbg = bCtx.createLinearGradient(0, 0, W, H);
  bbg.addColorStop(0, '#0a0f22');
  bbg.addColorStop(0.5, '#0f1729');
  bbg.addColorStop(1, '#131b36');
  bCtx.fillStyle = bbg;
  bCtx.fillRect(0, 0, W, H);

  bCtx.strokeStyle = 'rgba(37,99,235,0.35)';
  bCtx.lineWidth = 2;
  bCtx.beginPath();
  bCtx.roundRect(12, 12, W - 24, H - 24, 12);
  bCtx.stroke();

  bCtx.fillStyle = 'rgba(76,215,246,0.9)';
  bCtx.font = 'bold 13px "Courier New", monospace';
  bCtx.fillText('TECH STACK', 28, 50);

  bCtx.fillStyle = 'rgba(37,99,235,0.3)';
  bCtx.fillRect(28, 60, W - 56, 1);

  const techs = [
    'React', 'Next.js', 'TypeScript', 'Tailwind CSS',
    'PHP / CI4', 'Laravel', 'MySQL', 'Python',
    'Three.js', 'GSAP', 'Motion', 'Docker',
  ];

  bCtx.font = '11px "Courier New", monospace';
  techs.forEach((tech, i) => {
    const col = i < 6 ? 0 : 1;
    const row = i < 6 ? i : i - 6;
    const x = col === 0 ? 36 : W / 2 + 8;
    const y = 92 + row * 30;

    // Badge bg
    bCtx.fillStyle = 'rgba(37,99,235,0.12)';
    bCtx.beginPath();
    if (bCtx.roundRect) {
      bCtx.roundRect(x - 4, y - 14, 148, 22, 4);
    } else {
      bCtx.rect(x - 4, y - 14, 148, 22);
    }
    bCtx.fill();

    bCtx.fillStyle = '#dce1fb';
    bCtx.font = '11px "Courier New", monospace';
    bCtx.fillText('▸ ' + tech, x + 2, y + 2);
  });

  bCtx.fillStyle = 'rgba(76,215,246,0.12)';
  bCtx.fillRect(28, 382, W - 56, 1);

  bCtx.fillStyle = 'rgba(76,215,246,0.4)';
  bCtx.font = '10px "Courier New", monospace';
  bCtx.fillText('TPW-DEV-01', 28, H - 36);

  bCtx.fillStyle = 'rgba(37,99,235,0.3)';
  bCtx.font = '8px "Courier New", monospace';
  bCtx.fillText('github.com/titopamungkas', W - 210, H - 36);

  // ── Save ─────────────────────────────────────────────────────
  const outDir = path.join(__dirname, '..', 'public', 'images');
  const frontOut = path.join(outDir, 'developer-id-front.png');
  const backOut  = path.join(outDir, 'developer-id-back.png');

  fs.writeFileSync(frontOut, fCanvas.toBuffer('image/png'));
  fs.writeFileSync(backOut,  bCanvas.toBuffer('image/png'));

  console.log('✓ Generated:', frontOut);
  console.log('✓ Generated:', backOut);
}
