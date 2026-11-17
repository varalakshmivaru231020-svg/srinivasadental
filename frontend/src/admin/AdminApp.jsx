import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider, RequireAdmin } from './AdminAuth';
import AdminLayout from './AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import ServicesList from './pages/ServicesList';
import ServiceEdit from './pages/ServiceEdit';
import Settings from './pages/Settings';
import Testimonials from './pages/Testimonials';
import DoctorsList from './pages/DoctorsList';
import DoctorEdit from './pages/DoctorEdit';
import GalleryList from './pages/GalleryList';
import GalleryEdit from './pages/GalleryEdit';
import Banners from './pages/Banners';
import Account from './pages/Account';
import './admin.css';

export default function AdminApp() {
  // Keep the admin panel out of search engines
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    const prevTitle = document.title;
    document.title = 'Admin · Srinivasa Dental Care';
    return () => { meta.remove(); document.title = prevTitle; };
  }, []);

  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
          <Route index element={<Dashboard />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="services" element={<ServicesList />} />
          <Route path="services/new" element={<ServiceEdit />} />
          <Route path="services/:id" element={<ServiceEdit />} />
          <Route path="doctors" element={<DoctorsList />} />
          <Route path="doctors/new" element={<DoctorEdit />} />
          <Route path="doctors/:id" element={<DoctorEdit />} />
          <Route path="gallery" element={<GalleryList />} />
          <Route path="gallery/new" element={<GalleryEdit />} />
          <Route path="gallery/:id" element={<GalleryEdit />} />
          <Route path="banners" element={<Banners />} />
          <Route path="testimonials" element={<Testimonials />} />
          <Route path="settings" element={<Settings />} />
          <Route path="account" element={<Account />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    </AdminAuthProvider>
  );
}
