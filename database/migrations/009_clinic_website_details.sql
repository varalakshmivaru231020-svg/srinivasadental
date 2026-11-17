-- Clinic details published on the clinic's own website (srinivasadentalcarecentre.com/contact-us).
-- Only empty fields are filled, so anything already entered in the admin panel is kept.
UPDATE clinic_settings SET
  email = COALESCE(NULLIF(email, ''), 'drvish003@gmail.com'),
  opening_hours = CASE
    WHEN opening_hours IS NULL OR opening_hours IN ('', '[]')
    THEN '[{"days":"Monday - Sunday","time":"10:00 AM - 2:00 PM, 5:00 PM - 9:00 PM"}]'
    ELSE opening_hours END,
  facebook_url = COALESCE(NULLIF(facebook_url, ''), 'https://www.facebook.com/Srinivasadentalcare'),
  google_reviews_url = COALESCE(NULLIF(google_reviews_url, ''), 'https://www.google.com/search?q=srinivasa+dental+care+centre#lrd=0x3bae14e30d173bc5:0xce0b510ccbcc0501,1,,,')
WHERE id = 1;
