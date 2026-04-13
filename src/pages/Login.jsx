import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      setError('Invalid credentials');
      return;
    }

    if (onLogin(trimmedUsername, trimmedPassword)) {
      navigate('/', { replace: true });
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #111827 45%, #1f2937 100%)',
        padding: '2rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          width: '100%',
          maxWidth: '960px',
          background: 'rgba(15, 23, 42, 0.96)',
          borderRadius: '28px',
          overflow: 'hidden',
          boxShadow: '0 30px 80px rgba(15, 23, 42, 0.35)',
        }}
      > 
        <div
          style={{
            flex: 1,
            padding: '3rem',
            color: '#f8fafc',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            background: 'linear-gradient(180deg, rgba(59, 130, 246, 0.95), rgba(15, 23, 42, 0.96))',
          }}
        >
          <div style={{ marginBottom: '2rem' }}>
            <img
              src="/logo-1.png"
              alt="AlgoVista Logo"
              style={{ width: '200px',  marginBottom: '1.5rem', borderRadius: '16px' }}
            />
            {/* <h1 style={{ fontSize: '2.6rem', margin: 0, lineHeight: 1.05 }}>AlgoVista</h1> */}
            <p style={{  fontSize: '1rem', color: 'rgba(241,245,249,0.82)' }}>
              Welcome to the construction analytics dashboard. Please sign in to continue.
            </p>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            padding: '3rem',
            background: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ width: '100%', maxWidth: '360px' }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '2rem', color: '#0f172a' }}>Sign in</h2>
            <p style={{ marginBottom: '1.8rem', color: '#475569' }}>Use demo credentials to access the dashboard.</p>
            <form onSubmit={handleSubmit}>
              <label style={{ display: 'block', marginBottom: '0.6rem', color: '#334155', fontWeight: 600 }}>
                Username
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                placeholder="Enter Username "
                style={styles.input}
              />

              <label style={{ display: 'block', marginBottom: '0.6rem', color: '#334155', fontWeight: 600 }}>
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Enter Password"
                style={styles.input}
              />

              {error && <div style={styles.error}>{error}</div>}

              <button type="submit" style={styles.button}>Login</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  input: {
    width: '100%',
    padding: '1rem 1.1rem',
    borderRadius: '16px',
    border: '1px solid #cbd5e1',
    marginBottom: '1.2rem',
    fontSize: '1rem',
    color: '#0f172a',
    background: '#f8fafc',
  },
  button: {
    width: '100%',
    padding: '1rem 1.1rem',
    borderRadius: '16px',
    border: 'none',
    background: '#0f172a',
    color: '#ffffff',
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
  },
  error: {
    marginBottom: '1rem',
    color: '#b91c1c',
    fontSize: '0.95rem',
  },
};

export default Login;
