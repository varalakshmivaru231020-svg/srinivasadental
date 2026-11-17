-- Patient testimonials, entered by the clinic from verified reviews (never invented).
CREATE TABLE IF NOT EXISTS testimonials (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  patient_name  VARCHAR(100) NOT NULL,
  review_text   TEXT NOT NULL,
  rating        TINYINT UNSIGNED NULL,
  treatment     VARCHAR(120) NULL,
  source        VARCHAR(60)  NULL,
  is_active     TINYINT(1) NOT NULL DEFAULT 1,
  sort_order    SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_testimonials_active (is_active, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
