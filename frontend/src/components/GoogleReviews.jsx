import { Star } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { ClinicContainer, ClinicLabel, FadeIn } from './clinicPage';
import { googleReviews, GOOGLE_REVIEWS_URL } from '../data/gallery';

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" className="size-5" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.7 17.7 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 7l7.2 5.6c4.2-3.9 7.1-9.6 7.1-17.1z" />
      <path fill="#FBBC05" d="M10.5 28.7c-.5-1.5-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.5 0 20.1 0 24s.9 7.5 2.6 10.8l7.9-6.1z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.2-5.6c-2.2 1.5-4.9 2.4-8.7 2.4-6.3 0-11.6-4.2-13.5-9.9l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
    </svg>
  );
}

function ReviewCard({ review }) {
  return (
    <figure className="relative mt-9 flex h-full flex-col items-center rounded-md bg-[#F4F4F4] px-5 pt-12 pb-10 text-center">
      <span className="absolute top-4 left-4"><GoogleMark /></span>
      <span
        aria-hidden="true"
        className="absolute -top-9 grid size-[4.5rem] place-items-center rounded-full font-heebo text-2xl font-medium text-white"
        style={{ backgroundColor: review.color }}
      >
        {review.initial}
      </span>
      <figcaption>
        <span className="block font-heebo font-medium text-clinic-navy">{review.name}</span>
        <span className="block font-heebo text-xs text-slate-600">{review.date}</span>
      </figcaption>
      <div className="mt-3 flex gap-0.5" role="img" aria-label={`${review.rating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Star key={n} size={17} strokeWidth={0} fill={n <= review.rating ? '#F6BB06' : '#D1D5DB'} />
        ))}
      </div>
      <blockquote className="mt-3 font-heebo leading-normal text-clinic-navy">{review.text}</blockquote>
    </figure>
  );
}

/** "What They Say" section with the clinic's Google reviews. */
export default function GoogleReviews() {
  const { clinic } = useSite();
  return (
    <section className="bg-clinic-sky/50 pt-14 pb-16">
      <ClinicContainer>
        <FadeIn from="right" className="text-center"><ClinicLabel>What They Say</ClinicLabel></FadeIn>
        <FadeIn from="left" className="mt-3 text-center">
          <h2 className="font-poppins text-[1.75rem] leading-tight font-semibold tracking-normal text-clinic-navy sm:text-4xl">Google Reviews</h2>
        </FadeIn>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {googleReviews.map((r) => <ReviewCard key={r.name} review={r} />)}
        </div>
        <div className="relative -mt-5 text-center">
          <a
            href={clinic.social.google || GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-block rounded-full bg-clinic-teal px-6 py-2.5 font-heebo text-sm font-medium text-white transition-colors duration-300 hover:bg-clinic-blue"
          >
            More reviews
          </a>
        </div>
      </ClinicContainer>
    </section>
  );
}
