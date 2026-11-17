const Appointment = require('../models/appointmentModel');
const Service = require('../models/serviceModel');

/** Normalises an Indian mobile number to its 10-digit form. */
const normalisePhone = (p) => String(p).replace(/[\s-]/g, '').replace(/^(\+91|91|0)/, '');

/**
 * Stores an appointment request. If the same phone number already sent the same request
 * (same date and service) in the last 30 minutes, the existing request is returned instead
 * of creating a duplicate.
 */
async function createAppointment(input) {
  const service_id = await Service.findIdBySlug(input.service); // null for "general-check-up"
  const phone = normalisePhone(input.phone);

  const existing = await Appointment.findRecentDuplicate({ phone, preferred_date: input.preferred_date, service_id });
  if (existing) return { id: existing, duplicate: true };

  const id = await Appointment.create({
    full_name: input.full_name.trim(),
    phone,
    email: input.email ? input.email.trim().toLowerCase() : null,
    service_id,
    preferred_date: input.preferred_date,
    preferred_time: input.preferred_time,
    message: input.message ? input.message.trim() : null,
  });
  return { id, duplicate: false };
}

module.exports = { createAppointment, normalisePhone };
