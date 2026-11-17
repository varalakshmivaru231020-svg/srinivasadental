import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { getLenis } from '../lib/smoothScroll';

const navButton = 'grid size-12 place-items-center rounded-full bg-white/10 text-white transition-colors duration-300 hover:bg-white/25';

/** Full-screen photo viewer: arrows, swipe, Esc to close, and keyboard focus kept inside while open. */
export default function Lightbox({ photos, index, onChange, onClose }) {
  const dialog = useRef(null);
  const closeButton = useRef(null);
  const total = photos.length;
  const photo = photos[index];

  const go = useCallback((d) => onChange((index + d + total) % total), [index, total, onChange]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'Tab') {
        const items = [...dialog.current.querySelectorAll('button')];
        const at = items.indexOf(document.activeElement);
        e.preventDefault();
        items[(at + (e.shiftKey ? -1 : 1) + items.length) % items.length].focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, onClose]);

  // Freeze the page behind the viewer, and give focus back to the photo that opened it
  useEffect(() => {
    const opener = document.activeElement;
    getLenis()?.stop();
    document.body.style.overflow = 'hidden';
    closeButton.current?.focus();
    return () => {
      getLenis()?.start();
      document.body.style.overflow = '';
      opener?.focus?.({ preventScroll: true });
    };
  }, []);

  return createPortal(
    <motion.div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-label="Clinic photo viewer"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <p className="absolute top-6 left-6 flex items-center gap-3 font-heebo text-sm text-white/80" aria-live="polite">
        <span>{index + 1} / {total}</span>
        {photo.caption && <span className="rounded-full bg-white/15 px-3 py-0.5 text-xs font-medium tracking-wide text-white">{photo.caption}</span>}
      </p>
      <button ref={closeButton} type="button" aria-label="Close photo viewer" onClick={onClose} className={`absolute top-3 right-3 z-10 ${navButton}`}>
        <X size={24} />
      </button>
      <button type="button" aria-label="Previous photo" onClick={() => go(-1)} className={`absolute left-3 z-10 sm:left-6 ${navButton}`}>
        <ChevronLeft size={26} />
      </button>
      <AnimatePresence mode="wait" initial={false}>
        <motion.img
          key={photo.id}
          src={photo.full}
          alt={photo.alt}
          draggable={false}
          className="max-h-[84vh] max-w-[calc(100vw-2rem)] cursor-grab object-contain active:cursor-grabbing sm:max-w-[calc(100vw-11rem)]"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(e, info) => { if (info.offset.x < -60) go(1); else if (info.offset.x > 60) go(-1); }}
        />
      </AnimatePresence>
      <button type="button" aria-label="Next photo" onClick={() => go(1)} className={`absolute right-3 z-10 sm:right-6 ${navButton}`}>
        <ChevronRight size={26} />
      </button>
    </motion.div>,
    document.body,
  );
}
