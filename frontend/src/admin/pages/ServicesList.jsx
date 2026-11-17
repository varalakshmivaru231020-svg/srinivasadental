import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Eye, EyeOff, Home as HomeIcon, ExternalLink } from 'lucide-react';
import { getServices, updateService, deleteService, readError } from '../adminApi';
import { Notice, PageTitle } from '../components';
import Icon from '../../components/Icon';
import { useSite } from '../../context/SiteContext';

export default function ServicesList() {
  const [rows, setRows] = useState(null);
  const [notice, setNotice] = useState(null);
  const { reload } = useSite();

  const load = () => getServices()
    .then((res) => setRows(res.data))
    .catch((err) => setNotice({ type: 'error', message: readError(err).message }));

  useEffect(() => { load(); }, []);

  const toggle = async (row, field) => {
    try {
      const value = !row[field];
      await updateService(row.id, {
        service_name: row.service_name, description: row.description, tagline: row.tagline, icon: row.icon,
        image: row.image, content: row.content, meta_title: row.meta_title, meta_description: row.meta_description,
        sort_order: row.sort_order, is_active: field === 'is_active' ? value : Boolean(row.is_active),
        show_on_home: field === 'show_on_home' ? value : Boolean(row.show_on_home),
      });
      setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, [field]: value ? 1 : 0 } : r)));
      reload();
      const what = field === 'is_active' ? (value ? 'is now visible on the website' : 'is now hidden from the website')
        : (value ? 'will show on the home page' : 'removed from the home page');
      setNotice({ type: 'success', message: `${row.service_name} ${what}.` });
    } catch (err) {
      setNotice({ type: 'error', message: readError(err).message });
    }
  };

  const remove = async (row) => {
    if (!window.confirm(`Delete "${row.service_name}" permanently?\n\nTip: use "Hide" instead if you may offer it again. Past appointment requests are kept.`)) return;
    try {
      await deleteService(row.id);
      setRows((rs) => rs.filter((r) => r.id !== row.id));
      reload();
      setNotice({ type: 'success', message: `${row.service_name} deleted.` });
    } catch (err) {
      setNotice({ type: 'error', message: readError(err).message });
    }
  };

  return (
    <>
      <PageTitle title="Services" subtitle="Add, edit, hide or reorder the treatments shown on the website.">
        <Link to="/admin/services/new" className="adm-btn primary"><Plus size={17} /> Add service</Link>
      </PageTitle>
      <Notice notice={notice} />

      <div className="adm-card flush">
        {!rows ? (
          <div className="adm-empty"><span className="adm-spinner" /></div>
        ) : rows.length === 0 ? (
          <div className="adm-empty">No services yet. Click “Add service” to create one.</div>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead><tr><th>#</th><th>Service</th><th>On website</th><th>Home page</th><th /></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className={r.is_active ? '' : 'adm-dim'}>
                    <td className="adm-muted">{r.sort_order}</td>
                    <td>
                      <div className="adm-svc">
                        {r.image ? <img src={r.image} alt="" /> : <span className="adm-svc-ic"><Icon name={r.icon} size={20} /></span>}
                        <div>
                          <strong>{r.service_name}</strong>
                          <small>/services/{r.slug}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <button type="button" className={`adm-pill ${r.is_active ? 'on' : ''}`} onClick={() => toggle(r, 'is_active')}>
                        {r.is_active ? <><Eye size={14} /> Visible</> : <><EyeOff size={14} /> Hidden</>}
                      </button>
                    </td>
                    <td>
                      <button type="button" className={`adm-pill ${r.show_on_home ? 'on' : ''}`} onClick={() => toggle(r, 'show_on_home')}>
                        <HomeIcon size={14} /> {r.show_on_home ? 'Shown' : 'Not shown'}
                      </button>
                    </td>
                    <td className="adm-row-actions">
                      {r.is_active ? (
                        <a className="adm-icon-btn" href={`/services#${r.slug}`} target="_blank" rel="noreferrer" aria-label={`View ${r.service_name} on website`}><ExternalLink size={16} /></a>
                      ) : null}
                      <Link className="adm-icon-btn" to={`/admin/services/${r.id}`} aria-label={`Edit ${r.service_name}`}><Pencil size={16} /></Link>
                      <button type="button" className="adm-icon-btn danger" onClick={() => remove(r)} aria-label={`Delete ${r.service_name}`}><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <p className="adm-footnote">The home page shows up to 8 services marked “Shown”. Lower numbers appear first.</p>
    </>
  );
}
