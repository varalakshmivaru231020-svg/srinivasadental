import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { fetchSite } from '../services/api';
import { clinic as defaults, team as localTeam } from '../data/clinic';
import { services as localServices } from '../data/services';
import { servicePhotos, treatmentPhotos } from '../data/servicePhotos';
import { galleryPhotos } from '../data/gallery';
import { BANNERS } from '../data/banners';

const SiteContext = createContext(null);

/** Builds a `tel:` link from a 10-digit mobile or an STD landline such as "080 41201345". */
export function telHref(number = '') {
  const d = String(number).replace(/\D/g, '');
  if (d.length === 10 && !d.startsWith('0')) return `tel:+91${d}`;
  if (d.startsWith('0')) return `tel:+91${d.slice(1)}`;
  if (d.startsWith('91') && d.length === 12) return `tel:+${d}`;
  return `tel:${d}`;
}

/** Maps the clinic_settings row from the API onto the shape the components use. */
export function buildClinic(s) {
  if (!s) return defaults;
  const line1 = s.address_line1 || defaults.address.line1;
  const line2 = s.address_line2 || '';
  const city = s.city || defaults.address.city;
  const pin = s.pincode || '';
  const phones = [s.phone_primary, s.phone_secondary].filter(Boolean);
  return {
    ...defaults,
    name: s.clinic_name || defaults.name,
    tagline: s.tagline || defaults.tagline,
    address: {
      line1, line2, city, pin,
      full: [line1, line2, [city, pin].filter(Boolean).join(' – ')].filter(Boolean).join(', '),
    },
    area: [line2, city].filter(Boolean).join(', '),
    phones: phones.length ? phones : defaults.phones,
    landline: s.landline || '',
    email: s.email || '',
    hours: Array.isArray(s.opening_hours) ? s.opening_hours : [],
    whatsapp: s.whatsapp_number || '',
    mapsLink: s.google_maps_url || defaults.mapsLink,
    mapsEmbed: s.google_maps_embed_url || defaults.mapsEmbed,
    social: {
      facebook: s.facebook_url || '',
      instagram: s.instagram_url || '',
      google: s.google_reviews_url || '',
    },
    logo: s.logo_url || defaults.logo,
    logoBanner: s.logo_banner_url || defaults.logoBanner,
  };
}

const localBySlug = Object.fromEntries(localServices.map((s) => [s.slug, s]));

/**
 * The database decides which services exist, their order, names, descriptions and images.
 * Built-in services also keep their full treatment-page content from data/services.js.
 */
export function mergeServices(rows) {
  if (!Array.isArray(rows)) {
    return localServices.map((s, i) => ({
      ...s,
      rich: Boolean(s.detailed),
      showOnHome: i < 8,
      image: servicePhotos[s.slug] || null,
      heroImage: treatmentPhotos[s.slug] || servicePhotos[s.slug] || null,
      content: '',
    }));
  }
  return rows.map((r) => {
    const local = localBySlug[r.slug] || {};
    const content = (r.content || '').trim();
    return {
      ...local,
      id: r.id,
      slug: r.slug,
      title: r.service_name,
      short: r.description || local.short || '',
      tagline: r.tagline || local.tagline || '',
      icon: r.icon || local.icon || 'Smile',
      image: r.image || servicePhotos[r.slug] || null,
      heroImage: r.image || treatmentPhotos[r.slug] || servicePhotos[r.slug] || null,
      content,
      showOnHome: Boolean(r.show_on_home),
      rich: Boolean(local.detailed),
      detailed: Boolean(local.detailed) || Boolean(content),
      seo: {
        title: r.meta_title || local.seo?.title,
        description: r.meta_description || local.seo?.description || r.description,
      },
    };
  });
}

const paragraphs = (text) => String(text || '').replace(/\r\n/g, '\n').split(/\n\s*\n/)
  .map((p) => p.replace(/\s*\n\s*/g, ' ').trim()).filter(Boolean);

/** The dental team: from the database (admin panel → Doctors), or the built-in list if it can't be reached. */
export function buildTeam(rows) {
  return (Array.isArray(rows) ? rows : localTeam).map((r) => {
    const bio = paragraphs(r.bio);
    const profile = String(r.profile || '').trim();
    return {
      id: r.id ?? r.slug,
      slug: r.slug,
      name: r.name,
      title: r.title || '',
      qualification: r.qualification || '',
      experience: r.experience || '',
      headline: r.headline || '',
      photo: r.photo || null,
      bio,
      profile,
      hasProfile: bio.length > 0 || profile.length > 0,
    };
  });
}

/**
 * Gallery photos: from the database (admin panel → Gallery), or the built-in list if it can't be reached.
 * An empty list from the database stays empty: photos the clinic hid or deleted are not replaced by the built-in ones.
 */
export function buildGallery(rows) {
  if (!Array.isArray(rows)) return galleryPhotos;
  return rows.map((r) => ({
    id: r.id,
    full: r.image,
    thumb: r.thumb || r.image,
    alt: r.alt,
    caption: r.caption || '',
    category: r.category,
  }));
}

/**
 * The banner at the top of each page: the photo (and, for some pages, the title) the clinic set in the
 * admin panel → Banners, or the built-in one from data/banners.js. `rows` is { page_key: { image, title } }.
 * A changed photo gets a general description (alt text), since the built-in one describes the built-in photo.
 */
export function buildBanners(rows, clinicName) {
  const custom = rows && typeof rows === 'object' ? rows : {};
  return Object.fromEntries(BANNERS.map((b) => {
    const row = custom[b.key] || {};
    const isCustom = Boolean(row.image);
    return [b.key, {
      image: row.image || b.image,
      alt: isCustom ? `${clinicName}, BTM 2nd Stage, Bengaluru` : b.alt,
      title: (b.hasTitle && row.title) || b.title || '',
      isCustom,
    }];
  }));
}

export function SiteProvider({ children }) {
  const [state, setState] = useState({ settings: null, services: null, testimonials: [], doctors: null, gallery: null, banners: null, loaded: false });

  const load = useCallback(() => fetchSite()
    .then((res) => setState({
      settings: res.data.settings,
      services: res.data.services,
      testimonials: res.data.testimonials || [],
      doctors: res.data.doctors ?? null,
      gallery: res.data.gallery ?? null,
      banners: res.data.banners ?? null,
      loaded: true,
    }))
    .catch(() => setState((s) => ({ ...s, loaded: true }))), []);

  useEffect(() => { load(); }, [load]);

  const value = useMemo(() => {
    const clinic = buildClinic(state.settings);
    return {
      clinic,
      services: mergeServices(state.services),
      testimonials: state.testimonials,
      team: buildTeam(state.doctors),
      gallery: buildGallery(state.gallery),
      banners: buildBanners(state.banners, clinic.name),
      loaded: state.loaded,
      reload: load,
    };
  }, [state, load]);

  // Keep the browser-tab icon in sync with the uploaded logo
  useEffect(() => {
    const link = document.querySelector("link[rel~='icon']");
    if (link && value.clinic.logo) link.href = value.clinic.logo;
  }, [value.clinic.logo]);

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export const useSite = () => useContext(SiteContext);

/** The banner for one page (a key from data/banners.js): { image, alt, title, isCustom }. `isCustom` means the clinic changed the photo. */
export const useBanner = (key) => useContext(SiteContext).banners[key];
