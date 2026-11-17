import {
  Armchair, Clock, Mail, MapPin, MonitorSmartphone, Phone, ScanLine, ShieldPlus, Sofa, SprayCan,
} from 'lucide-react';
import { useSite, telHref } from '../context/SiteContext';
import { stats } from '../data/clinic';
import { CountUp, ParallaxImage, Reveal, Stagger, StaggerItem } from './motion';
import { Badge, CheckList, FeatureCard } from './Shared';
import { Button, Container, Highlight, Section, SectionHeading, Wave, cx } from './ui';

const FILL = { canvas: 'fill-canvas', white: 'fill-white', navy: 'fill-navy' };

/** Clinic statistics with count-up numbers. */
export function TrustBar({ className }) {
  return (
    <section className={cx('relative', className)}>
      <Container>
        <Reveal amount={0.4}>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[2rem] bg-line/70 shadow-soft ring-1 ring-line/60 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-white p-7 sm:p-9">
                <CountUp value={s.value} className="block font-display text-4xl font-extrabold tracking-[-0.04em] text-navy sm:text-5xl" />
                <span className="mt-2 flex items-center gap-2 text-sm font-medium text-muted sm:text-[0.95rem]">
                  <span className="h-0.5 w-4 rounded-full bg-aqua" aria-hidden="true" /> {s.label}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

const WHY = [
  'Experienced & Skilled Dentists',
  'Modern Technology',
  'Personalized Treatment Plans',
  'Clean & Comfortable Clinic',
  'Patient-Centred Approach',
  'Quality Dental Care',
];

/** Full-width deep navy → teal band with a clinic photograph blending in from the right. */
export function WhyChooseSection({
  title = <>Experienced Hands. Compassionate Care. <Highlight light>Healthier Smiles.</Highlight></>,
  image = '/photos/clinic/treatment-room-2.jpg',
  imageAlt = 'Treatment room at Srinivasa Dental Care',
  above = 'canvas',
  className,
}) {
  return (
    <section className={cx('relative overflow-hidden bg-gradient-to-r from-navy via-[#08405A] to-[#0A5E6E]', className)}>
      <Wave flip fillClass={FILL[above]} className="absolute inset-x-0 top-0 z-10" />

      {/* Desktop: photo on the right, fading into the navy */}
      <Reveal from="right" duration={1.2} className="absolute inset-y-0 right-0 hidden w-[56%] lg:block">
        <div className="group h-full w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_40%)]">
          <img src={image} alt={imageAlt} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1600ms] ease-premium group-hover:scale-105" />
        </div>
      </Reveal>
      {/* Mobile / tablet: photo on top */}
      <div className="relative h-72 sm:h-96 lg:hidden">
        <img src={image} alt={imageAlt} loading="lazy" className="h-full w-full object-cover" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-transparent via-navy/30 to-navy" />
      </div>

      <Container className="relative z-10 pb-20 sm:pb-24 lg:py-36">
        <div className="max-w-xl">
          <SectionHeading light eyebrow="Why Choose Us" title={title}>
            Your comfort and care are our top priority.
          </SectionHeading>
          <Reveal delay={0.1} className="mt-9"><CheckList items={WHY} cols light /></Reveal>
          <Reveal delay={0.2} className="mt-10"><Button to="/about-us" variant="outline-light" arrow>About Our Clinic</Button></Reveal>
        </div>
      </Container>
    </section>
  );
}

const EQUIPMENT = [
  { Icon: ScanLine, title: 'Digital Scanning', text: 'Intraoral scanner for detailed digital impressions.' },
  { Icon: MonitorSmartphone, title: 'Advanced Dental Equipment', text: 'OPG imaging and intraoral camera for accurate diagnosis.' },
  { Icon: Armchair, title: 'Modern Treatment Facilities', text: 'A six-chair clinic designed for organised care.' },
  { Icon: SprayCan, title: 'Sterilization Standards', text: 'A strong focus on cleanliness and infection control.' },
  { Icon: Sofa, title: 'Comfortable Environment', text: 'Calm, patient-friendly treatment rooms.' },
  { Icon: ShieldPlus, title: 'Patient Safety', text: 'Every treatment guided by careful clinical assessment.' },
];

/** Split section: equipment photograph + six feature cards (About page). */
export function EquipmentSection({
  id,
  image = '/photos/about-treatment-room.jpg',
  imageAlt = 'Modern dental treatment room',
  eyebrow = 'Advanced Technology',
  title = <>Modern Equipment for <Highlight>Accurate Diagnosis</Highlight> and Effective Treatment.</>,
  className,
}) {
  return (
    <Section id={id} className={className}>
      <Container className="grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <div className="relative">
          <ParallaxImage from="left" src={image} alt={imageAlt} className="aspect-[4/5]" rounded="rounded-[2.5rem]" position="45% center" />
          <Reveal from="up" delay={0.3} className="absolute -right-3 bottom-8 sm:-right-8">
            <Badge icon={ScanLine} title="Digital Imaging" text="OPG & intraoral scanner" />
          </Reveal>
        </div>
        <div>
          <SectionHeading eyebrow={eyebrow} title={title}>
            We believe modern technology plays an important role in accurate diagnosis and effective treatment planning.
          </SectionHeading>
          <Stagger className="mt-10 grid gap-4 sm:grid-cols-2">
            {EQUIPMENT.map((e) => <FeatureCard key={e.title} icon={e.Icon} title={e.title} text={e.text} />)}
          </Stagger>
        </div>
      </Container>
    </Section>
  );
}

function InfoRow({ icon: IconCmp, label, children }) {
  return (
    <StaggerItem className="flex gap-4 rounded-3xl bg-white p-5 shadow-soft ring-1 ring-line/60">
      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-aqua/25 to-mint text-teal"><IconCmp size={21} /></span>
      <div className="min-w-0">
        <span className="block text-xs font-bold tracking-[0.16em] text-muted uppercase">{label}</span>
        <div className="mt-1 leading-relaxed text-ink">{children}</div>
      </div>
    </StaggerItem>
  );
}

/** Address, phone, email and hours as cards. */
export function ContactInfoList({ className, cols }) {
  const { clinic } = useSite();
  return (
    <Stagger className={cx('grid gap-4', cols && 'sm:grid-cols-2', className)}>
      <InfoRow icon={MapPin} label="Clinic address">
        <a href={clinic.mapsLink} target="_blank" rel="noreferrer" className="transition-colors hover:text-teal">{clinic.address.full}</a>
      </InfoRow>
      <InfoRow icon={Phone} label="Phone">
        {clinic.phones.map((p) => <a key={p} href={telHref(p)} className="mr-4 inline-block font-semibold transition-colors hover:text-teal">+91 {p}</a>)}
        {clinic.landline && <a href={telHref(clinic.landline)} className="block text-muted transition-colors hover:text-teal">{clinic.landline} (Landline)</a>}
      </InfoRow>
      {clinic.email && (
        <InfoRow icon={Mail} label="Email">
          <a href={`mailto:${clinic.email}`} className="break-all transition-colors hover:text-teal">{clinic.email}</a>
        </InfoRow>
      )}
      <InfoRow icon={Clock} label="Working hours">
        {clinic.hours.length
          ? clinic.hours.map((h) => <span key={h.days} className="block"><strong className="font-semibold">{h.days}:</strong> {h.time}</span>)
          : <span className="text-muted">Please call the clinic to confirm timings.</span>}
      </InfoRow>
    </Stagger>
  );
}

export function MapFrame({ className }) {
  const { clinic } = useSite();
  return (
    <div className={cx('overflow-hidden rounded-[2rem] bg-mint shadow-soft ring-1 ring-line/60', className)}>
      <iframe
        title={`${clinic.name} location map`}
        src={clinic.mapsEmbed}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="h-full min-h-[22rem] w-full border-0"
      />
    </div>
  );
}
