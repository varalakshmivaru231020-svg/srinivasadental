import { useId } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { CalendarCheck, CalendarDays, ChevronRight, ShieldCheck, Stethoscope } from 'lucide-react';
import { useBanner, useSite } from '../context/SiteContext';
import { EASE } from './motion';
import { Button, Container, cx } from './ui';
import { GlossyTooth, GreenLeaves, WaveBackdrop } from './decor';
import { Tooth } from './DentalIcons';

// WebP copies of the built-in photo (data/banners.js → about). A photo set in the admin panel → Banners is shown on its own.
const PHOTO_WEBP = '/photos/clinic/clinic-front.webp';
const PHOTO_WEBP_800 = '/photos/clinic/clinic-front-800.webp';

// Shapes in 0–1 units of the photo box (1402 × 1122). The left edge curves gently so the
// clinic sign, door and doctor's board all stay visible.
const EDGE = 'M0.12,0.07 C0.42,0.02 0.72,0.035 1,0 L1,0.95 C0.82,1 0.6,0.99 0.38,0.93 C0.2,0.88 0.07,0.78 0.035,0.6 C0.005,0.44 0.0,0.2 0.12,0.07 Z';
const RIBBON = 'M0.12,0.07 C0.0,0.2 0.005,0.44 0.035,0.6 C0.07,0.78 0.2,0.88 0.38,0.93 C0.6,0.99 0.82,1 1,0.95';
const RIBBON_OUTER = 'M0.075,0.02 C-0.045,0.18 -0.045,0.47 -0.01,0.64 C0.03,0.84 0.18,0.96 0.38,1.005 C0.6,1.055 0.82,1.06 1,1.025';
const SWOOSH = 'M-0.1,0.9 C0.06,1.0 0.2,1.08 0.42,1.08 C0.66,1.08 0.86,1.04 1.02,0.99 L1.02,1.15 C0.8,1.19 0.52,1.2 0.26,1.16 C0.08,1.13 -0.04,1.05 -0.1,0.9 Z';

/** The clinic photo in a flowing frame: teal ribbons, a swoosh underneath and a floating tooth. */
function PhotoArt({ className, priority }) {
  const banner = useBanner('about');
  const uid = useId().replace(/:/g, '');
  const reduce = useReducedMotion();
  const draw = (delay) => (reduce ? {} : { initial: { pathLength: 0 }, animate: { pathLength: 1 }, transition: { duration: 1.6, ease: EASE, delay } });
  return (
    <div data-photo-art className={cx('relative aspect-[1402/1122]', className)}>
      <svg aria-hidden="true" width="0" height="0" className="absolute">
        <defs>
          <clipPath id={`ah-clip-${uid}`} clipPathUnits="objectBoundingBox"><path d={EDGE} /></clipPath>
        </defs>
      </svg>

      {/* Swoosh and ribbons (drawn behind and around the photo) */}
      <svg aria-hidden="true" viewBox="0 0 1 1" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <linearGradient id={`ah-sw-${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#32D5CE" stopOpacity="0.35" />
            <stop offset="0.45" stopColor="#0FA9A2" />
            <stop offset="1" stopColor="#0B7F86" />
          </linearGradient>
          <linearGradient id={`ah-rb-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#32D5CE" />
            <stop offset="1" stopColor="#009F9A" />
          </linearGradient>
        </defs>
        <motion.path
          d={SWOOSH}
          fill={`url(#ah-sw-${uid})`}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.5 }}
        />
        <motion.path d={RIBBON_OUTER} fill="none" stroke="#32D5CE" strokeOpacity="0.55" strokeWidth="14" strokeLinecap="round" vectorEffect="non-scaling-stroke" {...draw(0.6)} />
      </svg>

      {/* The shadow and the reveal sit on this layer, so the browser animates it without redrawing the shadow */}
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{ filter: 'drop-shadow(0 30px 34px rgb(7 52 73 / 0.24)) drop-shadow(0 8px 12px rgb(0 159 154 / 0.12))' }}
        initial={reduce ? false : { opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
      >
        <picture>
          {!banner.isCustom && <source type="image/webp" srcSet={`${PHOTO_WEBP_800} 800w, ${PHOTO_WEBP} 1402w`} sizes="(min-width: 1024px) 50vw, 94vw" />}
          <img
            src={banner.image}
            alt={banner.alt}
            width="1402"
            height="1122"
            decoding="async"
            fetchpriority={priority ? 'high' : undefined}
            loading={priority ? undefined : 'lazy'}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ clipPath: `url(#ah-clip-${uid})` }}
          />
        </picture>
      </motion.div>

      <svg aria-hidden="true" viewBox="0 0 1 1" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
        <motion.path d={EDGE} fill="none" stroke="#009F9A" strokeOpacity="0.4" strokeWidth="1.5" vectorEffect="non-scaling-stroke" {...draw(0.3)} />
        <motion.path d={RIBBON} fill="none" stroke={`url(#ah-rb-${uid})`} strokeWidth="9" strokeLinecap="round" vectorEffect="non-scaling-stroke" {...draw(0.4)} />
        <motion.path d={RIBBON} fill="none" stroke="#ffffff" strokeOpacity="0.9" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" {...draw(0.55)} />
      </svg>

      <div className="absolute -bottom-[10%] -left-[10%] aspect-[240/280] w-[21%]">
        <GlossyTooth ring="gold" className="h-full w-full" />
      </div>
    </div>
  );
}

