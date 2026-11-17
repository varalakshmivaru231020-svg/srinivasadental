const Doctor = require('../models/doctorModel');

const slugify = (s) => String(s).toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '')
  .trim().replace(/[\s_]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 120);

const pick = (b) => ({
  name: b.name,
  title: b.title,
  qualification: b.qualification,
  experience: b.experience,
  headline: b.headline,
  photo: b.photo,
  bio: b.bio,
  profile: b.profile,
  sort_order: b.sort_order,
  is_active: b.is_active,
});

const notFound = (res) => res.status(404).json({ success: false, message: 'Doctor not found.' });

exports.list = async (req, res, next) => {
  try {
    res.json({ success: true, data: await Doctor.findAll() });
  } catch (err) {
    next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const row = await Doctor.findById(req.params.id);
    if (!row) return notFound(res);
    return res.json({ success: true, data: row });
  } catch (err) {
    return next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const slug = req.body.slug || slugify(req.body.name);
    if (!slug) {
      return res.status(422).json({ success: false, message: 'Please enter a web address.', errors: [{ path: 'slug', msg: 'Required.' }] });
    }
    const row = await Doctor.create({ slug, ...pick(req.body) });
    return res.status(201).json({ success: true, data: row, message: 'Doctor added.' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'Another doctor already uses this web address. Choose a different one.',
        errors: [{ path: 'slug', msg: 'This web address is already in use.' }],
      });
    }
    return next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    if (!(await Doctor.findById(req.params.id))) return notFound(res);
    const row = await Doctor.update(req.params.id, pick(req.body));
    return res.json({ success: true, data: row, message: 'Doctor saved.' });
  } catch (err) {
    return next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const ok = await Doctor.remove(req.params.id);
    if (!ok) return notFound(res);
    return res.json({ success: true, message: 'Doctor deleted.' });
  } catch (err) {
    return next(err);
  }
};
