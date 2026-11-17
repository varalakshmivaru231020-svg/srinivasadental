const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
const MAX_MB = 3;
const ALLOWED_MIME = ['image/png', 'image/jpeg', 'image/webp'];

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_MB * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => cb(null, ALLOWED_MIME.includes(file.mimetype)),
});

/** Detects the real image type from the file's first bytes (the browser-supplied type can be spoofed). */
function sniffImage(buf) {
  if (buf.length < 12) return null;
  if (buf[0] === 0x89 && buf.toString('ascii', 1, 4) === 'PNG') return 'png';
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpg';
  if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') return 'webp';
  return null;
}

async function saveImage(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Choose a PNG, JPG or WEBP image.' });
    }
    const ext = sniffImage(req.file.buffer);
    if (!ext) {
      return res.status(400).json({ success: false, message: 'That file is not a valid PNG, JPG or WEBP image.' });
    }
    const name = `${Date.now().toString(36)}-${crypto.randomBytes(6).toString('hex')}.${ext}`;
    await fs.promises.writeFile(path.join(UPLOAD_DIR, name), req.file.buffer);
    return res.status(201).json({ success: true, url: `/uploads/${name}` });
  } catch (err) {
    return next(err);
  }
}

module.exports = { uploadImage: [upload.single('file'), saveImage], UPLOAD_DIR, MAX_MB };
