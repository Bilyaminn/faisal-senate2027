export const TEMPLATES = {
  classic: { label: 'Classic' },
  modern: { label: 'Modern' }
};

const COLORS = {
  navy: '#071827',
  navy2: '#0b2235',
  cream: '#f4f0e7',
  white: '#fbfcfa',
  muted: '#aab7c0',
  gold: '#d8b568',
  green: '#0b6e3c'
};

export function drawCover(ctx, img, x, y, w, h, zoom = 100) {
  const z = Math.max(1, zoom / 100);
  const ir = img.width / img.height;
  const br = w / h;
  let sw, sh;

  if (ir > br) {
    sh = img.height;
    sw = sh * br;
  } else {
    sw = img.width;
    sh = sw / br;
  }

  sw = Math.min(img.width, sw / z);
  sh = Math.min(img.height, sh / z);
  const sx = Math.max(0, (img.width - sw) / 2);
  const sy = Math.max(0, (img.height - sh) / 2);
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function fitText(ctx, text, maxWidth, maxSize, minSize = 16, font = 'Manrope') {
  let size = maxSize;
  while (size > minSize) {
    ctx.font = `800 ${size}px ${font}`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size -= 1;
  }
  return size;
}

function wrap(ctx, text, x, y, maxWidth, lineHeight, maxLines = 3) {
  const words = String(text || '').trim().split(/\s+/).filter(Boolean);
  if (!words.length) return 0;

  const lines = [];
  let line = '';

  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width <= maxWidth || !line) {
      line = test;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);

  const visible = lines.slice(0, maxLines);
  if (lines.length > maxLines) {
    let last = visible[maxLines - 1];
    while (ctx.measureText(`${last}…`).width > maxWidth && last.length > 1) last = last.slice(0, -1);
    visible[maxLines - 1] = `${last.trim()}…`;
  }

  visible.forEach((lineText, i) => ctx.fillText(lineText, x, y + i * lineHeight));
  return visible.length;
}

function roundedImage(ctx, img, cx, cy, r, zoom) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();
  drawCover(ctx, img, cx - r, cy - r, r * 2, r * 2, zoom);
  ctx.restore();
}

function logo(ctx, logoImg, x, y, size, radius = 14) {
  if (!logoImg?.complete || !logoImg.naturalWidth) return;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, size, size, radius);
  ctx.clip();
  ctx.drawImage(logoImg, x, y, size, size);
  ctx.restore();
}

function photoPlaceholder(ctx, cx, cy, r) {
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = '#17324a';
  ctx.fill();
  ctx.fillStyle = COLORS.gold;
  ctx.textAlign = 'center';
  ctx.font = '800 23px Manrope';
  ctx.fillText('YOUR', cx, cy - 4);
  ctx.fillText('PHOTO', cx, cy + 27);
  ctx.textAlign = 'left';
}

export function renderPoster({ ctx, candidate, logoImg, supporter, name, message, hashtag, zoom, template }) {
  const W = 1080;
  const H = 1350;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = COLORS.navy;
  ctx.fillRect(0, 0, W, H);

  if (template === 'modern') {
    return modern(ctx, { candidate, logoImg, supporter, name, message, hashtag, zoom });
  }
  return classic(ctx, { candidate, logoImg, supporter, name, message, hashtag, zoom });
}

