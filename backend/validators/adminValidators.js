const { body, param, query } = require('express-validator');
const { STATUSES } = require('../models/appointmentModel');

// Uploaded images (/uploads/xxx.png) or the built-in default logos.
const IMAGE_PATH = /^\/(uploads\/[a-z0-9-]+\.(png|jpg|webp)|logo-mark\.png|logo-banner\.png)$/;
const MOBILE = /^[6-9]\d{9}$/;
const toMobile = (v) => String(v).replace(/[\s-]/g, '').replace(/^(\+91|91|0)(?=\d{10}$)/, '');

const optionalText = (field, max) => body(field).optional({ values: 'null' }).isString().trim().isLength({ max })
  .withMessage(`Must be under ${max} characters.`);

const optionalUrl = (field, max = 255) => body(field)
  .optional({ values: 'falsy' })
  .trim()
  .isLength({ max }).withMessage(`Must be under ${max} characters.`)
  .isURL({ protocols: ['http', 'https'], require_protocol: true })
  .withMessage('Enter a full web address starting with https://');

const optionalBool = (field) => body(field).optional().isBoolean().withMessage('Invalid value.').toBoolean();

const idParam = param('id').isInt({ min: 1 }).withMessage('Invalid id.').toInt();

const loginRules = [
  body('username').isString().trim().notEmpty().withMessage('Enter your username.').isLength({ max: 60 }),
  body('password').isString().notEmpty().withMessage('Enter your password.').isLength({ max: 200 }),
];

const passwordRules = [
  body('current_password').isString().notEmpty().withMessage('Enter your current password.'),
  body('new_password')
    .isString()
    .isLength({ min: 8, max: 200 }).withMessage('New password must be at least 8 characters.')
    .custom((v, { req }) => v !== req.body.current_password).withMessage('New password must be different from the current one.'),
];

const serviceRules = (isCreate) => [
  body('service_name').isString().trim().notEmpty().withMessage('Service name is required.')
    .isLength({ min: 2, max: 120 }).withMessage('Service name must be 2–120 characters.'),
  ...(isCreate
    ? [body('slug').optional({ values: 'falsy' }).isString().trim().toLowerCase()
      .isLength({ max: 120 }).withMessage('Web address is too long.')
      .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).withMessage('Use lowercase letters, numbers and hyphens only.')]
    : []),
  body('description').isString().trim().notEmpty().withMessage('A short description is required.')
    .isLength({ max: 500 }).withMessage('Short description must be under 500 characters.'),
  optionalText('tagline', 200),
  body('icon').optional({ values: 'falsy' }).isString().trim().matches(/^[A-Za-z]{2,40}$/).withMessage('Invalid icon.'),
  body('image').optional({ values: 'falsy' }).isString().trim().matches(IMAGE_PATH).withMessage('Please upload the image again.'),
  body('content').optional({ values: 'null' }).isString().isLength({ max: 20000 }).withMessage('Page content must be under 20,000 characters.'),
  optionalText('meta_title', 200),
  optionalText('meta_description', 300),
  body('sort_order').optional({ values: 'null' }).isInt({ min: 0, max: 9999 }).withMessage('Display order must be a number between 0 and 9999.').toInt(),
  optionalBool('is_active'),
  optionalBool('show_on_home'),
];

