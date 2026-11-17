const Appointment = require('../models/appointmentModel');
const Service = require('../models/serviceModel');
const Testimonial = require('../models/testimonialModel');

exports.dashboard = async (req, res, next) => {
  try {
    const [appointments, services, recent, testimonials] = await Promise.all([
      Appointment.stats(),
      Service.counts(),
      Appointment.list({ page: 1, limit: 6 }),
      Testimonial.countActive(),
    ]);
    res.json({ success: true, data: { appointments, services, recent: recent.rows, testimonials } });
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const result = await Appointment.list({
      status: req.query.status,
      q: req.query.q,
      page: req.query.page || 1,
      limit: 20,
    });
    res.json({ success: true, data: result.rows, total: result.total, page: result.page, limit: result.limit });
  } catch (err) {
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const ok = await Appointment.updateStatus(req.params.id, req.body.status);
    if (!ok) return res.status(404).json({ success: false, message: 'Appointment not found.' });
    return res.json({ success: true, message: 'Status updated.' });
  } catch (err) {
    return next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const ok = await Appointment.remove(req.params.id);
    if (!ok) return res.status(404).json({ success: false, message: 'Appointment not found.' });
    return res.json({ success: true, message: 'Appointment deleted.' });
  } catch (err) {
    return next(err);
  }
};
