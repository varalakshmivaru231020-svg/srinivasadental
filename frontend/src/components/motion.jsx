import { Children, useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';

/** Shared easing for every animation on the site — a soft, premium ease-out. */
export const EASE = [0.22, 1, 0.36, 1];

const OFFSETS = {
  up: { y: 36 },
  down: { y: -36 },
  left: { x: -56, y: 12 },
  right: { x: 56, y: 12 },
  scale: { scale: 0.96, y: 24 },
  none: {},
};

/** Fades an element in (with a gentle slide) when it scrolls into view. Runs once. */
export function Reveal({ as = 'div', from = 'up', delay = 0, duration = 0.9, amount = 0.2, className, children, ...rest }) {
  const Cmp = motion[as];
  return (
    <Cmp
      className={className}
      initial={{ opacity: 0, ...OFFSETS[from] }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, amount }}
      transition={{ duration, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </Cmp>
  );
}

const containerVariants = (stagger, delay) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

export const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
};

/**
 * Parent that reveals its <StaggerItem> children one after another.
 * It is re-keyed by its children, so when the set of items changes (another service page, data arriving from the
 * admin panel) the group re-runs its reveal — otherwise newly added items would stay hidden.
 */
export function Stagger({ as = 'div', stagger = 0.08, delay = 0, amount = 0.1, className, children, ...rest }) {
  const Cmp = motion[as];
  const itemsKey = Children.toArray(children).map((c) => c.key).join('|');
  return (
    <Cmp
      key={itemsKey}
      className={className}
      variants={containerVariants(stagger, delay)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      {...rest}
    >
      {children}
    </Cmp>
  );
}

export function StaggerItem({ as = 'div', className, children, ...rest }) {
  const Cmp = motion[as];
  return <Cmp className={className} variants={itemVariants} {...rest}>{children}</Cmp>;
}

/** True on large screens only — parallax is skipped on phones and tablets for smooth scrolling. */
function useIsDesktop() {
  const query = '(min-width: 1024px)';
  const [match, setMatch] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return match;
}

/**
 * Rounded image frame with a subtle scroll parallax (desktop, motion allowed) and a slow zoom on hover.
 * The frame itself can slide in from a side when it enters the viewport.
 */
export function ParallaxImage({ src, alt, className = '', imgClassName = '', from, strength = 7, position = 'center', rounded = 'rounded-[2rem]', children }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const desktop = useIsDesktop();
  const enabled = desktop && !reduce;
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`]);

  const frame = (
    <div ref={ref} className={`group relative overflow-hidden bg-mint ${rounded} ${className}`}>
      <motion.div className="absolute inset-0" style={enabled ? { y, scale: 1 + strength / 50 } : undefined}>
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={`h-full w-full object-cover transition-transform duration-[1400ms] ease-premium group-hover:scale-[1.05] ${imgClassName}`}
          style={{ objectPosition: position }}
        />
      </motion.div>
      {children}
    </div>
  );

  if (!from) return frame;
  return <Reveal from={from} duration={1.1}>{frame}</Reveal>;
}

/** Counts up to a value such as "5,000+" when it scrolls into view. */
export function CountUp({ value, className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const match = String(value).match(/^([\d,]+)(.*)$/);
  const target = match ? Number(match[1].replace(/,/g, '')) : 0;
  const suffix = match ? match[2] : '';
  const [n, setN] = useState(reduce || !match ? target : 0);

  useEffect(() => {
    if (!inView || reduce || !match) return undefined;
    const controls = animate(0, target, { duration: 1.8, ease: EASE, onUpdate: (v) => setN(Math.round(v)) });
    return () => controls.stop();
  }, [inView, reduce, target]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!match) return <span className={className}>{value}</span>;
  return (
    <span ref={ref} className={className} aria-label={String(value)}>
      <span aria-hidden="true">{n.toLocaleString('en-IN')}{suffix}</span>
    </span>
  );
}
