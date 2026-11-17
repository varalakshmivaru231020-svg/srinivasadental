import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarClock, Inbox, CalendarCheck, Stethoscope, ArrowRight, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { getDashboard, getSettings, readError } from '../adminApi';
import { Notice, PageTitle, StatusBadge, formatDate, formatDateTime } from '../components';

function missingDetails(s) {
  if (!s) return [];
  const list = [];
  if (!s.email) list.push('Email address');
  if (!s.opening_hours?.length) list.push('Working hours');
  if (!s.whatsapp_number) list.push('WhatsApp number');
  if (!s.google_reviews_url) list.push('Google reviews link');
  if (!s.facebook_url && !s.instagram_url) list.push('Facebook / Instagram links');
  return list;
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [settings, setSettings] = useState(null);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    Promise.all([getDashboard(), getSettings()])
      .then(([d, s]) => { setData(d.data); setSettings(s.data); })
      .catch((err) => setNotice({ type: 'error', message: readError(err).message }));
  }, []);

  const a = data?.appointments;
  const missing = missingDetails(settings);
  if (data && !data.testimonials) missing.push('Patient testimonials (Testimonials page)');
  const cards = [
    { label: 'New requests', value: a?.pending, Icon: Inbox, to: '/admin/appointments?status=pending', tone: 'accent' },
    { label: 'Upcoming visits', value: a?.upcoming, Icon: CalendarClock, to: '/admin/appointments', tone: 'blue' },
    { label: 'Received today', value: a?.today, Icon: CalendarCheck, to: '/admin/appointments', tone: 'green' },
    { label: 'Active services', value: data ? `${data.services.active} / ${data.services.total}` : undefined, Icon: Stethoscope, to: '/admin/services', tone: 'ink' },
  ];

  return (
    <>
      <PageTitle title="Dashboard" subtitle="Appointment requests and website status at a glance." />
      <Notice notice={notice} />

      <div className="adm-stats">
        {cards.map(({ label, value, Icon, to, tone }) => (
          <Link key={label} to={to} className={`adm-stat ${tone}`}>
            <span className="ic"><Icon size={20} /></span>
            <strong>{value ?? '–'}</strong>
            <span>{label}</span>
          </Link>
        ))}
      </div>

      {settings && (
        missing.length ? (
          <div className="adm-card adm-todo">
            <h2><AlertTriangle size={18} /> Complete your clinic details</h2>
            <p>These are not shown on the website until you add them:</p>
            <ul>{missing.map((m) => <li key={m}>{m}</li>)}</ul>
            <Link to="/admin/settings" className="adm-btn primary">Open Clinic Settings <ArrowRight size={16} /></Link>
          </div>
        ) : (
          <div className="adm-card adm-todo done"><h2><CheckCircle2 size={18} /> All clinic details are filled in.</h2></div>
        )
      )}

      <div className="adm-card">
        <div className="adm-card-head">
          <h2>Latest appointment requests</h2>
          <Link to="/admin/appointments" className="adm-link">View all <ArrowRight size={15} /></Link>
        </div>
        {!data ? (
          <div className="adm-empty"><span className="adm-spinner" /></div>
        ) : data.recent.length === 0 ? (
          <div className="adm-empty">No appointment requests yet. They will appear here when patients use the website form.</div>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead><tr><th>Patient</th><th>Service</th><th>Preferred</th><th>Received</th><th>Status</th></tr></thead>
              <tbody>
                {data.recent.map((r) => (
                  <tr key={r.id}>
                    <td><strong>{r.full_name}</strong><small><a href={`tel:+91${r.phone}`}>{r.phone}</a></small></td>
                    <td>{r.service_name || 'General check-up'}</td>
                    <td>{formatDate(r.preferred_date)}<small>{r.preferred_time}</small></td>
                    <td>{formatDateTime(r.created_at)}</td>
                    <td><StatusBadge status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
