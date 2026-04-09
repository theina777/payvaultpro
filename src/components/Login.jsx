import { useState } from 'react';
import { Lock, User } from 'lucide-react';

export default function Login({ accounts, onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const user = accounts.find(acc => acc.username === username && acc.password === password);
    if (user) {
      onLogin(user);
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="auth-container bg-slate-900">
      <div className="auth-blob blob-1"></div>
      <div className="auth-blob blob-2"></div>
      
      <div className="glass-panel auth-form-container animate-fade-in">
        <div className="flex-col flex-center gap-2" style={{ marginBottom: '2rem' }}>
          <div className="flex-center" style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(59, 130, 246, 0.2)', color: 'var(--accent)' }}>
            <Lock size={32} />
          </div>
          <h2 className="heading" style={{ margin: 0 }}>Secure Login</h2>
          <p style={{ color: 'var(--text-secondary)' }}>PayVaultPro Authentication</p>
        </div>

        <form onSubmit={handleLogin} className="flex-col gap-3">
          <div className="flex-col gap-1">
            <div style={{ position: 'relative' }}>
              <User size={20} style={{ position: 'absolute', left: 16, top: 14, color: 'var(--text-secondary)' }} />
              <input 
                className="glass-input interactive" 
                style={{ paddingLeft: 48 }}
                type="text" 
                placeholder="Username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex-col gap-1">
            <div style={{ position: 'relative' }}>
              <Lock size={20} style={{ position: 'absolute', left: 16, top: 14, color: 'var(--text-secondary)' }} />
              <input 
                className="glass-input interactive" 
                style={{ paddingLeft: 48 }}
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="glass-button" style={{ marginTop: '1rem' }}>
            Login to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
