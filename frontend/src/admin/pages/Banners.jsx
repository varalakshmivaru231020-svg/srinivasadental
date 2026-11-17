import { useEffect, useState } from 'react';
import { Save, RotateCcw, ExternalLink } from 'lucide-react';
import { getBanners, saveBanner, resetBanner, readError } from '../adminApi';
import { Field, ImageUpload, Notice, PageTitle } from '../components';
import { useSite } from '../../context/SiteContext';
import { BANNERS } from '../../data/banners';

// Photos are redrawn in the browser before uploading: the longest side at most 2000 px (no thumbnail needed).
const RESIZE = { max: 2000 };

// A page of the website where each banner can be seen (the treatment and doctor banners: the first treatment or doctor with a page).
const VIEW = {
  home: '/',
  about: '/about-us',
  services: '/services',
  contact: '/contact',
  gallery: '/gallery',
  'best-dentist': '/best-dentist-in-btm-layout-bangalore',
};

const toForm = (row) => ({ image: row?.image || '', title: row?.title || '' });

function BannerCard({ banner, row, onSaved }) {
  const { reload, services, team } = useSite();
  const [form, setForm] = useState(() => toForm(row));
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false); // a chosen photo is still being prepared or uploaded

  const isCustom = Boolean(row?.image || row?.title);
  const sample = banner.key === 'service-detail' ? services.find((x) => x.detailed)
    : banner.key === 'doctor-detail' ? team.find((x) => x.hasProfile) : null;
  const view = VIEW[banner.key] || (sample && `/${banner.key === 'service-detail' ? 'services' : 'doctors'}/${sample.slug}`);
  const changed = form.image !== (row?.image || '') || form.title !== (row?.title || '');

  const save = async () => {
    if (uploading) return; // saving now would keep the previous photo
    setBusy(true);
    setErrors({});
    setNotice(null);
    try {
      const body = banner.hasTitle ? { image: form.image, title: form.title } : { image: form.image };
      const res = await saveBanner(banner.key, body);
      onSaved(banner.key, res.data);
      setForm(toForm(res.data));
      reload();
      setNotice({ type: 'success', message: res.message || 'Banner saved.' });
    } catch (err) {
      const { message, fields } = readError(err);
      setErrors(fields);
      setNotice({ type: 'error', message });
    } finally {
      setBusy(false);
    }
  };

  const restoreDefault = async () => {
    if (!window.confirm(`Go back to the built-in banner on the ${banner.label}?`)) return;
    setBusy(true);
    setErrors({});
    setNotice(null);
    try {
      const res = await resetBanner(banner.key);
      onSaved(banner.key, null);
      setForm(toForm(null));
      reload();
      setNotice({ type: 'success', message: res.message || 'The built-in banner is shown again.' });
    } catch (err) {
      setNotice({ type: 'error', message: readError(err).message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="adm-card adm-banner">
      <div className="adm-card-head">
        <h2>{banner.label}</h2>
        <span className={`adm-badge ${isCustom ? 'confirmed' : 'cancelled'}`}>{isCustom ? 'Custom' : 'Default'}</span>
      </div>
      <p className="adm-hint adm-banner-where">
        {banner.where}
        {view && (
          <> <a className="adm-link" href={view} target="_blank" rel="noreferrer">View page <ExternalLink size={13} /></a></>
        )}
      </p>
      <Notice notice={notice} />

      <ImageUpload
        value={form.image}
        onChange={(url) => setForm((f) => ({ ...f, image: url }))}
        onBusy={setUploading}
        fallback={banner.image}
        label={form.image ? 'Choose another photo' : 'Choose new photo'}
        shape="hero"
        resize={RESIZE}
      />
      <span className="adm-hint" style={{ marginTop: 8 }}>Recommended: {banner.size}</span>
      {errors.image && <span className="adm-err">{errors.image}</span>}

      {banner.hasTitle && (
        <div className="adm-form-grid one" style={{ marginTop: 16 }}>
          <Field label="Banner title" error={errors.title} hint={`Leave empty to show “${banner.title}”.`}>
            <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} maxLength={120} placeholder={banner.title} />
          </Field>
        </div>
      )}

      <div className="adm-banner-actions">
        <button type="button" className="adm-btn primary" onClick={save} disabled={busy || uploading || !changed}>
          {busy ? <span className="adm-spinner sm light" /> : <Save size={16} />} {busy ? 'Saving…' : 'Save'}
        </button>
        {isCustom && (
          <button type="button" className="adm-btn ghost" onClick={restoreDefault} disabled={busy || uploading}>
            <RotateCcw size={16} /> Use default
          </button>
        )}
        {changed && !busy && <span className="adm-hint">Not saved yet.</span>}
      </div>
    </div>
  );
}

export default function Banners() {
  const [rows, setRows] = useState(null);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    getBanners()
      .then((res) => setRows(Object.fromEntries(res.data.map((r) => [r.page_key, r]))))
      .catch((err) => setNotice({ type: 'error', message: readError(err).message }));
  }, []);

  const onSaved = (key, row) => setRows((rs) => ({ ...rs, [key]: row }));

  return (
    <>
      <PageTitle title="Banners" subtitle="The photo at the top of each page of the website, and the title on the Contact and Gallery banners." />
      <Notice notice={notice} />

      {!rows ? (
        !notice && <div className="adm-card"><div className="adm-empty"><span className="adm-spinner" /></div></div>
      ) : (
        <div className="adm-grid">
          {BANNERS.map((b) => <BannerCard key={b.key} banner={b} row={rows[b.key]} onSaved={onSaved} />)}
        </div>
      )}
      <p className="adm-footnote">
        Photos straight from a phone are fine: they are made smaller before uploading, and their location (GPS) details are removed.
        “Use default” brings back the banner the website came with.
      </p>
    </>
  );
}
