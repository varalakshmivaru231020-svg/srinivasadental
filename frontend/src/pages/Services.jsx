import { CalendarCheck, Info, Phone, Stethoscope } from 'lucide-react';
import useSeo from '../hooks/useSeo';
import { useBanner, useSite, telHref } from '../context/SiteContext';
import { whenToVisit } from '../data/clinic';
import Icon from '../components/Icon';
import { Reveal, Stagger } from '../components/motion';
import { Button, Container, Highlight, Section, SectionHeading, cx } from '../components/ui';
import { Badge, CheckList, CTASection, PageHero, Rings, ServiceCard } from '../components/Shared';

function ServiceVisual({ s, index }) {
  if (s.image) {
    return (
      <div className="group relative aspect-[5/4] overflow-hidden rounded-[2.25rem] bg-mint shadow-soft">
        <img src={s.image} alt={s.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-premium group-hover:scale-105" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy/45 via-transparent to-transparent" />
        <span className="absolute bottom-5 left-5 flex items-center gap-2.5 rounded-full bg-white/95 py-2 pr-4 pl-2 text-sm font-semibold text-navy shadow-soft backdrop-blur">
          <span className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-teal to-aqua text-white"><Icon name={s.icon} size={16} /></span>
          {s.title}
        </span>
        <span className="absolute top-5 right-5 rounded-full bg-navy/85 px-3 py-1 font-display text-xs font-bold tracking-wider text-white backdrop-blur">{String(index + 1).padStart(2, '0')}</span>
      </div>
    );
  }
  return (
    <div className="group relative grid aspect-[5/4] place-items-center overflow-hidden rounded-[2.25rem] bg-navy">
      <div aria-hidden="true" className="absolute -top-20 -left-20 size-72 rounded-full bg-teal/30 blur-3xl" />
      <Rings className="top-1/2 left-1/2 size-[85%] -translate-x-1/2 -translate-y-1/2 text-aqua/20" />
      <span className="relative grid size-32 place-items-center rounded-[2rem] bg-gradient-to-br from-teal to-aqua text-white shadow-glow transition-transform duration-700 ease-premium group-hover:scale-105 group-hover:-rotate-3">
        <Icon name={s.icon} size={56} />
      </span>
      <span className="absolute top-5 right-5 rounded-full bg-white/10 px-3 py-1 font-display text-xs font-bold tracking-wider text-white">{String(index + 1).padStart(2, '0')}</span>
    </div>
  );
}

export default function Services() {
  const { services, clinic } = useSite();
  const banner = useBanner('services');
  useSeo({
    title: 'Dental Services in BTM Layout, Bangalore | Srinivasa Dental Care',
    description: 'Dental implants, root canal treatment, orthodontics, clear aligners, smile design, teeth whitening, crowns and bridges, dentures, paediatric dentistry and more at Srinivasa Dental Care, BTM 2nd Stage.',
    keywords: 'dental treatments in BTM Layout, dental services Bangalore, dental implants BTM, root canal BTM, braces BTM',
  });

  return (
    <>
      <PageHero
        crumbs={[{ label: 'Services' }]}
        eyebrow="Our Dental Services"
        title={<>Complete Dental Care for <Highlight>Every Smile.</Highlight></>}
        image={banner.image}
        imageAlt={banner.alt}
        imageFit="full"
        badge={<Badge icon={Stethoscope} title={`${services.length} treatments`} text="Under one roof" />}
        actions={(
          <>
            <Button to="/contact#appointment" icon={CalendarCheck} arrow>Book an Appointment</Button>
            <Button href={telHref(clinic.phones[0])} variant="outline" icon={Phone}>{clinic.phones[0]}</Button>
          </>
        )}
      >
        From routine check-ups to advanced restorative and cosmetic procedures, we help you understand your dental
        concerns and explore suitable treatment options — all under one roof.
      </PageHero>

      {/* Overview */}
      <Section className="bg-white">
        <Container>
          <SectionHeading align="center" eyebrow="All Treatments" title={<>Find the <Highlight>Right Treatment</Highlight> for You</>}>
            Choose a treatment to learn more. Suitability is always confirmed after a dental examination.
          </SectionHeading>
          <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => <ServiceCard key={s.slug} service={s} index={i} />)}
          </Stagger>
        </Container>
      </Section>

      {/* Detailed bands */}
      {services.map((s, i) => {
        const flip = i % 2 === 1;
        return (
          <section id={s.slug} key={s.slug} className={cx('py-16 sm:py-20 lg:py-24', flip ? 'bg-white' : 'bg-canvas')}>
            <Container className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
              <Reveal from={flip ? 'right' : 'left'} duration={1.1} className={cx(flip && 'lg:order-2')}>
                <ServiceVisual s={s} index={i} />
              </Reveal>
              <Reveal from={flip ? 'left' : 'right'} delay={0.1}>
                {s.tagline && <p className="font-semibold text-teal">{s.tagline}</p>}
                <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.03em] text-navy sm:text-[2.4rem]">{s.title}</h2>
                <p className="mt-5 text-lg leading-relaxed text-muted">{s.what ? s.what.text[0] : s.short}</p>
                {s.benefits && (
                  <>
                    <h3 className="mt-8 mb-4 text-xs font-bold tracking-[0.18em] text-muted uppercase">Key Benefits</h3>
                    <CheckList items={s.benefits.slice(0, 4)} cols />
                  </>
                )}
                {!s.detailed && (
                  <p className="mt-6 flex gap-2.5 text-sm text-muted"><Info size={17} className="mt-0.5 shrink-0 text-teal" /> Suitability is determined after a dental examination. Contact the clinic to discuss this treatment.</p>
                )}
                <div className="mt-9 flex flex-wrap gap-3">
                  <Button to={`/contact?service=${s.slug}#appointment`} icon={CalendarCheck}>Book Appointment</Button>
                  {s.detailed && <Button to={`/services/${s.slug}`} variant="outline" arrow>Learn More</Button>}
                </div>
              </Reveal>
            </Container>
          </section>
        );
      })}

      {/* When to visit */}
      <Section className={services.length % 2 === 1 ? 'bg-white' : ''}>
        <Container className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
          <SectionHeading eyebrow="Early Care Matters" title={<>When Should You <Highlight>Visit a Dentist?</Highlight></>}>
            Do not ignore dental problems until they become painful. Regular dental check-ups can help identify problems early. Consider a consultation if you experience:
          </SectionHeading>
          <Reveal from="right" className="rounded-[2rem] bg-white p-8 shadow-soft ring-1 ring-line/60 sm:p-10">
            <CheckList items={whenToVisit} />
          </Reveal>
        </Container>
      </Section>

      <CTASection above={services.length % 2 === 1 ? 'white' : 'canvas'} />
    </>
  );
}
