import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import {
  businessAccessURL,
  homepageURL,
  privacypolicyURL,
  registrationFormURL,
  proAccessURL,
  teamAccesssURL,
  termsandconditionURL,
  businessFormFiveURL,
  regiserOTPURL,
  changeRoleURL,
  contactUsURL,
  faqsURL,
  comingsoonURL,
  editProfile,
  loginURL,
  resetPassURL,
  BlogsListingURL,
  BlogsInnerURL,
  congratulationsURL,
  accountCategoryURL,
  businessFormFiveLTURL,
  businessProfileURL,
  loginOtpURL,
  registrationBusinessURL,
  datatypesURL,
  congratulationsLightURL,
  dashboardURL,
  registrationBusinessOTPURL,
  businessOwner,
  designEnthusiast,
  aboutUsURL,
  businessProfileEditURL,
  businessProfileViewURL,
  businessProfileEditURL2,
  businessProfileViewURL2,
  businessConnectViwUrl,
  businessConnectEditUrl,
  aboutUsURLV2,
  planDetails,
  chooseYourPlan,
  invoiceUrl,
  businessProfileViewURL3,
  businessPaymentSuccessURL,
  pricingPlansURL,
  clientBusiness,
  clientPersonal,
  editProfileBusiness,
} from "./components/helpers/constant-words";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy";
import Termsandcondition from "./pages/Terms&Condition/Terms&Condition";
import RegistrationForm from "./pages/RegistrationForm/RegistrationForm";
import TeamAccessForm from "./pages/TeamMember/TeamAccess/TeamAccessForm";
import FormFive from "./pages/FormFive/Form/FormFive";
import RegisterOTP from "./pages/RegistrationForm/RegisterOTP/RegisterOTP";
import ChangeRole from "./pages/ChangeRole/ChangeRole";
import BusinessAccess from "./pages/BusinessForm/BusinessAccess/BusinessAccess";
import ContactUs from "./pages/ContactUs/ContactUs";
import Faqs from "./pages/Faqs/Faqs";
import NotFound from "./pages/NotFound";
import Comingsoon from "./pages/Comingsoon/Comingsoon";
import Header from "./components/Header/Header";
import EditProfile from "./pages/EditProfile/EditProfile";
import EditProfileBusiness from "./pages/EditProfile/EditProfileBusiness";
import Login from "./pages/Login/Login";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
// import Home from "./pages/Home/Home";
import BlogsListing from "./pages/BlogsListing/BlogsListing";
import BlogsInner from "./pages/BlogsInner/BlogsInner";
import Congratulations from "./pages/Congratulations/Congratulations";
import AccountCategory from "./pages/RegistrationForm/AccountCategory/AccountCategory";
import FormFiveLightTheme from "./pages/FormFiveLightTheme/Form/FormFiveLightTheme";
import BusinessProfile from "./pages/BusinessProfile/BusinessProfile";
import LoginOTP from "./pages/LoginOTP/otp";
import BusinessAccountDetails from "./pages/BusinessAccountDetails/BusinessAccountDetails";
import DataTypes from "./pages/DataTypes/DataTypes";
import ProAccess from "./pages/ProAccessForm/ProAccess/ProAccess";
import CongratulationsLT from "./pages/CongratulationsLight/CongratulationsLT";
import {
  ProtectedRoute,
  PublicRoute,
} from "./components/ProtectedRoute/ProtectedRoute";
import Dashboard from "./pages/Dashboard/Dashboard";
import BusinessRegistrationOTP from "./pages/FormFiveLightTheme/RegistrationSteps/BusinessRegistrationOTP/BusinessRegistrationOTP";
import Home from "./pages/Home/Home";
import BusinessOwner from "./pages/BusinessOwner/BusinessOwner";
import DesignEnthusiast from "./pages/DesignEnthusiast/DesignEnthusiast";
import AboutUs from "./pages/AboutUs/AboutUs";
import BEdit from "./pages/BusinessProfile/BusinessProfileComponents/BEdit";
import BView from "./pages/BusinessProfile/BusinessProfileComponents/BView";
import BEdit2 from "./pages/BusinessProfile/BusinessProfileComponents/BEdit2";
import BView2 from "./pages/BusinessProfile/BusinessProfileComponents/BView2";
import BusinessConnect from "./pages/BusinessProfile/BusinessProfileComponents/BusinessConnectPage/BusinessConnect";
import BusinessConnectEdit from "./pages/BusinessProfile/BusinessProfileComponents/BusinessConnectEditPage/BusinessConnectEdit";
import AboutUsV2 from "./pages/AboutUsV2/AboutUsV2";
import Plan from "./pages/BusinessProfile/BusinessProfileComponents/Plan/Plan";
import SubscriptionPlans from "./pages/BusinessProfile/BusinessProfileComponents/Plan/SubscriptionPlans";
import Invoice from "./pages/BusinessProfile/BusinessProfileComponents/Plan/Invoice";
import InvoicePrint from "./pages/BusinessProfile/BusinessProfileComponents/Plan/InvoicePrint";
import PaymentSuccessfull from "./pages/PaymentSuccessfull/PaymentSuccessfull";
import PricingPlans from "./pages/PricingPlans/SubscriptionPlans";
import App from "./componentsV2/App";
import Business from "./componentsV2/Business";
import Personal from "./componentsV2/Personal";

