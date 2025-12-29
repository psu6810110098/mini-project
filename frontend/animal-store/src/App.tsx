import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import './App.css'; // Keep your styles

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route: Redirect to Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;