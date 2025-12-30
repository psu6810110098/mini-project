import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layout,
  Menu,
  Button,
  Badge,
  Avatar,
  Dropdown,
  Space,
  Typography,
} from 'antd';
import {
  ShoppingCartOutlined,
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  HomeOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useCart } from '../context/CartContext';
import type { MenuProps } from 'antd';

const { Header } = Layout;
const { Text } = Typography;

const Navbar = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // User dropdown menu items
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/profile'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  // Build main menu items - Start with Home only (no Cart for guests)
  const menuItems: MenuProps['items'] = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: 'Home',
      onClick: () => navigate('/'),
    },
  ];

  // Only add Cart and Admin menu items when user is logged in
  // Dashboard is REMOVED - users go to Profile instead
  if (user) {
    menuItems.push({
      key: 'cart',
      icon: (
        <Badge count={cart.length} size="small" offset={[10, 0]}>
          <ShoppingCartOutlined />
        </Badge>
      ),
      label: 'Cart',
      onClick: () => navigate('/cart'),
    });

    // ONLY add Admin Dashboard if user is admin
    if (user.role === 'admin') {
      menuItems.push({
        key: 'admin',
        icon: <SettingOutlined />,
        label: 'Admin Dashboard',
        onClick: () => navigate('/admin'),
      });
    }
  }

  return (
    <Header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 999,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        backgroundColor: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick={() => navigate('/')}
      >
        <Space size="small">
          <span style={{ fontSize: '1.5rem' }}>🐾</span>
          <Text
            strong
            style={{
              fontSize: '1.25rem',
              color: '#52c41a',
              margin: 0,
            }}
          >
            PetAdoption
          </Text>
        </Space>
      </div>

      {/* Navigation Menu */}
      <Menu
        mode="horizontal"
        items={menuItems}
        style={{
          flex: 1,
          minWidth: 0,
          justifyContent: 'flex-end',
          border: 'none',
          backgroundColor: 'transparent',
        }}
      />

      {/* User Actions */}
      <div style={{ marginLeft: '1rem' }}>
        {user ? (
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Avatar
              icon={<UserOutlined />}
              style={{
                backgroundColor: '#52c41a',
                cursor: 'pointer',
              }}
              size="large"
            />
          </Dropdown>
        ) : (
          <Space size="small">
            <Button
              type="default"
              icon={<LoginOutlined />}
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button
              type="primary"
              onClick={() => navigate('/register')}
              style={{ backgroundColor: '#52c41a' }}
            >
              Register
            </Button>
          </Space>
        )}
      </div>
    </Header>
  );
};

export default Navbar;
