import React, { useState } from "react";
import { Form, Input, Button, Row, Col, Card, notification } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Joi from "joi";
import http from "../../helpers/http";
import { jwtDecode } from "jwt-decode";
import config from "../../config/config";
import Logo from "../../logo.svg";
import helper from "../../helpers/helper";
const Login = (props) => {
  const [form] = Form.useForm();
  const [loading, setloading] = useState(false);
  const [formError, setFormError] = useState({});

  const base_url = config.api_url + "admin/auth/login";
  const joiOptions = config.joiOptions;

  //validation schema

  const validate = async (data) => {
    let schemaObj = {
      email: Joi.string().trim().required(),
      password: Joi.string().trim().required(),
    };

    const schema = Joi.object(schemaObj).options({ allowUnknown: true });

    const { error } = schema.validate(data, joiOptions);

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

    setloading(true);

    const data = await http.post(base_url, value);
    if (data) {
      const token = data.data.token;
      localStorage.setItem(config.jwt_store_key, token);
      notification["success"]({
        message: `Login Successfully`,
      });
      const decodedData = jwtDecode(token);
      const { route } = helper.resourceRouter(decodedData?.role);
      window.location = route;

      form.resetFields();
    }
    setloading(false);
  };

  return (
    <div className="login_form_wrapper">
      <Row>
        <Col span={12} className="gutter-row">
          <Card
            title=""
            className="login-box"
            bordered={false}
            style={{ width: 400 }}
          >
            <figure className="raymond_login_logo_wrapper">
              <img src={Logo} alt="Raymond logo" />
            </figure>
            <Form onFinish={handleSubmit} form={form}>
              <Form.Item
                name="email"
                {...(formError.email && {
                  help: formError.email,
                  validateStatus: "error",
                })}
              >
                <Input prefix={<UserOutlined />} placeholder="Email" />
              </Form.Item>
              <Form.Item
                name="password"
                {...(formError.password && {
                  help: formError.password,
                  validateStatus: "error",
                })}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Password"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  loading={loading}
                >
                  Log in
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
