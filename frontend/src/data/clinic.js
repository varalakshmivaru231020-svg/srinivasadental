// Central clinic information — sourced from the clinic's website content PDFs.
// These are FALLBACK values only: the live website reads contact details, hours, logos and
// social links from the database, which the clinic edits in the admin panel (/admin → Clinic Settings).
// Items marked PLACEHOLDER were NOT provided; they stay hidden on the site until set in the admin panel.

export const clinic = {
  name: 'Srinivasa Dental Care',
  tagline: '25+ Years of Transforming Smiles. Restoring Confidence.',
  logoTagline: 'Healthier Smiles, Brighter Lives — Since 1999',
  established: 1999,
  address: {
    line1: 'No. 383, 7th Cross, 8th Main',
    line2: 'Mico Layout, BTM 2nd Stage',
    city: 'Bengaluru',
    pin: '560076',
    full: 'No. 383, 7th Cross, 8th Main, Mico Layout, BTM 2nd Stage, Bengaluru – 560076',
  },
  phones: ['9611146955', '9845195605'],
  landline: '080 41201345',
  area: 'Mico Layout, BTM 2nd Stage, Bengaluru',
  // PLACEHOLDER — no email was supplied in the content documents (hidden until set in admin).
  email: '',
  // Fallback only — the live site reads timings from the admin panel (Clinic Settings). As on the clinic's signboard.
  hours: [
    { days: 'Monday - Saturday', time: '10:00 AM - 2:00 PM, 5:00 PM - 9:00 PM' },
    { days: 'Sunday', time: '10:00 AM - 2:00 PM' },
  ],
  // WhatsApp number — confirm which mobile number is on WhatsApp.
  whatsapp: '919611146955',
  logo: '/logo-mark.png',
  logoBanner: '/logo-banner.png',
  mapsEmbed:
    'https://www.google.com/maps?q=Srinivasa+Dental+Care,+7th+Cross,+8th+Main,+Mico+Layout,+BTM+2nd+Stage,+Bengaluru+560076&output=embed',
  mapsLink:
    'https://www.google.com/maps/search/?api=1&query=Srinivasa+Dental+Care+Mico+Layout+BTM+2nd+Stage+Bengaluru+560076',
  // PLACEHOLDER — add real profile URLs in the admin panel (icons are hidden until set).
  social: { facebook: '', instagram: '', google: '' },
};

export const stats = [
  { value: '25+', label: 'Years of Experience' },
  { value: '1,00,000+', label: 'Patients Treated' },
  { value: '10+', label: 'Dental Services' },
  { value: '6', label: 'Treatment Chairs' },
];

export const whyChoose = [
  { icon: 'Award', title: '25+ Years of Experience', text: 'A trusted dental care legacy since 1999.' },
  { icon: 'Users', title: '1,00,000+ Patients Treated', text: 'Building lasting relationships through consistent dental care.' },
  { icon: 'Stethoscope', title: 'Experienced Dental Professionals', text: 'A team with expertise across different areas of dentistry.' },
  { icon: 'ScanLine', title: 'Modern Dental Technology', text: 'Intraoral scanner, OPG, intraoral camera and laser dentistry.' },
  { icon: 'Layers', title: 'Comprehensive Dental Care', text: 'Multiple dental treatments available under one roof.' },
  { icon: 'ShieldCheck', title: 'Hygienic Environment', text: 'A focus on cleanliness, safety and patient comfort.' },
  { icon: 'Armchair', title: 'Six-Chair Dental Clinic', text: 'A clinical setup designed to support organised patient care.' },
  { icon: 'ClipboardList', title: 'Personalised Treatment', text: 'Treatment planning based on individual needs and clinical assessment.' },
];

export const technology = [
  { icon: 'ScanFace', title: 'Intraoral Scanner', text: 'For digital scanning and detailed visualisation of teeth.' },
  { icon: 'Scan', title: 'OPG – Orthopantomogram', text: 'For panoramic imaging of the teeth and jaws.' },
  { icon: 'Camera', title: 'Intraoral Camera', text: 'For detailed visual examination of oral conditions.' },
  { icon: 'Zap', title: 'Laser Dentistry', text: 'Modern laser-assisted dental treatment options.' },
  { icon: 'Armchair', title: 'Modern Six-Chair Facility', text: 'A well-equipped clinical environment for comprehensive care.' },
  { icon: 'Microscope', title: 'Modern Diagnostics', text: 'Supporting accurate diagnosis and effective treatment planning.' },
];

