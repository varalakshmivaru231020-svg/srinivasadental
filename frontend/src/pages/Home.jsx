import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, Award, Armchair, CalendarCheck, HeartHandshake, ShieldCheck, Smile, Users } from 'lucide-react';
import useSeo from '../hooks/useSeo';
import { useBanner, useSite } from '../context/SiteContext';
import { Tooth } from '../components/DentalIcons';
import { GlossyTooth, Leaves, LaurelBadge, ToothOutline, WaveBackdrop } from '../components/decor';
import { CountUp, EASE, ParallaxImage, Reveal, Stagger, StaggerItem } from '../components/motion';
import { FadeIn } from '../components/clinicPage';
import { Button, Container, Eyebrow, Highlight } from '../components/ui';
import { CTASection, ServiceTile } from '../components/Shared';
import { WhyChooseSection } from '../components/sections';
import Testimonials from '../components/Testimonials';

const HERO_STATS = [
  { Icon: Award, value: '25+', label: 'Years of Experience' },
  { Icon: Users, value: '1,00,000+', label: 'Patients Treated' },
  { Icon: Tooth, value: '10+', label: 'Dental Services' },
  { Icon: Armchair, value: '6', label: 'Treatment Chairs' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

/* ---------------- 1. Hero ---------------- */
function Hero() {
  const banner = useBanner('home');
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 700], [0, 50]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-canvas via-[#EAF7F6] to-mint/70">
      {/* Photo on the right with an organic curved edge */}
      <motion.div
        className="absolute top-0 right-0 bottom-[8%] hidden w-[47%] overflow-hidden bg-mint lg:block xl:w-[53%]"
        style={{ borderBottomLeftRadius: '55% 72%' }}
        initial={reduce ? false : { clipPath: 'inset(0% 0% 0% 100%)' }}
        animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
        transition={{ duration: 1.5, ease: EASE, delay: 0.2 }}
      >
        <motion.img
          src={banner.image}
          alt={banner.alt}
          fetchpriority="high"
          className="absolute inset-x-0 -top-[7%] h-[112%] w-full object-cover"
          style={{ objectPosition: '68% center', ...(reduce ? {} : { y: imageY }) }}
          initial={reduce ? false : { scale: 1.18 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.2, ease: EASE, delay: 0.2 }}
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-transparent" />
      </motion.div>
      <WaveBackdrop className="z-[1]" />

      <motion.div
        className="absolute top-32 right-[5%] z-10 hidden lg:block"
        initial={{ opacity: 0, scale: 0.7, rotate: -12 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1, ease: EASE, delay: 1.1 }}
      >
        <LaurelBadge />
      </motion.div>

      <Container className="relative z-10 pt-32 pb-16 sm:pt-36 lg:pt-44 lg:pb-36">
        <div className="max-w-xl lg:max-w-[29rem] xl:max-w-[33rem]">
          <motion.div initial={{ opacity: 0, x: '-100%' }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.25, ease: 'easeOut' }}>
            <Eyebrow tone="navy" lines="after">Your Smile, Our Priority</Eyebrow>
          </motion.div>
          <motion.h1
            className="mt-5 font-display text-[2.55rem] leading-[1.06] font-extrabold tracking-[-0.04em] text-navy sm:text-[3.3rem] lg:text-[3rem] xl:text-[3.6rem]"
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.25, ease: 'easeOut', delay: 0.12 }}
          >
            Let Us Help You Smile with <span className="text-teal">Confidence.</span>
          </motion.h1>

          <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 0.45 } } }}>
            <motion.p variants={fadeUp} className="mt-6 text-lg leading-relaxed text-ink/80 sm:text-xl">
              Advanced dental care with a personal touch at Srinivasa Dental Care, BTM Layout.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
              <Button to="/contact#appointment" size="lg" icon={CalendarCheck} arrow>Book an Appointment</Button>
              <Link to="/about-us" className="group inline-flex items-center gap-3 font-semibold text-navy">
                <span className="grid size-11 place-items-center rounded-full text-teal ring-2 ring-teal/60 transition-all duration-300 group-hover:bg-teal group-hover:text-white group-hover:ring-teal">
                  <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:rotate-45" />
                </span>
                Explore Our Clinic
              </Link>
            </motion.div>
            <motion.dl variants={fadeUp} className="mt-12 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4 sm:gap-x-5">
              {HERO_STATS.map(({ Icon, value, label }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <Icon size={30} strokeWidth={1.6} className="shrink-0 text-teal" />
                  <div>
                    <dt className="sr-only">{label}</dt>
                    <dd>
                      <CountUp value={value} className="block font-display text-xl leading-tight font-extrabold text-navy" />
                      <span className="block text-[0.72rem] leading-tight text-muted">{label}</span>
                    </dd>
                  </div>
                </div>
              ))}
            </motion.dl>
          </motion.div>
        </div>

        {/* Mobile / tablet photo */}
        <motion.div
          className="relative mt-12 lg:hidden"
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.5 }}
        >
          <div className="aspect-[4/3] overflow-hidden rounded-[2rem] rounded-bl-[5rem] shadow-lift">
            <img src={banner.image} alt={banner.alt} className="h-full w-full object-cover" style={{ objectPosition: 'center 35%' }} />
          </div>
          <LaurelBadge className="absolute -top-6 right-3 size-28 sm:size-32" />
        </motion.div>
      </Container>
    </section>
  );
}

