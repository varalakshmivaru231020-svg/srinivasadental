import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Eye, EyeOff, ExternalLink, UserRound } from 'lucide-react';
import { getDoctors, updateDoctor, deleteDoctor, readError } from '../adminApi';
import { Notice, PageTitle } from '../components';
import { useSite } from '../../context/SiteContext';

const EDITABLE = ['name', 'title', 'qualification', 'experience', 'headline', 'photo', 'bio', 'profile', 'sort_order'];

export default function DoctorsList() {
  const [rows, setRows] = useState(null);
  const [notice, setNotice] = useState(null);
  const { reload } = useSite();

  useEffect(() => {
    getDoctors()
      .then((res) => setRows(res.data))
      .catch((err) => setNotice({ type: 'error', message: readError(err).message }));
  }, []);

  const toggle = async (row) => {
    try {
      const value = !row.is_active;
      const body = Object.fromEntries(EDITABLE.map((k) => [k, row[k] ?? '']));
      await updateDoctor(row.id, { ...body, sort_order: row.sort_order, is_active: value });
      setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, is_active: value ? 1 : 0 } : r)));
      reload();
      setNotice({ type: 'success', message: `${row.name} ${value ? 'is now shown on the website' : 'is now hidden from the website'}.` });
    } catch (err) {
      setNotice({ type: 'error', message: readError(err).message });
    }
  };

  const remove = async (row) => {
    if (!window.confirm(`Delete ${row.name} permanently?\n\nTip: use "Hide" instead if the doctor may return.`)) return;
    try {
      await deleteDoctor(row.id);
      setRows((rs) => rs.filter((r) => r.id !== row.id));
      reload();
      setNotice({ type: 'success', message: `${row.name} deleted.` });
    } catch (err) {
      setNotice({ type: 'error', message: readError(err).message });
    }
  };

  return (
    <>
      <PageTitle title="Doctors" subtitle="The dental team on the About page. Each doctor with a profile also gets their own page.">
        <Link to="/admin/doctors/new" className="adm-btn primary"><Plus size={17} /> Add doctor</Link>
      </PageTitle>
      <Notice notice={notice} />

      <div className="adm-card flush">
        {!rows ? (
          <div className="adm-empty"><span className="adm-spinner" /></div>
        ) : rows.length === 0 ? (
          <div className="adm-empty">No doctors yet. Click “Add doctor” to add one.</div>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead><tr><th>#</th><th>Doctor</th><th>Qualification</th><th>On website</th><th /></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className={r.is_active ? '' : 'adm-dim'}>
                    <td className="adm-muted">{r.sort_order}</td>
                    <td>
                      <div className="adm-svc">
                        {r.photo ? <img src={r.photo} alt="" style={{ objectPosition: 'center 15%' }} /> : <span className="adm-svc-ic"><UserRound size={20} /></span>}
                        <div>
                          <strong>{r.name}</strong>
                          <small>{r.title || '—'}</small>
                        </div>
                      </div>
                    </td>
                    <td className="adm-muted">{r.qualification || '—'}</td>
                    <td>
                      <button type="button" className={`adm-pill ${r.is_active ? 'on' : ''}`} onClick={() => toggle(r)}>
                        {r.is_active ? <><Eye size={14} /> Visible</> : <><EyeOff size={14} /> Hidden</>}
                      </button>
                    </td>
                    <td className="adm-row-actions">
                      {r.is_active && (r.bio || r.profile) ? (
                        <a className="adm-icon-btn" href={`/doctors/${r.slug}`} target="_blank" rel="noreferrer" aria-label={`View ${r.name}'s page on the website`}><ExternalLink size={16} /></a>
                      ) : null}
                      <Link className="adm-icon-btn" to={`/admin/doctors/${r.id}`} aria-label={`Edit ${r.name}`}><Pencil size={16} /></Link>
                      <button type="button" className="adm-icon-btn danger" onClick={() => remove(r)} aria-label={`Delete ${r.name}`}><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <p className="adm-footnote">Lower numbers appear first. Dr. S. Vishwas’s profile at the top of the About page is part of the website itself.</p>
    </>
  );
}
