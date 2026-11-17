import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Reveal } from './motion';

const cx = (...c) => c.filter(Boolean).join(' ');

export function Container({ className, children }) {
  return <div className={cx('mx-auto w-full max-w-7xl px-5 sm:px-8', className)}>{children}</div>;
}

const VARIANTS = {
  primary: 'bg-gradient-to-r from-teal to-[#0A7F8C] text-white shadow-glow hover:from-navy hover:to-navy hover:shadow-lift',
  dark: 'bg-gradient-to-r from-navy to-[#0A5568] text-white hover:from-teal hover:to-teal',
  outline: 'bg-white text-navy shadow-soft ring-1 ring-line hover:bg-navy hover:text-white hover:ring-navy',
  light: 'bg-white text-navy hover:bg-aqua',
  'outline-light': 'text-white ring-1 ring-white/35 hover:bg-white hover:text-navy hover:ring-white',
  whatsapp: 'bg-[#1FA855] text-white hover:bg-[#178a45]',
};

const SIZES = {
  sm: 'h-11 px-5 text-sm',
  md: 'h-[3.25rem] px-6 text-[0.95rem]',
  lg: 'h-14 px-7 text-base',
};

/**
 * Pill button. Renders a router <Link> (to), an <a> (href) or a <button>.
 * `arrow` adds an animated arrow that slides on hover.
 */
export function Button({ to, href, variant = 'primary', size = 'md', arrow, icon: Icon, className, children, ...rest }) {
  const classes = cx(
    'group inline-flex items-center justify-center gap-2.5 rounded-full font-semibold tracking-[-0.01em]',
    'transition-all duration-300 ease-premium hover:scale-[1.03] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60',
    VARIANTS[variant], SIZES[size], className,
  );
  const content = (
    <>
      {Icon && <Icon size={18} strokeWidth={2} aria-hidden="true" className="transition-transform duration-300 group-hover:-rotate-6" />}
      <span>{children}</span>
      {arrow && (
        <span className={cx(
          'grid size-7 place-items-center rounded-full transition-colors duration-300',
          variant === 'primary' || variant === 'dark' ? 'bg-white/20' : 'bg-teal/10 text-teal group-hover:bg-white/15 group-hover:text-current',
        )}
        >
          <ArrowRight size={15} strokeWidth={2.2} className="transition-transform duration-300 ease-premium group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      )}
    </>
  );
  if (to) return <Link to={to} className={classes} {...rest}>{content}</Link>;
  if (href) return <a href={href} className={classes} {...rest}>{content}</a>;
  return <button type="button" className={classes} {...rest}>{content}</button>;
}

/** Text link with an arrow that nudges on hover. */
export function ArrowLink({ to, href, children, className, light }) {
  const classes = cx(
    'group inline-flex items-center gap-1.5 font-semibold transition-colors duration-300',
    light ? 'text-aqua hover:text-white' : 'text-teal hover:text-navy',
    className,
  );
  const inner = (
    <>
      {children}
      <ArrowUpRight size={17} className="transition-transform duration-300 ease-premium group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
    </>
  );
  return to ? <Link to={to} className={classes}>{inner}</Link> : <a href={href} className={classes}>{inner}</a>;
}

/**
 * Letter-spaced label above headings, e.g. "— OUR SERVICES —".
 * lines: 'both' | 'after' | 'before'.  tone: 'teal' | 'navy'.
 */
export function Eyebrow({ children, light, className, lines = 'both', tone = 'teal' }) {
  const color = light ? 'text-aqua' : tone === 'navy' ? 'text-navy' : 'text-teal';
  const line = <span className={cx('h-px w-7 shrink-0', light ? 'bg-aqua/70' : tone === 'navy' ? 'bg-navy/60' : 'bg-teal/70')} aria-hidden="true" />;
  return (
    <span className={cx('inline-flex items-center gap-3 text-[0.72rem] font-bold tracking-[0.22em] uppercase', color, className)}>
      {lines !== 'after' && line}
      {children}
      {lines !== 'before' && line}
    </span>
  );
}

/** Wraps the part of a heading to highlight in teal (or aqua on dark backgrounds). */
export function Highlight({ children, light }) {
  return <span className={light ? 'text-aqua' : 'text-teal'}>{children}</span>;
}

/** Section heading block: label, title and optional intro text, revealed on scroll. */
export function SectionHeading({ eyebrow, eyebrowLines = 'both', title, children, align = 'left', light, wide, className, titleClassName }) {
  const center = align === 'center';
  return (
    <Reveal className={cx(center && 'mx-auto text-center', wide ? 'max-w-3xl' : 'max-w-2xl', className)}>
      {eyebrow && <Eyebrow light={light} lines={eyebrowLines}>{eyebrow}</Eyebrow>}
      <h2 className={cx(
        'mt-5 font-display text-[2rem] leading-[1.14] font-extrabold tracking-[-0.03em] text-balance sm:text-[2.5rem] lg:text-[2.75rem]',
        light ? 'text-white' : 'text-navy',
        titleClassName,
      )}
      >
        {title}
      </h2>
      {children && (
        <p className={cx('mt-5 text-base leading-relaxed sm:text-lg', light ? 'text-white/70' : 'text-muted')}>{children}</p>
      )}
    </Reveal>
  );
}

export function Section({ id, className, children }) {
  return <section id={id} className={cx('py-20 sm:py-24 lg:py-28', className)}>{children}</section>;
}

/** Curved divider between sections. `fill` is the colour of the section it flows into. */
export function Wave({ className, flip, fillClass = 'fill-canvas' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 1440 80" preserveAspectRatio="none" className={cx('block h-10 w-full sm:h-16 lg:h-20', flip && 'rotate-180', className)}>
      <path className={fillClass} d="M0 80V36C180 6 360 -6 540 10s360 56 540 54 270-28 360-40V80H0Z" />
    </svg>
  );
}

export { cx };
