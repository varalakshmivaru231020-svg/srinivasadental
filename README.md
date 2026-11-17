# Srinivasa Dental Care — Website

Premium website for **Srinivasa Dental Care**, BTM 2nd Stage, Bengaluru (est. 1999), with an admin panel for the clinic.

- **Frontend:** React 18 + Vite, Tailwind CSS v4, Framer Motion (scroll animations, carousel), Lenis (smooth scrolling), React Router, Axios, Lucide icons
- **Backend:** Node.js + Express (helmet, cors, express-validator, rate limiting, multer)
- **Database:** MySQL / MariaDB (XAMPP)

## Quick start (this computer)

Double-click **`START-WEBSITE.bat`**. It starts XAMPP MySQL (if needed) and the website server, then opens the site.

| What | Address |
|---|---|
| Website | http://localhost:5000 |
| Admin panel | http://localhost:5000/admin |

`STOP-WEBSITE.bat` stops the website server (MySQL is left running for other XAMPP projects).
Server logs: `backend/logs/server.log` and `backend/logs/server-error.log`.

## Admin panel (`/admin`)

| Section | What the clinic can do |
|---|---|
| Dashboard | New / upcoming / today's appointment counts, latest requests, checklist of missing clinic details |
| Appointments | View requests from the website form, search, filter by status, mark Pending → Confirmed → Completed / Cancelled, call or WhatsApp the patient, delete |
| Services | Add, edit, hide/show, reorder, feature on home page, delete. Upload a photo or pick an icon. Add page content for new services |
| Gallery | Add, edit, hide/show, reorder and delete the Gallery page photos: description (alt text), optional caption such as Before / After, category (Smile Results or Our Clinic). Photos are resized in the browser before upload (JPEG, 1600 px + 800 px thumbnail), which also removes EXIF/GPS data |
| Testimonials | Add genuine patient reviews (name, review, rating, treatment, source) shown in the home-page carousel. Until one exists, the carousel shows clearly labelled sample cards |
| Clinic Settings | Clinic name, tagline, address, mobile numbers, landline, WhatsApp, email, working hours, header logo, footer banner logo, Google Maps link + embedded map, Google reviews / Facebook / Instagram links |
| Change Password | Change the admin password (signs out other devices) |

Changes appear on the website immediately. Empty optional details (email, hours, social links) are hidden on the
public site rather than showing placeholder text; the dashboard lists what is still missing.

**Reset / create an admin login** (e.g. forgotten password):
```bash
cd backend
npm run admin:set -- admin "NewStrongPassword"
```

### Security
- Passwords hashed with scrypt; login sessions stored hashed in `admin_sessions`, 12-hour expiry.
- Session cookie is `HttpOnly` + `SameSite=Strict` (+ `Secure` behind HTTPS); state-changing admin requests also need
  an `X-Requested-With` header (CSRF defence). Login is rate-limited (10 attempts / 15 min / IP).
- Uploads: PNG / JPG / WEBP only, max 3 MB, type verified from the file bytes, random file names (`backend/uploads/`).
- All input validated server-side; admin text is rendered as text (never as HTML).

## Design system

- Palette (Tailwind tokens in `frontend/src/styles/global.css`): canvas `#F8F9F6`, teal `#159C95`, navy `#142D38`,
  muted text `#71818A`, mint `#DDF3EF`. Fonts: Manrope (headings) + Inter (body).
- Building blocks: `components/ui.jsx` (Button, SectionHeading, Container), `components/motion.jsx` (Reveal, Stagger,
  ParallaxImage, CountUp), `components/sections.jsx` (trust bar, why-choose-us, technology, contact), `Testimonials.jsx`.
- Motion: Lenis smooth scrolling (desktop wheel only; touch keeps native scrolling), scroll-triggered reveals, parallax on
  selected images (desktop only). Everything respects the visitor's "reduce motion" setting.
- The previous (blue/orange) design is saved in `backups/classic-design-2026-11-10/`.

### Photos
`frontend/public/photos/` holds **temporary stand-in photos** (free Pexels licence) — see `photos/README.txt`.
Replace each with the clinic's real photo using the same file name, then run `npm run build` in `frontend/`.
Doctor profile photos stay as placeholders until real, verified details are supplied.

## Content

Static page copy comes from the clinic's content PDFs:
- `frontend/src/data/clinic.js` — stats, why-choose-us, technology, FAQs, team placeholders, and *fallback* contact details
- `frontend/src/data/services.js` — full treatment-page content for the 9 detailed services

Services list, names, descriptions, images and all contact details come from the database (admin panel).

## ⚠ Before going live — items to confirm

1. **Doctor profiles** (12 placeholder slots) — names, qualifications, specialities, experience, photos (`clinic.js → team`).
2. **Email, working hours, WhatsApp number, Google reviews / social links** — fill in via Admin → Clinic Settings.
3. **Clinic photography** — upload service photos in Admin → Services; hero/about images use `<ImageSlot src="...">`.
4. Confirm every listed treatment is offered (the PDFs flag Invisalign, laser, paediatric, flexible/immediate dentures, digital smile preview).
5. Replace the domain in `frontend/public/sitemap.xml` and `robots.txt`.
6. Change the admin password from the one supplied at handover.

## Developer setup

### Database
```bash
cd backend
npm run migrate          # creates the DB if missing and applies pending migrations
npm run migrate:status   # shows applied / pending migrations
```
Migrations live in `database/migrations/NNN_name.sql`, run in filename order, and are recorded in the `migrations`
table. To change the schema, add a new numbered file — never edit one that has already been applied.

### Run in development (hot reload)
```bash
cd backend && npm install && npm run dev      # API on :5000
cd frontend && npm install && npm run dev     # http://localhost:5173 (proxies /api and /uploads → :5000)
```
After frontend changes, run `npm run build` in `frontend/` so the server on :5000 serves the new build.

### XAMPP MySQL note (this machine)
`C:\xampp\mysql\bin\my.ini` has `innodb_use_native_aio=0` and `innodb_flush_method=normal` under `[mysqld]`.
Windows asynchronous I/O was returning 0-byte reads/writes on this Windows build and crashing MariaDB 10.4; keep these
lines. The original file is backed up as `my.ini.bak-20261110`.

## API

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/site` | Clinic settings + active services (used by the website) |
| POST | `/api/appointments` | Submit appointment request (validated, rate-limited 8/hour/IP) |
| GET | `/api/services` | Active services |
| GET | `/api/contact` | Clinic settings |
| GET | `/api/health` | API + DB health |
| * | `/api/admin/*` | Admin API (login, dashboard, appointments, services, settings, upload, password) |

## Deployment

**Single Node server:** `cd frontend && npm run build`, then `cd ../backend && NODE_ENV=production npm start`.
Express serves `frontend/dist`, `/uploads` and the API on one port. Run behind Nginx with HTTPS and PM2
(`pm2 start server.js --name sdc`). Back up the database and `backend/uploads/` regularly.

## Project structure
```
frontend/  src/{admin,components,context,pages,layouts,data,services,hooks,styles}
backend/   config, controllers, routes, services, middleware, models, validators, utils, scripts, uploads, server.js
database/  migrations/
scripts/   start-website.ps1, stop-website.ps1
```
