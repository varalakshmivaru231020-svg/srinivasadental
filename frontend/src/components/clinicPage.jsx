import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { cx } from './ui';
import { useBanner } from '../context/SiteContext';

const FROM = {
  up: { y: '100%' },
  down: { y: '-100%' },
  left: { x: '-100%' },
  right: { x: '100%' },
  'slide-left': { x: '-100%' },
  'slide-right': { x: '100%' },
  rotate: { rotate: 45 },
};

/**
 * Entrance animations from the clinic's original website, over 1.25 s: fade in while travelling the
 * element's own width or height, slide in without fading (`slide-*`), or swing up from the bottom-left
 * corner (`rotate`). The outer box stays still, so visibility is measured where the element ends up
 * and not where it starts off-screen.
 */
export function FadeIn({ from = 'up', amount = 0.15, delay = 0, className, innerClassName = 'h-full', children }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount });
  const transition = { duration: 1.25, ease: 'easeOut', delay };
  if (from.startsWith('slide')) transition.opacity = { duration: 0 };
  return (
    <div ref={ref} className={className}>
      <motion.div
        className={innerClassName}
        style={from === 'rotate' ? { originX: 0, originY: 1 } : undefined}
        initial={{ opacity: 0, ...FROM[from] }}
        animate={inView ? { opacity: 1, x: '0%', y: '0%', rotate: 0 } : undefined}
        transition={transition}
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Full-width page banner with a large centred title. Pass `image`, or `tint` for the plain teal banner.
 * Or pass `page` (a key from data/banners.js) to show that page's banner from the admin panel → Banners:
 * its photo, or the plain teal banner when it has none, and its title unless `title` is passed.
 */
export function ClinicBanner({ page, ...props }) {
  const banner = useBanner(page);
  if (!banner) return <BannerView {...props} />;
  return <BannerView title={props.title ?? banner.title} image={banner.image} tint={!banner.image} />;
}

function BannerView({ title, image, tint }) {
  return (
    <section className="relative overflow-hidden bg-clinic-bg">
      {image && <img src={image} alt="" className="absolute inset-0 size-full object-cover" />}
      {tint && <div aria-hidden="true" className="absolute inset-0 bg-clinic-teal/35" />}
      <FadeIn from="right" className="relative px-5 pt-36 pb-16 text-center lg:pt-[12.5rem] lg:pb-28">
        <h1 className="font-poppins text-[2.75rem] leading-none font-semibold tracking-[-2px] text-balance text-clinic-navy sm:text-6xl lg:text-[4.5rem]">{title}</h1>
      </FadeIn>
    </section>
  );
}

/** Small letter-spaced teal label above a heading. */
export function ClinicLabel({ children }) {
  return <p className="font-poppins text-sm leading-tight tracking-[2px] text-clinic-teal uppercase">{children}</p>;
}

export function ClinicContainer({ className, children }) {
  return <div className={cx('mx-auto w-full max-w-[1180px] px-5', className)}>{children}</div>;
}

const HEADER_CLEARANCE = 112;

/**
 * Keeps a sidebar taller than the screen in view: it scrolls with the page until its bottom edge
 * is reached, then stays put, so no empty column is left beside a long treatment page.
 */
export function useTallSticky() {
  const ref = useRef(null);
  const [top, setTop] = useState(HEADER_CLEARANCE);
  useEffect(() => {
    const measure = () => {
      if (ref.current) setTop(Math.min(HEADER_CLEARANCE, window.innerHeight - ref.current.offsetHeight - 24));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(ref.current);
    window.addEventListener('resize', measure);
    return () => { observer.disconnect(); window.removeEventListener('resize', measure); };
  }, []);
  return [ref, top];
}
