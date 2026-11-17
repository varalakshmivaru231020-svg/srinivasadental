import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, Star, Save, X, Info } from 'lucide-react';
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial, readError } from '../adminApi';
import { Field, Notice, PageTitle } from '../components';
import { useSite } from '../../context/SiteContext';

const empty = { patient_name: '', review_text: '', rating: 5, treatment: '', source: 'Google review', sort_order: 0, is_active: true };

export default function Testimonials() {
  const { reload } = useSite();
  const [rows, setRows] = useState(null);
  const [form, setForm] = useState(null); // null = closed; { id?, ...fields } = editing
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = () => getTestimonials()
    .then((res) => setRows(res.data))
    .catch((err) => setNotice({ type: 'error', message: readError(err).message }));

  useEffect(() => { load(); }, []);

  const set = (f) => (e) => setForm((v) => ({ ...v, [f]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const open = (row) => {
    setErrors({});
    setNotice(null);
    setForm(row ? {
      id: row.id, patient_name: row.patient_name, review_text: row.review_text, rating: row.rating || '',
      treatment: row.treatment || '', source: row.source || '', sort_order: row.sort_order, is_active: Boolean(row.is_active),
    } : { ...empty });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    const { id, ...body } = form;
    body.rating = body.rating === '' ? null : Number(body.rating);
    body.sort_order = body.sort_order === '' ? 0 : Number(body.sort_order);
    try {
      if (id) await updateTestimonial(id, body); else await createTestimonial(body);
      setForm(null);
      setNotice({ type: 'success', message: id ? 'Testimonial saved.' : 'Testimonial added to the website.' });
      load();
      reload();
    } catch (err) {
      const { message, fields } = readError(err);
      setErrors(fields);
      setNotice({ type: 'error', message });
    } finally {
      setBusy(false);
    }
  };

  const toggle = async (row) => {
    try {
      await updateTestimonial(row.id, { ...row, rating: row.rating || null, is_active: !row.is_active });
      setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, is_active: row.is_active ? 0 : 1 } : r)));
      reload();
    } catch (err) {
      setNotice({ type: 'error', message: readError(err).message });
    }
  };

  const remove = async (row) => {
    if (!window.confirm(`Delete the review from ${row.patient_name}?`)) return;
    try {
      await deleteTestimonial(row.id);
      setRows((rs) => rs.filter((r) => r.id !== row.id));
      reload();
      setNotice({ type: 'success', message: 'Testimonial deleted.' });
    } catch (err) {
      setNotice({ type: 'error', message: readError(err).message });
    }
  };

  return (
    <>
      <PageTitle title="Testimonials" subtitle="Patient reviews shown in the testimonials carousel on the home page.">
        {!form && <button type="button" className="adm-btn primary" onClick={() => open(null)}><Plus size={17} /> Add testimonial</button>}
      </PageTitle>
      <Notice notice={notice} />

      <p className="adm-info"><Info size={16} /> Only add genuine reviews that patients have agreed to share (for example, copied from your Google reviews). Until at least one is visible, the website shows clearly marked sample cards.</p>

      {form && (
        <form className="adm-card" onSubmit={save} noValidate>
          <div className="adm-card-head">
            <h2>{form.id ? 'Edit testimonial' : 'New testimonial'}</h2>
            <button type="button" className="adm-icon-btn" onClick={() => setForm(null)} aria-label="Close"><X size={16} /></button>
          </div>
          <div className="adm-form-grid">
            <Field label="Patient name" required error={errors.patient_name} hint="First name and initial is enough, e.g. “Priya S.”">
              <input value={form.patient_name} onChange={set('patient_name')} maxLength={100} />
            </Field>
            <Field label="Treatment (optional)" error={errors.treatment}>
              <input value={form.treatment} onChange={set('treatment')} maxLength={120} placeholder="e.g. Root canal treatment" />
            </Field>
            <Field label="Review" required error={errors.review_text} full>
              <textarea rows={5} value={form.review_text} onChange={set('review_text')} maxLength={1500} />
            </Field>
            <Field label="Star rating" error={errors.rating}>
              <select value={form.rating} onChange={set('rating')}>
                <option value="">No rating</option>
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{'★'.repeat(n)} ({n})</option>)}
              </select>
            </Field>
            <Field label="Source (optional)" error={errors.source} hint="e.g. Google review, Patient feedback form">
              <input value={form.source} onChange={set('source')} maxLength={60} />
            </Field>
            <Field label="Display order" error={errors.sort_order} hint="Lower numbers appear first.">
              <input type="number" min="0" max="9999" value={form.sort_order} onChange={set('sort_order')} />
            </Field>
            <label className="adm-check" style={{ alignSelf: 'end', borderBottom: 0 }}>
              <input type="checkbox" checked={form.is_active} onChange={set('is_active')} />
              <span><strong>Show on website</strong></span>
            </label>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            <button type="submit" className="adm-btn primary" disabled={busy}>
              {busy ? <span className="adm-spinner sm light" /> : <Save size={16} />} {busy ? 'Saving…' : 'Save'}
            </button>
            <button type="button" className="adm-btn ghost" onClick={() => setForm(null)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="adm-card flush">
        {!rows ? (
          <div className="adm-empty"><span className="adm-spinner" /></div>
        ) : rows.length === 0 ? (
          <div className="adm-empty">No testimonials yet. Click “Add testimonial” to add your first patient review.</div>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead><tr><th>Patient</th><th>Review</th><th>Rating</th><th>On website</th><th /></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className={r.is_active ? '' : 'adm-dim'}>
                    <td><strong>{r.patient_name}</strong><small>{[r.treatment, r.source].filter(Boolean).join(' · ')}</small></td>
                    <td className="adm-msg" style={{ maxWidth: 420 }}>{r.review_text}</td>
                    <td style={{ whiteSpace: 'nowrap', color: '#E6A23C' }}>
                      {r.rating ? Array.from({ length: r.rating }, (_, i) => <Star key={i} size={14} fill="currentColor" strokeWidth={0} />) : <span className="adm-muted">—</span>}
                    </td>
                    <td>
                      <button type="button" className={`adm-pill ${r.is_active ? 'on' : ''}`} onClick={() => toggle(r)}>
                        {r.is_active ? <><Eye size={14} /> Visible</> : <><EyeOff size={14} /> Hidden</>}
                      </button>
                    </td>
                    <td className="adm-row-actions">
                      <button type="button" className="adm-icon-btn" onClick={() => open(r)} aria-label={`Edit review from ${r.patient_name}`}><Pencil size={16} /></button>
                      <button type="button" className="adm-icon-btn danger" onClick={() => remove(r)} aria-label={`Delete review from ${r.patient_name}`}><Trash2 size={16} /></button>
                    </td>
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
