-- Photos on the Gallery page, managed in the admin panel → Gallery.
-- Seeded with the photos already on the website: the five patient smile photos (before and after
-- treatment) first, then the clinic photos, in the order of frontend/src/data/gallery.js, which keeps
-- the same list as an offline copy. Categories: 'smiles' (Smile Results) and 'clinic' (Our Clinic).
CREATE TABLE IF NOT EXISTS gallery_photos (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  image       VARCHAR(255) NOT NULL,
  thumb       VARCHAR(255) NULL,
  alt         VARCHAR(200) NOT NULL,
  caption     VARCHAR(80)  NULL,
  category    VARCHAR(20)  NOT NULL DEFAULT 'clinic',
  is_active   TINYINT(1) NOT NULL DEFAULT 1,
  sort_order  SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_gallery_photos_image (image),
  KEY idx_gallery_photos_active (is_active, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- INSERT IGNORE: a photo already in the gallery (same image) is left exactly as the clinic edited it.
INSERT IGNORE INTO gallery_photos (image, thumb, alt, caption, category, sort_order) VALUES
  ('/photos/gallery/smile-case-1-before.jpg', '/photos/gallery/thumb/smile-case-1-before.jpg', 'Smile with gaps between the front teeth, before treatment', 'Before', 'smiles', 1),
  ('/photos/gallery/smile-case-1-after.jpg', '/photos/gallery/thumb/smile-case-1-after.jpg', 'The same smile after treatment, with the gaps closed', 'After', 'smiles', 2),
  ('/photos/gallery/smile-case-2-before.jpg', '/photos/gallery/thumb/smile-case-2-before.jpg', 'Broken and discoloured front teeth, before treatment', 'Before', 'smiles', 3),
  ('/photos/gallery/smile-case-2-after.jpg', '/photos/gallery/thumb/smile-case-2-after.jpg', 'The same patient smiling after treatment', 'After', 'smiles', 4),
  ('/photos/gallery/smile-case-2-after-2.jpg', '/photos/gallery/thumb/smile-case-2-after-2.jpg', 'The same patient after treatment, smiling with restored front teeth', 'After', 'smiles', 5),
  ('/photos/gallery/clinic-front.jpg', '/photos/gallery/thumb/clinic-front.jpg', 'Entrance of Srinivasa Dental Care with the clinic signboard', NULL, 'clinic', 6),
  ('/photos/gallery/dr-vishwas-desk.jpg', '/photos/gallery/thumb/dr-vishwas-desk.jpg', 'Dr. S. Vishwas at the consultation desk', NULL, 'clinic', 7),
  ('/photos/gallery/dental-chair.jpg', '/photos/gallery/thumb/dental-chair.jpg', 'Treatment room with a brown dental chair and instrument tray', NULL, 'clinic', 8),
  ('/photos/gallery/opg.jpg', '/photos/gallery/thumb/opg.jpg', 'OPG (panoramic X-ray) machine', NULL, 'clinic', 9),
  ('/photos/gallery/intraoral-scanner.jpg', '/photos/gallery/thumb/intraoral-scanner.jpg', 'Intraoral scanner with a 3D scan of teeth on a laptop', NULL, 'clinic', 10),
  ('/photos/gallery/dental-xray.jpg', '/photos/gallery/thumb/dental-xray.jpg', 'Portable dental X-ray unit and digital X-ray on a laptop', NULL, 'clinic', 11),
  ('/photos/gallery/treatment-equipment.jpg', '/photos/gallery/thumb/treatment-equipment.jpg', 'Root canal motor and apex locator on the treatment tray', NULL, 'clinic', 12),
  ('/photos/gallery/treatment-room.jpg', '/photos/gallery/thumb/treatment-room.jpg', 'Treatment room with a dental chair under warm lighting', NULL, 'clinic', 13),
  ('/photos/gallery/treatment-room-2.jpg', '/photos/gallery/thumb/treatment-room-2.jpg', 'Dental chair with a root canal motor and apex locator on the tray', NULL, 'clinic', 14),
  ('/photos/gallery/reception.jpg', '/photos/gallery/thumb/reception.jpg', 'Reception desk and waiting area beside the staircase', NULL, 'clinic', 15),
  ('/photos/gallery/waiting-area.jpg', '/photos/gallery/thumb/waiting-area.jpg', 'Waiting area with a leather sofa and steel chairs', NULL, 'clinic', 16),
  ('/photos/gallery/01.jpg', '/photos/gallery/thumb/01.jpg', 'Srinivasa Dental Care Centre signboard at the clinic entrance', NULL, 'clinic', 17),
  ('/photos/gallery/02.jpg', '/photos/gallery/thumb/02.jpg', 'Treatment room with a brown dental chair and overhead light', NULL, 'clinic', 18),
  ('/photos/gallery/03.jpg', '/photos/gallery/thumb/03.jpg', 'Treatment room with a green dental chair', NULL, 'clinic', 19),
  ('/photos/gallery/04.jpg', '/photos/gallery/thumb/04.jpg', 'Patient waiting area with yellow walls', NULL, 'clinic', 20),
  ('/photos/gallery/05.jpg', '/photos/gallery/thumb/05.jpg', 'Treatment room with green walls and a bronze dental chair', NULL, 'clinic', 21),
  ('/photos/gallery/06.jpg', '/photos/gallery/thumb/06.jpg', 'Treatment room with an orange dental chair', NULL, 'clinic', 22),
  ('/photos/gallery/07.jpg', '/photos/gallery/thumb/07.jpg', 'Reception desk with a glass counter', NULL, 'clinic', 23),
  ('/photos/gallery/08.jpg', '/photos/gallery/thumb/08.jpg', 'Waiting area with a row of seats and a wall-mounted television', NULL, 'clinic', 24),
  ('/photos/gallery/09.jpg', '/photos/gallery/thumb/09.jpg', 'Dental X-ray unit mounted on the wall beside a dental chair', NULL, 'clinic', 25),
  ('/photos/gallery/10.jpg', '/photos/gallery/thumb/10.jpg', 'Reception desk and waiting seats', NULL, 'clinic', 26),
  ('/photos/gallery/11.jpg', '/photos/gallery/thumb/11.jpg', 'Consultation desk with chairs', NULL, 'clinic', 27),
  ('/photos/gallery/12.jpg', '/photos/gallery/thumb/12.jpg', 'Row of steel waiting chairs', NULL, 'clinic', 28),
  ('/photos/gallery/13.jpg', '/photos/gallery/thumb/13.jpg', 'Treatment room with a blue dental chair and instrument tray', NULL, 'clinic', 29),
  ('/photos/gallery/14.jpg', '/photos/gallery/thumb/14.jpg', 'Waiting area beside the staircase', NULL, 'clinic', 30),
  ('/photos/gallery/15.jpg', '/photos/gallery/thumb/15.jpg', 'Close view of the steel waiting chairs', NULL, 'clinic', 31);
