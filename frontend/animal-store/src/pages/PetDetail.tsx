import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Modal,
  message,
  Descriptions,
} from 'antd';
import {
  DollarOutlined,
  CalendarOutlined,
  ShoppingCartOutlined,
  LeftOutlined,
  TagOutlined,
} from '@ant-design/icons';
import api from '../api/axios';
import type { Pet } from '../types';
import { useCart } from '../context/CartContext';

const { Title, Text } = Typography;

export default function PetDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);

  const { addToCart, isInCart } = useCart();

  useEffect(() => {
    if (id) {
      fetchPetDetail(id);
    }
  }, [id]);

  const fetchPetDetail = async (petId: string) => {
    try {
      setLoading(true);
      const response = await api.get(`/pets/${petId}`);
      setPet(response.data);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch pet details';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleAdoptMe = () => {
    if (!pet) return;

    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      message.warning('Please login to adopt a pet');
      navigate('/login');
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

  if (!pet) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <Title level={3}>Pet not found</Title>
        <Button type="primary" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </div>
    );
  }

  const isAvailable = pet.status === 'AVAILABLE';
  const inCart = isInCart(Number(pet.id));

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', backgroundColor: '#f0f2f5', minHeight: 'calc(100vh - 64px)' }}>
      <Button
        icon={<LeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: '1rem' }}
      >
        Back
      </Button>

      <Card>
        <Row gutter={[32, 32]}>
          {/* Left Column - Pet Image */}
          <Col xs={24} md={12}>
            <div style={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <Image
                src={pet.image_url}
                alt={pet.name}
                width="100%"
                style={{ objectFit: 'cover' }}
                preview
                fallback="https://via.placeholder.com/400"
              />
            </div>
          </Col>

          {/* Right Column - Pet Details */}
          <Col xs={24} md={12}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {/* Header with Status Tag */}
              <div>
                <Space direction="vertical" size="small">
                  <Title level={2} style={{ margin: 0 }}>
                    {pet.name}
                  </Title>
                  <Space>
                    <Tag color="blue">{pet.species}</Tag>
                    <Tag color={isAvailable ? 'green' : 'volcano'}>
                      {pet.status}
                    </Tag>
                  </Space>
                </Space>
              </div>

              {/* Tags Section */}
              {pet.tags && pet.tags.length > 0 && (
                <Card type="inner" title={<Space><TagOutlined /> Tags</Space>}>
                  <Space size="small" wrap>
                    {pet.tags.map((tag) => (
                      <Tag key={tag.id} color="purple" style={{ fontSize: '0.9rem', padding: '4px 12px' }}>
                        {tag.name}
                      </Tag>
                    ))}
                  </Space>
                </Card>
              )}

              {/* Pet Information */}
              <Card type="inner" title="Pet Information">
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="Species">
                    <Text strong>{pet.species}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Age">
                    <CalendarOutlined /> {pet.age} years old
                  </Descriptions.Item>
                  <Descriptions.Item label="Price">
                    <Text type="success" strong style={{ fontSize: '1.2rem' }}>
                      <DollarOutlined /> {Number(pet.price).toFixed(2)}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Status">
                    <Tag color={isAvailable ? 'success' : 'error'}>
                      {isAvailable ? 'Available for Adoption' : 'Already Adopted'}
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>
              </Card>

              {/* Action Button */}
              <Button
                type={isAvailable && !inCart ? 'primary' : 'default'}
                size="large"
                block
                icon={inCart ? <TagOutlined /> : <ShoppingCartOutlined />}
                onClick={handleAdoptMe}
                disabled={!isAvailable}
                style={
                  isAvailable && !inCart
                    ? {
                        height: '50px',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        backgroundColor: '#52c41a',
                      }
                    : { height: '50px', fontSize: '1.1rem', fontWeight: 'bold' }
                }
              >
                {!isAvailable ? 'Already Adopted' : inCart ? 'In Cart - Go to Checkout' : 'Adopt Me'}
              </Button>

              {inCart && (
                <Button
                  type="default"
                  size="large"
                  block
                  onClick={() => navigate('/cart')}
                  style={{ height: '50px', fontSize: '1.1rem' }}
                >
                  Go to Cart
                </Button>
              )}
            </Space>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