export const whenToVisit = [
  'Toothache or tooth sensitivity',
  'Bleeding gums',
  'Cavities or damaged teeth',
  'Missing teeth',
  'Crooked or crowded teeth',
  'Persistent bad breath',
  'Difficulty chewing',
  'Wisdom tooth discomfort',
  'Stained or discoloured teeth',
];

export const generalFaqs = [
  {
    q: 'Which dentist should I visit in BTM Layout, Bangalore?',
    a: "Choose a qualified dentist based on your dental needs, the dentist's experience, available treatment options and patient feedback. Srinivasa Dental Care is an established dental clinic in BTM 2nd Stage, serving patients since 1999.",
  },
  {
    q: 'Where is Srinivasa Dental Care located?',
    a: 'We are located at No. 383, 7th Cross, 8th Main, Mico Layout, BTM 2nd Stage, Bengaluru – 560076.',
  },
  {
    q: 'Does Srinivasa Dental Care offer dental implants?',
    a: 'Dental implant treatment can be considered for suitable patients after an assessment of their oral health and bone condition. Contact the clinic to confirm availability.',
  },
  {
    q: 'Can I get braces or clear aligners in BTM Layout?',
    a: "Orthodontic treatment options may include braces and clear aligners, depending on the patient's dental condition and available clinical services. Contact the clinic for details.",
  },
  {
    q: 'How often should I visit a dentist?',
    a: 'Many people benefit from a dental check-up every six months. Your dentist may recommend a different schedule based on your oral health.',
  },
  {
    q: 'How can I book a dental appointment?',
    a: 'Call Srinivasa Dental Care on 9611146955 or 9845195605, or use the appointment request form on our Contact page.',
  },
];

// The clinic's dentist, as supplied by the clinic (profile text and photo).
export const doctor = {
  name: 'Dr. S. Vishwas',
  role: 'Experienced Dentist | Srinivasa Dental Care, BTM, Bangalore',
  photo: '/photos/doctors/dr-s-vishwas.jpg',
  bio: [
    'Dr. S. Vishwas is an experienced dental professional dedicated to delivering high-quality, patient-centred dental care. With over two decades of experience in the healthcare and dental sector, he is committed to helping patients achieve healthy, confident smiles.',
    'He completed his Bachelor of Dental Surgery (BDS) from NSVK Sri Venkateshwara Dental College and Hospital in 1999. He is also a member of the Indian Dental Association (IDA).',
    'With a vision to make quality dental care accessible and comfortable, Dr. Vishwas established Srinivasa Dental Care in BTM, Bangalore, offering modern dental treatments with a personalised approach.',
  ],
  credentials: [
    { icon: 'GraduationCap', title: 'BDS, 1999', text: 'NSVK Sri Venkateshwara Dental College and Hospital' },
    { icon: 'BadgeCheck', title: 'IDA Member', text: 'Indian Dental Association' },
    { icon: 'Building2', title: 'Founder', text: 'Srinivasa Dental Care, BTM, Bangalore' },
  ],
  areas: [
    'Dental Crowns and Bridges',
    'Dental Implants and Maxillofacial Treatments',
    'Cosmetic Dentistry and Smile Enhancement',
    'Oral Surgery Procedures',
    'Complete and Partial Dentures',
    'Root Canal Treatments',
    'Paediatric Dentistry',
  ],
};

