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
  Select,
  Divider,
} from "antd";

import _ from "lodash";
import http from "../../helpers/http";
import config from "../../config/config";
import { QuestionCircleOutlined } from "@ant-design/icons";

import HtmlEditor from "../../components/HtmlEditor";

import Joi from "joi";
import BusinessOptionsSort from "./BusinessOptionsSort";
function BusinessOptionsOld() {
  const [formError, setFormError] = useState({});
  const [data, setData] = useState({});
  const [loading, setloading] = useState(false);
  const [btnloading, setbtnloading] = useState(false);

  const [isOrderOpen, setisOrderOpen] = useState(false);
  const [sortData, setSortData] = useState([]);
  const [sortQuestion, setSortQuestion] = useState("");

  //createKey and editKey is used to reset modal data on close

  const moduleName = "Option";
  const moduleNamePural = "Dropdown Options";
  const base_url = config.api_url + "admin/content/options"; //without trailing slash
  const image_url = config.api_url + "uploads/content/option/"; //with trailing slash
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
    // return;
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

    // return;
    const { data } = await http.put(base_url, value);

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

  const handleOrderClose = () => {
    setisOrderOpen(!isOrderOpen);
    fetchData();
  };
  const handleOrderOpen = (question) => {
    setSortQuestion(question);
    setSortData(data[question]);
    setisOrderOpen(!isOrderOpen);
  };

  const [form] = Form.useForm();
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // form.setFieldsValue(data);
    form.setFieldsValue(_.omit(data, []));
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
                  <Divider>Student</Divider>
                  <Col xs={24} md={8}>
                    {/* <Button
                      type="link"
                      onClick={() => handleOrderOpen("st_study_field")}
                    >
                      Sort
                    </Button> */}
                    <Form.Item
                      label="What is your Field of Study?"
                      name="st_study_field"
                      {...(formError.st_study_field && {
                        help: formError.st_study_field,
                        validateStatus: "error",
                      })}
                    >
                      <Select mode="tags" tokenSeparators={[","]} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    {/* <Button
                      type="link"
                      onClick={() => handleOrderOpen("st_graduate_year")}
                    >
                      Sort
                    </Button> */}
                    <Form.Item
                      label="Please tell us the year you will graduate?"
                      name="st_graduate_year"
                      {...(formError.st_graduate_year && {
                        help: formError.st_graduate_year,
                        validateStatus: "error",
                      })}
                    >
                      <Select mode="tags" tokenSeparators={[","]} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Tell us about your largest concern l unmet need?"
                      name="st_unmet_needs"
                      {...(formError.st_unmet_needs && {
                        help: formError.st_unmet_needs,
                        validateStatus: "error",
                      })}
                    >
                      <Select mode="tags" tokenSeparators={[","]} />
                    </Form.Item>
                  </Col>

                  <Divider>Team Member</Divider>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="What is your current/past job profile/s?"
                      name="tm_job_profile"
                      {...(formError.tm_job_profile && {
                        help: formError.tm_job_profile,
                        validateStatus: "error",
                      })}
                    >
                      <Select mode="tags" tokenSeparators={[","]} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Please tell us how many years of experience do you have?"
                      name="tm_experience"
                      {...(formError.tm_experience && {
                        help: formError.tm_experience,
                        validateStatus: "error",
                      })}
                    >
                      <Select mode="tags" tokenSeparators={[","]} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Tell us about your largest concern l unmet need?"
                      name="tm_unmet_needs"
                      {...(formError.tm_unmet_needs && {
                        help: formError.tm_unmet_needs,
                        validateStatus: "error",
                      })}
                    >
                      <Select mode="tags" tokenSeparators={[","]} />
                    </Form.Item>
                  </Col>
                  <Divider>Business / Firm Owner</Divider>

                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Please select how long your business/firm has been established?"
                      name="bo_buss_establishment"
                      {...(formError.bo_buss_establishment && {
                        help: formError.bo_buss_establishment,
                        validateStatus: "error",
                      })}
                    >
                      <Select mode="tags" tokenSeparators={[","]} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="As a business/firm owner what is your largest concern I unmet need?"
                      name="bo_unmet_needs"
                      {...(formError.bo_unmet_needs && {
                        help: formError.bo_unmet_needs,
                        validateStatus: "error",
                      })}
                    >
                      <Select mode="tags" tokenSeparators={[","]} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <Form.Item
                    // wrapperCol={{ offset: 8, span: 16 }}
                    >
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={btnloading}
                      >
                        Update
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>

              {/* <BusinessOptionsSort
                isOpen={isOrderOpen}
                onClose={handleOrderClose}
                datas={sortData}
                question={sortQuestion}
              /> */}
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default BusinessOptionsOld;
