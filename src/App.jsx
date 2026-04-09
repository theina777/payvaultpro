import { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ParticleBackground from './components/ParticleBackground';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCloudAccounts = async () => {
    try {
      const res = await fetch('/api/accounts');
      const data = await res.json();
      setAccounts(data);
    } catch (e) {
      console.error("Cloud backend unavailable", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCloudAccounts();
  }, []);

  const handleSetAccounts = async (newAccounts) => {
    setAccounts(newAccounts); // Optimistic updating
    try {
      await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAccounts)
      });
    } catch(e) {
      console.error("Failed to sync accounts", e);
    }
  };

  if (loading) return null;

  return (
    <>
      <ParticleBackground />
      {currentUser ? (
        <Dashboard 
          currentUser={currentUser}
          accounts={accounts}
          setAccounts={handleSetAccounts}
          onLogout={() => setCurrentUser(null)} 
        />
      ) : (
        <Login 
          accounts={accounts}
          onLogin={(user) => setCurrentUser(user)} 
        />
      )}
    </>
  );
}

export default App;
