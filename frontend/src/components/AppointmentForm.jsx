import { useState } from 'react';
import { CalendarCheck, CheckCircle2, AlertCircle, Info, ChevronDown } from 'lucide-react';
import { WhatsAppIcon } from './BrandIcons';
import { submitAppointment } from '../services/api';
import { useSite } from '../context/SiteContext';
import { Button, Eyebrow, cx } from './ui';
import { whatsappLink } from './Shared';

const initial = { full_name: '', phone: '', email: '', service: '', preferred_date: '', preferred_time: '', message: '' };
const TIMES = ['Morning (10 AM – 2 PM)', 'Evening (5 PM – 9 PM)'];
const today = () => new Date().toISOString().slice(0, 10);

export function validate(v) {
  const e = {};
  const name = v.full_name.trim();
  if (!name) e.full_name = 'Please enter your full name.';
  else if (name.length < 2 || !/^[A-Za-z.\s'-]+$/.test(name)) e.full_name = 'Please enter a valid name.';
  const phone = v.phone.replace(/[\s-]/g, '').replace(/^(\+91|91|0)/, '');
  if (!phone) e.phone = 'Please enter your phone number.';
  else if (!/^[6-9]\d{9}$/.test(phone)) e.phone = 'Enter a valid 10-digit mobile number.';
  if (v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'Enter a valid email address.';
  if (!v.service) e.service = 'Please select a dental service.';
  if (!v.preferred_date) e.preferred_date = 'Please choose a preferred date.';
  else if (v.preferred_date < today()) e.preferred_date = 'Date cannot be in the past.';
  if (!v.preferred_time) e.preferred_time = 'Please choose a preferred time.';
  if (v.message.length > 1000) e.message = 'Message must be under 1000 characters.';
  return e;
}

const inputBase = 'w-full border text-[0.95rem] text-navy placeholder:text-muted/70 transition-all duration-300 outline-none focus:bg-white focus:ring-4';
const inputBad = 'border-red-400 focus:border-red-500 focus:ring-red-500/10';

// `clinic` matches the pill-shaped form on the clinic's original contact page.
const LOOKS = {
  default: {
    form: 'rounded-[2rem] border border-line bg-white p-7 shadow-soft sm:p-10',
    field: 'rounded-2xl bg-canvas px-4',
    area: 'rounded-2xl bg-canvas px-4',
    ok: 'border-line focus:border-teal focus:ring-teal/10',
  },
  clinic: {
    form: 'rounded-[10px] bg-white p-6 font-heebo shadow-[0_10px_30px_0_rgb(0_0_0/0.12)] sm:p-8 [&_label]:text-clinic-navy',
    field: 'rounded-full bg-clinic-bg px-5',
    area: 'rounded-3xl bg-clinic-bg px-5',
    ok: 'border-transparent focus:border-clinic-teal focus:ring-clinic-teal/10',
  },
  // Narrow form for the treatment page sidebar; the treatment is already known.
  compact: {
    form: 'font-heebo [&_label]:text-clinic-navy',
    field: 'rounded-full bg-clinic-bg px-5',
    area: 'rounded-3xl bg-clinic-bg px-5',
    ok: 'border-transparent focus:border-clinic-teal focus:ring-clinic-teal/10',
  },
};

function Field({ id, label, required, error, full, children }) {
  return (
    <div className={cx('flex flex-col gap-2', full && 'sm:col-span-2')}>
      <label htmlFor={id} className="text-sm font-semibold text-navy">
        {label} {required && <span className="text-teal">*</span>}
      </label>
      {children}
      {error && <span className="text-[0.8rem] font-medium text-red-600" role="alert">{error}</span>}
    </div>
  );
}

export default function AppointmentForm({ defaultService = '', variant = 'default', showService }) {
  const look = LOOKS[variant];
  const isClinic = variant !== 'default';
  const isCompact = variant === 'compact';
  // The compact form (treatment pages) already knows the service; elsewhere the patient picks one.
  const askService = showService ?? !isCompact;
  const [values, setValues] = useState({ ...initial, service: defaultService });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState({ state: 'idle', msg: '' });
  const { services, clinic } = useSite();
  const options = services.map((s) => ({ value: s.slug, label: s.title }));
  const wa = whatsappLink(clinic);

  const onChange = (e) => {
    const next = { ...values, [e.target.name]: e.target.value };
    setValues(next);
    if (touched[e.target.name]) setErrors(validate(next));
  };
  const onBlur = (e) => {
    setTouched((t) => ({ ...t, [e.target.name]: true }));
    setErrors(validate(values));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    setTouched(Object.keys(initial).reduce((a, k) => ({ ...a, [k]: true }), {}));
    if (Object.keys(errs).length) {
      setStatus({ state: 'error', msg: 'Please correct the highlighted fields.' });
      return;
    }
    setStatus({ state: 'loading', msg: '' });
    try {
      const res = await submitAppointment(values);
      setStatus({ state: 'success', msg: res.message || 'Thank you! Your appointment request has been received.' });
      setValues({ ...initial, service: defaultService });
      setTouched({});
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      if (Array.isArray(apiErrors)) {
        setErrors(apiErrors.reduce((a, x) => ({ ...a, [x.path || x.param]: x.msg }), {}));
      }
      setStatus({
        state: 'error',
        msg: err.response?.data?.message || `We could not submit your request right now. Please call us on ${clinic.phones.join(' / ')}.`,
      });
    }
  };

  const err = (name) => (touched[name] ? errors[name] : undefined);
  const cls = (name, extra = 'h-13', shape = look.field) => cx(inputBase, shape, err(name) ? inputBad : look.ok, extra);
  const common = (name) => ({ id: name, name, value: values[name], onChange, onBlur, 'aria-invalid': Boolean(err(name)) });

  return (
    <form className={look.form} onSubmit={onSubmit} noValidate id="appointment" aria-label="Appointment request">
      {!isClinic && (
        <>
          <Eyebrow>Appointment Request</Eyebrow>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-[-0.03em]">Book Your Dental Consultation</h2>
          <p className="mt-3 mb-8 text-muted">Fill in your details and our team will call you to confirm a suitable time.</p>
        </>
      )}

      {status.state === 'success' && (
        <div className="mb-6 flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800" role="status">
          <CheckCircle2 size={20} className="mt-0.5 shrink-0" /> <span>{status.msg}</span>
        </div>
      )}
      {status.state === 'error' && (
        <div className="mb-6 flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700" role="alert">
          <AlertCircle size={20} className="mt-0.5 shrink-0" /> <span>{status.msg}</span>
        </div>
      )}

      <div className={isCompact ? 'grid gap-3' : 'grid gap-5 sm:grid-cols-2'}>
        <Field id="full_name" label="Full Name" required error={err('full_name')}>
          <input {...common('full_name')} autoComplete="name" placeholder="Your full name" className={cls('full_name')} />
        </Field>
        <Field id="phone" label="Phone Number" required error={err('phone')}>
          <input {...common('phone')} type="tel" inputMode="tel" autoComplete="tel" placeholder="10-digit mobile number" className={cls('phone')} />
        </Field>
        <Field id="email" label="Email Address" error={err('email')}>
          <input {...common('email')} type="email" autoComplete="email" placeholder="you@example.com (optional)" className={cls('email')} />
        </Field>
        {askService && (
          <Field id="service" label="Dental Service" required error={err('service')}>
            <div className="relative">
              <select {...common('service')} className={cls('service', 'h-13 appearance-none pr-11')}>
                <option value="">Select a service</option>
                {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                <option value="general-check-up">General Check-up / Not Sure</option>
              </select>
              <ChevronDown size={18} className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-muted" />
            </div>
          </Field>
        )}
        <Field id="preferred_date" label="Preferred Date" required error={err('preferred_date')}>
          <input {...common('preferred_date')} type="date" min={today()} className={cls('preferred_date')} />
        </Field>
        <Field id="preferred_time" label="Preferred Time" required error={err('preferred_time')}>
          <div className="relative">
            <select {...common('preferred_time')} className={cls('preferred_time', 'h-13 appearance-none pr-11')}>
              <option value="">Select a time slot</option>
              {TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <ChevronDown size={18} className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-muted" />
          </div>
        </Field>
        <Field id="message" label="Message" error={err('message')} full={!isCompact}>
          <textarea {...common('message')} maxLength={1000} placeholder="Briefly describe your dental concern (optional)" className={cls('message', isCompact ? 'min-h-24 resize-y py-3' : 'min-h-32 resize-y py-3.5', look.area)} />
        </Field>
      </div>

      {isCompact ? (
        <p className="mt-4 text-sm leading-relaxed text-muted">Requests are confirmed by the clinic by phone. For emergencies, please call us.</p>
      ) : (
        <p className="mt-6 flex gap-3 rounded-2xl bg-mint-soft p-4 text-sm leading-relaxed text-navy/75">
          <Info size={18} className="mt-0.5 shrink-0 text-teal" />
          <span>Appointment requests are subject to confirmation by the clinic. Our team will contact you to confirm the date and time. For dental emergencies, please call us directly.</span>
        </p>
      )}

      {isClinic ? (
        <button
          type="submit"
          disabled={status.state === 'loading'}
          aria-busy={status.state === 'loading'}
          className="clinic-wobble mt-6 h-14 w-full rounded-full bg-clinic-teal font-medium text-white transition-colors duration-300 hover:bg-clinic-blue disabled:pointer-events-none disabled:opacity-60"
        >
          {status.state === 'loading' ? 'Sending your request…' : 'Request an Appointment'}
        </button>
      ) : (
        <Button type="submit" size="lg" className="mt-7 w-full" disabled={status.state === 'loading'} aria-busy={status.state === 'loading'} icon={status.state === 'loading' ? undefined : CalendarCheck} arrow={status.state !== 'loading'}>
          {status.state === 'loading' ? 'Sending your request…' : 'Request an Appointment'}
        </Button>
      )}
      {wa && !isCompact && (
        <p className="mt-5 text-center text-sm text-muted">
          Prefer WhatsApp?{' '}
          <a href={wa} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-[#1FA855] hover:underline">
            <WhatsAppIcon size={15} /> Message us instead
          </a>
        </p>
      )}
    </form>
  );
}
