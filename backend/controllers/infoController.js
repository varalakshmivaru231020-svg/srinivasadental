const Service = require('../models/serviceModel');
const Settings = require('../models/settingsModel');
const Testimonial = require('../models/testimonialModel');
const Doctor = require('../models/doctorModel');
const Gallery = require('../models/galleryModel');
const Banner = require('../models/bannerModel');
const { checkConnection } = require('../config/db');

exports.services = async (req, res, next) => {
  try {
    res.json({ success: true, data: await Service.findActive() });
  } catch (err) {
    next(err);
  }
};

exports.contact = async (req, res, next) => {
  try {
    const data = await Settings.get();
    if (!data) return res.status(404).json({ success: false, message: 'Clinic settings not configured.' });
    return res.json({ success: true, data });
  } catch (err) {
    return next(err);
  }
};

/** Page banners the clinic has changed, as { page_key: { image, title } }, or null if the table does not exist yet. */
const bannerMap = (rows) => (rows ? Object.fromEntries(rows.map((r) => [r.page_key, { image: r.image, title: r.title }])) : null);

/**
 * Everything the public website needs in one request: clinic settings, services, testimonials, the team,
 * the gallery and the page banners.
 */
exports.site = async (req, res, next) => {
  try {
    const [settings, services, testimonials, doctors, gallery, banners] = await Promise.all([
      Settings.get(), Service.findActive(), Testimonial.findActive(), Doctor.findActive(), Gallery.findActive(), Banner.findAll(),
    ]);
    res.set('Cache-Control', 'no-cache');
    res.json({ success: true, data: { settings, services, testimonials, doctors, gallery, banners: bannerMap(banners) } });
  } catch (err) {
    next(err);
  }
};

exports.health = async (req, res) => {
  let database = 'up';
  try {
    await checkConnection();
  } catch {
    database = 'down';
  }
  res.status(database === 'up' ? 200 : 503).json({ status: database === 'up' ? 'ok' : 'degraded', database, time: new Date().toISOString() });
};
