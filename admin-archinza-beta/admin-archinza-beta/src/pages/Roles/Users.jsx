import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Tag,
  Space,
  Popconfirm,
  message,
  Card,
  Statistic,
  Row,
  Col,
  Switch,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import config from "../../config/config";
import http from "../../helpers/http";

const { Option } = Select;
const { Search } = Input;

const RoleUsers = () => {
  // State
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  const baseUrl = config.api_url + "admin/roles";
  const usersUrl = baseUrl + "/users";

  // Fetch users and roles
  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await http.get(usersUrl);
      setUsers(data || []);
    } catch (error) {
      message.error("Failed to fetch users");
    }
    setLoading(false);
  };

  const fetchRoles = async () => {
    try {
      const { data } = await http.get(baseUrl);
      setRoles(data || []);
    } catch (error) {
      message.error("Failed to fetch roles");
    }
  };

  // Open Add User Modal
  const openAddModal = () => {
    setEditMode(false);
    setCurrentUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  // Open Edit User Modal
  const openEditModal = (user) => {
    setEditMode(true);
    setCurrentUser(user);
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      role: user.role?._id || user.role,
      status: user.status || "active",
    });
    setModalVisible(true);
  };

  // Close Modal
  const closeModal = () => {
    setModalVisible(false);
    setCurrentUser(null);
    form.resetFields();
  };

  // Submit Add/Edit User
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      if (editMode && currentUser) {
        // Update user
        await http.put(`${baseUrl}/${currentUser._id}`, values);
        message.success("User updated successfully");
      } else {
        // Create user
        await http.post(usersUrl, values);
        message.success("User created successfully");
      }

      closeModal();
      fetchUsers();
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.message || "Operation failed");
      }
    }
  };

  // Delete User
  const handleDelete = async (user) => {
    try {
      await http.delete(`${baseUrl}/${user._id}`);
      message.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      message.error("Failed to delete user");
    }
  };

  // Toggle User Status
  const handleStatusToggle = async (user) => {
    try {
      const newStatus = user.status === "active" ? "inactive" : "active";
      await http.put(`${baseUrl}/${user._id}/status`, { status: newStatus });
      message.success(
        `User ${
          newStatus === "active" ? "activated" : "deactivated"
        } successfully`
      );
      fetchUsers();
    } catch (error) {
      message.error("Failed to update user status");
    }
  };

  // Filter users based on search and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchText.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;

    const matchesRole =
      roleFilter === "all" ||
      (user.role && (user.role._id === roleFilter || user.role === roleFilter));

    return matchesSearch && matchesStatus && matchesRole;
  });

  // Get user statistics
  const activeUsers = users.filter((user) => user.status === "active").length;
  const inactiveUsers = users.filter(
    (user) => user.status === "inactive"
  ).length;

  // Table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name, record) => (
        <div>
          <strong>{name}</strong>
          {record.isAdmin && (
            <Tag color="gold" size="small" style={{ marginLeft: 8 }}>
              Admin
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color="blue">{role?.name || role || "No Role"}</Tag>
      ),
      filters: roles.map((role) => ({
        text: role.name,
        value: role._id,
      })),
      onFilter: (value, record) =>
        record.role?._id === value || record.role === value,
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   key: "status",
    //   render: (status, record) => (
    //     <Space>
    //       <Tag color={status === "active" ? "green" : "red"}>
    //         {status || "active"}
    //       </Tag>
    //       <Switch
    //         size="small"
    //         checked={status === "active"}
    //         onChange={() => handleStatusToggle(record)}
    //         title={`${status === "active" ? "Deactivate" : "Activate"} user`}
    //       />
    //     </Space>
    //   ),
    //   filters: [
    //     { text: "Active", value: "active" },
    //     { text: "Inactive", value: "inactive" },
    //   ],
    //   onFilter: (value, record) => record.status === value,
    // },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "-"),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => openEditModal(record)}
            title="Edit User"
          />
          <Popconfirm
            title="Are you sure to delete this user?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
              title="Delete User"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2>Users Management</h2>
        <p style={{ color: "#666", marginBottom: 16 }}>
          Manage system users, their roles and access permissions
        </p>

        {/* Statistics */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Users"
                value={users.length}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Active Users"
                value={activeUsers}
                valueStyle={{ color: "#3f8600" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Inactive Users"
                value={inactiveUsers}
                valueStyle={{ color: "#cf1322" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Available Roles" value={roles.length} />
            </Card>
          </Col>
        </Row>
      </div>

      {/* Controls */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Search
            placeholder="Search users by name or email"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined />}
            allowClear
          />
        </Col>
        <Col span={4}>
          <Select
            placeholder="Filter by status"
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: "100%" }}
          >
            <Option value="all">All Status</Option>
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
        </Col>
        <Col span={4}>
          <Select
            placeholder="Filter by role"
            value={roleFilter}
            onChange={setRoleFilter}
            style={{ width: "100%" }}
          >
            <Option value="all">All Roles</Option>
            {roles.map((role) => (
              <Option key={role._id} value={role._id}>
                {role.name}
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={8} style={{ textAlign: "right" }}>
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchUsers}
              title="Refresh"
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openAddModal}
            >
              Add New User
            </Button>
          </Space>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey={(record) => record._id}
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} users`,
        }}
      />

      {/* Add/Edit User Modal */}
      <Modal
        title={editMode ? "Edit User" : "Add New User"}
        open={modalVisible}
        onCancel={closeModal}
        onOk={handleModalOk}
        okText={editMode ? "Update User" : "Create User"}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Full Name"
            name="name"
            rules={[
              { required: true, message: "Please enter user's full name" },
              { min: 2, message: "Name must be at least 2 characters" },
            ]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>

          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              { required: true, message: "Please enter email address" },
              { type: "email", message: "Please enter a valid email address" },
            ]}
          >
            <Input placeholder="Enter email address" />
          </Form.Item>

          {!editMode && (
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter password" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <Input.Password placeholder="Enter password" />
            </Form.Item>
          )}

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select placeholder="Select user role" optionLabelProp="label">
              {roles.map((role) => (
                <Option key={role._id} value={role._id} label={role.name}>
                  <div>
                    <strong>{role.name}</strong>
                    {role.description && (
                      <div style={{ fontSize: "12px", color: "#666" }}>
                        {role.description}
                      </div>
                    )}
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* <Form.Item label="Status" name="status" initialValue="active">
            <Select>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Form.Item> */}
        </Form>
      </Modal>
    </div>
  );
};

export default RoleUsers;
