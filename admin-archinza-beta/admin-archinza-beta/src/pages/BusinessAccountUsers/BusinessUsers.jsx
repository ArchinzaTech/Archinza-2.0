import React, { useEffect, useState } from "react";
import "./businessUsers.css";
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
  List,
  Tag,
  Dropdown,
  Spin,
  Checkbox,
  Input,
  Select,
  Menu,
  message,
  Collapse,
  Tabs,
} from "antd";
import {
  FilterOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from "@ant-design/icons";
import { Table } from "ant-table-extensions";
import http from "../../helpers/http";
import helper from "../../helpers/helper";
import config from "../../config/config";
import moment from "moment";
import { CSVLink } from "react-csv";
import { hasPermission, isSuperAdmin } from "../../helpers/permissions";
import BusinessUserEditForm from "./BusinessUsersEditForm";
import { jwtDecode } from "jwt-decode";
import BusinessUserCreateModal from "./BusinessUserCreateModal";
import BusinessUserCSVImportModal from "./BusinessUserCSVImportModal";
import { get_messages } from "../../config/permissions";
import SubscriptionLogs from "./SubscriptionLogs";

function BusinessUsers() {
  const [datas, setDatas] = useState([]);
  const [options, setOptions] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [data, setData] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [businessType, setBusinessType] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCountry, setFilterCountry] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);
  const [filterCity, setFilterCity] = useState([]);
  const [filterCategory, setFilterCategory] = useState([]);
  const [businessTypes, setBusinessTypes] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const { Panel } = Collapse;
  const moduleNamePural = "Users";
  const base_url = config.api_url;
  const aws_object_url = config.aws_object_url;
  const token = localStorage.getItem(config.jwt_store_key);
  const userRole = jwtDecode(token);
  const mediaFields = [
    { completed_products_media: "Products/Materials" },
    { project_renders_media: "Projects Photos and Renders" },
    { sites_inprogress_media: "Sites in Progress" },
    { workplace_media: "Workplace Media" },
  ];

  const prepareCSVData = (data) => {
    const dataToExport =
      selectedRowKeys.length > 0
        ? data.filter((item) => selectedRowKeys.includes(item._id))
        : data;

    const csvData = [];
    if (
      !isSuperAdmin(userRole.role) &&
      hasPermission(userRole.role, "download_user_data")
    ) {
      csvData.push([
        "Business Name",
        "Phone Number",
        "Whatsapp Number",
        "Email",
      ]);
      dataToExport.forEach((item) => {
        const maskedPhone = item.phone
          ? helper.maskPhone(`${item.country_code}${item.phone}`)
          : "N/A";

        const maskedWhatsapp = item.whatsapp_no
          ? helper.maskPhone(`${item.whatsapp_country_code}${item.whatsapp_no}`)
          : "N/A";
        const maskedEmail = item.email ? helper.maskEmail(item.email) : "N/A";

        const row = [
          `"${item.business_name || "N/A"}"`,
          `"${maskedPhone || "N/A"}"`,
          `"${maskedWhatsapp || "N/A"}"`,
          `"${maskedEmail || "N/A"}"`,
        ];

        csvData.push(row);
      });
    } else {
      csvData.push([
        "Business Name",
        "Business Types",
        "Country",
        "City",
        "PinCode",
        "Email",
        "Username",
        // "Business Address",
        "Phone Number",
        "Whatsapp Number",
        "Owners",
        "Featured Services",
        "Services",
        "Company Profile Media",
        "Product Catalogue Media",
        "Products/Materials",
        "Projects Photos and Renders",
        "Sites in Progress",
        "Workplace Media",
        "Employees Range",
        "Establishment Year",
        "Minimum Project Fee",
        "Minimum Project Sizes",
        "Project Locations",
        "Project Typologies",
        "Approximate Project Budget",
        "Design Styles",
        "Website Link",
        "Instagram Link",
        "Linkedin Link",
        "Additional Addresses",
        "Product/Market Positionings",
        "Enquiry Preferences",
      ]);
      dataToExport.forEach((item) => {
        const ownerDetails =
          item.owners
            ?.map((owner) => {
              const ownerInfo = `"${[
                `Name: ${owner.name || "N/A"}`,
                `Email: ${owner.email || "N/A"}`,
                owner.phone
                  ? `Phone: ${owner.country_code || ""}${owner.phone}`
                  : "",
                owner.whatsapp_no
                  ? `WhatsApp: ${owner.whatsapp_country_code || ""}${
                      owner.whatsapp_no
                    }`
                  : "",
              ]
                .filter(Boolean)
                .join("; ")}"`;
              return ownerInfo;
            })
            .join("|") || "N/A";

        const supportEmails = item.email_ids?.length
          ? `"${item.email_ids
              .map((email) => `${email.type}: ${email.email}`)
              .join("; ")}"`
          : "N/A";

        const additionalAddresses = item.addresses?.length
          ? `"${item.addresses
              .map((addr) => `${addr.type}: ${addr.address}`)
              .join("; ")}"`
          : "N/A";

        const projectSizes = item.project_sizes?.sizes?.length
          ? `"${item.project_sizes.sizes.join(", ") || ""} ${
              item.project_sizes.unit || ""
            }"`.trim()
          : "N/A";

        const projectFee = item.project_mimimal_fee?.fee
          ? `"${item.project_mimimal_fee.fee} ${
              item.project_mimimal_fee.currency || ""
            }"`.trim()
          : "N/A";

        const avgProjectBudget = item.avg_project_budget?.budget
          ? `"${item.avg_project_budget.budget} ${
              item.avg_project_budget.currency || ""
            }"`.trim()
          : "N/A";
        const companyProfileMediaUrls = item?.company_profile_media
          ? `"${item?.company_profile_media
              ?.map((it) => `${aws_object_url}/business/${it.url}`)
              .join(", ")}"`
          : "N/A";
        const productCataloguesMediaUrls = item?.product_catalogues_media
          ? `"${item?.product_catalogues_media
              ?.map((it) => `${aws_object_url}/business/${it.url}`)
              .join(", ")}"`
          : "N/A";
        const projectRendersMediaUrls = item?.project_renders_media
          ? `"${item?.project_renders_media
              ?.map((it) => `${aws_object_url}/business/${it.url}`)
              .join(", ")}"`
          : "N/A";
        const completedProductsMediaUrls = item?.completed_products_media
          ? `"${item?.completed_products_media
              ?.map((it) => `${aws_object_url}/business/${it.url}`)
              .join(", ")}"`
          : "N/A";
        const sitesInProgressMediaUrls = item?.sites_inprogress_media
          ? `"${item?.sites_inprogress_media
              ?.map((it) => `${aws_object_url}/business/${it.url}`)
              .join(", ")}"`
          : "N/A";
        const workplaceMediaUrls = item?.workplace_media
          ? `"${item?.other_media
              ?.map((it) => `${aws_object_url}/business/${it.url}`)
              .join(", ")}"`
          : "N/A";

        const formatEnquiryPreferences = (preferences) => {
          if (!preferences) return "N/A";
          return Object.entries(preferences)
            .map(([key, value]) => {
              const title = key
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");
              return `${title}: (Contact Person: ${
                value.contact_person || "N/A"
              }, Methods: ${value.contact_methods?.join(", ") || "N/A"})`;
            })
            .join(" | ");
        };

        const row = [
          `"${item.business_name || "N/A"}"`,
          `"${
            [
              ...(item.business_types
                ?.map((type) => type.name)
                .filter((name) => name !== "Others") || []),
              item.other_busiess_type
                ? `Others (${item.other_busiess_type})`
                : null,
            ]
              .filter(Boolean)
              .join(", ") || "N/A"
          }"`,
          `"${item.country || "N/A"}"`,
          `"${item.city || "N/A"}"`,
          `"${item.pincode || "N/A"}"`,
          `"${item.email || "N/A"}"`,
          `"${item.username || "N/A"}"`,
          // `"${item.business_address || "N/A"}"`,
          `"${item.phone ? `${item.country_code}${item.phone}` : "N/A"}"`,
          `"${
            item.whatsapp_no
              ? `${item.whatsapp_country_code}${item.whatsapp_no}`
              : "N/A"
          }"`,
          ownerDetails,
          `"${
            Array.isArray(item.featured_services)
              ? item.featured_services.join(", ")
              : "N/A"
          }"`,
          `"${
            Array.isArray(item.services) ? item.services.join(", ") : "N/A"
          }"`,
          companyProfileMediaUrls,
          productCataloguesMediaUrls,
          completedProductsMediaUrls,
          projectRendersMediaUrls,
          sitesInProgressMediaUrls,
          workplaceMediaUrls,
          `"${item.team_range?.data || "N/A"}"`,
          `"${item.establishment_year?.data || "N/A"}"`,
          projectFee,
          projectSizes,
          `"${item.project_location?.data || "N/A"}"`,
          `"${
            Array.isArray(item.project_typology?.data)
              ? item.project_typology.data.join(", ")
              : "N/A"
          }"`,
          avgProjectBudget,
          `"${
            Array.isArray(item.design_style?.data)
              ? item.design_style.data.join(", ")
              : "N/A"
          }"`,
          `"${item.website_link || "N/A"}"`,
          `"${item.instagram_handle || "N/A"}"`,
          `"${item.linkedin_link || "N/A"}"`,
          additionalAddresses,
          `"${
            Array.isArray(item.product_positionings)
              ? item.product_positionings.join(", ")
              : "N/A"
          }"`,
          `"${formatEnquiryPreferences(item.enquiry_preferences)}"`,
        ];

        csvData.push(row);
      });
    }

    return csvData;
  };

  const handleSearch = (e) => {
    if (e.target.value) {
      setSearchTerm(e.target.value);
      setFilteredData(
        datas.filter((item) => {
          const searchText = e.target.value.toLowerCase();
          const fullPhoneNumber = `${item.country_code}${item.phone}`;
          const fullWANumber = `${item.whatsapp_country_code}${item.whatsapp_no}`;
          if (searchText === "inprogress" || searchText === "in progress") {
            return !["registered", "completed"].includes(
              item.status.toLowerCase()
            );
          }

          return (
            item.business_name?.toLowerCase().includes(searchText) ||
            item.business_type?.toLowerCase().includes(searchText) ||
            item.country?.toLowerCase().includes(searchText) ||
            item.city?.toLowerCase().includes(searchText) ||
            item.pincode?.includes(searchText) ||
            item.status?.toLowerCase().includes(searchText) ||
            item.email?.toLowerCase().includes(searchText) ||
            fullPhoneNumber.includes(searchText) ||
            fullWANumber.includes(searchText)
          );
        })
      );
    } else {
      setSearchTerm("");
      setFilteredData(datas);
    }
  };

  const handleFilterChange = (type, value) => {
    switch (type) {
      case "status":
        setFilterStatus(value);
        break;
      case "category":
        setFilterCategory(value);
        break;
      default:
        break;
    }
  };

  const handleFilterClick = () => {
    setFilterOpen(!filterOpen);
  };

  const fetchData = async () => {
    setLoading(true);
    const data = await http.get(`${base_url}admin/business-users`);
    const business_categories = await http.get(
      base_url + "business/business-types"
    );

    if (data) {
      const deletionRequests = data.data.deletionRequests || [];
      const deletionUserIds = new Set(deletionRequests.map((req) => req.user));
      const updatedUsers = data?.data?.data?.map((user) => {
        if (deletionUserIds.has(user._id)) {
          return { ...user, deletionRequested: true };
        }
        return user;
      });
      setDatas(updatedUsers);
      setFilteredData(updatedUsers);
      setBusinessTypes(
        business_categories.data.map((it) => ({
          text: it.name,
          value: it.name,
          id: it._id,
        }))
      );
      setCsvData(prepareCSVData(updatedUsers));
    }
    setLoading(false);
  };

  const handleView = async (id) => {
    setLoading(true);
    const { data } = await http.get(`${base_url}admin/business-users/${id}`);

    if (data) {
      setLoading(false);
      setData(data);
      setDrawerOpen(true);
    }
  };

  const handleEdit = async (id) => {
    setLoading(true);
    const { data } = await http.get(
      `${base_url}business/business-details/${id}`
    );

    const editRequests = await http.get(
      `${config.api_url}admin/content/options/business-edit-requests/${userRole.id}`
    );
    if (data) {
      setEditData({ ...data, editRequests: editRequests?.data });
      setEditOpen(true);
    }
    setLoading(false);
  };

  const handleMediaDataUpdate = async (updatedData) => {
    setEditData(updatedData);
    await fetchData();
    setEditOpen(true);
  };

  const handleEditSubmit = async (values) => {
    setLoading(true);
    const response = await http.post(
      `${base_url}business/business-details/${editData._id}`,
      values
    );

    if (response?.data) {
      http.post(`${config.api_url}admin/logs`, {
        user: userRole.id,
        action_type: "EDIT",
        module: "Business",
        subModule: "Registered Users",
        details: helper.captureBasicUserDetailsBusiness([values]),
        status: "SUCCESS",
      });
    } else {
      http.post(`${config.api_url}admin/logs`, {
        user: userRole.id,
        action_type: "EDIT",
        module: "Business",
        subModule: "Registered Users",
        details: helper.captureBasicUserDetailsBusiness([values]),
        status: "FAILURE",
      });
    }
    await fetchData();
    setEditOpen(false);
    setEditData(null);
    setLoading(false);
  };

  const renderMediaItems = (mediaArray, aws_object_url) => {
    if (!mediaArray?.length) return "N/A";

    const renderItem = (media, mediaIndex) => (
      <div key={mediaIndex} style={{ marginBottom: "8px" }}>
        <a
          href={`${aws_object_url}/business/${media.url}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#1890ff", marginRight: "8px" }}
        >
          {media.name}
        </a>
        {mediaIndex < mediaArray.length - 1 && <hr />}
      </div>
    );

    if (mediaArray.length <= 5) {
      return mediaArray.map((media, mediaIndex) =>
        renderItem(media, mediaIndex)
      );
    }

    return (
      <>
        {mediaArray
          .slice(0, 5)
          .map((media, mediaIndex) => renderItem(media, mediaIndex))}
        <Collapse>
          <Panel header={`Show all ${mediaArray.length} items`} key="1">
            {mediaArray.map((media, mediaIndex) =>
              renderItem(media, mediaIndex)
            )}
          </Panel>
        </Collapse>
      </>
    );
  };

  const handleDrawerClose = () => {
    setData({});
    setDrawerOpen(false);
  };

  const handleEditClose = () => {
    setEditData(null);
    setEditOpen(false);
  };

  const handleBulkDelete = () => {
    // Filter out users that already have deletion requested
    const eligibleUsers = filteredData.filter(
      (item) => selectedRowKeys.includes(item._id) && !item.deletionRequested
    );

    const alreadyRequestedCount = selectedRowKeys.length - eligibleUsers.length;
    let messages = {};
    let hasDeleteAccess = false;
    if (
      isSuperAdmin(userRole.role) ||
      hasPermission(userRole.role, "delete_personal")
    ) {
      messages.popup = get_messages({ key: "delete_personal" }).multiple_delete;
      messages.success = get_messages({
        key: "delete_personal",
        count: eligibleUsers.length,
      }).multiple_delete_success;
      messages.content = get_messages({
        key: "delete_personal",
        count: eligibleUsers.length,
      }).multiple_delete_content;
      hasDeleteAccess = true;
    } else if (hasPermission(userRole.role, "create_delete_request_personal")) {
      messages.popup = get_messages({
        key: "create_delete_request_personal",
      }).multiple_delete;
      messages.success = get_messages({
        key: "create_delete_request_personal",
        count: eligibleUsers.length,
      }).multiple_delete_success;
      messages.content = get_messages({
        key: "create_delete_request_personal",
        count: eligibleUsers.length,
      }).multiple_delete_content;
    }

    let content = messages.content;

    if (alreadyRequestedCount > 0) {
      content += ` ${alreadyRequestedCount} record(s) already have deletion requests and will be skipped.`;
    }

    if (eligibleUsers.length === 0) {
      Modal.warning({
        title: "No Records to Delete",
        content: "All selected records already have deletion requests.",
      });
      return;
    }

    Modal.confirm({
      title: "Bulk Delete Users",
      content: (
        <div>
          <p>{messages.popup}</p>
          <p>{content}</p>
          <p>Do you want to continue?</p>
        </div>
      ),
      okText: "Yes, Continue",
      cancelText: "Cancel",
      okType: "danger",
      onOk: async () => {
        try {
          // setloading(true);

          const userIds = eligibleUsers.map((user) => user._id);
          if (hasDeleteAccess) {
            await http.put(`${base_url}admin/business-users/delete-users`, {
              users: userIds,
            });
          } else {
            await http.put(`${base_url}admin/business-users/delete-request`, {
              users: userIds,
              roleUser: userRole?._id,
            });
          }
          // Send bulk delete request with eligible user IDs
          // await http.post(`${base_url}/bulk-delete`, { userIds });

          Modal.success({
            title: "Success",
            content: messages.success,
          });

          // Clear selection and refresh data
          setSelectedRowKeys([]);
          // fetchDatas();
        } catch (error) {
          Modal.error({
            title: "Error",
            content: "Failed to send bulk deletion requests. Please try again.",
          });
        } finally {
          // setloading(false);
        }
      },
    });
  };

  const handleMenuClick = (e, optionKey) => {
    setMenuOpen(true);
    const checkboxGroup = e.target.nextElementSibling;
    if (checkboxGroup) {
      checkboxGroup.style.display =
        checkboxGroup.style.display === "block" ? "none" : "block";
    }
  };

  const handleDeleteUser = (user) => {
    let messages = { popup: "", success: "" };
    let hasDeleteAccess = false;

    if (
      isSuperAdmin(userRole.role) ||
      hasPermission(userRole.role, "delete_business")
    ) {
      messages.popup = get_messages({ key: "delete_business" }).single_delete;
      messages.success = get_messages({
        key: "delete_business",
        count: 1,
      }).single_delete_success;
      hasDeleteAccess = true;
    } else if (hasPermission(userRole.role, "create_delete_request_business")) {
      messages.popup = get_messages({
        key: "create_delete_request_business",
      }).single_delete;
      messages.success = get_messages({
        key: "create_delete_request_business",
        count: 1,
      }).single_delete_success;
    }
    Modal.confirm({
      title: "Delete User",
      content: <span>{messages.popup}</span>,
      okText: "Yes, Continue",
      cancelText: "Cancel",
      okType: "danger",
      onOk: async () => {
        try {
          setLoading(true);
          if (hasDeleteAccess) {
            const response = await http.put(
              `${base_url}admin/business-users/delete-users`,
              {
                users: [user._id],
              }
            );
            if (response?.data) {
              http.post(`${config.api_url}admin/logs`, {
                user: userRole.id,
                action_type: "DELETE",
                module: "Business",
                subModule: "Registered Users",
                status: "SUCCESS",
                details: helper.captureBasicUserDetailsBusiness([user]),
              });
            } else {
              http.post(`${config.api_url}admin/logs`, {
                user: userRole.id,
                action_type: "DELETE",
                module: "Business",
                subModule: "Registered Users",
                status: "FAILURE",
                details: helper.captureBasicUserDetailsBusiness([user]),
              });
            }
          } else {
            const response = await http.put(
              `${base_url}admin/business-users/delete-request`,
              {
                users: [user._id],
                roleUser: userRole?.id,
              }
            );

            if (response?.data) {
              http.post(`${config.api_url}admin/logs`, {
                user: userRole.id,
                action_type: "REQUEST_DELETE",
                module: "Business",
                subModule: "Registered Users",
                status: "SUCCESS",
                details: helper.captureBasicUserDetailsBusiness([user]),
              });
            } else {
              http.post(`${config.api_url}admin/logs`, {
                user: userRole.id,
                action_type: "REQUEST_DELETE",
                module: "Business",
                subModule: "Registered Users",
                status: "FAILURE",
                details: helper.captureBasicUserDetailsBusiness([user]),
              });
            }
          }
          Modal.success({
            title: "Success",
            content: <span>{messages.success}</span>,
          });
          fetchData(); // Refresh the table
        } catch (error) {
          Modal.error({
            title: "Error",
            content: "Failed to send deletion request. Please try again.",
          });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const columns = [
    {
      title: "Business Name",
      dataIndex: "business_name",
      key: "business_name",
      sorter: (a, b) => a.business_name?.localeCompare(b.business_name),
      render: (text, record) => (
        <div>
          {text}
          {record.deletionRequested && (
            <Tag color="pink" size="small" style={{ marginLeft: 8 }}>
              Deletion Requested
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email?.localeCompare(b.email),
      render: (text) => {
        if (
          !isSuperAdmin(userRole.role) &&
          hasPermission(userRole.role, "download_user_data")
        ) {
          return helper.maskEmail(text);
        }
        return text;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => {
        if (!["registered", "completed"].includes(record.status)) {
          return <Tag color="yellow">In Progress</Tag>;
        }
        return (
          <Tag color={record.status === "registered" ? "blue" : "green"}>
            {capitalizeWords(record.status)}
          </Tag>
        );
      },
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
          <Button
            type="primary"
            onClick={() => {
              handleView(record._id);
            }}
          >
            View Detail
          </Button>
          {(hasPermission(userRole.role, "edit_business_user") ||
            hasPermission(userRole.role, "edit_business_user_advanced")) && (
            <>
              <Button type="default" onClick={() => handleEdit(record._id)}>
                Edit
              </Button>
              <Button
                danger
                disabled={record.deletionRequested}
                onClick={() => handleDeleteUser(record)}
              >
                {record.deletionRequested ? "Delete Requested" : "Delete"}
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  const filterOptions = [
    {
      label: "Category",
      key: "category",
      children: businessTypes || [],
    },
    {
      label: "Status",
      key: "status",
      children: [
        {
          text: "Registered",
          value: "registered",
        },
        {
          text: "Completed",
          value: "completed",
        },
        {
          text: "In Progress",
          value: "inprogress",
        },
      ],
    },
  ];

  const menuItems = filterOptions.map((option) => ({
    key: option.key,
    label: (
      <div>
        <div
          style={{ fontWeight: "bold", cursor: "pointer" }}
          onClick={(e) => handleMenuClick(e, option.key)}
        >
          {option.label}
        </div>
        {option.key === "status" && filterStatus.length > 0 && (
          <span style={{ marginLeft: 10, fontSize: 12 }}>
            ({filterStatus.length} selected)
          </span>
        )}
        {option.key === "category" && filterCategory.length > 0 && (
          <span style={{ marginLeft: 10, fontSize: 12 }}>
            ({filterCategory.length} selected)
          </span>
        )}
        <Select
          mode="multiple"
          value={option.key === "status" ? filterStatus : filterCategory}
          onChange={(value) => handleFilterChange(option.key, value)}
          style={{ width: 200 }}
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
        >
          {option.children.map((child) => (
            <Select.Option value={child.value}>{child.text}</Select.Option>
          ))}
        </Select>
      </div>
    ),
  }));

  const handleCapture = async () => {
    const selectedValues = {
      status: filterStatus,
      business_types: filterCategory,
    };
    const query = {};

    Object.keys(selectedValues).forEach((key) => {
      if (selectedValues[key].length > 0) {
        if (key === "business_types") {
          query[key] = selectedValues[key]
            .map((value) => {
              const businessType = businessTypes.find(
                (bt) => bt.value === value
              );
              return businessType ? businessType.id : null;
            })
            .filter((id) => id)
            .join(",");
        } else {
          query[key] = selectedValues[key]
            .map((value) => encodeURIComponent(value))
            .join(",");
        }
      }
    });

    const queryString = Object.keys(query)
      .map((key) => `${key}=${query[key]}`)
      .join("&");

    const { data } = await http.get(`${base_url}business/users?${queryString}`);

    setFilteredData(data);
    setCsvData(prepareCSVData(data));
    setFilterOpen(!filterOpen);
  };

  const handleCreateModalOpen = () => setCreateModalOpen(true);

  const handleCreateModalClose = () => {
    setCreateModalOpen(false);
    fetchData();
  };

  const handleResetFilters = () => {
    setFilterStatus([]);
    setFilterCategory([]);
    setFilteredData(datas);
    setFilterOpen(false);
  };

  const capitalizeWords = (value) => {
    if (typeof value === "string") {
      return value
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
    }
    return value;
  };

  const menuProps = {
    items: [
      ...menuItems,
      {
        key: "update",
        label: (
          <Button type="primary" size="small" onClick={handleCapture}>
            Apply Filters
          </Button>
        ),
      },
      {
        key: "reset",
        label: (
          <Button size="small" onClick={handleResetFilters}>
            Reset Filters
          </Button>
        ),
      },
    ],
    onOpenChange: (open) => {
      setMenuOpen(open);
    },
    open: menuOpen,
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Breadcrumb
        style={{ margin: "16px 0" }}
        items={[
          {
            title: "Dashboard",
          },
          {
            title: "Business Flow",
          },
          {
            title: moduleNamePural,
          },
        ]}
      />
      <Row>
        <Col span={24}>
          <div className="site-card-border-less-wrapper">
            <Card
              title={moduleNamePural}
              bordered={false}
              extra={
                selectedRowKeys.length > 0 && (
                  <Button danger onClick={handleBulkDelete}>
                    Delete Selected ({selectedRowKeys.length})
                  </Button>
                )
              }
            >
              <Space direction="horizontal" size="middle">
                {hasPermission(
                  userRole.role,
                  "edit_business_user_advanced"
                ) && (
                  <>
                    <Button
                      type="primary"
                      // style={{ marginBottom: 16 }}
                      onClick={handleCreateModalOpen}
                    >
                      Create User
                    </Button>
                    <Button onClick={() => setImportModalOpen(true)}>
                      Import from CSV
                    </Button>
                  </>
                )}
                {(isSuperAdmin(userRole.role) ||
                  !hasPermission(userRole.role, "view_all")) && (
                  <Button
                    onClick={() => {
                      // Prepare CSV data only for selected rows if any are selected
                      const dataToExport =
                        selectedRowKeys.length > 0
                          ? filteredData.filter((item) =>
                              selectedRowKeys.includes(item._id)
                            )
                          : filteredData;

                      const exportData = prepareCSVData(dataToExport);
                      const csvString = exportData
                        .map((row) =>
                          row?.map((cell) => cell?.toString()).join(",")
                        )
                        .join("\n");

                      const blob = new Blob([csvString], {
                        type: "text/csv;charset=utf-8;",
                      });
                      const link = document.createElement("a");
                      link.href = URL.createObjectURL(blob);
                      link.setAttribute("download", "Business Flow Users.csv");
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    Export to CSV{" "}
                    {selectedRowKeys.length > 0 &&
                      `(${selectedRowKeys.length} selected)`}
                  </Button>
                )}
                <Dropdown
                  menu={menuProps}
                  open={filterOpen}
                  onOpenChange={handleFilterClick}
                >
                  <Button>
                    <Space>
                      Filter
                      <FilterOutlined />
                    </Space>
                  </Button>
                </Dropdown>
                <Input
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder="Search..."
                  style={{ width: "600px", float: "right" }}
                />
              </Space>
              <Table
                rowKey={(record) => record._id}
                columns={columns}
                dataSource={filteredData}
                loading={loading}
                rowSelection={{
                  selectedRowKeys,
                  onChange: (newSelectedRowKeys) => {
                    setSelectedRowKeys(newSelectedRowKeys);
                  },
                }}
                rowClassName={(record) =>
                  record.deletionRequested ? "deletion-requested-row" : ""
                }
              />
            </Card>

            <Drawer
              title="User Details"
              placement="right"
              onClose={handleDrawerClose}
              open={drawerOpen}
              size="large"
              width={1000}
              loading={loading}
            >
              {data && (
                <Tabs defaultActiveKey="1">
                  <Tabs.TabPane tab="User Details" key="1">
                    <div>
                      <h3 style={{ marginBottom: "16px" }}>User Input Data</h3>
                      <Descriptions
                        bordered
                        column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
                        size="small"
                      >
                        <Descriptions.Item label="Business Types">
                          {[
                            ...(data?.business_types
                              ?.map((it) => it.name)
                              .filter((name) => name !== "Others") || []),
                            data?.other_busiess_type
                              ? `Others (${data.other_busiess_type})`
                              : null,
                          ]
                            .filter(Boolean)
                            .join(", ") || "N/A"}
                        </Descriptions.Item>

                        <Descriptions.Item label="Onboarded From">
                          {data?.onboarding_source
                            ? helper.convertToTitleCase(data?.onboarding_source)
                            : "Web"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Business Name">
                          {data.business_name || "N/A"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Email">
                          {data.email
                            ? !isSuperAdmin(userRole.role) &&
                              hasPermission(userRole.role, "download_user_data")
                              ? helper.maskEmail(data.email)
                              : data.email
                            : "N/A"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Username">
                          {data.username || "N/A"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Phone">
                          {data.phone
                            ? !isSuperAdmin(userRole.role) &&
                              hasPermission(userRole.role, "download_user_data")
                              ? helper.maskPhone(data.country_code + data.phone)
                              : data.country_code + data.phone
                            : "N/A"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Whatsapp No">
                          {data.whatsapp_no
                            ? !isSuperAdmin(userRole.role) &&
                              hasPermission(userRole.role, "download_user_data")
                              ? helper.maskPhone(
                                  data.whatsapp_country_code + data.whatsapp_no
                                )
                              : data.whatsapp_country_code + data.whatsapp_no
                            : "N/A"}
                        </Descriptions.Item>
                        <Descriptions.Item label="City">
                          {data.city || "N/A"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Country">
                          {data.country || "N/A"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Pincode">
                          {data.pincode || "N/A"}
                        </Descriptions.Item>
                        {/* <Descriptions.Item label="Business Address">
                      {data.business_address || "N/A"}
                    </Descriptions.Item> */}
                        <Descriptions.Item label="Status">
                          {capitalizeWords(data?.status) || "N/A"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Profile Status">
                          {capitalizeWords(data?.pageStatus) || "N/A"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Verification Status">
                          {capitalizeWords(data?.verificationData?.status) ||
                            "Not Applied"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Created At">
                          {helper.ISTDate(data.createdAt)}
                        </Descriptions.Item>
                      </Descriptions>

                      {(isSuperAdmin(userRole.role) ||
                        hasPermission(
                          userRole.role,
                          "edit_business_user_advanced"
                        ) ||
                        hasPermission(userRole.role, "edit_business_user")) && (
                        <>
                          <h3 style={{ margin: "24px 0 16px" }}>
                            Scraped Content
                          </h3>
                          <Descriptions
                            bordered
                            column={{
                              xxl: 1,
                              xl: 1,
                              lg: 1,
                              md: 1,
                              sm: 1,
                              xs: 1,
                            }}
                            size="small"
                          >
                            <Descriptions.Item
                              label="Bio"
                              style={{
                                wordWrap: "break-word",
                                whiteSpace: "normal",
                                maxWidth: "300px",
                              }}
                            >
                              {data.bio || "N/A"}
                            </Descriptions.Item>
                            <Descriptions.Item
                              label="Google Location"
                              style={{
                                wordWrap: "break-word",
                                whiteSpace: "normal",
                                maxWidth: "300px",
                              }}
                            >
                              {data?.google_location?.latitude &&
                              data?.google_location?.longitude
                                ? `${data.google_location.latitude}, ${data.google_location.longitude}`
                                : "N/A"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Products/Materials">
                              {renderMediaItems(
                                data?.completed_products_media,
                                aws_object_url
                              )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Projects Photos and Renders">
                              {renderMediaItems(
                                data?.project_renders_media,
                                aws_object_url
                              )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Sites in Progress">
                              {renderMediaItems(
                                data?.sites_inprogress_media,
                                aws_object_url
                              )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Eliminated Media">
                              {renderMediaItems(
                                data?.eliminate_media,
                                aws_object_url
                              )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Other Media">
                              {renderMediaItems(
                                data?.other_media,
                                aws_object_url
                              )}
                            </Descriptions.Item>
                            <Descriptions.Item
                              label="City"
                              style={{
                                wordWrap: "break-word",
                                whiteSpace: "normal",
                                maxWidth: "300px",
                              }}
                            >
                              {data.scraped_city || "N/A"}
                            </Descriptions.Item>
                            <Descriptions.Item
                              label="Country"
                              style={{
                                wordWrap: "break-word",
                                whiteSpace: "normal",
                                maxWidth: "300px",
                              }}
                            >
                              {data.scraped_country || "N/A"}
                            </Descriptions.Item>
                            <Descriptions.Item
                              label="Pincode"
                              style={{
                                wordWrap: "break-word",
                                whiteSpace: "normal",
                                maxWidth: "300px",
                              }}
                            >
                              {data.scraped_pincode || "N/A"}
                            </Descriptions.Item>
                          </Descriptions>

                          <h3 style={{ margin: "24px 0 16px" }}>Form Details</h3>
                          <Descriptions
                            bordered
                            column={{
                              xxl: 1,
                              xl: 1,
                              lg: 1,
                              md: 1,
                              sm: 1,
                              xs: 1,
                            }}
                            size="small"
                          >
                            <Descriptions.Item label={"Owner Details"}>
                              {data?.owners?.length
                                ? data?.owners?.map((owner, index) => (
                                    <div
                                      key={index}
                                      style={{ marginBottom: "8px" }}
                                    >
                                      <strong>{owner.name}</strong>
                                      <br />
                                      <span>
                                        Email:{" "}
                                        <a href={`mailto:${owner.email}`}>
                                          {owner.email}
                                        </a>
                                      </span>
                                      <br />
                                      <span>
                                        Phone: {""}
                                        <a
                                          href={`tel:${owner.country_code}${owner.phone}`}
                                        >{`${owner.country_code}${owner.phone}`}</a>
                                      </span>
                                      <br />
                                      <span>
                                        WhatsApp:{" "}
                                        <a
                                          href={`tel:${owner.whatsapp_country_code}${owner.whatsapp_no}`}
                                        >{`${owner.whatsapp_country_code}${owner.whatsapp_no}`}</a>
                                      </span>
                                      {index < data.owners.length - 1 && <hr />}
                                    </div>
                                  ))
                                : "N/A"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Top 5 products/services">
                              {data.featured_services?.join(" | ") || "N/A"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Other Services">
                              {data.services?.join(" | ") || "N/A"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Project Scope Preferences">
                              {data?.project_scope?.data?.join(" | ") || "N/A"}
                            </Descriptions.Item>
                            <Descriptions.Item label={"Website Link"}>
                              {data?.website_link ? (
                                <a
                                  href={
                                    data?.website_link.startsWith("http://") ||
                                    data?.website_link.startsWith("https://")
                                      ? data?.website_link
                                      : "https://" + data?.website_link
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {data?.website_link}
                                </a>
                              ) : (
                                "N/A"
                              )}
                            </Descriptions.Item>
                            <Descriptions.Item label={"Linkedin Link"}>
                              {data?.linkedin_link ? (
                                <a
                                  href={
                                    data?.linkedin_link.startsWith(
                                      "http://"
                                    ) ||
                                    data?.linkedin_link.startsWith("https://")
                                      ? data?.linkedin_link
                                      : "https://" + data?.linkedin_link
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {data?.linkedin_link}
                                </a>
                              ) : (
                                "N/A"
                              )}
                            </Descriptions.Item>
                            <Descriptions.Item label={"Instagram Handle"}>
                              {data?.instagram_handle ? (
                                <a
                                  href={
                                    data?.instagram_handle.startsWith(
                                      "http://"
                                    ) ||
                                    data?.instagram_handle.startsWith(
                                      "https://"
                                    )
                                      ? data?.instagram_handle
                                      : "https://" + data?.instagram_handle
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {data?.instagram_handle}
                                </a>
                              ) : (
                                "N/A"
                              )}
                            </Descriptions.Item>
                            <Descriptions.Item
                              label={"Company Profile Uploads"}
                            >
                              {data?.company_profile_media?.length
                                ? data?.company_profile_media?.map(
                                    (media, index) => (
                                      <div
                                        key={index}
                                        style={{ marginBottom: "8px" }}
                                      >
                                        <a
                                          href={`${aws_object_url}/business/${media.url}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          style={{
                                            color: "#1890ff",
                                            marginRight: "8px",
                                          }}
                                        >
                                          {media.name}
                                        </a>
                                        {index <
                                          data.company_profile_media.length -
                                            1 && <hr />}
                                      </div>
                                    )
                                  )
                                : "N/A"}
                            </Descriptions.Item>
                            <Descriptions.Item label={"Product Catalogues"}>
                              {data?.product_catalogues_media?.length
                                ? data?.product_catalogues_media?.map(
                                    (media, index) => (
                                      <div
                                        key={index}
                                        style={{ marginBottom: "8px" }}
                                      >
                                        <a
                                          href={`${aws_object_url}/business/${media.url}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          style={{
                                            color: "#1890ff",
                                            marginRight: "8px",
                                          }}
                                        >
                                          {media.name}
                                        </a>
                                        {index <
                                          data.product_catalogues_media.length -
                                            1 && <hr />}
                                      </div>
                                    )
                                  )
                                : "N/A"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Year of Establishment">
                              {data.establishment_year?.data || "N/A"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Number of Team Members">
                              {data.team_range?.data || "N/A"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Minimum Project Size">
                              {data?.project_sizes?.sizes?.length
                                ? data?.project_sizes?.sizes
                                    ?.map(
                                      (size) =>
                                        `${size} ${data.project_sizes.unit}`
                                    )
                                    .join(" | ")
                                : "N/A"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Project/Client Location Preference">
                              {data?.project_location?.data || "N/A"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Renovation Work">
                              {data?.renovation_work ? "Yes" : "No"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Project Typologies">
                              {data?.project_typology?.data?.join(" | ") ||
                                "N/A"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Product/Service Design Style">
                              {data?.design_style?.data?.join(" | ") || "N/A"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Approximate Budget of Projects">
                              {data?.avg_project_budget?.budgets?.join(
                                " | "
                              ) || "N/A"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Current Minimal Project Fee">
                              {data?.project_mimimal_fee?.fee}
                            </Descriptions.Item>
                            <Descriptions.Item label="Product/Market Positionings">
                              {data?.product_positionings?.join(" | ") || "N/A"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Enquiry Preferences">
                              {data?.enquiry_preferences ? (
                                <div>
                                  {Object.entries(
                                    data.enquiry_preferences
                                  ).map(([key, value]) => {
                                    const title = key
                                      .split("_")
                                      .map(
                                        (word) =>
                                          word.charAt(0).toUpperCase() +
                                          word.slice(1)
                                      )
                                      .join(" ");

                                    return (
                                      <div
                                        key={key}
                                        style={{ marginBottom: "15px" }}
                                      >
                                        <strong>{title}</strong>
                                        <div style={{ marginLeft: "10px" }}>
                                          <div>
                                            Contact Person:{" "}
                                            {value.contact_person || "N/A"}
                                          </div>
                                          <div>
                                            Contact Methods:{" "}
                                            {value.contact_methods?.length
                                              ? value.contact_methods.join(
                                                  ", "
                                                )
                                              : "N/A"}
                                          </div>
                                        </div>
                                        {key !== "media_pr" && <hr />}
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                "N/A"
                              )}
                            </Descriptions.Item>
                            {/* <Descriptions.Item label="Business hours">
                      {data?.product_positionings || "N/A"}
                    </Descriptions.Item> */}
                          </Descriptions>
                        </>
                      )}
                    </div>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="Subscription Logs" key="2">
                    <SubscriptionLogs userId={data._id} />
                  </Tabs.TabPane>
                </Tabs>
              )}
            </Drawer>

            <Drawer
              title="Edit User"
              placement="right"
              onClose={handleEditClose}
              open={editOpen}
              size="large"
              width={800}
            >
              {editData && (
                <BusinessUserEditForm
                  initialData={editData}
                  onSubmit={handleEditSubmit}
                  onCancel={handleEditClose}
                  onMediaUpdate={handleMediaDataUpdate}
                  admin={userRole}
                />
              )}
            </Drawer>
            <BusinessUserCreateModal
              open={createModalOpen}
              onClose={handleCreateModalClose}
              admin={userRole}
            />
            <BusinessUserCSVImportModal
              open={importModalOpen}
              onClose={() => {
                setImportModalOpen(false);
                fetchData();
              }}
              admin={userRole}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default BusinessUsers;
