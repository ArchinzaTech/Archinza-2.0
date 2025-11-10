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
  Input,
  Form,
  message,
} from "antd";
import { Table } from "ant-table-extensions";
import http from "../../helpers/http";
import helper from "../../helpers/helper";
import config from "../../config/config";
import moment from "moment";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import { hasPermission, isSuperAdmin } from "../../helpers/permissions";

function FeedbackTopics() {
  const [loading, setloading] = useState(false);
  const [datas, setDatas] = useState([]);
  const [data, setData] = useState({});
  const [drawerOpen, setdraweropen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTopic, setNewTopic] = useState("");
  const [editTopicId, setEditTopicId] = useState(null);
  const [form] = Form.useForm();
  const token = localStorage.getItem(config.jwt_store_key);
  const userRole = jwtDecode(token);

  const moduleNamePural = "Feedback Topics";
  const base_url = config.api_url + "admin/feedbacks/topics";

  const fetchDatas = async () => {
    setloading(true);
    const data = await http.get(base_url);

    if (data) {
      setDatas(data.data);
    }
    setloading(false);
  };

  const filteredDatas = datas.filter((item) =>
    item.topic.toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    fetchDatas();
  }, []);

  const handleAddTopic = async () => {
    try {
      const values = await form.validateFields();
      setloading(true);
      const response = editTopicId
        ? await http.put(`${base_url}/${editTopicId}`, { topic: values.topic })
        : await http.post(base_url, { topic: values.topic });
      if (response?.data) {
        message.success(
          editTopicId
            ? "Topic Updated Successfully"
            : "Topic Added Successfully"
        );
        setNewTopic("");
        setIsModalVisible(false);
        setEditTopicId(null);
        fetchDatas();
      }
      setloading(false);
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.message || "Operation failed");
      }
    }
  };

  const handleEdit = (record) => {
    setEditTopicId(record._id);
    form.setFieldsValue({ topic: record.topic });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    setloading(true);
    const response = await http.delete(`${base_url}/${id}`);

    if (response) {
      notification["success"]({
        message: `Topic Deleted Successfully`,
      });
      //   await http.post(`${config.api_url}admin/logs`, {
      //     user: userRole.id,
      //     action_type: "DELETE",
      //     module: "Personal",
      //     subModule: "Newsletters",
      //     details: id,
      //     status: "SUCCESS",
      //   });
      fetchDatas();
      setloading(false);
    } else {
      //   await http.post(`${config.api_url}admin/logs`, {
      //     user: userRole.id,
      //     action_type: "DELETE",
      //     module: "Personal",
      //     subModule: "Newsletters",
      //     details: id,
      //     status: "FAILURE",
      //   });
    }
  };

  const showDeleteConfirm = (id) => {
    Modal.confirm({
      title: `Are you sure you want to delete this topic?`,
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

  const columns = [
    {
      title: "Topic",
      dataIndex: "topic",
      key: "topic",
      sorter: (a, b) => a.topic?.localeCompare(b.topic),
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
        <Space>
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
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
            <Card title={moduleNamePural} bordered={false}>
              <Space direction="horizontal" size="middle">
                <Button
                  type="primary"
                  onClick={() => setIsModalVisible(true)}
                  // style={{ marginBottom: 16 }}
                >
                  Add Topic
                </Button>
                <Input
                  placeholder="Search topics"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 500 }}
                />
              </Space>
              <Table
                rowKey={(record) => record._id}
                columns={columns}
                dataSource={filteredDatas}
                loading={loading}
              />
            </Card>
            <Modal
              title={editTopicId ? "Edit Topic" : "Add New Topic"}
              visible={isModalVisible}
              onOk={handleAddTopic}
              onCancel={() => {
                setIsModalVisible(false);
                form.resetFields();
                setEditTopicId(null);
              }}
              confirmLoading={loading}
            >
              <Form form={form} layout="vertical">
                <Form.Item
                  name="topic"
                  label="Topic Name"
                  rules={[
                    {
                      required: true,
                      message: "Please enter a topic name",
                    },
                  ]}
                >
                  <Input placeholder="Enter topic name" />
                </Form.Item>
              </Form>
            </Modal>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default FeedbackTopics;
