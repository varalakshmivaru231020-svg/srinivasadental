import useSeo from '../hooks/useSeo';
import { Reveal } from '../components/motion';
import { Button, Container, Eyebrow } from '../components/ui';
import { Glow } from '../components/Shared';

export default function NotFound() {
  useSeo({ title: 'Page Not Found | Srinivasa Dental Care' });
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden pt-32 pb-20">
      <Glow className="-top-40 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2" />
      <Container className="relative text-center">
        <Reveal>
          <Eyebrow className="justify-center">Error 404</Eyebrow>
          <h1 className="mt-5 font-display text-4xl font-extrabold tracking-[-0.035em] sm:text-6xl">We couldn&apos;t find that page.</h1>
          <p className="mx-auto mt-5 max-w-lg text-lg text-muted">The page may have moved. Let&apos;s get you back to a healthy smile.</p>
          <div className="mt-9 flex justify-center gap-3">
            <Button to="/" arrow>Back to Home</Button>
            <Button to="/services" variant="outline">Our Services</Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
