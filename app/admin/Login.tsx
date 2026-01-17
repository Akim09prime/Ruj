import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dbService } from '../../services/db';

const LOCKOUT_KEY = 'carvello_login_lockout';
const ATTEMPTS_KEY = 'carvello_login_attempts';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 10 * 60 * 1000; // 10 minutes

export const Login: React.FC = () => {
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);
  const [locked, setLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already logged in
    const sessionStr = localStorage.getItem('carvello_admin_session');
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        const isValid = session.active && (Date.now() - session.createdAt < 12 * 60 * 60 * 1000);
        if (isValid) {
          navigate('/admin', { replace: true });
        }
      } catch (e) {
        localStorage.removeItem('carvello_admin_session');
      }
    }

    // Check lockout
    checkLockout();
    const interval = setInterval(checkLockout, 1000);
    return () => clearInterval(interval);
  }, [navigate]);

  const checkLockout = () => {
    const lockoutStr = localStorage.getItem(LOCKOUT_KEY);
    if (lockoutStr) {
      const lockUntil = parseInt(lockoutStr);
      const remaining = lockUntil - Date.now();
      if (remaining > 0) {
        setLocked(true);
        setTimeLeft(Math.ceil(remaining / 1000));
      } else {
        setLocked(false);
        localStorage.removeItem(LOCKOUT_KEY);
        localStorage.removeItem(ATTEMPTS_KEY);
      }
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (locked) return;

    const settings = await dbService.getSettings();
    
    if (pass === settings.adminPassword) {
      // Success
      const session = {
        active: true,
        createdAt: Date.now()
      };
      localStorage.setItem('carvello_admin_session', JSON.stringify(session));
      localStorage.removeItem(ATTEMPTS_KEY);
      setError(false);
      navigate('/admin');
    } else {
      // Failure
      const attempts = parseInt(localStorage.getItem(ATTEMPTS_KEY) || '0') + 1;
      localStorage.setItem(ATTEMPTS_KEY, attempts.toString());
      
      if (attempts >= MAX_ATTEMPTS) {
        localStorage.setItem(LOCKOUT_KEY, (Date.now() + LOCKOUT_DURATION).toString());
        setLocked(true);
      }
      
      setError(true);
      setPass('');
    }
  };

  const handleGoBack = () => {
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
      
      <form onSubmit={handleLogin} className="w-full max-w-sm bg-surface p-10 border border-border shadow-2xl space-y-8 animate-fade-in">
        <div className="text-center">
          <span className="font-serif text-3xl tracking-widest font-bold text-accent">CARVELLO</span>
          <p className="text-[10px] uppercase tracking-widest text-muted mt-2 font-bold">Autentificare Manager</p>
        </div>
        
        {locked ? (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-center">
            <p className="text-red-500 text-[10px] uppercase font-bold tracking-widest">Cont Blocat Temporar</p>
            <p className="text-muted text-xs mt-2">Prea multe încercări eșuate.<br/>Reîncearcă în {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
          </div>
        ) : (
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
        )}

        <div className="space-y-3">
          <button 
            type="submit" 
            disabled={locked}
            className="w-full py-4 bg-foreground text-background font-bold uppercase tracking-widest text-[10px] hover:bg-accent hover:text-white transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Accesează CMS
          </button>
        </div>
      </form>
    </div>
  );
};