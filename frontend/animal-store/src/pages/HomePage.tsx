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
  message,
  Statistic,
  Space,
} from 'antd';
import {
  ShoppingCartOutlined,
  DollarOutlined,
  CalendarOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import api from '../api/axios';
import type { Pet } from '../types';
import Navbar from '../components/Navbar';

const { Title, Text, Paragraph } = Typography;

export default function HomePage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cart, setCart] = useState<Pet[]>([]);

  useEffect(() => {
    fetchPets();
  }, []);

  const dispatchCartUpdate = (count: number) => {
    window.dispatchEvent(
      new CustomEvent('cartUpdate', { detail: { count } })
    );
  };

  const fetchPets = async () => {
    try {
      setLoading(true);
      const response = await api.get('/pets');
      setPets(response.data);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch pets';
      setError(errorMsg);
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (pet: Pet) => {
    const newCart = [...cart, pet];
    setCart(newCart);
    dispatchCartUpdate(newCart.length);
    message.success(`${pet.name} added to cart!`);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ padding: '4rem', textAlign: 'center' }}>
          <Spin size="large" />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div style={{ padding: '4rem', textAlign: 'center' }}>
          <Empty
            description={error}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" onClick={fetchPets}>
              Try Again
            </Button>
          </Empty>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div
        style={{
          padding: '2rem',
          maxWidth: '1400px',
          margin: '0 auto',
          backgroundColor: '#f0f2f5',
          minHeight: '100vh',
        }}
      >
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
            <Col xs={24} md={6}>
              <Statistic
                title="Cart Items"
                value={cart.length}
                prefix={<ShoppingCartOutlined />}
                valueStyle={{ color: '#FF8C00' }}
              />
            </Col>
          </Row>
        </Card>

        {/* Pets Grid */}
        {pets.length === 0 ? (
          <Card>
            <Empty
              description="No pets available at the moment"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </Card>
        ) : (
          <Row gutter={[16, 16]}>
            {pets.map((pet) => (
              <Col xs={24} sm={12} md={8} lg={6} key={pet.id}>
                <Card
                  hoverable
                  cover={
                    <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                      <Image
                        src={pet.image_url}
                        alt={pet.name}
                        height={200}
                        width="100%"
                        style={{ objectFit: 'cover' }}
                        preview={false}
                        fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJF9kT1Iw0AcxV9TpVVeqDkeY73QULXg4VZzFYRxtcSq2wp80q8wLhDqYpCwqgloLGGQiEF4Kou4q4orL8Lnv78/w73C0v+IKRVc2n0r5M7dFUCQA/KC8UwAAAAlwSFlzAAAOwwAADsMBx2+oZAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVHja7dEBDQAAAMKg909tDjegAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4GQAAAeTJ4i0AAAAASUVORK5CYII="
                      />
                      {!pet.is_available && (
                        <Tag
                          color="volcano"
                          style={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            fontSize: '12px',
                            padding: '4px 8px',
                          }}
                        >
                          Sold Out
                        </Tag>
                      )}
                    </div>
                  }
                  actions={[
                    <Button
                      type="primary"
                      icon={<ShoppingCartOutlined />}
                      onClick={() => addToCart(pet)}
                      disabled={!pet.is_available}
                      block
                    >
                      {pet.is_available ? 'Add to Cart' : 'Not Available'}
                    </Button>,
                  ]}
                >
                  <Card.Meta
                    title={
                      <Space direction="vertical" size={0} style={{ width: '100%' }}>
                        <Text strong style={{ fontSize: '1.1rem' }}>
                          {pet.name}
                        </Text>
                        <Tag color="orange">{pet.species}</Tag>
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <Space wrap>
                          <Text type="secondary">
                            <CalendarOutlined /> {pet.age} years
                          </Text>
                          <Text type="danger" strong>
                            <DollarOutlined /> ${Number(pet.price).toFixed(2)}
                          </Text>
                        </Space>
                        <Paragraph
                          ellipsis={{ rows: 2 }}
                          style={{ marginBottom: 0, color: '#666' }}
                        >
                          {pet.description}
                        </Paragraph>
                      </Space>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </>
  );
}
