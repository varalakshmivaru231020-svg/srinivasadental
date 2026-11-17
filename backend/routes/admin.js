const router = require('express').Router();
const auth = require('../controllers/adminAuthController');
const services = require('../controllers/adminServiceController');
const settings = require('../controllers/adminSettingsController');
const appointments = require('../controllers/adminAppointmentController');
const testimonials = require('../controllers/adminTestimonialController');
const doctors = require('../controllers/adminDoctorController');
const gallery = require('../controllers/adminGalleryController');
const banners = require('../controllers/adminBannerController');
const validate = require('../middleware/validate');
const { requireAdmin, requireAdminHeader } = require('../middleware/adminAuth');
const { loginLimiter } = require('../middleware/rateLimiters');
const { uploadImage } = require('../middleware/upload');
const v = require('../validators/adminValidators');

// Admin responses are private and must never be cached.
router.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});
router.use(requireAdminHeader);

router.post('/login', loginLimiter, v.loginRules, validate, auth.login);

// Everything below requires a logged-in admin
router.use(requireAdmin);

router.post('/logout', auth.logout);
router.get('/me', auth.me);
router.put('/password', v.passwordRules, validate, auth.changePassword);

router.get('/dashboard', appointments.dashboard);

router.get('/appointments', v.appointmentListRules, validate, appointments.list);
router.patch('/appointments/:id', v.appointmentStatusRules, validate, appointments.updateStatus);
router.delete('/appointments/:id', v.idParam, validate, appointments.remove);

router.get('/services', services.list);
router.post('/services', v.serviceRules(true), validate, services.create);
router.get('/services/:id', v.idParam, validate, services.get);
router.put('/services/:id', v.idParam, v.serviceRules(false), validate, services.update);
router.delete('/services/:id', v.idParam, validate, services.remove);

router.get('/testimonials', testimonials.list);
router.post('/testimonials', v.testimonialRules, validate, testimonials.create);
router.put('/testimonials/:id', v.idParam, v.testimonialRules, validate, testimonials.update);
router.delete('/testimonials/:id', v.idParam, validate, testimonials.remove);

router.get('/doctors', doctors.list);
router.post('/doctors', v.doctorRules(true), validate, doctors.create);
router.get('/doctors/:id', v.idParam, validate, doctors.get);
router.put('/doctors/:id', v.idParam, v.doctorRules(false), validate, doctors.update);
router.delete('/doctors/:id', v.idParam, validate, doctors.remove);

router.get('/gallery', gallery.list);
router.post('/gallery', v.galleryRules(true), validate, gallery.create);
router.get('/gallery/:id', v.idParam, validate, gallery.get);
router.put('/gallery/:id', v.idParam, v.galleryRules(false), validate, gallery.update);
router.delete('/gallery/:id', v.idParam, validate, gallery.remove);

router.get('/banners', banners.list);
router.put('/banners/:key', banners.knownKey, v.bannerRules, validate, banners.update);
router.delete('/banners/:key', banners.knownKey, banners.reset);

router.get('/settings', settings.get);
router.put('/settings', v.settingsRules, validate, settings.update);

router.post('/upload', uploadImage);

module.exports = router;
