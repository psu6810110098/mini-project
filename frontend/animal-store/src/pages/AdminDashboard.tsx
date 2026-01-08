import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Select,
  message,
  Space,
  Popconfirm,
  Card,
  Spin,
  Row,
  Col,
  Statistic,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DollarOutlined,
  DashboardOutlined,
  FilterOutlined,
  ClearOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import api from "../api/axios";
import type { Pet, CreatePetDto, Tag as TagType } from "../types";
import { PetStatus, UserRole } from "../types";
import { useAuth } from "../context/AuthContext";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [filteredPets, setFilteredPets] = useState<Pet[]>([]);
  const [tags, setTags] = useState<TagType[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [selectedTagFilter, setSelectedTagFilter] = useState<
    number | undefined
  >();
  const [form] = Form.useForm();

  // Business Stats
  const totalInventory = pets.length;
  const soldPets = pets.filter((p) => p.status === PetStatus.SOLD);
  const salesPerformance = soldPets.length;
  const totalRevenue = soldPets.reduce(
    (sum, pet) => sum + Number(pet.price),
    0
  );

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== UserRole.ADMIN) {
      message.error("Access Denied. Admin only.");
      navigate("/");
      return;
    }
    fetchPets();
    fetchTags();
  }, [user, navigate]);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const response = await api.get("/pets");
      setPets(response.data);
      setFilteredPets(response.data);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Failed to fetch pets";
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await api.get("/tags");
      setTags(response.data);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Failed to fetch tags";
      message.error(errorMsg);
    }
  };

  const handleCreate = async (values: CreatePetDto) => {
    try {
      setSubmitting(true);
      await api.post("/pets", values);
      message.success("Pet created successfully!");
      setModalVisible(false);
      form.resetFields();
      fetchPets();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Failed to create pet";
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
      message.success("Pet updated successfully!");
      setModalVisible(false);
      setEditingPet(null);
      form.resetFields();
      fetchPets();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Failed to update pet";
      message.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/pets/${id}`);
      message.success("Pet deleted successfully!");
      fetchPets();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Failed to delete pet";
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
      image_url: pet.image_url,
      description: "", // Backend doesn't return description in GET
      status: pet.status,
      tagIds: pet.tag?.map((tag) => tag.id) || [],
    });
    setModalVisible(true);
  };

  const openCreateModal = () => {
    setEditingPet(null);
    form.resetFields();
    form.setFieldsValue({ status: PetStatus.AVAILABLE, tagIds: [] });
    setModalVisible(true);
  };

  const handleTagFilterChange = (tagId: number | undefined) => {
    setSelectedTagFilter(tagId);
    if (tagId === undefined) {
      setFilteredPets(pets);
    } else {
      const filtered = pets.filter((pet) =>
        pet.tag?.some((tag) => tag.id === tagId)
      );
      setFilteredPets(filtered);
    }
  };

  const clearTagFilter = () => {
    setSelectedTagFilter(undefined);
    setFilteredPets(pets);
  };

  const columns: ColumnsType<Pet> = [
    {
      title: "Image",
      dataIndex: "image_url",
      key: "image_url",
      width: 100,
      render: (url: string) => (
        <Image
          src={url}
          alt="pet"
          width={60}
          height={60}
          style={{ objectFit: "cover", borderRadius: "8px" }}
          fallback="https://images.unsplash.com/vector-1739806775546-65ab0a4f27ca?q=80&w=1480&auto=format&fit=crop"
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text: string) => (
        <span style={{ fontWeight: "bold" }}>{text}</span>
      ),
    },
    {
      title: "Species",
      dataIndex: "species",
      key: "species",
      render: (species: string) => <Tag color="orange">{species}</Tag>,
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      width: 100,
      sorter: (a, b) => a.age - b.age,
      render: (age: number) => `${age} yrs`,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 120,
      render: (price: number) => (
        <Tag color="green" icon={<DollarOutlined />}>
          ${Number(price).toFixed(2)}
        </Tag>
      ),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Tags",
      dataIndex: "tag",
      key: "tag",
      width: 200,
      render: (petTags: TagType[]) => (
        <Space size="small" wrap>
          {petTags && petTags.length > 0 ? (
            petTags.map((tag) => (
              <Tag key={tag.id} color="blue">
                {tag.name}
              </Tag>
            ))
          ) : (
            <Text type="secondary">No tags</Text>
          )}
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: PetStatus) => (
        <Tag color={status === PetStatus.AVAILABLE ? "success" : "error"}>
          {status === PetStatus.AVAILABLE ? "Available" : "Sold"}
        </Tag>
      ),
      filters: [
        { text: "Available", value: PetStatus.AVAILABLE },
        { text: "Sold", value: PetStatus.SOLD },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
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
            <Button danger size="small" icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ padding: "4rem", textAlign: "center" }}>
        <Spin size="large" tip="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "2rem",
        backgroundColor: "#f0f2f5",
        minHeight: "calc(100vh - 64px)",
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
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

      {/* Business Stats Cards */}
      <Row gutter={16} style={{ marginBottom: "1.5rem" }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Inventory"
              value={totalInventory}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Sales Performance"
              value={salesPerformance}
              suffix="pets sold"
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={totalRevenue}
              precision={2}
              prefix="$"
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Tag Filter */}
      <Card
        type="inner"
        title={
          <Space>
            <FilterOutlined />
            <span>Filter by Tag</span>
          </Space>
        }
        style={{ marginBottom: "1rem" }}
        extra={
          selectedTagFilter !== undefined && (
            <Button
              size="small"
              icon={<ClearOutlined />}
              onClick={clearTagFilter}
            >
              Clear Filter
            </Button>
          )
        }
      >
        <Select
          style={{ width: "100%" }}
          placeholder="Select a tag to filter pets"
          allowClear
          value={selectedTagFilter}
          onChange={handleTagFilterChange}
          size="large"
        >
          {tags.map((tag) => (
            <Option key={tag.id} value={tag.id}>
              {tag.name}
            </Option>
          ))}
        </Select>
      </Card>

      {/* Pets Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredPets}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} pets`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={
          <Space>
            {editingPet ? <EditOutlined /> : <PlusOutlined />}
            <span>{editingPet ? "Edit Pet" : "Add New Pet"}</span>
          </Space>
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
            rules={[{ required: true, message: "Please input pet name!" }]}
          >
            <Input placeholder="e.g., Max, Bella, Charlie" />
          </Form.Item>

          <Form.Item
            label="Species"
            name="species"
            rules={[{ required: true, message: "Please input species!" }]}
          >
            <Input placeholder="e.g., Dog, Cat, Bird" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Age (years)"
                name="age"
                rules={[{ required: true, message: "Please input age!" }]}
              >
                <InputNumber min={0} max={30} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Price ($)"
                name="price"
                rules={[
                  { required: !editingPet, message: "Please input price!" },
                  {
                    type: "number",
                    min: 0.01,
                    message: "Price must be positive!",
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  step={0.01}
                  precision={2}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Image URL"
            name="image_url"
            rules={[{ required: true, message: "Please input image URL!" }]}
          >
            <Input placeholder="https://example.com/pet-image.jpg" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: !editingPet, message: "Please input description!" },
            ]}
          >
            <TextArea
              rows={3}
              placeholder="Describe the pet's personality, breed, etc."
            />
          </Form.Item>

          <Form.Item
            label="Tags"
            name="tagIds"
            tooltip="Select multiple tags to describe this pet"
          >
            <Select
              mode="multiple"
              placeholder="Select tags (e.g., Cute, Playful, Friendly)"
              allowClear
              showSearch
              optionFilterProp="children"
            >
              {tags.map((tag) => (
                <Option key={tag.id} value={tag.id}>
                  {tag.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select status!" }]}
            initialValue={PetStatus.AVAILABLE}
          >
            <Select>
              <Option value={PetStatus.AVAILABLE}>Available</Option>
              <Option value={PetStatus.SOLD}>Sold</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                icon={editingPet ? <EditOutlined /> : <PlusOutlined />}
              >
                {editingPet ? "Update Pet" : "Create Pet"}
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
  );
}
