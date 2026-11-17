import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Menu, X, Phone, MapPin } from 'lucide-react';
import { useSite, telHref } from '../context/SiteContext';
import { getLenis, scrollToTarget } from '../lib/smoothScroll';
import { EASE } from './motion';
import { Button, Container, cx } from './ui';
import { serviceHref } from './Shared';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about-us', label: 'About Us', menu: 'about' },
  { to: '/services', label: 'Services', menu: 'services' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
];

/** "About Us" dropdown: the About page and its main sections. */
const ABOUT_MENU = [
  { to: '/about-us', label: 'About Us' },
  { to: '/about-us#vision-mission', label: 'Vision & Mission' },
  { to: '/about-us#founder', label: 'Founder' },
  { to: '/about-us#team-members', label: 'Our Team' },
];

/** True when a menu link points at the page (and #section) already on screen. */
function isCurrent(to, pathname, hash) {
  const [path, section] = to.split('#');
  return path === pathname && (section ? hash === `#${section}` : !hash);
}

/**
 * A link to the place already on screen changes nothing in the router, so scroll there directly —
 * after a moment, so a closing mobile menu has released the page scroll first.
 */
function scrollIfCurrent(to, pathname, hash) {
  if (!isCurrent(to, pathname, hash)) return;
  const section = to.split('#')[1];
  setTimeout(() => scrollToTarget(section ? document.getElementById(section) ?? 0 : 0), 60);
}

function NavItem({ link, caretOpen }) {
  return (
    <NavLink to={link.to} end={link.to === '/'} className="group relative flex items-center gap-1 px-2.5 py-2.5 text-[0.93rem] font-semibold whitespace-nowrap xl:px-4">
      {({ isActive }) => (
        <>
          <span className={cx('relative transition-colors duration-300', isActive ? 'text-teal' : 'text-ink/75 group-hover:text-navy')}>{link.label}</span>
          {link.menu && (
            <ChevronDown size={15} strokeWidth={2.5} aria-hidden="true" className={cx('transition-transform duration-300', isActive ? 'text-teal' : 'text-ink/60', caretOpen && 'rotate-180')} />
          )}
          {isActive ? (
            <motion.span
              layoutId="nav-active-line"
              className="absolute inset-x-2.5 bottom-1 h-0.5 rounded-full bg-teal xl:inset-x-4"
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            />
          ) : (
            <span className="absolute inset-x-2.5 bottom-1 h-0.5 origin-left scale-x-0 rounded-full bg-teal/50 transition-transform duration-500 ease-premium group-hover:scale-x-100 xl:inset-x-4" />
          )}
        </>
      )}
    </NavLink>
  );
}

