-- Seed data taken from the clinic's website content documents.
INSERT INTO services (service_name, slug, description, sort_order) VALUES
 ('Dental Implants', 'dental-implants-btm-bangalore', 'Replace missing teeth with implant-supported tooth replacement solutions, where clinically suitable.', 1),
 ('Root Canal Treatment', 'root-canal-treatment-btm-bangalore', 'Treatment to address infection or damage inside a tooth and help preserve the natural tooth.', 2),
 ('Orthodontic Treatment', 'orthodontic-treatment-btm-bangalore', 'Correct crooked teeth, gaps and bite problems with suitable orthodontic treatment options.', 3),
 ('Clear Aligners', 'clear-aligners-btm-bangalore', 'Transparent removable trays that can help straighten teeth in selected cases.', 4),
 ('Smile Design', 'smile-design-btm-bangalore', 'Personalised cosmetic dental treatment planning to improve the appearance of your smile.', 5),
 ('Teeth Whitening', 'teeth-whitening-btm-bangalore', 'Professional treatment options to improve the appearance of stained or discoloured teeth.', 6),
 ('Crowns and Bridges', 'dental-crowns-bridges-btm-bangalore', 'Restore damaged teeth and replace missing teeth using suitable dental restorations.', 7),
 ('Dentures and RPD', 'dentures-rpd-treatment-btm-bangalore', 'Removable tooth replacement solutions for patients missing some or all of their natural teeth.', 8),
 ('Paediatric Dentistry', 'paediatric-dentist-btm-bangalore', 'Dental care focused on children''s oral health, prevention and treatment of dental problems.', 9),
 ('Teeth Cleaning and Scaling', 'teeth-cleaning-scaling', 'Professional cleaning to remove plaque and hardened deposits and support healthy gums.', 10),
 ('Wisdom Tooth Extraction', 'wisdom-tooth-extraction', 'Evaluation and removal of wisdom teeth when clinically necessary.', 11),
 ('Full Mouth Rehabilitation', 'full-mouth-rehabilitation', 'A comprehensive treatment approach for patients with multiple dental problems.', 12),
 ('Laser Dentistry', 'laser-dentistry', 'Modern laser-assisted dental treatment options, where clinically appropriate.', 13)
ON DUPLICATE KEY UPDATE service_name = VALUES(service_name), description = VALUES(description), sort_order = VALUES(sort_order);

INSERT INTO clinic_settings (id, clinic_name, address, phone, landline, email, working_hours, google_maps_url, whatsapp_number)
VALUES (1, 'Srinivasa Dental Care',
  'No. 383, 7th Cross, 8th Main, Mico Layout, BTM 2nd Stage, Bengaluru – 560076',
  '9611146955, 9845195605', '080 41201345',
  NULL,   -- PLACEHOLDER: add verified email
  NULL,   -- PLACEHOLDER: add verified working hours
  'https://www.google.com/maps/search/?api=1&query=Srinivasa+Dental+Care+Mico+Layout+BTM+2nd+Stage+Bengaluru+560076',
  '919611146955')
ON DUPLICATE KEY UPDATE clinic_name = VALUES(clinic_name);
