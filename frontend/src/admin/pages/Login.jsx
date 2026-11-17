import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { useAdminAuth } from '../AdminAuth';
import { useSite } from '../../context/SiteContext';
import { readError } from '../adminApi';
import { Notice } from '../components';

export default function Login() {
  const { user, checking, login } = useAdminAuth();
  const { clinic } = useSite();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: '', password: '' });
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);

  if (!checking && user) return <Navigate to={location.state?.from || '/admin'} replace />;

  const submit = async (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password) {
      setNotice({ type: 'error', message: 'Enter your username and password.' });
      return;
    }
    setBusy(true);
    setNotice(null);
    try {
      await login(form.username.trim(), form.password);
      navigate(location.state?.from || '/admin', { replace: true });
    } catch (err) {
      setNotice({ type: 'error', message: readError(err).message });
      setBusy(false);
    }
  };

  return (
    <div className="adm-login">
      <form className="adm-login-card" onSubmit={submit} noValidate>
        <img src={clinic.logo} alt="" width="64" height="64" />
        <h1>Admin Login</h1>
        <p>{clinic.name}</p>
        <Notice notice={notice} />
        <label className="adm-field">
          <span>Username</span>
          <input autoComplete="username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} autoFocus />
        </label>
        <label className="adm-field">
          <span>Password</span>
          <div className="adm-pw">
            <input type={show ? 'text' : 'password'} autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'}>
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </label>
        <button type="submit" className="adm-btn primary block" disabled={busy}>
          {busy ? <span className="adm-spinner sm light" /> : <LogIn size={18} />} {busy ? 'Signing in…' : 'Sign in'}
        </button>
        <a href="/" className="adm-login-back">← Back to website</a>
      </form>
    </div>
  );
}
