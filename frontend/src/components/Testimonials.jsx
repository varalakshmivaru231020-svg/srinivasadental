import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { EASE, Reveal } from './motion';
import { ArrowLink, Eyebrow, cx } from './ui';

// Shown only until the clinic adds verified reviews in Admin → Testimonials. Clearly marked as placeholders.
const PLACEHOLDERS = [
  { id: 'p1', patient_name: 'Patient name', treatment: 'Treatment received', review_text: 'Placeholder — verified patient reviews will appear here once the clinic adds them in the admin panel.' },
  { id: 'p2', patient_name: 'Patient name', treatment: 'Treatment received', review_text: "Placeholder — only reviews that patients have agreed to share are published, such as the clinic's Google reviews." },
  { id: 'p3', patient_name: 'Patient name', treatment: 'Treatment received', review_text: "Placeholder — each review can show the patient's name, the treatment they had and a star rating." },
];

const slide = {
  enter: (dir) => ({ opacity: 0, x: dir * 40 }),
  center: { opacity: 1, x: 0 },
  exit: (dir) => ({ opacity: 0, x: dir * -40 }),
};

function Arrow({ dir, onClick }) {
  const Icon = dir < 0 ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir < 0 ? 'Previous testimonial' : 'Next testimonial'}
      className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-navy shadow-soft ring-1 ring-line/70 transition-all duration-300 hover:scale-105 hover:bg-teal hover:text-white sm:size-11"
    >
      <Icon size={20} />
    </button>
  );
}

/** Testimonials heading + carousel (compact, for a half-width column). */
export default function Testimonials({ className }) {
  const { testimonials, clinic } = useSite();
  const isPlaceholder = testimonials.length === 0;
  const items = isPlaceholder ? PLACEHOLDERS : testimonials;
  const [[index, dir], setPos] = useState([0, 1]);
  const [paused, setPaused] = useState(false);

  const go = useCallback((d) => setPos(([i]) => [(i + d + items.length) % items.length, d]), [items.length]);
  useEffect(() => { setPos([0, 1]); }, [items.length]);

  // Auto-advance every 7 s; pauses on hover / keyboard focus.
  useEffect(() => {
    if (paused || items.length < 2) return undefined;
    const t = setInterval(() => go(1), 7000);
    return () => clearInterval(t);
  }, [paused, items.length, go]);

  const t = items[Math.min(index, items.length - 1)];
  const initial = (t.patient_name || '?').trim().charAt(0).toUpperCase();

  return (
    <div className={cx('relative', className)}>
      <Reveal>
        <Eyebrow lines="after">Patient Testimonials</Eyebrow>
        <h2 className="mt-5 font-display text-[1.75rem] leading-[1.15] font-extrabold tracking-[-0.03em] text-navy sm:text-[2.1rem]">
          Thousands of Smiles.<br />Countless Experiences.
        </h2>
      </Reveal>

      <Reveal
        from="right"
        delay={0.1}
        className="mt-8 flex items-center gap-2 sm:gap-3"
        onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}
        role="region" aria-roledescription="carousel" aria-label="Patient testimonials"
      >
        <Arrow dir={-1} onClick={() => go(-1)} />
        <div className="relative min-w-0 flex-1 overflow-hidden rounded-3xl bg-white p-5 shadow-soft ring-1 ring-line/60 sm:p-7">
          {isPlaceholder && (
            <span className="mb-3 inline-flex rounded-full bg-mint px-2.5 py-0.5 text-[0.68rem] font-semibold text-teal">Sample card — add real reviews in the admin panel</span>
          )}
          <div className="relative min-h-[11.5rem]" aria-live="polite">
            <AnimatePresence mode="wait" custom={dir} initial={false}>
              <motion.figure
                key={t.id}
                custom={dir}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: EASE }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.18}
                onDragEnd={(e, info) => { if (info.offset.x < -50) go(1); else if (info.offset.x > 50) go(-1); }}
                className="flex cursor-grab gap-4 active:cursor-grabbing"
              >
                <span aria-hidden="true" className="hidden font-display text-5xl leading-none font-extrabold text-teal sm:block">&ldquo;</span>
                <div className="min-w-0">
                  {t.rating ? (
                    <div className="mb-2 flex gap-0.5 text-[#F5B544]" aria-label={`${t.rating} out of 5 stars`}>
                      {Array.from({ length: t.rating }, (_, i) => <Star key={i} size={15} fill="currentColor" strokeWidth={0} />)}
                    </div>
                  ) : null}
                  <blockquote className="leading-relaxed text-ink">{t.review_text}</blockquote>
                  <figcaption className="mt-5 flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-teal to-navy font-display font-bold text-white">{initial}</span>
                    <span>
                      <span className="block text-sm font-bold text-navy">{t.patient_name}</span>
                      <span className="block text-xs text-muted">{[t.treatment, t.source].filter(Boolean).join(' · ') || 'Patient'}</span>
                    </span>
                  </figcaption>
                </div>
              </motion.figure>
            </AnimatePresence>
          </div>
        </div>
        <Arrow dir={1} onClick={() => go(1)} />
      </Reveal>

      <div className="mt-5 flex justify-center gap-1.5">
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            aria-label={`Show testimonial ${i + 1}`}
            aria-current={i === index}
            onClick={() => setPos([i, i > index ? 1 : -1])}
            className={cx('h-1.5 rounded-full transition-all duration-500 ease-premium', i === index ? 'w-7 bg-teal' : 'w-1.5 bg-navy/20 hover:bg-navy/40')}
          />
        ))}
      </div>
      {clinic.social.google && (
        <div className="mt-5 text-center"><ArrowLink href={clinic.social.google}>Read our Google reviews</ArrowLink></div>
      )}
    </div>
  );
}
