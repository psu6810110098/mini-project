import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout, ConfigProvider, theme } from 'antd';
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
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme, catppuccin } from './context/ThemeContext';
import './App.css';

const { Content } = Layout;

function AppContent() {
  const { isDark } = useTheme();

  // Ant Design theme configuration
  const antdTheme = {
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: catppuccin.green,
      colorSuccess: catppuccin.green,
      colorWarning: catppuccin.yellow,
      colorError: catppuccin.red,
      colorInfo: catppuccin.blue,
      colorBgBase: isDark ? catppuccin.base : '#ffffff',
      colorBgContainer: isDark ? catppuccin.surface0 : '#ffffff',
      colorBgElevated: isDark ? catppuccin.surface1 : '#ffffff',
      colorBgLayout: isDark ? catppuccin.base : '#f5f5f5',
      colorText: isDark ? catppuccin.text : '#000000',
      colorTextSecondary: isDark ? catppuccin.subtext0 : '#8c8c8c',
      colorBorder: isDark ? catppuccin.surface1 : '#d9d9d9',
      borderRadius: 12,
    },
  };

  const bgColor = isDark ? catppuccin.base : '#f5f5f5';

  return (
    <ConfigProvider theme={antdTheme}>
      <Layout style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: bgColor }}>
        {/* Navbar - Fixed Header */}
        <Navbar />

        {/* Main Content Area */}
        <Content style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: bgColor, padding: 0 }}>
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
    </ConfigProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <AppContent />
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
