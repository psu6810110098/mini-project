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
  Statistic,
  Space,
} from 'antd';
import {
  ShoppingCartOutlined,
  DollarOutlined,
  CalendarOutlined,
  HomeOutlined,
  CheckOutlined
} from '@ant-design/icons';
import api from '../api/axios';
import type { Pet } from '../types';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

export default function HomePage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // 2. Use the hook instead of local state
  const { addToCart, isInCart, cart } = useCart();
  const navigate = useNavigate();

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
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', backgroundColor: '#f0f2f5', minHeight: 'calc(100vh - 64px)' }}>
        
        {/* Header Section */}
        <Card style={{ marginBottom: '2rem' }}>
          <Row justify="space-between" align="middle" gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Space direction="vertical" size="small">
                <Title level={2} style={{ margin: 0 }}>
                  <HomeOutlined /> Our Pets
                </Title>
                <Text type="secondary">Find your perfect companion</Text>
              </Space>
            </Col>
            <Col xs={24} md={6} style={{ textAlign: 'right' }}>
              {/* Clickable Statistic to go to Cart */}
              <div 
                style={{ cursor: 'pointer', display: 'inline-block' }}
                onClick={() => navigate('/cart')}
              >
                <Statistic
                  title="Cart Items"
                  value={cart.length}
                  prefix={<ShoppingCartOutlined />}
                  valueStyle={{ color: '#FF8C00' }}
                />
              </div>
            </Col>
          </Row>
        </Card>

        {/* Pets Grid */}
        {pets.length === 0 ? (
          <Card>
            <Empty description="No pets available at the moment" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </Card>
        ) : (
          <Row gutter={[16, 16]}>
            {pets.map((pet) => {
              // 3. Determine button state based on backend status OR cart status
              const isAvailable = pet.status === 'AVAILABLE'; // Using backend enum 'AVAILABLE'
              const inCart = isInCart(Number(pet.id));

              return (
                <Col xs={24} sm={12} md={8} lg={6} key={pet.id}>
                  <Card
                    hoverable
                    onClick={() => navigate(`/pet/${pet.id}`)}
                    cover={
                      <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                        <Image
                          src={pet.image_url}
                          alt={pet.name}
                          height={200}
                          width="100%"
                          style={{ objectFit: 'cover' }}
                          preview={false}
                          fallback="https://via.placeholder.com/200"
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
                        type={inCart ? 'default' : 'primary'}
                        icon={inCart ? <CheckOutlined /> : <ShoppingCartOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(pet);
                        }}
                        disabled={!isAvailable || inCart}
                        block
                      >
                        {!isAvailable ? 'Sold' : inCart ? 'In Cart' : 'Add to Cart'}
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
                          {pet.tags && pet.tags.length > 0 && (
                            <Space wrap size="small">
                              {pet.tags.map((tag) => (
                                <Tag key={tag.id} color="purple" style={{ fontSize: '0.8rem' }}>
                                  {tag.name}
                                </Tag>
                              ))}
                            </Space>
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