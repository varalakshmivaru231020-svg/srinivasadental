const Gallery = require('../models/galleryModel');

const pick = (b) => ({
  image: b.image,
  thumb: b.thumb,
  alt: b.alt,
  caption: b.caption,
  category: b.category,
  sort_order: b.sort_order,
  is_active: b.is_active,
});

const notFound = (res) => res.status(404).json({ success: false, message: 'Photo not found.' });

const duplicate = (res) => res.status(409).json({
  success: false,
  message: 'This photo is already in the gallery.',
  errors: [{ path: 'image', msg: 'This photo is already in the gallery.' }],
});

exports.list = async (req, res, next) => {
  try {
    res.json({ success: true, data: await Gallery.findAll() });
  } catch (err) {
    next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const row = await Gallery.findById(req.params.id);
    if (!row) return notFound(res);
    return res.json({ success: true, data: row });
  } catch (err) {
    return next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const row = await Gallery.create(pick(req.body));
    return res.status(201).json({ success: true, data: row, message: 'Photo added.' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return duplicate(res);
    return next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const current = await Gallery.findById(req.params.id);
    if (!current) return notFound(res);
    const data = pick(req.body);
    // A replaced photo sent without its own thumbnail must not keep showing the old photo's thumbnail.
    if (data.image && data.image !== current.image && data.thumb === undefined) data.thumb = null;
    const row = await Gallery.update(req.params.id, data);
    return res.json({ success: true, data: row, message: 'Photo saved.' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return duplicate(res);
    return next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const ok = await Gallery.remove(req.params.id);
    if (!ok) return notFound(res);
    return res.json({ success: true, message: 'Photo deleted.' });
  } catch (err) {
    return next(err);
  }
};
