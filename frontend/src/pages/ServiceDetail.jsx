import { Link, Navigate, useParams } from 'react-router-dom';
import { Info } from 'lucide-react';
import useSeo from '../hooks/useSeo';
import { useSite, telHref } from '../context/SiteContext';
import { cx } from '../components/ui';
import { FAQ, serviceHref } from '../components/Shared';
import AppointmentForm from '../components/AppointmentForm';
import GoogleReviews from '../components/GoogleReviews';
import RichText from '../components/RichText';
import { ClinicBanner, ClinicContainer, FadeIn, useTallSticky } from '../components/clinicPage';

// Real treatment room at the clinic, shown when a treatment has no photo of its own.
const FALLBACK_PHOTO = '/photos/gallery/06.jpg';

const subhead = 'font-poppins text-lg leading-tight font-semibold tracking-normal text-clinic-navy';

function Paragraphs({ items }) {
  return <div className="space-y-4 sm:text-justify">{items.map((p) => <p key={p}>{p}</p>)}</div>;
}

function Bullets({ items }) {
  return <ul className="list-disc space-y-1.5 pl-8 sm:pl-10">{items.map((i) => <li key={i}>{i}</li>)}</ul>;
}

function Note({ children }) {
  return <p className="mt-4 flex gap-3 rounded-[5px] bg-clinic-sky/60 p-4 text-sm"><Info size={18} className="mt-0.5 shrink-0 text-clinic-teal" aria-hidden="true" /> {children}</p>;
}

function Block({ title, children }) {
  return (
    <FadeIn from="slide-left" amount={0.05} innerClassName="" className="mt-8">
      {title && <h3 className={cx(subhead, 'mb-4')}>{title}</h3>}
      {children}
    </FadeIn>
  );
}

function TitledList({ items }) {
  return (
    <ul className="list-disc space-y-2.5 pl-8 sm:pl-10">
      {items.map((t) => <li key={t.t}><strong className="font-medium">{t.t}:</strong> {t.d}</li>)}
    </ul>
  );
}

