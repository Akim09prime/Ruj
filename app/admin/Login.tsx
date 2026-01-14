
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dbService } from '../../services/db';

export const Login: React.FC = () => {
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  // Dacă utilizatorul este deja logat, îl trimitem direct la dashboard
  useEffect(() => {
    const isAuth = localStorage.getItem('carvello_admin_session') === 'active';
    if (isAuth) {
      navigate('/admin', { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const settings = await dbService.getSettings();
    
    if (pass === settings.adminPassword) {
      localStorage.setItem('carvello_admin_session', 'active');
      setError(false);
      // Folosim navigate din react-router pentru a rămâne în contextul HashRouter
      navigate('/admin');
    } else {
      setError(true);
      setPass('');
    }
  };

  const handleGoBack = () => {
    localStorage.removeItem('carvello_admin_session');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative">
      <button 
        onClick={handleGoBack}
        className="absolute top-10 left-10 text-[10px] uppercase tracking-widest font-bold text-accent border border-accent/20 px-4 py-2 hover:bg-accent hover:text-white transition-all"
      >
        ← Înapoi la Site-ul Public
      </button>

      <div className="absolute top-10 right-10 text-right">
         <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-bold">
           Acces Securizat. Parolă implicită: <span className="text-accent select-all">admin</span>
         </p>
      </div>
      
      <form onSubmit={handleLogin} className="w-full max-w-sm bg-surface p-10 border border-border shadow-2xl space-y-8 animate-fade-in">
        <div className="text-center">
          <span className="font-serif text-3xl tracking-widest font-bold text-accent">CARVELLO</span>
          <p className="text-[10px] uppercase tracking-widest text-muted mt-2 font-bold">Autentificare Manager</p>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-muted">Parolă Master</label>
            <input 
              type="password"
              autoFocus
              placeholder="••••••••"
              className={`w-full bg-surface-2 border ${error ? 'border-red-500' : 'border-border'} p-4 outline-none focus:border-accent transition-all text-center tracking-[0.3em] text-foreground font-mono`}
              value={pass}
              onChange={e => { setPass(e.target.value); setError(false); }}
            />
          </div>
          {error && (
            <p className="text-red-500 text-[9px] uppercase font-bold tracking-widest text-center animate-pulse">Parolă incorectă</p>
          )}
        </div>

        <div className="space-y-3">
          <button 
            type="submit" 
            className="w-full py-4 bg-foreground text-background font-bold uppercase tracking-widest text-[10px] hover:bg-accent transition-all shadow-lg"
          >
            Accesează CMS
          </button>
          
          <button 
            type="button"
            onClick={handleGoBack}
            className="w-full py-3 text-[9px] uppercase font-bold tracking-widest text-muted hover:text-foreground transition-colors"
          >
            Anulează și ieși
          </button>
        </div>
      </form>
    </div>
  );
};
