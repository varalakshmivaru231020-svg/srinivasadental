import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, CalendarCheck, Stethoscope, MessageSquareQuote, Building2, Users, Images, PanelTop, KeyRound, LogOut, ExternalLink, Menu, X } from 'lucide-react';
import { useAdminAuth } from './AdminAuth';
import { useSite } from '../context/SiteContext';

const nav = [
  { to: '/admin', label: 'Dashboard', Icon: LayoutDashboard, end: true },
  { to: '/admin/appointments', label: 'Appointments', Icon: CalendarCheck },
  { to: '/admin/services', label: 'Services', Icon: Stethoscope },
  { to: '/admin/doctors', label: 'Doctors', Icon: Users },
  { to: '/admin/gallery', label: 'Gallery', Icon: Images },
  { to: '/admin/banners', label: 'Banners', Icon: PanelTop },
  { to: '/admin/testimonials', label: 'Testimonials', Icon: MessageSquareQuote },
  { to: '/admin/settings', label: 'Clinic Settings', Icon: Building2 },
  { to: '/admin/account', label: 'Change Password', Icon: KeyRound },
];

export default function AdminLayout() {
  const { user, logout } = useAdminAuth();
  const { clinic } = useSite();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => { setOpen(false); window.scrollTo(0, 0); }, [pathname]);

  return (
    <div className="adm-shell">
      <aside className={`adm-side ${open ? 'open' : ''}`}>
        <div className="adm-brand">
          <img src={clinic.logo} alt="" width="40" height="40" />
          <div><strong>{clinic.name}</strong><span>Admin Panel</span></div>
        </div>
        <nav className="adm-nav" aria-label="Admin navigation">
          {nav.map(({ to, label, Icon, end }) => (
            <NavLink key={to} to={to} end={end}><Icon size={18} /> {label}</NavLink>
          ))}
        </nav>
        <div className="adm-side-foot">
          <a href="/" target="_blank" rel="noreferrer"><ExternalLink size={16} /> View website</a>
          <button type="button" onClick={logout}><LogOut size={16} /> Log out</button>
        </div>
      </aside>
      {open && <button type="button" className="adm-scrim" aria-label="Close menu" onClick={() => setOpen(false)} />}

      <div className="adm-main">
        <header className="adm-top">
          <button type="button" className="adm-menu" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((o) => !o)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
          <span className="adm-top-title">{clinic.name}</span>
          <span className="adm-user">Signed in as <strong>{user?.username}</strong></span>
        </header>
        <main className="adm-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
