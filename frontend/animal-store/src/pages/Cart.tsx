import { useState } from 'react';
import { 
  List, 
  Card, 
  Button, 
  Typography, 
  Image, 
  Statistic, 
  Row, 
  Col, 
  Empty, 
  message, 
  Modal 
} from 'antd';
import { DeleteOutlined, ShoppingOutlined, HomeOutlined } from '@ant-design/icons';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios'; // Use your existing api instance

const { Title, Text } = Typography;

export default function Cart() {
  const { cart, removeFromCart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setLoading(true);
    const errors: string[] = [];
    const successIds: number[] = [];

    // Process adoptions sequentially
    for (const pet of cart) {
      try {
        await api.post('/adoptions/adopt', { petId: pet.id });
        successIds.push(Number(pet.id));
      } catch (error: any) {
        console.error(`Failed to adopt ${pet.name}`, error);
        errors.push(pet.name);
      }
    }

    // Cleanup successful items
    successIds.forEach((id) => removeFromCart(id));
    setLoading(false);

    if (errors.length > 0) {
      Modal.warning({
        title: 'Adoption Issues',
        content: (
          <div>
            <p>The following pets could not be adopted (they may have been sold just now):</p>
            <ul>
              {errors.map(name => <li key={name}>{name}</li>)}
            </ul>
            <p>Successful adoptions have been removed from your cart.</p>
          </div>
        ),
      });
    } else {
      Modal.success({
        title: 'Adoption Successful!',
        content: 'Thank you for giving them a home. You can view your adoptions in the dashboard.',
        onOk: () => navigate('/dashboard'),
      });
    }
  };

  if (cart.length === 0) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <Empty
          description="Your cart is empty"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" icon={<HomeOutlined />} onClick={() => navigate('/')}>
            Browse Pets
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2}><ShoppingOutlined /> Your Cart</Title>
      
      <Row gutter={24}>
        {/* Cart Items List */}
        <Col xs={24} lg={16}>
          <List
            itemLayout="horizontal"
            dataSource={cart}
            renderItem={(pet) => (
              <List.Item
                actions={[
                  <Button 
                    danger 
                    icon={<DeleteOutlined />} 
                    onClick={() => removeFromCart(Number(pet.id))}
                  >
                    Remove
                  </Button>
                ]}
              >
                <List.Item.Meta
                  avatar={<Image width={100} src={pet.image_url} alt={pet.name} style={{ borderRadius: '8px' }} />}
                  title={<Text strong style={{ fontSize: '1.2rem' }}>{pet.name}</Text>}
                  description={
                    <div style={{ marginTop: '8px' }}>
                      <Text type="secondary">{pet.species} • {pet.age} years old</Text>
                      <br />
                      <Text type="success" strong>Available</Text>
                    </div>
                  }
                />
                <div style={{ minWidth: '100px', textAlign: 'right' }}>
                  <Text strong style={{ fontSize: '1.2rem', color: '#52c41a' }}>
                    ${Number(pet.price).toFixed(2)}
                  </Text>
                </div>
              </List.Item>
            )}
            style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
          />
        </Col>

        {/* Checkout Summary Sidebar */}
        <Col xs={24} lg={8}>
          <Card title="Order Summary" style={{ position: 'sticky', top: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <Text>Items ({cart.length})</Text>
              <Text strong>${cartTotal.toFixed(2)}</Text>
            </div>
            
            <Statistic 
              title="Total Cost" 
              value={cartTotal} 
              precision={2} 
              prefix="$" 
              valueStyle={{ color: '#3f8600' }} 
            />
            
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Button 
                type="primary" 
                size="large" 
                block 
                onClick={handleCheckout}
                loading={loading}
              >
                Proceed to Checkout
              </Button>
              <Button block onClick={clearCart} disabled={loading}>
                Clear Cart
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}