import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Image,
  Tag,
  Spin,
  Space,
  message,
  Empty,
  Divider,
  List,
  Avatar,
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  CalendarOutlined,
  DollarOutlined,
  LogoutOutlined,
  HomeOutlined,
  IdcardOutlined,
} from '@ant-design/icons';
import api from '../api/axios';
import type { UserWithAdoptions, Adoption } from '../types';
import { useAuth } from '../context/AuthContext';
import { useTheme, catppuccin } from '../context/ThemeContext';

const { Title, Text } = Typography;

export default function UserProfile() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { isDark } = useTheme();
  const [user, setUser] = useState<UserWithAdoptions | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (!storedUser.id) {
        message.error('User not found. Please login again.');
        navigate('/login');
        return;
      }

      const response = await api.get(`/users/${storedUser.id}`);
      setUser(response.data);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch user profile';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <Empty description="User not found" />
        <Button type="primary" onClick={() => navigate('/login')}>
          Go to Login
        </Button>
      </div>
    );
  }

  // Catppuccin colors
  const bgColor = isDark ? catppuccin.base : '#f5f5f5';
  const cardBg = isDark ? catppuccin.surface0 : '#ffffff';
  const textColor = isDark ? catppuccin.text : '#000000';
  const textSecondary = isDark ? catppuccin.subtext0 : '#8c8c8c';
  const borderColor = isDark ? catppuccin.surface1 : '#d9d9d9';
  const accentColor = isDark ? catppuccin.green : '#52c41a';
  const cardHoverBg = isDark ? catppuccin.surface1 : '#fafafa';
  const shadowColor = isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)';

  return (
    <div
      style={{
        padding: '2rem',
        maxWidth: '1400px',
        margin: '0 auto',
        backgroundColor: bgColor,
        minHeight: 'calc(100vh - 64px)',
      }}
    >
      {/* Page Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Title level={2} style={{ margin: 0, color: textColor }}>
          <IdcardOutlined style={{ color: accentColor }} /> My Profile
        </Title>
        <Text type="secondary">Manage your account and view adoption history</Text>
      </div>

      <Row gutter={[24, 24]}>
        {/* Left Column - User Info Card */}
        <Col xs={24} lg={8} xl={6}>
          <Card
            style={{
              backgroundColor: cardBg,
              borderRadius: '12px',
              boxShadow: `0 2px 8px ${shadowColor}`,
              border: isDark ? `1px solid ${borderColor}` : 'none',
            }}
          >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {/* Avatar Section */}
              <div style={{ textAlign: 'center' }}>
                <Avatar
                  size={100}
                  icon={<UserOutlined />}
                  style={{
                    backgroundColor: accentColor,
                    marginBottom: '1rem',
                  }}
                />
                <div>
                  <Title level={4} style={{ margin: '0 0 0.5rem 0', color: textColor }}>
                    {user.full_name || 'User'}
                  </Title>
                  <Tag color="blue" style={{ marginBottom: '0.5rem' }}>
                    {user.role}
                  </Tag>
                </div>
              </div>

              <Divider style={{ margin: '1rem 0', borderColor }} />

              {/* User Details */}
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                  <Text type="secondary" style={{ fontSize: '0.9rem' }}>
                    Email
                  </Text>
                  <div style={{ marginTop: '4px' }}>
                    <Text style={{ color: textColor, fontSize: '1rem' }}>
                      <MailOutlined style={{ marginRight: '8px', color: accentColor }} />
                      {user.email}
                    </Text>
                  </div>
                </div>

                <div>
                  <Text type="secondary" style={{ fontSize: '0.9rem' }}>
                    User ID
                  </Text>
                  <div style={{ marginTop: '4px' }}>
                    <Text style={{ color: textColor, fontSize: '1rem' }}>
                      #{user.id}
                    </Text>
                  </div>
                </div>

                <div>
                  <Text type="secondary" style={{ fontSize: '0.9rem' }}>
                    Total Adoptions
                  </Text>
                  <div style={{ marginTop: '4px' }}>
                    <Text style={{ color: textColor, fontSize: '1.1rem', fontWeight: 'bold' }}>
                      {user.adoptions?.length || 0} pets
                    </Text>
                  </div>
                </div>
              </Space>

              <Divider style={{ margin: '1rem 0', borderColor }} />

              {/* Action Buttons */}
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <Button
                  type="default"
                  icon={<HomeOutlined />}
                  onClick={() => navigate('/')}
                  block
                  size="large"
                >
                  Back to Home
                </Button>
                <Button
                  danger
                  icon={<LogoutOutlined />}
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  block
                  size="large"
                >
                  Logout
                </Button>
              </Space>
            </Space>
          </Card>
        </Col>

        {/* Right Column - Adoption History */}
        <Col xs={24} lg={16} xl={18}>
          <Card
            title={
              <Space size="large">
                <CalendarOutlined style={{ color: accentColor, fontSize: '1.2rem' }} />
                <span style={{ color: textColor, fontSize: '1.2rem', fontWeight: 'bold' }}>
                  Adoption History
                </span>
              </Space>
            }
            style={{
              backgroundColor: cardBg,
              borderRadius: '12px',
              boxShadow: `0 2px 8px ${shadowColor}`,
              border: isDark ? `1px solid ${borderColor}` : 'none',
            }}
          >
            {!user.adoptions || user.adoptions.length === 0 ? (
              <Empty
                description="No pets adopted yet"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <Button type="primary" onClick={() => navigate('/')} icon={<HomeOutlined />}>
                  Browse Pets
                </Button>
              </Empty>
            ) : (
              <List
                grid={{
                  gutter: [24, 24],
                  xs: 1,
                  sm: 1,
                  md: 2,
                  lg: 2,
                  xl: 2,
                  xxl: 3,
                }}
                dataSource={user.adoptions}
                renderItem={(adoption: Adoption) => (
                  <List.Item>
                    <Card
                      hoverable
                      style={{
                        backgroundColor: cardHoverBg,
                        borderRadius: '8px',
                        overflow: 'hidden',
                      }}
                      cover={
                        <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                          <Image
                            src={adoption.pet.image_url}
                            alt={adoption.pet.name}
                            height={200}
                            width="100%"
                            style={{ objectFit: 'cover' }}
                            preview={false}
                            fallback="https://images.unsplash.com/vector-1739806775546-65ab0a4f27ca?q=80&w=1480&auto=format&fit=crop"
                          />
                          <Tag
                            color="green"
                            style={{ position: 'absolute', top: 12, right: 12, fontSize: '0.85rem', padding: '4px 12px' }}
                          >
                            Adopted
                          </Tag>
                        </div>
                      }
                    >
                      <div style={{ padding: '4px 0' }}>
                        <Title level={5} style={{ margin: '0 0 8px 0', color: textColor }}>
                          {adoption.pet.name}
                        </Title>
                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                          <Tag color="blue" style={{ margin: 0, width: 'fit-content' }}>
                            {adoption.pet.species}
                          </Tag>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text type="secondary" style={{ fontSize: '0.9rem' }}>
                              <CalendarOutlined /> {adoption.pet.age} years
                            </Text>
                            <Text
                              strong
                              style={{
                                color: accentColor,
                                fontSize: '1.1rem',
                              }}
                            >
                              <DollarOutlined /> ${Number(adoption.pet.price).toFixed(2)}
                            </Text>
                          </div>
                          <Divider style={{ margin: '12px 0', borderColor }} />
                          <Text type="secondary" style={{ fontSize: '0.85rem', display: 'block' }}>
                            Adopted on:{' '}
                            {new Date(adoption.adoptionDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </Text>
                        </Space>
                      </div>
                    </Card>
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
