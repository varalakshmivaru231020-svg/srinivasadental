import { useState } from 'react';
import { KeyRound } from 'lucide-react';
import { changePassword, readError } from '../adminApi';
import { Field, Notice, PageTitle } from '../components';
import { useAdminAuth } from '../AdminAuth';

const empty = { current_password: '', new_password: '', confirm: '' };

export default function Account() {
  const { user } = useAdminAuth();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState(null);
  const [busy, setBusy] = useState(false);

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setNotice(null);
    if (form.new_password !== form.confirm) {
      setErrors({ confirm: 'The two new passwords do not match.' });
      return;
    }
    setBusy(true);
    setErrors({});
    try {
      const res = await changePassword({ current_password: form.current_password, new_password: form.new_password });
      setForm(empty);
      setNotice({ type: 'success', message: res.message });
    } catch (err) {
      const { message, fields } = readError(err);
      setErrors(fields);
      setNotice({ type: 'error', message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageTitle title="Change Password" subtitle={`Signed in as “${user?.username}”.`} />
      <div className="adm-card narrow">
        <Notice notice={notice} />
        <form onSubmit={submit} noValidate className="adm-form-grid one">
          <Field label="Current password" required error={errors.current_password}>
            <input type="password" autoComplete="current-password" value={form.current_password} onChange={set('current_password')} />
          </Field>
          <Field label="New password" required error={errors.new_password} hint="At least 8 characters. Mixing words, numbers and symbols is best.">
            <input type="password" autoComplete="new-password" value={form.new_password} onChange={set('new_password')} />
          </Field>
          <Field label="Repeat new password" required error={errors.confirm}>
            <input type="password" autoComplete="new-password" value={form.confirm} onChange={set('confirm')} />
          </Field>
          <div>
            <button type="submit" className="adm-btn primary" disabled={busy}>
              {busy ? <span className="adm-spinner sm light" /> : <KeyRound size={16} />} {busy ? 'Saving…' : 'Change password'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
