import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Info } from 'lucide-react';
import { getService, createService, updateService, readError } from '../adminApi';
import { Field, ImageUpload, Notice, PageTitle } from '../components';
import Icon, { iconNames } from '../../components/Icon';
import { useSite } from '../../context/SiteContext';
import { services as builtIn } from '../../data/services';
import { servicePhotos } from '../../data/servicePhotos';

const empty = {
  service_name: '', slug: '', tagline: '', description: '', icon: 'Smile', image: '', content: '',
  meta_title: '', meta_description: '', sort_order: '', is_active: true, show_on_home: false,
};

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 120);
const richSlugs = new Set(builtIn.filter((s) => s.detailed).map((s) => s.slug));

export default function ServiceEdit() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const location = useLocation();
  const { reload } = useSite();
  const [form, setForm] = useState(isNew ? empty : null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState(
    location.state?.created ? { type: 'success', message: 'Service added to the website.' } : null,
  );
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isNew) return;
    getService(id)
      .then((res) => {
        const r = res.data;
        setForm({
          ...empty,
          ...Object.fromEntries(Object.entries(r).map(([k, v]) => [k, v ?? ''])),
          is_active: Boolean(r.is_active),
          show_on_home: Boolean(r.show_on_home),
        });
      })
      .catch((err) => setNotice({ type: 'error', message: readError(err).message }));
  }, [id, isNew]);

  const set = (field) => (e) => {
    const value = e?.target ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value) : e;
    setForm((f) => {
      const next = { ...f, [field]: value };
      if (isNew && field === 'service_name' && !slugTouched) next.slug = slugify(value);
      return next;
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    setNotice(null);
    const body = {
      ...form,
      sort_order: form.sort_order === '' ? null : Number(form.sort_order),
    };
    if (!isNew) delete body.slug;
    ['id', 'updated_at'].forEach((k) => delete body[k]);
    try {
      if (isNew) {
        const res = await createService(body);
        reload();
        navigate(`/admin/services/${res.data.id}`, { replace: true, state: { created: true } });
        return;
      }
      await updateService(id, body);
      reload();
      setNotice({ type: 'success', message: 'Changes saved. The website has been updated.' });
    } catch (err) {
      const { message, fields } = readError(err);
      setErrors(fields);
      setNotice({ type: 'error', message });
    } finally {
      setBusy(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!form) {
    return (
      <>
        <Notice notice={notice} />
        {!notice && <div className="adm-empty"><span className="adm-spinner" /></div>}
      </>
    );
  }

  const isRich = richSlugs.has(form.slug);

  return (
    <form onSubmit={submit} noValidate>
      <PageTitle title={isNew ? 'Add a service' : `Edit: ${form.service_name || 'Service'}`}>
        <Link to="/admin/services" className="adm-btn ghost"><ArrowLeft size={16} /> All services</Link>
        <button type="submit" className="adm-btn primary" disabled={busy}>
          {busy ? <span className="adm-spinner sm light" /> : <Save size={16} />} {busy ? 'Saving…' : 'Save'}
        </button>
      </PageTitle>
      <Notice notice={notice} />

      <div className="adm-grid">
        <div className="adm-card">
          <h2>Basic details</h2>
          <div className="adm-form-grid">
            <Field label="Service name" required error={errors.service_name} full>
              <input value={form.service_name} onChange={set('service_name')} maxLength={120} placeholder="e.g. Gum Treatment" />
            </Field>
            <Field
              label="Web address"
              full
              error={errors.slug}
              hint={isNew ? 'Lowercase letters, numbers and hyphens. This cannot be changed later.' : 'The web address is fixed so existing links keep working.'}
            >
              <div className="adm-prefix">
                <span>/services/</span>
                <input value={form.slug} disabled={!isNew} onChange={(e) => { setSlugTouched(true); set('slug')(slugify(e.target.value)); }} maxLength={120} />
              </div>
            </Field>
            <Field label="Short description" required error={errors.description} hint="Shown on service cards and the services page (1–2 sentences)." full>
              <textarea rows={3} value={form.description} onChange={set('description')} maxLength={500} />
            </Field>
            <Field label="Tagline" error={errors.tagline} hint="Headline on the service page, e.g. “Save Your Natural Tooth.”" full>
              <input value={form.tagline} onChange={set('tagline')} maxLength={200} />
            </Field>
          </div>
        </div>

        <div className="adm-card">
          <h2>Visibility</h2>
          <label className="adm-check">
            <input type="checkbox" checked={form.is_active} onChange={set('is_active')} />
            <span><strong>Show on website</strong><small>Untick to hide this service without deleting it.</small></span>
          </label>
          <label className="adm-check">
            <input type="checkbox" checked={form.show_on_home} onChange={set('show_on_home')} />
            <span><strong>Feature on home page</strong><small>Up to 8 featured services appear on the home page.</small></span>
          </label>
          <Field label="Display order" error={errors.sort_order} hint="Lower numbers appear first. Leave empty to add at the end.">
            <input type="number" min="0" max="9999" value={form.sort_order} onChange={set('sort_order')} />
          </Field>
        </div>

        <div className="adm-card">
          <h2>Image &amp; icon</h2>
          <p className="adm-hint" style={{ marginTop: -6 }}>Shown on the Services page and at the top of this service's page. Landscape photos (1600 × 1000) look best. Service cards always use the icon.</p>
          <ImageUpload value={form.image} onChange={set('image')} fallback={servicePhotos[form.slug]} label="Upload photo" />
          {errors.image && <span className="adm-err">{errors.image}</span>}
          <div className="adm-field" style={{ marginTop: 18 }}>
            <span className="adm-label">Icon (used when there is no photo)</span>
            <div className="adm-icons">
              {iconNames.map((n) => (
                <button key={n} type="button" title={n} aria-label={n} aria-pressed={form.icon === n}
                  className={form.icon === n ? 'active' : ''} onClick={() => set('icon')(n)}>
                  <Icon name={n} size={20} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="adm-card">
          <h2>Service page content</h2>
          {isRich ? (
            <p className="adm-info"><Info size={16} /> This service already has a full treatment page from the clinic’s content documents. Text you add here appears as an extra section on that page.</p>
          ) : (
            <p className="adm-info"><Info size={16} /> Add a few paragraphs to give this service its own page. Without content, “Learn more” links go to the services list.</p>
          )}
          <Field label="Page content" error={errors.content} full
            hint="Leave a blank line between paragraphs. Start a line with “## ” for a heading, or “- ” for a bullet point.">
            <textarea rows={12} value={form.content} onChange={set('content')} maxLength={20000}
              placeholder={'## What is this treatment?\nDescribe the treatment in simple words.\n\n## Benefits\n- First benefit\n- Second benefit'} />
          </Field>
          <details className="adm-details">
            <summary>Search engine settings (optional)</summary>
            <div className="adm-form-grid">
              <Field label="Page title for Google" error={errors.meta_title} hint={`${form.meta_title.length}/200 · Leave empty to use the default.`} full>
                <input value={form.meta_title} onChange={set('meta_title')} maxLength={200} />
              </Field>
              <Field label="Page description for Google" error={errors.meta_description} hint={`${form.meta_description.length}/300`} full>
                <textarea rows={3} value={form.meta_description} onChange={set('meta_description')} maxLength={300} />
              </Field>
            </div>
          </details>
        </div>
      </div>

      <div className="adm-savebar">
        <button type="submit" className="adm-btn primary" disabled={busy}>
          {busy ? <span className="adm-spinner sm light" /> : <Save size={16} />} {busy ? 'Saving…' : isNew ? 'Add service' : 'Save changes'}
        </button>
      </div>
    </form>
  );
}
