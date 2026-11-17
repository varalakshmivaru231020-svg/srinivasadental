import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check, ChevronRight, Phone, Plus } from 'lucide-react';
import Icon from './Icon';
import { PhoneSolidIcon, WhatsAppIcon } from './BrandIcons';
import { Tooth } from './DentalIcons';
import { WaveBackdrop } from './decor';
import { useSite, telHref } from '../context/SiteContext';
import { serviceTag } from '../data/serviceTags';
import { EASE, Reveal, StaggerItem } from './motion';
import { Button, Container, Eyebrow, Wave, cx } from './ui';

export const whatsappLink = (clinic) => (clinic.whatsapp
  ? `https://wa.me/${clinic.whatsapp}?text=${encodeURIComponent(`Hello ${clinic.name}, I would like to book an appointment.`)}`
  : '');

/** Soft aqua glow used behind hero areas. */
export function Glow({ className }) {
  return <div aria-hidden="true" className={cx('pointer-events-none absolute rounded-full bg-aqua/20 blur-3xl', className)} />;
}

/** Thin concentric rings — a quiet layered background element. */
export function Rings({ className, count = 4 }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 200 200" fill="none" className={cx('pointer-events-none absolute', className)}>
      {Array.from({ length: count }, (_, i) => 96 - i * 18).map((r) => (
        <circle key={r} cx="100" cy="100" r={r} stroke="currentColor" strokeWidth="0.5" />
      ))}
    </svg>
  );
}

/** Photo with a large organic curve on its lower-left edge, revealed from the right with a slow zoom. */
export function CurvedHeroImage({ src, alt, position = 'center', className }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={cx('overflow-hidden bg-mint', className)}
      style={{ borderBottomLeftRadius: '55% 72%' }}
      initial={reduce ? false : { clipPath: 'inset(0% 0% 0% 100%)' }}
      animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      transition={{ duration: 1.5, ease: EASE, delay: 0.2 }}
    >
      <motion.img
        src={src}
        alt={alt}
        fetchpriority="high"
        className="h-full w-full object-cover"
        style={{ objectPosition: position }}
        initial={reduce ? false : { scale: 1.18 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.2, ease: EASE, delay: 0.2 }}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-white/35 via-transparent to-transparent" />
    </motion.div>
  );
}

/**
 * Inner-page hero in the same style as the home hero: soft aqua gradient, flowing waves,
 * text on the left and (optionally) a curved photograph on the right.
 */
