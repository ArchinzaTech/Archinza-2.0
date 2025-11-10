import React, { useEffect, useState } from "react";
// import tinymce from "tinymce/tinymce";
import {
  Breadcrumb,
  Row,
  Col,
  Card,
  Form,
  Input,
  notification,
  Upload,
  Button,
  Spin,
  Image,
} from "antd";

import _ from "lodash";
import http from "../../helpers/http";
import config from "../../config/config";
import {
  EditOutlined,
  DownloadOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import Logo from "../../upgrad-logo.svg";

import Joi from "joi";
import helper from "../../helpers/helper";
function Homepage() {
  const [editOpen, setEditOpen] = useState(false);
  const [formError, setFormError] = useState({});
  const [data, setData] = useState({});
  const [loading, setloading] = useState(false);
  const [btnloading, setbtnloading] = useState(false);
  const [isHelpShow, setIsHelpShow] = useState(false);

  //createKey and editKey is used to reset modal data on close

  const [editKey, seteditKey] = useState(Math.random() * 10);

  const moduleName = "Homepage Content";
  const moduleNamePural = "Homepage Content";
  const base_url = config.api_url + "admin/content/homepage"; //without trailing slash
  const image_url = config.api_url + "uploads/content/homepage/"; //with trailing slash

  const sizeLimit = config.sizeLimit;

  const allowedExtensions = ["application/pdf"];
  const joiOptions = config.joiOptions;

  const { TextArea } = Input;

  const schema = Joi.object({}).options({ allowUnknown: true });

  const validate = async (value) => {
    const { error } = schema.validate(value, joiOptions);

    const errors = {};

    if (error) {
      error.details.map((field) => {
        errors[field.path[0]] = field.message;
        return true;
      });
    }

    helper.validateSize("brochure", value.brochure, sizeLimit, errors);
    helper.validateExt("brochure", value.brochure, allowedExtensions, errors);

    return errors ? errors : null;
  };

  const handleSubmit = async (value) => {
    let errors = await validate(value);

    setFormError(errors);

    if (Object.keys(errors).length) {
      return;
    }

    setbtnloading(true);
    let formData = new FormData();
    for (const [key, data] of Object.entries(_.omit(value, ["brochure"]))) {
      formData.append(key, data || "");
    }

    if (value.brochure) {
      formData.append("brochure", value.brochure.file);
    }

    const { data } = await http.put(base_url, formData);

    if (data) {
      notification["success"]({
        message: `${moduleName} Updated Successfully`,
      });
      setbtnloading(false);
      form.resetFields();
      fetchData();
    }
  };

  const fetchData = async (id) => {
    setloading(true);
    const { data } = await http.get(base_url);

    if (data) {
      setData(data);
    }
    setloading(false);
  };

  const handleEditClose = () => {
    seteditKey((state) => {
      return state + Math.random() * 2;
    });
    setData({});
    setEditOpen(false);
  };

  const [form] = Form.useForm();
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    form.setFieldsValue(data);
  }, [data]);

  if (loading) {
    return (
      <div style={{ textAlign: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

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
              bordered={true}
              // extra={
              //   <QuestionCircleOutlined onClick={() => setIsHelpShow(true)} />
              // }
              // style={{ boxShadow: "10px 0px 15px rgba(0,0,0,0.1)" }}
            >
              <Row style={{ marginBottom: "20px" }}></Row>

              <Form
                form={form}
                onFinish={handleSubmit}
                // labelCol={{ span: 8 }}
                // wrapperCol={{ span: 16 }}
                layout="vertical"
              >
                <Row gutter={16}>
                  <Col xs={24} md={24}>
                    <Form.Item
                      required
                      label="Brochure:"
                      name="brochure"
                      {...(formError.brochure && {
                        help: formError.brochure,
                        validateStatus: "error",
                      })}
                    >
                      <Upload
                        beforeUpload={(file) => {
                          return false;
                        }}
                        maxCount={1}
                        listType="text"
                        showUploadList={{
                          showPreviewIcon: false,
                          showRemoveIcon: false,
                          showDownloadIcon: true,
                          downloadIcon: <DownloadOutlined />,
                        }}
                        defaultFileList={[
                          {
                            // status: "done",
                            url: image_url + data.brochure,
                            name: data.brochure,
                          },
                        ]}
                      >
                        <Button icon={<EditOutlined />}>Select File</Button>
                      </Upload>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <Form.Item
                    // wrapperCol={{ offset: 8, span: 16 }}
                    >
                      <Button
                        type="danger"
                        htmlType="submit"
                        loading={btnloading}
                      >
                        Update
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Homepage;