function Treatment({ s }) {
  return (
    <>
      {s.what && <Block title={s.what.title}><Paragraphs items={s.what.text} /></Block>}
      {s.sections?.map((x) => (
        <Block key={x.title} title={x.title}>
          {x.text && <Paragraphs items={x.text} />}
          {x.list && <Bullets items={x.list} />}
          {x.after && <p className="mt-4 sm:text-justify">{x.after}</p>}
        </Block>
      ))}
      {s.content && <Block><RichText text={s.content} /></Block>}
      {s.signs && <Block title={s.signsTitle}><Bullets items={s.signs} />{s.signsNote && <Note>{s.signsNote}</Note>}</Block>}
      {s.benefits && <Block title={s.benefitsTitle || `Benefits of ${s.title}`}><Bullets items={s.benefits} /></Block>}
      {s.types && <Block title={s.typesTitle}><TitledList items={s.types} /></Block>}
      {s.types2 && <Block title={s.types2Title}><TitledList items={s.types2} /></Block>}
      {s.compare && (
        <Block title={s.compare.title}>
          <div className="overflow-x-auto rounded-[10px] border border-clinic-sky">
            <table className="w-full min-w-[34rem] border-collapse text-left text-[0.95rem]">
              <thead className="bg-clinic-teal text-white">
                <tr>{['Feature', 'Clear Aligners', 'Traditional Braces'].map((h) => <th key={h} scope="col" className="px-5 py-3.5 font-medium">{h}</th>)}</tr>
              </thead>
              <tbody>
                {s.compare.rows.map((r) => (
                  <tr key={r[0]} className="border-t border-clinic-sky even:bg-clinic-bg">
                    {r.map((c, j) => <td key={c} className={cx('px-5 py-3.5', j === 0 && 'font-medium')}>{c}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4">{s.compare.note}</p>
        </Block>
      )}
      {s.who && <Block title={s.whoTitle}><Bullets items={s.who} />{s.whoNote && <Note>{s.whoNote}</Note>}</Block>}
      {s.tips && <Block title={s.tipsTitle}><Bullets items={s.tips} /></Block>}
      {s.process && (
        <Block title={`Our ${s.title} Process`}>
          <ol className="list-decimal space-y-2.5 pl-8 sm:pl-10">
            {s.process.map((p) => <li key={p.t}><strong className="font-medium">{p.t}:</strong> {p.d}</li>)}
          </ol>
        </Block>
      )}
      {s.faqs && <Block title="Frequently Asked Questions"><FAQ items={s.faqs} /></Block>}
    </>
  );
}

function Sidebar({ s, services, clinic }) {
  const [ref, top] = useTallSticky();
  return (
    <aside ref={ref} style={{ top }} className="self-start lg:sticky">
      <FadeIn from="right" amount={0.05}>
        <div className="rounded-[10px] border-[3px] border-clinic-bg p-6 sm:p-8">
          <h2 className="font-poppins text-2xl leading-tight font-semibold tracking-normal text-clinic-navy uppercase">Facilities Available</h2>
          <ul className="mt-5 space-y-2.5">
            {services.map((x) => {
              const current = x.slug === s.slug;
              return (
                <li key={x.slug}>
                  <FadeIn from="down" innerClassName="">
                    <Link
                      to={serviceHref(x)}
                      aria-current={current ? 'page' : undefined}
                      className={cx(
                        'flex items-center justify-between gap-3 rounded-[5px] py-0.5 pl-3 text-[15px] font-medium transition-colors duration-300',
                        current ? 'bg-clinic-teal text-white' : 'bg-clinic-sky text-clinic-navy hover:text-clinic-teal',
                      )}
                    >
                      {x.title}
                      <img src="/photos/clinic/tooth-icon.svg" alt="" width="28" height="28" className="size-7 shrink-0" />
                    </Link>
                  </FadeIn>
                </li>
              );
            })}
          </ul>

          <h2 className="mt-10 font-poppins text-2xl leading-tight font-semibold tracking-normal text-clinic-navy">Book an Appointment</h2>
          <FadeIn from="slide-right" amount={0.05} innerClassName="" className="mt-5">
            <AppointmentForm variant="compact" defaultService={s.slug} />
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

export default function ServiceDetail() {
  const { slug } = useParams();
  const { services, clinic, loaded } = useSite();
  const s = services.find((x) => x.slug === slug);

  useSeo({
    title: s?.seo?.title || `${s?.title || 'Dental Services'} | ${clinic.name}`,
    description: s?.seo?.description || s?.short,
  });

  if (!s) return loaded ? <Navigate to="/services" replace /> : <div className="min-h-[70vh]" />;
  if (!s.detailed) return <Navigate to={`/services#${s.slug}`} replace />;

  const intro = s.intro || [s.short].filter(Boolean);

  return (
    <>
      <ClinicBanner page="service-detail" title={s.title} />

      <section className="bg-white py-12 lg:py-20">
        <ClinicContainer className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-8">
          <div className="min-w-0 font-heebo leading-relaxed text-clinic-navy">
            <FadeIn from="up" innerClassName="">
              <img
                src={s.heroImage || FALLBACK_PHOTO}
                alt={s.heroImage ? s.title : 'Treatment room at the clinic'}
                className="h-64 w-full rounded-[10px] object-cover sm:h-[31.25rem]"
              />
            </FadeIn>
            <FadeIn from="slide-left" amount={0.05} innerClassName="" className="mt-6">
              <h2 className="mb-4 font-poppins text-[1.75rem] leading-tight font-semibold tracking-normal text-clinic-navy sm:text-4xl">{s.title} in BTM Bangalore</h2>
              <Paragraphs items={intro} />
            </FadeIn>
            <Treatment s={s} />
            <Block><Note>Suitability for any treatment is determined after a dental examination.</Note></Block>
          </div>
          <Sidebar s={s} services={services} clinic={clinic} />
        </ClinicContainer>
      </section>

      <section className="relative overflow-hidden bg-clinic-teal py-10 lg:py-20">
        <div aria-hidden="true" className="absolute inset-0 bg-[url(/photos/treatments/dentist-chair.jpg)] bg-cover bg-center opacity-20 lg:bg-fixed" />
        <ClinicContainer className="relative max-w-[900px] text-center">
          <FadeIn from="right">
            <h2 className="font-poppins text-[1.75rem] leading-tight font-semibold tracking-normal text-white uppercase sm:text-4xl lg:text-5xl">Best Multi-Specialty Dental Clinic</h2>
          </FadeIn>
          <FadeIn from="left" className="mt-5">
            <p className="font-heebo leading-relaxed font-medium text-white">
              Srinivasa Dental Care is one of the best multi-specialty dental clinic in Bangalore. Srinivasa Dental assures its patients a holistic personalized dental experience through its trained team of dentists, dental experts, world-class dental equipment and technology and patient-centered treatment plans.
            </p>
          </FadeIn>
        </ClinicContainer>
      </section>

      <GoogleReviews />
    </>
  );
}
