
import React, { useEffect, useState, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './lib/theme';
import { I18nProvider } from './lib/i18n';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { dbService } from './services/db';
import { Settings } from './types';

// Public
const Home = React.lazy(() => import('./app/public/Home').then(m => ({ default: m.Home })));
const Portfolio = React.lazy(() => import('./app/public/Portfolio').then(m => ({ default: m.Portfolio })));
const ProjectDetail = React.lazy(() => import('./app/public/ProjectDetail').then(m => ({ default: m.ProjectDetail })));
const Gallery = React.lazy(() => import('./app/public/Gallery').then(m => ({ default: m.Gallery })));
const LeadForm = React.lazy(() => import('./app/public/LeadForm').then(m => ({ default: m.LeadForm })));
const About = React.lazy(() => import('./app/public/About').then(m => ({ default: m.About })));
const Contact = React.lazy(() => import('./app/public/Contact').then(m => ({ default: m.Contact })));
const Services = React.lazy(() => import('./app/public/Services').then(m => ({ default: m.Services })));
const ServiceDetail = React.lazy(() => import('./app/public/ServiceDetail').then(m => ({ default: m.ServiceDetail }))); 
const Reviews = React.lazy(() => import('./app/public/Reviews').then(m => ({ default: m.Reviews })));
const Process = React.lazy(() => import('./app/public/Process').then(m => ({ default: m.Process })));
const Maintenance = React.lazy(() => import('./app/public/Maintenance').then(m => ({ default: m.Maintenance })));

// Admin
const Login = React.lazy(() => import('./app/admin/Login').then(m => ({ default: m.Login })));
const Dashboard = React.lazy(() => import('./app/admin/Dashboard').then(m => ({ default: m.Dashboard })));
const ProjectManager = React.lazy(() => import('./app/admin/ProjectManager').then(m => ({ default: m.ProjectManager })));
const MediaManager = React.lazy(() => import('./app/admin/MediaManager').then(m => ({ default: m.MediaManager })));
const LeadsManager = React.lazy(() => import('./app/admin/LeadsManager').then(m => ({ default: m.LeadsManager })));
const SettingsManager = React.lazy(() => import('./app/admin/SettingsManager').then(m => ({ default: m.SettingsManager })));
const ServiceManager = React.lazy(() => import('./app/admin/ServiceManager').then(m => ({ default: m.ServiceManager })));
const ProcessManager = React.lazy(() => import('./app/admin/ProcessManager').then(m => ({ default: m.ProcessManager })));
const HeroManager = React.lazy(() => import('./app/admin/HeroManager').then(m => ({ default: m.HeroManager })));

const LoadingFallback = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B0D10] text-white">
    <div className="w-8 h-8 border-2 border-[#C9A24A]/30 border-t-[#C9A24A] rounded-full animate-spin mb-4"></div>
    <div className="font-serif text-xs tracking-widest uppercase text-white/50">Carvello Loading</div>
  </div>
);

const PublicLayout: React.FC<{ settings?: Settings }> = ({ settings }) => {
  const location = useLocation();
  if (settings?.maintenanceMode && location.pathname !== '/maintenance' && !location.pathname.startsWith('/admin')) {
    return <Navigate to="/maintenance" replace />;
  }
  if (!settings?.maintenanceMode && location.pathname === '/maintenance') {
    return <Navigate to="/" replace />;
  }
  if (settings?.maintenanceMode && location.pathname === '/maintenance') {
    return <Suspense fallback={<LoadingFallback />}><Outlet /></Suspense>;
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar settings={settings} />
      <main className="flex-grow pt-24">
        <Suspense fallback={<LoadingFallback />}><Outlet /></Suspense>
      </main>
      <Footer settings={settings} />
    </div>
  );
};

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-surface-2 flex">
      <aside className="w-64 bg-background border-r border-border p-8 flex flex-col sticky top-0 h-screen shadow-xl z-20">
        <div className="mb-12"><span className="font-serif text-2xl tracking-widest font-bold text-accent">CARVELLO</span></div>
        <nav className="flex flex-col space-y-6 flex-grow overflow-y-auto">
          <Link to="/admin" className="text-[10px] uppercase font-bold tracking-widest">Dashboard</Link>
          <div className="pt-4 border-t border-border/50">
             <Link to="/admin/projects" className="block text-[10px] uppercase font-bold tracking-widest mb-4">Proiecte</Link>
             <Link to="/admin/services" className="block text-[10px] uppercase font-bold tracking-widest mb-4">Servicii</Link>
             <Link to="/admin/process" className="block text-[10px] uppercase font-bold tracking-widest mb-4">Proces</Link>
             <Link to="/admin/media" className="block text-[10px] uppercase font-bold tracking-widest mb-4">Media / Fișiere</Link>
             <Link to="/admin/leads" className="block text-[10px] uppercase font-bold tracking-widest mb-4 text-accent">Cereri / Leads</Link>
          </div>
          <div className="mt-auto pt-4 border-t border-border/50">
            <Link to="/admin/hero" className="block text-[10px] uppercase font-bold tracking-widest mb-4">Hero / Homepage</Link>
            <Link to="/admin/settings" className="block text-[10px] uppercase font-bold tracking-widest mb-4">Setări</Link>
            <button onClick={async () => { await dbService.logout(); navigate('/'); }} className="text-left text-[9px] uppercase font-bold text-red-500">Ieșire</button>
          </div>
        </nav>
      </aside>
      <main className="flex-grow p-8"><Suspense fallback={<LoadingFallback />}><Outlet /></Suspense></main>
    </div>
  );
};

