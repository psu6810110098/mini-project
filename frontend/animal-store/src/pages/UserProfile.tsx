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
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  CalendarOutlined,
  DollarOutlined,
  LogoutOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import api from '../api/axios';
import type { UserWithAdoptions, Adoption } from '../types';

const { Title, Text, Paragraph } = Typography;

export default function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserWithAdoptions | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      // Get current user from localStorage
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
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

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', backgroundColor: '#f0f2f5', minHeight: 'calc(100vh - 64px)' }}>
        <Row gutter={[16, 16]}>
          {/* Left Column - User Info Card */}
          <Col xs={24} lg={8}>
            <Card>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Avatar Section */}
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      backgroundColor: '#1890ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1rem',
                    }}
                  >
                    <UserOutlined style={{ fontSize: '3rem', color: 'white' }} />
                  </div>
                  <Title level={3} style={{ margin: 0 }}>
                    {user.full_name || 'User'}
                  </Title>
                  <Tag color="blue" style={{ marginTop: '0.5rem' }}>
                    {user.role}
                  </Tag>
                </div>

                <Divider />

                {/* User Details */}
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <div>
                    <Text type="secondary">Email</Text>
                    <br />
                    <Text strong>
                      <MailOutlined /> {user.email}
                    </Text>
                  </div>
                  <div>
                    <Text type="secondary">User ID</Text>
                    <br />
                    <Text strong>#{user.id}</Text>
                  </div>
                </Space>

                <Divider />

                {/* Action Buttons */}
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button
                    type="default"
                    icon={<HomeOutlined />}
                    onClick={() => navigate('/')}
                    block
                  >
                    Back to Home
                  </Button>
                  <Button
                    danger
                    icon={<LogoutOutlined />}
                    onClick={handleLogout}
                    block
                  >
                    Logout
                  </Button>
                </Space>
              </Space>
            </Card>
          </Col>

          {/* Right Column - Adoption History */}
          <Col xs={24} lg={16}>
            <Card
              title={
                <Space>
                  <CalendarOutlined />
                  <span>Adoption History</span>
                </Space>
              }
            >
              {!user.adoptions || user.adoptions.length === 0 ? (
                <Empty
                  description="No pets adopted yet"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                  <Button type="primary" onClick={() => navigate('/')}>
                    Browse Pets
                  </Button>
                </Empty>
              ) : (
                <List
                  grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 1,
                    md: 2,
                    lg: 2,
                    xl: 2,
                    xxl: 2,
                  }}
                  dataSource={user.adoptions}
                  renderItem={(adoption: Adoption) => (
                    <List.Item>
                      <Card
                        hoverable
                        cover={
                          <div
                            style={{
                              height: '180px',
                              overflow: 'hidden',
                              position: 'relative',
                            }}
                          >
                            <Image
                              src={adoption.pet.image_url}
                              alt={adoption.pet.name}
                              height={180}
                              width="100%"
                              style={{ objectFit: 'cover' }}
                              preview={false}
                              fallback="https://via.placeholder.com/180"
                            />
                            <Tag
                              color="green"
                              style={{ position: 'absolute', top: 8, right: 8 }}
                            >
                              Adopted
                            </Tag>
                          </div>
                        }
                      >
                        <Card.Meta
                          title={
                            <Text strong style={{ fontSize: '1.1rem' }}>
                              {adoption.pet.name}
                            </Text>
                          }
                          description={
                            <Space
                              direction="vertical"
                              size="small"
                              style={{ width: '100%' }}
                            >
                              <Tag color="blue">{adoption.pet.species}</Tag>
                              <Text type="secondary">
                                <CalendarOutlined /> {adoption.pet.age} years
                              </Text>
                              <Text type="success" strong>
                                <DollarOutlined />{' '}
                                {Number(adoption.pet.price).toFixed(2)}
                              </Text>
                              <Divider style={{ margin: '8px 0' }} />
                              <Text type="secondary" style={{ fontSize: '0.85rem' }}>
                                Adopted on:{' '}
                                {new Date(
                                  adoption.adoptionDate
                                ).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </Text>
                            </Space>
                          }
                        />
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
