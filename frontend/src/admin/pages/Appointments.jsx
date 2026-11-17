import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Trash2, Phone, ChevronLeft, ChevronRight } from 'lucide-react';
import { WhatsAppIcon } from '../../components/BrandIcons';
import { getAppointments, setAppointmentStatus, deleteAppointment, readError } from '../adminApi';
import { Notice, PageTitle, STATUS_LABELS, formatDate, formatDateTime } from '../components';

const FILTERS = [{ value: '', label: 'All' }, ...Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }))];

export default function Appointments() {
  const [params, setParams] = useSearchParams();
  const status = params.get('status') || '';
  const page = Number(params.get('page')) || 1;
  const [q, setQ] = useState(params.get('q') || '');
  const [list, setList] = useState({ rows: null, total: 0, limit: 20 });
  const [notice, setNotice] = useState(null);

  const load = useCallback(() => {
    getAppointments({ status: status || undefined, q: params.get('q') || undefined, page })
      .then((res) => setList({ rows: res.data, total: res.total, limit: res.limit }))
      .catch((err) => setNotice({ type: 'error', message: readError(err).message }));
  }, [status, page, params]);

  useEffect(() => { load(); }, [load]);

  const update = (next) => {
    const p = new URLSearchParams(params);
    Object.entries(next).forEach(([k, v]) => (v ? p.set(k, v) : p.delete(k)));
    setParams(p);
  };

  const changeStatus = async (row, value) => {
    try {
      await setAppointmentStatus(row.id, value);
      setList((l) => ({ ...l, rows: l.rows.map((r) => (r.id === row.id ? { ...r, status: value } : r)) }));
      setNotice({ type: 'success', message: `${row.full_name}: marked as ${STATUS_LABELS[value]}.` });
    } catch (err) {
      setNotice({ type: 'error', message: readError(err).message });
    }
  };

  const remove = async (row) => {
    if (!window.confirm(`Delete the appointment request from ${row.full_name}? This cannot be undone.`)) return;
    try {
      await deleteAppointment(row.id);
      setNotice({ type: 'success', message: 'Appointment request deleted.' });
      load();
    } catch (err) {
      setNotice({ type: 'error', message: readError(err).message });
    }
  };

  const pages = Math.max(1, Math.ceil(list.total / list.limit));

  return (
    <>
      <PageTitle title="Appointments" subtitle="Requests sent from the website. Call the patient, then update the status." />
      <Notice notice={notice} />

      <div className="adm-toolbar">
        <div className="adm-tabs" role="tablist">
          {FILTERS.map((f) => (
            <button key={f.value} type="button" role="tab" aria-selected={status === f.value}
              className={status === f.value ? 'active' : ''} onClick={() => update({ status: f.value, page: '' })}>
              {f.label}
            </button>
          ))}
        </div>
        <form className="adm-search" onSubmit={(e) => { e.preventDefault(); update({ q: q.trim(), page: '' }); }}>
          <Search size={16} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, phone or email" aria-label="Search appointments" />
        </form>
      </div>

      <div className="adm-card flush">
        {!list.rows ? (
          <div className="adm-empty"><span className="adm-spinner" /></div>
        ) : list.rows.length === 0 ? (
          <div className="adm-empty">No appointment requests found.</div>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr><th>Patient</th><th>Service</th><th>Preferred date</th><th>Message</th><th>Received</th><th>Status</th><th /></tr>
              </thead>
              <tbody>
                {list.rows.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <strong>{r.full_name}</strong>
                      <small className="adm-contact">
                        <a href={`tel:+91${r.phone}`}><Phone size={13} /> {r.phone}</a>
                        <a href={`https://wa.me/91${r.phone}`} target="_blank" rel="noreferrer"><WhatsAppIcon size={13} /> WhatsApp</a>
                      </small>
                      {r.email && <small><a href={`mailto:${r.email}`}>{r.email}</a></small>}
                    </td>
                    <td>{r.service_name || 'General check-up'}</td>
                    <td>{formatDate(r.preferred_date)}<small>{r.preferred_time}</small></td>
                    <td className="adm-msg">{r.message || <span className="adm-muted">—</span>}</td>
                    <td>{formatDateTime(r.created_at)}</td>
                    <td>
                      <select className={`adm-status ${r.status}`} value={r.status} onChange={(e) => changeStatus(r, e.target.value)} aria-label={`Status for ${r.full_name}`}>
                        {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                    </td>
                    <td>
                      <button type="button" className="adm-icon-btn danger" onClick={() => remove(r)} aria-label={`Delete request from ${r.full_name}`}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pages > 1 && (
        <div className="adm-pager">
          <button type="button" className="adm-btn ghost" disabled={page <= 1} onClick={() => update({ page: String(page - 1) })}><ChevronLeft size={16} /> Previous</button>
          <span>Page {page} of {pages} · {list.total} requests</span>
          <button type="button" className="adm-btn ghost" disabled={page >= pages} onClick={() => update({ page: String(page + 1) })}>Next <ChevronRight size={16} /></button>
        </div>
      )}
    </>
  );
}
