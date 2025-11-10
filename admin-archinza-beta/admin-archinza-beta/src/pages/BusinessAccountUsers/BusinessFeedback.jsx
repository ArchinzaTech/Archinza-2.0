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
  message,
  Card,
  Statistic,
  Row,
  Col,
  Drawer,
  DatePicker,
  Descriptions,
  Typography,
  Breadcrumb,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  ReloadOutlined,
  SearchOutlined,
  MessageOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import config from "../../config/config";
import http from "../../helpers/http";
import dayjs from "dayjs";
import helper from "../../helpers/helper";
import moment from "moment";
import {
  hasExactPermission,
  hasPermission,
  isSuperAdmin,
} from "../../helpers/permissions";
import { jwtDecode } from "jwt-decode";

const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;
const { Text, Paragraph } = Typography;

const BusinessFeedback = () => {
  // State
  const [feedbacks, setFeedbacks] = useState([]);
  const [users, setUsers] = useState([
    // { _id: "1", name: "John Doe" },
    // { _id: "2", name: "Jane Smith" },
    // { _id: "3", name: "Mike Johnson" },
    // { _id: "4", name: "Sarah Wilson" },
  ]); // Mock users for now
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [topicFilter, setTopicFilter] = useState("all");
  const [topicOptions, setTopicOptions] = useState([]);
  const [assignedToFilter, setAssignedToFilter] = useState("all");
  const [dateRange, setDateRange] = useState([]);
  const token = localStorage.getItem(config.jwt_store_key);
  const userRole = jwtDecode(token);

  const feedbackUrl = config.api_url + "admin/feedbacks";

  // Status options
  const statusOptions = [
    { value: "new", label: "New", color: "blue" },
    { value: "assigned", label: "Assigned", color: "orange" },
    { value: "in_progress", label: "In Progress", color: "processing" },
    { value: "resolved", label: "Resolved", color: "success" },
    { value: "closed", label: "Closed", color: "default" },
    { value: "needs_more_info", label: "Needs More Info", color: "warning" },
    { value: "deferred", label: "Deferred", color: "purple" },
    { value: "on_hold", label: "On Hold", color: "red" },
  ];

  // Response status options
  const responseStatusColors = {
    not_replied: "red",
    replied: "green",
    pending: "orange",
  };

  // Fetch feedbacks
  useEffect(() => {
    fetchFeedbacks();
    fetchAdmins();
  }, []);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      if (isSuperAdmin(userRole.role)) {
        const { data } = await http.get(feedbackUrl + "/business");
        setFeedbacks(data?.data || []);
        setTopicOptions(data?.topics?.map((it) => it.topic) || []);
      } else if (hasPermission(userRole.role, "feeedback_assignee_business")) {
        const { data } = await http.get(
          feedbackUrl + `/business/${userRole?.id}`
        );
        if (data) {
          const updatedData = (data?.data || []).map((item) => ({
            ...item,
            status: item.status === "assigned" ? "new" : item.status,
          }));
          setFeedbacks(updatedData || []);
          setTopicOptions(data?.topics?.map((it) => it.topic) || []);
        } else {
          setFeedbacks([]);
          setTopicOptions([]);
        }
      } else {
        const { data } = await http.get(feedbackUrl + "/business");
        setFeedbacks(data?.data || []);
        setTopicOptions(data?.topics?.map((it) => it.topic) || []);
      }
    } catch (error) {
      message.error("Failed to fetch feedbacks");
    }
    setLoading(false);
  };

  const fetchAdmins = async (role) => {
    setLoading(true);
    const { data } = await http.get(
      `${feedbackUrl}/feedback-admins/User Admin - Business`
    );
    setUsers(data);
    setLoading(false);
  };

  // Open feedback drawer
  const openDrawer = (feedback) => {
    setCurrentFeedback(feedback);
    setDrawerVisible(true);
  };

  // Close drawer
  const closeDrawer = () => {
    setDrawerVisible(false);
    setCurrentFeedback(null);
  };

  // Open status change modal
  const openStatusModal = async (feedback) => {
    setCurrentFeedback(feedback);
    form.setFieldsValue({
      status: feedback.status,
      assigned_to: feedback.assigned_to || "",
    });
    setStatusModalVisible(true);
  };

  // Close status modal
  const closeStatusModal = () => {
    setStatusModalVisible(false);
    setCurrentFeedback(null);
    form.resetFields();
  };

  // Handle status update
  const handleStatusUpdate = async () => {
    try {
      const values = await form.validateFields();

      await http.put(
        `${feedbackUrl}/feedback-status/${currentFeedback._id}`,
        values
      );
      message.success("Feedback status updated successfully");

      closeStatusModal();
      fetchFeedbacks();
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.message || "Failed to update status");
      }
    }
  };

  // Filter feedbacks
  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const matchesSearch =
      feedback.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      feedback.email?.toLowerCase().includes(searchText.toLowerCase()) ||
      feedback.id?.toLowerCase().includes(searchText.toLowerCase()) ||
      feedback.feedback_topic?.toLowerCase().includes(searchText.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || feedback.status === statusFilter;

    const matchesTopic =
      topicFilter === "all" || feedback.feedback_topic === topicFilter;

    const matchesAssignedTo =
      assignedToFilter === "all" || feedback.assigned_to === assignedToFilter;

    const matchesDateRange =
      dateRange?.length === 0 ||
      (feedback?.createdAt &&
        dayjs(feedback.createdAt).isAfter(dateRange?.[0]) &&
        dayjs(feedback.createdAt).isBefore(dateRange?.[1]));

    return (
      matchesSearch &&
      matchesStatus &&
      matchesTopic &&
      matchesAssignedTo &&
      matchesDateRange
    );
  });

  // Get status color
  const getStatusColor = (status) => {
    const statusOption = statusOptions.find((opt) => opt.value === status);
    return statusOption ? statusOption.color : "default";
  };

  // Get user name by ID
  const getUserName = (userId) => {
    const user = users.find((u) => u._id === userId);
    return user ? user.name : "Unassigned";
  };

  // Format WhatsApp number
  const formatWhatsApp = (countryCode, number) => {
    if (!number) return "-";
    return countryCode ? `+${countryCode} ${number}` : number;
  };

  // Table columns
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      // width: 120,
      render: (id) => (
        <Text copyable={{ text: id }} style={{ fontFamily: "monospace" }}>
          {id?.substring(0, 8)}...
        </Text>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
      render: (name) => name || "-",
    },
    {
      title: "Feedback Topic",
      dataIndex: "feedback_topic",
      key: "feedback_topic",
      render: (topic) => <Tag color="cyan">{topic || "General"}</Tag>,
      filters: topicOptions.map((topic) => ({
        text: topic,
        value: topic,
      })),
      onFilter: (value, record) => record.feedback_topic === value,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {statusOptions.find((opt) => opt.value === status)?.label || status}
        </Tag>
      ),
      filters: statusOptions.map((status) => ({
        text: status.label,
        value: status.value,
      })),
      onFilter: (value, record) => record.status === value,
    },
    // {
    //   title: "Source",
    //   dataIndex: "source",
    //   key: "source",
    //   render: (source) => <Tag color="geekblue">{source || "Unknown"}</Tag>,
    // },
    {
      title: "Created At",
      render: (text, record) => {
        return helper.ISTDate(record.createdAt);
      },
      key: "createdAt",
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            // size="small"
            onClick={() => openDrawer(record)}
            title="View Details"
          >
            View
          </Button>
          <Button
            icon={<EditOutlined />}
            // size="small"
            type="primary"
            onClick={() => openStatusModal(record)}
            title="Update Status"
            disabled={
              hasPermission(userRole.role, "feeedback_business") ||
              hasExactPermission(userRole.role, "feeedback_assignee_business")
                ? false
                : true
            }
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Breadcrumb
        style={{ margin: "16px 0" }}
        items={[
          {
            title: "Dashboard",
          },
          {
            title: "Personal Flow",
          },

          {
            title: "Feedbacks",
          },
        ]}
      />

      <Row>
        <Col span={24}>
          <div className="site-card-border-less-wrapper">
            <Card title="Feedbacks" bordered={false}>
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={6}>
                  <Search
                    placeholder="Search feedbacks..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    // prefix={<SearchOutlined />}
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
                    {(!isSuperAdmin(userRole.role) ||
                    hasPermission(userRole.role, "feeedback_assignee_business")
                      ? statusOptions.filter(
                          (status) => status.value !== "assigned"
                        )
                      : statusOptions
                    ).map((status) => (
                      <Option key={status.value} value={status.value}>
                        {status.label}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col span={4}>
                  <Select
                    placeholder="Filter by topic"
                    value={topicFilter}
                    onChange={setTopicFilter}
                    style={{ width: "100%" }}
                  >
                    <Option value="all">All Topics</Option>
                    {topicOptions.map((topic) => (
                      <Option key={topic} value={topic}>
                        {topic}
                      </Option>
                    ))}
                  </Select>
                </Col>
                {!hasExactPermission(
                  userRole.role,
                  "feeedback_assignee_business"
                ) && (
                  <Col span={4}>
                    <Select
                      placeholder="Assigned to"
                      value={assignedToFilter}
                      onChange={setAssignedToFilter}
                      style={{ width: "100%" }}
                    >
                      <Option value="all">All Assignees</Option>
                      {users.map((user) => (
                        <Option key={user._id} value={user._id}>
                          {user.name}
                        </Option>
                      ))}
                    </Select>
                  </Col>
                )}
                <Col span={4}>
                  <RangePicker
                    placeholder={["Start date", "End date"]}
                    value={dateRange}
                    onChange={(dates) => setDateRange(dates || [])}
                    style={{ width: "100%" }}
                  />
                </Col>
              </Row>

              <Table
                columns={columns}
                dataSource={filteredFeedbacks}
                rowKey={(record) => record.id}
                loading={loading}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} Feedbacks`,
                }}
              />

              {/* Feedback Details Drawer */}
              <Drawer
                title="Feedback Details"
                placement="right"
                width={600}
                onClose={closeDrawer}
                open={drawerVisible}
              >
                {currentFeedback && (
                  <div>
                    <Descriptions title="Basic Information" bordered column={1}>
                      <Descriptions.Item label="ID">
                        <Text copyable>{currentFeedback.id}</Text>
                      </Descriptions.Item>
                      <Descriptions.Item label="Name">
                        {currentFeedback.name || "-"}
                      </Descriptions.Item>
                      <Descriptions.Item label="Email">
                        {currentFeedback.email || "-"}
                      </Descriptions.Item>
                      <Descriptions.Item label="WhatsApp">
                        {formatWhatsApp(
                          currentFeedback.whatsapp_country_code,
                          currentFeedback.whatsapp_number
                        )}
                      </Descriptions.Item>
                      <Descriptions.Item label="Topic">
                        <Tag color="cyan">
                          {currentFeedback.feedback_topic || "General"}
                        </Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Source">
                        <Tag color="geekblue">
                          {helper.convertToTitleCase(currentFeedback?.source) ||
                            "Unknown"}
                        </Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Status">
                        <Tag color={getStatusColor(currentFeedback.status)}>
                          {statusOptions.find(
                            (opt) => opt.value === currentFeedback.status
                          )?.label || currentFeedback.status}
                        </Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Response Status">
                        <Tag
                          color={
                            responseStatusColors[
                              currentFeedback.response_status
                            ] || "default"
                          }
                        >
                          {helper.convertToTitleCase(
                            currentFeedback.response_status?.replace("_", " ")
                          ) || "Not Replied"}
                        </Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Assigned To">
                        {currentFeedback.assigned_to ? (
                          <Tag color="purple">
                            <UserOutlined />{" "}
                            {getUserName(currentFeedback.assigned_to)}
                          </Tag>
                        ) : (
                          "Unassigned"
                        )}
                      </Descriptions.Item>
                      <Descriptions.Item label="Created Date">
                        {currentFeedback.createdAt
                          ? dayjs(currentFeedback.createdAt).format(
                              "MMMM DD, YYYY [at] HH:mm"
                            )
                          : "-"}
                      </Descriptions.Item>
                    </Descriptions>

                    <div style={{ marginTop: 24 }}>
                      <h4>Feedback Message</h4>
                      <Card>
                        <Paragraph>
                          {currentFeedback.feedback_message ||
                            "No message provided"}
                        </Paragraph>
                      </Card>
                    </div>

                    {/* <div style={{ marginTop: 24 }}>
                      <Button
                        type="primary"
                        onClick={() => openStatusModal(currentFeedback)}
                        icon={<EditOutlined />}
                      >
                        Update Status
                      </Button>
                    </div> */}
                  </div>
                )}
              </Drawer>

              {/* Status Update Modal */}
              <Modal
                title="Update Feedback Status"
                open={statusModalVisible}
                onCancel={closeStatusModal}
                onOk={handleStatusUpdate}
                okText="Update Status"
                width={500}
              >
                <Form form={form} layout="vertical">
                  <Form.Item
                    label="Status"
                    name="status"
                    rules={[
                      { required: true, message: "Please select a status" },
                    ]}
                  >
                    <Select placeholder="Select status">
                      {(hasExactPermission(
                        userRole.role,
                        "feeedback_assignee_business"
                      )
                        ? statusOptions.filter(
                            (status) => status.value !== "assigned"
                          )
                        : statusOptions
                      ).map((status) => (
                        <Option key={status.value} value={status.value}>
                          <Tag color={status.color}>{status.label}</Tag>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) =>
                      prevValues.status !== currentValues.status
                    }
                  >
                    {({ getFieldValue }) =>
                      getFieldValue("status") === "assigned" ? (
                        <Form.Item
                          label="Assign To"
                          name="assigned_to"
                          rules={[
                            {
                              required: true,
                              message: "Please select a user to assign",
                            },
                          ]}
                        >
                          <Select placeholder="Select user to assign">
                            {users.map((user) => (
                              <Option key={user._id} value={user._id}>
                                <UserOutlined /> {user.name}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      ) : null
                    }
                  </Form.Item>
                </Form>
              </Modal>
            </Card>
          </div>
        </Col>
      </Row>
      {/* Filters */}
    </div>
  );
};

export default BusinessFeedback;
