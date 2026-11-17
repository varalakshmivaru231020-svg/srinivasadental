const Service = require('../models/serviceModel');

const slugify = (s) => String(s).toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '')
  .trim().replace(/[\s_]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 120);

const pickFields = (b) => ({
  service_name: b.service_name,
  tagline: b.tagline,
  description: b.description,
  icon: b.icon,
  image: b.image,
  content: b.content,
  meta_title: b.meta_title,
  meta_description: b.meta_description,
  sort_order: b.sort_order,
  is_active: b.is_active,
  show_on_home: b.show_on_home,
});

const duplicate = (res) => res.status(409).json({
  success: false,
  message: 'Another service already uses this web address. Choose a different one.',
  errors: [{ path: 'slug', msg: 'This web address is already in use.' }],
});

exports.list = async (req, res, next) => {
  try {
    res.json({ success: true, data: await Service.findAll() });
  } catch (err) {
    next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const row = await Service.findById(req.params.id);
    if (!row) return res.status(404).json({ success: false, message: 'Service not found.' });
    return res.json({ success: true, data: row });
  } catch (err) {
    return next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const slug = req.body.slug || slugify(req.body.service_name);
    if (!slug) {
      return res.status(422).json({ success: false, message: 'Please enter a web address.', errors: [{ path: 'slug', msg: 'Required.' }] });
    }
    const row = await Service.create({ slug, ...pickFields(req.body) });
    return res.status(201).json({ success: true, data: row, message: 'Service added.' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return duplicate(res);
    return next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    if (!(await Service.findById(req.params.id))) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }
    const row = await Service.update(req.params.id, pickFields(req.body));
    return res.json({ success: true, data: row, message: 'Service saved.' });
  } catch (err) {
    return next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const ok = await Service.remove(req.params.id);
    if (!ok) return res.status(404).json({ success: false, message: 'Service not found.' });
    return res.json({ success: true, message: 'Service deleted.' });
  } catch (err) {
    return next(err);
  }
};
