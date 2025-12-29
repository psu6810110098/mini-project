import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  message,
  Space,
  Select,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  IdcardOutlined,
} from '@ant-design/icons';
import api from '../api/axios';
import type { RegisterFieldType } from './types';

const { Title, Text } = Typography;

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: RegisterFieldType) => {
    try {
      setLoading(true);
      await api.post('/auth/register', values);

      message.success('Registration Successful! Please login.');
      navigate('/login');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Registration Failed';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
        padding: '1rem',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 450,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          borderRadius: 12,
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Header */}
          <div style={{ textAlign: 'center' }}>
            <Title level={2} style={{ margin: 0, marginBottom: 8 }}>
              <IdcardOutlined /> Register
            </Title>
            <Text type="secondary">Create your account</Text>
          </div>

          {/* Register Form */}
          <Form
            form={form}
            name="register"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            size="large"
            initialValues={{ gender: 'OTHER' }}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Enter your email"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
                { min: 6, message: 'Password must be at least 6 characters!' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Create a password"
              />
            </Form.Item>

            <Form.Item
              label="Full Name"
              name="full_name"
              rules={[
                { required: true, message: 'Please input your full name!' },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Enter your full name"
              />
            </Form.Item>

            <Form.Item
              label="Gender"
              name="gender"
              rules={[{ required: true, message: 'Please select your gender!' }]}
            >
              <Select placeholder="Select Gender">
                <Select.Option value="MALE">Male</Select.Option>
                <Select.Option value="FEMALE">Female</Select.Option>
                <Select.Option value="OTHER">Other</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                icon={<IdcardOutlined />}
              >
                Register
              </Button>
            </Form.Item>
          </Form>

          {/* Footer Link */}
          <Text style={{ textAlign: 'center', display: 'block' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: 'bold' }}>
              Login here
            </Link>
          </Text>
        </Space>
      </Card>
    </div>
  );
}
