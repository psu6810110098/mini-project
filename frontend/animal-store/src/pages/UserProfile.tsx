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
  Modal,
  Form,
  Input,
  Select,
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  CalendarOutlined,
  DollarOutlined,
  LogoutOutlined,
  HomeOutlined,
  IdcardOutlined,
  EditOutlined,
} from '@ant-design/icons';
import api from '../api/axios';
import type { UserWithAdoptions, Adoption } from '../types';
import { useAuth } from '../context/AuthContext';
import { useTheme, catppuccin } from '../context/ThemeContext';
import { UserGender } from '../types';

const { Title, Text } = Typography;
const { Option } = Select;

export default function UserProfile() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { isDark } = useTheme();
  const [user, setUser] = useState<UserWithAdoptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

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

  const openEditModal = () => {
    form.setFieldsValue({
      full_name: user?.full_name,
      gender: user?.gender,
    });
    setEditModalVisible(true);
  };

  const handleUpdateProfile = async (values: { full_name: string; gender: UserGender }) => {
    try {
      setSubmitting(true);
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await api.patch(`/users/${storedUser.id}`, values);
      
      // Update local state
      setUser(response.data);
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(response.data));
      
      message.success('Profile updated successfully!');
      setEditModalVisible(false);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to update profile';
      message.error(errorMsg);
    } finally {
      setSubmitting(false);
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
  const accentColor = catppuccin.green;
  const borderColor = isDark ? catppuccin.surface1 : undefined;

  return (
    <div style={{ padding: '2rem 3rem' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Title level={2} style={{ margin: 0 }}>
          <IdcardOutlined style={{ color: accentColor }} /> My Profile
        </Title>
        <Text type="secondary">Manage your account and view adoption history</Text>
      </div>

      <Row gutter={[24, 24]}>
        {/* Left Column - User Info Card */}
        <Col xs={24} lg={8} xl={6}>
          <Card
            style={{
              borderRadius: '12px',
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
                  <Title level={4} style={{ margin: '0 0 0.5rem 0' }}>
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
                    <Text style={{ fontSize: '1rem' }}>
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
                    <Text style={{ fontSize: '1rem' }}>
                      #{user.id}
                    </Text>
                  </div>
                </div>

                <div>
                  <Text type="secondary" style={{ fontSize: '0.9rem' }}>
                    Total Adoptions
                  </Text>
                  <div style={{ marginTop: '4px' }}>
                    <Text style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                      {user.adoptions?.length || 0} pets
                    </Text>
                  </div>
                </div>
              </Space>

              <Divider style={{ margin: '1rem 0', borderColor }} />

              {/* Action Buttons */}
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={openEditModal}
                  block
                  size="large"
                >
                  Edit Profile
                </Button>
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
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                  Adoption History
                </span>
              </Space>
            }
            style={{
              borderRadius: '12px',
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
                        <Title level={5} style={{ margin: '0 0 8px 0' }}>
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

      {/* Edit Profile Modal */}
      <Modal
        title={
          <Space>
            <EditOutlined />
            <span>Edit Profile</span>
          </Space>
        }
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateProfile}
          size="large"
        >
          <Form.Item
            label="Full Name"
            name="full_name"
            rules={[{ required: true, message: 'Please input your full name!' }]}
          >
            <Input placeholder="Enter your full name" />
          </Form.Item>

          <Form.Item
            label="Gender"
            name="gender"
            rules={[{ required: true, message: 'Please select your gender!' }]}
          >
            <Select placeholder="Select your gender">
              <Option value={UserGender.MALE}>Male</Option>
              <Option value={UserGender.FEMALE}>Female</Option>
              <Option value={UserGender.OTHER}>Other</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%' }} size="middle">
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                icon={<EditOutlined />}
                style={{ width: '100%' }}
              >
                Update Profile
              </Button>
              <Button
                onClick={() => {
                  setEditModalVisible(false);
                  form.resetFields();
                }}
                style={{ width: '100%' }}
              >
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
