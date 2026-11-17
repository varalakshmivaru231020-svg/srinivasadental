import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ZoomIn } from 'lucide-react';
import useSeo from '../hooks/useSeo';
import { useSite } from '../context/SiteContext';
import { ClinicBanner, ClinicContainer, FadeIn } from '../components/clinicPage';
import GoogleReviews from '../components/GoogleReviews';
import Lightbox from '../components/Lightbox';
import { cx } from '../components/ui';
import { GALLERY_CATEGORIES } from '../data/gallery';

const FILTERS = [{ key: 'all', label: 'All' }, ...GALLERY_CATEGORIES];

export default function Gallery() {
  const { clinic, gallery } = useSite();
  const [filter, setFilter] = useState(null); // null until the visitor picks a filter
  const [open, setOpen] = useState(null);
  useSeo({
    title: `Gallery | ${clinic.name}, BTM 2nd Stage, Bengaluru`,
    description: `See inside ${clinic.name} in BTM 2nd Stage, Bengaluru: the clinic entrance, reception, waiting area and treatment rooms.`,
    keywords: 'dental clinic photos BTM Layout, Srinivasa Dental Care gallery, dental clinic BTM 2nd Stage',
  });

  const counts = { all: gallery.length };
  GALLERY_CATEGORIES.forEach(({ key }) => { counts[key] = gallery.filter((p) => p.category === key).length; });
  // The filters only help when there are photos of both kinds
  const showFilters = GALLERY_CATEGORIES.every(({ key }) => counts[key] > 0);
  const active = (showFilters && filter) || 'all';
  const photos = active === 'all' ? gallery : gallery.filter((p) => p.category === active);

  return (
    <>
      <ClinicBanner page="gallery" />

      <section className="bg-clinic-bg py-8 sm:py-20">
        <ClinicContainer>
          <FadeIn from="right" className="pb-6 text-center">
            <h2 className="font-b612 text-2xl leading-tight font-bold tracking-normal text-clinic-navy uppercase sm:text-4xl lg:text-5xl">{clinic.name}</h2>
          </FadeIn>
          {showFilters && (
            <FadeIn from="right" className="pb-6">
              <div role="group" aria-label="Show photos" className="flex flex-wrap justify-center gap-2.5">
                {FILTERS.map(({ key, label }) => {
                  const on = active === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setFilter(key)}
                      className={cx(
                        'inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-heebo text-sm font-medium transition-colors duration-300',
                        on ? 'bg-clinic-navy text-white' : 'bg-white text-clinic-navy ring-1 ring-clinic-navy/15 hover:bg-clinic-sky',
                      )}
                    >
                      {label}
                      <span className={cx('rounded-full px-2 py-0.5 text-xs', on ? 'bg-white/20' : 'bg-clinic-teal/10')}>
                        {counts[key]}<span className="sr-only"> photos</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </FadeIn>
          )}
          <FadeIn from="left" amount={0.03}>
              {photos.length ? (
                // A new filter swaps the grid at once and fades the new photos in (no extra fade on first load)
                <motion.div
                  key={active}
                  className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3"
                  initial={filter ? { opacity: 0 } : false}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  {photos.map((photo, i) => (
                    <button
                      key={photo.id}
                      type="button"
                      onClick={() => setOpen(i)}
                      aria-label={`View photo${photo.caption ? ` (${photo.caption})` : ''}: ${photo.alt}`}
                      className="group relative block aspect-[4/3] w-full overflow-hidden bg-clinic-sky"
                    >
                      {/* Smile photos are mostly portrait close-ups: keep the teeth, not the forehead, in the frame */}
                      <img src={photo.thumb} alt={photo.alt} loading="lazy" className={cx('size-full object-cover', photo.category === 'smiles' && 'object-[center_75%]')} />
                      <span className="absolute inset-0 grid place-items-center bg-black/0 transition-colors duration-[800ms] group-hover:bg-black/50 group-focus-visible:bg-black/50">
                        <ZoomIn size={34} className="text-white opacity-0 transition-opacity duration-[800ms] group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden="true" />
                      </span>
                      {photo.caption && (
                        <span className="absolute top-3 left-3 rounded-full bg-clinic-navy/85 px-3 py-1 font-heebo text-xs font-medium tracking-wide text-white">{photo.caption}</span>
                      )}
                    </button>
                  ))}
                </motion.div>
              ) : (
                <p className="py-10 text-center font-heebo text-lg text-clinic-navy">Photos coming soon.</p>
              )}
            </FadeIn>
        </ClinicContainer>
      </section>

      <GoogleReviews />

      <AnimatePresence>
        {open !== null && photos[open] && (
          <Lightbox key="lightbox" photos={photos} index={open} onChange={setOpen} onClose={() => setOpen(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
