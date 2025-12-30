import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Cart from './pages/Cart';
import PetDetail from './pages/PetDetail';
import UserProfile from './pages/UserProfile';
import { CartProvider } from './context/CartContext';
import './App.css';

const { Content } = Layout;

function App() {
  return (
    <CartProvider>
      <Router>
        <Layout style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          {/* Navbar - Fixed Header */}
          <Navbar />

          {/* Main Content Area */}
          <Content style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/pet/:id" element={<PetDetail />} />
              <Route path="/profile" element={<UserProfile />} />
            </Routes>
          </Content>
        </Layout>
      </Router>
    </CartProvider>
  );
}

export default App;
