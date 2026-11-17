import { useSearchParams } from 'react-router-dom';
import { Clock, Facebook, Instagram, Mail, MapPin, Navigation, PhoneCall, Star } from 'lucide-react';
import { WhatsAppIcon } from '../components/BrandIcons';
import useSeo from '../hooks/useSeo';
import { useSite, telHref } from '../context/SiteContext';
import AppointmentForm from '../components/AppointmentForm';
import { cx } from '../components/ui';
import { whatsappLink } from '../components/Shared';
import { MapFrame } from '../components/sections';
import { ClinicBanner, ClinicContainer, ClinicLabel, FadeIn } from '../components/clinicPage';

function InfoBox({ from, icon: IconCmp, title, blue, children }) {
  return (
    <FadeIn from={from} className="h-full">
      <div className={cx(
        'group flex h-full flex-col items-center rounded-[10px] p-8 text-center shadow-[0_10px_20px_0_rgb(0_0_0/0.05)] transition-[translate,box-shadow] duration-300 ease-out hover:-translate-y-2 hover:shadow-[0_10px_20px_0_rgb(0_0_0/0.1)]',
        blue ? 'bg-clinic-blue text-white' : 'bg-white text-clinic-navy',
      )}
      >
        <IconCmp size={40} strokeWidth={1.25} aria-hidden="true" className={blue ? 'text-white' : 'text-clinic-teal transition-colors duration-300 group-hover:text-clinic-blue'} />
        <h3 className={cx('mt-3 font-poppins text-2xl leading-tight font-semibold tracking-normal', blue ? 'text-white' : 'text-clinic-navy')}>{title}</h3>
        <div className="mt-4 w-full font-heebo leading-normal">{children}</div>
      </div>
    </FadeIn>
  );
}

