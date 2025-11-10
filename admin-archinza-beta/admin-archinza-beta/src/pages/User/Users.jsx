import React, { useEffect, useState } from "react";
import "./users.css";
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
  Select,
  Dropdown,
  Input,
} from "antd";
import {
  FilterOutlined,
  DownloadOutlined,
  EditOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { Table } from "ant-table-extensions";
import http from "../../helpers/http";
import helper from "../../helpers/helper";
import config from "../../config/config";
import moment from "moment";
import { CSVLink } from "react-csv";
import PersonalUserEditModal from "./PersonalUserEditModal";
import { jwtDecode } from "jwt-decode";
import PersonalUserCreateModal from "./PersonalUserCreateModal";
import PersonalUserCSVImportModal from "./PersonalUserCSVImportModal";
import { hasPermission, isSuperAdmin } from "../../helpers/permissions";
import { get_messages } from "../../config/permissions";

function Index() {
  const [loading, setloading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [datas, setDatas] = useState([]);
  const [data, setData] = useState({});
  const [proData, setProData] = useState({});
  const [proEntries, setProEntries] = useState([]);
  const [drawerOpen, setdraweropen] = useState(false);
  const [isProDrawerOpen, setIsProDrawerOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterStatuses, setFilterStatuses] = useState([]);
  const [filterUserTypes, setFilterUserTypes] = useState([]);
  const [filterOnboardedTypes, setFilterOnboardedTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [rolePermissions, setRolePermissions] = useState();

  const moduleNamePural = "Users";
  const base_url = config.api_url + "admin/users"; //without trailing slash
  const image_url = config.api_url + ""; //with trailing slash

  const token = localStorage.getItem(config.jwt_store_key);
  const userRole = jwtDecode(token);
  // Handle filter update
  const handleFilterUpdate = () => {
    fetchDatas(filterStatus);
    setFilterOpen(false);
  };

  // Handle filter reset
  const handleFilterReset = () => {
    setFilterStatus(null);
    fetchDatas(); // Fetch all data
    setFilterOpen(false);
  };

  const onboardedTypeOptions = [
    { label: "Web", value: "web" },
    { label: "Bot", value: "bot" },
    { label: "CMS", value: "cms" },
  ];

  const applyFilters = () => {
    let result = datas;
    // Status filter
    if (filterStatuses.length > 0) {
      result = result.filter((item) => {
        // Get the most recent proAccessEntry
        const sortedProEntries = [...(item.proAccessEntry || [])].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        const mostRecentEntry = sortedProEntries[0];

        if (!mostRecentEntry) {
          return filterStatuses.includes("registered");
        }

        // Map 'partially' status to 'in progress'
        const status =
          mostRecentEntry.status === "completed" ||
          mostRecentEntry.status === "registered"
            ? mostRecentEntry.status
            : "partially";

        return filterStatuses.includes(status);
      });
    }

    // User Type filter
    if (filterUserTypes.length > 0) {
      result = result.filter((item) => {
        if (item.proAccessEntry && item.proAccessEntry.length) {
          return filterUserTypes?.includes(item?.user_type);
        }
      });
    }

    // Onboarded Type filter
    if (filterOnboardedTypes.length > 0) {
      result = result.filter((item) =>
        filterOnboardedTypes.includes(
          (item.onboarding_source || "web").toLowerCase()
        )
      );
    }

    // Search filter (if search term exists)
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      result = result.filter((item) => {
        const fullPhone = item.country_code + item.phone;
        const fullWhatsapp = item.whatsapp_country_code + item.whatsapp_no;

        return (
          item.name.toLowerCase().includes(searchTermLower) ||
          item.email.toLowerCase().includes(searchTermLower) ||
          item.country.toLowerCase().includes(searchTermLower) ||
          item.city.toLowerCase().includes(searchTermLower) ||
          fullPhone.includes(searchTermLower) ||
          fullWhatsapp.includes(searchTermLower)
        );
      });
    }

    setFilteredData(result);
    setFilterOpen(false);
  };

  const resetFilters = () => {
    setFilterStatuses([]);
    setFilterUserTypes([]);
    setFilterOnboardedTypes([]);
    setFilteredData(datas);
    setSearchTerm("");
    setFilterOpen(false);
  };

  const statusFilterItems = [
    {
      key: "completed",
      label: "Completed",
    },
    {
      key: "registered",
      label: "Not Filled",
    },
    {
      key: "partially",
      label: "Partially Filled",
    },
  ];

  const userTypes = {
    DE: "Design Enthusiast",
    BO: "Business / Firm Owner",
    TM: "Working Professional",
    ST: "Student",
    FL: "Freelancer / Artist",
  };

  const menuProps = {
    items: [
      {
        key: "statusFilter",
        label: (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontWeight: "bold", marginBottom: 8 }}>Status</div>
            <Select
              mode="multiple"
              style={{ width: 200 }}
              placeholder="Select Status"
              value={filterStatuses}
              onChange={(value) => setFilterStatuses(value)}
              optionLabelProp="label"
            >
              <Select.Option
                key="completed"
                value="completed"
                label="Completed"
              >
                Completed
              </Select.Option>
              <Select.Option
                key="registered"
                value="registered"
                label="Not Filled"
              >
                Not Filled
              </Select.Option>
              <Select.Option
                key="partially"
                value="partially"
                label="Partially Filled"
              >
                Partially Filled
              </Select.Option>
            </Select>
          </div>
        ),
      },
      {
        key: "userTypeFilter",
        label: (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontWeight: "bold", marginBottom: 8 }}>
              User Types
            </div>
            <Select
              mode="multiple"
              style={{ width: 200 }}
              placeholder="Select User Types"
              value={filterUserTypes}
              onChange={(value) => setFilterUserTypes(value)}
              optionLabelProp="label"
              tagRender={(props) => {
                const { label, closable, onClose } = props;
                return (
                  <Tag
                    closable={closable}
                    onClose={onClose}
                    style={{ margin: "2px" }}
                  >
                    {label}
                  </Tag>
                );
              }}
              dropdownRender={(menu) => (
                <div style={{ maxHeight: 200, overflowY: "auto" }}>{menu}</div>
              )}
            >
              {Object.entries(userTypes).map(([key, value]) => (
                <Select.Option key={key} value={key} label={value}>
                  {value}
                </Select.Option>
              ))}
            </Select>
          </div>
        ),
      },
      {
        key: "onboardedTypeFilter",
        label: (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontWeight: "bold", marginBottom: 8 }}>
              Onboarded Types
            </div>
            <Select
              mode="multiple"
              style={{ width: 200 }}
              placeholder="Select Onboarded Types"
              value={filterOnboardedTypes}
              onChange={setFilterOnboardedTypes}
              optionLabelProp="label"
              tagRender={(props) => {
                const { label, closable, onClose } = props;
                return (
                  <Tag
                    closable={closable}
                    onClose={onClose}
                    style={{ margin: "2px" }}
                  >
                    {label}
                  </Tag>
                );
              }}
              dropdownRender={(menu) => (
                <div style={{ maxHeight: 200, overflowY: "auto" }}>{menu}</div>
              )}
            >
              {onboardedTypeOptions.map((opt) => (
                <Select.Option
                  key={opt.value}
                  value={opt.value}
                  label={opt.label}
                >
                  {opt.label}
                </Select.Option>
              ))}
            </Select>
          </div>
        ),
      },
      {
        key: "actions",
        label: (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              alignItems: "flex-start",
            }}
          >
            <Button
              type="primary"
              size="small"
              onClick={applyFilters}
              disabled={
                filterStatuses.length === 0 &&
                filterUserTypes.length === 0 &&
                filterOnboardedTypes.length === 0
              }
              style={{ width: "auto", minWidth: 100 }}
            >
              Apply Filters
            </Button>
            <Button
              size="small"
              onClick={resetFilters}
              style={{ width: "auto", minWidth: 100 }}
            >
              Reset Filters
            </Button>
          </div>
        ),
      },
    ],
    onOpenChange: (open) => {
      setFilterOpen(open);
    },
  };

  const csvData = (
    selectedRowKeys.length > 0
      ? filteredData.filter((item) => selectedRowKeys.includes(item._id))
      : filteredData
  ).map((item) => {
    if (
      !isSuperAdmin(userRole.role) &&
      hasPermission(userRole.role, "download_user_data")
    ) {
      return {
        Name: item.name,
        Email: helper.maskEmail(item.email),
        // "User Type": userTypes[item.user_type] || "NA",
        "Phone Number": helper.maskPhone(item.country_code + item.phone),
        "Whatsapp Number": helper.maskPhone(
          item.whatsapp_country_code + item.whatsapp_no
        ),
      };
    }
    // Get the most recent proAccessEntry
    const sortedProEntries = [...(item.proAccessEntry || [])].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    const mostRecentEntry = sortedProEntries[0];

    // Find entries for specific user types
    const studentEntry = sortedProEntries.find(
      (entry) => entry.user_type === "ST"
    );
    const workingProfEntry = sortedProEntries.find(
      (entry) => entry.user_type === "TM"
    );
    const businessOwnerEntry = sortedProEntries.find(
      (entry) => entry.user_type === "BO"
    );
    const freelancerEntry = sortedProEntries.find(
      (entry) => entry.user_type === "FL"
    );

    return {
      Name: item.name,
      Email: item.email,
      "User Type": userTypes[item.user_type] || "NA",
      Phone: item.country_code + item.phone,
      "Whatsapp Number": item.whatsapp_country_code + item.whatsapp_no,
      Country: item.country,
      City: item.city,
      Pincode: item.pincode,
      "Pro Access Status":
        mostRecentEntry?.status === "completed" ||
        mostRecentEntry?.status === "registered"
          ? mostRecentEntry.status
          : "in progress",

      "What is your Field of Study?": studentEntry?.st_study_field || "NA",
      "Please tell us the year you will graduate":
        studentEntry?.st_graduate_year || "NA",
      "Tell us about your largest concern/unmet needs (Student)":
        !studentEntry?.st_unmet_needs
          ? "NA"
          : studentEntry.st_unmet_needs.toLowerCase() === "all of the above"
          ? studentEntry.all_st_unmet_needs
          : studentEntry.st_unmet_needs,
      "What is your current/past job profile/s?":
        workingProfEntry?.tm_job_profile || "NA",
      "Please tell us how many years of experience do you have":
        workingProfEntry?.tm_experience || "NA",
      "Tell us about your largest concern/unmet needs (Working Professional)":
        !workingProfEntry?.tm_unmet_needs
          ? "NA"
          : workingProfEntry.tm_unmet_needs.toLowerCase() === "all of the above"
          ? workingProfEntry.all_tm_unmet_needs
          : workingProfEntry.tm_unmet_needs,
      "How long your business/firm has been established (Business Owner)":
        businessOwnerEntry?.bo_buss_establishment || "NA",
      "What is your largest concern or unmet need at your work/business/firm ?":
        !businessOwnerEntry?.bo_unmet_needs
          ? "NA"
          : businessOwnerEntry.bo_unmet_needs.toLowerCase() ===
            "all of the above"
          ? businessOwnerEntry.all_bo_unmet_needs
          : businessOwnerEntry.bo_unmet_needs,
      "How long your business/firm has been established (Freelancer)":
        freelancerEntry?.fl_establishment || "NA",
      "What is your largest concern or unmet need at your work/business/firm ? (Freelancer)":
        !freelancerEntry?.fl_unmet_needs
          ? "NA"
          : freelancerEntry.fl_unmet_needs.toLowerCase() === "all of the above"
          ? freelancerEntry.all_fl_unmet_needs
          : freelancerEntry.fl_unmet_needs,
      CreatedAt: helper.ISTDate(item.createdAt),
    };
  });

  const handleDeleteUser = (user) => {
    let messages = { popup: "", success: "" };
    let hasDeleteAccess = false;
    if (
      isSuperAdmin(userRole.role) ||
      hasPermission(userRole.role, "delete_personal")
    ) {
      messages.popup = get_messages({ key: "delete_personal" }).single_delete;
      messages.success = get_messages({
        key: "delete_personal",
        count: 1,
      }).single_delete_success;
      hasDeleteAccess = true;
    } else if (hasPermission(userRole.role, "create_delete_request_personal")) {
      messages.popup = get_messages({
        key: "create_delete_request_personal",
      }).single_delete;
      messages.success = get_messages({
        key: "create_delete_request_personal",
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
          setloading(true);
          const {
            name,
            email,
            user_type,
            country_code,
            phone,
            whatsapp_country_code,
            whatsapp_no,
            country,
            city,
            state,
          } = user;
          if (hasDeleteAccess) {
            const response = await http.put(`${base_url}/delete-users`, {
              users: [user?.id],
            });
            if (response?.data) {
              http.post(`${config.api_url}admin/logs`, {
                user: userRole.id,
                action_type: "DELETE",
                module: "Personal",
                subModule: "Registered Users",
                status: "SUCCESS",
                details: {
                  name,
                  email,
                  user_type,
                  country_code,
                  phone,
                  whatsapp_country_code,
                  whatsapp_no,
                  country,
                  city: city || "NA",
                  state: state || "NA",
                },
              });
            } else {
              http.post(`${config.api_url}admin/logs`, {
                user: userRole.id,
                action_type: "DELETE",
                module: "Personal",
                subModule: "Registered Users",
                status: "FAILURE",
                details: {
                  name,
                  email,
                  user_type,
                  country_code,
                  phone,
                  whatsapp_country_code,
                  whatsapp_no,
                  country,
                  city: city || "NA",
                  state: state || "NA",
                },
              });
            }
          } else {
            const response = await http.put(`${base_url}/delete-request`, {
              users: [user?._id],
              roleUser: userRole?.id,
            });
            if (response?.data) {
              http.post(`${config.api_url}admin/logs`, {
                user: userRole.id,
                action_type: "REQUEST_DELETE",
                module: "Personal",
                subModule: "Registered Users",
                status: "SUCCESS",
                details: {
                  name,
                  email,
                  user_type,
                  country_code,
                  phone,
                  whatsapp_country_code,
                  whatsapp_no,
                  country,
                  city: city || "NA",
                  state: state || "NA",
                },
              });
            } else {
              http.post(`${base_url}admin/logs`, {
                user: userRole.id,
                action_type: "REQUEST_DELETE",
                module: "Personal",
                subModule: "Registered Users",
                status: "FAILURE",
                details: {
                  name,
                  email,
                  user_type,
                  country_code,
                  phone,
                  whatsapp_country_code,
                  whatsapp_no,
                  country,
                  city: city || "NA",
                  state: state || "NA",
                },
              });
            }
          }
          // Show success message
          Modal.success({
            title: "Success",
            content: <span>{messages.success}</span>,
          });
          // Refresh the data
          fetchDatas();
        } catch (error) {
          Modal.error({
            title: "Error",
            content: "Failed to send deletion request. Please try again.",
          });
        } finally {
          setloading(false);
        }
      },
    });
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
          setloading(true);

          const userIds = eligibleUsers.map((user) => user._id);
          if (hasDeleteAccess) {
            const response = await http.put(`${base_url}/delete-users`, {
              users: userIds,
            });
            if (response?.data) {
              http.post(`${config.api_url}admin/logs`, {
                user: userRole.id,
                action_type: "BULK_DELETE",
                module: "Personal",
                subModule: "Registered Users",
                details: helper.captureBasicUserDetailsPersonal(eligibleUsers),
                status: "SUCCESS",
              });
            } else {
              http.post(`${config.api_url}admin/logs`, {
                user: userRole.id,
                action_type: "BULK_DELETE",
                module: "Personal",
                subModule: "Registered Users",
                details: helper.captureBasicUserDetailsPersonal(eligibleUsers),
                status: "FAILURE",
              });
            }
          } else {
            const response = await http.put(`${base_url}/delete-request`, {
              users: userIds,
              roleUser: userRole?._id,
            });
            if (response?.data) {
              http.post(`${config.api_url}admin/logs`, {
                user: userRole.id,
                action_type: "BULK_DELETE_REQUEST",
                module: "Personal",
                subModule: "Registered Users",
                details: helper.captureBasicUserDetailsPersonal(eligibleUsers),
                status: "SUCCESS",
              });
            } else {
              http.post(`${config.api_url}admin/logs`, {
                user: userRole.id,
                action_type: "BULK_DELETE_REQUEST",
                module: "Personal",
                subModule: "Registered Users",
                details: helper.captureBasicUserDetailsPersonal(eligibleUsers),
                status: "FAILURE",
              });
            }
          }
          // Send bulk delete request with eligible user IDs
          // await http.post(`${base_url}/bulk-delete`, { userIds });

          Modal.success({
            title: "Success",
            content: messages.success,
          });

          // Clear selection and refresh data
          setSelectedRowKeys([]);
          fetchDatas();
        } catch (error) {
          Modal.error({
            title: "Error",
            content: "Failed to send bulk deletion requests. Please try again.",
          });
        } finally {
          setloading(false);
        }
      },
    });
  };

  const fetchDatas = async () => {
    setloading(true);
    const { data } = await http.get(base_url);

    if (data) {
      const deletionRequests = data.deletionRequests || [];

      const deletionUserIds = new Set(deletionRequests.map((req) => req.user));
      const updatedUsers = data?.data?.map((user) => {
        if (deletionUserIds.has(user._id)) {
          return { ...user, deletionRequested: true };
        }
        return user;
      });
      setDatas(updatedUsers);
      setFilteredData(updatedUsers);
      setloading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    const searchTermLower = value.toLowerCase();

    const filtered = datas.filter((item) => {
      const fullPhone = item.country_code + item.phone;
      const fullWhatsapp = item.whatsapp_country_code + item.whatsapp_no;

      return (
        item.name.toLowerCase().includes(searchTermLower) ||
        item.email.toLowerCase().includes(searchTermLower) ||
        item.country.toLowerCase().includes(searchTermLower) ||
        item.city.toLowerCase().includes(searchTermLower) ||
        fullPhone.includes(searchTermLower) ||
        fullWhatsapp.includes(searchTermLower)
      );
    });

    setFilteredData(filtered);
  };

  const checkRequiredPermissions = () => {};

  useEffect(() => {
    fetchDatas();
  }, []);

  const handleView = async (id) => {
    const { data } = await http.get(`${base_url}/${id}`);

    if (data) {
      setData(data);
      setdraweropen(true);
    }
  };

  const handleProView = async (entry_id) => {
    const { data } = await http.get(`${base_url}/pro-entry/${entry_id}`);

    if (data) {
      setProData(data);
      setIsProDrawerOpen(true);
    }
  };
  const handleProModal = async (user_id) => {
    const { data } = await http.get(`${base_url}/pro-entries/${user_id}`);

    if (data) {
      setProEntries(data);
      setIsModalVisible(true);
    }
  };

  const handleDrawerClose = () => {
    setData({});
    setdraweropen(false);
  };
  const handleProDrawerClose = () => {
    setProData({});
    setIsProDrawerOpen(false);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleEditUser = (user) => {
    setEditUser(user);
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setEditUser(null);
  };

  const handleUserUpdated = () => {
    fetchDatas();
  };

  const handleCreateModalOpen = () => setCreateModalOpen(true);
  const handleCreateModalClose = () => setCreateModalOpen(false);
  const handleUserCreated = () => {
    fetchDatas();
    setCreateModalOpen(false);
  };

  const handleImportModalOpen = () => setImportModalOpen(true);
  const handleImportModalClose = () => {
    setImportModalOpen(false);
    fetchDatas();
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name?.localeCompare(b.name),
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
      title: "User Type",
      dataIndex: "user_type",
      key: "user_type",
      render: (text, record) => {
        return userTypes[record.user_type] || "NA";
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
      render: (text, record) => {
        const menuItems = [
          {
            key: "view",
            label: "View Detail",
            onClick: () => handleView(record._id),
          },
        ];

        // Conditionally add "View Pro"
        if (record.user_type !== "DE") {
          if (
            isSuperAdmin(userRole.role) ||
            (hasPermission(userRole.role, "view_all") &&
              !hasPermission(userRole.role, "download_user_data")) ||
            (!hasPermission(userRole.role, "view_all") &&
              !hasPermission(userRole.role, "download_user_data"))
          ) {
            menuItems.push({
              key: "viewPro",
              label: "View Pro",
              onClick: () => handleProModal(record._id),
            });
          }
        }

        // Conditionally add "Edit" and "Delete"
        if (
          isSuperAdmin(userRole.role) ||
          (!hasPermission(userRole.role, "download_user_data") &&
            !hasPermission(userRole.role, "view_all"))
        ) {
          menuItems.push({
            key: "edit",
            label: "Edit",
            onClick: () => handleEditUser(record),
          });
          menuItems.push({
            key: "delete",
            label: record.deletionRequested ? "Delete Requested" : "Delete",
            danger: !record.deletionRequested,
            disabled: record.deletionRequested,
            onClick: record.deletionRequested
              ? undefined
              : () => handleDeleteUser(record),
          });
        }

        return (
          <Dropdown
            menu={{ items: menuItems }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button>
              Actions <DownOutlined />
            </Button>
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div>
      {/* <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
        <Breadcrumb.Item>Leads</Breadcrumb.Item>
        <Breadcrumb.Item>{moduleNamePural}</Breadcrumb.Item>
      </Breadcrumb> */}
      <Breadcrumb
        style={{ margin: "16px 0" }}
        items={[
          {
            title: "Dashboard",
          },
          {
            title: "Personal Flow",
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
              <div
                style={{
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Space>
                  {hasPermission(
                    userRole.role,
                    "edit_personal_user_advanced"
                  ) && (
                    <>
                      <Button type="primary" onClick={handleCreateModalOpen}>
                        Create User
                      </Button>
                      <Button onClick={handleImportModalOpen}>
                        Import from CSV
                      </Button>
                    </>
                  )}
                  {(isSuperAdmin(userRole.role) ||
                    !hasPermission(userRole.role, "view_all")) && (
                    <CSVLink
                      data={csvData}
                      filename={"Personal Flow Users.csv"}
                      className="ant-btn ant-btn-primary"
                      style={{ marginRight: 10 }}
                    >
                      <Button>
                        Export to CSV{" "}
                        {selectedRowKeys.length > 0 &&
                          `(${selectedRowKeys.length} selected)`}
                      </Button>
                    </CSVLink>
                  )}

                  <Dropdown
                    menu={menuProps}
                    open={filterOpen}
                    onOpenChange={() => setFilterOpen(!filterOpen)}
                  >
                    <Button style={{ marginRight: 10 }}>
                      <Space>
                        Filter
                        <FilterOutlined />
                      </Space>
                    </Button>
                  </Dropdown>

                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    style={{ width: "600px", float: "right" }}
                  />
                </Space>
              </div>

              <Table
                rowKey={(record) => record._id}
                columns={columns}
                dataSource={filteredData}
                loading={loading}
                searchable={false}
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
                  <Descriptions.Item label="User Type">
                    {userTypes[data.user_type] || "NA"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Onboarding From">
                    {data?.onboarding_source
                      ? helper.convertToTitleCase(data?.onboarding_source)
                      : "Web"}
                  </Descriptions.Item>

                  <Descriptions.Item label="Email">
                    {data.email
                      ? !isSuperAdmin(userRole.role) &&
                        hasPermission(userRole.role, "download_user_data")
                        ? helper.maskEmail(data.email)
                        : data.email
                      : "NA"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Phone">
                    {data.phone
                      ? !isSuperAdmin(userRole.role) &&
                        hasPermission(userRole.role, "download_user_data")
                        ? helper.maskPhone(data.country_code + data.phone)
                        : data.country_code + data.phone
                      : "NA"}{" "}
                  </Descriptions.Item>
                  <Descriptions.Item label="Whatsapp No">
                    {data.whatsapp_no
                      ? !isSuperAdmin(userRole.role) &&
                        hasPermission(userRole.role, "download_user_data")
                        ? helper.maskPhone(
                            data.whatsapp_country_code + data.whatsapp_no
                          )
                        : data.whatsapp_country_code + data.whatsapp_no
                      : "NA"}
                  </Descriptions.Item>

                  <Descriptions.Item label="Country">
                    {data.country || "NA"}
                  </Descriptions.Item>

                  <Descriptions.Item label="City">
                    {data.city || "NA"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Pincode">
                    {data.pincode || "NA"}
                  </Descriptions.Item>

                  <Descriptions.Item label="Created At">
                    {helper.ISTDate(data.createdAt)}
                  </Descriptions.Item>
                </Descriptions>
              )}
            </Drawer>

            <Drawer
              title="Pro Access Entry"
              placement="right"
              onClose={handleProDrawerClose}
              open={isProDrawerOpen}
              size="large"
              width={1000}
            >
              {proData && (
                <Descriptions
                  bordered
                  column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
                  size="small"
                >
                  {proData?.user_type === "ST" && (
                    <>
                      <Descriptions.Item label="What is your Field of Study?">
                        {proData?.st_study_field?.map((it) => it).join(", ") ||
                          "NA"}
                      </Descriptions.Item>
                      <Descriptions.Item label="Please tell us the year you will graduate">
                        {proData?.st_graduate_year || "NA"}
                      </Descriptions.Item>
                      <Descriptions.Item label="Tell us about your largest concern/unmet needs">
                        {proData?.st_unmet_needs?.toLowerCase() ===
                        "all of the above"
                          ? proData?.all_st_unmet_needs
                              ?.map((it) => it)
                              .join(", ")
                          : proData?.st_unmet_needs || "NA"}
                      </Descriptions.Item>
                    </>
                  )}
                  {proData?.user_type === "TM" && (
                    <>
                      <Descriptions.Item label="What is your current/past job profile/s?">
                        {proData?.tm_job_profile?.map((it) => it).join(", ") ||
                          "NA"}
                      </Descriptions.Item>
                      <Descriptions.Item label="Please tell us how many years of experience do you have?">
                        {proData?.tm_experience || "NA"}
                      </Descriptions.Item>
                      <Descriptions.Item label="Tell us about your largest concern l unmet need?">
                        {proData?.tm_unmet_needs?.toLowerCase() ===
                        "all of the above"
                          ? proData?.all_tm_unmet_needs
                              ?.map((it) => it)
                              .join(", ")
                          : proData?.tm_unmet_needs || "NA"}
                      </Descriptions.Item>
                    </>
                  )}
                  {proData?.user_type === "BO" && (
                    <>
                      <Descriptions.Item label="How long back did you establish your work/business/firm ?">
                        {proData?.bo_buss_establishment || "NA"}
                      </Descriptions.Item>
                      <Descriptions.Item
                        label={`What is your largest concern or unmet need at your work/business/firm ?`}
                      >
                        {proData?.bo_unmet_needs?.toLowerCase() ===
                        "all of the above"
                          ? proData?.all_bo_unmet_needs
                              ?.map((it) => it)
                              .join(", ")
                          : proData?.bo_unmet_needs || "NA"}
                      </Descriptions.Item>
                    </>
                  )}
                  {proData?.user_type === "FL" && (
                    <>
                      <Descriptions.Item label="How long back did you establish your work/business/firm?">
                        {proData?.fl_establishment || "NA"}
                      </Descriptions.Item>
                      <Descriptions.Item
                        label={`What is your largest concern or unmet need at your work/business/firm ?*`}
                      >
                        {proData?.fl_unmet_needs?.toLowerCase() ===
                        "all of the above"
                          ? proData?.all_fl_unmet_needs
                              ?.map((it) => it)
                              .join(", ")
                          : proData?.fl_unmet_needs || "NA"}
                      </Descriptions.Item>
                    </>
                  )}
                </Descriptions>
              )}
            </Drawer>

            <Modal
              title={`Pro Access History `}
              open={isModalVisible}
              onCancel={handleModalClose}
              // okText="Create"
              footer={[
                <Button key="back" onClick={handleModalClose}>
                  Cancel
                </Button>,
              ]}
              cancelText="Cancel"
              //   confirmLoading={loading}
              //   onOk={() => {
              //     form
              //       .validateFields()
              //       .then((values) => {
              //         values.date = date;

              //         handleSubmit(values);
              //       })
              //       .catch((info) => {});
              //   }}

              // width={700}
            >
              <List
                // className="demo-loadmore-list"
                // loading={initLoading}
                itemLayout="horizontal"
                dataSource={proEntries}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Button
                        type="link"
                        onClick={() => handleProView(item._id)}
                      >
                        View Details
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      // avatar={<Avatar src={item.picture.large} />}
                      title={userTypes[item.user_type]}
                      description={`Last Updated: ${helper.ISTDate(
                        item.updatedAt
                      )}`}
                    />
                    {item.status === "registered" ? (
                      <Tag color="red">Not Filled</Tag>
                    ) : item.status === "completed" ? (
                      <Tag color="green">Completed</Tag>
                    ) : (
                      <Tag color="orange">Partially Filled</Tag>
                    )}
                  </List.Item>
                )}
              />
            </Modal>

            <PersonalUserEditModal
              open={editModalOpen}
              onClose={handleEditModalClose}
              user={editUser}
              onUpdated={handleUserUpdated}
              admin={userRole}
            />

            <PersonalUserCreateModal
              open={createModalOpen}
              onClose={handleCreateModalClose}
              onCreated={handleUserCreated}
              admin={userRole}
            />
            <PersonalUserCSVImportModal
              open={importModalOpen}
              onClose={handleImportModalClose}
              admin={userRole}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Index;