export function PageHero({ crumbs = [], eyebrow, title, children, actions, image, imageAlt = '', imagePosition = 'center', imageFit = 'cover', badge }) {
  // imageFit="full" shows the whole photo (nothing cropped) in a rounded frame beside the text.
  const full = Boolean(image) && imageFit === 'full';
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-canvas via-[#EAF7F6] to-mint/70">
      {image && !full && <CurvedHeroImage src={image} alt={imageAlt} position={imagePosition} className="absolute top-0 right-0 bottom-[10%] hidden w-[46%] lg:block" />}
      <WaveBackdrop className="z-[1]" />
      {image && !full && badge && (
        <motion.div
          className="absolute bottom-[14%] left-[50%] z-10 hidden lg:block"
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 1 }}
        >
          {badge}
        </motion.div>
      )}
      <Container className={cx('relative z-10 pt-32 pb-20 sm:pt-36 lg:pt-44 lg:pb-32', full && 'grid items-center gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-14')}>
        <div className={full ? 'max-w-xl' : image ? 'max-w-xl lg:max-w-[28rem] xl:max-w-[34rem]' : 'max-w-3xl'}>
          <motion.nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1.5 text-sm text-muted"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, ease: EASE }}
          >
            <Link to="/" className="transition-colors hover:text-teal">Home</Link>
            {crumbs.map((c) => (
              <span key={c.label} className="inline-flex items-center gap-1.5">
                <ChevronRight size={14} aria-hidden="true" />
                {c.to ? <Link to={c.to} className="transition-colors hover:text-teal">{c.label}</Link> : <span aria-current="page" className="font-medium text-navy">{c.label}</span>}
              </span>
            ))}
          </motion.nav>
          <motion.div
            className="mt-7"
            initial={{ opacity: 0, x: -48, y: 14 }} animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.1 }}
          >
            {eyebrow && <Eyebrow tone="navy" lines="after">{eyebrow}</Eyebrow>}
            <h1 className="mt-5 font-display text-[2.35rem] leading-[1.08] font-extrabold tracking-[-0.035em] text-balance text-navy sm:text-5xl lg:text-[3rem] xl:text-[3.3rem]">{title}</h1>
          </motion.div>
          {children && (
            <motion.p
              className="mt-6 text-lg leading-relaxed text-muted"
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
            >
              {children}
            </motion.p>
          )}
          {actions && (
            <motion.div
              className="mt-9 flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.45 }}
            >
              {actions}
            </motion.div>
          )}
        </div>
        {full && (
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 48 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.25 }}
          >
            <img src={image} alt={imageAlt} fetchpriority="high" className="block h-auto w-full rounded-[2rem] shadow-lift ring-4 ring-white/80" />
            {badge && <div className="absolute -bottom-6 left-4 sm:-left-6">{badge}</div>}
          </motion.div>
        )}
        {image && !full && (
          <motion.div
            className="relative mt-12 lg:hidden"
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.4 }}
          >
            <div className="aspect-[4/3] overflow-hidden rounded-[2rem] shadow-lift">
              <img src={image} alt={imageAlt} className="h-full w-full object-cover" style={{ objectPosition: imagePosition }} />
            </div>
            {badge && <div className="absolute -bottom-6 left-4">{badge}</div>}
          </motion.div>
        )}
      </Container>
    </section>
  );
}

/** Floating white badge with an icon, used over images. */
export function Badge({ icon: IconCmp, title, text, dark }) {
  return (
    <div className={cx('flex items-center gap-4 rounded-3xl p-4 pr-6 shadow-lift', dark ? 'bg-navy text-white' : 'bg-white/95 backdrop-blur')}>
      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-teal to-aqua text-white"><IconCmp size={22} /></span>
      <span>
        <span className={cx('block font-display text-lg leading-tight font-extrabold', dark ? 'text-white' : 'text-navy')}>{title}</span>
        <span className={cx('block text-sm', dark ? 'text-white/70' : 'text-muted')}>{text}</span>
      </span>
    </div>
  );
}

export function CheckList({ items, cols, light, className }) {
  return (
    <ul className={cx('grid gap-x-8 gap-y-3.5', cols && 'sm:grid-cols-2', className)}>
      {items.map((i) => (
        <li key={i} className="flex items-start gap-3">
          <span className={cx('mt-0.5 grid size-6 shrink-0 place-items-center rounded-full', light ? 'bg-teal text-white' : 'bg-mint text-teal')}>
            <Check size={14} strokeWidth={2.6} aria-hidden="true" />
          </span>
          <span className={cx('leading-relaxed', light ? 'text-white/85' : 'text-ink/85')}>{i}</span>
        </li>
      ))}
    </ul>
  );
}

export const serviceHref = (s) => (s.detailed ? `/services/${s.slug}` : `/services#${s.slug}`);

