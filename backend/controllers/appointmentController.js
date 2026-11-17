const { createAppointment } = require('../services/appointmentService');

exports.create = async (req, res, next) => {
  try {
    const { id, duplicate } = await createAppointment(req.body);
    if (duplicate) {
      return res.status(200).json({
        success: true,
        id,
        duplicate: true,
        message: 'We already received this request a few minutes ago — there is no need to send it again. Our team will call you to confirm.',
      });
    }
    return res.status(201).json({
      success: true,
      id,
      message: 'Thank you! Your appointment request has been received. Our team will call you to confirm — requests are subject to clinic confirmation.',
    });
  } catch (err) {
    return next(err);
  }
};