function classic(ctx, p) {
  const { candidate, logoImg, supporter, name, message, hashtag, zoom } = p;
  const W = 1080;
  const H = 1350;
  const split = 760;
  const campaignMessage = message?.trim() || 'I stand with Dr. Faisal Shuaib';

  ctx.save();
  ctx.rect(0, 0, W, split);
  ctx.clip();
  drawCover(ctx, candidate, 0, 0, W, split, 100);
  const g = ctx.createLinearGradient(0, 400, 0, split);
  g.addColorStop(0, 'rgba(7,24,39,0)');
  g.addColorStop(1, 'rgba(7,24,39,.97)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 360, W, 400);
  ctx.restore();

  logo(ctx, logoImg, 50, 44, 76);
  ctx.fillStyle = COLORS.gold;
  ctx.font = '800 18px Manrope';
  ctx.fillText('APC · 2027', 145, 76);

  ctx.fillStyle = COLORS.white;
  ctx.font = '400 58px "DM Serif Display"';
  ctx.fillText('Dr. Faisal Shuaib', 55, 670);
  ctx.fillStyle = '#c4d0da';
  ctx.font = '600 22px Manrope';
  ctx.fillText('Candidate for Senate — Nasarawa West', 55, 713);

  ctx.fillStyle = COLORS.navy2;
  ctx.fillRect(0, split, W, H - split);

  const r = 90;
  const cx = 150;
  const cy = 850;
  ctx.beginPath();
  ctx.arc(cx, cy, r + 8, 0, Math.PI * 2);
  ctx.fillStyle = COLORS.green;
  ctx.fill();
  if (supporter) roundedImage(ctx, supporter, cx, cy, r, zoom);
  else photoPlaceholder(ctx, cx, cy, r);

  ctx.fillStyle = '#91a1ad';
  ctx.font = '800 16px Manrope';
  ctx.fillText('SUPPORTED BY', 275, 824);
  ctx.fillStyle = COLORS.white;
  ctx.font = '400 35px "DM Serif Display"';
  wrap(ctx, name || 'Your Name', 275, 866, 680, 42, 2);
  ctx.fillStyle = '#91a1ad';
  ctx.font = '500 17px Manrope';
  ctx.fillText('Nasarawa West · APC Supporter', 275, 923);

  ctx.strokeStyle = 'rgba(255,255,255,.14)';
  ctx.beginPath();
  ctx.moveTo(55, 972);
  ctx.lineTo(1025, 972);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = COLORS.gold;
  ctx.font = '400 39px "DM Serif Display"';
  wrap(ctx, campaignMessage, 540, 1045, 880, 46, 2);
  ctx.fillStyle = '#91a1ad';
  ctx.font = '700 18px Manrope';
  ctx.fillText(hashtag || '#FaisalForNasarawaWest', 540, 1295);
  ctx.textAlign = 'left';
}

function modern(ctx, p) {
  const { candidate, logoImg, supporter, name, message, hashtag, zoom } = p;
  const W = 1080;
  const H = 1350;
  const campaignMessage = message?.trim() || 'I stand with Dr. Faisal Shuaib';

  // Warm editorial background.
  ctx.fillStyle = COLORS.cream;
  ctx.fillRect(0, 0, W, H);

  // Candidate image: clean, dominant upper panel.
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(36, 36, W - 72, 650, 30);
  ctx.clip();
  drawCover(ctx, candidate, 36, 36, W - 72, 650, 100);
  const overlay = ctx.createLinearGradient(0, 390, 0, 686);
  overlay.addColorStop(0, 'rgba(7,24,39,0)');
  overlay.addColorStop(1, 'rgba(7,24,39,.94)');
  ctx.fillStyle = overlay;
  ctx.fillRect(36, 350, W - 72, 336);
  ctx.restore();

  logo(ctx, logoImg, 68, 68, 72);
  ctx.fillStyle = COLORS.white;
  ctx.font = '800 18px Manrope';
  ctx.fillText('APC · 2027', 155, 100);

  ctx.fillStyle = COLORS.white;
  const candidateSize = fitText(ctx, 'DR. FAISAL SHUAIB', 880, 76, 48);
  ctx.font = `800 ${candidateSize}px Manrope`;
  ctx.fillText('DR. FAISAL SHUAIB', 68, 588);
  ctx.fillStyle = COLORS.gold;
  ctx.font = '800 18px Manrope';
  ctx.fillText('FOR NASARAWA WEST SENATORIAL DISTRICT', 68, 625);

  // Lower section is deliberately split into three clear zones:
  // supporter identity, campaign statement, and footer metadata.
  ctx.fillStyle = COLORS.navy;
  ctx.beginPath();
  ctx.roundRect(36, 720, W - 72, 594, 30);
  ctx.fill();

  // Supporter photo.
  const cx = 190;
  const cy = 885;
  const r = 118;
  ctx.beginPath();
  ctx.arc(cx, cy, r + 9, 0, Math.PI * 2);
  ctx.fillStyle = COLORS.gold;
  ctx.fill();
  if (supporter) roundedImage(ctx, supporter, cx, cy, r, zoom);
  else photoPlaceholder(ctx, cx, cy, r);

  // Supporter details.
  const textX = 355;
  ctx.fillStyle = COLORS.gold;
  ctx.font = '800 14px Manrope';
  ctx.fillText('SUPPORTED BY', textX, 800);

  ctx.fillStyle = COLORS.white;
  ctx.font = `400 ${fitText(ctx, name || 'Your Name', 630, 46, 25, 'DM Serif Display')}px "DM Serif Display"`;
  wrap(ctx, name || 'Your Name', textX, 858, 630, 50, 2);

  ctx.fillStyle = COLORS.muted;
  ctx.font = '600 16px Manrope';
  ctx.fillText('Nasarawa West · APC Supporter', textX, 925);

  // The requested campaign statement is always prominent and never hidden.
  ctx.strokeStyle = 'rgba(255,255,255,.13)';
  ctx.beginPath();
  ctx.moveTo(72, 982);
  ctx.lineTo(1008, 982);
  ctx.stroke();

  ctx.fillStyle = COLORS.gold;
  ctx.font = '800 12px Manrope';
  ctx.fillText('CAMPAIGN MESSAGE', 72, 1022);

  ctx.fillStyle = COLORS.white;
  ctx.font = `400 ${fitText(ctx, campaignMessage, 900, 42, 24, 'DM Serif Display')}px "DM Serif Display"`;
  wrap(ctx, campaignMessage, 72, 1070, 900, 48, 2);

  // Bottom metadata keeps the poster balanced and readable.
  ctx.fillStyle = '#81929d';
  ctx.font = '700 16px Manrope';
  ctx.fillText(hashtag || '#FaisalForNasarawaWest', 72, 1268);
  ctx.textAlign = 'right';
  ctx.fillText('NASARAWA WEST · 2027', 1008, 1268);
  ctx.textAlign = 'left';
}
