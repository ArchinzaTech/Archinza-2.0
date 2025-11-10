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
  Space,
} from "antd";

// import HtmlEditor from "../../components/HtmlEditor";
import Joi from "joi";
import config from "../../../../config/config";
import { jwtDecode } from "jwt-decode";
import http from "../../../../helpers/http";
import DynamicOptionInput from "../../../../components/DynamicOptionsInput";
import { hasPermission, isSuperAdmin } from "../../../../helpers/permissions";
function BusinessAccountOptions() {
  const [formError, setFormError] = useState({});
  const [initialData, setInitialData] = useState();
  const [loading, setloading] = useState(false);
  const [btnloading, setbtnloading] = useState(false);
  const token = localStorage.getItem(config.jwt_store_key);
  const userRole = jwtDecode(token);

  const [isOrderOpen, setisOrderOpen] = useState(false);
  const [sortData, setSortData] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("sq.ft.");
  const [selectedCurrency, setSelectedCurrency] = useState("Rs/sq.ft.");
  const unitOptions = ["sq.ft.", "sq.m."];
  const budgetUnitOptions = ["Rs/sq.ft.", "USD/sq.m."];

  //createKey and editKey is used to reset modal data on close

  const moduleName = "Business Options";
  const moduleNamePural = "Onboarding Datatypes";
  const base_url = config.api_url; //without trailing slash
  const image_url = config.api_url + "uploads/content/option/"; //with trailing slash
  const sizeLimit = 10;

  const { TextArea } = Input;

  const validate = async (value) => {
    const schemaObj = {
      options: Joi.array().min(1).required().label("Options"),
    };
    const schema = Joi.object(schemaObj).options({ allowUnknown: true });

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

  const filterSizesByUnit = (sizes, unit) => {
    return sizes.filter((item) => item.unit === unit).map((item) => item.size);
  };
  const filterBudgetsByUnit = (sizes, unit) => {
    return sizes
      .filter((item) => item.currency === unit)
      .map((item) => item.budget);
  };

  const handleSubmit = async (value, option) => {
    let errors = await validate({ options: value });
    setFormError(errors);
    if (Object.keys(errors).length) {
      return;
    }

    if (option === "project_sizes") {
      const updatedSizes = unitOptions.flatMap((unit) =>
        (form.getFieldValue(["project_sizes", unit]) || []).map((size) => ({
          size,
          unit,
        }))
      );

      value = updatedSizes;
    }

    const savedData = await http.put(
      `${base_url}admin/content/business-options/${option}`,
      value
    );
    if (savedData?.data) {
      notification["success"]({
        message: `${moduleName} Updated Successfully`,
      });
      form.resetFields();
      setbtnloading(false);
      fetchData();
    }
  };

  const fetchData = async () => {
    setloading(true);
    const { data } = await http.get(`${base_url}business/options`);
    if (data) {
      const projectSizes = unitOptions.reduce((acc, unit) => {
        acc[unit] = filterSizesByUnit(data.project_sizes, unit);
        return acc;
      }, {});
      const averageBudgets = budgetUnitOptions.reduce((acc, unit) => {
        acc[unit] = filterBudgetsByUnit(data.average_budget, unit);
        return acc;
      }, {});
      console.log(averageBudgets);
      form.setFieldsValue({
        project_scope_preferences: data["project_scope_preferences"],
        minimum_project_fee: data["minimum_project_fee"],
        project_locations: data["project_locations"],
        project_typologies: data["project_typologies"],
        design_styles: data["design_styles"],
        project_sizes: projectSizes,
        average_budget: averageBudgets,
        price_ratings: data["price_ratings"],
        team_member_ranges: data["team_member_ranges"],
        email_types: data["email_types"],
        address_types: data["address_types"],
        product_positionings: data["product_positionings"],
      });
      setInitialData(data);
    }
    setloading(false);
  };

  const handleOrderClose = () => {
    setisOrderOpen(!isOrderOpen);
    fetchData();
  };

  const handleOrderOpen = (option) => {
    const optionData = initialData[option];
    setSortData(optionData);
    setSortOption(option);
    setisOrderOpen(!isOrderOpen);
  };

  const [form] = Form.useForm();
  useEffect(() => {
    fetchData();
  }, []);

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
        <Breadcrumb.Item>Business Flow</Breadcrumb.Item>
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
                // labelCol={{ span: 8 }}
                // wrapperCol={{ span: 16 }}
                layout="vertical"
              >
                <Row gutter={16}>
                  {/* <Divider>Student</Divider> */}
                  <Col xs={24} md={8}>
                    <Form.Item
                      label={
                        <b style={{ fontSize: "20px" }}>
                          Project Scope Preference
                        </b>
                      }
                      name="project_scope_preferences"
                      {...(formError.project_scope_preferences && {
                        help: formError.project_scope_preferences,
                        validateStatus: "error",
                      })}
                    >
                      <DynamicOptionInput
                        name="project_scope_preferences"
                        label="Project Scope Preference"
                        placeholder="Enter new option"
                        initialValues={
                          initialData?.project_scope_preferences || []
                        }
                        form={form}
                      />
                      {/* <Select mode="tags" tokenSeparators={[","]} /> */}
                    </Form.Item>
                    {(isSuperAdmin(userRole.role) ||
                      !hasPermission(userRole.role, "view_all")) && (
                      <Col span={8}>
                        <Form.Item
                        // wrapperCol={{ offset: 8, span: 16 }}
                        >
                          <Button
                            type="primary"
                            htmlType="submit"
                            loading={btnloading}
                            onClick={() =>
                              handleSubmit(
                                form.getFieldsValue()
                                  ?.project_scope_preferences,
                                "project_scope_preferences"
                              )
                            }
                          >
                            Update
                          </Button>
                        </Form.Item>
                      </Col>
                    )}
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label={
                        <b style={{ fontSize: "20px" }}>Minimum Project Size</b>
                      }
                      name={["project_sizes", selectedUnit]}
                      {...(formError.project_sizes && {
                        help: formError.project_sizes,
                        validateStatus: "error",
                      })}
                    >
                      <Space>
                        <Select
                          value={selectedUnit}
                          onChange={setSelectedUnit}
                          style={{ width: 100 }}
                        >
                          {unitOptions.map((unit) => (
                            <Select.Option key={unit} value={unit}>
                              {unit}
                            </Select.Option>
                          ))}
                        </Select>
                      </Space>
                      <DynamicOptionInput
                        name={["project_sizes", selectedUnit]}
                        label="Minimum Project Size"
                        placeholder={`Enter size in ${selectedUnit}`}
                        initialValues={filterSizesByUnit(
                          initialData?.project_sizes || [],
                          selectedUnit
                        )}
                        form={form}
                        mode="tags"
                        onChange={(newValues) => {
                          const updatedSizes = {
                            ...form.getFieldValue("project_sizes"),
                            [selectedUnit]: newValues,
                          };
                          form.setFieldsValue({ project_sizes: updatedSizes });
                        }}
                      />
                    </Form.Item>
                    {(isSuperAdmin(userRole.role) ||
                      !hasPermission(userRole.role, "view_all")) && (
                      <Col span={8}>
                        <Form.Item>
                          <Button
                            type="primary"
                            htmlType="submit"
                            loading={btnloading}
                            onClick={() =>
                              handleSubmit(
                                form.getFieldValue([
                                  "project_sizes",
                                  selectedUnit,
                                ]),
                                "project_sizes"
                              )
                            }
                          >
                            Update
                          </Button>
                        </Form.Item>
                      </Col>
                    )}
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label={
                        <b style={{ fontSize: "20px" }}>
                          Project / CLIENT Location Preference
                        </b>
                      }
                      name="project_locations"
                      {...(formError.project_locations && {
                        help: formError.project_locations,
                        validateStatus: "error",
                      })}
                    >
                      <DynamicOptionInput
                        name="project_locations"
                        label="Project / CLIENT Location Preference"
                        placeholder="Enter new option"
                        initialValues={initialData?.project_locations || []}
                        form={form}
                      />{" "}
                    </Form.Item>
                    {(isSuperAdmin(userRole.role) ||
                      !hasPermission(userRole.role, "view_all")) && (
                      <Col span={8}>
                        <Form.Item
                        // wrapperCol={{ offset: 8, span: 16 }}
                        >
                          <Button
                            type="primary"
                            htmlType="submit"
                            loading={btnloading}
                            onClick={() =>
                              handleSubmit(
                                form.getFieldsValue().project_locations,
                                "project_locations"
                              )
                            }
                          >
                            Update
                          </Button>
                        </Form.Item>
                      </Col>
                    )}
                  </Col>
                  <Divider />
                  <Col xs={24} md={8}>
                    <Form.Item
                      label={
                        <b style={{ fontSize: "20px" }}>Project Typology</b>
                      }
                      name="project_typologies"
                      {...(formError.project_typologies && {
                        help: formError.project_typologies,
                        validateStatus: "error",
                      })}
                    >
                      <DynamicOptionInput
                        name="project_typologies"
                        label="Project Typology"
                        placeholder="Enter new option"
                        initialValues={initialData?.project_typologies || []}
                        form={form}
                      />{" "}
                    </Form.Item>
                    {(isSuperAdmin(userRole.role) ||
                      !hasPermission(userRole.role, "view_all")) && (
                      <Col span={8}>
                        <Form.Item
                        // wrapperCol={{ offset: 8, span: 16 }}
                        >
                          <Button
                            type="primary"
                            htmlType="submit"
                            loading={btnloading}
                            onClick={() =>
                              handleSubmit(
                                form.getFieldsValue()?.project_typologies,
                                "project_typologies"
                              )
                            }
                          >
                            Update
                          </Button>
                        </Form.Item>
                      </Col>
                    )}
                  </Col>

                  {/* <Divider>Team Member</Divider> */}
                  <Col xs={24} md={8}>
                    <Form.Item
                      label={
                        <b style={{ fontSize: "20px" }}>
                          Your Product/Service Design Style
                        </b>
                      }
                      name="design_styles"
                      {...(formError.design_styles && {
                        help: formError.design_styles,
                        validateStatus: "error",
                      })}
                    >
                      <DynamicOptionInput
                        name="design_styles"
                        label="Your Product/Service Design Style"
                        placeholder="Enter new option"
                        initialValues={initialData?.design_styles || []}
                        form={form}
                      />{" "}
                    </Form.Item>
                    {(isSuperAdmin(userRole.role) ||
                      !hasPermission(userRole.role, "view_all")) && (
                      <Col span={8}>
                        <Form.Item
                        // wrapperCol={{ offset: 8, span: 16 }}
                        >
                          <Button
                            type="primary"
                            htmlType="submit"
                            loading={btnloading}
                            onClick={() =>
                              handleSubmit(
                                form.getFieldsValue()?.design_styles,
                                "design_styles"
                              )
                            }
                          >
                            Update
                          </Button>
                        </Form.Item>
                      </Col>
                    )}
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label={
                        <b style={{ fontSize: "20px" }}>
                          Approximate Budget of your Projects
                        </b>
                      }
                      name={["average_budget", selectedCurrency]}
                      {...(formError.average_budget && {
                        help: formError.average_budget,
                        validateStatus: "error",
                      })}
                    >
                      <Space>
                        <Select
                          value={selectedCurrency}
                          onChange={setSelectedCurrency}
                          style={{ width: 100 }}
                        >
                          {budgetUnitOptions.map((unit) => (
                            <Select.Option key={unit} value={unit}>
                              {unit}
                            </Select.Option>
                          ))}
                        </Select>
                      </Space>
                      <DynamicOptionInput
                        name={["average_budget", selectedCurrency]}
                        label="Approximate Budget of your Projects"
                        placeholder={`Enter unit in ${selectedCurrency}`}
                        initialValues={filterBudgetsByUnit(
                          initialData?.average_budget || [],
                          selectedCurrency
                        )}
                        form={form}
                        mode="tags"
                        onChange={(newValues) => {
                          const updatedSizes = {
                            ...form.getFieldValue("average_budget"),
                            [selectedCurrency]: newValues,
                          };
                          form.setFieldsValue({ average_budget: updatedSizes });
                        }}
                      />
                    </Form.Item>
                    {(isSuperAdmin(userRole.role) ||
                      !hasPermission(userRole.role, "view_all")) && (
                      <Col span={8}>
                        <Form.Item>
                          <Button
                            type="primary"
                            htmlType="submit"
                            loading={btnloading}
                            onClick={() =>
                              handleSubmit(
                                form.getFieldValue([
                                  "project_sizes",
                                  selectedUnit,
                                ]),
                                "project_sizes"
                              )
                            }
                          >
                            Update
                          </Button>
                        </Form.Item>
                      </Col>
                    )}
                  </Col>
                  <Divider />

                  <Col xs={24} md={8}>
                    <Form.Item
                      label={
                        <b style={{ fontSize: "20px" }}>Minimum Project Fee</b>
                      }
                      name="minimum_project_fee"
                      {...(formError.minimum_project_fee && {
                        help: formError.minimum_project_fee,
                        validateStatus: "error",
                      })}
                    >
                      <DynamicOptionInput
                        name="minimum_project_fee"
                        label="Minimum Project Fee"
                        placeholder="Enter new option"
                        initialValues={initialData?.minimum_project_fee || []}
                        form={form}
                      />{" "}
                    </Form.Item>
                    {(isSuperAdmin(userRole.role) ||
                      !hasPermission(userRole.role, "view_all")) && (
                      <Col span={8}>
                        <Form.Item
                        // wrapperCol={{ offset: 8, span: 16 }}
                        >
                          <Button
                            type="primary"
                            htmlType="submit"
                            loading={btnloading}
                            onClick={() =>
                              handleSubmit(
                                form.getFieldsValue()?.minimum_project_fee,
                                "minimum_project_fee"
                              )
                            }
                          >
                            Update
                          </Button>
                        </Form.Item>
                      </Col>
                    )}
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label={
                        <b style={{ fontSize: "20px" }}>Project Locations</b>
                      }
                      name="project_locations"
                      {...(formError.project_locations && {
                        help: formError.project_locations,
                        validateStatus: "error",
                      })}
                    >
                      <DynamicOptionInput
                        name="project_locations"
                        label="Project Locations"
                        placeholder="Enter new option"
                        initialValues={initialData?.project_locations || []}
                        form={form}
                      />{" "}
                    </Form.Item>
                    {(isSuperAdmin(userRole.role) ||
                      !hasPermission(userRole.role, "view_all")) && (
                      <Col span={8}>
                        <Form.Item
                        // wrapperCol={{ offset: 8, span: 16 }}
                        >
                          <Button
                            type="primary"
                            htmlType="submit"
                            loading={btnloading}
                            onClick={() =>
                              handleSubmit(
                                form.getFieldsValue()?.project_locations,
                                "project_locations"
                              )
                            }
                          >
                            Update
                          </Button>
                        </Form.Item>
                      </Col>
                    )}
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label={
                        <b style={{ fontSize: "20px" }}>Team Members Options</b>
                      }
                      name="team_member_ranges"
                      {...(formError.team_member_ranges && {
                        help: formError.team_member_ranges,
                        validateStatus: "error",
                      })}
                    >
                      <DynamicOptionInput
                        name="team_member_ranges"
                        label="Team Members Options"
                        placeholder="Enter new option"
                        initialValues={initialData?.team_member_ranges || []}
                        form={form}
                      />{" "}
                    </Form.Item>
                    {(isSuperAdmin(userRole.role) ||
                      !hasPermission(userRole.role, "view_all")) && (
                      <Col span={8}>
                        <Form.Item
                        // wrapperCol={{ offset: 8, span: 16 }}
                        >
                          <Button
                            type="primary"
                            htmlType="submit"
                            loading={btnloading}
                            onClick={() =>
                              handleSubmit(
                                form.getFieldsValue()?.team_member_ranges,
                                "team_member_ranges"
                              )
                            }
                          >
                            Update
                          </Button>
                        </Form.Item>
                      </Col>
                    )}
                  </Col>
                  <Divider />
                  <Col xs={24} md={8}>
                    <Form.Item
                      label={
                        <b style={{ fontSize: "20px" }}>
                          Product/Service Positionings
                        </b>
                      }
                      name="product_positionings"
                      {...(formError.product_positionings && {
                        help: formError.product_positionings,
                        validateStatus: "error",
                      })}
                    >
                      <DynamicOptionInput
                        name="product_positionings"
                        label="Product/Service Positionings"
                        placeholder="Enter new option"
                        initialValues={initialData?.product_positionings || []}
                        form={form}
                      />{" "}
                    </Form.Item>
                    {(isSuperAdmin(userRole.role) ||
                      !hasPermission(userRole.role, "view_all")) && (
                      <Col span={8}>
                        <Form.Item
                        // wrapperCol={{ offset: 8, span: 16 }}
                        >
                          <Button
                            type="primary"
                            htmlType="submit"
                            loading={btnloading}
                            onClick={() =>
                              handleSubmit(
                                form.getFieldsValue()?.product_positionings,
                                "product_positionings"
                              )
                            }
                          >
                            Update
                          </Button>
                        </Form.Item>
                      </Col>
                    )}
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label={<b style={{ fontSize: "20px" }}>Email Types</b>}
                      name="email_types"
                      {...(formError.email_types && {
                        help: formError.email_types,
                        validateStatus: "error",
                      })}
                    >
                      <DynamicOptionInput
                        name="email_types"
                        label="Email Types"
                        placeholder="Enter new option"
                        initialValues={initialData?.email_types || []}
                        form={form}
                      />{" "}
                    </Form.Item>
                    {(isSuperAdmin(userRole.role) ||
                      !hasPermission(userRole.role, "view_all")) && (
                      <Col span={8}>
                        <Form.Item
                        // wrapperCol={{ offset: 8, span: 16 }}
                        >
                          <Button
                            type="primary"
                            htmlType="submit"
                            loading={btnloading}
                            onClick={() =>
                              handleSubmit(
                                form.getFieldsValue()?.email_types,
                                "email_types"
                              )
                            }
                          >
                            Update
                          </Button>
                        </Form.Item>
                      </Col>
                    )}
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label={<b style={{ fontSize: "20px" }}>Address Types</b>}
                      name="address_types"
                      {...(formError.address_types && {
                        help: formError.address_types,
                        validateStatus: "error",
                      })}
                    >
                      <DynamicOptionInput
                        name="address_types"
                        label="Address Types"
                        placeholder="Enter new option"
                        initialValues={initialData?.address_types || []}
                        form={form}
                      />{" "}
                    </Form.Item>
                    {(isSuperAdmin(userRole.role) ||
                      !hasPermission(userRole.role, "view_all")) && (
                      <Col span={8}>
                        <Form.Item
                        // wrapperCol={{ offset: 8, span: 16 }}
                        >
                          <Button
                            type="primary"
                            htmlType="submit"
                            loading={btnloading}
                            onClick={() =>
                              handleSubmit(
                                form.getFieldsValue()?.address_types,
                                "address_types"
                              )
                            }
                          >
                            Update
                          </Button>
                        </Form.Item>
                      </Col>
                    )}
                  </Col>
                </Row>
                {/* <Row>
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
                </Row> */}
              </Form>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default BusinessAccountOptions;
