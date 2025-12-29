import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import type { Pet, CreatePetDto, UpdatePetDto, User } from '../types';
import Navbar from '../components/Navbar';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const [formData, setFormData] = useState<CreatePetDto>({
    name: '',
    species: '',
    age: 0,
    price: 0,
    description: '',
    image_url: '',
    is_available: true,
  });

  useEffect(() => {
    // Check if user is admin
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);
      if (userData.role !== 'admin') {
        alert('Access denied. Admin only.');
        navigate('/');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchPets();
    }
  }, [user]);

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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/pets', formData);
      alert('Pet created successfully!');
      setShowForm(false);
      resetForm();
      fetchPets();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create pet');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPet) return;

    try {
      await api.patch(`/pets/${editingPet.id}`, formData);
      alert('Pet updated successfully!');
      setEditingPet(null);
      setShowForm(false);
      resetForm();
      fetchPets();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update pet');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this pet?')) return;

    try {
      await api.delete(`/pets/${id}`);
      alert('Pet deleted successfully!');
      fetchPets();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete pet');
    }
  };

  const openEditForm = (pet: Pet) => {
    setEditingPet(pet);
    setFormData({
      name: pet.name,
      species: pet.species,
      age: pet.age,
      price: pet.price,
      description: pet.description,
      image_url: pet.image_url,
      is_available: pet.is_available,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      species: '',
      age: 0,
      price: 0,
      description: '',
      image_url: '',
      is_available: true,
    });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingPet(null);
    resetForm();
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0 }}>🔧 Admin Dashboard</h1>
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: '#52c41a',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            + Create New Pet
          </button>
        </div>

        {error && (
          <div style={{ padding: '1rem', backgroundColor: '#fff2f0', border: '1px solid #ffccc7', borderRadius: '4px', marginBottom: '1rem' }}>
            <p style={{ margin: 0, color: '#ff4d4f' }}>{error}</p>
          </div>
        )}

        {/* Create/Edit Form Modal */}
        {showForm && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '8px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}>
              <h2 style={{ marginTop: 0 }}>{editingPet ? 'Edit Pet' : 'Create New Pet'}</h2>
              <form onSubmit={editingPet ? handleUpdate : handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #d9d9d9', borderRadius: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>Species *</label>
                  <input
                    type="text"
                    required
                    value={formData.species}
                    onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #d9d9d9', borderRadius: '4px' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>Age *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                      style={{ width: '100%', padding: '0.5rem', border: '1px solid #d9d9d9', borderRadius: '4px' }}
                    />
                  </div>

                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>Price ($) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      style={{ width: '100%', padding: '0.5rem', border: '1px solid #d9d9d9', borderRadius: '4px' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>Image URL *</label>
                  <input
                    type="url"
                    required
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #d9d9d9', borderRadius: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>Description *</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #d9d9d9', borderRadius: '4px', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    id="is_available"
                    checked={formData.is_available}
                    onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                  />
                  <label htmlFor="is_available" style={{ margin: 0, fontWeight: 'bold' }}>Available for sale</label>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      border: 'none',
                      borderRadius: '4px',
                      backgroundColor: '#646cff',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {editingPet ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={closeForm}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      border: '1px solid #d9d9d9',
                      borderRadius: '4px',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      fontSize: '1rem'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Pets Table */}
        <div style={{
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: 'white'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f5f5f5' }}>
              <tr>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Image</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Name</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Species</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Age</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Price</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid #e0e0e0' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pets.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                    No pets found. Create your first pet!
                  </td>
                </tr>
              ) : (
                pets.map((pet) => (
                  <tr key={pet.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '0.5rem' }}>
                      <img
                        src={pet.image_url || 'https://via.placeholder.com/60x60?text=No+Image'}
                        alt={pet.name}
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                        onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/60x60?text=No+Image'; }}
                      />
                    </td>
                    <td style={{ padding: '1rem' }}>{pet.name}</td>
                    <td style={{ padding: '1rem' }}>{pet.species}</td>
                    <td style={{ padding: '1rem' }}>{pet.age}</td>
                    <td style={{ padding: '1rem' }}>${pet.price.toFixed(2)}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        backgroundColor: pet.is_available ? '#f6ffed' : '#fff2f0',
                        color: pet.is_available ? '#52c41a' : '#ff4d4f',
                        border: `1px solid ${pet.is_available ? '#b7eb8f' : '#ffccc7'}`
                      }}>
                        {pet.is_available ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <button
                        onClick={() => openEditForm(pet)}
                        style={{
                          padding: '0.5rem 1rem',
                          marginRight: '0.5rem',
                          border: 'none',
                          borderRadius: '4px',
                          backgroundColor: '#1890ff',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: '0.9rem'
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(pet.id)}
                        style={{
                          padding: '0.5rem 1rem',
                          border: 'none',
                          borderRadius: '4px',
                          backgroundColor: '#ff4d4f',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: '0.9rem'
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
