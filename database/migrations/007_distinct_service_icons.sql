-- Give dentures its own icon (it shared the "Smile" icon with clear aligners). Only changes untouched defaults.
UPDATE services SET icon = 'SmilePlus' WHERE slug = 'dentures-rpd-treatment-btm-bangalore' AND icon = 'Smile';
