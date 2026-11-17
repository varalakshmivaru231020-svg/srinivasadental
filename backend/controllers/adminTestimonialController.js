const Testimonial = require('../models/testimonialModel');

const pick = (b) => ({
  patient_name: b.patient_name,
  review_text: b.review_text,
  rating: b.rating,
  treatment: b.treatment,
  source: b.source,
  is_active: b.is_active,
  sort_order: b.sort_order,
});

exports.list = async (req, res, next) => {
  try {
    res.json({ success: true, data: await Testimonial.findAll() });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const row = await Testimonial.create(pick(req.body));
    res.status(201).json({ success: true, data: row, message: 'Testimonial added.' });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    if (!(await Testimonial.findById(req.params.id))) {
      return res.status(404).json({ success: false, message: 'Testimonial not found.' });
    }
    const row = await Testimonial.update(req.params.id, pick(req.body));
    return res.json({ success: true, data: row, message: 'Testimonial saved.' });
  } catch (err) {
    return next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const ok = await Testimonial.remove(req.params.id);
    if (!ok) return res.status(404).json({ success: false, message: 'Testimonial not found.' });
    return res.json({ success: true, message: 'Testimonial deleted.' });
  } catch (err) {
    return next(err);
  }
};
