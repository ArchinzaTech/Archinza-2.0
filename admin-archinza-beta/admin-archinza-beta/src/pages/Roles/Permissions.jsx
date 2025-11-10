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
  Tooltip,
  Divider,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SecurityScanOutlined,
  SearchOutlined,
  ReloadOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import config from "../../config/config";
import http from "../../helpers/http";

const { Option } = Select;
const { Search, TextArea } = Input;

const Permissions = () => {
  // State
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPermission, setCurrentPermission] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [resourceFilter, setResourceFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");

  const baseUrl = config.api_url + "admin/roles/permissions";

  // Predefined resources and actions
  const resources = [
    "users",
    "roles",
    "permissions",
    "dashboard",
    "reports",
    "settings",
    "audit",
    "notifications",
    "files",
    "api",
  ];

  const actions = [
    "create",
    "read",
    "update",
    "delete",
    "list",
    "export",
    "import",
    "manage",
    "assign",
    "revoke",
  ];

  // Fetch permissions
  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const { data } = await http.get(baseUrl);
      setPermissions(data || []);
    } catch (error) {
      message.error("Failed to fetch permissions");
    }
    setLoading(false);
  };

  // Open Add Permission Modal
  const openAddModal = () => {
    setEditMode(false);
    setCurrentPermission(null);
    form.resetFields();
    setModalVisible(true);
  };

  // Open Edit Permission Modal
  const openEditModal = (permission) => {
    setEditMode(true);
    setCurrentPermission(permission);
    form.setFieldsValue({
      name: permission.name,
      description: permission.description,
      resource: permission.resource,
      action: permission.action,
      fields: permission.fields,
      constraints: permission.constraints,
    });
    setModalVisible(true);
  };

  // Close Modal
  const closeModal = () => {
    setModalVisible(false);
    setCurrentPermission(null);
    form.resetFields();
  };

  // Submit Add/Edit Permission
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      // Process fields and constraints
      if (values.fields) {
        values.fields = values.fields
          .split(",")
          .map((field) => field.trim())
          .filter((field) => field);
      }

      if (editMode && currentPermission) {
        // Update permission
        await http.put(`${baseUrl}/${currentPermission._id}`, values);
        message.success("Permission updated successfully");
      } else {
        // Create permission
        await http.post(baseUrl, values);
        message.success("Permission created successfully");
      }

      closeModal();
      fetchPermissions();
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.message || "Operation failed");
      }
    }
  };

  // Delete Permission
  const handleDelete = async (permission) => {
    try {
      await http.delete(`${baseUrl}/${permission._id}`);
      message.success("Permission deleted successfully");
      fetchPermissions();
    } catch (error) {
      message.error("Failed to delete permission");
    }
  };

  // Filter permissions based on search and filters
  const filteredPermissions = permissions.filter((permission) => {
    const matchesSearch =
      permission.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      permission.description
        ?.toLowerCase()
        .includes(searchText.toLowerCase()) ||
      permission.resource?.toLowerCase().includes(searchText.toLowerCase());

    const matchesResource =
      resourceFilter === "all" || permission.resource === resourceFilter;
    const matchesAction =
      actionFilter === "all" || permission.action === actionFilter;

    return matchesSearch && matchesResource && matchesAction;
  });

  // Get unique resources and actions from existing permissions
  const uniqueResources = [
    ...new Set(permissions.map((p) => p.resource).filter(Boolean)),
  ];
  const uniqueActions = [
    ...new Set(permissions.map((p) => p.action).filter(Boolean)),
  ];

  // Table columns
  const columns = [
    {
      title: "Permission Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name, record) => (
        <div>
          <strong>{name}</strong>
          {record.isSystem && (
            <Tag color="orange" size="small" style={{ marginLeft: 8 }}>
              System
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (description) => (
        <Tooltip title={description}>
          <span>{description}</span>
        </Tooltip>
      ),
    },
    {
      title: "Resource",
      dataIndex: "resource",
      key: "resource",
      render: (resource) => <Tag color="blue">{resource}</Tag>,
      filters: uniqueResources.map((resource) => ({
        text: resource,
        value: resource,
      })),
      onFilter: (value, record) => record.resource === value,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (action) => <Tag color="green">{action}</Tag>,
      filters: uniqueActions.map((action) => ({
        text: action,
        value: action,
      })),
      onFilter: (value, record) => record.action === value,
    },
    {
      title: "Fields",
      dataIndex: "fields",
      key: "fields",
      render: (fields) =>
        fields && fields.length > 0 ? (
          <div style={{ maxWidth: 150 }}>
            {fields.slice(0, 2).map((field, index) => (
              <Tag key={index} size="small" style={{ marginBottom: 2 }}>
                {field}
              </Tag>
            ))}
            {fields.length > 2 && (
              <Tooltip title={fields.slice(2).join(", ")}>
                <Tag size="small" color="default">
                  +{fields.length - 2} more
                </Tag>
              </Tooltip>
            )}
          </div>
        ) : (
          <span style={{ color: "#999" }}>All fields</span>
        ),
    },
    {
      title: "Constraints",
      dataIndex: "constraints",
      key: "constraints",
      render: (constraints) =>
        constraints ? (
          <Tooltip title={constraints?.lockedFields?.join(", ")}>
            <Tag color="purple" style={{ cursor: "pointer" }}>
              <InfoCircleOutlined /> Locked Fields
            </Tag>
          </Tooltip>
        ) : (
          <span style={{ color: "#999" }}>None</span>
        ),
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
            title="Edit Permission"
          />
          <Popconfirm
            title="Are you sure to delete this permission?"
            description="This will remove the permission from all roles that have it assigned."
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
              title="Delete Permission"
              disabled={record.isSystem}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2>Permissions Management</h2>
        <p style={{ color: "#666", marginBottom: 16 }}>
          Manage system permissions and access controls
        </p>

        {/* Statistics */}
        {/* <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Permissions"
                value={permissions.length}
                prefix={<SecurityScanOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Resources" value={uniqueResources.length} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Action Types" value={uniqueActions.length} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="System Permissions"
                value={permissions.filter((p) => p.isSystem).length}
                valueStyle={{ color: "#fa8c16" }}
              />
            </Card>
          </Col>
        </Row> */}
      </div>

      {/* Controls */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Search
            placeholder="Search permissions by name, description, or resource"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined />}
            allowClear
          />
        </Col>
        <Col span={4}>
          <Select
            placeholder="Filter by resource"
            value={resourceFilter}
            onChange={setResourceFilter}
            style={{ width: "100%" }}
          >
            <Option value="all">All Resources</Option>
            {uniqueResources.map((resource) => (
              <Option key={resource} value={resource}>
                {resource}
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={4}>
          <Select
            placeholder="Filter by action"
            value={actionFilter}
            onChange={setActionFilter}
            style={{ width: "100%" }}
          >
            <Option value="all">All Actions</Option>
            {uniqueActions.map((action) => (
              <Option key={action} value={action}>
                {action}
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={8} style={{ textAlign: "right" }}>
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchPermissions}
              title="Refresh"
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openAddModal}
            >
              Add New Permission
            </Button>
          </Space>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={filteredPermissions}
        rowKey={(record) => record._id}
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} permissions`,
        }}
      />

      {/* Add/Edit Permission Modal */}
      <Modal
        title={editMode ? "Edit Permission" : "Add New Permission"}
        open={modalVisible}
        onCancel={closeModal}
        onOk={handleModalOk}
        okText={editMode ? "Update Permission" : "Create Permission"}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Permission Name"
                name="name"
                rules={[
                  { required: true, message: "Please enter permission name" },
                  {
                    min: 3,
                    message: "Permission name must be at least 3 characters",
                  },
                ]}
              >
                <Input placeholder="e.g., users.create" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Resource"
                name="resource"
                rules={[
                  {
                    required: true,
                    message: "Please select or enter resource",
                  },
                ]}
              >
                <Select
                  placeholder="Select or type resource"
                  showSearch
                  allowClear
                  mode="combobox"
                >
                  {resources.map((resource) => (
                    <Option key={resource} value={resource}>
                      {resource}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Action"
                name="action"
                rules={[
                  { required: true, message: "Please select or enter action" },
                ]}
              >
                <Select
                  placeholder="Select or type action"
                  showSearch
                  allowClear
                  mode="combobox"
                >
                  {actions.map((action) => (
                    <Option key={action} value={action}>
                      {action}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <span>
                    Fields
                    <Tooltip title="Comma-separated list of specific fields this permission applies to. Leave empty for all fields.">
                      <InfoCircleOutlined
                        style={{ marginLeft: 4, color: "#1890ff" }}
                      />
                    </Tooltip>
                  </span>
                }
                name="fields"
              >
                <Input placeholder="e.g., name, email, role (optional)" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              {
                required: true,
                message: "Please enter permission description",
              },
            ]}
          >
            <TextArea
              rows={2}
              placeholder="Describe what this permission allows"
            />
          </Form.Item>

          <Form.Item
            label={
              <span>
                Constraints
                <Tooltip title="Additional conditions or limitations for this permission (e.g., 'owner_only', 'same_department')">
                  <InfoCircleOutlined
                    style={{ marginLeft: 4, color: "#1890ff" }}
                  />
                </Tooltip>
              </span>
            }
            name="constraints"
          >
            <TextArea
              rows={2}
              placeholder="Additional constraints or conditions (optional)"
            />
          </Form.Item>

          <Divider />

          <div
            style={{
              background: "#f5f5f5",
              padding: "12px",
              borderRadius: "6px",
            }}
          >
            <h4 style={{ margin: "0 0 8px 0", color: "#666" }}>Examples:</h4>
            <ul
              style={{
                margin: 0,
                paddingLeft: "20px",
                color: "#666",
                fontSize: "12px",
              }}
            >
              <li>
                <strong>users.create</strong> - Allow creating new users
              </li>
              <li>
                <strong>reports.export</strong> - Allow exporting reports
              </li>
              <li>
                <strong>settings.manage</strong> - Allow managing system
                settings
              </li>
            </ul>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Permissions;
