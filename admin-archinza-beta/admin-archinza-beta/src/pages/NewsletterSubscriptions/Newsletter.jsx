import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  Row,
  Col,
  Card,
  Tooltip,
  Descriptions,
  Drawer,
  Button,
  Space,
  Modal,
  notification,
} from "antd";
import { Table } from "ant-table-extensions";
import http from "../../helpers/http";
import helper from "../../helpers/helper";
import config from "../../config/config";
import moment from "moment";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import { hasPermission, isSuperAdmin } from "../../helpers/permissions";

function Newsletter() {
  const [loading, setloading] = useState(false);
  const [datas, setDatas] = useState([]);
  const [data, setData] = useState({});
  const [drawerOpen, setdraweropen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const token = localStorage.getItem(config.jwt_store_key);
  const userRole = jwtDecode(token);

  const moduleNamePural = "Newsletter Leads";
  const base_url = config.api_url + "forms/newsletter";

  const fetchDatas = async () => {
    setloading(true);
    const data = await http.get(base_url);

    if (data) {
      setDatas(data.data);
    }
    setloading(false);
  };

  useEffect(() => {
    fetchDatas();
  }, []);

  const handleDelete = async (id) => {
    setloading(true);
    const response = await http.delete(`${base_url}/${id}`);

    if (response) {
      notification["success"]({
        message: `Leads Deleted Successfully`,
      });
      await http.post(`${config.api_url}admin/logs`, {
        user: userRole.id,
        action_type: "DELETE",
        module: "Personal",
        subModule: "Newsletters",
        details: id,
        status: "SUCCESS",
      });
      fetchDatas();
      setloading(false);
    } else {
      await http.post(`${config.api_url}admin/logs`, {
        user: userRole.id,
        action_type: "DELETE",
        module: "Personal",
        subModule: "Newsletters",
        details: id,
        status: "FAILURE",
      });
    }
  };

  const handleBulkDelete = async () => {
    Modal.confirm({
      title: `Are you sure you want to delete ${selectedRowKeys.length} selected items?`,
      icon: <ExclamationCircleOutlined />,
      content: "",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        setloading(true);
        try {
          await Promise.all(
            selectedRowKeys.map((id) => http.delete(`${base_url}/${id}`))
          );
          notification["success"]({
            message: `Leads Deleted Successfully`,
          });
          setSelectedRowKeys([]);
          fetchDatas();
        } finally {
          setloading(false);
        }
      },
    });
  };

  const showDeleteConfirm = (id) => {
    Modal.confirm({
      title: `Are you sure you want to delete this ${moduleNamePural}?`,
      icon: <ExclamationCircleOutlined />,
      content: "",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",

      onOk() {
        return handleDelete(id);
      },
      onCancel() {},
    });
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
    // checkStrictly: true,
  };

  const fields = {
    email: "Email",
    createdAt: {
      header: "Created At",
      formatter: (_fieldValue, record) => {
        return helper.ISTDate(record.createdAt);
      },
    },
  };

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email?.localeCompare(b.email),
    },
    {
      title: "Created At",
      render: (text, record) => {
        return helper.ISTDate(record.createdAt);
      },
      key: "createdAt",
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
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
              type="primary"
              danger
              onClick={() => {
                showDeleteConfirm(record._id);
              }}
            >
              Delete
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
        <Breadcrumb.Item>{moduleNamePural}</Breadcrumb.Item>
      </Breadcrumb>

      <Row>
        <Col span={24}>
          <div className="site-card-border-less-wrapper">
            <Card
              title={moduleNamePural}
              bordered={false}
              extra={
                selectedRowKeys.length > 0 && (
                  <Button type="primary" danger onClick={handleBulkDelete}>
                    Delete Selected ({selectedRowKeys.length})
                  </Button>
                )
              }
            >
              <Table
                rowKey={(record) => record._id}
                rowSelection={rowSelection}
                columns={columns}
                dataSource={datas}
                loading={loading}
                exportableProps={
                  !isSuperAdmin(userRole.role) &&
                  hasPermission(userRole.role, "view_all")
                    ? undefined
                    : {
                        showColumnPicker: false,
                        fields,
                        fileName: moduleNamePural,
                      }
                }
                searchable
              />
            </Card>
            {/* 
            <Drawer
              title="Lead Details"
              placement="right"
              onClose={handleDrawerClose}
              visible={drawerOpen}
              size="large"
              width={1000}
            >
              {data && (
                <Descriptions
                  bordered
                  column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
                  size="small"
                >
                  <Descriptions.Item label="Name">
                    {data.name || "NA"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Phone">
                    {data.phone || "NA"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    {data.email || "NA"}
                  </Descriptions.Item>

                  <Descriptions.Item label="message">
                    {data.message || "NA"}
                  </Descriptions.Item>

                  <Descriptions.Item label="Created At">
                    {helper.ISTDate(data.createdAt)}
                  </Descriptions.Item>
                </Descriptions>
              )}
            </Drawer> */}
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Newsletter;
