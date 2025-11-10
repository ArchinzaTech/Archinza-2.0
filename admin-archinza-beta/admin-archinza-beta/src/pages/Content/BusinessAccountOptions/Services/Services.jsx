import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  Card,
  Form,
  Input,
  notification,
  Button,
  Select,
  List,
  Modal,
  Table,
  Tabs,
  Tooltip,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import config from "../../../../config/config";
import http from "../../../../helpers/http";
import { hasPermission, isSuperAdmin } from "../../../../helpers/permissions";
import { jwtDecode } from "jwt-decode";

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [tagModalVisible, setTagModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingService, setEditingService] = useState(null);
  const [tags, setTags] = useState([]);
  const [newService, setNewService] = useState({ value: "", tag: "" });
  const [sortOrder, setSortOrder] = useState("asc");
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [searchTag, setSearchTag] = useState("");
  const [editingTag, setEditingTag] = useState(null);
  const [newTagName, setNewTagName] = useState("");
  const token = localStorage.getItem(config.jwt_store_key);
  const userRole = jwtDecode(token);

  const moduleName = "Services";
  const base_url = config.api_url;
  const [form] = Form.useForm();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data } = await http.get(
        `${base_url}admin/content/business-options/services`
      );
      if (data) {
        setServices(data);
        form.setFieldsValue({ services: data });
        const uniqueTags = [...new Set(data.map((service) => service.tag))];
        setTags(uniqueTags);
      }
    } catch (error) {
      notification.error({
        message: "Error fetching services",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditTag = (oldTag) => {
    setEditingTag(oldTag);
    setNewTagName(oldTag);
    setTagModalVisible(true);
  };

  const handleTagUpdate = async () => {
    if (!newTagName.trim()) {
      notification.error({ message: "Tag name cannot be empty" });
      return;
    }

    if (tags.includes(newTagName) && newTagName !== editingTag) {
      notification.error({ message: "Tag name already exists" });
      return;
    }
    // Update all services that use the old tag
    const updatedServices = services.map((service) => ({
      ...service,
      tag: service.tag === editingTag ? newTagName : service.tag,
    }));
    await handleSubmit(updatedServices);
    setServices(updatedServices);

    const uniqueTags = [
      ...new Set(updatedServices.map((service) => service.tag)),
    ];
    setTags(uniqueTags);

    setTagModalVisible(false);
    setEditingTag(null);
    setNewTagName("");

    notification.success({
      message: "Tag updated successfully",
    });
  };

  const handleAddService = async () => {
    if (!newService.value || !newService.tag) {
      notification.error({ message: "Both fields are required" });
      return;
    }
    const updatedServices = editingService
      ? services.map((s) => (s.value === editingService.value ? newService : s))
      : [{ ...newService, isNew: true }, ...services];

    setServices(updatedServices);
    if (!tags.includes(newService.tag)) {
      setTags([newService.tag, ...tags]);
    }
    await handleSubmit(updatedServices);
    setNewService({ value: "", tag: "" });
    setEditingService(null);
    setModalVisible(false);
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setNewService(service);
    setModalVisible(true);
  };

  const confirmDeleteService = (serviceValue) => {
    setServiceToDelete(serviceValue);
    setDeleteConfirmVisible(true);
  };

  const handleDeleteService = async () => {
    const filteredServices = services.filter(
      (service) => service.value !== serviceToDelete
    );
    setServices(filteredServices);
    setTags([...new Set(filteredServices.map((s) => s.tag))]);
    await handleSubmit(filteredServices);
    setDeleteConfirmVisible(false);
    setServiceToDelete(null);
  };

  const handleSort = () => {
    const sortedServices = [...services].sort((a, b) => {
      return sortOrder === "asc"
        ? a.value.localeCompare(b.value)
        : b.value.localeCompare(a.value);
    });
    setServices(sortedServices);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleTagSearch = (value) => {
    setSearchTag(value);
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && searchTag && !tags.includes(searchTag)) {
      setTags([searchTag, ...tags]);
      setNewService((prev) => ({ ...prev, tag: searchTag }));
      setSearchTag("");
    }
  };

  const handleSubmit = async (services) => {
    const { data } = await http.put(
      `${base_url}admin/content/business-options/services`,
      { services: services }
    );

    if (data) {
      notification["success"]({
        message: `${moduleName} Updated Successfully`,
      });
    }
  };

  const TagsManagement = () => {
    const columns = [
      {
        title: "Tag Name",
        dataIndex: "tag",
        key: "tag",
      },
      {
        title: "Services Count",
        dataIndex: "count",
        key: "count",
      },
      {
        title: "Actions",
        key: "actions",
        render: (_, record) => (
          <Tooltip
            title={
              !isSuperAdmin(userRole.role) &&
              hasPermission(userRole.role, "view_all")
                ? "You don't have permission to delete"
                : ""
            }
          >
            <Button
              disabled={
                !isSuperAdmin(userRole.role) &&
                hasPermission(userRole.role, "view_all")
              }
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditTag(record.tag)}
            />
          </Tooltip>
        ),
      },
    ];

    const tagStats = tags.map((tag) => ({
      tag,
      count: services.filter((service) => service.tag === tag).length,
      key: tag,
    }));

    return (
      <Table
        dataSource={tagStats}
        columns={columns}
        pagination={false}
        size="small"
      />
    );
  };

  return (
    <div>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
        <Breadcrumb.Item>Business Flow</Breadcrumb.Item>
        <Breadcrumb.Item>{moduleName}</Breadcrumb.Item>
      </Breadcrumb>

      <Modal
        title={editingService ? "Edit Service" : "Add Service"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleAddService}
      >
        <Form layout="vertical">
          <Form.Item label="Service Name" required>
            <Input
              value={newService.value}
              onChange={(e) =>
                setNewService((prev) => ({ ...prev, value: e.target.value }))
              }
              placeholder="Enter service name"
            />
          </Form.Item>
          <Form.Item label="Tag" required>
            <Select
              value={newService.tag}
              onChange={(value) =>
                setNewService((prev) => ({ ...prev, tag: value }))
              }
              onSearch={handleTagSearch}
              placeholder="Select or add a tag"
              dropdownMatchSelectWidth={false}
              showSearch
              filterOption={false}
              onKeyDown={handleTagKeyDown}
            >
              {tags
                .filter((tag) =>
                  tag.toLowerCase().includes(searchTag.toLowerCase())
                )
                .map((tag) => (
                  <Select.Option key={tag} value={tag}>
                    {tag}
                  </Select.Option>
                ))}
              {searchTag && !tags.includes(searchTag) && (
                <Select.Option value={searchTag} disabled>
                  Press Enter to add "{searchTag}"
                </Select.Option>
              )}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Confirm Deletion"
        open={deleteConfirmVisible}
        onCancel={() => setDeleteConfirmVisible(false)}
        onOk={handleDeleteService}
      >
        <p>Are you sure you want to delete this service?</p>
      </Modal>
      <Modal
        title="Edit Tag"
        open={tagModalVisible}
        onCancel={() => {
          setTagModalVisible(false);
          setEditingTag(null);
          setNewTagName("");
        }}
        onOk={handleTagUpdate}
      >
        <Form layout="vertical">
          <Form.Item label="Tag Name" required>
            <Input
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="Enter new tag name"
            />
          </Form.Item>
        </Form>
      </Modal>
      <Card title={moduleName} bordered={false}>
        <Tabs
          defaultActiveKey="services"
          items={[
            {
              key: "services",
              label: "Services",
              children: (
                <>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginBottom: "16px",
                    }}
                  >
                    <Input
                      placeholder="Search services"
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ width: "200px" }}
                    />
                    <Button
                      onClick={handleSort}
                      icon={
                        sortOrder === "asc" ? (
                          <SortAscendingOutlined />
                        ) : (
                          <SortDescendingOutlined />
                        )
                      }
                    >
                      Sort
                    </Button>
                  </div>
                  <div
                    style={{
                      maxHeight: "400px",
                      overflowY: "auto",
                      border: "1px solid #ddd",
                      padding: "10px",
                    }}
                  >
                    <List
                      dataSource={services.filter((service) =>
                        service.value
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                      )}
                      renderItem={(service) => (
                        <List.Item
                          actions={[
                            <Tooltip
                              title={
                                !isSuperAdmin(userRole.role) &&
                                hasPermission(userRole.role, "view_all")
                                  ? "You don't have permission to edit"
                                  : ""
                              }
                            >
                              <Button
                                disabled={
                                  !isSuperAdmin(userRole.role) &&
                                  hasPermission(userRole.role, "view_all")
                                }
                                type="text"
                                icon={<EditOutlined />}
                                onClick={() => handleEditService(service)}
                              />
                            </Tooltip>,
                            <Tooltip
                              title={
                                !isSuperAdmin(userRole.role) &&
                                hasPermission(userRole.role, "view_all")
                                  ? "You don't have permission to delete"
                                  : ""
                              }
                            >
                              <Button
                                disabled={
                                  !isSuperAdmin(userRole.role) &&
                                  hasPermission(userRole.role, "view_all")
                                }
                                type="text"
                                icon={<DeleteOutlined />}
                                onClick={() =>
                                  confirmDeleteService(service.value)
                                }
                              />
                            </Tooltip>,
                          ]}
                        >
                          <List.Item.Meta
                            title={<b>{service.value}</b>}
                            description={`Tag: ${service.tag}`}
                          />
                        </List.Item>
                      )}
                    />
                  </div>
                  <Tooltip
                    title={
                      !isSuperAdmin(userRole.role) &&
                      hasPermission(userRole.role, "view_all")
                        ? "You don't have permission to add a service"
                        : ""
                    }
                  >
                    <Button
                      disabled={
                        !isSuperAdmin(userRole.role) &&
                        hasPermission(userRole.role, "view_all")
                      }
                      type="dashed"
                      onClick={() => setModalVisible(true)}
                      block
                      style={{ marginTop: "10px" }}
                    >
                      Add Service
                    </Button>
                  </Tooltip>
                </>
              ),
            },
            {
              key: "tags",
              label: (
                <span>
                  <TagsOutlined /> Tags Management
                </span>
              ),
              children: <TagsManagement />,
            },
          ]}
        />
      </Card>
    </div>
  );
}

export default Services;
