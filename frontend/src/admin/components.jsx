import { useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, ImagePlus, Trash2 } from 'lucide-react';
import { uploadImage, readError } from './adminApi';
import { toJpegs } from './resizeImage';

const MAX_SOURCE_MB = 25; // photos that are resized in the browser first may start out larger than the 3 MB upload limit

export function Notice({ notice }) {
  if (!notice?.message) return null;
  const ok = notice.type === 'success';
  return (
    <div className={`adm-notice ${ok ? 'ok' : 'bad'}`} role={ok ? 'status' : 'alert'}>
      {ok ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />} <span>{notice.message}</span>
    </div>
  );
}

export function Field({ label, hint, error, required, children, full }) {
  return (
    <div className={`adm-field ${error ? 'invalid' : ''} ${full ? 'full' : ''}`}>
      <label>
        <span>{label}{required && <em> *</em>}</span>
        {children}
      </label>
      {error ? <span className="adm-err">{error}</span> : hint && <span className="adm-hint">{hint}</span>}
    </div>
  );
}

export function PageTitle({ title, subtitle, children }) {
  return (
    <div className="adm-page-head">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children && <div className="adm-page-actions">{children}</div>}
    </div>
  );
}

/**
 * Image picker that uploads immediately and returns the stored URL via onChange.
 * With `resize` ({ max, thumb }: longest side in px) the photo is first redrawn in the browser as a JPEG,
 * which keeps phone photos under the upload limit and leaves out their EXIF/GPS data. A `thumb` copy is
 * uploaded too, and onChange receives (url, thumbUrl). `required` hides the Remove button.
 * `onBusy` is called with true while a photo is being prepared or uploaded, and with false when that ends.
 */
export function ImageUpload({ value, onChange, onBusy, fallback, label = 'Upload image', shape = 'wide', resize, required }) {
  const input = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const maxMb = resize ? MAX_SOURCE_MB : 3;
    if (file.size > maxMb * 1024 * 1024) {
      setError(`Image must be smaller than ${maxMb} MB.`);
      return;
    }
    setBusy(true);
    onBusy?.(true);
    setError('');
    try {
      if (resize) {
        const copies = await toJpegs(file, [resize.max, resize.thumb].filter(Boolean)).catch(() => null);
        if (!copies) {
          setError('This file could not be opened as a photo. Choose a JPG, PNG or WEBP image.');
          return;
        }
        const [full, thumb] = await Promise.all(copies.map((copy) => uploadImage(copy)));
        onChange(full.url, thumb?.url || '');
      } else {
        const res = await uploadImage(file);
        onChange(res.url);
      }
    } catch (err) {
      setError(readError(err, 'Upload failed.').message);
    } finally {
      setBusy(false);
      onBusy?.(false);
    }
  };

  const shown = value || fallback;
  return (
    <div className="adm-upload">
      <div className={`adm-upload-preview ${shape}`}>
        {shown ? <img src={shown} alt="" /> : <span>No image</span>}
        {!value && fallback && <small>Default</small>}
      </div>
      <div className="adm-upload-actions">
        <input ref={input} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={pick} />
        <button type="button" className="adm-btn" onClick={() => input.current?.click()} disabled={busy}>
          {busy ? <span className="adm-spinner sm" /> : <ImagePlus size={16} />} {busy ? 'Uploading…' : label}
        </button>
        {value && !required && (
          <button type="button" className="adm-btn ghost" onClick={() => onChange('')}>
            <Trash2 size={16} /> {fallback ? 'Use default' : 'Remove'}
          </button>
        )}
        <span className="adm-hint">
          {resize ? 'JPG, PNG or WEBP · large photos are made smaller automatically' : 'PNG, JPG or WEBP · max 3 MB'}
        </span>
        {error && <span className="adm-err">{error}</span>}
      </div>
    </div>
  );
}

export const STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export function StatusBadge({ status }) {
  return <span className={`adm-badge ${status}`}>{STATUS_LABELS[status] || status}</span>;
}

export const formatDate = (d) => {
  if (!d) return '';
  const date = new Date(String(d).replace(' ', 'T'));
  if (Number.isNaN(date.getTime())) return d;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const formatDateTime = (d) => {
  if (!d) return '';
  const date = new Date(String(d).replace(' ', 'T'));
  if (Number.isNaN(date.getTime())) return d;
  return date.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
};
