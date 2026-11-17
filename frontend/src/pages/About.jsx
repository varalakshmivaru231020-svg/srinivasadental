import { Link } from 'react-router-dom';
import { Target, Eye, MapPin, Phone, CalendarCheck, Ear, ScanSearch, MessagesSquare, HeartPulse, GraduationCap, BadgeCheck, Building2, UserRound, ArrowRight } from 'lucide-react';
import useSeo from '../hooks/useSeo';
import { doctor } from '../data/clinic';
import { useSite, telHref } from '../context/SiteContext';
import { ParallaxImage, Stagger, StaggerItem } from '../components/motion';
import { FadeIn } from '../components/clinicPage';
import { Button, Container, Eyebrow, Highlight, Section, SectionHeading } from '../components/ui';
import { CheckList, CTASection } from '../components/Shared';
import AboutHero from '../components/AboutHero';

const CREDENTIAL_ICONS = { GraduationCap, BadgeCheck, Building2 };
import { EquipmentSection, TrustBar, WhyChooseSection } from '../components/sections';

const APPROACH = [
  { Icon: Ear, title: 'Listen & understand', text: 'We take time to understand your concerns, dental history and expectations.' },
  { Icon: ScanSearch, title: 'Examine & diagnose', text: 'A thorough examination, supported by digital imaging where needed.' },
  { Icon: MessagesSquare, title: 'Explain your options', text: 'Clear explanations of suitable treatments, so you can make informed decisions.' },
  { Icon: HeartPulse, title: 'Personalised care', text: 'Treatment planned around your needs, comfort and long-term oral health.' },
];