const settingsRules = [
  body('clinic_name').isString().trim().notEmpty().withMessage('Clinic name is required.').isLength({ max: 150 }),
  optionalText('tagline', 200),
  body('address_line1').isString().trim().notEmpty().withMessage('Address line 1 is required.').isLength({ max: 150 }),
  optionalText('address_line2', 150),
  body('city').isString().trim().notEmpty().withMessage('City is required.').isLength({ max: 80 }),
  body('pincode').optional({ values: 'falsy' }).trim().matches(/^\d{6}$/).withMessage('Enter a 6-digit PIN code.'),
  body('phone_primary').isString().trim().notEmpty().withMessage('Main phone number is required.')
    .customSanitizer(toMobile).matches(MOBILE).withMessage('Enter a valid 10-digit mobile number.'),
  body('phone_secondary').optional({ values: 'falsy' }).isString().trim()
    .customSanitizer(toMobile).matches(MOBILE).withMessage('Enter a valid 10-digit mobile number.'),
  body('landline').optional({ values: 'falsy' }).isString().trim()
    .matches(/^[0-9+\s()-]{6,20}$/).withMessage('Enter a valid landline number.'),
  body('email').optional({ values: 'falsy' }).isString().trim().isEmail().withMessage('Enter a valid email address.')
    .isLength({ max: 160 }),
  body('whatsapp_number').optional({ values: 'falsy' }).isString()
    .customSanitizer((v) => String(v).replace(/[\s+-]/g, ''))
    .matches(/^(91)?[6-9]\d{9}$/).withMessage('Enter a valid 10-digit WhatsApp mobile number.')
    .customSanitizer((v) => (v.length === 10 ? `91${v}` : v)),
  optionalUrl('google_maps_url', 500),
  body('google_maps_embed_url').optional({ values: 'falsy' }).isString()
    // Accept the full <iframe ...> code that Google's "Embed a map" gives, and keep only its src.
    .customSanitizer((v) => (/<iframe/i.test(v) ? (v.match(/src="([^"]+)"/i) || [])[1] || '' : v.trim()))
    .isLength({ max: 600 }).withMessage('Map link is too long.')
    .matches(/^https:\/\/(www\.google\.[a-z.]+\/maps|maps\.google\.[a-z.]+\/)/)
    .withMessage('Paste a Google Maps embed link (https://www.google.com/maps/embed?...).'),
  optionalUrl('facebook_url'),
  optionalUrl('instagram_url'),
  optionalUrl('google_reviews_url'),
  body('logo_url').optional({ values: 'falsy' }).isString().matches(IMAGE_PATH).withMessage('Please upload the logo again.'),
  body('logo_banner_url').optional({ values: 'falsy' }).isString().matches(IMAGE_PATH).withMessage('Please upload the banner logo again.'),
  body('opening_hours').optional({ values: 'null' }).isArray({ max: 10 }).withMessage('Add at most 10 rows of timings.'),
  body('opening_hours.*.days').isString().trim().notEmpty().withMessage('Enter the day(s) for each timing row.')
    .isLength({ max: 60 }),
  body('opening_hours.*.time').isString().trim().notEmpty().withMessage('Enter the time for each timing row.')
    .isLength({ max: 60 }),
];

const testimonialRules = [
  body('patient_name').isString().trim().notEmpty().withMessage("Enter the patient's name (first name is fine).")
    .isLength({ max: 100 }).withMessage('Name must be under 100 characters.'),
  body('review_text').isString().trim().notEmpty().withMessage('Enter the review text.')
    .isLength({ min: 10, max: 1500 }).withMessage('Review must be 10–1500 characters.'),
  body('rating').optional({ values: 'falsy' }).isInt({ min: 1, max: 5 }).withMessage('Rating must be 1–5 stars.').toInt(),
  optionalText('treatment', 120),
  optionalText('source', 60),
  body('sort_order').optional({ values: 'null' }).isInt({ min: 0, max: 9999 }).withMessage('Display order must be 0–9999.').toInt(),
  optionalBool('is_active'),
];

// Doctor photos: an uploaded image, or one of the photos supplied with the website.
const DOCTOR_PHOTO = /^\/(uploads\/[a-z0-9-]+\.(png|jpg|webp)|photos\/doctors\/[a-z0-9-]+\.(png|jpg|webp))$/;

const doctorRules = (isCreate) => [
  body('name').isString().trim().notEmpty().withMessage("Enter the doctor's name.")
    .isLength({ min: 2, max: 120 }).withMessage('Name must be 2–120 characters.'),
  ...(isCreate
    ? [body('slug').optional({ values: 'falsy' }).isString().trim().toLowerCase()
      .isLength({ max: 120 }).withMessage('Web address is too long.')
      .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).withMessage('Use lowercase letters, numbers and hyphens only.')]
    : []),
  optionalText('title', 80),
  optionalText('qualification', 200),
  optionalText('experience', 160),
  optionalText('headline', 200),
  body('photo').optional({ values: 'falsy' }).isString().trim().matches(DOCTOR_PHOTO).withMessage('Please upload the photo again.'),
  body('bio').optional({ values: 'null' }).isString().isLength({ max: 6000 }).withMessage('About text must be under 6,000 characters.'),
  body('profile').optional({ values: 'null' }).isString().isLength({ max: 8000 }).withMessage('Profile details must be under 8,000 characters.'),
  body('sort_order').optional({ values: 'null' }).isInt({ min: 0, max: 9999 }).withMessage('Display order must be 0–9999.').toInt(),
  optionalBool('is_active'),
];

// Gallery photos: an uploaded image, or one of the photos supplied with the website.
const GALLERY_IMAGE = /^\/(uploads\/[a-z0-9-]+\.(png|jpg|webp)|photos\/gallery\/(thumb\/)?[a-z0-9-]+\.(png|jpg|jpeg|webp))$/;
const GALLERY_CATEGORIES = ['smiles', 'clinic'];

const galleryRules = (isCreate) => [
  isCreate
    ? body('image').isString().trim().notEmpty().withMessage('Choose a photo to upload.')
      .matches(GALLERY_IMAGE).withMessage('Please upload the photo again.')
    : body('image').optional().isString().trim().matches(GALLERY_IMAGE).withMessage('Please upload the photo again.'),
  body('thumb').optional({ values: 'falsy' }).isString().trim().matches(GALLERY_IMAGE).withMessage('Please upload the photo again.'),
  body('alt').isString().trim().notEmpty().withMessage('Describe the photo in a few words.')
    .isLength({ min: 3, max: 200 }).withMessage('Description must be 3–200 characters.'),
  optionalText('caption', 80),
  body('category').isIn(GALLERY_CATEGORIES).withMessage('Choose a category.'),
  body('sort_order').optional({ values: 'null' }).isInt({ min: 0, max: 9999 }).withMessage('Display order must be 0–9999.').toInt(),
  optionalBool('is_active'),
];

// Page banners: an uploaded image, or one of the photos supplied with the website. No ".." anywhere in the path.
const BANNER_IMAGE = /^\/(uploads\/[a-z0-9-]+|photos\/(?:[\w-][\w.-]*\/)*[\w-][\w.-]*)\.(png|jpg|jpeg|webp)$/i;
const BANNER_TITLE_KEYS = ['contact', 'gallery'];
const isBlank = (v) => v === undefined || v === null || v === '';

// Custom checks (not isString etc.), because the standard checks accept an array whose items pass.
const bannerRules = [
  body('image').custom((v) => {
    if (isBlank(v)) return true;
    if (typeof v !== 'string') throw new Error('Please upload the photo again.');
    const path = v.trim();
    if (path.length > 255 || path.includes('..') || !BANNER_IMAGE.test(path)) throw new Error('Please upload the photo again.');
    return true;
  }),
  body('title').custom((v, { req }) => {
    if (isBlank(v)) return true;
    if (typeof v !== 'string') throw new Error('Invalid title.');
    if (!BANNER_TITLE_KEYS.includes(req.params.key) && v.trim()) throw new Error("This banner's title cannot be changed.");
    if (v.trim().length > 120) throw new Error('Title must be under 120 characters.');
    return true;
  }),
];

const appointmentListRules = [
  query('status').optional({ values: 'falsy' }).isIn(STATUSES).withMessage('Invalid status.'),
  query('q').optional({ values: 'falsy' }).isString().trim().isLength({ max: 80 }),
  query('page').optional({ values: 'falsy' }).isInt({ min: 1, max: 100000 }).toInt(),
];

const appointmentStatusRules = [
  idParam,
  body('status').isIn(STATUSES).withMessage('Invalid status.'),
];

module.exports = {
  loginRules, passwordRules, serviceRules, settingsRules, testimonialRules, doctorRules, galleryRules, bannerRules,
  appointmentListRules, appointmentStatusRules, idParam,
};
