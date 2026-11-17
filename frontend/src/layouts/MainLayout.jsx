import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import Lenis from 'lenis';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FloatingActions } from '../components/Shared';
import { getLenis, setLenis, scrollToTarget } from '../lib/smoothScroll';

export default function MainLayout() {
  const { pathname, hash } = useLocation();

  // Lenis smooth scrolling — skipped when the visitor prefers reduced motion.
  // Touch devices keep native scrolling for the best mobile performance.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => 1 - (1 - t) ** 4,
      smoothWheel: true,
      autoRaf: true,
      anchors: { offset: -100 },
    });
    setLenis(lenis);
    return () => {
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  // On navigation: go to the #section if there is one, otherwise to the top.
  useEffect(() => {
    if (hash) {
      // The page loads on demand, so keep looking for the section for a few seconds.
      const id = decodeURIComponent(hash.slice(1));
      let tries = 0;
      let settle;
      const timer = setInterval(() => {
        const el = document.getElementById(id);
        tries += 1;
        if (el || tries >= 40) clearInterval(timer);
        if (!el) return;
        // Let the new page finish laying out, and tell Lenis its new height so the scroll isn't cut short.
        settle = setTimeout(() => {
          getLenis()?.resize();
          scrollToTarget(el);
        }, 400);
      }, 120);
      return () => { clearInterval(timer); clearTimeout(settle); };
    }
    scrollToTarget(0, { immediate: true });
    return undefined;
  }, [pathname, hash]);

  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-navy focus:px-5 focus:py-3 focus:text-white">
        Skip to content
      </a>
      <Header />
      {/* overflow-x: clip stops slide-in animations from widening the page on phones (sticky still works) */}
      <main id="main" className="overflow-x-clip">
        {/* Keyed by path so every page (e.g. each treatment page) mounts fresh and replays its animations */}
        <Outlet key={pathname} />
      </main>
      <Footer />
      <FloatingActions />
    </MotionConfig>
  );
}
