CREATE TABLE IF NOT EXISTS clinic_settings (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  clinic_name      VARCHAR(150) NOT NULL,
  address          VARCHAR(255) NOT NULL,
  phone            VARCHAR(60)  NOT NULL,
  landline         VARCHAR(30)  NULL,
  email            VARCHAR(160) NULL,
  working_hours    VARCHAR(255) NULL,
  google_maps_url  VARCHAR(500) NULL,
  whatsapp_number  VARCHAR(20)  NULL,
  updated_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
