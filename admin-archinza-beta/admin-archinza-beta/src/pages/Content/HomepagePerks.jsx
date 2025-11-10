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
function Homepage() {
  const [editOpen, setEditOpen] = useState(false);
  const [formError, setFormError] = useState({});
  const [data, setData] = useState({});
  const [loading, setloading] = useState(false);
  const [btnloading, setbtnloading] = useState(false);
  const [isHelpShow, setIsHelpShow] = useState(false);

  //createKey and editKey is used to reset modal data on close

  const [editKey, seteditKey] = useState(Math.random() * 10);

  const moduleName = "Homepage Perks";
  const moduleNamePural = "Homepage Perks";
  const base_url = config.api_url + "admin/content/homepage-perks"; //without trailing slash
  const image_url = config.api_url + "uploads/content/homepage-perks/"; //with trailing slash
  const sizeLimit = 10;

  const { TextArea } = Input;

  const schema = Joi.object({}).options({ allowUnknown: true });

  const validate = async (value) => {
    const { error } = schema.validate(value, {
      abortEarly: false,
      allowUnknown: true,
      errors: {
        wrap: {
          label: "",
        },
      },
    });

    const errors = {};

    if (error) {
      error.details.map((field) => {
        errors[field.path[0]] = field.message;
        return true;
      });
    }

    

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
    for (const [key, data] of Object.entries(_.omit(value, ["stockGraph"]))) {
      formData.append(key, data || "");
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
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="First Perk Title:"
                      name="first_perk_title"
                      {...(formError.first_perk_title && {
                        help: formError.first_perk_title,
                        validateStatus: "error",
                      })}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="First Perk Sub Title:"
                      name="first_perk_subtitle"
                      {...(formError.first_perk_subtitle && {
                        help: formError.first_perk_subtitle,
                        validateStatus: "error",
                      })}
                    >
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item
                      label="First Perk Description:"
                      name="first_perk_desc"
                      {...(formError.first_perk_desc && {
                        help: formError.first_perk_desc,
                        validateStatus: "error",
                      })}
                    >
                      <TextArea rows={5} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Second Perk Title:"
                      name="second_perk_title"
                      {...(formError.second_perk_title && {
                        help: formError.second_perk_title,
                        validateStatus: "error",
                      })}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Second Perk Sub Title:"
                      name="second_perk_subtitle"
                      {...(formError.second_perk_subtitle && {
                        help: formError.second_perk_subtitle,
                        validateStatus: "error",
                      })}
                    >
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Second Perk Description:"
                      name="second_perk_desc"
                      {...(formError.second_perk_desc && {
                        help: formError.second_perk_desc,
                        validateStatus: "error",
                      })}
                    >
                      <TextArea rows={5} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Third Perk Title:"
                      name="third_perk_title"
                      {...(formError.third_perk_title && {
                        help: formError.third_perk_title,
                        validateStatus: "error",
                      })}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Third Perk Sub Title:"
                      name="third_perk_subtitle"
                      {...(formError.third_perk_subtitle && {
                        help: formError.third_perk_subtitle,
                        validateStatus: "error",
                      })}
                    >
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Third Perk Description:"
                      name="third_perk_desc"
                      {...(formError.third_perk_desc && {
                        help: formError.third_perk_desc,
                        validateStatus: "error",
                      })}
                    >
                      <TextArea rows={5} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="fourth Perk Title:"
                      name="fourth_perk_title"
                      {...(formError.fourth_perk_title && {
                        help: formError.fourth_perk_title,
                        validateStatus: "error",
                      })}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="fourth Perk Sub Title:"
                      name="fourth_perk_subtitle"
                      {...(formError.fourth_perk_subtitle && {
                        help: formError.fourth_perk_subtitle,
                        validateStatus: "error",
                      })}
                    >
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item
                      label="fourth Perk Description:"
                      name="fourth_perk_desc"
                      {...(formError.fourth_perk_desc && {
                        help: formError.fourth_perk_desc,
                        validateStatus: "error",
                      })}
                    >
                      <TextArea rows={5} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Fifth Perk Title:"
                      name="fifth_perk_title"
                      {...(formError.fifth_perk_title && {
                        help: formError.fifth_perk_title,
                        validateStatus: "error",
                      })}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Fifth Perk Sub Title:"
                      name="fifth_perk_subtitle"
                      {...(formError.fifth_perk_subtitle && {
                        help: formError.fifth_perk_subtitle,
                        validateStatus: "error",
                      })}
                    >
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Fifth Perk Description:"
                      name="fifth_perk_desc"
                      {...(formError.fifth_perk_desc && {
                        help: formError.fifth_perk_desc,
                        validateStatus: "error",
                      })}
                    >
                      <TextArea rows={5} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Sixth Perk Title:"
                      name="sixth_perk_title"
                      {...(formError.sixth_perk_title && {
                        help: formError.sixth_perk_title,
                        validateStatus: "error",
                      })}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Sixth Perk Sub Title:"
                      name="sixth_perk_subtitle"
                      {...(formError.sixth_perk_subtitle && {
                        help: formError.sixth_perk_subtitle,
                        validateStatus: "error",
                      })}
                    >
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Sixth Perk Description:"
                      name="sixth_perk_desc"
                      {...(formError.sixth_perk_desc && {
                        help: formError.sixth_perk_desc,
                        validateStatus: "error",
                      })}
                    >
                      <TextArea rows={5} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Seventh Perk Title:"
                      name="seventh_perk_title"
                      {...(formError.seventh_perk_title && {
                        help: formError.seventh_perk_title, 
                        validateStatus: "error",
                      })}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Seventh Perk Sub Title:"
                      name="seventh_perk_subtitle"
                      {...(formError.seventh_perk_subtitle && {
                        help: formError.seventh_perk_subtitle,
                        validateStatus: "error",
                      })}
                    >
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Seventh Perk Description:"
                      name="seventh_perk_desc"
                      {...(formError.seventh_perk_desc && {
                        help: formError.seventh_perk_desc,
                        validateStatus: "error",
                      })}
                    >
                      <TextArea rows={5} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Eighth Perk Title:"
                      name="eighth_perk_title"
                      {...(formError.eighth_perk_title && {
                        help: formError.eighth_perk_title,
                        validateStatus: "error",
                      })}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Eighth Perk Sub Title:"
                      name="eighth_perk_subtitle"
                      {...(formError.eighth_perk_subtitle && {
                        help: formError.eighth_perk_subtitle,
                        validateStatus: "error",
                      })}
                    >
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Eighth Perk Description:"
                      name="eighth_perk_desc"
                      {...(formError.eighth_perk_desc && {
                        help: formError.eighth_perk_desc,
                        validateStatus: "error",
                      })}
                    >
                      <TextArea rows={5} />
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
              <Image
                width={200}
                style={{
                  display: "none",
                }}
                src={Logo}
                preview={{
                  visible: isHelpShow,
                  src: Logo,
                  onVisibleChange: (value) => {
                    setIsHelpShow(value);
                  },
                }}
              />
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Homepage;
