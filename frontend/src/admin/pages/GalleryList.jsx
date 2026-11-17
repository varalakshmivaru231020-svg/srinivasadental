import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Eye, EyeOff, ExternalLink, Info } from 'lucide-react';
import { getGallery, updateGalleryPhoto, deleteGalleryPhoto, readError } from '../adminApi';
import { Notice, PageTitle } from '../components';
import { useSite } from '../../context/SiteContext';
import { GALLERY_CATEGORIES } from '../../data/gallery';

const EDITABLE = ['image', 'thumb', 'alt', 'caption', 'category', 'sort_order'];
const categoryLabel = Object.fromEntries(GALLERY_CATEGORIES.map((c) => [c.key, c.label]));

export default function GalleryList() {
  const [rows, setRows] = useState(null);
  const [notice, setNotice] = useState(null);
  const { reload } = useSite();

  useEffect(() => {
    getGallery()
      .then((res) => setRows(res.data))
      .catch((err) => setNotice({ type: 'error', message: readError(err).message }));
  }, []);

  const toggle = async (row) => {
    try {
      const value = !row.is_active;
      const body = Object.fromEntries(EDITABLE.map((k) => [k, row[k] ?? '']));
      await updateGalleryPhoto(row.id, { ...body, sort_order: row.sort_order, is_active: value });
      setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, is_active: value ? 1 : 0 } : r)));
      reload();
      setNotice({ type: 'success', message: value ? 'The photo is now shown on the website.' : 'The photo is now hidden from the website.' });
    } catch (err) {
      setNotice({ type: 'error', message: readError(err).message });
    }
  };

  const remove = async (row) => {
    if (!window.confirm(`Delete this photo permanently?\n\n“${row.alt}”\n\nTip: use "Hide" instead if you may show it again.`)) return;
    try {
      await deleteGalleryPhoto(row.id);
      setRows((rs) => rs.filter((r) => r.id !== row.id));
      reload();
      setNotice({ type: 'success', message: 'Photo deleted.' });
    } catch (err) {
      setNotice({ type: 'error', message: readError(err).message });
    }
  };

  return (
    <>
      <PageTitle title="Gallery" subtitle="The photos on the website's Gallery page: smile results and the clinic.">
        <a href="/gallery" target="_blank" rel="noreferrer" className="adm-btn ghost"><ExternalLink size={16} /> View gallery</a>
        <Link to="/admin/gallery/new" className="adm-btn primary"><Plus size={17} /> Add photo</Link>
      </PageTitle>
      <Notice notice={notice} />

      <p className="adm-info"><Info size={16} /> Only add photos of patients who have agreed to have them shown on the website.</p>

      {!rows ? (
        <div className="adm-card"><div className="adm-empty"><span className="adm-spinner" /></div></div>
      ) : rows.length === 0 ? (
        <div className="adm-card"><div className="adm-empty">No photos yet. Click “Add photo” to add one.</div></div>
      ) : (
        <ul className="adm-gallery">
          {rows.map((r) => (
            <li key={r.id} className={`adm-photo ${r.is_active ? '' : 'off'}`}>
              <Link to={`/admin/gallery/${r.id}`} className="adm-photo-img" tabIndex={-1} aria-hidden="true">
                <img src={r.thumb || r.image} alt="" loading="lazy" style={r.category === 'smiles' ? { objectPosition: 'center 75%' } : undefined} />
                {r.caption && <span className="adm-photo-caption">{r.caption}</span>}
              </Link>
              <div className="adm-photo-body">
                <p title={r.alt}>{r.alt}</p>
                <small>{categoryLabel[r.category] || r.category} · Order {r.sort_order}</small>
              </div>
              <div className="adm-photo-foot">
                <button type="button" className={`adm-pill ${r.is_active ? 'on' : ''}`} onClick={() => toggle(r)}>
                  {r.is_active ? <><Eye size={14} /> Visible</> : <><EyeOff size={14} /> Hidden</>}
                </button>
                <span className="adm-row-actions">
                  <Link className="adm-icon-btn" to={`/admin/gallery/${r.id}`} aria-label={`Edit photo: ${r.alt}`}><Pencil size={16} /></Link>
                  <button type="button" className="adm-icon-btn danger" onClick={() => remove(r)} aria-label={`Delete photo: ${r.alt}`}><Trash2 size={16} /></button>
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
      <p className="adm-footnote">Lower numbers appear first. Visitors can filter the Gallery page by Smile Results and Our Clinic when both have photos.</p>
    </>
  );
}
