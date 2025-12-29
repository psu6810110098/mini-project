import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  // Get user from LocalStorage (saved during Login)
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '500px' }}>
        <h1>🐶 Animal Store</h1>
        <h3>Welcome, {user.full_name || 'Guest'}!</h3>
        <p>Your Role: <strong>{user.role || 'USER'}</strong></p>
        
        <div style={{ marginTop: '20px', padding: '10px', background: '#333', borderRadius: '8px' }}>
          <p>🚫 No pets available yet.</p>
          <small>Wait for Phase 2 implementation.</small>
        </div>

        <button onClick={handleLogout} style={{ marginTop: '20px', backgroundColor: '#d33' }}>
          Logout
        </button>
      </div>
    </div>
  );
}