const AdminGuard: React.FC = () => {
  const [auth, setAuth] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    dbService.checkAuth().then(isAuthenticated => {
      setAuth(isAuthenticated);
      if (!isAuthenticated) {
        navigate('/admin/login', { replace: true });
      }
    });
  }, [navigate]);

  if (auth === null) return <LoadingFallback />;
  if (auth === false) return null;

  return <AdminLayout />;
};

const App: React.FC = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  useEffect(() => {
    // Check if running in preview mode (PHP not executing)
    fetch('/api/auth.php?action=session')
      .then(res => res.text())
      .then(text => {
        if (text.trim().startsWith('<?php')) {
          setIsPreviewMode(true);
          console.warn("Running in Preview Mode: PHP backend is simulated.");
        }
      })
      .catch(() => {});

    // Failsafe timeout in case dbService hangs
    const timeoutId = setTimeout(() => {
        setError("Connection timed out. Please check your network or server configuration.");
    }, 5000);

    dbService.getSettings()
      .then(s => {
        clearTimeout(timeoutId);
        if (s) setSettings(s);
        else setError("Failed to load settings");
      })
      .catch(err => {
        clearTimeout(timeoutId);
        console.error("App init error:", err);
        setError("Application initialization failed. Please try refreshing.");
      }); 
      
    return () => clearTimeout(timeoutId);
  }, []);

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      <div className="text-center max-w-md">
        <h1 className="text-xl font-bold mb-4 text-red-500">System Error</h1>
        <p className="mb-6 text-gray-400">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-2 bg-white/10 rounded hover:bg-white/20 transition-colors uppercase text-xs tracking-widest font-bold"
        >
          Reload Application
        </button>
      </div>
    </div>
  );

  if (!settings) return <LoadingFallback />;

  return (
    <ThemeProvider>
      <I18nProvider>
        {isPreviewMode && (
          <div className="fixed top-0 left-0 w-full bg-yellow-500 text-black text-[10px] font-bold uppercase tracking-widest text-center py-1 z-50">
            Preview Mode — PHP Backend Simulated (Deploy to cPanel for full functionality)
          </div>
        )}
        <Router>
          <Routes>
            <Route path="/" element={<PublicLayout settings={settings} />}>
              <Route index element={<Home />} />
              <Route path="portofoliu" element={<Portfolio />} />
              <Route path="proiect/:id" element={<ProjectDetail />} />
              <Route path="galerie-mobilier" element={<Gallery />} />
              <Route path="servicii" element={<Services />} />
              <Route path="servicii/:slug" element={<ServiceDetail />} />
              <Route path="proces-garantii" element={<Process />} />
              <Route path="recenzii" element={<Reviews />} />
              <Route path="cerere-oferta" element={<LeadForm />} />
              <Route path="despre" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="maintenance" element={<Maintenance />} />
            </Route>
            <Route path="/admin/login" element={<Suspense fallback={<LoadingFallback />}><Login /></Suspense>} />
            <Route path="/admin" element={<AdminGuard />}>
              <Route index element={<Dashboard />} />
              <Route path="projects" element={<ProjectManager />} />
              <Route path="services" element={<ServiceManager />} />
              <Route path="process" element={<ProcessManager />} />
              <Route path="media" element={<MediaManager />} />
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
