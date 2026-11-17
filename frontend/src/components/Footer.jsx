import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Star, ArrowUpRight } from 'lucide-react';
import { useSite, telHref } from '../context/SiteContext';
import { Container } from './ui';
import { Rings } from './Shared';

function FooterLink({ to, children }) {
  return (
    <li>
      <Link to={to} className="group inline-flex items-center gap-1 transition-colors duration-300 hover:text-aqua">
        {children}
        <ArrowUpRight size={14} className="-translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" aria-hidden="true" />
      </Link>
    </li>
  );
}

export default function Footer() {
  const { clinic, services } = useSite();
  const year = new Date().getFullYear();
  const [first, ...rest] = clinic.name.split(' ');
  const socials = [
    { href: clinic.social.facebook, label: 'Facebook', Icon: Facebook },
    { href: clinic.social.instagram, label: 'Instagram', Icon: Instagram },
    { href: clinic.social.google, label: 'Google reviews', Icon: Star },
  ].filter((s) => s.href);

  return (
    <footer className="relative overflow-hidden bg-navy text-[0.95rem] text-white/70">
      <Rings className="-bottom-40 -left-40 size-[26rem] text-aqua/15" count={5} />
      <Rings className="-top-48 -right-40 size-[28rem] text-aqua/10" count={5} />
      <Container className="relative pt-16 pb-8 lg:pt-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1fr_1.3fr] lg:gap-10">
          <div>
            <Link to="/" className="flex items-center gap-3">
              <img src={clinic.logo} alt="" width="52" height="52" className="size-13 rounded-2xl object-cover ring-2 ring-white/10" loading="lazy" />
              <span className="leading-tight">
                <span className="block font-display text-xl font-extrabold text-white">{first} <span className="text-aqua">{rest.join(' ')}</span></span>
                <span className="block text-[0.7rem] font-bold tracking-[0.2em] text-aqua uppercase">Since 1999 · BTM Layout</span>
              </span>
            </Link>
            <p className="mt-5 font-semibold text-white">Healthier Smiles. Brighter Lives.</p>
            <p className="mt-2 max-w-xs leading-relaxed">Comprehensive, ethical and patient-centred dental care in BTM 2nd Stage, Bengaluru since 1999.</p>
          </div>

          <div>
            <h4 className="font-display text-base font-bold text-white">Quick Links</h4>
            <ul className="mt-5 space-y-3">
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/about-us">About Us</FooterLink>
              <FooterLink to="/about-us#team-members">Our Dental Team</FooterLink>
              <FooterLink to="/services">Services</FooterLink>
              <FooterLink to="/gallery">Gallery</FooterLink>
              <FooterLink to="/contact">Contact</FooterLink>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-base font-bold text-white">Our Services</h4>
            <ul className="mt-5 space-y-3">
              {services.filter((s) => s.detailed).slice(0, 5).map((s) => (
                <FooterLink key={s.slug} to={`/services/${s.slug}`}>{s.title}</FooterLink>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-base font-bold text-white">Contact Us</h4>
            <ul className="mt-5 space-y-3.5">
              <li className="flex gap-3">
                <Phone size={17} className="mt-0.5 shrink-0 text-aqua" />
                <span>
                  {clinic.phones.map((p) => <a key={p} href={telHref(p)} className="block font-semibold text-white transition-colors hover:text-aqua">{p}</a>)}
                  {clinic.landline && <a href={telHref(clinic.landline)} className="block transition-colors hover:text-aqua">{clinic.landline} (Landline)</a>}
                </span>
              </li>
              <li className="flex gap-3">
                <MapPin size={17} className="mt-0.5 shrink-0 text-aqua" />
                <a href={clinic.mapsLink} target="_blank" rel="noreferrer" className="transition-colors hover:text-aqua">{clinic.address.full}</a>
              </li>
              {clinic.email && (
                <li className="flex gap-3">
                  <Mail size={17} className="mt-0.5 shrink-0 text-aqua" />
                  <a href={`mailto:${clinic.email}`} className="transition-colors hover:text-aqua">{clinic.email}</a>
                </li>
              )}
              <li className="flex gap-3">
                <Clock size={17} className="mt-0.5 shrink-0 text-aqua" />
                <span>
                  {clinic.hours.length
                    ? clinic.hours.map((h) => <span key={h.days} className="block">{h.days}: {h.time}</span>)
                    : 'Please call the clinic for timings'}
                </span>
              </li>
            </ul>
            {socials.length > 0 && (
              <div className="mt-6 flex gap-2.5">
                {socials.map(({ href, label, Icon }) => (
                  <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                    className="grid size-10 place-items-center rounded-full bg-white/10 text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal">
                    <Icon size={17} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-white/10 pt-7 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} {clinic.name}. All rights reserved.</span>
          <span>Established 1999 · BTM 2nd Stage, Bengaluru</span>
        </div>
      </Container>
    </footer>
  );
}
