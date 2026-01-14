
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link, Outlet, useNavigate } from 'react-router-dom';
import { ThemeProvider } from './lib/theme';
import { I18nProvider } from './lib/i18n';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './app/public/Home';
import { Portfolio } from './app/public/Portfolio';
import { ProjectDetail } from './app/public/ProjectDetail';
import { Gallery } from './app/public/Gallery';
import { LeadForm } from './app/public/LeadForm';
import { About } from './app/public/About';
import { Contact } from './app/public/Contact';
import { Services } from './app/public/Services';
import { Reviews } from './app/public/Reviews';
import { Process } from './app/public/Process';
import { DynamicPage } from './app/public/DynamicPage';
import { Dashboard } from './app/admin/Dashboard';
import { ProjectManager } from './app/admin/ProjectManager';
import { MediaManager } from './app/admin/MediaManager';
import { LeadsManager } from './app/admin/LeadsManager';
import { SettingsManager } from './app/admin/SettingsManager';
import { PageManager } from './app/admin/PageManager';
import { ProjectMediaReorder } from './app/admin/ProjectMediaReorder';
import { Login } from './app/admin/Login';
import { dbService } from './services/db';
import { Settings } from './types';

const PublicLayout: React.FC<{ settings?: Settings }> = ({ settings }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar settings={settings} />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer settings={settings} />
  </div>
);

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('carvello_admin_session');
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-surface-2 flex">
      <aside className="w-64 bg-background border-r border-border p-8 flex flex-col sticky top-0 h-screen shadow-xl z-20">
        <div className="mb-16">
          <span className="font-serif text-2xl tracking-[0.2em] font-bold text-accent">CARVELLO</span>
          <div className="text-[9px] uppercase font-bold tracking-[0.4em] text-muted mt-2">CMS Management</div>
        </div>
        <nav className="flex flex-col space-y-6 flex-grow overflow-y-auto">
          <Link to="/admin" className="text-[10px] uppercase font-bold tracking-widest hover:text-accent">Dashboard</Link>
          <div className="pt-4 border-t border-border/50">
             <Link to="/admin/projects" className="block text-[10px] uppercase font-bold tracking-widest hover:text-accent mb-4">Proiecte</Link>
             <Link to="/admin/media" className="block text-[10px] uppercase font-bold tracking-widest hover:text-accent mb-4">Media</Link>
             <Link to="/admin/pages" className="block text-[10px] uppercase font-bold tracking-widest hover:text-accent mb-4">Pagini</Link>
             <Link to="/admin/leads" className="block text-[10px] uppercase font-bold tracking-widest hover:text-accent mb-4">Leads</Link>
          </div>
          <div className="mt-auto space-y-4">
            <Link to="/admin/settings" className="block text-[10px] uppercase font-bold tracking-widest hover:text-accent">Setări</Link>
            <button onClick={handleLogout} className="text-left text-[9px] uppercase font-bold text-red-500 hover:underline">Logout & Exit</button>
          </div>
        </nav>
      </aside>
      <main className="flex-grow p-4 md:p-8 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

const AdminGuard: React.FC = () => {
  const isAuth = localStorage.getItem('carvello_admin_session') === 'active';
  if (!isAuth) return <Navigate to="/admin/login" replace />;
  return <AdminLayout />;
};

const App: React.FC = () => {
  const [settings, setSettings] = useState<Settings>();

  useEffect(() => {
    dbService.getSettings().then(setSettings);
  }, []);

  return (
    <ThemeProvider>
      <I18nProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/" element={<PublicLayout settings={settings} />}>
              <Route index element={<Home />} />
              <Route path="portofoliu" element={<Portfolio />} />
              <Route path="proiect/:id" element={<ProjectDetail />} />
              <Route path="galerie-mobilier" element={<Gallery />} />
              <Route path="servicii" element={<Services />} />
              <Route path="proces-garantii" element={<Process />} />
              <Route path="recenzii" element={<Reviews />} />
              <Route path="cerere-oferta" element={<LeadForm />} />
              <Route path="despre" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="p/:slug" element={<DynamicPage />} />
            </Route>
            
            <Route path="/admin/login" element={<Login />} />

            <Route path="/admin" element={<AdminGuard />}>
              <Route index element={<Dashboard />} />
              <Route path="projects" element={<ProjectManager />} />
              <Route path="projects/:id/media" element={<ProjectMediaReorder />} />
              <Route path="media" element={<MediaManager />} />
              <Route path="pages" element={<PageManager />} />
              <Route path="leads" element={<LeadsManager />} />
              <Route path="settings" element={<SettingsManager />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </I18nProvider>
    </ThemeProvider>
  );
};

export default App;