/* ---------------- 2. About our clinic ---------------- */
const ABOUT_POINTS = [
  { Icon: HeartHandshake, label: ['Patient First', 'Approach'] },
  { Icon: ShieldCheck, label: ['Modern', 'Facilities'] },
  { Icon: Smile, label: ['Healthy Smiles', 'for Life'] },
];

function AboutClinic() {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-28">
      <ToothOutline className="-top-8 -right-40 hidden size-[24rem] text-aqua/25 xl:block" />
      <Container className="relative grid items-center gap-14 lg:grid-cols-[1.08fr_1fr] lg:gap-16">
        <div className="relative">
          <svg aria-hidden="true" viewBox="0 0 400 300" className="absolute -bottom-12 -left-8 w-[80%] sm:-left-14">
            <defs>
              <linearGradient id="about-wave" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0" stopColor="#009F9A" />
                <stop offset="1" stopColor="#32D5CE" />
              </linearGradient>
            </defs>
            <path d="M0 300C0 230 20 150 90 130c80-23 120 60 200 70 50 6 85-10 110-30 0 60-40 130-110 130Z" fill="url(#about-wave)" />
            <path d="M-10 250C40 170 110 160 170 185s130 40 210-10" fill="none" stroke="#32D5CE" strokeOpacity="0.5" strokeWidth="3" />
          </svg>
          <FadeIn from="left"><ParallaxImage src="/photos/clinic/treatment-room.jpg" alt="Treatment room with a dental chair at Srinivasa Dental Care" className="aspect-[16/11]" rounded="rounded-[2rem]" position="center" strength={5} /></FadeIn>
          <FadeIn from="up" delay={0.35} className="absolute bottom-6 left-5 sm:bottom-8 sm:-left-6">
            <div className="flex items-center gap-3.5 rounded-2xl bg-white p-4 pr-6 shadow-lift">
              <span className="grid size-12 place-items-center rounded-xl bg-mint text-teal"><Tooth size={26} /></span>
              <span>
                <span className="block font-display font-extrabold text-navy">Trusted Care</span>
                <span className="block text-sm text-muted">for Over 25 Years</span>
              </span>
            </div>
          </FadeIn>
        </div>

        <FadeIn from="right">
          <Eyebrow>About Our Clinic</Eyebrow>
          <h2 className="mt-5 font-display text-[2rem] leading-[1.14] font-extrabold tracking-[-0.03em] text-navy sm:text-[2.5rem]">
            A Legacy of Trusted<br className="hidden sm:block" /> Dental Care <Highlight>Since 1999.</Highlight>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            At Srinivasa Dental Care, we believe in delivering compassionate, comprehensive and modern dental solutions
            for patients of all ages — from routine check-ups to advanced restorative and cosmetic treatment.
          </p>
          <Stagger className="mt-8 grid grid-cols-3 gap-4">
            {ABOUT_POINTS.map(({ Icon, label }) => (
              <StaggerItem key={label[0]} className="group flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-mint text-teal transition-all duration-500 group-hover:bg-teal group-hover:text-white">
                  <Icon size={22} className="transition-transform duration-500 group-hover:scale-110" />
                </span>
                <span className="text-sm leading-snug font-semibold text-navy">{label[0]}<br />{label[1]}</span>
              </StaggerItem>
            ))}
          </Stagger>
          <Button to="/about-us" variant="dark" arrow className="mt-10">Learn More</Button>
        </FadeIn>
      </Container>
    </section>
  );
}

