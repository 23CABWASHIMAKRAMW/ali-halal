import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [phone, setPhone] = useState('');
  const [table, setTable] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (phone.length >= 8 && table) {
      // Send data back to the main App
      onLogin({ phone, table });
    } else {
      alert("Please enter a valid phone number and table number.");
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f4f4f4',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        width: '100%',
        maxWidth: '400px',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}>
        {/* Brand Section */}
        <div style={{ backgroundColor: '#F4A300', padding: '40px 20px', textAlign: 'center', color: 'white' }}>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '900', letterSpacing: '2px' }}>ALI HALAL</h1>
          <p style={{ margin: '5px 0 0', opacity: 0.9, fontSize: '0.9rem' }}>Digital Ordering System</p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} style={{ padding: '30px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#1A2332' }}>Phone Number</label>
            <input 
              type="tel" 
              placeholder="e.g. 050 123 4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{
                width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid #ddd',
                fontSize: '1rem', boxSizing: 'border-box', outline: 'none'
              }}
              required 
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#1A2332' }}>Table Number</label>
            <input 
              type="number" 
              placeholder="Which table are you at?"
              value={table}
              onChange={(e) => setTable(e.target.value)}
              style={{
                width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid #ddd',
                fontSize: '1rem', boxSizing: 'border-box', outline: 'none'
              }}
              required 
            />
          </div>

          <button type="submit" style={{
            width: '100%', backgroundColor: '#C8102E', color: 'white', border: 'none',
            padding: '15px', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 'bold',
            cursor: 'pointer', boxShadow: '0 4px 10px rgba(200, 16, 46, 0.3)'
          }}>
            START ORDERING
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;