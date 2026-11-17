const Settings = require('../models/settingsModel');

exports.get = async (req, res, next) => {
  try {
    res.json({ success: true, data: await Settings.get() });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const data = await Settings.update(req.body);
    res.json({ success: true, data, message: 'Clinic details saved. The website now shows the new details.' });
  } catch (err) {
    next(err);
  }
};