export default function Contact() {
  const [params] = useSearchParams();
  const { clinic } = useSite();
  useSeo({
    title: `Contact & Book Appointment | ${clinic.name}, BTM 2nd Stage, Bengaluru`,
    description: `Contact ${clinic.name} at ${clinic.address.full}. Call ${clinic.phones.join(' / ')}, message us on WhatsApp or request an appointment online.`,
    keywords: 'dentist near Mico Layout, dental clinic BTM 2nd Stage contact, book dental appointment BTM',
  });

  const wa = whatsappLink(clinic);
  const socials = [
    { href: clinic.social.facebook, label: 'Facebook', Icon: Facebook },
    { href: clinic.social.instagram, label: 'Instagram', Icon: Instagram },
    { href: wa, label: 'WhatsApp', Icon: WhatsAppIcon },
    { href: clinic.social.google, label: 'Google reviews', Icon: Star },
  ].filter((s) => s.href);

  return (
    <>
      <ClinicBanner page="contact" />

      {/* Contact information */}
      <section className="bg-white pt-16 pb-16 lg:pt-20 lg:pb-20">
        <ClinicContainer className="grid gap-5 lg:grid-cols-[1fr_1.15fr]">
          <FadeIn from="left">
            <div className="flex h-full min-h-[27rem] flex-col bg-[url(/photos/clinic/dentist-consulting.jpg)] bg-contain bg-bottom bg-no-repeat p-8 lg:min-h-[32rem]">
              <ClinicLabel>{clinic.name}</ClinicLabel>
              <h2 className="mt-3 font-poppins text-[2.5rem] leading-[1.15] font-semibold tracking-normal text-clinic-navy lg:text-5xl">Contact<br />Information</h2>
              <span aria-hidden="true" className="mt-5 block h-[3px] w-[50px] bg-clinic-teal" />
            </div>
          </FadeIn>

          <div className="grid gap-5 sm:grid-cols-2">
            <InfoBox from="down" icon={MapPin} title="Location">
              <a href={clinic.mapsLink} target="_blank" rel="noreferrer" className="transition-colors hover:text-clinic-teal">{clinic.address.full}</a>
            </InfoBox>
            <InfoBox from="right" icon={Mail} title="Email Us">
              {clinic.email
                ? <a href={`mailto:${clinic.email}`} className="break-words transition-colors hover:text-clinic-teal">{clinic.email}</a>
                : 'Please call the clinic.'}
            </InfoBox>
            <InfoBox from="left" icon={Clock} title="Office Hour">
              {clinic.hours.length
                ? clinic.hours.map((h) => (
                  <span key={h.days} className="block">
                    {h.days}
                    {h.time.split(',').map((t) => <span key={t} className="block">({t.trim()})</span>)}
                  </span>
                ))
                : 'Please call the clinic to confirm timings.'}
            </InfoBox>
            <InfoBox from="up" icon={PhoneCall} title="Let's Talk" blue>
              <div className="flex flex-col items-center gap-2">
                {clinic.phones.map((p) => (
                  <a key={p} href={telHref(p)} className="rounded bg-white/25 px-5 py-2 text-sm font-medium text-white transition-colors duration-300 hover:bg-white/40">+91 {p}</a>
                ))}
              </div>
            </InfoBox>
          </div>
        </ClinicContainer>
      </section>

      {/* Appointment form over the smile banner */}
      <section className="bg-[url(/photos/clinic/smile-banner.jpg)] bg-cover bg-right">
        <ClinicContainer className="grid items-center gap-8 pt-12 pb-16 lg:grid-cols-[1.1fr_1fr] lg:gap-10 lg:pt-0 lg:pb-20">
          <FadeIn from="left" className="relative z-10 lg:-mt-20" innerClassName="">
            <AppointmentForm variant="clinic" defaultService={params.get('service') || ''} />
          </FadeIn>
          <FadeIn from="right" className="order-first lg:order-none">
            <div className="rounded-lg bg-white/70 p-5 lg:bg-transparent lg:p-0">
              <h2 className="font-poppins text-[2rem] leading-tight font-semibold tracking-normal text-clinic-navy lg:text-5xl">We&apos;re Happy To Help</h2>
              <p className="mt-4 font-poppins text-lg leading-tight font-semibold text-clinic-navy">Send Us An Enquiry</p>
            </div>
          </FadeIn>
        </ClinicContainer>
      </section>

      {/* Social links */}
      {socials.length > 0 && (
        <section className="relative overflow-hidden bg-white py-20 lg:py-24">
          <div aria-hidden="true" className="absolute inset-0 bg-[url(/photos/clinic/rings.png)] bg-contain bg-bottom bg-no-repeat opacity-50" />
          <FadeIn from="up" className="relative mx-auto max-w-[840px] px-5 text-center">
            <ClinicLabel>Get in Connect</ClinicLabel>
            <h2 className="mt-3 font-poppins text-[2rem] leading-tight font-semibold tracking-normal text-clinic-navy lg:text-5xl">Follow our Social Media</h2>
            <div className="mt-6 flex justify-center gap-2">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="grid size-12 place-items-center rounded-md bg-clinic-teal text-white transition-[scale,background-color] duration-300 hover:scale-110 hover:bg-clinic-blue"
                >
                  <Icon size={24} aria-hidden="true" />
                </a>
              ))}
            </div>
          </FadeIn>
        </section>
      )}

      {/* Location */}
      <section className="bg-clinic-bg py-16">
        <ClinicContainer>
          <FadeIn from="up">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <h2 className="font-poppins text-[1.75rem] leading-tight font-semibold tracking-normal text-clinic-teal sm:text-4xl">Location</h2>
              <a href={clinic.mapsLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-clinic-teal px-6 py-3 font-heebo text-sm font-medium text-white transition-colors duration-300 hover:bg-clinic-blue">
                <Navigation size={16} aria-hidden="true" /> Get Directions
              </a>
            </div>
            <MapFrame className="h-[24rem]" />
          </FadeIn>
        </ClinicContainer>
      </section>
    </>
  );
}