/** Service card with icon — the whole card is a link. The icon tile fills with teal on hover. */
export function ServiceCard({ service, index }) {
  return (
    <StaggerItem className="h-full">
      <Link
        to={serviceHref(service)}
        className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white p-7 shadow-soft ring-1 ring-line/70 transition-all duration-500 ease-premium hover:-translate-y-2 hover:shadow-lift hover:ring-teal/30"
      >
        <span aria-hidden="true" className="absolute -top-20 -right-20 size-44 rounded-full bg-mint-soft transition-transform duration-700 ease-premium group-hover:scale-[1.6]" />
        <div className="relative mb-9 grid size-16 place-items-center overflow-hidden rounded-2xl bg-mint text-teal">
          <span aria-hidden="true" className="absolute inset-0 origin-bottom scale-y-0 bg-gradient-to-br from-teal to-aqua transition-transform duration-500 ease-premium group-hover:scale-y-100" />
          <Icon name={service.icon} size={30} className="relative transition-all duration-500 ease-premium group-hover:-translate-y-0.5 group-hover:rotate-[-6deg] group-hover:text-white" />
        </div>
        {index != null && (
          <span className="absolute top-7 right-7 font-display text-sm font-bold text-navy/20">{String(index + 1).padStart(2, '0')}</span>
        )}
        <h3 className="relative font-display text-xl font-bold tracking-[-0.02em] text-navy">{service.title}</h3>
        <p className="relative mt-3 flex-1 text-[0.95rem] leading-relaxed text-muted">{service.short}</p>
        <span className="relative mt-7 inline-flex items-center gap-2 text-sm font-semibold text-teal">
          Learn more
          <ArrowRight size={16} className="transition-transform duration-300 ease-premium group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </Link>
    </StaggerItem>
  );
}

/** Compact centred service tile (home page grid): icon, name and a short subtitle. */
export function ServiceTile({ service }) {
  return (
    <StaggerItem className="h-full">
      <Link
        to={serviceHref(service)}
        className="group flex h-full flex-col items-center rounded-2xl bg-white px-3 pt-6 pb-5 text-center shadow-soft ring-1 ring-line/60 transition-all duration-500 ease-premium hover:-translate-y-1.5 hover:shadow-lift hover:ring-teal/30"
      >
        <span className="grid size-14 place-items-center rounded-2xl bg-mint/80 text-teal transition-all duration-500 group-hover:bg-gradient-to-br group-hover:from-teal group-hover:to-aqua group-hover:text-white">
          <Icon name={service.icon} size={30} className="transition-transform duration-500 ease-premium group-hover:-translate-y-0.5 group-hover:scale-110" />
        </span>
        <span className="mt-4 font-display text-[0.95rem] leading-tight font-bold text-navy">{service.title}</span>
        <span className="mt-1.5 text-xs leading-snug text-muted">{serviceTag(service)}</span>
      </Link>
    </StaggerItem>
  );
}

/** Small feature card with an aqua icon. */
export function FeatureCard({ icon: IconCmp, iconName, title, text }) {
  return (
    <StaggerItem className="group flex h-full gap-4 rounded-3xl bg-white p-5 shadow-soft ring-1 ring-line/60 transition-all duration-500 ease-premium hover:-translate-y-1 hover:shadow-lift">
      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-aqua/25 to-mint text-teal transition-all duration-500 group-hover:from-teal group-hover:to-aqua group-hover:text-white">
        {IconCmp ? <IconCmp size={22} className="transition-transform duration-500 group-hover:scale-110" /> : <Icon name={iconName} size={22} />}
      </span>
      <span>
        <span className="block font-display font-bold text-navy">{title}</span>
        <span className="mt-1 block text-sm leading-relaxed text-muted">{text}</span>
      </span>
    </StaggerItem>
  );
}