/** One team doctor: photo, name, qualification and experience. Links to the doctor's own page when a profile was supplied. */
function TeamCard({ doctor: d }) {
  const hasSummary = d.qualification || d.experience;
  return (
    <StaggerItem className="group relative w-[calc(50%-0.375rem)] overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-line/60 transition-all duration-500 ease-premium hover:-translate-y-1.5 hover:shadow-lift sm:w-[calc(50%-0.75rem)] sm:rounded-[1.75rem] lg:w-[calc(33.333%-1rem)] xl:w-[calc(25%-1.125rem)]">
      <div className="relative grid aspect-[4/5] place-items-center overflow-hidden bg-gradient-to-br from-mint via-mint-soft to-white">
        {d.photo
          ? <img src={d.photo} alt={d.name} loading="lazy" className="h-full w-full object-cover object-[center_15%] transition-transform duration-[1200ms] ease-premium group-hover:scale-105" />
          : (
            <>
              <div aria-hidden="true" className="absolute bottom-0 left-1/2 size-28 -translate-x-1/2 translate-y-1/2 rounded-full bg-teal/10 sm:size-44" />
              <UserRound strokeWidth={1} className="relative size-14 text-teal/40 sm:size-20" aria-hidden="true" />
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/80 px-2.5 py-1 text-[0.68rem] font-semibold text-teal ring-1 ring-teal/15 sm:bottom-5 sm:px-3 sm:text-xs">Photo coming soon</span>
            </>
          )}
        {d.title && (
          <span className="absolute top-3 left-3 max-w-[calc(100%-1.5rem)] rounded-full bg-teal px-2.5 py-1 text-[0.68rem] font-bold tracking-wide text-white shadow-soft sm:top-4 sm:left-4 sm:px-3.5 sm:text-xs">{d.title}</span>
        )}
      </div>
      <div className="p-4 sm:p-6">
        <h3 className="font-display text-[0.95rem] leading-snug font-bold text-navy sm:text-xl">{d.name}</h3>
        {hasSummary ? (
          <>
            {d.qualification && <p className="mt-1.5 text-xs font-semibold text-teal sm:text-sm">{d.qualification}</p>}
            {d.experience && <p className="mt-1.5 text-xs leading-snug text-muted sm:text-sm">{d.experience}</p>}
          </>
        ) : d.hasProfile ? (
          d.title && <p className="mt-1.5 text-xs font-semibold text-teal sm:text-sm">{d.title}</p>
        ) : (
          <p className="mt-1.5 text-xs text-muted sm:text-sm">Profile details coming soon</p>
        )}
        {d.hasProfile && (
          <Link
            to={`/doctors/${d.slug}`}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-teal transition-colors duration-300 after:absolute after:inset-0 after:content-[''] hover:text-navy sm:text-sm"
          >
            View profile<span className="sr-only"> of {d.name}</span>
            <ArrowRight size={15} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>
    </StaggerItem>
  );
}

export default function About() {
  const { clinic, team } = useSite();
  useSeo({
    title: 'About Us | Srinivasa Dental Care – Trusted Dental Clinic in BTM Layout, Bangalore',
    description: 'Srinivasa Dental Care, established in 1999 in BTM Layout, Bangalore by Dr. S. Vishwas (BDS, IDA member). Meet our dental team, and read about our story, approach to patient care and modern facilities.',
    keywords: 'Dental clinic in BTM Layout, best dental clinic in BTM Bangalore, experienced dentists in BTM, dental care centre Bangalore, Srinivasa Dental Care, dental specialists in Bangalore',
  });

  return (
    <>
      {/* 1. Hero */}
      <AboutHero />

      {/* 2. Our story */}
      <Section className="bg-white">
        <Container className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          <div className="relative order-2 mb-20 lg:order-1 lg:mb-0">
            <FadeIn from="left"><ParallaxImage src="/photos/clinic/reception.jpg" alt="Reception and waiting area at Srinivasa Dental Care" className="aspect-[16/9]" rounded="rounded-[2.5rem]" position="center" strength={0} /></FadeIn>
            <FadeIn from="up" delay={0.3} className="absolute top-full right-4 -mt-8 sm:-right-6">
              <div className="rounded-3xl bg-navy px-7 py-6 text-white shadow-lift">
                <span className="block font-display text-5xl font-extrabold tracking-[-0.05em]">1999</span>
                <span className="mt-1 block text-sm text-white/70">Established in BTM 2nd Stage</span>
              </div>
            </FadeIn>
          </div>
          <FadeIn from="right" className="order-1 lg:order-2">
            <Eyebrow>Our Story</Eyebrow>
            <h2 className="mt-5 font-display text-[2rem] leading-[1.14] font-extrabold tracking-[-0.03em] text-balance text-navy sm:text-[2.5rem]">
              Comprehensive dental care built on <Highlight>comfort, ethics</Highlight> and long-term oral health.
            </h2>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted">
              <p>Established in 1999, Srinivasa Dental Care has been committed to providing comprehensive dental care with a focus on patient comfort, ethical treatment and long-term oral health.</p>
              <p>With over 25 years of experience and more than 1,00,000 patients treated, we aim to make quality dental care accessible through experienced dental professionals, modern equipment and personalised treatment planning.</p>
              <p>Whether you need routine dental care, advanced restorative procedures or smile enhancement treatments, our team focuses on understanding your needs and recommending suitable solutions.</p>
            </div>
          </FadeIn>
        </Container>
      </Section>

      {/* 3. Mission & vision */}
      <Section id="vision-mission">
        <Container>
          <div className="grid gap-5 lg:grid-cols-2">
            <FadeIn from="left">
            <div className="group relative h-full overflow-hidden rounded-[2.25rem] bg-gradient-to-br from-teal to-teal-dark p-9 text-white sm:p-12">
              <div aria-hidden="true" className="absolute -top-16 -right-16 size-56 rounded-full bg-aqua/30 blur-2xl transition-transform duration-700 group-hover:scale-125" />
              <span className="relative grid size-14 place-items-center rounded-2xl bg-white/15"><Target size={26} /></span>
              <h3 className="relative mt-8 font-display text-2xl font-extrabold text-white">Our Mission</h3>
              <p className="relative mt-3 text-lg leading-relaxed text-white/85">To provide quality, ethical and patient-centred dental care while helping individuals and families maintain healthy teeth, confident smiles and better oral health.</p>
            </div>
            </FadeIn>
            <FadeIn from="right">
            <div className="group relative h-full overflow-hidden rounded-[2.25rem] bg-navy p-9 text-white sm:p-12">
              <div aria-hidden="true" className="absolute -top-16 -right-16 size-56 rounded-full bg-teal/30 blur-2xl transition-transform duration-700 group-hover:scale-125" />
              <span className="relative grid size-14 place-items-center rounded-2xl bg-white/10 text-aqua"><Eye size={26} /></span>
              <h3 className="relative mt-8 font-display text-2xl font-extrabold text-white">Our Vision</h3>
              <p className="relative mt-3 text-lg leading-relaxed text-white/75">To be a trusted dental care destination known for clinical excellence, patient satisfaction, modern technology and long-term relationships.</p>
            </div>
            </FadeIn>
          </div>
        </Container>
      </Section>

      {/* 4. Experience & achievements */}
      <section className="pb-20 sm:pb-24 lg:pb-28">
        <Container><SectionHeading align="center" eyebrow="Experience" title={<>Over Two Decades of <Highlight>Trusted Care</Highlight></>} className="mb-12" /></Container>
        <TrustBar />
      </section>

      {/* 5. Approach to patient care */}
      <Section className="bg-white">
        <Container className="grid items-center gap-16 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <div>
            <SectionHeading eyebrow="Our Approach" title={<>How We Care for <Highlight>Every Patient</Highlight></>}>
              Every patient has different dental needs. We take the time to understand your concerns, explain the available options and help you make informed decisions about your oral health.
            </SectionHeading>
            <Stagger className="mt-10 grid gap-4 sm:grid-cols-2">
              {APPROACH.map(({ Icon, title, text }, i) => (
                <StaggerItem key={title} className="group flex gap-5 rounded-3xl bg-canvas p-5 ring-1 ring-line/60 transition-all duration-500 ease-premium hover:bg-white hover:shadow-soft sm:flex-col sm:gap-4">
                  <span className="relative grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-teal to-aqua text-white">
                    <Icon size={21} />
                    <span className="absolute -top-2 -right-2 grid size-6 place-items-center rounded-full bg-navy font-display text-[0.7rem] font-bold">{i + 1}</span>
                  </span>
                  <span>
                    <span className="block font-display text-lg font-bold text-navy">{title}</span>
                    <span className="mt-1 block leading-relaxed text-muted">{text}</span>
                  </span>
                </StaggerItem>
              ))}
            </Stagger>
            <FadeIn from="up" className="mt-8" delay={0.1}><p className="font-display text-lg font-bold text-navy">Your comfort, confidence and healthy smile remain at the centre of everything we do.</p></FadeIn>
          </div>
          {/* Clinic photos, each shown whole: waiting area on top, digital imaging below */}
          <div className="grid gap-4 sm:gap-5">
            <FadeIn from="right"><ParallaxImage src="/photos/clinic/waiting-area.jpg" alt="Patient waiting area at Srinivasa Dental Care" className="aspect-[16/9]" rounded="rounded-[2rem]" strength={0} /></FadeIn>
            <div className="grid grid-cols-2 gap-4 sm:gap-5">
              <FadeIn from="left"><ParallaxImage src="/photos/clinic/intraoral-scanner.jpg" alt="Intraoral scanner with a 3D scan of teeth on a laptop" className="aspect-[4/5]" rounded="rounded-[2rem]" strength={0} /></FadeIn>
              <FadeIn from="right"><ParallaxImage src="/photos/clinic/dental-xray.jpg" alt="Portable dental X-ray unit and a digital X-ray on a laptop" className="aspect-[4/5]" rounded="rounded-[2rem]" strength={0} /></FadeIn>
            </div>
          </div>
        </Container>
      </Section>

      {/* 6. Our founder */}
      <Section id="founder">
        <Container className="grid items-start gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div className="relative mx-auto w-full max-w-md lg:sticky lg:top-28 lg:max-w-none">
            <div aria-hidden="true" className="absolute -inset-3 -rotate-3 rounded-[2.75rem] bg-gradient-to-br from-teal/25 via-mint to-aqua/25 sm:-inset-4" />
            <FadeIn from="left">
              <ParallaxImage
                src={doctor.photo}
                alt={`${doctor.name}, dentist and founder of Srinivasa Dental Care`}
                className="aspect-[4/5] shadow-lift ring-1 ring-line/60"
                rounded="rounded-[2.5rem]"
                position="center 18%"
                strength={4}
              />
            </FadeIn>
            <FadeIn from="up" delay={0.3} className="absolute -right-2 bottom-8 sm:-right-8">
              <div className="rounded-3xl bg-navy px-6 py-5 text-white shadow-lift">
                <span className="block font-display text-4xl font-extrabold tracking-[-0.04em]">1999</span>
                <span className="mt-1 block text-sm text-white/70">BDS graduate &amp; clinic founder</span>
              </div>
            </FadeIn>
          </div>

          <div>
            <FadeIn from="right">
              <Eyebrow lines="after">Our Founder</Eyebrow>
              <h2 className="mt-5 font-display text-[2.25rem] leading-[1.1] font-extrabold tracking-[-0.03em] text-navy sm:text-5xl">{doctor.name}</h2>
              <p className="mt-3 font-semibold text-teal">{doctor.role}</p>
              <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted">
                {doctor.bio.map((p) => <p key={p}>{p}</p>)}
              </div>
            </FadeIn>

            <Stagger className="mt-8 grid gap-3 sm:grid-cols-3">
              {doctor.credentials.map((c) => {
                const IconCmp = CREDENTIAL_ICONS[c.icon];
                return (
                  <StaggerItem key={c.title} className="group h-full rounded-3xl bg-white p-5 shadow-soft ring-1 ring-line/60 transition-all duration-500 ease-premium hover:-translate-y-1 hover:shadow-lift">
                    <span className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-aqua/25 to-mint text-teal transition-all duration-500 group-hover:from-teal group-hover:to-aqua group-hover:text-white">
                      <IconCmp size={21} aria-hidden="true" />
                    </span>
                    <span className="mt-4 block font-display font-bold text-navy">{c.title}</span>
                    <span className="mt-1 block text-sm leading-snug text-muted">{c.text}</span>
                  </StaggerItem>
                );
              })}
            </Stagger>

            <FadeIn from="up" className="mt-10">
              <h3 className="font-display text-xl font-bold text-navy">Areas of dental practice</h3>
              <CheckList items={doctor.areas} cols className="mt-5" />
            </FadeIn>

            <FadeIn from="up" className="mt-10" innerClassName="flex flex-wrap gap-3">
              <Button to="/contact#appointment" icon={CalendarCheck} arrow>Book an Appointment</Button>
              <Button href={telHref(clinic.phones[0])} variant="outline" icon={Phone}>Call {clinic.phones[0]}</Button>
            </FadeIn>
          </div>
        </Container>

        {/* Rest of the team */}
        <div id="team-members" className="mt-24 scroll-mt-28 sm:mt-28">
        <Container>
          <SectionHeading align="center" eyebrow="Meet Our Expert Dental Team" title={<>Experienced Hands. <Highlight>Compassionate Care.</Highlight></>}>
            Our dental team brings together professionals across different areas of dentistry. Each doctor contributes their knowledge and experience to help patients receive appropriate dental care.
          </SectionHeading>
          <Stagger className="mt-14 flex flex-wrap justify-center gap-3 sm:gap-6">
            {team.map((d) => <TeamCard key={d.slug} doctor={d} />)}
          </Stagger>
        </Container>
        </div>
      </Section>

      {/* 7. Facilities */}
      <EquipmentSection
        id="facilities"
        className="bg-white"
        image="/photos/clinic/opg.jpg"
        imageAlt="OPG (panoramic X-ray) machine at Srinivasa Dental Care"
        eyebrow="Facilities & Technology"
        title={<>Our Dental <Highlight>Facilities</Highlight> & Equipment</>}
      />

      {/* 8. Why patients trust us */}
      <WhyChooseSection above="white" title={<>Why Patients <Highlight light>Trust Us</Highlight></>} />

      {/* Visit card */}
      <section className="py-20 sm:py-24">
        <Container>
          <FadeIn from="left" innerClassName="flex flex-col items-start justify-between gap-8 rounded-[2.25rem] bg-white p-8 shadow-soft ring-1 ring-line/60 sm:p-10 lg:flex-row lg:items-center">
            <div>
              <h3 className="font-display text-2xl font-extrabold text-navy">Visit {clinic.name}</h3>
              <p className="mt-3 flex gap-2.5 text-muted"><MapPin size={19} className="mt-0.5 shrink-0 text-teal" /> {clinic.address.full}</p>
              <p className="mt-2 flex gap-2.5 text-muted"><Phone size={19} className="mt-0.5 shrink-0 text-teal" /> {clinic.phones.join('  |  ')}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button to="/contact#appointment" icon={CalendarCheck} arrow>Book Appointment</Button>
              <Button href={telHref(clinic.phones[0])} variant="outline" icon={Phone}>Call Now</Button>
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* 9. CTA */}
      <CTASection title="Let Us Help You Smile with Confidence." text="Book a consultation with our experienced dental team at BTM 2nd Stage, Bengaluru." />
    </>
  );
}
