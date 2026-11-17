-- Banner photos (and, for some pages, the banner title) at the top of each page, managed in the admin panel → Banners.
-- One row per page that the clinic has changed. No row means the page shows its built-in banner
-- (frontend/src/data/banners.js), so nothing is seeded here. NULL image / title also means "use the built-in one".
-- page_key: home, about, services, service-detail, doctor-detail, contact, gallery, best-dentist.
CREATE TABLE IF NOT EXISTS page_banners (
  page_key    VARCHAR(40)  NOT NULL PRIMARY KEY,
  image       VARCHAR(255) NULL,
  title       VARCHAR(120) NULL,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
