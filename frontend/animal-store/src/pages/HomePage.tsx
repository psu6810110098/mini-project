import { useEffect, useState } from 'react';
import api from '../api/axios';
import type { Pet } from '../types';
import Navbar from '../components/Navbar';

export default function HomePage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cart, setCart] = useState<Pet[]>([]);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const response = await api.get('/pets');
      setPets(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch pets');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (pet: Pet) => {
    setCart([...cart, pet]);
    alert(`${pet.name} added to cart!`);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading pets...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ color: 'red' }}>{error}</p>
          <button onClick={fetchPets}>Retry</button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0 }}>🐶 Our Pets</h1>
          <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
            🛒 Cart: {cart.length} items
          </div>
        </div>

        {pets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
            <p style={{ fontSize: '1.2rem', color: '#666' }}>No pets available at the moment.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {pets.map((pet) => (
              <div
                key={pet.id}
                style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  backgroundColor: '#fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <img
                  src={pet.image_url || 'https://via.placeholder.com/300x200?text=No+Image'}
                  alt={pet.name}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    backgroundColor: '#f0f0f0'
                  }}
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/300x200?text=No+Image';
                  }}
                />
                <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.3rem' }}>{pet.name}</h3>
                  <p style={{ margin: '0.25rem 0', color: '#666', fontSize: '0.9rem' }}>
                    🏷️ {pet.species}
                  </p>
                  <p style={{ margin: '0.25rem 0', color: '#666', fontSize: '0.9rem' }}>
                    🎂 {pet.age} years old
                  </p>
                  <p style={{ margin: '0.5rem 0', fontSize: '1.2rem', fontWeight: 'bold', color: '#646cff' }}>
                    ${pet.price.toFixed(2)}
                  </p>
                  <p style={{ margin: '0.5rem 0', fontSize: '0.9rem', color: '#555', flex: 1 }}>
                    {pet.description}
                  </p>
                  <button
                    onClick={() => addToCart(pet)}
                    disabled={!pet.is_available}
                    style={{
                      marginTop: '1rem',
                      padding: '0.75rem',
                      border: 'none',
                      borderRadius: '4px',
                      backgroundColor: pet.is_available ? '#646cff' : '#ccc',
                      color: 'white',
                      cursor: pet.is_available ? 'pointer' : 'not-allowed',
                      fontSize: '1rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {pet.is_available ? 'Add to Cart' : 'Not Available'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
