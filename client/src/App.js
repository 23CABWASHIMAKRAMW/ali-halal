import React, { useState } from 'react';
import Login from './components/Login';
import Menu from './components/Menu';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // Toggle state

  return (
    <div className="App">
      {/* Secret Admin Switcher */}
      <div style={{ position: 'fixed', bottom: 10, right: 10, zIndex: 1000 }}>
        <button 
          onClick={() => setIsAdmin(!isAdmin)} 
          style={{ padding: '5px 10px', fontSize: '10px', opacity: 0.5 }}
        >
          {isAdmin ? "Switch to Customer View" : "Switch to Admin View"}
        </button>
      </div>

      {isAdmin ? (
        <AdminDashboard />
      ) : !session ? (
        <Login onLogin={(data) => setSession(data)} />
      ) : (
        <Menu session={session} />
      )}
    </div>
  );
}

export default App;