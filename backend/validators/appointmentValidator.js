const { body } = require('express-validator');

const TIME_SLOTS = ['Morning (10 AM – 2 PM)', 'Evening (5 PM – 9 PM)'];

const todayIST = () => new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().slice(0, 10);

const appointmentRules = [
  body('full_name')
    .trim().notEmpty().withMessage('Full name is required.')
    .isLength({ min: 2, max: 120 }).withMessage('Name must be 2–120 characters.')
    .matches(/^[A-Za-z.\s'-]+$/).withMessage('Name contains invalid characters.'),
  body('phone')
    .trim().notEmpty().withMessage('Phone number is required.')
    .customSanitizer((v) => String(v).replace(/[\s-]/g, '').replace(/^(\+91|91|0)/, ''))
    .matches(/^[6-9]\d{9}$/).withMessage('Enter a valid 10-digit mobile number.'),
  body('email')
    .optional({ values: 'falsy' })
    .trim().isEmail().withMessage('Enter a valid email address.')
    .isLength({ max: 160 }),
  body('service')
    .trim().notEmpty().withMessage('Please select a dental service.')
    .matches(/^[a-z0-9-]{2,120}$/).withMessage('Invalid service selected.'),
  body('preferred_date')
    .notEmpty().withMessage('Preferred date is required.')
    .isISO8601({ strict: true }).withMessage('Invalid date.')
    .custom((v) => {
      if (v.slice(0, 10) < todayIST()) throw new Error('Date cannot be in the past.');
      return true;
    }),
  body('preferred_time')
    .notEmpty().withMessage('Preferred time is required.')
    .isIn(TIME_SLOTS).withMessage('Invalid time slot.'),
  body('message')
    .optional({ values: 'falsy' })
    .trim().isLength({ max: 1000 }).withMessage('Message must be under 1000 characters.'),
  // Data is stored with parameterised queries; escape on output in any admin UI.
];

module.exports = { appointmentRules, TIME_SLOTS };