/** Menu link with a dropdown (the About Us sections, every treatment). Opens on hover or keyboard focus. */
function NavDropdown({ link, items, pathname, hash, width = 'w-72' }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false); }}
      onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false); }}
    >
      <NavItem link={link} caretOpen={open} />
      <AnimatePresence>
        {open && (
          <motion.div
            className={cx('absolute top-full left-0 z-50 pt-3', width)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <ul data-lenis-prevent className="max-h-[calc(100vh-7.5rem)] overflow-y-auto rounded-md bg-white py-3 shadow-[0_20px_40px_-12px_rgb(7_52_73/0.3)]">
              {items.map((item) => {
                const current = isCurrent(item.to, pathname, hash);
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      aria-current={current ? 'page' : undefined}
                      onClick={() => { setOpen(false); scrollIfCurrent(item.to, pathname, hash); }}
                      className={cx('block px-7 py-2.5 font-heebo text-[0.98rem] leading-snug transition-colors duration-200 hover:text-clinic-teal', current ? 'text-clinic-teal' : 'text-clinic-navy')}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const mobileLink = (isActive) => cx(
  'block border-b border-line py-4 font-display text-3xl font-extrabold tracking-[-0.03em]',
  isActive ? 'text-teal' : 'text-navy',
);

/** Mobile menu row with an arrow that expands its sub-links (the About Us sections, the treatments). */
function MobileSubmenu({ link, items, pathname, hash, onNavigate, showLabel, hideLabel }) {
  const [expanded, setExpanded] = useState(false);
  const go = (to) => { onNavigate(); scrollIfCurrent(to, pathname, hash); };
  return (
    <div>
      <div className="flex items-center justify-between border-b border-line">
        <NavLink to={link.to} onClick={() => go(link.to)} className={({ isActive }) => cx(mobileLink(isActive), 'flex-1 border-b-0')}>{link.label}</NavLink>
        <button
          type="button"
          aria-expanded={expanded}
          aria-label={expanded ? hideLabel : showLabel}
          onClick={() => setExpanded((v) => !v)}
          className="grid size-12 place-items-center text-navy"
        >
          <ChevronDown size={26} className={cx('transition-transform duration-300', expanded && 'rotate-180')} />
        </button>
      </div>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.ul
            className="overflow-hidden"
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {items.map((item) => (
              <li key={item.to}>
                <Link to={item.to} onClick={() => go(item.to)} className="block py-2.5 pl-3 text-lg font-semibold text-navy/80">{item.label}</Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function Brand({ clinic }) {
  const [first, ...rest] = clinic.name.split(' ');
  return (
    <Link to="/" className="group flex items-center gap-3" aria-label={`${clinic.name} home`}>
      <img src={clinic.logo} alt="" width="46" height="46" className="size-[2.9rem] rounded-2xl object-cover shadow-soft transition-transform duration-500 ease-premium group-hover:-rotate-6" />
      <span className="leading-tight whitespace-nowrap">
        <span className="block font-display text-[1.1rem] font-extrabold tracking-[-0.02em] text-navy">
          {first} <span className="text-teal">{rest.join(' ')}</span>
        </span>
        <span className="block text-[0.64rem] font-bold tracking-[0.22em] text-muted uppercase">Since 1999 · BTM Layout</span>
      </span>
    </Link>
  );
}

export default function Header() {
  const { clinic, services } = useSite();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname, hash } = useLocation();
  const menus = {
    about: ABOUT_MENU,
    services: services.map((s) => ({ to: serviceHref(s), label: s.title })),
  };

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Freeze page scrolling while the mobile menu is open
  useEffect(() => {
    const lenis = getLenis();
    if (open) { lenis?.stop(); document.body.style.overflow = 'hidden'; } else { lenis?.start(); document.body.style.overflow = ''; }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE }}
        className={cx(
          'fixed inset-x-0 top-0 z-50 border-b transition-[background-color,box-shadow,border-color,backdrop-filter] duration-500',
          scrolled || open
            ? 'border-line/80 bg-white/85 shadow-[0_12px_32px_-22px_rgb(7_52_73/0.35)] backdrop-blur-xl'
            : 'border-transparent bg-transparent',
        )}
      >
        <Container className={cx('flex items-center justify-between gap-4 transition-[height] duration-500 ease-premium', scrolled ? 'h-[4.5rem]' : 'h-24')}>
          <Brand clinic={clinic} />

          <nav
            className={cx(
              'hidden items-center gap-1 rounded-full px-2 py-1.5 xl:gap-2 xl:px-3 transition-all duration-500 lg:flex',
              scrolled ? 'bg-transparent' : 'bg-white/90 shadow-soft ring-1 ring-line/60 backdrop-blur',
            )}
            aria-label="Main navigation"
          >
            {links.map((l) => (l.menu
              ? <NavDropdown key={l.to} link={l} items={menus[l.menu]} pathname={pathname} hash={hash} width={l.menu === 'about' ? 'w-60' : 'w-72'} />
              : <NavItem key={l.to} link={l} />))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={telHref(clinic.phones[0])}
              className="group hidden items-center gap-2 rounded-full bg-white/90 px-4 py-2.5 text-sm font-bold text-navy shadow-soft ring-1 ring-line/70 transition-colors duration-300 hover:text-teal xl:flex"
            >
              <Phone size={16} className="text-teal transition-transform duration-300 group-hover:rotate-12" />
              {clinic.phones[0]}
            </a>
            <div className="hidden sm:block">
              <Button to="/contact#appointment" variant="dark" size="sm" arrow className="whitespace-nowrap">Book Appointment</Button>
            </div>
            <button
              type="button"
              className="grid size-11 place-items-center rounded-full bg-white text-navy shadow-soft ring-1 ring-line lg:hidden"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </Container>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            data-lenis-prevent
            className="fixed inset-0 z-[45] flex flex-col overflow-y-auto bg-canvas px-6 pt-28 pb-8 lg:hidden"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <nav aria-label="Mobile navigation" className="flex flex-col">
              {links.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.08 + i * 0.06 }}
                >
                  {l.menu
                    ? (
                      <MobileSubmenu
                        link={l}
                        items={menus[l.menu]}
                        pathname={pathname}
                        hash={hash}
                        onNavigate={() => setOpen(false)}
                        showLabel={l.menu === 'services' ? 'Show treatments' : 'Show About Us sections'}
                        hideLabel={l.menu === 'services' ? 'Hide treatments' : 'Hide About Us sections'}
                      />
                    )
                    : <NavLink to={l.to} end={l.to === '/'} onClick={() => setOpen(false)} className={({ isActive }) => mobileLink(isActive)}>{l.label}</NavLink>}
                </motion.div>
              ))}
            </nav>
            <motion.div
              className="mt-auto flex flex-col gap-3"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.35 }}
            >
              <p className="mb-2 flex items-start gap-2 text-sm text-muted"><MapPin size={16} className="mt-0.5 shrink-0 text-teal" /> {clinic.address.full}</p>
              <Button to="/contact#appointment" size="lg" arrow>Book Appointment</Button>
              <Button href={telHref(clinic.phones[0])} variant="outline" size="lg" icon={Phone}>Call {clinic.phones[0]}</Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
