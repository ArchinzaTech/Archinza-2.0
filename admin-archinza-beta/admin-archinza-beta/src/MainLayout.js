import React, { useState, useEffect } from "react";
import "./App.less";
import {
  Layout,
  Menu,
  Modal,
  Drawer,
  Avatar,
  Typography,
  Select,
  notification,
  Tag,
} from "antd";
import {
  Route,
  Link,
  Routes,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import {
  LogoutOutlined,
  UserOutlined,
  FormOutlined,
  FileTextOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  TeamOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  FiUsers,
  FiDatabase,
  FiFileText,
  FiMail,
  FiSettings,
  FiCheckCircle,
} from "react-icons/fi";
import { AiOutlineUserDelete } from "react-icons/ai";
import { VscFeedback } from "react-icons/vsc";
import { BiMessageDetail, BiNotepad } from "react-icons/bi";
import { MdOutlineTopic } from "react-icons/md";

import { canAccessRoute } from "./helpers/routeAccess";
import { MODULE_PERMISSIONS } from "./config/modulePermissions";

// Import your existing page components
import NotFound from "./pages/NotFound/Index";
import Logout from "./components/Logout";
import Users from "./pages/User/Users";
import Options from "./pages/Content/Options";
import BusinessUsers from "./pages/BusinessAccountUsers/BusinessUsers";
import Newsletter from "./pages/NewsletterSubscriptions/Newsletter";
import Services from "./pages/Content/BusinessAccountOptions/Services/Services";
import BusinessAccountOptions from "./pages/Content/BusinessAccountOptions/Options/Options";
import CustomOptionsAdmin from "./pages/Content/CustomOptions/PersonalCustomOptions";
import BusinessCustomOptionsAdmin from "./pages/Content/CustomOptions/BusinessCustomOptions";
import BusinessVerificationAdmin from "./pages/BusinessAccountUsers/BusinessVerificationRequests";
import Roles from "./pages/Roles/Roles";
import RoleUsers from "./pages/Roles/Users";
import Permissions from "./pages/Roles/Permissions";
import { personalUsersUrl } from "./helpers/constants";
import helper from "./helpers/helper";
import config from "./config/config";
import { jwtDecode } from "jwt-decode";
import PersonalDeletionRequests from "./pages/Content/PersonalDeletionRequest";
import Logs from "./pages/Logs/Logs";
import Feedback from "./pages/User/Feedback";
import BusinessFeedback from "./pages/BusinessAccountUsers/BusinessFeedback";
import BusinessDeletionRequests from "./pages/Content/BusinessDeletionRequest";
import BusinessEditRequests from "./pages/Content/BusinessAccountOptions/BusinessEditRequest";
import FeedbackTopics from "./pages/Feedback/FeedbackTopics";
// import NotAuthorized from "./pages/NotAuthorized";

function MainLayout() {
  const { Header, Content, Footer, Sider } = Layout;
  const { Text } = Typography;
  const { Option } = Select;
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  // New state for tracking selected flow
  const [selectedFlow, setSelectedFlow] = useState("personal");
  const [allowedSections, setAllowedSections] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [userRoleObj, setUserRoleObj] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Menu configurations split by flow
  const personalMenuItems = [
    {
      key: personalUsersUrl,
      icon: <FiUsers />,
      label: <Link to={personalUsersUrl}>Registered Users</Link>,
    },
    {
      key: "/personal/onboarding-datatypes",
      icon: <FiDatabase />,
      label: (
        <Link to="/personal/onboarding-datatypes">Onboarding Datatypes</Link>
      ),
    },
    {
      key: "/personal/requested-datatypes",
      icon: <FiFileText />,
      label: (
        <Link to="/personal/requested-datatypes">Requested Datatypes</Link>
      ),
    },
    {
      key: "/personal/requested-deletions",
      icon: <FiFileText />,
      label: (
        <Link to="/personal/requested-deletions">Requested Deletions</Link>
      ),
    },
    {
      key: "/personal/feedbacks",
      icon: <VscFeedback />,
      label: <Link to="/personal/feedbacks">Feedbacks</Link>,
    },
    {
      key: "/personal/newsletters",
      icon: <FiMail />,
      label: <Link to="/personal/newsletters">Newsletters</Link>,
    },
  ];

  const businessMenuItems = [
    {
      key: "/business/users",
      icon: <FiUsers />,
      label: <Link to="/business/users">Registered Users</Link>,
    },
    {
      key: "/business/onboarding-datatypes",
      icon: <FiDatabase />,
      label: (
        <Link to="/business/onboarding-datatypes">Onboarding Datatypes</Link>
      ),
    },
    {
      key: "/business/onboarding-services",
      icon: <FiSettings />,
      label: (
        <Link to="/business/onboarding-services">Onboarding Services</Link>
      ),
    },
    {
      key: "/business/requested-services",
      icon: <FiFileText />,
      label: <Link to="/business/requested-services">Requested Services</Link>,
    },
    {
      key: "/business/requested-user-edits",
      icon: <FiFileText />,
      label: (
        <Link to="/business/requested-user-edits">Requested User Edits</Link>
      ),
    },
    {
      key: "/business/requested-verifications",
      icon: <FiCheckCircle />,
      label: (
        <Link to="/business/requested-verifications">
          Requested Verifications
        </Link>
      ),
    },
    {
      key: "/business/requested-deletions",
      icon: <AiOutlineUserDelete />,
      label: (
        <Link to="/business/requested-deletions">Requested Deletions</Link>
      ),
    },
    {
      key: "/business/feedbacks",
      icon: <VscFeedback />,
      label: <Link to="/business/feedbacks">Feedbacks</Link>,
    },
  ];

  const rolesMenuItems = [
    {
      key: "/roles/users",
      icon: <FiUsers />,
      label: <Link to="/roles/users">Users</Link>,
    },
    {
      key: "/roles",
      icon: <FiUsers />,
      label: <Link to="/roles">Roles</Link>,
    },
    {
      key: "/roles/permissions",
      icon: <FiUsers />,
      label: <Link to="/roles/permissions">Permissions</Link>,
    },
  ];

  const miscellaneousMenuItems = [
    {
      key: "/miscellaneous/logs",
      icon: <BiMessageDetail size={20} />,
      label: <Link to="/miscellaneous/logs">Logs</Link>,
    },
    {
      key: "/miscellaneous/feedback-topics",
      icon: <MdOutlineTopic size={20} />,
      label: <Link to="/miscellaneous/feedback-topics">Feedback Topics</Link>,
    },
  ];

  const filteredPersonalMenuItems = personalMenuItems.filter((item) =>
    canAccessRoute(userRoleObj, item.key)
  );

  const filteredBusinessMenuItems = businessMenuItems.filter((item) =>
    canAccessRoute(userRoleObj, item.key)
  );
  const filteredRolesMenuItems = rolesMenuItems.filter((item) =>
    canAccessRoute(userRoleObj, item.key)
  );

  const filteredmiscellaneousMenuItems = miscellaneousMenuItems.filter((item) =>
    canAccessRoute(userRoleObj, item.key)
  );

  const menuMap = {
    personal: filteredPersonalMenuItems,
    business: filteredBusinessMenuItems,
    roles: filteredRolesMenuItems,
    miscellaneous: filteredmiscellaneousMenuItems,
  };

  const menuItems = menuMap[selectedFlow] || [];

  // Filter menu items based on permissions

  // Handle flow change
  const handleFlowChange = (value) => {
    setSelectedFlow(value);
    let defaultRoute = "";
    // Navigate to default route of the selected flow
    switch (value) {
      case "personal":
        defaultRoute = personalUsersUrl;
        break;
      case "business":
        defaultRoute = "/business/users";
        break;
      case "roles":
        defaultRoute = "/roles";
        break;
      case "miscellaneous":
        defaultRoute = "/miscellaneous/logs";
        break;

      default:
        break;
    }
    navigate(defaultRoute);
  };

  // Logout confirmation modal
  const showLogoutConfirm = () => {
    Modal.confirm({
      title: "Logout Confirmation",
      content: "Are you sure you want to logout?",
      okText: "Yes",
      cancelText: "No",
      onOk() {
        navigate("/logout");
      },
    });
  };

  // Render sidebar menu
  const renderMenu = (mode = "inline") => (
    <Menu
      mode={mode}
      theme="light"
      selectedKeys={[location.pathname]}
      items={menuItems.map((item) => {
        // This will now receive the already filtered menuItems
        if (item.children) {
          return {
            ...item,
            children: item.children.map((child) => ({
              ...child,
              key: child.key,
            })),
          };
        }
        return item;
      })}
    />
  );

  // Define routes for each flow
  const personalRoutes = (
    <Routes>
      <Route exact path={personalUsersUrl} element={<Users />} />
      {canAccessRoute(userRoleObj, "/personal/onboarding-datatypes") && (
        <Route path="/personal/onboarding-datatypes" element={<Options />} />
      )}
      {canAccessRoute(userRoleObj, "/personal/requested-datatypes") && (
        <Route
          path="/personal/requested-datatypes"
          element={<CustomOptionsAdmin />}
        />
      )}
      {canAccessRoute(userRoleObj, "/personal/requested-deletions") && (
        <Route
          path="/personal/requested-deletions"
          element={<PersonalDeletionRequests />}
        />
      )}
      {canAccessRoute(userRoleObj, "/personal/feedbacks") && (
        <Route path="/personal/feedbacks" element={<Feedback />} />
      )}
      {canAccessRoute(userRoleObj, "/personal/newsletters") && (
        <Route path="/personal/newsletters" element={<Newsletter />} />
      )}
      <Route path="/logout" element={<Logout />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );

  const businessRoutes = (
    <Routes>
      <Route path="/business/users" element={<BusinessUsers />} />
      <Route
        path="/business/onboarding-datatypes"
        element={<BusinessAccountOptions />}
      />
      <Route path="/business/onboarding-services" element={<Services />} />
      <Route
        path="/business/requested-services"
        element={<BusinessCustomOptionsAdmin />}
      />
      <Route
        path="/business/requested-verifications"
        element={<BusinessVerificationAdmin />}
      />
      <Route
        path="/business/requested-deletions"
        element={<BusinessDeletionRequests />}
      />
      <Route
        path="/business/requested-user-edits"
        element={<BusinessEditRequests />}
      />
      <Route path="/business/feedbacks" element={<BusinessFeedback />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );

  const roleRoutes = (
    <Routes>
      <Route path="/roles" element={<Roles />} />
      <Route path="/roles/users" element={<RoleUsers />} />
      <Route path="/roles/permissions" element={<Permissions />} />
    </Routes>
  );
  const miscellaneousRoutes = (
    <Routes>
      <Route path="/miscellaneous/logs" element={<Logs />} />
      <Route
        path="/miscellaneous/feedback-topics"
        element={<FeedbackTopics />}
      />
    </Routes>
  );

  const routesMap = {
    personal: personalRoutes,
    business: businessRoutes,
    roles: roleRoutes,
    miscellaneous: miscellaneousRoutes,
  };

  const getSectionFromPath = (pathname) => {
    if (pathname.startsWith("/personal")) return "personal";
    if (pathname.startsWith("/business")) return "business";
    if (pathname.startsWith("/roles")) return "roles";
    if (pathname.startsWith("/miscellaneous")) return "miscellaneous";
    // Add more if needed
    return null;
  };

  useEffect(() => {
    const token = localStorage.getItem(config.jwt_store_key);
    const user = jwtDecode(token);
    const { allowedSections } = helper.getAllowedSectionsAndMenu(user?.role);
    setAllowedSections(allowedSections);
    setUserRole(user?.role?.name || "");
    setUserRoleObj(user?.role);
    const currentSection = getSectionFromPath(location.pathname);

    if (location.pathname === "/") {
      // Go to default route of first allowed section
      const defaultRoutes = {
        personal: personalUsersUrl,
        business: "/business/users",
        roles: "/roles",
      };
      const firstAllowed = allowedSections[0];
      navigate(defaultRoutes[firstAllowed] || "/");
    } else if (currentSection && !allowedSections.includes(currentSection)) {
      // Not allowed, redirect to first allowed section
      notification["error"]({
        message: `Not Authorized for ${
          currentSection.charAt(0).toUpperCase() + currentSection.slice(1)
        } Routes`,
      });
      const defaultRoutes = {
        personal: personalUsersUrl,
        business: "/business/users",
        roles: "/roles",
      };
      const firstAllowed = allowedSections[0];
      navigate(defaultRoutes[firstAllowed] || "/");
    } else {
      setSelectedFlow(currentSection || "personal");
    }
  }, [location.pathname, navigate]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar for larger screens */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={250}
        theme="light"
        breakpoint="lg"
      >
        <div
          style={{
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <Text strong style={{ fontSize: collapsed ? "12px" : "18px" }}>
            {collapsed
              ? "Archinza"
              : `Archinza CMS - ${
                  selectedFlow.charAt(0).toUpperCase() + selectedFlow.slice(1)
                }`}
          </Text>
        </div>
        {renderMenu()}
      </Sider>

      <Layout>
        {/* Header */}
        <Header
          style={{
            background: "#fff",
            padding: "0 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          {/* Mobile menu toggle */}
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: () => setCollapsed(!collapsed),
              style: { fontSize: "18px", cursor: "pointer" },
            }
          )}

          {/* Header right section with flow selector */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <Tag color="green" style={{ marginRight: "10px" }}>
              Role: {userRole}
            </Tag>
            <Select
              value={selectedFlow}
              onChange={handleFlowChange}
              style={{ width: 120, marginRight: "10px" }}
            >
              {/* <Option value="personal">Personal</Option>
              <Option value="business">Business</Option>
              <Option value="roles">Roles</Option> */}
              {allowedSections.includes("personal") && (
                <Option value="personal">Personal</Option>
              )}
              {allowedSections.includes("business") && (
                <Option value="business">Business</Option>
              )}
              {allowedSections.includes("roles") && (
                <Option value="roles">Roles</Option>
              )}
              {allowedSections.includes("miscellaneous") && (
                <Option value="miscellaneous">Miscellaneous</Option>
              )}
            </Select>
            <a onClick={showLogoutConfirm} style={{ marginLeft: "10px" }}>
              <LogoutOutlined /> Logout
            </a>
          </div>
        </Header>

        {/* Mobile Drawer Menu */}
        <Drawer
          title="CMS Menu"
          placement="left"
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
        >
          {renderMenu("vertical")}
        </Drawer>

        {/* Main Content */}
        <Content style={{ margin: "16px" }}>
          {routesMap[selectedFlow] || []}
        </Content>

        {/* Footer */}
        <Footer style={{ textAlign: "center", background: "#f0f0f0" }}>
          © {new Date().getFullYear()} Archinza CMS Dashboard | Developed by
          Togglehead
        </Footer>
      </Layout>
    </Layout>
  );
}

export default MainLayout;
