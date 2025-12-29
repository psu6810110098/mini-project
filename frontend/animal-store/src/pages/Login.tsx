import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Axios automatically stringifies JSON and parses the response
      const res = await axios.post(`${API_URL}/auth/login`, { 
        email, 
        password 
      });
      
      // Axios puts the actual response body inside 'data'
      const { access_token, user } = res.data;

      // Save to LocalStorage
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      alert('Login Success!');
      navigate('/dashboard');

    } catch (err: any) {
      // Axios stores the backend error response in err.response.data
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