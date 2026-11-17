/**
 * The banner at the top of each page, as built into the website. The clinic can change the photo
 * (and, where `hasTitle` is set, the title) in the admin panel → Banners; a page with no change shows
 * the entry below. Keep the keys in step with backend/models/bannerModel.js.
 */
export const BANNERS = [
  {
    key: 'home',
    label: 'Home page',
    where: 'The large photo beside the heading at the top of the home page.',
    image: '/photos/clinic/dr-vishwas-desk.jpg',
    alt: 'Dr. S. Vishwas at the consultation desk, Srinivasa Dental Care',
    hasTitle: false,
    size: 'Landscape photo, at least 1600 × 1100 px. The edges are cropped on wide screens, so keep the subject near the centre.',
  },
  {
    key: 'about',
    label: 'About Us page',
    where: 'The photo in the curved frame at the top of the About Us page.',
    image: '/photos/clinic/clinic-front.jpg',
    alt: 'Entrance of Srinivasa Dental Care, BTM 2nd Stage, Bengaluru',
    hasTitle: false,
    size: 'Landscape photo, about 1400 × 1120 px (5:4). The left edge is curved, so keep the subject away from it.',
  },
  {
    key: 'services',
    label: 'Services page',
    where: 'The photo beside the heading on the Services page (shown whole, nothing cropped).',
    image: '/photos/clinic/treatment-room.jpg',
    alt: 'Treatment room with a dental chair at Srinivasa Dental Care',
    hasTitle: false,
    size: 'Landscape photo, at least 1400 × 1000 px.',
  },
  {
    key: 'service-detail',
    label: 'Each treatment page',
    where: 'The wide background photo behind the treatment name on every treatment page.',
    image: '/photos/clinic/banner-treatments.png',
    alt: '',
    hasTitle: false,
    size: 'Very wide photo, at least 1920 × 600 px. The title sits on top, so a calm, light photo reads best.',
  },
  {
    key: 'doctor-detail',
    label: "Each doctor's page",
    where: "The wide background photo behind the doctor's name on every doctor's page.",
    image: '/photos/clinic/banner-treatments.png',
    alt: '',
    hasTitle: false,
    size: 'Very wide photo, at least 1920 × 600 px. The name sits on top, so a calm, light photo reads best.',
  },
  {
    key: 'contact',
    label: 'Contact page',
    where: 'The wide banner with the title at the top of the Contact page.',
    image: '/photos/clinic/banner-treatments.png',
    alt: '',
    hasTitle: true,
    title: 'Contact us',
    size: 'Very wide photo, at least 1920 × 600 px. The title sits on top, so a calm, light photo reads best.',
  },
  {
    key: 'gallery',
    label: 'Gallery page',
    where: 'The banner with the title at the top of the Gallery page. Without a photo it is plain teal.',
    image: null,
    alt: '',
    hasTitle: true,
    title: 'Gallery',
    size: 'Very wide photo, at least 1920 × 600 px. The title sits on top, so a calm, light photo reads best.',
  },
  {
    key: 'best-dentist',
    label: '“Dentist in BTM Layout” page',
    where: 'The top of the “Dentist in BTM Layout” page. Without a photo it shows the heading only; a photo appears beside it, shown whole.',
    image: null,
    alt: '',
    hasTitle: false,
    size: 'Landscape photo, at least 1400 × 1000 px.',
  },
];

export const BANNER_DEFAULTS = Object.fromEntries(BANNERS.map((b) => [b.key, b]));
