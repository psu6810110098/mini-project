import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  Button,
  Typography,
  Image,
  Tag,
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  message,
  Space,
  Popconfirm,
  Card,
  Spin,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DollarOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import api from '../api/axios';
import type { Pet, CreatePetDto, User } from '../types';
import Navbar from '../components/Navbar';

const { Title } = Typography;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);
      if (userData.role !== 'admin') {
        message.error('Access denied. Admin only.');
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
      const errorMsg = err.response?.data?.message || 'Failed to fetch pets';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (values: CreatePetDto) => {
    try {
      setSubmitting(true);
      await api.post('/pets', values);
      message.success('Pet created successfully!');
      setModalVisible(false);
      form.resetFields();
      fetchPets();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to create pet';
      message.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (values: CreatePetDto) => {
    if (!editingPet) return;

    try {
      setSubmitting(true);
      await api.patch(`/pets/${editingPet.id}`, values);
      message.success('Pet updated successfully!');
      setModalVisible(false);
      setEditingPet(null);
      form.resetFields();
      fetchPets();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to update pet';
      message.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/pets/${id}`);
      message.success('Pet deleted successfully!');
      fetchPets();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to delete pet';
      message.error(errorMsg);
    }
  };

  const openEditModal = (pet: Pet) => {
    setEditingPet(pet);
    form.setFieldsValue({
      name: pet.name,
      species: pet.species,
      age: pet.age,
      price: pet.price,
      description: pet.description,
      image_url: pet.image_url,
      is_available: pet.is_available,
    });
    setModalVisible(true);
  };

  const openCreateModal = () => {
    setEditingPet(null);
    form.resetFields();
    form.setFieldsValue({ is_available: true });
    setModalVisible(true);
  };

  const columns: ColumnsType<Pet> = [
    {
      title: 'Image',
      dataIndex: 'image_url',
      key: 'image_url',
      width: 100,
      render: (url: string) => (
        <Image
          src={url}
          alt="pet"
          width={60}
          height={60}
          style={{ objectFit: 'cover', borderRadius: '8px' }}
        />
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text: string) => <span style={{ fontWeight: 'bold' }}>{text}</span>,
    },
    {
      title: 'Species',
      dataIndex: 'species',
      key: 'species',
      render: (species: string) => <Tag color="orange">{species}</Tag>,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      width: 80,
      sorter: (a, b) => a.age - b.age,
      render: (age: number) => `${age} years`,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: (price: number) => (
        <Tag color="green" icon={<DollarOutlined />}>
          ${price.toFixed(2)}
        </Tag>
      ),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Status',
      dataIndex: 'is_available',
      key: 'is_available',
      width: 120,
      render: (available: boolean) => (
        <Tag color={available ? 'success' : 'error'}>
          {available ? 'Available' : 'Sold Out'}
        </Tag>
      ),
      filters: [
        { text: 'Available', value: true },
        { text: 'Sold Out', value: false },
      ],
      onFilter: (value, record) => record.is_available === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Pet"
            description="Are you sure you want to delete this pet?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ padding: '4rem', textAlign: 'center' }}>
          <Spin size="large" tip="Loading pets..." />
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
          backgroundColor: '#f0f2f5',
          minHeight: '100vh',
        }}
      >
        <Card>
          {/* Header */}
          <div
            style={{
              marginBottom: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Title level={2} style={{ margin: 0 }}>
              <DashboardOutlined /> Admin Dashboard
            </Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={openCreateModal}
            >
              Add New Pet
            </Button>
          </div>

          {/* Pets Table */}
          <Table
            columns={columns}
            dataSource={pets}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} pets`,
            }}
            scroll={{ x: 1000 }}
          />
        </Card>

        {/* Create/Edit Modal */}
        <Modal
          title={
            <span>
              {editingPet ? <EditOutlined /> : <PlusOutlined />}{' '}
              {editingPet ? 'Edit Pet' : 'Add New Pet'}
            </span>
          }
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            setEditingPet(null);
            form.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={editingPet ? handleUpdate : handleCreate}
            size="large"
          >
            <Form.Item
              label="Pet Name"
              name="name"
              rules={[{ required: true, message: 'Please input pet name!' }]}
            >
              <Input placeholder="e.g., Max, Bella, Charlie" />
            </Form.Item>

            <Form.Item
              label="Species"
              name="species"
              rules={[{ required: true, message: 'Please input species!' }]}
            >
              <Input placeholder="e.g., Dog, Cat, Bird" />
            </Form.Item>

            <Space size="large" style={{ width: '100%' }}>
              <Form.Item
                label="Age (years)"
                name="age"
                rules={[{ required: true, message: 'Please input age!' }]}
              >
                <InputNumber min={0} max={30} style={{ width: 150 }} />
              </Form.Item>

              <Form.Item
                label="Price ($)"
                name="price"
                rules={[{ required: true, message: 'Please input price!' }]}
              >
                <InputNumber min={0} step={0.01} style={{ width: 150 }} />
              </Form.Item>
            </Space>

            <Form.Item
              label="Image URL"
              name="image_url"
              rules={[{ required: true, message: 'Please input image URL!' }]}
            >
              <Input placeholder="https://example.com/pet-image.jpg" />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: 'Please input description!' }]}
            >
              <Input.TextArea
                rows={3}
                placeholder="Describe the pet's personality, breed, etc."
              />
            </Form.Item>

            <Form.Item
              label="Available"
              name="is_available"
              valuePropName="checked"
            >
              <Switch checkedChildren="Available" unCheckedChildren="Sold Out" />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitting}
                  icon={editingPet ? <EditOutlined /> : <PlusOutlined />}
                >
                  {editingPet ? 'Update Pet' : 'Create Pet'}
                </Button>
                <Button
                  onClick={() => {
                    setModalVisible(false);
                    setEditingPet(null);
                    form.resetFields();
                  }}
                >
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
}
