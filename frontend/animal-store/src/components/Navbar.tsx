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
  Switch,
  Tooltip,
  theme,
} from 'antd';
import {
  ShoppingCartOutlined,
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  HomeOutlined,
  SettingOutlined,
  BulbOutlined,
  BulbFilled,
} from '@ant-design/icons';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme, catppuccin } from '../context/ThemeContext';
import type { MenuProps } from 'antd';
import { UserRole } from '../types';

const { Header } = Layout;
const { Text } = Typography;

const Navbar = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const { mode, toggleTheme, isDark } = useTheme();
  const { token } = theme.useToken();

  const handleLogout = () => {
    logout();
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
    if (user.role === UserRole.ADMIN) {
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
        backgroundColor: token.colorBgContainer,
        borderBottom: isDark ? `1px solid ${token.colorBorder}` : 'none',
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
              color: token.colorPrimary,
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

      {/* Theme Toggle & User Actions */}
      <Space size="middle" style={{ marginLeft: '1rem' }}>
        <Tooltip title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
          <Switch
            checked={isDark}
            onChange={toggleTheme}
            checkedChildren={<BulbFilled />}
            unCheckedChildren={<BulbOutlined />}
            style={{
              backgroundColor: isDark ? token.colorPrimary : undefined,
            }}
          />
        </Tooltip>

        {user ? (
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Avatar
              icon={<UserOutlined />}
              style={{
                backgroundColor: token.colorPrimary,
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
            >
              Register
            </Button>
          </Space>
        )}
      </Space>
    </Header>
  );
};

export default Navbar;
