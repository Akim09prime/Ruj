
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dbService } from '../../services/db';

export const Login: React.FC = () => {
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const settings = await dbService.getSettings();
    if (pass === settings.adminPassword) {
      sessionStorage.setItem('carvello_auth', 'true');
      navigate('/admin');
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <form onSubmit={handleLogin} className="w-full max-w-sm bg-surface p-10 border border-border shadow-2xl space-y-8">
        <div className="text-center">
          <span className="font-serif text-2xl tracking-widest font-bold text-accent">CARVELLO</span>
          <p className="text-[10px] uppercase tracking-widest text-muted mt-2">Restricted Access</p>
        </div>
        
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold tracking-widest">Master Password</label>
          <input 
            type="password"
            autoFocus
            className={`w-full bg-surface-2 border ${error ? 'border-red-500' : 'border-border'} p-3 outline-none focus:border-accent`}
            value={pass}
            onChange={e => { setPass(e.target.value); setError(false); }}
          />
          {error && <p className="text-red-500 text-[10px] uppercase font-bold">Access Denied</p>}
        </div>

        <button type="submit" className="w-full py-4 bg-foreground text-background font-bold uppercase tracking-widest text-xs hover:bg-accent transition-colors">
          Enter CMS
        </button>
      </form>
    </div>
  );
};
