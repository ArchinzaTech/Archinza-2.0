import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Typography,
  Select,
  DatePicker,
  Tag,
  message,
  Descriptions,
  Breadcrumb,
  Row,
  Col,
  Card,
} from "antd";
import { UserOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import http from "../../helpers/http"; // Assuming http helper is available
import config from "../../config/config"; // Assuming base_url is available
import { hasPermission } from "../../helpers/permissions"; // Assuming permission helper is available
import { jwtDecode } from "jwt-decode";
import helper from "../../helpers/helper";
import moment from "moment";
import { CSVLink } from "react-csv";

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [userModalVisible, setUserModalVisible] = useState(false);

  const ACTION_TYPE_OPTIONS = [
    { label: "Create", value: "CREATE" },
    { label: "Edit", value: "EDIT" },
    { label: "Delete", value: "DELETE" },
    { label: "Bulk Create", value: "BULK_CREATE" },
    { label: "Bulk Delete", value: "BULK_DELETE" },
    { label: "Request Delete", value: "REQUEST_DELETE" },
    { label: "Approve Delete", value: "APPROVE_DELETE" },
  ];

  const MODULE_OPTIONS = [
    {
      label: "Personal - Registered Users",
      value: "Personal - Registered Users",
    },
    {
      label: "Personal - Onboarding Datatypes",
      value: "Personal - Onboarding Datatypes",
    },
    {
      label: "Personal - Requested Datatypes",
      value: "Personal - Requested Datatypes",
    },
    {
      label: "Personal - Requested Deletions",
      value: "Personal - Requested Deletions",
    },
    { label: "Personal - Newsletters", value: "Personal - Newsletters" },
    {
      label: "Business - Registered Users",
      value: "Business - Registered Users",
    },
    {
      label: "Business - Onboarding Datatypes",
      value: "Business - Onboarding Datatypes",
    },
    {
      label: "Business - Requested Services",
      value: "Business - Requested Services",
    },
    {
      label: "Business - Onboarding Service",
      value: "Business - Onboarding Service",
    },
    {
      label: "Business - Requested User Edits",
      value: "Business - Requested User Edits",
    },
    {
      label: "Business - Requested Verifications",
      value: "Business - Requested Verifications",
    },
    {
      label: "Business - Requested Deletions",
      value: "Business - Requested Deletions",
    },
  ];
  const [filters, setFilters] = useState({});
  const [userRole, setUserRole] = useState({});
  const base_url = config.api_url;

  useEffect(() => {
    const token = localStorage.getItem(config.jwt_store_key);
    if (token) {
      setUserRole(jwtDecode(token));
    }
    fetchLogs();
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [filters, pagination.current, pagination.pageSize]);

  const filteredLogs = logs.filter((log) => {
    let matchesActionType = true;
    let matchesDateRange = true;
    let matchesModule = true;

    if (filters.action_type) {
      matchesActionType = log.action_type === filters.action_type;
    }

    if (filters.dateRange) {
      const [startDate, endDate] = JSON.parse(filters.dateRange).map(
        (d) => new Date(d)
      );
      const logDate = new Date(log.createdAt);
      matchesDateRange = logDate >= startDate && logDate <= endDate;
    }

    if (filters.module) {
      const logModule = log.subModule
        ? `${log.module} - ${log.subModule}`
        : log.module;
      matchesModule = logModule === filters.module;
    }

    return matchesActionType && matchesDateRange && matchesModule;
  });

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: pagination.current,
        limit: pagination.pageSize,
      });
      const response = await http.get(
        `${base_url}admin/logs?${queryParams.toString()}`
      );
      setLogs(response.data);
      setPagination({
        ...pagination,
        total: response.data.totalCount,
      });
    } catch (error) {
      console.error("Error fetching logs:", error);
      Modal.error({
        title: "Error",
        content: "Failed to fetch logs. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const csvData = filteredLogs.map((log) => ({
      Admin: log.user?.name || log.user?.email || "Unknown",
      "Action Type": log.action_type,
      Module: log.subModule ? `${log.module} - ${log.subModule}` : log.module,
      Status: log.status,
      Metadata: log.details, // Pass raw details object
      "Logged At": helper.ISTDate(log.createdAt),
    }));

    const headers = [
      { label: "Admin", key: "Admin" },
      { label: "Action Type", key: "Action Type" },
      { label: "Module", key: "Module" },
      { label: "Status", key: "Status" },
      { label: "Metadata", key: "Metadata" },
      { label: "Logged At", key: "Logged At" },
    ];

    const csvString = toCSV(csvData, headers);
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "logs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toCSV = (data, headers) => {
    const escapeCSV = (value) => {
      if (value === null || value === undefined) return "";
      const str = String(value)
        .replace(/"/g, '""')
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r");
      return `"${str}"`;
    };

    const headerRow = headers.map((h) => escapeCSV(h.label)).join(",");
    const dataRows = data.map((row) =>
      headers
        .map((h) => {
          if (h.key === "Metadata") {
            return escapeCSV(JSON.stringify(row[h.key]));
          }
          return escapeCSV(row[h.key]);
        })
        .join(",")
    );
    return [headerRow, ...dataRows].join("\n");
  };
  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(pagination);
    setFilters({
      ...filters,
      ...(sorter.order && { sort: `${sorter.field}:${sorter.order}` }),
    });
  };

  const handleFilterChange = (key, value) => {
    console.log(key, value);
    // setLogs()
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleUserClick = async (userId) => {
    setLoading(true);
    try {
      const log = logs?.find((it) => it?.user?._id === userId);
      setSelectedUser(log?.user);
      setUserModalVisible(true);
    } catch (err) {
      message.error("Failed to fetch user details");
    }
    setLoading(false);
  };

  const handleViewUser = (userId) => {
    // Placeholder for viewing user details
    Modal.info({
      title: "View User Details",
      content: `Showing details for user ID: ${userId}. This will be implemented later.`, // Replace with actual user detail fetching and display
    });
  };

  const handleDeleteLog = (logId) => {
    Modal.confirm({
      title: "Delete Log Entry",
      content: "Are you sure you want to delete this log entry?",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        try {
          setLoading(true);
          await http.delete(`${base_url}admin/logs/${logId}`); // Assuming a DELETE endpoint for logs
          Modal.success({
            title: "Success",
            content: "Log entry deleted successfully.",
          });
          fetchLogs();
        } catch (error) {
          console.error("Error deleting log:", error);
          Modal.error({
            title: "Error",
            content: "Failed to delete log entry. Please try again.",
          });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const showDetailsModal = (record) => {
    const { details, action_type, resource } = record;
    console.log(details?.changes);
    let content = null;

    // if (action_type === "EDIT" && details?.changes) {
    //   content = (
    //     <div>
    //       <h4>Changes Made:</h4>
    //       {details.changes.map((change, index) => (
    //         <div key={index} style={{ marginBottom: 8 }}>
    //           <strong>{change.field}:</strong> {change.oldValue} →{" "}
    //           {change.newValue}
    //         </div>
    //       ))}
    //     </div>
    //   );
    // } else if (action_type.startsWith("BULK_") && details?.bulk_summary) {
    //   const { bulk_summary } = details;
    //   content = (
    //     <Descriptions bordered column={1}>
    //       <Descriptions.Item label="Total Attempted">
    //         {bulk_summary.total_attempted}
    //       </Descriptions.Item>
    //       <Descriptions.Item label="Successful">
    //         {bulk_summary.successful}
    //       </Descriptions.Item>
    //       <Descriptions.Item label="Failed">
    //         {bulk_summary.failed}
    //       </Descriptions.Item>
    //       {bulk_summary.failed_items && (
    //         <Descriptions.Item label="Errors">
    //           {bulk_summary.failed_items.join(", ")}
    //         </Descriptions.Item>
    //       )}
    //     </Descriptions>
    //   );
    // } else {
    // }
    content = <pre>{JSON.stringify(details, null, 2)}</pre>;

    Modal.info({
      title: `${action_type} Details`,
      content,
      width: 600,
    });
  };

  const columns = [
    {
      title: "Admin",
      dataIndex: ["user", "name"],
      key: "user",
      render: (text, record) => (
        <Button
          type="link"
          icon={<UserOutlined />}
          onClick={() => handleUserClick(record.user?._id)}
        >
          {record.user?.name || record.user?.email || "Unknown"}
        </Button>
      ),
    },
    {
      title: "Action Type",
      dataIndex: "action_type",
      key: "action_type",
      render: (text) => {
        const color =
          {
            CREATE: "green",
            EDIT: "blue",
            DELETE: "red",
            BULK_CREATE: "cyan",
            BULK_DELETE: "magenta",
            BULK_DELETE_REQUEST: "purple",
            REQUEST_DELETE: "orange",
          }[text] || "default";

        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Module",
      dataIndex: "module",
      key: "module",
      render: (text, record) =>
        record.subModule
          ? `${record.module} - ${record.subModule}`
          : record.module,
    },
    // {
    //   title: "Resource",
    //   key: "resource",
    //   render: (_, record) => {
    //     const { resource } = record;
    //     if (!resource) return "N/A";

    //     if (resource.count > 1) {
    //       return (
    //         <Tag color="purple">
    //           {resource.count} {resource.type}(s)
    //         </Tag>
    //       );
    //     }
    //     return <Tag>{resource.type}</Tag>;
    //   },
    // },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => {
        const color =
          {
            SUCCESS: "green",
            FAILURE: "red",
            PARTIAL: "orange",
            PENDING: "blue",
          }[text] || "default";

        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Metadata",
      key: "details",
      render: (_, record) => (
        <Button type="link" onClick={() => showDetailsModal(record)}>
          View Metadata
        </Button>
      ),
    },
    {
      title: "Logged At",
      render: (text, record) => {
        return helper.ISTDate(record.createdAt);
      },
      key: "createdAt",
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
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
            title: "Logs",
          },
        ]}
      />
      <Row>
        <Col span={24}>
          <div className="site-card-border-less-wrapper">
            <Card
              title={"Logs"}
              bordered={false}
              // extra={
              //   selectedRowKeys.length > 0 && (
              //     <Button danger onClick={handleBulkDelete}>
              //       Delete Selected ({selectedRowKeys.length})
              //     </Button>
              //   )
              // }
            >
              <div
                style={{
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Space style={{ marginBottom: 16 }}>
                  <Button type="primary" onClick={handleExport}>
                    Export to CSV
                  </Button>
                  <RangePicker
                    onChange={(dates) =>
                      handleFilterChange(
                        "dateRange",
                        dates
                          ? JSON.stringify(dates.map((d) => d.toISOString()))
                          : undefined
                      )
                    }
                  />
                  <Select
                    placeholder="Filter by Action Type"
                    onChange={(value) =>
                      handleFilterChange("action_type", value)
                    }
                    allowClear
                    style={{ width: 200 }}
                  >
                    {ACTION_TYPE_OPTIONS.map((option) => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                  <Select
                    placeholder="Filter by Module"
                    onChange={(value) => handleFilterChange("module", value)}
                    allowClear
                    style={{ width: 200 }}
                  >
                    {MODULE_OPTIONS.map((option) => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                  {/* Add more filter options as needed */}
                </Space>
              </div>

              <Table
                columns={columns}
                dataSource={filteredLogs}
                rowKey="_id"
                loading={loading}
                pagination={pagination}
                onChange={handleTableChange}
              />
            </Card>
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
                  <Descriptions.Item label="Role">
                    {selectedUser?.role?.name}
                  </Descriptions.Item>
                </Descriptions>
              )}
            </Modal>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Logs;
