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
  Radio,
} from "antd";

import _ from "lodash";
import http from "../../helpers/http";
import config from "../../config/config";
import { QuestionCircleOutlined } from "@ant-design/icons";
import Logo from "../../upgrad-logo.svg";
import HtmlEditor from "../../components/HtmlEditor";

import Joi from "joi";
function Homepage() {
  const [editOpen, setEditOpen] = useState(false);
  const [formError, setFormError] = useState({});
  const [data, setData] = useState({});
  const [loading, setloading] = useState(false);
  const [btnloading, setbtnloading] = useState(false);
  const [isHelpShow, setIsHelpShow] = useState(false);
  const [description, setDescription] = useState();
  const [descriptionthree, setdescriptionthree] = useState();

  //createKey and editKey is used to reset modal data on close

  const [editKey, seteditKey] = useState(Math.random() * 10);

  const moduleName = "Amenity Content";
  const moduleNamePural = "Amenity Content";
  const base_url = config.api_url + "admin/content/amenity"; //without trailing slash
  const image_url = config.api_url + "uploads/content/amenity/"; //with trailing slash
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

    // if (value.stockGraph) {
    //   if (value.stockGraph.file.size > sizeLimit * 1024 * 1024) {
    //     errors["stockGraph"] = `File needs to be under ${sizeLimit}MB`;
    //   }
    //   let allowedExt = ["image/jpeg", "image/png"];
    //   if (!allowedExt.includes(value.stockGraph.file.type)) {
    //     errors["stockGraph"] = "File does not have a valid file extension.";
    //   }
    // }

    return errors ? errors : null;
  };

  const handleSubmit = async (value) => {
    value.sec_one_desc = description;
    value.sec_three_desc = descriptionthree;
    let errors = await validate(value);

    setFormError(errors);

    if (Object.keys(errors).length) {
      return;
    }

    setbtnloading(true);
    let formData = new FormData();
    for (const [key, data] of Object.entries(_.omit(value, []))) {
      formData.append(key, data || "");
    }

    // if (value.stockGraph) {
    //   formData.append("stockGraph", value.stockGraph.file);
    // }

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
    // form.setFieldsValue(data);
    form.setFieldsValue(_.omit(data, ["sec_one_desc", "sec_three_desc"]));

    setDescription(() => {
      return data.sec_one_desc;
    });

    setdescriptionthree(() => {
      return data.sec_three_desc;
    });
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
                  <Col xs={24} md={12}>
                    <Form.Item
                      getValueProps={(i) => {}}
                      label="Section One Description:"
                      name="sec_one_desc"
                      {...(formError.sec_one_desc && {
                        help: formError.sec_one_desc,
                        validateStatus: "error",
                      })}
                    >
                      <HtmlEditor
                        initialValue={data.sec_one_desc}

                        id="create-editor-1"
                        textareaName="sec_one_desc"
                        height={350}
                        onEditorChange={(newText) => setDescription(newText)}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      getValueProps={(i) => {}}
                      label="Section Three Description:"
                      name="sec_three_desc"
                      {...(formError.sec_three_desc && {
                        help: formError.sec_three_desc,
                        validateStatus: "error",
                      })}
                    >
                      <HtmlEditor
                        initialValue={data.sec_three_desc}
                        id="create-editor-2"
                        textareaName="sec_three_desc"
                        height={350}
                        onEditorChange={(newText) =>
                          setdescriptionthree(newText)
                        }
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Button Text:"
                      name="btn_text"
                      {...(formError.btn_text && {
                        help: formError.btn_text,
                        validateStatus: "error",
                      })}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Button URL:"
                      name="btn_url"
                      {...(formError.btn_url && {
                        help: formError.btn_url,
                        validateStatus: "error",
                      })}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="URL Type:"
                      name="url_type"
                      {...(formError.url_type && {
                        help: formError.url_type,
                        validateStatus: "error",
                      })}
                    >
                      <Radio.Group>
                        <Radio value="external" checked>
                          External
                        </Radio>
                        <Radio value="internal"> Internal </Radio>
                      </Radio.Group>
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
