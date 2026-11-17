/**
 * Redraws a photo in the browser as JPEG copies, so phone photos upload quickly and stay under the
 * 3 MB upload limit. Only the pixels are drawn, so the copies carry none of the original's EXIF data
 * (camera details, GPS location). Browsers apply the photo's EXIF rotation when they draw it.
 */
const QUALITY = 0.85;

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => (img.naturalWidth && img.naturalHeight ? resolve(img) : reject(new Error('Empty image.')));
    img.onerror = () => reject(new Error('Unreadable image.'));
    img.src = url;
  });
}

function draw(source, width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable.');
  ctx.fillStyle = '#fff'; // transparent parts of a PNG turn white, not black
  ctx.fillRect(0, 0, width, height);
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(source, 0, 0, width, height);
  return canvas;
}

/** Scales so the long side is at most `max` px, halving big photos in steps first (one big jump looks grainy). */
function fit(source, width, height, max) {
  const ratio = Math.min(1, max / Math.max(width, height));
  const w = Math.max(1, Math.round(width * ratio));
  const h = Math.max(1, Math.round(height * ratio));
  let step = source;
  let sw = width;
  let sh = height;
  while (sw / 2 > w) {
    sw = Math.round(sw / 2);
    sh = Math.round(sh / 2);
    step = draw(step, sw, sh);
  }
  return draw(step, w, h);
}

const toBlob = (canvas) => new Promise((resolve, reject) => {
  canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Could not save the image.'))), 'image/jpeg', QUALITY);
});

/**
 * Returns one JPEG File per size in `sizes` (long side in px, largest first), each drawn from the one before.
 * Rejects if the browser cannot open the file as an image.
 */
export async function toJpegs(file, sizes) {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const files = [];
    let source = img;
    let width = img.naturalWidth;
    let height = img.naturalHeight;
    for (const max of sizes) {
      const canvas = fit(source, width, height, max);
      const blob = await toBlob(canvas);
      files.push(new File([blob], `photo-${canvas.width}x${canvas.height}.jpg`, { type: 'image/jpeg' }));
      source = canvas;
      width = canvas.width;
      height = canvas.height;
    }
    return files;
  } finally {
    URL.revokeObjectURL(url);
  }
}
