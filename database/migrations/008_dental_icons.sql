-- Switch services to the new dental-specific icons. Only rows still using the previous default icon change,
-- so any icon chosen in the admin panel is kept.
UPDATE services SET icon = 'ToothImplant' WHERE slug = 'dental-implants-btm-bangalore' AND icon = 'Anchor';
UPDATE services SET icon = 'ToothRoot'    WHERE slug = 'root-canal-treatment-btm-bangalore' AND icon = 'Activity';
UPDATE services SET icon = 'ToothBraces'  WHERE slug = 'orthodontic-treatment-btm-bangalore' AND icon = 'AlignCenterHorizontal';
UPDATE services SET icon = 'ToothAligner' WHERE slug = 'clear-aligners-btm-bangalore' AND icon = 'Smile';
UPDATE services SET icon = 'Smile'        WHERE slug = 'smile-design-btm-bangalore' AND icon = 'Sparkles';
UPDATE services SET icon = 'ToothSparkle' WHERE slug = 'teeth-whitening-btm-bangalore' AND icon = 'Sun';
UPDATE services SET icon = 'ToothCrown'   WHERE slug = 'dental-crowns-bridges-btm-bangalore' AND icon = 'Crown';
UPDATE services SET icon = 'Tooth'        WHERE slug = 'wisdom-tooth-extraction' AND icon = 'Scissors';
UPDATE services SET icon = 'ToothShield'  WHERE slug = 'teeth-cleaning-scaling' AND icon = 'Droplets';
