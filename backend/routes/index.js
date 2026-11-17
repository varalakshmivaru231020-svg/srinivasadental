const router = require('express').Router();
const appointments = require('../controllers/appointmentController');
const info = require('../controllers/infoController');
const { appointmentRules } = require('../validators/appointmentValidator');
const validate = require('../middleware/validate');
const { appointmentLimiter } = require('../middleware/rateLimiters');

router.get('/health', info.health);
router.get('/site', info.site);
router.get('/services', info.services);
router.get('/contact', info.contact);
router.post('/appointments', appointmentLimiter, appointmentRules, validate, appointments.create);

module.exports = router;
