// Kinds of gallery photo, and the names the Gallery page and the admin panel show for them.
export const GALLERY_CATEGORIES = [
  { key: 'smiles', label: 'Smile Results' },
  { key: 'clinic', label: 'Our Clinic' },
];

// Patient smile photos supplied by the clinic, before and after treatment. Shown first.
const smilePhotos = [
  { id: 'smile-case-1-before', caption: 'Before', alt: 'Smile with gaps between the front teeth, before treatment' },
  { id: 'smile-case-1-after', caption: 'After', alt: 'The same smile after treatment, with the gaps closed' },
  { id: 'smile-case-2-before', caption: 'Before', alt: 'Broken and discoloured front teeth, before treatment' },
  { id: 'smile-case-2-after', caption: 'After', alt: 'The same patient smiling after treatment' },
  { id: 'smile-case-2-after-2', caption: 'After', alt: 'The same patient after treatment, smiling with restored front teeth' },
];

// The clinic's own new photos (supplied directly).
const newPhotos = [
  { id: 'clinic-front', alt: 'Entrance of Srinivasa Dental Care with the clinic signboard' },
  { id: 'dr-vishwas-desk', alt: 'Dr. S. Vishwas at the consultation desk' },
  { id: 'dental-chair', alt: 'Treatment room with a brown dental chair and instrument tray' },
  { id: 'opg', alt: 'OPG (panoramic X-ray) machine' },
  { id: 'intraoral-scanner', alt: 'Intraoral scanner with a 3D scan of teeth on a laptop' },
  { id: 'dental-xray', alt: 'Portable dental X-ray unit and digital X-ray on a laptop' },
  { id: 'treatment-equipment', alt: 'Root canal motor and apex locator on the treatment tray' },
  { id: 'treatment-room', alt: 'Treatment room with a dental chair under warm lighting' },
  { id: 'treatment-room-2', alt: 'Dental chair with a root canal motor and apex locator on the tray' },
  { id: 'reception', alt: 'Reception desk and waiting area beside the staircase' },
  { id: 'waiting-area', alt: 'Waiting area with a leather sofa and steel chairs' },
];

// Real clinic photos from the clinic's own website (srinivasadentalcarecentre.com/gallery), in the same order.
const websitePhotos = [
  { id: '01', alt: 'Srinivasa Dental Care Centre signboard at the clinic entrance' },
  { id: '02', alt: 'Treatment room with a brown dental chair and overhead light' },
  { id: '03', alt: 'Treatment room with a green dental chair' },
  { id: '04', alt: 'Patient waiting area with yellow walls' },
  { id: '05', alt: 'Treatment room with green walls and a bronze dental chair' },
  { id: '06', alt: 'Treatment room with an orange dental chair' },
  { id: '07', alt: 'Reception desk with a glass counter' },
  { id: '08', alt: 'Waiting area with a row of seats and a wall-mounted television' },
  { id: '09', alt: 'Dental X-ray unit mounted on the wall beside a dental chair' },
  { id: '10', alt: 'Reception desk and waiting seats' },
  { id: '11', alt: 'Consultation desk with chairs' },
  { id: '12', alt: 'Row of steel waiting chairs' },
  { id: '13', alt: 'Treatment room with a blue dental chair and instrument tray' },
  { id: '14', alt: 'Waiting area beside the staircase' },
  { id: '15', alt: 'Close view of the steel waiting chairs' },
];

/**
 * The gallery as first published. The live list comes from the database (admin panel → Gallery,
 * seeded from this list by database/migrations/012_gallery.sql); this copy is shown only when the
 * website cannot reach it.
 */
export const galleryPhotos = [
  ...smilePhotos.map((p) => ({ ...p, category: 'smiles' })),
  ...[...newPhotos, ...websitePhotos].map((p) => ({ caption: '', ...p, category: 'clinic' })),
].map((p) => ({ ...p, thumb: `/photos/gallery/thumb/${p.id}.jpg`, full: `/photos/gallery/${p.id}.jpg` }));

// Patient reviews published on Google, as shown on the clinic's own gallery page. Text is unedited.
export const googleReviews = [
  { name: 'Arshiya sadaf', initial: 'A', color: '#33691E', date: '15/11/2022', rating: 5, text: 'Best clinic for any kind of dental treatment.' },
  { name: 'rajnish kumar', initial: 'R', color: '#BF360C', date: '15/09/2022', rating: 4, text: 'Very good 😊' },
  { name: 'Farzeen -Ummal Fahmidha', initial: 'F', color: '#EC407A', date: '14/09/2022', rating: 5, text: 'I have been coming here last 7 years and i find then very Professional and I finf my teeth is in Good hands' },
  { name: 'Ray Tube Fixes', initial: 'R', color: '#17224D', date: '10/09/2022', rating: 5, text: 'Thank you Dr Vishwas for the great and kind service.' },
];

export const GOOGLE_REVIEWS_URL = 'https://www.google.com/search?q=srinivasa+dental+care+centre#lrd=0x3bae14e30d173bc5:0xce0b510ccbcc0501,1,,,';
