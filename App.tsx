import React, { useEffect, useState, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link, Outlet, useNavigate } from 'react-router-dom';
import { ThemeProvider } from './lib/theme';
import { I18nProvider } from './lib/i18n';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { dbService } from './services/db';
import { Settings } from './types';

// Lazy load Public pages
const Home = React.lazy(() => import('./app/public/Home').then(m => ({ default: m.Home })));
const Portfolio = React.lazy(() => import('./app/public/Portfolio').then(m => ({ default: m.Portfolio })));
const ProjectDetail = React.lazy(() => import('./app/public/ProjectDetail').then(m => ({ default: m.ProjectDetail })));
const Gallery = React.lazy(() => import('./app/public/Gallery').then(m => ({ default: m.Gallery })));
const LeadForm = React.lazy(() => import('./app/public/LeadForm').then(m => ({ default: m.LeadForm })));
const About = React.lazy(() => import('./app/public/About').then(m => ({ default: m.About })));
const Contact = React.lazy(() => import('./app/public/Contact').then(m => ({ default: m.Contact })));
const Services = React.lazy(() => import('./app/public/Services').then(m => ({ default: m.Services })));
const Reviews = React.lazy(() => import('./app/public/Reviews').then(m => ({ default: m.Reviews })));
const Process = React.lazy(() => import('./app/public/Process').then(m => ({ default: m.Process })));
const DynamicPage = React.lazy(() => import('./app/public/DynamicPage').then(m => ({ default: m.DynamicPage })));

// Lazy load Admin pages
const Login = React.lazy(() => import('./app/admin/Login').then(m => ({ default: m.Login })));
const Dashboard = React.lazy(() => import('./app/admin/Dashboard').then(m => ({ default: m.Dashboard })));
const ProjectManager = React.lazy(() => import('./app/admin/ProjectManager').then(m => ({ default: m.ProjectManager })));
const MediaManager = React.lazy(() => import('./app/admin/MediaManager').then(m => ({ default: m.MediaManager })));
const LeadsManager = React.lazy(() => import('./app/admin/LeadsManager').then(m => ({ default: m.LeadsManager })));
const SettingsManager = React.lazy(() => import('./app/admin/SettingsManager').then(m => ({ default: m.SettingsManager })));
const PageManager = React.lazy(() => import('./app/admin/PageManager').then(m => ({ default: m.PageManager })));
const ProjectMediaReorder = React.lazy(() => import('./app/admin/ProjectMediaReorder').then(m => ({ default: m.ProjectMediaReorder })));
const HeroManager = React.lazy(() => import('./app/admin/HeroManager').then(m => ({ default: m.HeroManager })));

// Loading Component
const LoadingFallback = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin"></div>
  </div>
);

const PublicLayout: React.FC<{ settings?: Settings }> = ({ settings }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar settings={settings} />
    <main className="flex-grow">
      <Suspense fallback={<LoadingFallback />}>
        <Outlet />
      </Suspense>
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
            <Link to="/admin/hero" className="block text-[10px] uppercase font-bold tracking-widest hover:text-accent text-accent">Hero Manager</Link>
            <Link to="/admin/settings" className="block text-[10px] uppercase font-bold tracking-widest hover:text-accent">Setări</Link>
            <button onClick={handleLogout} className="text-left text-[9px] uppercase font-bold text-red-500 hover:underline">Logout & Exit</button>
          </div>
        </nav>
      </aside>
      <main className="flex-grow p-4 md:p-8 overflow-x-hidden">
        <Suspense fallback={<LoadingFallback />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
};

const AdminGuard: React.FC = () => {
  const sessionStr = localStorage.getItem('carvello_admin_session');
  
  if (!sessionStr) {
    return <Navigate to="/admin/login" replace />;
  }

  try {
    const session = JSON.parse(sessionStr);
    const now = Date.now();
    const isValid = session.active && (now - session.createdAt < 12 * 60 * 60 * 1000); // 12 hours

    if (!isValid) {
      localStorage.removeItem('carvello_admin_session');
      return <Navigate to="/admin/login" replace />;
    }
  } catch (e) {
    localStorage.removeItem('carvello_admin_session');
    return <Navigate to="/admin/login" replace />;
  }

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
            
            <Route path="/admin/login" element={
              <Suspense fallback={<LoadingFallback />}>
                <Login />
              </Suspense>
            } />

            <Route path="/admin" element={<AdminGuard />}>
              <Route index element={<Dashboard />} />
              <Route path="projects" element={<ProjectManager />} />
              <Route path="projects/:id/media" element={<ProjectMediaReorder />} />
              <Route path="media" element={<MediaManager />} />
              <Route path="pages" element={<PageManager />} />
              <Route path="leads" element={<LeadsManager />} />
              <Route path="settings" element={<SettingsManager />} />
              <Route path="hero" element={<HeroManager />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </I18nProvider>
    </ThemeProvider>
  );
};

export default App;
