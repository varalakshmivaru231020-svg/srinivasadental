-- Admin panel: admin users, login sessions, and editable service / clinic settings fields.

CREATE TABLE IF NOT EXISTS admin_users (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username       VARCHAR(60)  NOT NULL,
  password_hash  VARCHAR(255) NOT NULL,
  last_login_at  DATETIME NULL,
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_admin_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS admin_sessions (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  admin_id    INT UNSIGNED NOT NULL,
  token_hash  CHAR(64) NOT NULL,
  expires_at  DATETIME NOT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_session_token (token_hash),
  KEY idx_session_expiry (expires_at),
  CONSTRAINT fk_session_admin FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Services: fields the admin can manage
ALTER TABLE services
  ADD COLUMN tagline          VARCHAR(200) NULL AFTER slug,
  ADD COLUMN icon             VARCHAR(40)  NULL AFTER description,
  ADD COLUMN content          MEDIUMTEXT   NULL AFTER image,
  ADD COLUMN meta_title       VARCHAR(200) NULL AFTER content,
  ADD COLUMN meta_description VARCHAR(300) NULL AFTER meta_title,
  ADD COLUMN show_on_home     TINYINT(1)   NOT NULL DEFAULT 0 AFTER is_active;

UPDATE services SET icon = CASE slug
    WHEN 'dental-implants-btm-bangalore'        THEN 'Anchor'
    WHEN 'root-canal-treatment-btm-bangalore'   THEN 'Activity'
    WHEN 'orthodontic-treatment-btm-bangalore'  THEN 'AlignCenterHorizontal'
    WHEN 'clear-aligners-btm-bangalore'         THEN 'Smile'
    WHEN 'smile-design-btm-bangalore'           THEN 'Sparkles'
    WHEN 'teeth-whitening-btm-bangalore'        THEN 'Sun'
    WHEN 'dental-crowns-bridges-btm-bangalore'  THEN 'Crown'
    WHEN 'dentures-rpd-treatment-btm-bangalore' THEN 'Smile'
    WHEN 'paediatric-dentist-btm-bangalore'     THEN 'Baby'
    WHEN 'teeth-cleaning-scaling'               THEN 'Droplets'
    WHEN 'wisdom-tooth-extraction'              THEN 'Scissors'
    WHEN 'full-mouth-rehabilitation'            THEN 'RefreshCw'
    WHEN 'laser-dentistry'                      THEN 'Zap'
    ELSE 'Smile' END
WHERE icon IS NULL;

UPDATE services SET tagline = CASE slug
    WHEN 'dental-implants-btm-bangalore'        THEN 'Restore Your Smile. Regain Your Confidence.'
    WHEN 'root-canal-treatment-btm-bangalore'   THEN 'Save Your Natural Tooth. Restore Your Smile.'
    WHEN 'orthodontic-treatment-btm-bangalore'  THEN 'Straighten Your Teeth. Improve Your Smile.'
    WHEN 'clear-aligners-btm-bangalore'         THEN 'Straighten Your Teeth. Perfect Your Smile. Confidently.'
    WHEN 'smile-design-btm-bangalore'           THEN 'Design Your Dream Smile. Reveal Your Confidence.'
    WHEN 'teeth-whitening-btm-bangalore'        THEN 'Brighten Your Smile. Boost Your Confidence.'
    WHEN 'dental-crowns-bridges-btm-bangalore'  THEN 'Restore Damaged Teeth. Replace Missing Teeth. Bring Back Your Smile.'
    WHEN 'dentures-rpd-treatment-btm-bangalore' THEN 'Restore Your Smile. Eat Comfortably. Smile Confidently.'
    WHEN 'paediatric-dentist-btm-bangalore'     THEN 'Gentle Dental Care for Happy Little Smiles.'
    ELSE NULL END
WHERE tagline IS NULL;

UPDATE services SET show_on_home = 1 WHERE sort_order BETWEEN 1 AND 8;

-- Clinic settings: structured contact details, hours, social links and logos
ALTER TABLE clinic_settings
  ADD COLUMN tagline               VARCHAR(200) NULL AFTER clinic_name,
  ADD COLUMN address_line1         VARCHAR(150) NULL AFTER address,
  ADD COLUMN address_line2         VARCHAR(150) NULL AFTER address_line1,
  ADD COLUMN city                  VARCHAR(80)  NULL AFTER address_line2,
  ADD COLUMN pincode               VARCHAR(10)  NULL AFTER city,
  ADD COLUMN phone_primary         VARCHAR(20)  NULL AFTER pincode,
  ADD COLUMN phone_secondary       VARCHAR(20)  NULL AFTER phone_primary,
  ADD COLUMN opening_hours         TEXT         NULL AFTER email,
  ADD COLUMN google_maps_embed_url VARCHAR(600) NULL AFTER google_maps_url,
  ADD COLUMN facebook_url          VARCHAR(255) NULL AFTER whatsapp_number,
  ADD COLUMN instagram_url         VARCHAR(255) NULL AFTER facebook_url,
  ADD COLUMN google_reviews_url    VARCHAR(255) NULL AFTER instagram_url,
  ADD COLUMN logo_url              VARCHAR(255) NULL AFTER google_reviews_url,
  ADD COLUMN logo_banner_url       VARCHAR(255) NULL AFTER logo_url;

UPDATE clinic_settings SET
  tagline         = COALESCE(tagline, '25+ Years of Transforming Smiles. Restoring Confidence.'),
  address_line1   = COALESCE(address_line1, 'No. 383, 7th Cross, 8th Main'),
  address_line2   = COALESCE(address_line2, 'Mico Layout, BTM 2nd Stage'),
  city            = COALESCE(city, 'Bengaluru'),
  pincode         = COALESCE(pincode, '560076'),
  phone_primary   = COALESCE(phone_primary, '9611146955'),
  phone_secondary = COALESCE(phone_secondary, '9845195605'),
  google_maps_embed_url = COALESCE(google_maps_embed_url,
    'https://www.google.com/maps?q=Srinivasa+Dental+Care,+7th+Cross,+8th+Main,+Mico+Layout,+BTM+2nd+Stage,+Bengaluru+560076&output=embed')
WHERE id = 1;

-- Replaced by phone_primary / phone_secondary and opening_hours (JSON list of {days, time})
ALTER TABLE clinic_settings
  DROP COLUMN phone,
  DROP COLUMN working_hours;
