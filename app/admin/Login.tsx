import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dbService } from '../../services/db';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already logged in
    dbService.checkAuth().then(isAuthenticated => {
      if (isAuthenticated) {
        navigate('/admin', { replace: true });
      }
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await dbService.loginUser(username, pass);
    console.log('Login result:', result);
    
    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.message || 'Date de autentificare incorecte.');
      setPass('');
    }
    setLoading(false);
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
          <p className="text-[9px] text-accent/50 mt-1 uppercase tracking-widest">admin / carvello2024</p>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-muted">Utilizator</label>
            <input 
              type="text"
              autoFocus
              placeholder="admin"
              className="w-full bg-surface-2 border border-border p-4 outline-none focus:border-accent transition-all text-center tracking-widest text-foreground font-sans"
              value={username}
              onChange={e => { setUsername(e.target.value); setError(''); }}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-muted">Parolă</label>
            <input 
              type="password"
              placeholder="••••••••"
              className={`w-full bg-surface-2 border ${error ? 'border-red-500' : 'border-border'} p-4 outline-none focus:border-accent transition-all text-center tracking-[0.3em] text-foreground font-mono`}
              value={pass}
              onChange={e => { setPass(e.target.value); setError(''); }}
            />
          </div>
          {error && (
            <p className="text-red-500 text-[9px] uppercase font-bold tracking-widest text-center animate-pulse">{error}</p>
          )}
        </div>

        <div className="space-y-3">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-foreground text-background font-bold uppercase tracking-widest text-[10px] hover:bg-accent hover:text-white transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Se verifică...' : 'Accesează CMS'}
          </button>
        </div>
      </form>
    </div>
  );
};