export function FAQ({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} className={cx('overflow-hidden rounded-3xl bg-white transition-shadow duration-500', isOpen ? 'shadow-soft ring-1 ring-teal/20' : 'ring-1 ring-line/70')}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? -1 : i)}
              className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left font-display text-[1.05rem] font-bold text-navy transition-colors hover:text-teal sm:px-7"
            >
              {f.q}
              <span className={cx(
                'grid size-9 shrink-0 place-items-center rounded-full transition-all duration-500 ease-premium',
                isOpen ? 'rotate-45 bg-teal text-white' : 'bg-mint text-teal',
              )}
              >
                <Plus size={18} aria-hidden="true" />
              </span>
            </button>
            <div className={cx('grid transition-[grid-template-rows] duration-500 ease-premium', isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
              <div className="overflow-hidden">
                <p className="px-6 pb-6 leading-relaxed text-muted sm:px-7">{f.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const FILL = { canvas: 'fill-canvas', white: 'fill-white', navy: 'fill-navy' };

/**
 * Full-width teal → navy appointment band (leads straight into the footer).
 * `above` = background colour of the section before it, so the curved top edge blends in.
 */
export function CTASection({
  title = 'Your Smile Deserves the Best Care.',
  text = 'Take the first step towards a healthier, brighter smile.',
  above = 'canvas',
}) {
  const { clinic } = useSite();
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#0A8A93] via-teal-dark to-navy">
      <Wave flip fillClass={FILL[above]} className="absolute inset-x-0 top-0" />
      <div aria-hidden="true" className="absolute -top-10 left-1/4 size-96 rounded-full bg-aqua/20 blur-3xl" />
      <Rings className="top-1/2 -right-32 size-[30rem] -translate-y-1/2 text-white/[0.08]" count={5} />
      <Container className="relative flex flex-col gap-10 pt-24 pb-16 sm:pt-28 lg:flex-row lg:items-center lg:justify-between lg:pt-32 lg:pb-20">
        <Reveal from="left" className="flex items-center gap-6">
          <span className="hidden shrink-0 text-aqua drop-shadow-[0_0_18px_rgba(50,213,206,0.65)] sm:block">
            <Tooth size={84} strokeWidth={1.3} />
          </span>
          <div>
            <h2 className="font-display text-[2rem] leading-[1.12] font-extrabold tracking-[-0.03em] text-balance text-white sm:text-4xl lg:text-[2.6rem]">{title}</h2>
            <p className="mt-3 max-w-xl text-lg text-white/75">{text}</p>
          </div>
        </Reveal>
        <Reveal from="right" delay={0.15} className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <Button to="/contact#appointment" variant="light" size="lg" arrow>Book Appointment</Button>
          <Button href={telHref(clinic.phones[0])} variant="outline-light" size="lg" icon={Phone}>{clinic.phones[0]}</Button>
        </Reveal>
      </Container>
    </section>
  );
}

/**
 * Floating WhatsApp and call buttons (bottom-right, every page and screen size).
 * On desktop a label slides out on hover or keyboard focus.
 */
export function FloatingActions() {
  const { clinic } = useSite();
  const wa = whatsappLink(clinic);
  const phone = clinic.phones[0];
  const link = 'group relative rounded-full focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-navy';
  const circle = 'relative grid size-14 place-items-center rounded-full text-white transition-transform duration-300 ease-premium group-hover:scale-110 group-active:scale-95';
  const label = 'pointer-events-none absolute top-1/2 right-full mr-3 hidden -translate-y-1/2 translate-x-2 rounded-full bg-white px-4 py-2 text-sm font-semibold whitespace-nowrap text-navy opacity-0 shadow-lift ring-1 ring-line/70 transition duration-300 ease-premium group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 lg:block';
  return (
    <div className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      {wa && (
        <a href={wa} target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp (opens in a new tab)" className={link}>
          <span aria-hidden="true" className="fab-pulse absolute inset-0 rounded-full bg-[#25D366]" />
          <span className={cx(circle, 'bg-[#25D366] shadow-[0_14px_28px_-10px_rgb(37_211_102/0.8)]')}>
            <WhatsAppIcon size={30} />
          </span>
          <span className={label}>Chat on WhatsApp</span>
        </a>
      )}
      {phone && (
        <a href={telHref(phone)} aria-label={`Call ${clinic.name} on ${phone}`} className={link}>
          <span className={cx(circle, 'bg-gradient-to-br from-teal to-teal-dark shadow-[0_14px_28px_-10px_rgb(0_159_154/0.8)]')}>
            <PhoneSolidIcon size={26} className="fab-ring" />
          </span>
          <span className={label}>Call {phone}</span>
        </a>
      )}
    </div>
  );
}
