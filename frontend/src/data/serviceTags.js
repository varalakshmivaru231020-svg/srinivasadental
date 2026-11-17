// Short one-line subtitles for the compact service tiles on the home page.
// Services added in the admin panel fall back to the start of their short description.
export const serviceTags = {
  'dental-implants-btm-bangalore': 'Restore your smile',
  'root-canal-treatment-btm-bangalore': 'Save your natural tooth',
  'orthodontic-treatment-btm-bangalore': 'Straighten with ease',
  'clear-aligners-btm-bangalore': 'Discreet straightening',
  'smile-design-btm-bangalore': 'Aesthetic & natural',
  'teeth-whitening-btm-bangalore': 'Brighter, whiter smile',
  'dental-crowns-bridges-btm-bangalore': 'Strength & durability',
  'dentures-rpd-treatment-btm-bangalore': 'Comfortable, natural fit',
  'paediatric-dentist-btm-bangalore': 'Gentle care for kids',
  'teeth-cleaning-scaling': 'Healthy teeth & gums',
  'wisdom-tooth-extraction': 'Relief from discomfort',
  'full-mouth-rehabilitation': 'Complete restoration',
  'laser-dentistry': 'Modern, precise care',
};

export const serviceTag = (s) => serviceTags[s.slug]
  || (s.short || '').split(/[,.—-]/)[0].split(' ').slice(0, 4).join(' ');
