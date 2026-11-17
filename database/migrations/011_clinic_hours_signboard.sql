-- Consultation timings as shown on the clinic's signboard: Sunday is morning only.
-- Only replaces the earlier default from migration 009, so timings already changed in the admin panel are kept.
UPDATE clinic_settings
SET opening_hours = '[{"days":"Monday - Saturday","time":"10:00 AM - 2:00 PM, 5:00 PM - 9:00 PM"},{"days":"Sunday","time":"10:00 AM - 2:00 PM"}]'
WHERE opening_hours = '[{"days":"Monday - Sunday","time":"10:00 AM - 2:00 PM, 5:00 PM - 9:00 PM"}]';
