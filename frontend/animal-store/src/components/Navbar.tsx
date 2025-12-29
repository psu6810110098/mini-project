import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { User } from '../types';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in on mount
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav style={{
      backgroundColor: '#fff',
      padding: '1rem 2rem',
      borderBottom: '1px solid #e0e0e0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#333' }}>
          🐾 Pet Shop
        </h1>
      </Link>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {user ? (
          <>
            <span style={{ color: '#666', fontSize: '0.9rem' }}>
              Welcome, {user.email}
            </span>
            <Link
              to="/"
              style={{
                padding: '0.5rem 1rem',
                textDecoration: 'none',
                color: '#333',
                borderRadius: '4px',
                border: '1px solid #ddd',
                backgroundColor: '#f9f9f9'
              }}
            >
              Home
            </Link>
            {user.role === 'admin' && (
              <Link
                to="/admin"
                style={{
                  padding: '0.5rem 1rem',
                  textDecoration: 'none',
                  color: 'white',
                  borderRadius: '4px',
                  backgroundColor: '#646cff'
                }}
              >
                Admin Dashboard
              </Link>
            )}
            <button
              onClick={handleLogout}
              style={{
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: '#ff4d4f',
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            style={{
              padding: '0.5rem 1rem',
              textDecoration: 'none',
              color: 'white',
              borderRadius: '4px',
              backgroundColor: '#646cff'
            }}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
