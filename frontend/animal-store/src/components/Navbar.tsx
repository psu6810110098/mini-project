import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Layout, Menu, Button, Avatar, Badge, Dropdown, Space } from 'antd';
import {
  UserOutlined,
  ShoppingCartOutlined,
  LogoutOutlined,
  HomeOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import type { User } from '../types';
import type { MenuProps } from 'antd';

const { Header } = Layout;

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }

    // Listen for cart updates
    const handleCartUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ count: number }>;
      setCartCount(customEvent.detail.count);
    };

    window.addEventListener('cartUpdate', handleCartUpdate);
    return () => {
      window.removeEventListener('cartUpdate', handleCartUpdate);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  // Menu items for logged-in users
  const menuItems: MenuProps['items'] = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: <Link to="/">Home</Link>,
    },
    ...(user?.role === 'admin'
      ? [
          {
            key: 'admin',
            icon: <DashboardOutlined />,
            label: <Link to="/admin">Admin Dashboard</Link>,
          },
        ]
      : []),
  ];

  // User dropdown menu items
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'email',
      label: user?.email,
      disabled: true,
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

  return (
    <Header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderBottom: '1px solid #f0f0f0',
        padding: '0 2rem',
        height: '64px',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#FF8C00',
          cursor: 'pointer',
        }}
        onClick={() => navigate('/')}
      >
        🐾 Pet Shop
      </div>

      {/* Navigation and Actions */}
      <Space size="large">
        {user ? (
          <>
            {/* Navigation Menu */}
            <Menu
              mode="horizontal"
              items={menuItems}
              style={{
                flex: 1,
                minWidth: 0,
                border: 'none',
                backgroundColor: 'transparent',
              }}
              selectable
              defaultSelectedKeys={['home']}
            />

            {/* Shopping Cart with Badge */}
            <Badge count={cartCount} offset={[-5, 5]}>
              <Button
                type="primary"
                icon={<ShoppingCartOutlined />}
                size="large"
                onClick={() => navigate('/')}
              >
                Cart
              </Button>
            </Badge>

            {/* User Dropdown */}
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar size="large" icon={<UserOutlined />} />
              </Space>
            </Dropdown>
          </>
        ) : (
          <Button type="primary" size="large" onClick={() => navigate('/login')}>
            Login
          </Button>
        )}
      </Space>
    </Header>
  );
}
