import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';

// Inner pages and the admin panel load on demand, so the home page stays fast.
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Contact = lazy(() => import('./pages/Contact'));
const Gallery = lazy(() => import('./pages/Gallery'));
const DoctorDetail = lazy(() => import('./pages/DoctorDetail'));
const BestDentist = lazy(() => import('./pages/BestDentist'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AdminApp = lazy(() => import('./admin/AdminApp'));

const page = (Cmp) => (
  <Suspense fallback={<div className="min-h-screen" />}>
    <Cmp />
  </Suspense>
);

export default function App() {
  return (
    <Routes>
      <Route path="admin/*" element={page(AdminApp)} />
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="about-us" element={page(About)} />
        <Route path="services" element={page(Services)} />
        <Route path="services/:slug" element={page(ServiceDetail)} />
        <Route path="gallery" element={page(Gallery)} />
        <Route path="doctors/:slug" element={page(DoctorDetail)} />
        <Route path="contact" element={page(Contact)} />
        <Route path="best-dentist-in-btm-layout-bangalore" element={page(BestDentist)} />
        <Route path="*" element={page(NotFound)} />
      </Route>
    </Routes>
  );
}
