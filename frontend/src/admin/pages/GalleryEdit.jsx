import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Info } from 'lucide-react';
import { getGalleryPhoto, createGalleryPhoto, updateGalleryPhoto, readError } from '../adminApi';
import { Field, ImageUpload, Notice, PageTitle } from '../components';
import { useSite } from '../../context/SiteContext';
import { GALLERY_CATEGORIES } from '../../data/gallery';

const empty = { image: '', thumb: '', alt: '', caption: '', category: 'clinic', sort_order: '', is_active: true };

// Photos are redrawn in the browser before uploading: the longest side at most 1600 px, plus an 800 px thumbnail.
const RESIZE = { max: 1600, thumb: 800 };

const added = { type: 'success', message: 'Photo added to the gallery.' };

export default function GalleryEdit() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const location = useLocation();
  const { reload } = useSite();
  const [form, setForm] = useState(isNew ? empty : null);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState(location.state?.created ? added : null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isNew) return;
    getGalleryPhoto(id)
      .then((res) => {
        const r = res.data;
        setForm({ ...empty, ...Object.fromEntries(Object.entries(r).map(([k, v]) => [k, v ?? ''])), is_active: Boolean(r.is_active) });
      })
      .catch((err) => setNotice({ type: 'error', message: readError(err).message }));
  }, [id, isNew]);

  const set = (field) => (e) => {
    const value = e?.target ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value) : e;
    setForm((f) => ({ ...f, [field]: value }));
  };

  const setPhoto = (image, thumb = '') => setForm((f) => ({ ...f, image, thumb }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    setNotice(null);
    // An empty display order puts a new photo at the end and leaves an existing one where it is (undefined is not sent)
    const body = { ...form, sort_order: form.sort_order === '' ? (isNew ? null : undefined) : Number(form.sort_order) };
    ['id', 'updated_at'].forEach((k) => delete body[k]);
    try {
      if (isNew) {
        const res = await createGalleryPhoto(body);
        reload();
        setNotice(added); // this page stays on screen for the new photo's address
        navigate(`/admin/gallery/${res.data.id}`, { replace: true, state: { created: true } });
        return;
      }
      await updateGalleryPhoto(id, body);
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
      <PageTitle title={isNew ? 'Add a photo' : 'Edit photo'}>
        <Link to="/admin/gallery" className="adm-btn ghost"><ArrowLeft size={16} /> All photos</Link>
        <button type="submit" className="adm-btn primary" disabled={busy}>
          {busy ? <span className="adm-spinner sm light" /> : <Save size={16} />} {busy ? 'Saving…' : 'Save'}
        </button>
      </PageTitle>
      <Notice notice={notice} />

      <div className="adm-grid">
        <div className="adm-card">
          <h2>Photo</h2>
          <p className="adm-hint" style={{ marginTop: -6 }}>Photos straight from a phone are fine: they are made smaller before uploading, and their location (GPS) details are removed.</p>
          <ImageUpload
            value={form.thumb || form.image}
            onChange={setPhoto}
            label={form.image ? 'Choose another photo' : 'Choose photo'}
            shape="photo"
            resize={RESIZE}
            required
          />
          {(errors.image || errors.thumb) && <span className="adm-err">{errors.image || errors.thumb}</span>}
          <p className="adm-info" style={{ margin: '18px 0 0' }}><Info size={16} /> Only add photos of patients who have agreed to have them shown on the website.</p>
        </div>

        <div className="adm-card">
          <h2>Details</h2>
          <div className="adm-form-grid">
            <Field
              label="Photo description (alt text)"
              required
              full
              error={errors.alt}
              hint="Describes the photo for people using screen readers, and helps Google understand it, e.g. “Treatment room with a dental chair”."
            >
              <input value={form.alt} onChange={set('alt')} maxLength={200} />
            </Field>
            <Field label="Caption" full error={errors.caption} hint="Optional short label shown on the photo, e.g. “Before” or “After”.">
              <input value={form.caption} onChange={set('caption')} maxLength={80} list="adm-gallery-captions" />
              <datalist id="adm-gallery-captions"><option value="Before" /><option value="After" /></datalist>
            </Field>
            <Field label="Category" error={errors.category}>
              <select value={form.category} onChange={set('category')}>
                {GALLERY_CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
            </Field>
            <Field
              label="Display order"
              error={errors.sort_order}
              hint="Lower numbers appear first. Leave empty to add at the end."
            >
              <input type="number" min="0" max="9999" value={form.sort_order} onChange={set('sort_order')} />
            </Field>
          </div>
          <label className="adm-check" style={{ marginTop: 10, borderBottom: 0 }}>
            <input type="checkbox" checked={form.is_active} onChange={set('is_active')} />
            <span><strong>Show on website</strong><small>Untick to hide this photo without deleting it.</small></span>
          </label>
        </div>
      </div>

      <div className="adm-savebar">
        <button type="submit" className="adm-btn primary" disabled={busy}>
          {busy ? <span className="adm-spinner sm light" /> : <Save size={16} />} {busy ? 'Saving…' : isNew ? 'Add photo' : 'Save changes'}
        </button>
      </div>
    </form>
  );
}
