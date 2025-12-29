import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import Login from './pages/Login';
import Register from './pages/Register';
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/AdminDashboard';

// Custom theme configuration for Pet Shop
const customTheme = {
  token: {
    colorPrimary: '#FF8C00', // Orange - friendly and energetic for pets
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1890ff',
    borderRadius: 8,
    fontSize: 14,
  },
  components: {
    Button: {
      borderRadius: 8,
      controlHeight: 40,
    },
    Input: {
      borderRadius: 8,
      controlHeight: 40,
    },
    Card: {
      borderRadius: 12,
    },
  },
};

function App() {
  return (
    <ConfigProvider theme={customTheme}>
      <BrowserRouter>
        <Routes>
          {/* Default route: Home page */}
          <Route path="/" element={<HomePage />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