// The dental team. The live website reads this list from the database, where the clinic manages it in
// the admin panel (/admin → Doctors); this copy is the fallback and the source of the initial data.
// Text is exactly as supplied by the clinic. Leave a field empty when it was not supplied — the site then
// shows "coming soon" instead of guessing.
//   bio      paragraphs, separated by a blank line
//   profile  "## Heading" starts a section · "- item" is a bullet point · "Label: value" is a detail row
export const team = [
  {
    slug: 'dr-madhukiran',
    name: 'Dr. Madhukiran',
    title: 'Endodontist',
    qualification: 'Specialist in Endodontics',
    experience: '23 Years of Clinical Experience',
    headline: '',
    photo: '/photos/doctors/dr-madhukiran.jpg',
    bio: `An experienced dental professional with 23 years of clinical experience, specialising in Endodontics and dedicated to preserving natural teeth through advanced dental care.

Associated with Srinivasa Dental Clinic, BTM, Bangalore, the doctor focuses on accurate diagnosis, effective treatment planning and patient-friendly dental care.

With extensive clinical experience and a commitment to quality, the aim is to provide comfortable, reliable and personalised dental treatment while helping patients maintain healthy smiles.`,
    profile: `## Area of Expertise
- Root Canal Treatment (RCT)
- Advanced Endodontic Procedures
- Tooth Preservation
- Management of Dental Pulp Infections
- Restorative Dental Care`,
  },
  {
    slug: 'dr-darshan-b-mundinamane',
    name: 'Dr. Darshan B Mundinamane',
    title: 'Periodontist & Implantologist',
    qualification: 'MDS, Periodontics',
    experience: '19 yrs (Practicing Periodontology and Implantology Since 2007)',
    headline: '',
    photo: '/photos/doctors/dr-darshan-b-mundinamane.jpg',
    bio: '',
    profile: `## Areas of Interest
- Implantology
- Immunology
- Alternative Medicine

## Proficient in
- Management of Periodontitis
- Implant Surgery & Maintenance
- Root Coverage procedures
- Mucogingival Procedures

## Scope of Service
- Periodontal Flap Surgeries and maintenance
- Root coverage/esthetic gum surgeries
- Dental Implant Placement and maintenance
- Advanced bone and soft tissue augmentation surgeries for Dental Implants`,
  },
  {
    slug: 'dr-anitha',
    name: 'Dr. Anitha',
    title: 'Pediatric & Preventive Dentistry',
    qualification: 'MDS, Pediatric and Preventive Dentistry',
    experience: 'Associate Professor, Bangalore Institute of Dental Sciences',
    headline: '',
    photo: '/photos/doctors/dr-anitha.jpg',
    bio: '',
    profile: `## Educational Qualifications
- Bachelor of Dental Surgery (BDS) – Manipal College of Dental Sciences (MCODS), Mangalore.
- Batch of 1989.
- Completed dentistry in 1994.

## Professional Experience
Currently working as an Associate Professor in the Department of Pediatric and Preventive Dentistry at Bangalore Institute of Dental Sciences.`,
  },
  {
    slug: 'dr-hemavathi',
    name: 'Dr. Hemavathi',
    title: 'General Dentist',
    qualification: 'BDS',
    experience: '15 Years of Clinical Experience',
    headline: '',
    photo: '/photos/doctors/dr-hemavathi.jpg',
    bio: `Dr. Hemavathi is a qualified dental professional with 15 years of clinical experience in dentistry. She is dedicated to providing quality dental care, focusing on patients’ oral health, preventive care, and overall dental well-being.

With extensive clinical experience, she is committed to delivering comfortable, patient-friendly dental treatments and promoting healthy smiles.`,
    profile: '',
  },
  {
    slug: 'dr-srividhya-narasimhan',
    name: 'Dr. Srividhya Narasimhan',
    title: 'Orthodontist',
    qualification: 'BDS, MFDS RCPS (Glasgow), MDS (Orthodontics)',
    experience: '30 Years of Experience | 13 Years in Orthodontics',
    headline: '',
    photo: '/photos/doctors/dr-srividhya-narasimhan.jpg',
    bio: `Dr. Srividhya Narasimhan is an experienced dental professional with 30 years of experience in general dentistry and 13 years of specialised experience in orthodontics.

She completed her Bachelor of Dental Surgery (BDS) in 1997, followed by MFDS from the Royal College of Physicians and Surgeons of Glasgow in 2007. She subsequently completed her Master of Dental Surgery (MDS) in Orthodontics between 2010 and 2013.

With extensive clinical experience and specialised orthodontic expertise, she is dedicated to providing quality dental care and helping patients achieve healthy, well-aligned smiles.`,
    profile: '',
  },
  {
    slug: 'dr-manoranjan-sj',
    name: 'Dr. Manoranjan SJ',
    title: 'Periodontist',
    qualification: 'BDS (1999), MDS (2007) – Periodontics',
    experience: 'Faculty in AECS Maruthi Dental College for 15 yrs',
    headline: '',
    photo: '/photos/doctors/dr-manoranjan-sj.jpg',
    bio: '',
    profile: `Qualification: BDS 1999, MDS 2007
Speciality: Periodontics
Occupation: Faculty in AECS Maruthi Dental College for 15yrs
Designation: Professor, Dept of periodontics (Now Resigned)
Speciality treatment: Laser specialist for gum disease and intraoral soft tissue lesions

## Area of interest
- Flap Surgery
- Laser assisted flap Surgery
- Regenerative Periodontal Surgeries
- Gums contouring for smile designing`,
  },
  {
    slug: 'dr-nithin',
    name: 'Dr. Nithin',
    title: 'Oral & Maxillofacial Surgeon',
    qualification: 'BDS, MDS – Oral and Maxillofacial Surgeon (OMFS)',
    experience: '2 Years of Clinical Experience',
    headline: '',
    photo: '/photos/doctors/dr-nithin.jpg',
    bio: 'Dr. Nithin is a qualified Oral and Maxillofacial Surgeon with 2 years of clinical experience. Specialising in the diagnosis and surgical management of conditions affecting the mouth, jaws, face and associated structures, Dr. Nithin is committed to providing patient-focused care with precision, safety and attention to detail.',
    profile: '',
  },
  {
    slug: 'dr-roshan',
    name: 'Dr. Roshan',
    title: 'Prosthodontist & Implantologist',
    qualification: 'MDS, PGDHHM',
    experience: '24 Years of Professional Experience',
    headline: 'Specialist in Prosthodontics and Implantology',
    photo: '/photos/doctors/dr-roshan.jpg',
    bio: `Dr. Roshan is an experienced dental specialist with 24 years of professional experience in dentistry. He specialises in Prosthodontics and Implantology, focusing on restoring missing teeth, smile rehabilitation, and improving patients' oral health and function through advanced dental treatments.

His extensive clinical experience and expertise enable him to provide comprehensive dental care with a focus on functional restoration and aesthetic outcomes.`,
    profile: '',
  },
  {
    slug: 'dr-karishma-kalal',
    name: 'Dr. Karishma Kalal',
    title: '',
    qualification: 'BDS',
    experience: '10 Years of Clinical Experience',
    headline: '',
    photo: '/photos/doctors/dr-karishma-kalal.jpg',
    bio: `Dr. Karishma Kalal is a dedicated dental professional with a Bachelor of Dental Surgery (BDS) degree.

She has expertise in Root Canal Treatment, Dental Surgery, and Dental Implants, with a strong focus on providing quality dental care and ensuring patient comfort.

Known for her compassionate approach, clinical experience, and excellent patient understanding, Dr. Karishma believes in educating patients about their oral health and providing personalised treatment solutions.

Her approach combines clinical expertise, gentle care, and a commitment to creating healthy, confident smiles.`,
    profile: '',
  },
  {
    slug: 'dr-g-anjum',
    name: 'Dr. G. Anjum',
    title: 'Dental Surgeon',
    qualification: '',
    experience: '',
    headline: '',
    photo: '/photos/doctors/dr-g-anjum.jpg',
    bio: 'Dedicated to providing quality dental care with a focus on oral health, patient comfort, and personalised treatment. Committed to helping patients maintain healthy smiles through preventive and comprehensive dental care.',
    profile: '',
  },
  {
    slug: 'dr-dhanashree-g',
    name: 'Dr. Dhanashree G',
    title: 'Implantology & Endodontics',
    qualification: 'FBOCI',
    experience: '5 Years of Clinical Experience',
    headline: 'Dental Surgeon | Implantology & Endodontics',
    photo: '/photos/doctors/dr-dhanashree-g.jpg',
    bio: `Dr. Dhanashree G is a skilled dental professional with 5 years of clinical experience. She is a Fellow of the Brånemark Osseointegration Center India (FBOCI) and has also completed a fellowship in Conservative Dentistry and Endodontics.

With specialized training in dental implantology and endodontics, she is committed to providing quality dental care with a focus on precision, patient comfort and long-lasting oral health.`,
    profile: '',
  },
  {
    slug: 'dr-masroor',
    name: 'Dr. Masroor',
    title: '',
    qualification: '',
    experience: '',
    headline: '',
    photo: null, // PLACEHOLDER — photo and details not supplied yet
    bio: '',
    profile: '',
  },
];
