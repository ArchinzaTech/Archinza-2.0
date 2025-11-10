import React, { useState, useEffect } from "react";
import {
  Table,
  Badge,
  Space,
  Button,
  Modal,
  Typography,
  Tag,
  message,
  Tooltip,
  Input,
  Radio,
  List,
  Breadcrumb,
  Descriptions,
  Divider,
} from "antd";
import { UserOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import http from "../../../helpers/http";
import config from "../../../config/config";
import helper from "../../../helpers/helper";
import moment from "moment";
import { jwtDecode } from "jwt-decode";
import { hasPermission, isSuperAdmin } from "../../../helpers/permissions";
const { Text, Paragraph } = Typography;

const BusinessCustomOptionsAdmin = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [optionStatuses, setOptionStatuses] = useState({});
  const token = localStorage.getItem(config.jwt_store_key);
  const userRole = jwtDecode(token);

  const baseUrl = config.api_url + "admin/content/business-options";
  // Fetch data from API
  const fetchRequests = async () => {
    setLoading(true);
    const { data } = await http.get(`${baseUrl}/custom-options`);

    if (data) {
      const filterEmptyOptionsData = data.filter(
        (option) => option.options.length > 0
      );

      setData(filterEmptyOptionsData);
      setLoading(false);
    }
  };

  const mapOptionStatuses = (options) => {
    let mappedStatus = {};
    options.forEach((option, i) => {
      mappedStatus[i] = option.status;
    });
    setOptionStatuses(mappedStatus);
  };

  const handleOptionUpdate = async (requestId, status) => {
    console.log(status);
    if (status === "pending" || status === "in_progress") {
      const approvedOptions = [];
      const rejectedOptions = [];
      const updates = [];

      const previousRecord = currentRequest.options.reduce(
        (acc, opt, index) => {
          if (opt.status === "approved") {
            acc[opt.value] = true;
          }
          return acc;
        },
        {}
      );

      Object.keys(optionStatuses).forEach((index) => {
        const status = optionStatuses[index];
        const option = currentRequest.options[index].value;
        const wasApprovedBefore =
          currentRequest.options[index].status === "approved";

        updates.push({
          index: parseInt(index),
          value: option,
          status,
          wasApprovedBefore,
        });

        if (status === "approved") {
          approvedOptions.push(option);
        } else if (status === "rejected") {
          rejectedOptions.push(option);
        }
      });

      await http.put(`${baseUrl}/custom-options/${requestId}`, {
        updates,
        approvedOptions,
        rejectedOptions,
        previouslyApproved: previousRecord,
      });
      message.success("Options updated successfully");
      fetchRequests();
      setOptionsModalVisible(false);
      setOptionStatuses({});
      return;
    }
    setOptionsModalVisible(false);
    return;
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUserClick = async (record) => {
    setLoading(true);
    const { data } = await http.get(
      `${config.api_url}business/business-details/${record.user}`
    );
    if (data) {
      setSelectedRequest(data);
      setModalVisible(true);
    }
    setLoading(false);
  };

  const columns = [
    {
      title: "Question",
      dataIndex: "question",
      key: "question",
      render: (text) => (
        <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: "more" }}>
          {text}
        </Paragraph>
      ),
    },
    // {
    //   title: "Account Type",
    //   dataIndex: "account_type",
    //   key: "account_type",
    //   render: (type) => (
    //     <Tag color={type === "personal" ? "blue" : "purple"}>
    //       {type?.charAt(0)?.toUpperCase() + type?.slice(1)}
    //     </Tag>
    //   ),
    //   filters: [
    //     { text: "Personal", value: "personal" },
    //     { text: "Business", value: "business" },
    //   ],
    //   onFilter: (value, record) => record?.account_type === value,
    // },
    {
      title: "Options",
      dataIndex: "options",
      key: "options",
      render: (options) => (
        <div>
          {options.map((option, index) => (
            <Tag
              key={index}
              style={{ margin: "2px" }}
              color={
                option.status === "approved"
                  ? "success"
                  : option.status === "rejected"
                  ? "error"
                  : "default"
              }
            >
              {option.value}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusConfig = {
          pending: { color: "warning", text: "Pending" },
          approved: { color: "success", text: "Approved" },
          rejected: { color: "error", text: "Rejected" },
          in_progress: {
            color: "processing",
            text: "In Progress",
          },
          partially_processed: {
            color: "success",
            text: "Processed",
          },
        };
        return (
          <Badge
            status={statusConfig[status]?.color}
            text={statusConfig[status]?.text}
          />
        );
      },
      filters: [
        { text: "Pending", value: "pending" },
        { text: "Approved", value: "approved" },
        { text: "Rejected", value: "rejected" },
        { text: "In Progress", value: "in_progress" },
        { text: "Processed", value: "partially_processed" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Requested By",
      key: "user",
      render: (_, record) => (
        <Button
          type="link"
          icon={<UserOutlined />}
          onClick={() => handleUserClick(record)}
        >
          View User
        </Button>
      ),
    },
    {
      title: "Requested At",
      render: (text, record) => {
        return helper.ISTDate(record.updatedAt);
      },
      key: "updatedAt",
      sorter: (a, b) => moment(a.updatedAt).unix() - moment(b.updatedAt).unix(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip
            title={
              !isSuperAdmin(userRole.role) &&
              hasPermission(userRole.role, "view_all")
                ? "You don't have permission to review options"
                : ""
            }
          >
            <Button
              disabled={
                !isSuperAdmin(userRole.role) &&
                hasPermission(userRole.role, "view_all")
              }
              type="primary"
              onClick={() => {
                mapOptionStatuses(record.options);
                setCurrentRequest(record);
                setOptionsModalVisible(true);
              }}
            >
              Review Options
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
        <Breadcrumb.Item>Business Flow</Breadcrumb.Item>
        <Breadcrumb.Item>Requested Services</Breadcrumb.Item>
      </Breadcrumb>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="User Details"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button
            key="close"
            type="primary"
            onClick={() => setModalVisible(false)}
          >
            Close
          </Button>,
        ]}
      >
        {selectedRequest && (
          <>
            <Descriptions bordered column={1} size="middle">
              <Descriptions.Item label="Business Name">
                {selectedRequest.business_name}
              </Descriptions.Item>
              <Descriptions.Item label="Username">
                {selectedRequest.username}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedRequest.email}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {`+${selectedRequest.country_code}${selectedRequest.phone}`}
              </Descriptions.Item>
              <Descriptions.Item label="Whatsapp">
                {`+${selectedRequest.whatsapp_country_code}${selectedRequest.whatsapp_no}`}
              </Descriptions.Item>
              <Descriptions.Item label="Country">
                {selectedRequest.country}
              </Descriptions.Item>
              {selectedRequest.city && (
                <Descriptions.Item label="City">
                  {selectedRequest.city}
                </Descriptions.Item>
              )}
            </Descriptions>
            <Divider />
          </>
        )}
      </Modal>

      <Modal
        title="Review Options"
        open={optionsModalVisible}
        onCancel={() => setOptionsModalVisible(false)}
        onOk={() =>
          handleOptionUpdate(currentRequest?._id, currentRequest?.status)
        }
        width={600}
      >
        {currentRequest && (
          <List
            dataSource={currentRequest.options}
            renderItem={(option, index) => (
              <List.Item>
                <div style={{ width: "100%" }}>
                  <div style={{ marginBottom: 8 }}>
                    <Text strong>Option {index + 1}:</Text> {option.value}
                  </div>
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Radio.Group
                      onChange={(e) => {
                        setOptionStatuses({
                          ...optionStatuses,
                          [index]: e.target.value,
                        });
                      }}
                      value={optionStatuses[index]}
                    >
                      <Radio
                        value="approved"
                        disabled={
                          option.status === "approved" ||
                          option.status === "rejected"
                        }
                      >
                        Approve
                      </Radio>
                      <Radio
                        value="rejected"
                        disabled={
                          option.status === "approved" ||
                          option.status === "rejected"
                        }
                      >
                        Reject
                      </Radio>
                    </Radio.Group>
                    {/* {optionStatuses[index] === "rejected" && (
                      <Input
                        placeholder="Feedback for rejection (optional)"
                        onChange={(e) => {
                          setOptionFeedback({
                            ...optionFeedback,
                            [index]: e.target.value,
                          });
                        }}
                        value={optionFeedback[index]}
                      />
                    )} */}
                  </Space>
                </div>
              </List.Item>
            )}
          />
        )}
      </Modal>
    </div>
  );
};

export default BusinessCustomOptionsAdmin;
