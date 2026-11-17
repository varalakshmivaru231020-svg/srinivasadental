import { useId } from 'react';
import { motion } from 'framer-motion';
import { cx } from './ui';

/** Flowing white / aqua swooshes used behind heroes and section backgrounds. */
export function WaveBackdrop({ className, tone = 'light' }) {
  const light = tone === 'light';
  return (
    <svg aria-hidden="true" viewBox="0 0 1440 720" preserveAspectRatio="none" className={cx('pointer-events-none absolute inset-0 h-full w-full', className)}>
      <defs>
        <linearGradient id={`wb-a-${tone}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={light ? '#32D5CE' : '#32D5CE'} stopOpacity={light ? 0.18 : 0.25} />
          <stop offset="1" stopColor={light ? '#009F9A' : '#009F9A'} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0 520C220 430 420 640 700 600s520-260 740-210v330H0Z" fill={light ? '#ffffff' : '#0B4862'} opacity={light ? 0.85 : 0.5} />
      <path d="M0 610c260-90 520 60 820 20 260-34 420-170 620-150" stroke={`url(#wb-a-${tone})`} strokeWidth="60" fill="none" />
      <path d="M-40 430C260 330 520 520 820 470S1240 250 1480 300" stroke={light ? '#32D5CE' : '#32D5CE'} strokeOpacity={light ? 0.18 : 0.2} strokeWidth="2" fill="none" />
      <path d="M-40 470C280 380 540 560 840 515S1250 300 1480 345" stroke={light ? '#009F9A' : '#ffffff'} strokeOpacity={light ? 0.12 : 0.08} strokeWidth="1.5" fill="none" />
    </svg>
  );
}

/** Large faint tooth outline used as a quiet background motif. */
export function ToothOutline({ className }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.45" strokeLinejoin="round" className={cx('pointer-events-none absolute', className)}>
      <path d="M7.5 3C5 3 3.5 4.9 3.5 7.3c0 2.1.8 3.6 1.5 5.1.6 1.3.9 2.7 1.1 4.2.3 2 .7 4.4 2 4.4 1.4 0 1.6-2.4 2-4 .2-.9.7-1.4 1.9-1.4s1.7.5 1.9 1.4c.4 1.6.6 4 2 4 1.3 0 1.7-2.4 2-4.4.2-1.5.5-2.9 1.1-4.2.7-1.5 1.5-3 1.5-5.1C20.5 4.9 19 3 16.5 3c-1.9 0-2.9 1-4.5 1S9.4 3 7.5 3Z" />
    </svg>
  );
}

const RINGS = {
  aqua: { back: '#32D5CE', front: '#32D5CE', spark: '#ffffff' },
  gold: { back: '#E2A93B', front: '#F4C95D', spark: '#FFF4D6' },
};

/** Glossy 3D-style tooth with a glowing ring (aqua or gold). Floats gently (disabled with reduced motion). */
export function GlossyTooth({ className, ring = 'aqua' }) {
  const uid = useId().replace(/:/g, '');
  const id = (name) => `gt-${name}-${uid}`;
  const c = RINGS[ring] || RINGS.aqua;
  const tooth = 'M74 30C44 30 30 56 33 88c3 30 18 50 24 80 7 36 10 76 32 76 20 0 21-38 28-58 4-12 9-16 13-16s9 4 13 16c7 20 8 58 28 58 22 0 25-40 32-76 6-30 21-50 24-80 3-32-11-58-41-58-22 0-32 14-56 14S96 30 74 30Z';
  return (
    <motion.div
      className={cx('relative', className)}
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg viewBox="0 0 240 280" className="h-full w-full overflow-visible" aria-hidden="true">
        <defs>
          <linearGradient id={id('body')} x1="0.2" y1="0" x2="0.8" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.55" stopColor="#F2FAFA" />
            <stop offset="1" stopColor="#C9E9E8" />
          </linearGradient>
          <radialGradient id={id('shine')} cx="0.32" cy="0.22" r="0.4">
            <stop offset="0" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={id('shade')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#7FCFCC" stopOpacity="0" />
            <stop offset="1" stopColor="#7FCFCC" stopOpacity="0.4" />
          </linearGradient>
          <filter id={id('glow')} x="-30%" y="-80%" width="160%" height="260%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id={id('shadow')} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="14" stdDeviation="12" floodColor="#073449" floodOpacity="0.2" />
          </filter>
        </defs>
        {/* ring, back half */}
        <path d="M8 168a112 30 0 0 1 224 0" fill="none" stroke={c.back} strokeOpacity="0.55" strokeWidth="3" filter={`url(#${id('glow')})`} />
        {/* tooth */}
        <g filter={`url(#${id('shadow')})`}>
          <path d={tooth} fill={`url(#${id('body')})`} />
          <path d={tooth} fill={`url(#${id('shade')})`} />
          <ellipse cx="88" cy="70" rx="40" ry="30" fill={`url(#${id('shine')})`} />
        </g>
        {/* ring, front half */}
        <path d="M232 168a112 30 0 0 1-224 0" fill="none" stroke={c.front} strokeWidth="4" filter={`url(#${id('glow')})`} />
        <circle cx="214" cy="186" r="4" fill={c.spark} filter={`url(#${id('glow')})`} />
      </svg>
    </motion.div>
  );
}

/** Soft green leaves for corners (photo-style foliage accent). */
export function GreenLeaves({ className, flip }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 160 160" className={cx('pointer-events-none absolute', flip && '-scale-x-100', className)}>
      <path d="M150 10C96 14 54 44 40 104c48-6 92-36 110-94Z" fill="#5BAE4A" />
      <path d="M150 10C108 44 74 74 40 104" stroke="#3E8A33" strokeWidth="2" fill="none" />
      <path d="M118 6C80 4 44 24 26 62c34 2 70-18 92-56Z" fill="#7CC468" opacity="0.9" />
      <path d="M156 60c-40 0-72 22-84 62 36 0 70-22 84-62Z" fill="#4A9A3C" opacity="0.85" />
    </svg>
  );
}

/** Round "25+ Years of Trust" badge with a gold laurel wreath. */
export function LaurelBadge({ value = '25+', line1 = 'Years', line2 = 'of Trust', className }) {
  const leaves = [];
  // Two branches rising from the bottom (90°) up each side; angles are clockwise from +x as in SVG.
  for (let i = 0; i < 9; i += 1) {
    [110 + i * 15, 70 - i * 15].forEach((deg, side) => {
      const t = (deg * Math.PI) / 180;
      const x = 60 + 47 * Math.cos(t);
      const y = 60 + 47 * Math.sin(t);
      leaves.push(<ellipse key={`${side}-${i}`} cx={x} cy={y} rx="2.4" ry="5.6" transform={`rotate(${deg - 180} ${x} ${y})`} fill="#D9B566" />);
    });
  }
  return (
    <div className={cx('relative grid size-32 place-items-center rounded-full bg-navy text-center text-white shadow-lift ring-4 ring-white', className)}>
      <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full" aria-hidden="true">{leaves}</svg>
      <span className="relative leading-none">
        <span className="block font-display text-3xl font-extrabold tracking-[-0.04em]">{value}</span>
        <span className="mt-1 block text-[0.7rem] font-semibold">{line1}</span>
        <span className="block text-[0.7rem] font-semibold">{line2}</span>
      </span>
    </div>
  );
}

/** Two soft teal leaves — a small organic accent. */
export function Leaves({ className }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 120 120" className={cx('pointer-events-none absolute', className)}>
      <path d="M20 100C30 50 70 20 110 18 104 60 70 96 20 100Z" fill="#32D5CE" opacity="0.35" />
      <path d="M20 100C48 72 76 48 110 18" stroke="#009F9A" strokeOpacity="0.5" strokeWidth="1.5" fill="none" />
      <path d="M6 70C14 42 38 26 64 26 58 50 38 68 6 70Z" fill="#009F9A" opacity="0.25" />
    </svg>
  );
}
