import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Badge,
  Modal,
  Spin,
  message,
  Breadcrumb,
  Descriptions,
  Divider,
  Popconfirm,
  Tooltip,
  Tag,
  Drawer,
  Collapse,
} from "antd";
import {
  UserOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { CheckCircle } from "lucide-react";
import http from "../../helpers/http";
import config from "../../config/config";
import helper from "../../helpers/helper";

const BusinessVerificationAdmin = () => {
  const [businessRequests, setBusinessRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(false);
  const baseUrl = config.api_url + "admin/content/business-verifications";
  const base_url = config.api_url;
  const aws_object_url = config.aws_object_url;
  const { Panel } = Collapse;

  useEffect(() => {
    fetchBusinessRequests();
  }, []);

  const fetchBusinessRequests = async () => {
    setLoading(true);
    const response = await http.get(baseUrl);
    if (response?.data) {
      const sortedData = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      console.log(sortedData);
      if (sortedData?.length) {
        setBusinessRequests(sortedData);
      }
    }
    setLoading(false);
  };

  const handleViewDetails = async (business) => {
    setLoading(true);
    setSelectedRequest(business);
    setDrawerVisible(true);
    const response = await http.get(
      `${base_url}admin/business-users/${business.user._id}`
    );
    if (response?.data) {
      setSelectedUserData(response.data);
    }
    setLoading(false);
  };

  const showApproveConfirmation = (id) => {
    Modal.confirm({
      title: `Are you sure you want to approve this business?`,
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => handleApprove(id),
    });
  };
  const showRejectConfirmation = (id) => {
    Modal.confirm({
      title: `Are you sure you want to reject this business?`,
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => handleReject(id),
    });
  };

  const handleApprove = async (id) => {
    setActionInProgress(true);
    const response = await http.put(`${baseUrl}/${id}`, { status: "approved" });
    if (response?.data) {
      message.success("Business verification approved");
      fetchBusinessRequests();
    } else {
      message.error("Failed to approve business verification");
    }
    setActionInProgress(false);
  };

  const handleReject = async (id) => {
    setActionInProgress(true);
    const response = await http.put(`${baseUrl}/${id}`, {
      status: "rejected",
    });
    if (response?.data) {
      message.success("Business verification rejected");
      fetchBusinessRequests();
    } else {
      message.error("Failed to reject business verification");
    }
    setActionInProgress(false);
  };

  const columns = [
    {
      title: "Business Name",
      dataIndex: "user",
      key: "businessName",
      render: (user) => user?.business_name,
    },
    {
      title: "Email",
      dataIndex: "user",
      key: "email",
      render: (user) => user?.email,
    },
    {
      title: "Requested At",
      dataIndex: "requestDate",
      key: "requestDate",
      render: (text, record) => {
        return helper.ISTDate(record.createdAt);
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) =>
        status === "pending" ? (
          <Badge status="processing" text="Pending" />
        ) : status === "approved" ? (
          <Badge status="success" text="Verified" />
        ) : (
          <Badge status="error" text="Rejected" />
        ),
    },
    {
      title: "Requested by",
      key: "user",
      render: (_, record) => (
        <Button
          type="link"
          icon={<UserOutlined />}
          onClick={() => handleViewDetails(record)}
        >
          View User
        </Button>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        if (record.status === "approved") {
          return (
            <Tag color="success" icon={<CheckCircleOutlined />}>
              Already Verified
            </Tag>
          );
        }

        if (record.status === "rejected") {
          return (
            <Tag color="error" icon={<ExclamationCircleOutlined />}>
              Request Rejected
            </Tag>
          );
        }

        return (
          <Space size="small">
            <Button
              type="primary"
              disabled={actionInProgress}
              className="bg-green-500 hover:bg-green-600"
              onClick={() => showApproveConfirmation(record._id)}
            >
              Approve
            </Button>
            <Button
              danger
              disabled={actionInProgress}
              onClick={() => showRejectConfirmation(record._id)}
            >
              Reject
            </Button>
          </Space>
        );
      },
    },
  ];

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

  return (
    <div>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
        <Breadcrumb.Item>Business Flow</Breadcrumb.Item>
        <Breadcrumb.Item>Requested Verifications</Breadcrumb.Item>
      </Breadcrumb>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={businessRequests.length > 0 ? businessRequests : []}
            rowKey="_id"
            pagination={{ pageSize: 10 }}
            className="shadow-md rounded-md"
          />
        </>
      )}

      {/* <Modal
        title="User Details"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button
            key="close"
            type="primary"
            onClick={() => setModalVisible(false)}
          >
            Close
          </Button>,
        ]}
      >
        {selectedRequest && (
          <>
            <Descriptions bordered column={1} size="middle">
              <Descriptions.Item label="Business Name">
                {selectedRequest.user.business_name}
              </Descriptions.Item>
              <Descriptions.Item label="Username">
                {selectedRequest.user.username}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedRequest.user.email}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {`+${selectedRequest.user.country_code}${selectedRequest.user.phone}`}
              </Descriptions.Item>
              <Descriptions.Item label="Whatsapp">
                {`+${selectedRequest.user.whatsapp_country_code}${selectedRequest.user.whatsapp_no}`}
              </Descriptions.Item>
              <Descriptions.Item label="Country">
                {selectedRequest.user.country}
              </Descriptions.Item>
              {selectedRequest.city && (
                <Descriptions.Item label="City">
                  {selectedRequest.user.city}
                </Descriptions.Item>
              )}
            </Descriptions>
            <Divider />
          </>
        )}
      </Modal> */}
      <Drawer
        title="User Details"
        placement="right"
        size="large"
        width={1000}
        loading={loading}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        {selectedUserData && (
          <>
            <h3 style={{ marginBottom: "16px" }}>User Input Data</h3>
            <Descriptions
              bordered
              column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
              size="small"
            >
              <Descriptions.Item label="Business Types">
                {[
                  ...(selectedUserData?.business_types?.map((it) => it.name) ||
                    []),
                  selectedUserData?.other_busiess_type
                    ? `Other (${selectedUserData.other_busiess_type})`
                    : null,
                ]
                  .filter(Boolean)
                  .join(" , ") || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Onboarded From">
                {selectedUserData?.onboarding_source
                  ? helper.convertToTitleCase(
                      selectedUserData?.onboarding_source
                    )
                  : "Web"}
              </Descriptions.Item>
              <Descriptions.Item label="Business Name">
                {selectedUserData.business_name || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedUserData.email ? selectedUserData.email : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Username">
                {selectedUserData.username || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {selectedUserData.phone
                  ? selectedUserData.country_code + selectedUserData.phone
                  : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Whatsapp No">
                {selectedUserData.whatsapp_no
                  ? selectedUserData.whatsapp_country_code +
                    selectedUserData.whatsapp_no
                  : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="City">
                {selectedUserData.city || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Country">
                {selectedUserData.country || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Pincode">
                {selectedUserData.pincode || "N/A"}
              </Descriptions.Item>
              {/* <Descriptions.Item label="Business Address">
                      {selectedUserData.business_address || "N/A"}
                    </Descriptions.Item> */}
              <Descriptions.Item label="Status">
                {helper.capitalizeWords(selectedUserData?.status) || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Created At">
                {helper.ISTDate(selectedUserData.createdAt)}
              </Descriptions.Item>
            </Descriptions>

            <h3 style={{ margin: "24px 0 16px" }}>Scraped Content</h3>
            <Descriptions
              bordered
              column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
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
                {selectedUserData?.bio || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item
                label="Google Location"
                style={{
                  wordWrap: "break-word",
                  whiteSpace: "normal",
                  maxWidth: "300px",
                }}
              >
                {selectedUserData?.google_location?.latitude &&
                selectedUserData?.google_location?.longitude
                  ? `${selectedUserData?.google_location.latitude}, ${selectedUserData?.google_location.longitude}`
                  : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Products/Materials">
                {renderMediaItems(
                  selectedUserData?.completed_products_media,
                  aws_object_url
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Projects Photos and Renders">
                {renderMediaItems(
                  selectedUserData?.project_renders_media,
                  aws_object_url
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Sites in Progress">
                {renderMediaItems(
                  selectedUserData?.sites_inprogress_media,
                  aws_object_url
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Eliminated Media">
                {renderMediaItems(
                  selectedUserData?.eliminate_media,
                  aws_object_url
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Other Media">
                {renderMediaItems(
                  selectedUserData?.other_media,
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
                {selectedUserData?.scraped_city || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item
                label="Country"
                style={{
                  wordWrap: "break-word",
                  whiteSpace: "normal",
                  maxWidth: "300px",
                }}
              >
                {selectedUserData?.scraped_country || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item
                label="Pincode"
                style={{
                  wordWrap: "break-word",
                  whiteSpace: "normal",
                  maxWidth: "300px",
                }}
              >
                {selectedUserData?.scraped_pincode || "N/A"}
              </Descriptions.Item>
            </Descriptions>

            <h3 style={{ margin: "24px 0 16px" }}>Form Details</h3>
            <Descriptions
              bordered
              column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
              size="small"
            >
              <Descriptions.Item label={"Owner Details"}>
                {selectedUserData?.owners?.length
                  ? selectedUserData?.owners?.map((owner, index) => (
                      <div key={index} style={{ marginBottom: "8px" }}>
                        <strong>{owner.name}</strong>
                        <br />
                        <span>
                          Email:{" "}
                          <a href={`mailto:${owner.email}`}>{owner.email}</a>
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
                        {index < selectedUserData.owners.length - 1 && <hr />}
                      </div>
                    ))
                  : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Top 5 products/services">
                {selectedUserData.featured_services?.join(" | ") || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Other Services">
                {selectedUserData.services?.join(" | ") || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Project Scope Preferences">
                {selectedUserData?.project_scope?.data?.join(" | ") || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label={"Website Link"}>
                {selectedUserData?.website_link ? (
                  <a
                    href={
                      selectedUserData?.website_link.startsWith("http://") ||
                      selectedUserData?.website_link.startsWith("https://")
                        ? selectedUserData?.website_link
                        : "https://" + selectedUserData?.website_link
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selectedUserData?.website_link}
                  </a>
                ) : (
                  "N/A"
                )}
              </Descriptions.Item>
              <Descriptions.Item label={"Linkedin Link"}>
                {selectedUserData?.linkedin_link ? (
                  <a
                    href={
                      selectedUserData?.linkedin_link.startsWith("http://") ||
                      selectedUserData?.linkedin_link.startsWith("https://")
                        ? selectedUserData?.linkedin_link
                        : "https://" + selectedUserData?.linkedin_link
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selectedUserData?.linkedin_link}
                  </a>
                ) : (
                  "N/A"
                )}
              </Descriptions.Item>
              <Descriptions.Item label={"Instagram Handle"}>
                {selectedUserData?.instagram_handle ? (
                  <a
                    href={
                      selectedUserData?.instagram_handle.startsWith(
                        "http://"
                      ) ||
                      selectedUserData?.instagram_handle.startsWith("https://")
                        ? selectedUserData?.instagram_handle
                        : "https://" + selectedUserData?.instagram_handle
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selectedUserData?.instagram_handle}
                  </a>
                ) : (
                  "N/A"
                )}
              </Descriptions.Item>
              <Descriptions.Item label={"Company Profile Uploads"}>
                {selectedUserData?.company_profile_media?.length
                  ? selectedUserData?.company_profile_media?.map(
                      (media, index) => (
                        <div key={index} style={{ marginBottom: "8px" }}>
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
                            selectedUserData.company_profile_media.length -
                              1 && <hr />}
                        </div>
                      )
                    )
                  : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label={"Product Catalogues"}>
                {selectedUserData?.product_catalogues_media?.length
                  ? selectedUserData?.product_catalogues_media?.map(
                      (media, index) => (
                        <div key={index} style={{ marginBottom: "8px" }}>
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
                            selectedUserData.product_catalogues_media.length -
                              1 && <hr />}
                        </div>
                      )
                    )
                  : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Year of Establishment">
                {selectedUserData.establishment_year?.data || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Number of Team Members">
                {selectedUserData.team_range?.data || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Minimum Project Size">
                {selectedUserData?.project_sizes?.sizes?.length
                  ? selectedUserData?.project_sizes?.sizes
                      ?.map(
                        (size) =>
                          `${size} ${selectedUserData.project_sizes.unit}`
                      )
                      .join(" | ")
                  : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Project/Client Location Preference">
                {selectedUserData?.project_location?.data || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Renovation Work">
                {selectedUserData?.renovation_work ? "Yes" : "No"}
              </Descriptions.Item>
              <Descriptions.Item label="Project Typologies">
                {selectedUserData?.project_typology?.data?.join(" | ") || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Product/Service Design Style">
                {selectedUserData?.design_style?.data?.join(" | ") || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Approximate Budget of Projects">
                {selectedUserData?.avg_project_budget?.budget}
              </Descriptions.Item>
              <Descriptions.Item label="Current Minimal Project Fee">
                {selectedUserData?.project_mimimal_fee?.fee}
              </Descriptions.Item>
              <Descriptions.Item label="Product/Service Positionings">
                {selectedUserData?.product_positionings || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Enquiry Preferences">
                {selectedUserData?.enquiry_preferences ? (
                  <div>
                    {Object.entries(selectedUserData.enquiry_preferences).map(
                      ([key, value]) => {
                        const title = key
                          .split("_")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ");

                        return (
                          <div key={key} style={{ marginBottom: "15px" }}>
                            <strong>{title}</strong>
                            <div style={{ marginLeft: "10px" }}>
                              <div>
                                Contact Person: {value.contact_person || "N/A"}
                              </div>
                              <div>
                                Contact Methods:{" "}
                                {value.contact_methods?.length
                                  ? value.contact_methods.join(", ")
                                  : "N/A"}
                              </div>
                            </div>
                            {key !== "media_pr" && <hr />}
                          </div>
                        );
                      }
                    )}
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
      </Drawer>
    </div>
  );
};

export default BusinessVerificationAdmin;
