import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Award, GraduationCap, UserRound } from 'lucide-react';
import useSeo from '../hooks/useSeo';
import { useSite, telHref } from '../context/SiteContext';
import { doctor as mainDoctor } from '../data/clinic';
import { cx } from '../components/ui';
import AppointmentForm from '../components/AppointmentForm';
import { CTASection } from '../components/Shared';
import DoctorProfileText from '../components/DoctorProfileText';
import { ClinicBanner, ClinicContainer, ClinicLabel, FadeIn, useTallSticky } from '../components/clinicPage';

const subhead = 'mb-4 font-poppins text-xl leading-tight font-semibold tracking-normal text-clinic-navy';

function Avatar({ src, name, className }) {
  return (
    <span className={cx('grid shrink-0 place-items-center overflow-hidden rounded-full bg-clinic-sky', className)}>
      {src ? <img src={src} alt="" loading="lazy" className="size-full object-cover object-[center_15%]" /> : <UserRound size={18} className="text-clinic-teal" aria-hidden="true" />}
      <span className="sr-only">{name}</span>
    </span>
  );
}

/** The whole team, below the doctor's profile. The current doctor is highlighted. */
function TeamGrid({ d, team }) {
  const others = team.filter((x) => x.hasProfile);
  const item = 'flex items-center gap-3 rounded-[5px] px-3 py-2.5 transition-colors duration-300';
  return (
    <FadeIn from="up" amount={0.05} innerClassName="" className="mt-12">
      <h2 className="font-poppins text-2xl leading-tight font-semibold tracking-normal text-clinic-navy uppercase">Our Dental Team</h2>
      <ul className="mt-5 grid gap-2.5 sm:grid-cols-2" aria-label="Our dental team">
        <li>
          <Link to="/about-us#founder" className={cx(item, 'bg-clinic-sky text-clinic-navy hover:text-clinic-teal')}>
            <Avatar src={mainDoctor.photo} name="" className="size-12" />
            <span className="min-w-0">
              <span className="block text-[15px] leading-tight font-medium">{mainDoctor.name}</span>
              <span className="block text-xs text-clinic-navy/70">Founder &amp; Dentist</span>
            </span>
          </Link>
        </li>
        {others.map((x) => {
          const current = x.slug === d.slug;
          return (
            <li key={x.slug}>
              <Link
                to={`/doctors/${x.slug}`}
                aria-current={current ? 'page' : undefined}
                className={cx(item, current ? 'bg-clinic-teal text-white' : 'bg-clinic-sky text-clinic-navy hover:text-clinic-teal')}
              >
                <Avatar src={x.photo} name="" className="size-12" />
                <span className="min-w-0">
                  <span className="block text-[15px] leading-tight font-medium">{x.name}</span>
                  {(x.title || x.qualification) && (
                    <span className={cx('block truncate text-xs', current ? 'text-white/85' : 'text-clinic-navy/70')}>{x.title || x.qualification}</span>
                  )}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </FadeIn>
  );
}

/** Right column: the appointment form and a call box, kept in view while reading. */
function Sidebar({ clinic }) {
  const [ref, top] = useTallSticky();
  return (
    <aside ref={ref} style={{ top }} className="self-start lg:sticky">
      <FadeIn from="right" amount={0.05}>
        <div className="rounded-[10px] border-[3px] border-clinic-bg p-6 sm:p-8">
          <h2 className="font-poppins text-2xl leading-tight font-semibold tracking-normal text-clinic-navy">Book an Appointment</h2>
          <FadeIn from="slide-right" amount={0.05} innerClassName="" className="mt-5">
            <AppointmentForm variant="compact" showService />
          </FadeIn>

          <FadeIn from="rotate" innerClassName="" className="mt-6">
            <div className="rounded-[5px] bg-gradient-to-b from-clinic-teal/50 to-clinic-navy/50 px-4 py-6 text-center">
              <p className="font-poppins font-semibold text-clinic-navy">Need Dental Care?</p>
              <a href={telHref(clinic.phones[0])} className="mt-3 inline-block rounded-full bg-white px-6 py-2 text-sm font-medium text-clinic-navy transition-colors duration-300 hover:bg-clinic-blue hover:text-white">
                Call +91 {clinic.phones[0]}
              </a>
            </div>
          </FadeIn>
        </div>
      </FadeIn>
    </aside>
  );
}

export default function DoctorDetail() {
  const { slug } = useParams();
  const { team, clinic, loaded } = useSite();
  const d = team.find((x) => x.slug === slug);

  const summary = d && [d.name, d.qualification, d.title].filter(Boolean).join(', ');
  useSeo({
    title: d ? `${d.name}${d.title ? ` – ${d.title}` : ''} | ${clinic.name}, BTM Layout, Bangalore` : `Our Dental Team | ${clinic.name}`,
    description: d ? (d.bio[0] || `${summary} at ${clinic.name}, BTM Layout, Bangalore.`).slice(0, 300) : undefined,
  });

  if (!d) return loaded ? <Navigate to="/about-us#team-members" replace /> : <div className="min-h-[70vh]" />;

  const linked = team.filter((x) => x.hasProfile);
  const at = linked.findIndex((x) => x.slug === d.slug);
  const prev = at > 0 ? linked[at - 1] : null;
  const next = at >= 0 && at < linked.length - 1 ? linked[at + 1] : null;

  return (
    <>
      <ClinicBanner page="doctor-detail" title={d.name} />

      <section className="bg-white py-12 lg:py-20">
        <ClinicContainer className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-8">
          <div className="min-w-0 font-heebo leading-relaxed text-clinic-navy">
            <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-clinic-navy/70">
              <Link to="/" className="hover:text-clinic-teal">Home</Link><span aria-hidden="true">/</span>
              <Link to="/about-us#team-members" className="hover:text-clinic-teal">Our Dental Team</Link><span aria-hidden="true">/</span>
              <span aria-current="page" className="font-medium text-clinic-navy">{d.name}</span>
            </nav>

            <div className="grid items-start gap-8 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] sm:items-center">
              <FadeIn from="up" innerClassName="">
                <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[10px] bg-gradient-to-br from-clinic-sky via-clinic-bg to-white">
                  {d.photo
                    ? <img src={d.photo} alt={d.name} className="size-full object-cover object-[center_15%]" />
                    : (
                      <span className="absolute inset-0 grid place-items-center text-center">
                        <span>
                          <UserRound size={72} strokeWidth={1} className="mx-auto text-clinic-teal/50" aria-hidden="true" />
                          <span className="mt-3 block text-sm font-medium text-clinic-teal">Photo coming soon</span>
                        </span>
                      </span>
                    )}
                </div>
              </FadeIn>
              <FadeIn from="slide-left" amount={0.05} innerClassName="">
                <ClinicLabel>{d.title || 'Our Dental Team'}</ClinicLabel>
                <h2 className="mt-3 font-poppins text-[1.75rem] leading-tight font-semibold tracking-normal text-clinic-navy sm:text-4xl">{d.name}</h2>
                {d.headline && <p className="mt-3 font-medium text-clinic-teal">{d.headline}</p>}
                <ul className="mt-5 space-y-2.5">
                  {d.qualification && (
                    <li className="flex gap-3"><GraduationCap size={20} className="mt-0.5 shrink-0 text-clinic-teal" aria-hidden="true" /><span><span className="sr-only">Qualification: </span>{d.qualification}</span></li>
                  )}
                  {d.experience && (
                    <li className="flex gap-3"><Award size={20} className="mt-0.5 shrink-0 text-clinic-teal" aria-hidden="true" /><span><span className="sr-only">Experience: </span>{d.experience}</span></li>
                  )}
                </ul>
              </FadeIn>
            </div>

            {d.bio.length > 0 && (
              <FadeIn from="slide-left" amount={0.05} innerClassName="" className="mt-10">
                <h3 className={subhead}>About {d.name}</h3>
                <div className="space-y-4 sm:text-justify">{d.bio.map((p) => <p key={p}>{p}</p>)}</div>
              </FadeIn>
            )}
            {d.profile && <DoctorProfileText text={d.profile} headingClass={subhead} />}
            {!d.hasProfile && <p className="mt-10 rounded-[5px] bg-clinic-sky/60 p-4">Profile details coming soon.</p>}

            <TeamGrid d={d} team={team} />

            {(prev || next) && (
              <nav aria-label="More doctors" className="mt-10 grid gap-3 border-t border-clinic-sky pt-8 sm:grid-cols-2">
                {prev ? (
                  <Link to={`/doctors/${prev.slug}`} className="group flex items-center gap-3 rounded-[10px] bg-clinic-bg p-3 transition-colors duration-300 hover:bg-clinic-sky">
                    <ArrowLeft size={18} className="shrink-0 text-clinic-teal transition-transform duration-300 group-hover:-translate-x-0.5" aria-hidden="true" />
                    <Avatar src={prev.photo} name="" className="size-11" />
                    <span className="min-w-0"><span className="block text-xs text-clinic-navy/60">Previous</span><span className="block truncate font-medium">{prev.name}</span></span>
                  </Link>
                ) : <span />}
                {next && (
                  <Link to={`/doctors/${next.slug}`} className="group flex items-center justify-end gap-3 rounded-[10px] bg-clinic-bg p-3 text-right transition-colors duration-300 hover:bg-clinic-sky">
                    <span className="min-w-0"><span className="block text-xs text-clinic-navy/60">Next</span><span className="block truncate font-medium">{next.name}</span></span>
                    <Avatar src={next.photo} name="" className="size-11" />
                    <ArrowRight size={18} className="shrink-0 text-clinic-teal transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                )}
              </nav>
            )}
          </div>
          <Sidebar clinic={clinic} />
        </ClinicContainer>
      </section>

      <CTASection above="white" title="Book Your Consultation" text={`Meet ${d.name} and our dental team at ${clinic.name}, BTM 2nd Stage, Bengaluru.`} />
    </>
  );
}
