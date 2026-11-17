CREATE TABLE IF NOT EXISTS appointments (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name       VARCHAR(120) NOT NULL,
  phone           VARCHAR(15)  NOT NULL,
  email           VARCHAR(160) NULL,
  service_id      INT UNSIGNED NULL,
  preferred_date  DATE NOT NULL,
  preferred_time  VARCHAR(40) NOT NULL,
  message         TEXT NULL,
  status          ENUM('pending','confirmed','completed','cancelled') NOT NULL DEFAULT 'pending',
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_appt_status (status),
  KEY idx_appt_date (preferred_date),
  KEY idx_appt_phone (phone),
  CONSTRAINT fk_appt_service FOREIGN KEY (service_id) REFERENCES services(id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
