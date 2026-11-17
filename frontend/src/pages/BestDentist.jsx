import { CalendarCheck, MapPin, Phone } from 'lucide-react';
import useSeo from '../hooks/useSeo';
import { whenToVisit, generalFaqs } from '../data/clinic';
import { useBanner, useSite, telHref } from '../context/SiteContext';
import { Reveal, Stagger } from '../components/motion';
import { Button, Container, Section, SectionHeading } from '../components/ui';
import { CheckList, CTASection, FAQ, PageHero, ServiceCard } from '../components/Shared';
import { TrustBar, WhyChooseSection } from '../components/sections';

// SEO landing page: /best-dentist-in-btm-layout-bangalore
export default function BestDentist() {
  const { clinic, services } = useSite();
  const banner = useBanner('best-dentist');
  useSeo({
    title: 'Best Dentist in BTM Layout, Bangalore | Srinivasa Dental Care',
    description: 'Searching for the best dentist in BTM Layout, Bangalore? Visit Srinivasa Dental Care, established in 1999, for comprehensive dental treatments and personalised dental care.',
    keywords: 'Best dentist in BTM Layout Bangalore, dental clinic in BTM 2nd Stage, dentist near Mico Layout, dental hospital in BTM Layout, experienced dentist in BTM, dental treatments in BTM Layout, dentist near me BTM Bangalore',
  });

  return (
    <>
      <PageHero
        crumbs={[{ label: 'Dentist in BTM Layout' }]}
        eyebrow="Dentist in BTM Layout, Bangalore"
        title="Looking for a Trusted Dentist Near You?"
        image={banner.image || undefined}
        imageAlt={banner.alt}
        imageFit="full"
        actions={(
          <>
            <Button to="/contact#appointment" icon={CalendarCheck} arrow>Book Your Dental Consultation</Button>
            <Button href={telHref(clinic.phones[0])} variant="outline" icon={Phone}>{clinic.phones[0]}</Button>
          </>
        )}
      >
        Your smile deserves the right care. Srinivasa Dental Care is an established dental care centre in BTM 2nd
        Stage, serving patients since 1999 — with over 25 years of experience and more than 1,00,000 patients treated.
      </PageHero>

      <TrustBar className="pb-4" />

      <WhyChooseSection above="canvas" title="Why Choose Srinivasa Dental Care in BTM Layout?" />

      <Section>
        <Container>
          <SectionHeading align="center" eyebrow="Treatments" title="Dental Treatments Available at Srinivasa Dental Care" />
          <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => <ServiceCard key={s.slug} service={s} index={i} />)}
          </Stagger>
        </Container>
      </Section>

      <Section className="bg-white">
        <Container className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
          <SectionHeading eyebrow="Early Care Matters" title="When Should You Visit a Dentist?">
            Do not ignore dental problems until they become painful. Regular dental check-ups can help identify problems early.
          </SectionHeading>
          <Reveal from="right" className="rounded-[2rem] bg-canvas p-8 ring-1 ring-line/60 sm:p-10"><CheckList items={whenToVisit} /></Reveal>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading align="center" eyebrow="FAQs" title="Frequently Asked Questions" className="mb-12" />
          <Reveal><FAQ items={generalFaqs} /></Reveal>
          <Reveal className="mt-10 flex items-center justify-center gap-2 text-center text-muted">
            <MapPin size={17} className="shrink-0 text-teal" /> {clinic.address.full}
          </Reveal>
        </Container>
      </Section>

      <CTASection title="Book Your Appointment Today" text="Take the first step towards healthier teeth and a confident smile." />
    </>
  );
}
