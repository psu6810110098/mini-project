import { useEffect, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Image,
  Tag,
  Empty,
  Spin,
  Space,
  Modal,
} from 'antd';
import {
  DollarOutlined,
  CalendarOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import api from '../api/axios';
import type { Pet } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme, catppuccin } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

export default function HomePage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { addToCart, isInCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  // Catppuccin colors
  const borderColor = isDark ? catppuccin.surface1 : undefined;

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const response = await api.get('/pets');
      setPets(response.data);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch pets';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleAdoptMe = async (pet: Pet, e: React.MouseEvent) => {
    e.stopPropagation();

    // Check if user is logged in
    if (!isAuthenticated) {
      Modal.warning({
        title: 'Login Required',
        content: 'Please login to adopt a pet',
        onOk: () => navigate('/login'),
      });
      return;
    }

    // Add to cart
    addToCart(pet);
  };

  if (loading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <Empty description={error} image={Empty.PRESENTED_IMAGE_SIMPLE}>
          <Button type="primary" onClick={fetchPets}>Try Again</Button>
        </Empty>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 3rem' }}>

      {/* Header Section */}
      <Card
        style={{
          marginBottom: '2rem',
          borderRadius: '12px',
          border: isDark ? `1px solid ${borderColor}` : 'none',
        }}
      >
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Space direction="vertical" size="small">
              <Title level={2} style={{ margin: 0 }}>
                <HomeOutlined /> Our Pets
              </Title>
              <Text type="secondary">Find your perfect companion</Text>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Pets Grid */}
      {pets.length === 0 ? (
        <Card style={{ borderRadius: '12px', border: isDark ? `1px solid ${borderColor}` : 'none' }}>
          <Empty description="No pets available at the moment" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </Card>
      ) : (
        <Row gutter={[24, 24]}>
          {pets.map((pet) => {
            const isAvailable = pet.status === 'AVAILABLE';
            const inCart = isInCart(Number(pet.id));

            return (
              <Col xs={24} sm={12} md={8} lg={6} key={pet.id}>
                <Card
                  hoverable
                  onClick={() => navigate(`/pet/${pet.id}`)}
                  style={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: isDark ? `1px solid ${borderColor}` : 'none',
                  }}
                  cover={
                    <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                      <Image
                        src={pet.image_url}
                        alt={pet.name}
                        height={200}
                        width="100%"
                        style={{ objectFit: 'cover' }}
                        preview={false}
                        fallback="https://images.unsplash.com/vector-1739806775546-65ab0a4f27ca?q=80&w=1480&auto=format&fit=crop"
                      />
                      {!isAvailable && (
                        <Tag color="volcano" style={{ position: 'absolute', top: 8, right: 8 }}>
                          Sold Out
                        </Tag>
                      )}
                    </div>
                  }
                  actions={[
                    <Button
                      key="adopt"
                      type={isAvailable && !inCart ? 'primary' : 'default'}
                      icon={inCart ? <CheckOutlined /> : <ShoppingCartOutlined />}
                      onClick={(e) => handleAdoptMe(pet, e)}
                      disabled={!isAvailable}
                      block
                      style={isAvailable && !inCart ? { backgroundColor: '#52c41a' } : {}}
                    >
                      {!isAvailable ? 'Already Adopted' : inCart ? 'In Cart' : 'Adopt Me'}
                    </Button>,
                  ]}
                >
                  <Card.Meta
                    title={
                      <Space direction="vertical" size={0} style={{ width: '100%' }}>
                        <Text strong style={{ fontSize: '1.1rem' }}>{pet.name}</Text>
                        <Tag color="blue">{pet.species}</Tag>
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <Space wrap>
                          <Text type="secondary"><CalendarOutlined /> {pet.age} years</Text>
                          <Text type="success" strong><DollarOutlined /> {Number(pet.price).toFixed(2)}</Text>
                        </Space>
                        {pet.tag && pet.tag.length > 0 && (
                          <div style={{ marginTop: '8px' }}>
                            <Space wrap size="small">
                              {pet.tag.map((tag) => (
                                <Tag key={tag.id} color="purple" style={{ fontSize: '0.8rem' }}>
                                  {tag.name}
                                </Tag>
                              ))}
                            </Space>
                          </div>
                        )}
                      </Space>
                    }
                  />
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </div>
  );
}