/** Gold brush stroke under part of the heading. */
function BrushUnderline() {
  const uid = useId().replace(/:/g, '');
  const reduce = useReducedMotion();
  return (
    <motion.svg
      aria-hidden="true"
      viewBox="0 0 320 28"
      preserveAspectRatio="none"
      className="pointer-events-none absolute -bottom-[0.3em] left-[40%] h-[0.3em] w-[66%] origin-left"
      initial={reduce ? false : { scaleX: 0, opacity: 0 }}
      animate={{ scaleX: 1, opacity: 1 }}
      transition={{ duration: 1, ease: EASE, delay: 0.9 }}
    >
      <defs>
        <linearGradient id={`ah-gold-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#E7A93A" stopOpacity="0.2" />
          <stop offset="0.35" stopColor="#E7A93A" />
          <stop offset="1" stopColor="#F6D27A" />
        </linearGradient>
      </defs>
      <path d="M4 20C70 10 170 5 316 6c-40 4-96 7-150 11C110 21 56 24 4 26Z" fill={`url(#ah-gold-${uid})`} />
      <path d="M150 22c60-5 120-8 166-8" stroke="#F6D27A" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />
    </motion.svg>
  );
}

const HIGHLIGHTS = [
  { Icon: CalendarDays, title: '25+ Years', text: 'of Excellence' },
  { Icon: Stethoscope, title: 'Experienced', text: 'Dentists' },
  { Icon: Tooth, title: 'Patient-Centered', text: 'Care' },
];

/** About page hero: "Your Smile, Our Legacy of Care." with the clinic's entrance photo. */
export default function AboutHero() {
  const { clinic } = useSite();
  const reduce = useReducedMotion();
  const enter = (delay, from = { y: 18 }) => (reduce ? {} : { initial: { opacity: 0, ...from }, animate: { opacity: 1, x: 0, y: 0 }, transition: { duration: 0.9, ease: EASE, delay } });

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-canvas via-[#EAF7F6] to-mint/70 lg:min-h-[calc(132px+min(40vw,768px)+150px)]">
      <WaveBackdrop className="z-0 opacity-70" />
      <GreenLeaves className="-top-6 -right-10 z-20 hidden w-44 rotate-[18deg] opacity-90 blur-[0.5px] lg:block" />
      <GreenLeaves flip className="-bottom-10 -left-12 z-20 hidden w-48 -rotate-[150deg] opacity-60 blur-[1.5px] lg:block" />

      {/* Photo, desktop: right side, bleeding to the edge of the screen */}
      <div className="absolute top-[132px] right-0 z-10 hidden w-[50%] max-w-[960px] lg:block">
        <PhotoArt priority />
      </div>

      <Container className="relative z-10 pt-32 pb-8 sm:pt-36 sm:pb-10 lg:pt-40 lg:pb-36">
        <div className="max-w-xl lg:max-w-[28rem] xl:max-w-[33rem]">
          <motion.nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-muted" {...enter(0, { y: 0 })}>
            <Link to="/" className="transition-colors hover:text-teal">Home</Link>
            <ChevronRight size={14} aria-hidden="true" />
            <span aria-current="page" className="font-medium text-navy">About Us</span>
          </motion.nav>

          <motion.div className="mt-7 flex items-center gap-4" {...enter(0.1, { x: -30 })}>
            <span className="inline-flex shrink-0 items-center gap-2.5 rounded-full bg-mint/90 py-1.5 pr-5 pl-1.5 whitespace-nowrap shadow-[0_10px_24px_-16px_rgb(0_159_154/0.6)] ring-1 ring-teal/15">
              <span className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-teal to-teal-dark text-white"><ShieldCheck size={17} aria-hidden="true" /></span>
              <span className="font-display text-[0.95rem] font-bold text-teal-dark">Trusted Since {clinic.established || 1999}</span>
            </span>
            <span aria-hidden="true" className="h-px min-w-0 max-w-36 flex-1 bg-gradient-to-r from-teal/40 to-transparent" />
          </motion.div>

          <motion.h1
            className="mt-6 font-display text-[clamp(1.8rem,8.4vw,2.6rem)] leading-[1.08] font-extrabold tracking-[-0.04em] text-navy sm:text-[2.9rem] md:text-[3.15rem] lg:text-[2.75rem] xl:text-[3.15rem]"
            {...enter(0.18, { x: -40 })}
          >
            Your Smile,
            <br />
            <span className="relative inline-block whitespace-nowrap text-teal">
              {/* Gradient text; every colour stays dark enough to read on the mint background */}
              <span className="bg-gradient-to-r from-[#04707A] via-teal to-[#00A8A2] bg-clip-text text-transparent">Our Legacy of Care.</span>
              <BrushUnderline />
            </span>
          </motion.h1>

          <motion.div aria-hidden="true" className="mt-9 h-px w-full max-w-md bg-gradient-to-r from-teal/35 via-teal/15 to-transparent" {...enter(0.3, { y: 0 })} />

          <motion.p className="mt-6 text-lg leading-relaxed text-muted" {...enter(0.35)}>
            At {clinic.name}, we believe every smile deserves <strong className="font-semibold text-navy">the best care</strong> — delivered with experience, <strong className="font-semibold text-navy">honesty</strong> and a personal touch.
          </motion.p>

          {/* Phones: one row per highlight. Tablet and up: three columns with thin dividers. */}
          <motion.ul
            className="mt-9 flex flex-col divide-y divide-line/80 sm:flex-row sm:divide-x sm:divide-y-0"
            initial={reduce ? false : 'hidden'}
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 0.45 } } }}
          >
            {HIGHLIGHTS.map(({ Icon, title, text }) => (
              <motion.li
                key={title}
                className="group flex items-center gap-4 py-3.5 first:pt-0 last:pb-0 sm:block sm:px-5 sm:py-0 sm:first:pl-0 sm:last:pr-0 lg:px-4 xl:px-6"
                variants={{ hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } } }}
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-mint text-teal shadow-[0_10px_22px_-14px_rgb(0_159_154/0.7)] ring-1 ring-teal/10 transition-transform duration-500 ease-premium group-hover:-translate-y-1 sm:size-14">
                  <Icon size={24} strokeWidth={1.8} aria-hidden="true" />
                </span>
                <span className="block">
                  <span className="block font-display text-base leading-tight font-bold text-navy sm:mt-3 sm:text-lg sm:whitespace-nowrap lg:text-base xl:text-[1.05rem]">{title}</span>
                  <span className="block text-sm text-muted sm:text-base">{text}</span>
                </span>
              </motion.li>
            ))}
          </motion.ul>

          <motion.div className="mt-10" {...enter(0.55)}>
            <Button to="/contact#appointment" icon={CalendarCheck} arrow>Book an Appointment</Button>
          </motion.div>
        </div>

        {/* Photo, phone and tablet: below the text. The bottom margin (a share of the width) leaves room for the swoosh. */}
        <div className="relative mt-16 mb-[17%] pl-[6%] lg:hidden">
          <PhotoArt />
        </div>
      </Container>
    </section>
  );
}
