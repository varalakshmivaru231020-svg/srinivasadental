import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Info } from 'lucide-react';
import { getDoctor, createDoctor, updateDoctor, readError } from '../adminApi';
import { Field, ImageUpload, Notice, PageTitle } from '../components';
import { useSite } from '../../context/SiteContext';

const empty = {
  name: '', slug: '', title: '', qualification: '', experience: '', headline: '', photo: '',
  bio: '', profile: '', sort_order: '', is_active: true,
};

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 120);

export default function DoctorEdit() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const location = useLocation();
  const { reload } = useSite();
  const [form, setForm] = useState(isNew ? empty : null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState(location.state?.created ? { type: 'success', message: 'Doctor added to the website.' } : null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isNew) return;
    getDoctor(id)
      .then((res) => {
        const r = res.data;
        setForm({ ...empty, ...Object.fromEntries(Object.entries(r).map(([k, v]) => [k, v ?? ''])), is_active: Boolean(r.is_active) });
      })
      .catch((err) => setNotice({ type: 'error', message: readError(err).message }));
  }, [id, isNew]);

  const set = (field) => (e) => {
    const value = e?.target ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value) : e;
    setForm((f) => {
      const next = { ...f, [field]: value };
      if (isNew && field === 'name' && !slugTouched) next.slug = slugify(value);
      return next;
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    setNotice(null);
    const body = { ...form, sort_order: form.sort_order === '' ? null : Number(form.sort_order) };
    if (!isNew) delete body.slug;
    ['id', 'updated_at'].forEach((k) => delete body[k]);
    try {
      if (isNew) {
        const res = await createDoctor(body);
        reload();
        navigate(`/admin/doctors/${res.data.id}`, { replace: true, state: { created: true } });
        return;
      }
      await updateDoctor(id, body);
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

  return (
    <form onSubmit={submit} noValidate>
      <PageTitle title={isNew ? 'Add a doctor' : `Edit: ${form.name || 'Doctor'}`}>
        <Link to="/admin/doctors" className="adm-btn ghost"><ArrowLeft size={16} /> All doctors</Link>
        <button type="submit" className="adm-btn primary" disabled={busy}>
          {busy ? <span className="adm-spinner sm light" /> : <Save size={16} />} {busy ? 'Saving…' : 'Save'}
        </button>
      </PageTitle>
      <Notice notice={notice} />

      <div className="adm-grid">
        <div className="adm-card">
          <h2>Basic details</h2>
          <div className="adm-form-grid">
            <Field label="Doctor's name" required error={errors.name} full>
              <input value={form.name} onChange={set('name')} maxLength={120} placeholder="e.g. Dr. Priya Sharma" />
            </Field>
            <Field
              label="Web address"
              full
              error={errors.slug}
              hint={isNew ? 'Lowercase letters, numbers and hyphens. This cannot be changed later.' : 'The web address is fixed so existing links keep working.'}
            >
              <div className="adm-prefix">
                <span>/doctors/</span>
                <input value={form.slug} disabled={!isNew} onChange={(e) => { setSlugTouched(true); set('slug')(slugify(e.target.value)); }} maxLength={120} />
              </div>
            </Field>
            <Field label="Speciality badge" error={errors.title} hint="Short label on the photo, e.g. “Orthodontist”. Optional.">
              <input value={form.title} onChange={set('title')} maxLength={80} />
            </Field>
            <Field label="Qualification" error={errors.qualification} hint="e.g. “BDS, MDS (Orthodontics)”">
              <input value={form.qualification} onChange={set('qualification')} maxLength={200} />
            </Field>
            <Field label="Experience" error={errors.experience} hint="e.g. “15 Years of Clinical Experience”" full>
              <input value={form.experience} onChange={set('experience')} maxLength={160} />
            </Field>
            <Field label="Headline" error={errors.headline} hint="Optional line under the name on the doctor's page, e.g. “Specialist in Prosthodontics and Implantology”." full>
              <input value={form.headline} onChange={set('headline')} maxLength={200} />
            </Field>
          </div>
        </div>

        <div className="adm-card">
          <h2>Photo &amp; visibility</h2>
          <p className="adm-hint" style={{ marginTop: -6 }}>A portrait photo (about 800 × 1000) on a plain background looks best.</p>
          <ImageUpload value={form.photo} onChange={set('photo')} label="Upload photo" shape="portrait" />
          {errors.photo && <span className="adm-err">{errors.photo}</span>}
          <label className="adm-check" style={{ marginTop: 18 }}>
            <input type="checkbox" checked={form.is_active} onChange={set('is_active')} />
            <span><strong>Show on website</strong><small>Untick to hide this doctor without deleting.</small></span>
          </label>
          <Field label="Display order" error={errors.sort_order} hint="Lower numbers appear first. Leave empty to add at the end.">
            <input type="number" min="0" max="9999" value={form.sort_order} onChange={set('sort_order')} />
          </Field>
        </div>

        <div className="adm-card">
          <h2>Doctor's page</h2>
          <p className="adm-info"><Info size={16} /> Add an “About” text or profile details to give this doctor their own page. Without them, the card on the About page shows “Profile details coming soon”.</p>
          <Field label="About the doctor" error={errors.bio} full hint="Leave a blank line between paragraphs.">
            <textarea rows={8} value={form.bio} onChange={set('bio')} maxLength={6000} />
          </Field>
          <Field
            label="Profile details"
            error={errors.profile}
            full
            hint="Start a line with “## ” for a heading and “- ” for a bullet point. A line like “Speciality: Periodontics” shows as a detail row."
          >
            <textarea rows={10} value={form.profile} onChange={set('profile')} maxLength={8000}
              placeholder={'Speciality: Orthodontics\n\n## Areas of Expertise\n- Braces\n- Clear aligners'} />
          </Field>
        </div>
      </div>

      <div className="adm-savebar">
        <button type="submit" className="adm-btn primary" disabled={busy}>
          {busy ? <span className="adm-spinner sm light" /> : <Save size={16} />} {busy ? 'Saving…' : isNew ? 'Add doctor' : 'Save changes'}
        </button>
      </div>
    </form>
  );
}
