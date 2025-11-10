import React from "react";
import "./App.less";

import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";

import Login from "./pages/Auth/Login";
import MainLayout from "./MainLayout";
import config from "./config/config";
import { jwtDecode } from "jwt-decode";
import Logout from "./components/Logout";
import InvoicePrint from "./pages/BusinessAccountUsers/BusinessInvoice/InvoicePrint";

function App() {
  const PrivateRoute = ({ children, guard = null }) => {
    let user;
    try {
      const token = localStorage.getItem(config.jwt_store_key);
      user = jwtDecode(token);
    } catch (error) {
      console.log({ error });
    }

    if (!user) {
      // user is not authenticated
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route
          path="/invoice/print/:invoiceId"
          element={
            <PrivateRoute>
              <InvoicePrint />
            </PrivateRoute>
          }
        />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