/* ---------------- 3. Services ---------------- */
function ServicesShowcase({ services }) {
  const flagged = services.filter((s) => s.showOnHome);
  const list = (flagged.length ? flagged : services).slice(0, 8);
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-canvas py-20 sm:py-24 lg:py-28">
      <WaveBackdrop className="opacity-80" />
      <Container className="relative grid items-center gap-12 lg:grid-cols-[0.85fr_1.6fr] xl:grid-cols-[0.95fr_0.5fr_1.75fr] xl:gap-8">
        <FadeIn from="left">
          <Eyebrow>Our Services</Eyebrow>
          <h2 className="mt-5 font-display text-[2rem] leading-[1.14] font-extrabold tracking-[-0.03em] text-navy sm:text-[2.4rem]">
            Comprehensive Dental Care for <Highlight>All Ages.</Highlight>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">From routine check-ups to advanced treatments, we&apos;ve got your smile covered.</p>
          <span aria-hidden="true" className="mt-6 block h-1 w-12 rounded-full bg-gradient-to-r from-teal to-aqua" />
          <Button to="/services" variant="dark" arrow className="mt-8">View All Services</Button>
        </FadeIn>
        <Reveal from="scale" className="hidden xl:block">
          <GlossyTooth className="mx-auto w-full max-w-[13rem]" />
        </Reveal>
        <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {list.map((s) => <ServiceTile key={s.slug} service={s} />)}
        </Stagger>
      </Container>
    </section>
  );
}

/* ---------------- 5 + 6. Technology & testimonials ---------------- */
function TechAndTestimonials() {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-28">
      <Leaves className="top-6 right-2 size-28 sm:size-36" />
      <Container className="relative grid gap-16 lg:grid-cols-2 lg:gap-0">
        <div className="grid items-center gap-8 sm:grid-cols-[0.8fr_1.2fr] lg:border-r lg:border-line lg:pr-10 xl:pr-12">
          <FadeIn from="left" innerClassName="group overflow-hidden rounded-[1.75rem] shadow-soft">
            <img src="/photos/clinic/dental-xray.jpg" alt="Portable dental X-ray unit and digital X-ray on a laptop at Srinivasa Dental Care" loading="lazy" className="aspect-[4/5] w-full object-cover transition-transform duration-[1400ms] ease-premium group-hover:scale-105" />
          </FadeIn>
          <FadeIn from="right" delay={0.1}>
            <Eyebrow lines="after">Advanced Technology</Eyebrow>
            <h2 className="mt-5 font-display text-[1.6rem] leading-[1.18] font-extrabold tracking-[-0.03em] text-navy sm:text-[1.55rem] xl:text-[1.8rem]">
              Modern Equipment for Accurate Diagnosis and Effective Treatment.
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              Intraoral scanner, OPG imaging, intraoral camera and laser dentistry — modern equipment for precise diagnosis and comfortable treatment.
            </p>
            <Button to="/about-us#facilities" variant="outline" size="sm" arrow className="mt-7">Explore Technology</Button>
          </FadeIn>
        </div>
        <div className="lg:pl-12">
          <Testimonials />
        </div>
      </Container>
    </section>
  );
}

export default function Home() {
  const { services } = useSite();
  useSeo({
    title: 'Srinivasa Dental Care | Trusted Dental Clinic in BTM Layout, Bangalore — Since 1999',
    description: 'Advanced dental care with a personal touch at Srinivasa Dental Care, BTM Layout, Bengaluru. 25+ years, 1,00,000+ patients treated — implants, root canal, braces, aligners, smile design and more.',
    keywords: 'dental clinic in BTM Layout, dentist in BTM 2nd Stage, Srinivasa Dental Care, dental clinic Bangalore',
  });

  return (
    <>
      <Hero />
      <AboutClinic />
      <ServicesShowcase services={services} />
      <WhyChooseSection above="white" />
      <TechAndTestimonials />
      <CTASection above="white" />
    </>
  );
}
