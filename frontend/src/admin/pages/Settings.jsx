import { useEffect, useState } from 'react';
import { Save, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { getSettings, saveSettings, readError } from '../adminApi';
import { Field, ImageUpload, Notice, PageTitle } from '../components';
import { useSite } from '../../context/SiteContext';

const FIELDS = [
  'clinic_name', 'tagline', 'address_line1', 'address_line2', 'city', 'pincode',
  'phone_primary', 'phone_secondary', 'landline', 'email', 'whatsapp_number',
  'google_maps_url', 'google_maps_embed_url', 'facebook_url', 'instagram_url', 'google_reviews_url',
  'logo_url', 'logo_banner_url',
];

const toForm = (s) => ({
  ...Object.fromEntries(FIELDS.map((f) => [f, s?.[f] ?? ''])),
  // Show the WhatsApp number as 10 digits (stored with the 91 country code)
  whatsapp_number: String(s?.whatsapp_number || '').replace(/^91(?=\d{10}$)/, ''),
  opening_hours: Array.isArray(s?.opening_hours) ? s.opening_hours : [],
});

export default function Settings() {
  const { reload } = useSite();
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getSettings()
      .then((res) => setForm(toForm(res.data)))
      .catch((err) => setNotice({ type: 'error', message: readError(err).message }));
  }, []);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e?.target ? e.target.value : e }));

  const hours = form?.opening_hours || [];
  const setHours = (next) => setForm((f) => ({ ...f, opening_hours: next }));
  const editHour = (i, key, value) => setHours(hours.map((h, j) => (j === i ? { ...h, [key]: value } : h)));
  const moveHour = (i, dir) => {
    const next = [...hours];
    [next[i], next[i + dir]] = [next[i + dir], next[i]];
    setHours(next);
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    setNotice(null);
    try {
      const body = { ...form, opening_hours: hours.filter((h) => h.days.trim() || h.time.trim()) };
      const res = await saveSettings(body);
      setForm(toForm(res.data));
      reload();
      setNotice({ type: 'success', message: res.message || 'Saved.' });
    } catch (err) {
      const { message, fields } = readError(err);
      setErrors(fields);
      const hourErr = Object.keys(fields).find((k) => k.startsWith('opening_hours'));
      setNotice({ type: 'error', message: hourErr ? `${message} (Working hours: ${fields[hourErr]})` : message });
    } finally {
      setBusy(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!form) {
    return (
      <>
        <PageTitle title="Clinic Settings" />
        <Notice notice={notice} />
        {!notice && <div className="adm-empty"><span className="adm-spinner" /></div>}
      </>
    );
  }

  const err = (f) => errors[f];

  return (
    <form onSubmit={submit} noValidate>
      <PageTitle title="Clinic Settings" subtitle="Contact details, working hours, logos and links shown across the website.">
        <button type="submit" className="adm-btn primary" disabled={busy}>
          {busy ? <span className="adm-spinner sm light" /> : <Save size={16} />} {busy ? 'Saving…' : 'Save'}
        </button>
      </PageTitle>
      <Notice notice={notice} />

      <div className="adm-grid">
        <div className="adm-card">
          <h2>Clinic &amp; address</h2>
          <div className="adm-form-grid">
            <Field label="Clinic name" required error={err('clinic_name')} full>
              <input value={form.clinic_name} onChange={set('clinic_name')} maxLength={150} />
            </Field>
            <Field label="Tagline" error={err('tagline')} hint="Shown in the footer." full>
              <input value={form.tagline} onChange={set('tagline')} maxLength={200} />
            </Field>
            <Field label="Address line 1" required error={err('address_line1')} full>
              <input value={form.address_line1} onChange={set('address_line1')} maxLength={150} placeholder="Door no., cross, main" />
            </Field>
            <Field label="Address line 2 (area)" error={err('address_line2')} full>
              <input value={form.address_line2} onChange={set('address_line2')} maxLength={150} placeholder="Layout, stage" />
            </Field>
            <Field label="City" required error={err('city')}>
              <input value={form.city} onChange={set('city')} maxLength={80} />
            </Field>
            <Field label="PIN code" error={err('pincode')}>
              <input value={form.pincode} onChange={set('pincode')} inputMode="numeric" maxLength={6} />
            </Field>
          </div>
        </div>

        <div className="adm-card">
          <h2>Phone, WhatsApp &amp; email</h2>
          <div className="adm-form-grid">
            <Field label="Main mobile number" required error={err('phone_primary')} hint="Used for “Call now” buttons.">
              <input value={form.phone_primary} onChange={set('phone_primary')} inputMode="tel" maxLength={14} />
            </Field>
            <Field label="Second mobile number" error={err('phone_secondary')}>
              <input value={form.phone_secondary} onChange={set('phone_secondary')} inputMode="tel" maxLength={14} />
            </Field>
            <Field label="Landline" error={err('landline')}>
              <input value={form.landline} onChange={set('landline')} inputMode="tel" maxLength={20} placeholder="080 41201345" />
            </Field>
            <Field label="WhatsApp number" error={err('whatsapp_number')} hint="Leave empty to hide WhatsApp buttons.">
              <input value={form.whatsapp_number} onChange={set('whatsapp_number')} inputMode="tel" maxLength={14} />
            </Field>
            <Field label="Email address" error={err('email')} hint="Leave empty to hide email on the website." full>
              <input type="email" value={form.email} onChange={set('email')} maxLength={160} />
            </Field>
          </div>
        </div>

        <div className="adm-card">
          <h2>Working hours</h2>
          <p className="adm-hint" style={{ marginTop: -6 }}>
            One row per group of days. If no rows are added, the website asks visitors to call for timings.
          </p>
          <div className="adm-hours">
            {hours.map((h, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <div className="adm-hour" key={i}>
                <input value={h.days} onChange={(e) => editHour(i, 'days', e.target.value)} placeholder="Monday – Saturday" maxLength={60} aria-label={`Days, row ${i + 1}`} />
                <input value={h.time} onChange={(e) => editHour(i, 'time', e.target.value)} placeholder="10:00 AM – 8:00 PM" maxLength={60} aria-label={`Timing, row ${i + 1}`} />
                <div className="adm-hour-actions">
                  <button type="button" className="adm-icon-btn" disabled={i === 0} onClick={() => moveHour(i, -1)} aria-label="Move up"><ArrowUp size={15} /></button>
                  <button type="button" className="adm-icon-btn" disabled={i === hours.length - 1} onClick={() => moveHour(i, 1)} aria-label="Move down"><ArrowDown size={15} /></button>
                  <button type="button" className="adm-icon-btn danger" onClick={() => setHours(hours.filter((_, j) => j !== i))} aria-label="Remove row"><Trash2 size={15} /></button>
                </div>
              </div>
            ))}
          </div>
          {hours.length < 10 && (
            <button type="button" className="adm-btn ghost" onClick={() => setHours([...hours, { days: '', time: '' }])}>
              <Plus size={16} /> Add timing row
            </button>
          )}
        </div>

        <div className="adm-card">
          <h2>Logos</h2>
          <div className="adm-field">
            <span className="adm-label">Header logo (square)</span>
            <span className="adm-hint">Shown in the header, the footer and as the browser-tab icon. Use a square image, at least 512×512.</span>
          </div>
          <ImageUpload value={form.logo_url} onChange={set('logo_url')} fallback="/logo-mark.png" shape="square" label="Upload logo" />
          {err('logo_url') && <span className="adm-err">{err('logo_url')}</span>}
          <div className="adm-field" style={{ marginTop: 22 }}>
            <span className="adm-label">Wide banner logo (optional)</span>
            <span className="adm-hint">Kept for future use — the current design shows the square logo with the clinic name in the header and footer.</span>
          </div>
          <ImageUpload value={form.logo_banner_url} onChange={set('logo_banner_url')} fallback="/logo-banner.png" shape="banner" label="Upload banner" />
          {err('logo_banner_url') && <span className="adm-err">{err('logo_banner_url')}</span>}
        </div>

        <div className="adm-card">
          <h2>Google Maps</h2>
          <div className="adm-form-grid">
            <Field label="“Get directions” link" error={err('google_maps_url')} hint="Open your clinic in Google Maps → Share → Copy link." full>
              <input value={form.google_maps_url} onChange={set('google_maps_url')} placeholder="https://maps.app.goo.gl/..." />
            </Field>
            <Field label="Map shown on the Contact page" error={err('google_maps_embed_url')} hint="Google Maps → Share → Embed a map → Copy HTML, and paste it here." full>
              <textarea rows={3} value={form.google_maps_embed_url} onChange={set('google_maps_embed_url')} placeholder="https://www.google.com/maps/embed?pb=..." />
            </Field>
          </div>
        </div>

        <div className="adm-card">
          <h2>Social &amp; review links</h2>
          <p className="adm-hint" style={{ marginTop: -6 }}>Icons appear in the footer only for links you add.</p>
          <div className="adm-form-grid">
            <Field label="Google reviews link" error={err('google_reviews_url')} full>
              <input value={form.google_reviews_url} onChange={set('google_reviews_url')} placeholder="https://g.page/r/..." />
            </Field>
            <Field label="Facebook page" error={err('facebook_url')} full>
              <input value={form.facebook_url} onChange={set('facebook_url')} placeholder="https://facebook.com/..." />
            </Field>
            <Field label="Instagram profile" error={err('instagram_url')} full>
              <input value={form.instagram_url} onChange={set('instagram_url')} placeholder="https://instagram.com/..." />
            </Field>
          </div>
        </div>
      </div>

      <div className="adm-savebar">
        <button type="submit" className="adm-btn primary" disabled={busy}>
          {busy ? <span className="adm-spinner sm light" /> : <Save size={16} />} {busy ? 'Saving…' : 'Save all settings'}
        </button>
      </div>
    </form>
  );
}
