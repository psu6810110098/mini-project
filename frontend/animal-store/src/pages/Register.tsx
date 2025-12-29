import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '', 
    password: '', 
    full_name: '', 
    gender: 'OTHER'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Cleaner Axios syntax
      await axios.post(`${API_URL}/auth/register`, formData);
      
      alert('Registered Successfully! Please Login.');
      navigate('/login');

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration Failed';
      alert(`Error: ${errorMessage}`);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>📝 Register</h2>
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
          <input name="full_name" type="text" placeholder="Full Name" onChange={handleChange} required />
          
          <select name="gender" onChange={handleChange} style={{ padding: '10px', borderRadius: '4px' }}>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
          
          <button type="submit">Register</button>
        </form>
        <p style={{ marginTop: '20px' }}>
          Already have an account? <Link to="/login" style={{ color: '#646cff' }}>Login here</Link>
        </p>
      </div>
    </div>
  );
}