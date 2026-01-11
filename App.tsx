
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
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

const PublicLayout: React.FC<{ children: React.ReactNode; settings?: Settings }> = ({ children, settings }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar settings={settings} />
    <main className="flex-grow">{children}</main>
    <Footer settings={settings} />
  </div>
);

const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuth = sessionStorage.getItem('carvello_auth') === 'true';
  return isAuth ? <>{children}</> : <Navigate to="/admin/login" />;
};

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const handleLogout = () => {
    sessionStorage.removeItem('carvello_auth');
    window.location.hash = '#/admin/login';
  };

  return (
    <div className="min-h-screen bg-surface-2 flex">
      <aside className="w-64 bg-background border-r border-border p-6 flex flex-col sticky top-0 h-screen shadow-xl z-20">
        <div className="mb-12">
          <span className="font-serif text-xl tracking-widest font-bold text-accent">CARVELLO CMS</span>
        </div>
        <nav className="flex flex-col space-y-4">
          <Link to="/admin" className="text-[11px] uppercase font-bold tracking-widest hover:text-accent transition-colors">Dashboard</Link>
          <Link to="/admin/projects" className="text-[11px] uppercase font-bold tracking-widest hover:text-accent transition-colors">Proiecte</Link>
          <Link to="/admin/media" className="text-[11px] uppercase font-bold tracking-widest hover:text-accent transition-colors">Media Global</Link>
          <Link to="/admin/pages" className="text-[11px] uppercase font-bold tracking-widest hover:text-accent transition-colors">Pagini CMS</Link>
          <Link to="/admin/leads" className="text-[11px] uppercase font-bold tracking-widest hover:text-accent transition-colors">Leads Inbox</Link>
          <Link to="/admin/settings" className="text-[11px] uppercase font-bold tracking-widest hover:text-accent transition-colors">Setări</Link>
          
          <div className="pt-12 border-t border-border mt-auto flex flex-col space-y-4">
            <Link to="/" className="text-[10px] uppercase font-bold tracking-widest text-muted hover:text-foreground">← Înapoi pe Site</Link>
            <button onClick={handleLogout} className="text-[10px] text-left uppercase font-bold tracking-widest text-red-500 hover:text-red-600">Logout</button>
          </div>
        </nav>
      </aside>
      <main className="flex-grow overflow-y-auto bg-background/50">
        {children}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const [settings, setSettings] = useState<Settings>();

  useEffect(() => {
    dbService.getSettings().then(setSettings);
  }, []);

  return (
    <ThemeProvider>
      <I18nProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout settings={settings}><Home /></PublicLayout>} />
            <Route path="/portofoliu" element={<PublicLayout settings={settings}><Portfolio /></PublicLayout>} />
            <Route path="/proiect/:id" element={<PublicLayout settings={settings}><ProjectDetail /></PublicLayout>} />
            <Route path="/galerie-mobilier" element={<PublicLayout settings={settings}><Gallery /></PublicLayout>} />
            <Route path="/servicii" element={<PublicLayout settings={settings}><Services /></PublicLayout>} />
            <Route path="/proces-garantii" element={<PublicLayout settings={settings}><Process /></PublicLayout>} />
            <Route path="/recenzii" element={<PublicLayout settings={settings}><Reviews /></PublicLayout>} />
            <Route path="/cerere-oferta" element={<PublicLayout settings={settings}><LeadForm /></PublicLayout>} />
            <Route path="/despre" element={<PublicLayout settings={settings}><About /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout settings={settings}><Contact /></PublicLayout>} />
            <Route path="/p/:slug" element={<PublicLayout settings={settings}><DynamicPage /></PublicLayout>} />
            
            {/* Admin Login */}
            <Route path="/admin/login" element={<Login />} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={<AdminGuard><AdminLayout><Dashboard /></AdminLayout></AdminGuard>} />
            <Route path="/admin/projects" element={<AdminGuard><AdminLayout><ProjectManager /></AdminLayout></AdminGuard>} />
            <Route path="/admin/projects/:id/media" element={<AdminGuard><AdminLayout><ProjectMediaReorder /></AdminLayout></AdminGuard>} />
            <Route path="/admin/media" element={<AdminGuard><AdminLayout><MediaManager /></AdminLayout></AdminGuard>} />
            <Route path="/admin/pages" element={<AdminGuard><AdminLayout><PageManager /></AdminLayout></AdminGuard>} />
            <Route path="/admin/leads" element={<AdminGuard><AdminLayout><LeadsManager /></AdminLayout></AdminGuard>} />
            <Route path="/admin/settings" element={<AdminGuard><AdminLayout><SettingsManager /></AdminLayout></AdminGuard>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </I18nProvider>
    </ThemeProvider>
  );
};

export default App;