const Routing = () => {
  const location = useLocation();
  const isInvoicePage = location.pathname.startsWith("/invoice/print/");
  return (
    <>
      {!isInvoicePage && <Header />}
      <Routes>
        {/* <Route path={homepageURL} element={<Home />} /> */}
        {/* <Route path={aboutUsURL} element={<AboutUs />} /> */}
        {/* <Route path={aboutUsURLV2} element={<AboutUsV2 />} /> */}
        <Route path={aboutUsURL} element={<AboutUsV2 />} />
        <Route path={comingsoonURL} element={<Comingsoon />} />
        <Route path={datatypesURL} element={<DataTypes />} />
        <Route path={changeRoleURL} element={<ChangeRole />} />
        <Route path={teamAccesssURL} element={<TeamAccessForm />} />
        <Route path={businessAccessURL} element={<BusinessAccess />} />
        <Route path={businessFormFiveURL} element={<FormFive />} />
        <Route
          path={businessFormFiveLTURL}
          element={
            <ProtectedRoute guard="business">
              <FormFiveLightTheme />
            </ProtectedRoute>
          }
        />

        <Route
          path={dashboardURL}
          element={
            <ProtectedRoute guard="personal">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path={registrationFormURL} element={<RegistrationForm />} />
        <Route
          path={registrationBusinessURL}
          element={
            <BusinessAccountDetails />
            // <ProtectedRoute>
            // </ProtectedRoute>
          }
        />
        <Route
          path={registrationBusinessOTPURL}
          element={
            <ProtectedRoute requireState="fromRegister">
              <BusinessRegistrationOTP />
            </ProtectedRoute>
          }
        />
        <Route path={accountCategoryURL} element={<AccountCategory />} />
        <Route path={regiserOTPURL} element={<RegisterOTP />} />
        <Route
          path={editProfile}
          element={
            <ProtectedRoute guard="personal">
              <EditProfile />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path={editProfileBusiness}
          element={
            <ProtectedRoute>
              <EditProfileBusiness />
            </ProtectedRoute>
          }
        /> */}
        <Route
          path={loginURL}
          element={
            <Login />
            // <PublicRoute>
            // </PublicRoute>
          }
        />
        <Route path={loginOtpURL} element={<LoginOTP />} />
        <Route path={resetPassURL} element={<ResetPassword />} />
        <Route path={contactUsURL} element={<ContactUs />} />
        <Route path={faqsURL} element={<Faqs />} />
        <Route path={privacypolicyURL} element={<PrivacyPolicy />} />
        <Route path={termsandconditionURL} element={<Termsandcondition />} />
        <Route path={BlogsListingURL} element={<BlogsListing />} />
        <Route path={BlogsInnerURL} element={<BlogsInner />} />
        <Route path={congratulationsURL} element={<Congratulations />} />
        <Route
          path={congratulationsLightURL}
          element={
            <ProtectedRoute guard="business">
              <CongratulationsLT />
            </ProtectedRoute>
          }
        />

        {/* PRO Access / Early Access */}
        <Route
          path={proAccessURL}
          element={
            <ProtectedRoute guard="personal">
              <ProAccess />
            </ProtectedRoute>
          }
        />

        {/* Business Profile */}
        <Route
          path={businessProfileURL}
          element={
            <ProtectedRoute guard="business">
              <BusinessProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path={businessProfileEditURL}
          element={
            <ProtectedRoute guard="business">
              <BEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path={businessProfileEditURL2}
          element={
            <ProtectedRoute guard="business">
              <BEdit2 />
            </ProtectedRoute>
          }
        />
        <Route path={businessProfileViewURL} element={<BView />} />
        {/* <Route path={businessProfileViewURL2} element={<BView2 />} /> */}
        <Route path={businessProfileViewURL3} element={<BView2 />} />
        <Route path={businessConnectViwUrl} element={<BusinessConnect />} />
        {/* <Route
          path={businessConnectEditUrl}
          element={
            <ProtectedRoute>
              <BusinessConnectEdit />
            </ProtectedRoute>
          }
        /> */}

        {/* demo pages */}
        <Route path={businessOwner} element={<BusinessOwner />} />
        <Route path={designEnthusiast} element={<DesignEnthusiast />} />

        {/* Plan pages */}
        <Route path={planDetails} element={<Plan />} />
        <Route path={chooseYourPlan} element={<SubscriptionPlans />} />
        <Route path={invoiceUrl} element={<InvoicePrint />} />
        <Route
          path={businessPaymentSuccessURL}
          element={
            <ProtectedRoute guard="business">
              <PaymentSuccessfull />
            </ProtectedRoute>
          }
        />
        <Route path={pricingPlansURL} element={<PricingPlans />} />
        {/* New Code From Client Start */}
        <Route path={homepageURL} element={<App />} />
        <Route path={clientBusiness} element={<Business />} />
        <Route path={clientPersonal} element={<Personal />} />
        {/* New Code From Client End */}
        <Route exact path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
      {/* <FooterV2 /> */}
    </>
  );
};
export default Routing;
