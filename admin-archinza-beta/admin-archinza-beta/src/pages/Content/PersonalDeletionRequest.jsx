import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Tag,
  Space,
  Breadcrumb,
  Descriptions,
  message,
  Tooltip,
} from "antd";
import { UserOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import http from "../../helpers/http";
import config from "../../config/config";
import moment from "moment";
import { jwtDecode } from "jwt-decode";
import { hasPermission, isSuperAdmin } from "../../helpers/permissions";
import helper from "../../helpers/helper";

const PersonalDeletionRequests = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [adminModalVisible, setAdminModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const token = localStorage.getItem(config.jwt_store_key);
  const userRole = jwtDecode(token);

  const baseUrl = config.api_url;

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data } = await http.get(
        `${baseUrl}admin/content/options/deletion-requests`
      );
      setData(data || []);
    } catch (err) {
      message.error("Failed to fetch deletion requests");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUserClick = async (userId) => {
    setLoading(true);
    try {
      const user = data?.find((it) => it?.user?._id === userId);
      setSelectedUser(user?.user);
      setUserModalVisible(true);
    } catch (err) {
      message.error("Failed to fetch user details");
    }
    setLoading(false);
  };

  const handleAdminClick = async (adminId) => {
    setLoading(true);
    try {
      const adminUser = data?.find((it) => it?.role_user?._id === adminId);

      setSelectedAdmin(adminUser?.role_user);
      setAdminModalVisible(true);
    } catch (err) {
      message.error("Failed to fetch admin details");
    }
    setLoading(false);
  };

  const handleAction = (record, action) => {
    Modal.confirm({
      title: `${action === "approve" ? "Approve" : "Reject"} Deletion Request`,
      content: (
        <span>
          This user data will be{" "}
          <b>{action === "approve" ? "deleted permanently" : "kept"}</b>. Do you
          wish to continue?
        </span>
      ),
      okText: "Yes, Continue",
      cancelText: "Cancel",
      okType: action === "approve" ? "danger" : "default",
      onOk: async () => {
        try {
          setLoading(true);

          const response = await http.put(
            `${baseUrl}admin/content/options/deletion-requests/${record?.user?._id}`,
            { action }
          );
          console.log(response);
          if (response?.data) {
            message.success(
              `Request ${
                action === "approve" ? "approved and user deleted" : "rejected"
              }`
            );
            await http.post(`${config.api_url}admin/logs`, {
              user: userRole.id,
              action_type: "EDIT",
              module: "Personal",
              subModule: "Requested Deletions",
              details: {
                status: action,
                user: helper.captureBasicUserDetailsPersonal([record?.user]),
              },
              status: "SUCCESS",
            });
          } else {
            await http.post(`${config.api_url}admin/logs`, {
              user: userRole.id,
              action_type: "EDIT",
              module: "Personal",
              subModule: "Requested Deletions",
              details: {
                status: action,
                user: helper.captureBasicUserDetailsPersonal(record?.user),
              },
              status: "FAILURE",
            });
          }
          fetchRequests();
        } catch (err) {
          console.log(err);
          message.error("Failed to update request");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const columns = [
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "default";
        if (status === "pending") color = "orange";
        if (status === "approved") color = "green";
        if (status === "rejected") color = "red";
        return <Tag color={color}>{status?.toUpperCase()}</Tag>;
      },
    },
    {
      title: "User",
      dataIndex: ["user", "_id"],
      key: "user",
      render: (_, record) => (
        <Button
          type="link"
          icon={<UserOutlined />}
          onClick={() => handleUserClick(record.user?._id)}
        >
          View User
          {/* {record.user?.name || record.user?._id} */}
        </Button>
      ),
    },
    {
      title: "Request By",
      dataIndex: ["role_user", "_id"],
      key: "role_user",
      render: (_, record) => (
        <Button
          type="link"
          icon={<UserOutlined />}
          onClick={() => handleAdminClick(record.role_user?._id)}
        >
          View Admin
          {/* {record.role_user?.name || record.role_user?._id} */}
        </Button>
      ),
    },
    {
      title: "Requested At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => moment(text).format("YYYY-MM-DD HH:mm"),
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
                ? "You don't have permission to approve"
                : ""
            }
          >
            <Button
              type="primary"
              danger
              disabled={
                record.status !== "pending" ||
                (!isSuperAdmin(userRole.role) &&
                  hasPermission(userRole.role, "view_all"))
              }
              onClick={() => handleAction(record, "approved")}
            >
              Approve
            </Button>
          </Tooltip>
          <Tooltip
            title={
              !isSuperAdmin(userRole.role) &&
              hasPermission(userRole.role, "view_all")
                ? "You don't have permission to reject"
                : ""
            }
          >
            <Button
              disabled={
                record.status !== "pending" ||
                (!isSuperAdmin(userRole.role) &&
                  hasPermission(userRole.role, "view_all"))
              }
              onClick={() => handleAction(record, "rejected")}
            >
              Reject
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
        <Breadcrumb.Item>Personal Flow</Breadcrumb.Item>
        <Breadcrumb.Item>Deletion Requests</Breadcrumb.Item>
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
        open={userModalVisible}
        onCancel={() => setUserModalVisible(false)}
        footer={null}
      >
        {selectedUser && (
          <Descriptions bordered column={1} size="middle">
            <Descriptions.Item label="Name">
              {selectedUser.name}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {selectedUser.email}
            </Descriptions.Item>
            <Descriptions.Item label="User Type">
              {selectedUser.user_type}
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              {selectedUser.country_code + selectedUser.phone}
            </Descriptions.Item>
            <Descriptions.Item label="Whatsapp">
              {selectedUser.whatsapp_country_code + selectedUser.whatsapp_no}
            </Descriptions.Item>
            <Descriptions.Item label="Country">
              {selectedUser.country}
            </Descriptions.Item>
            {selectedUser.city && (
              <Descriptions.Item label="City">
                {selectedUser.city}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>

      <Modal
        title="Admin Details"
        open={adminModalVisible}
        onCancel={() => setAdminModalVisible(false)}
        footer={null}
      >
        {selectedAdmin && (
          <Descriptions bordered column={1} size="middle">
            <Descriptions.Item label="Name">
              {selectedAdmin.name}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {selectedAdmin.email}
            </Descriptions.Item>
            <Descriptions.Item label="Role">
              {selectedAdmin.role?.name || selectedAdmin.role}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default PersonalDeletionRequests;
