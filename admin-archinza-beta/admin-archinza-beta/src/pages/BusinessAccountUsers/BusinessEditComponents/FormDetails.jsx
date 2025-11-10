import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  Radio,
  InputNumber,
  Button,
  Table,
  Space,
  Collapse,
  Row,
  Col,
  message,
  Spin,
  DatePicker,
  Tooltip,
} from "antd";
import moment from "moment";
import dayjs from "dayjs";
import http from "../../../helpers/http";
import config from "../../../config/config";

const { Panel } = Collapse;

const FormDetailsForm = ({
  form: antdForm,
  initialData,
  admin,
  mode = "edit",
  userId,
  onSubmit,
}) => {
  const [form] = Form.useForm(antdForm);
  const [serviceOptions, setServiceOptions] = useState([]);
  const [featuredServiceOptions, setFeaturedServiceOptions] = useState([]);
  const [typologyOptions, setTypologyOptions] = useState([]);
  const [designStyleOptions, setDesignStyleOptions] = useState([]);
  const [teamRangeOptions, setTeamRangeOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [productPositionings, setProductPositionings] = useState([]);
  const [projectSizeOptions, setProjectSizeOptions] = useState([]);
  const [averageBudgetOptions, setAverageBudgetOptions] = useState([]);
  const [minimumProjectFeeOptions, setMinimumProjectFeeOptions] = useState([]);
  const [roleConstraints, setRoleConstraints] = useState([]);
  const [selectedMinimumFeeCurrency, setSelectedMinimumFeeCurrency] =
    useState("INR");
  const [selectedUnit, setSelectedUnit] = useState("sq.ft.");
  const [selectedCurrency, setSelectedCurrency] = useState("INR");
  const [countryCodes, setCountryCodes] = useState([]);
  const [isLocked, setIsLocked] = useState(false);
  const [editRequestStatus, setEditRequestStatus] = useState(null);

  const [date, setDate] = useState(null);
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 100;
  const minDate = new Date(minYear, 0, 1);
  const inputStyle = { width: 500 };

  const [loading, setLoading] = useState(false);
  const base_url = config.api_url;
  const staticFees = {
    INR: [
      "Under 1,00,000 INR",
      "1,00,000 - 5,00,000 INR",
      "5,00,000 - 10,00,000 INR",
      "Above 10,00,000 INR",
    ],
    USD: [
      "Under 1200 USD",
      "1200-6000 USD",
      "6,000-12,000 USD",
      "Above 12,000 USD",
    ],
  };
  // Fetch options for select fields
  const fetchOptions = async () => {
    setLoading(true);
    try {
      const { data } = await http.get(`${base_url}business/options`);
      const servicesData = await http.get(`${base_url}services`);
      const {
        project_scope_preferences,
        design_styles,
        project_typologies,
        services,
        team_member_ranges,
        project_locations,
        product_positionings,
        project_sizes,
        average_budget,
      } = data;
      // setServiceOptions(services.map((item) => ({ label: item, value: item })));
      setServiceOptions(servicesData?.data || []);
      setTypologyOptions(
        project_typologies.map((item) => ({ label: item, value: item }))
      );
      setDesignStyleOptions(
        design_styles.map((item) => ({ label: item, value: item }))
      );
      setTeamRangeOptions(
        team_member_ranges.map((item) => ({ label: item, value: item }))
      );
      setLocationOptions(
        project_locations.map((item) => ({ label: item, value: item }))
      );
      setProductPositionings(
        product_positionings.map((item) => ({ label: item, value: item }))
      );
      setProjectSizeOptions(
        project_sizes.map((item) => ({
          label: item.size,
          value: item.size,
          unit: item.unit,
        }))
      );
      setAverageBudgetOptions(
        average_budget.map((item) => ({
          label: item.budget,
          value: item.budget,
          currency: item.currency,
        }))
      );
    } catch (error) {
      // message.error("Failed to fetch options");
    } finally {
      setLoading(false);
    }
  };

  const handleMinimumFeeCurrencyChange = (value) => {
    setSelectedMinimumFeeCurrency(value);
    setMinimumProjectFeeOptions(
      staticFees[value].map((fee) => ({ label: fee, value: fee }))
    );

    form.setFieldsValue({
      project_mimimal_fee: {
        fee: undefined,
        currency: value,
      },
    });
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);

    if (newDate) {
      const yearString = newDate.year().toString();
      form.setFieldsValue({
        establishment_year: yearString,
      });
    } else {
      setTimeout(() => {
        form.setFieldsValue({
          establishment_year: undefined,
        });
      }, 0);
    }
  };

  const handleUnitChange = (value) => {
    setSelectedUnit(value);
    let selectedSizes = [];
    if (mode === "edit" && value === initialData.project_sizes?.unit) {
      selectedSizes = initialData.project_sizes?.sizes || [];
    }
    const currentSizes = form.getFieldValue(["project_sizes", "sizes"]) || [];
    const validSizes =
      selectedSizes.length > 0
        ? selectedSizes.filter((size) =>
            projectSizeOptions.some(
              (option) => option.value === size && option.unit === value
            )
          )
        : currentSizes.filter((size) =>
            projectSizeOptions.some(
              (option) => option.value === size && option.unit === value
            )
          );
    form.setFieldsValue({ project_sizes: { sizes: validSizes, unit: value } });
  };

  // Handle currency change for average budget
  const handleCurrencyChange = (value) => {
    setSelectedCurrency(value);
    let selectedBudgets = [];
    if (mode === "edit" && value === initialData.avg_project_budget?.currency) {
      selectedBudgets = initialData.avg_project_budget?.budgets || [];
    }
    const currentBudgets =
      form.getFieldValue(["avg_project_budget", "budgets"]) || [];

    const validBudgets =
      selectedBudgets.length > 0
        ? selectedBudgets.filter((budget) =>
            averageBudgetOptions.some(
              (option) => option.value === budget && option.currency === value
            )
          )
        : currentBudgets.filter((budget) =>
            averageBudgetOptions.some(
              (option) => option.value === budget && option.currency === value
            )
          );
    form.setFieldsValue({
      avg_project_budget: { budgets: validBudgets, currency: value },
    });
  };

  const fetchCountryCodes = async () => {
    const codesResponse = await http.get(`${base_url}general/countries/codes`);
    setCountryCodes(
      codesResponse.data.map((item, index) => ({
        key: `${item.phone_code}-${index}`,
        label: item.phone_code,
        value: item.phone_code,
      }))
    );
  };

  useEffect(() => {
    if (initialData.establishment_year) {
      setDate(dayjs(initialData.establishment_year.data));
      form.setFieldsValue({
        establishment_years: dayjs(initialData.establishment_year.data),
      });
    }
  }, [initialData, form]);

  useEffect(() => {
    const currency = initialData.project_mimimal_fee?.currency || "INR";
    setMinimumProjectFeeOptions(
      staticFees[currency].map((fee) => ({ label: fee, value: fee }))
    );
    fetchOptions();
    fetchCountryCodes();

    if (admin?.role !== "Super Admin") {
      if (admin?.role?.permissions) {
        const lockedDataPermission = admin.role.permissions.find(
          (per) => per?.constraints?.lockedFields?.length
        );
        if (lockedDataPermission) {
          setRoleConstraints(lockedDataPermission?.constraints?.lockedFields);
        }
      }
    }

    const userEditRequest = initialData?.editRequests?.find(
      (it) => it.user === initialData?._id
    );

    if (userEditRequest) {
      setEditRequestStatus(userEditRequest.status);
    } else {
      setEditRequestStatus(null);
    }
  }, [initialData, admin]); // Added initialData to dependencies

  // Columns for owners table
  const ownerColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      render: (_, record) => `${record.country_code}${record.phone}`,
      key: "phone",
    },
    {
      title: "WhatsApp",
      render: (_, record) =>
        `${record.whatsapp_country_code}${record.whatsapp_no}`,
      key: "whatsapp",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record, index) => (
        <Button
          type="link"
          onClick={() => {
            const owners = form.getFieldValue("owners");
            owners.splice(index, 1);
            form.setFieldsValue({ owners });
          }}
        >
          Delete
        </Button>
      ),
    },
  ];

  useEffect(() => {
    if (mode === "create") {
      form.resetFields();
      setInitialFormDataForCreate();
    } else if (mode === "edit" && initialData) {
      form.setFieldsValue({
        ...initialData,
        establishment_years: initialData.establishment_year?.data
          ? dayjs(initialData.establishment_year.data)
          : undefined,
        project_scope: initialData.project_scope?.data,
        project_typology: initialData.project_typology?.data,
        design_style: initialData.design_style?.data,
        team_range: initialData.team_range?.data,
        project_location: initialData.project_location?.data,
        product_positionings: initialData.product_positionings || [],
        project_sizes: {
          sizes: initialData.project_sizes?.sizes,
          unit: initialData.project_sizes?.unit || "sq.ft.",
        },
        avg_project_budget: {
          budget: initialData.avg_project_budget?.budget,
          currency: initialData.avg_project_budget?.currency || "INR",
        },
        project_mimimal_fee: {
          fee: initialData.project_mimimal_fee?.fee,
          currency: initialData.project_mimimal_fee?.currency || "INR",
        },
        renovation_work: initialData.renovation_work ? "Yes" : "No",
        website_link: initialData?.website_link || "",
      });
      setDate(
        initialData.establishment_year?.data
          ? dayjs(initialData.establishment_year.data)
          : null
      );
      setSelectedUnit(initialData.project_sizes?.unit || "sq.ft.");
      setSelectedCurrency(initialData.avg_project_budget?.currency || "INR");
      setSelectedMinimumFeeCurrency(
        initialData.project_mimimal_fee?.currency || "INR"
      );
    }
  }, [initialData, mode, form]);

  const setInitialFormDataForCreate = () => {
    form.setFieldsValue({
      project_mimimal_fee: { currency: "INR" },
      project_sizes: { unit: "sq.ft." },
      avg_project_budget: { currency: "INR" },
      owners: [],
      featured_services: [],
      services: [],
      project_scope: [],
      project_typology: [],
      design_style: [],
      team_range: undefined,
      project_location: undefined,
      product_positionings: [],
      renovation_work: undefined,
      website_link: undefined,
      linkedin_link: undefined,
      instagram_handle: undefined,
      establishment_years: undefined,
    });
  };

  const handleFormSubmit = async (values) => {
    // Reformat complex objects before sending
    const formattedValues = {
      ...values,
      establishment_year: values.establishment_years
        ? { data: values.establishment_years.year().toString() }
        : undefined,
      project_scope: { data: values.project_scope || [] },
      project_typology: { data: values.project_typology || [] },
      design_style: { data: values.design_style || [] },
      team_range: { data: values.team_range },
      project_location: { data: values.project_location },
      product_positionings: values.product_positionings || [], // Changed to handle direct array
      project_sizes: {
        sizes: values.project_sizes?.sizes || [],
        unit: values.project_sizes?.unit || "sq.ft.",
      },
      avg_project_budget: {
        budget: values.avg_project_budget?.budgets || undefined,
        currency: values.avg_project_budget?.currency || "INR",
      },
      project_mimimal_fee: {
        fee: values.project_mimimal_fee?.fee || undefined,
        currency: values.project_mimimal_fee?.currency || "INR",
      },
      renovation_work: values.renovation_work === "Yes" ? true : false,
    };
    if (onSubmit) {
      onSubmit(formattedValues);
    } else {
      setLoading(true);
      try {
        const response = await http.post(
          `${base_url}business/business-details/${initialData._id}`,
          formattedValues
        );
        if (response?.data) {
          message.success("Form details updated successfully");
        } else {
          message.error(response?.message || "Failed to update form details.");
        }
      } catch (error) {
        message.error(
          error?.message || "An error occurred while updating form details."
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditRequest = async () => {
    const response = await http.put(
      `${config.api_url}admin/content/options/edit-request`,
      {
        user: initialData?._id,
        roleUser: admin.id,
      }
    );
    if (response?.data) {
      message.success("Edit Request Sent Successfully");
      setEditRequestStatus("pending");
    }
  };

  return (
    <Spin spinning={loading}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
        initialValues={mode === "create" ? undefined : initialData} // Removed direct call to function, handled by useEffect
      >
        {roleConstraints?.includes("website_link") && (
          <Button
            type="primary"
            style={{
              marginBottom: "20px",
              backgroundColor:
                editRequestStatus === "approved" ? "green" : undefined,
              color: editRequestStatus === "pending" ? "grey" : "white",
            }}
            onClick={() => handleEditRequest()}
            disabled={
              editRequestStatus === "pending" ||
              editRequestStatus === "approved"
            }
          >
            {editRequestStatus === "pending"
              ? "Edit Requested for Locked Data"
              : editRequestStatus === "approved"
              ? "Locked Fields Edit Allowed"
              : "Request to Edit Locked Fields"}
          </Button>
        )}
        <Collapse defaultActiveKey={["1", "2", "3"]}>
          <Panel header="Owner Details" key="1">
            <Form.List name="owners">
              {(fields, { add, remove }) => (
                <>
                  {fields.length > 0 && (
                    <Table
                      rowKey={(record, index) => index}
                      columns={ownerColumns}
                      dataSource={fields
                        .map((field) => {
                          const owner =
                            form.getFieldValue("owners")[field.name];
                          return {
                            ...owner,
                            key: field.key,
                          };
                        })
                        .filter((owner) => owner.name || owner.email)} // Only show owners with at least a name or email
                      pagination={false}
                    />
                  )}
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    style={{ width: "100%", marginTop: 16 }}
                  >
                    Add Owner
                  </Button>
                  {fields.map(({ key, name, ...restField }) => (
                    <div
                      key={key}
                      style={{
                        marginTop: 16,
                        padding: 16,
                        border: "1px solid #f0f0f0",
                      }}
                    >
                      <Form.Item
                        {...restField}
                        name={[name, "name"]}
                        label="Name"
                        rules={[
                          { required: true, message: "Name is required" },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "email"]}
                        label="Email"
                        rules={[
                          { required: true, message: "Email is required" },
                          { type: "email", message: "Invalid email format" },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item label="Phone" required>
                        <Row gutter={8}>
                          <Col span={8}>
                            <Form.Item
                              {...restField}
                              name={[name, "country_code"]}
                              noStyle
                              rules={[
                                {
                                  required: true,
                                  message: "Country code is required",
                                },
                              ]}
                            >
                              <Select
                                showSearch
                                options={countryCodes}
                                placeholder="Code"
                                filterOption={(input, option) =>
                                  option.label
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                                }
                              />
                            </Form.Item>
                          </Col>
                          <Col span={16}>
                            <Form.Item
                              {...restField}
                              name={[name, "phone"]}
                              noStyle
                              rules={[
                                {
                                  required: true,
                                  message: "Phone number is required",
                                },
                              ]}
                            >
                              <Input placeholder="Phone number" />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Form.Item>
                      <Form.Item label="WhatsApp Number" required>
                        <Row gutter={8}>
                          <Col span={8}>
                            <Form.Item
                              {...restField}
                              name={[name, "whatsapp_country_code"]}
                              noStyle
                              rules={[
                                {
                                  required: true,
                                  message: "Country code is required",
                                },
                              ]}
                            >
                              <Select
                                showSearch
                                options={countryCodes}
                                placeholder="Code"
                                filterOption={(input, option) =>
                                  option.label
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                                }
                              />
                            </Form.Item>
                          </Col>
                          <Col span={16}>
                            <Form.Item
                              {...restField}
                              name={[name, "whatsapp_no"]}
                              noStyle
                              rules={[
                                {
                                  required: true,
                                  message: "WhatsApp number is required",
                                },
                              ]}
                            >
                              <Input placeholder="WhatsApp number" />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Form.Item>
                    </div>
                  ))}
                </>
              )}
            </Form.List>
          </Panel>
          <Panel header="Service Details" key="2">
            {/* <Form.Item
            name="featured_services"
            label="Top 5 Products/Services"
            rules={[
              { required: true, message: "Featured services are required" },
            ]}
          >
            <Select
              mode="multiple"
              options={serviceOptions}
              placeholder="Select featured services"
              maxTagCount={5}
            />
          </Form.Item> */}
            <Form.Item
              name="services"
              label="Services"
              rules={[{ required: true, message: "Services are required" }]}
            >
              <Select
                mode="multiple"
                options={serviceOptions}
                placeholder="Select services"
              />
            </Form.Item>
            <Form.Item
              name="featured_services"
              label="Featured Services"
              rules={[{ required: true, message: "Services are required" }]}
            >
              <Select
                mode="multiple"
                options={serviceOptions}
                placeholder="Select services"
              />
            </Form.Item>
          </Panel>
          <Panel header="Project and Business Details" key="3">
            <Form.Item
              name="website_link"
              label="Website Link"
              rules={[{ type: "url", message: "Invalid URL format" }]}
            >
              {/* <Tooltip
                title={
                  roleConstraints?.includes("instagram_handle") &&
                  editRequestStatus !== "approved"
                    ? "Website link is locked due to role restrictions"
                    : ""
                }
              >
              </Tooltip> */}
              <Input
                placeholder="Enter Website Link"
                style={inputStyle}
                disabled={
                  roleConstraints?.includes("website_link") &&
                  editRequestStatus !== "approved"
                }
              />
            </Form.Item>
            <Form.Item
              name="linkedin_link"
              label="LinkedIn Link"
              rules={[{ type: "url", message: "Invalid URL format" }]}
            >
              {/* <Tooltip
                title={
                  roleConstraints?.includes("instagram_handle") &&
                  editRequestStatus !== "approved"
                    ? "Linkedin handle is locked due to role restrictions"
                    : ""
                }
              >
              </Tooltip> */}
              <Input
                placeholder="Enter Linkedin Profile URL"
                style={inputStyle}
                disabled={
                  roleConstraints?.includes("linkedin_link") &&
                  editRequestStatus !== "approved"
                }
              />
            </Form.Item>
            <Form.Item
              name="instagram_handle"
              label="Instagram Handle"
              rules={[{ type: "url", message: "Invalid URL format" }]}
            >
              {/* <Tooltip
                title={
                  roleConstraints?.includes("instagram_handle") &&
                  editRequestStatus !== "approved"
                    ? "Instagram handle is locked due to role restrictions"
                    : ""
                }
              >
              </Tooltip> */}
              <Input
                placeholder="Enter Instagram handle"
                style={inputStyle}
                disabled={
                  roleConstraints?.includes("instagram_handle") &&
                  editRequestStatus !== "approved"
                }
              />
            </Form.Item>
            <Form.Item
              name="establishment_years"
              label="Year of Establishment"
              // rules={[
              //   { required: true, message: "Establishment year is required" },
              // ]}
            >
              <DatePicker
                picker="year"
                placeholder="Select year"
                format="YYYY"
                disableFuture
                value={date}
                minDate={dayjs(minDate)}
                maxDate={dayjs(new Date())}
                onChange={handleDateChange}
              />
            </Form.Item>
            <Form.Item
              name="team_range"
              label="Number of Team Members"
              // rules={[{ required: true, message: "Team range is required" }]}
            >
              <Select
                options={teamRangeOptions}
                placeholder="Select team range"
              />
            </Form.Item>
            <Form.Item label="Minimum Project Size">
              <Row gutter={8}>
                <Col span={16}>
                  <Form.Item
                    name={["project_sizes", "sizes"]}
                    noStyle
                    // rules={[{ required: true, message: "Sizes are required" }]}
                  >
                    <Select
                      mode="multiple"
                      options={projectSizeOptions.filter(
                        (option) => option.unit === selectedUnit
                      )}
                      placeholder="Select sizes"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name={["project_sizes", "unit"]}
                    noStyle
                    // rules={[{ required: true, message: "Unit is required" }]}
                  >
                    <Select
                      options={[
                        { label: "sq.ft.", value: "sq.ft." },
                        { label: "sq.m.", value: "sq.m." },
                      ]}
                      placeholder="Unit"
                      onChange={handleUnitChange}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>
            <Form.Item
              name="project_location"
              label="Project/Client Location Preference"
              // rules={[
              //   { required: true, message: "Project location is required" },
              // ]}
            >
              <Select
                options={locationOptions}
                placeholder="Select project location"
              />
            </Form.Item>
            <Form.Item
              name="renovation_work"
              label="Renovation Work"
              // rules={[{ required: true, message: "Please select Yes or No" }]}
            >
              <Radio.Group>
                <Radio value="Yes">Yes</Radio>
                <Radio value="No">No</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name="project_typology"
              label="Project Typologies"
              // rules={[
              //   { required: true, message: "Project typologies are required" },
              // ]}
            >
              <Select
                mode="multiple"
                options={typologyOptions}
                placeholder="Select typologies"
              />
            </Form.Item>
            <Form.Item
              name="design_style"
              label="Product/Service Design Style"
              // rules={[
              //   { required: true, message: "Design styles are required" },
              // ]}
            >
              <Select
                mode="multiple"
                options={designStyleOptions}
                placeholder="Select design styles"
              />
            </Form.Item>
            <Form.Item label="Approximate Budget of Projects">
              <Row gutter={8}>
                <Col span={16}>
                  <Form.Item
                    name={["avg_project_budget", "budgets"]}
                    noStyle
                    // rules={[{ required: true, message: "Budget is required" }]}
                  >
                    <Select
                      mode="multiple"
                      options={averageBudgetOptions.filter(
                        (option) => option.currency === selectedCurrency
                      )}
                      placeholder="Select budgets"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name={["avg_project_budget", "currency"]}
                    noStyle
                    // rules={[
                    //   { required: true, message: "Currency is required" },
                    // ]}
                  >
                    <Select
                      options={[
                        { label: "INR", value: "INR" },
                        { label: "USD", value: "USD" },
                      ]}
                      placeholder="Currency"
                      onChange={handleCurrencyChange}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>
            <Form.Item label="Current Minimal Project Fee">
              <Row gutter={8}>
                <Col span={16}>
                  <Form.Item
                    name={["project_mimimal_fee", "fee"]}
                    noStyle
                    // rules={[{ required: true, message: "Fee is required" }]}
                  >
                    <Select
                      options={minimumProjectFeeOptions}
                      placeholder="Select fee range"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name={["project_mimimal_fee", "currency"]}
                    noStyle
                    // rules={[
                    //   { required: true, message: "Currency is required" },
                    // ]}
                  >
                    <Select
                      options={[
                        { label: "INR", value: "INR" },
                        { label: "USD", value: "USD" },
                      ]}
                      placeholder="Currency"
                      onChange={handleMinimumFeeCurrencyChange}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>
            <Form.Item
              name="product_positionings"
              label="Product/Service Positionings"
            >
              <Select
                mode="multiple"
                options={productPositionings}
                placeholder="Select product/service"
              />
            </Form.Item>
          </Panel>
        </Collapse>
        <br></br>
        {mode === "create" && (
          <Button type="primary" htmlType="submit" loading={loading}>
            Save Form Details
          </Button>
        )}
      </Form>
    </Spin>
  );
};

export default FormDetailsForm;
