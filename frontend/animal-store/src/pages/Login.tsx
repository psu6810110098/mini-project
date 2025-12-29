import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import type { LoginResponse } from '../types';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post<LoginResponse>('/auth/login', {
        email,
        password
      });

      const { access_token, user } = res.data;

      // Save to LocalStorage
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      alert('Login Success!');

      // Redirect based on user role
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login Failed';
      alert(`Error: ${errorMessage}`);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>🔐 Login</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
          <button type="submit">Sign In</button>
        </form>
        <p style={{ marginTop: '20px' }}>
          New here? <Link to="/register" style={{ color: '#646cff' }}>Create Account</Link>
        </p>
      </div>
    </div>
  );
}