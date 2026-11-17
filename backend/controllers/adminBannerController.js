const Banner = require('../models/bannerModel');

const missingTable = (res) => res.status(503).json({
  success: false,
  message: 'Banners are not set up in the database yet. Run the database update (npm run migrate) and try again.',
});

/** Only the known pages have a banner; anything else is a 404. Runs before the body is validated. */
exports.knownKey = (req, res, next) => {
  if (!Banner.KEYS.includes(req.params.key)) return res.status(404).json({ success: false, message: 'Banner not found.' });
  return next();
};

exports.list = async (req, res, next) => {
  try {
    const rows = await Banner.findAll();
    if (!rows) return missingTable(res);
    return res.json({ success: true, data: rows });
  } catch (err) {
    return next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { key } = req.params;
    const image = typeof req.body.image === 'string' ? req.body.image.trim() : null;
    const title = Banner.TITLE_KEYS.includes(key) && typeof req.body.title === 'string' ? req.body.title.trim() : null;
    const row = await Banner.upsert(key, { image, title });
    return res.json({ success: true, data: row, message: 'Banner saved. The website has been updated.' });
  } catch (err) {
    if (err.code === 'ER_NO_SUCH_TABLE') return missingTable(res);
    return next(err);
  }
};

exports.reset = async (req, res, next) => {
  try {
    await Banner.reset(req.params.key);
    return res.json({ success: true, message: 'The built-in banner is shown again.' });
  } catch (err) {
    if (err.code === 'ER_NO_SUCH_TABLE') return missingTable(res);
    return next(err);
  }
};
