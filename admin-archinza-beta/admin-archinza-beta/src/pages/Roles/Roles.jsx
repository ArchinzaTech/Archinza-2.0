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
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import config from "../../config/config";
import http from "../../helpers/http";

const { Option } = Select;

const Roles = () => {
  // State
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  const [form] = Form.useForm();
  const [viewUsersModal, setViewUsersModal] = useState(false);
  const [usersForRole, setUsersForRole] = useState([]);
  const baseUrl = config.api_url + "admin/roles";
  const usersUrl = baseUrl + "/users";
  const permissionsUrl = config.api_url + "admin/roles/permissions";

  // Fetch roles and permissions
  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchPermissions();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const { data } = await http.get(baseUrl);
      setRoles(data || []);
    } catch (error) {
      message.error("Failed to fetch roles");
    }
    setLoading(false);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await http.get(usersUrl);
      setUsers(data || []);
    } catch (error) {
      message.error("Failed to fetch roles");
    }
    setLoading(false);
  };

  const fetchPermissions = async () => {
    try {
      const { data } = await http.get(permissionsUrl);
      setPermissions(data || []);
    } catch (error) {
      message.error("Failed to fetch permissions");
    }
  };

  // Open Add Role Modal
  const openAddModal = () => {
    setEditMode(false);
    setCurrentRole(null);
    form.resetFields();
    setModalVisible(true);
  };

  // Open Edit Role Modal
  const openEditModal = (role) => {
    setEditMode(true);
    setCurrentRole(role);
    form.setFieldsValue({
      name: role.name,
      description: role.description,
      permissions: role.permissions?.map((p) => p._id || p),
    });
    setModalVisible(true);
  };

  // Close Modal
  const closeModal = () => {
    setModalVisible(false);
    setCurrentRole(null);
    form.resetFields();
  };

  // Submit Add/Edit Role
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      if (editMode && currentRole) {
        // Update role
        await http.put(`${baseUrl}/${currentRole._id}`, values);
        message.success("Role updated successfully");
      } else {
        // Create role
        await http.post(baseUrl, values);
        message.success("Role created successfully");
      }

      closeModal();
      fetchRoles();
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.message || "Operation failed");
      }
    }
  };

  // Delete Role
  const handleDelete = async (role) => {
    try {
      // Check if role has users assigned
      if (role.userCount > 0) {
        Modal.confirm({
          title: "Role has assigned users",
          icon: <ExclamationCircleOutlined />,
          content: `This role has ${role.userCount} user(s) assigned. Deleting it will remove the role from all users. Are you sure?`,
          onOk: async () => {
            await http.delete(`${baseUrl}/${role._id}`);
            message.success("Role deleted successfully");
            fetchRoles();
          },
        });
      } else {
        await http.delete(`${baseUrl}/${role._id}`);
        message.success("Role deleted successfully");
        fetchRoles();
      }
    } catch (error) {
      message.error("Failed to delete role");
    }
  };

  // View Users for Role
  const handleViewUsers = async (role) => {
    try {
      const { data } = await http.get(`${baseUrl}/${role._id}/users`);
      setUsersForRole(data || []);
      setViewUsersModal(true);
    } catch (error) {
      message.error("Failed to fetch users for this role");
    }
  };

  // Table columns
  const columns = [
    {
      title: "Role Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    // {
    //   title: "Users Count",
    //   dataIndex: "userCount",
    //   key: "userCount",
    //   render: (count) => (
    //     <Tag color={count > 0 ? "green" : "default"}>{count || 0} users</Tag>
    //   ),
    //   sorter: (a, b) => (a.userCount || 0) - (b.userCount || 0),
    // },
    {
      title: "Permissions",
      dataIndex: "permissions",
      key: "permissions",
      render: (perms) =>
        perms && perms.length > 0 ? (
          <div style={{ maxWidth: 200 }}>
            {perms.slice(0, 3).map((perm) => (
              <Tag
                key={perm._id || perm}
                color="blue"
                style={{ marginBottom: 4 }}
              >
                {perm.name || perm}
              </Tag>
            ))}
            {perms.length > 3 && (
              <Tag color="default">+{perms.length - 3} more</Tag>
            )}
          </div>
        ) : (
          <span style={{ color: "#999" }}>No permissions</span>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => openEditModal(record)}
            title="Edit Role"
          />
          <Button
            icon={<UserOutlined />}
            size="small"
            onClick={() => handleViewUsers(record)}
            title="View Users"
          />
          <Popconfirm
            title="Are you sure to delete this role?"
            description={
              record.userCount > 0
                ? `This role has ${record.userCount} user(s) assigned.`
                : "This action cannot be undone."
            }
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
              title="Delete Role"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const userColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status || "active"}
        </Tag>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2>Roles Management</h2>
        <p style={{ color: "#666", marginBottom: 16 }}>
          Manage user roles and their permissions
        </p>

        <div style={{ marginBottom: 16 }}>
          <Card>
            <Statistic
              title="Total Roles"
              value={roles.length}
              prefix={<UserOutlined />}
            />
          </Card>
        </div>
      </div>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ marginBottom: 16 }}
        onClick={openAddModal}
      >
        Add New Role
      </Button>

      <Table
        columns={columns}
        dataSource={roles}
        rowKey={(record) => record._id}
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} roles`,
        }}
      />

      {/* Add/Edit Role Modal */}
      <Modal
        title={editMode ? "Edit Role" : "Add New Role"}
        open={modalVisible}
        onCancel={closeModal}
        onOk={handleModalOk}
        okText={editMode ? "Update Role" : "Create Role"}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Role Name"
            name="name"
            rules={[
              { required: true, message: "Please enter role name" },
              { min: 2, message: "Role name must be at least 2 characters" },
            ]}
          >
            <Input placeholder="Enter role name" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please enter role description" },
            ]}
          >
            <Input.TextArea rows={3} placeholder="Enter role description" />
          </Form.Item>

          <Form.Item label="Permissions" name="permissions">
            <Select
              mode="multiple"
              placeholder="Select permissions for this role"
              optionLabelProp="label"
              showSearch
              filterOption={(input, option) =>
                option.label.toLowerCase().includes(input.toLowerCase())
              }
            >
              {permissions.map((perm) => (
                <Option key={perm._id} value={perm._id} label={perm.name}>
                  <div>
                    <strong>{perm.name}</strong>
                    {perm.description && (
                      <div style={{ fontSize: "12px", color: "#666" }}>
                        {perm.description}
                      </div>
                    )}
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Users Modal */}
      <Modal
        title="Users with this Role"
        open={viewUsersModal}
        onCancel={() => setViewUsersModal(false)}
        footer={[
          <Button key="close" onClick={() => setViewUsersModal(false)}>
            Close
          </Button>,
        ]}
        width={700}
      >
        {usersForRole.length === 0 ? (
          <div
            style={{ textAlign: "center", padding: "40px 0", color: "#999" }}
          >
            <UserOutlined style={{ fontSize: "48px", marginBottom: "16px" }} />
            <p>No users assigned to this role yet.</p>
          </div>
        ) : (
          <Table
            dataSource={usersForRole}
            columns={userColumns}
            rowKey={(record) => record._id}
            pagination={false}
            size="small"
          />
        )}
      </Modal>
    </div>
  );
};

export default Roles;

