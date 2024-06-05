import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard/Dashboard";
import Login from "../auth/Login";
import PrivatePage from "../components/PrivatePage";
import AssetManagement from "../pages/assetManage/Ast";
import LocationManagement from "../pages/Location/Location";
import EmployeeManagement from "../pages/employeeModule/Employee";
import DprtManagement from "../pages/Department/Dprt";
import TransactionManagement from "../pages/TransactionHistory/TransactionManagement";
import AssetTypeManagement from "../pages/vendorModule/vendorManagement";
import UserManagement from "../pages/UserModule/UserManagement";
import AstDetail from "../pages/assetManage/assetDetails/AstDetailTAb";
// import QuickCode from "../pages/quickCodeManage/QuickCode";
import QuickTabs from "../pages/quickCodeManage/QuickTab";
const AppRoutes: React.FC = () => {
  const [userRole, setUserRole] = useState<string[]>([]);

  useEffect(() => {
    const rolarr = localStorage.getItem("userRole");
    if (rolarr !== null) {
      const parsedRolarr = JSON.parse(rolarr);
      setUserRole(parsedRolarr);
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      {/* <Route path="/login" element={<Login />} /> */}
      <Route
        path="/dashboard"
        element={
          userRole.includes("Dashboard") ? <Dashboard /> : <PrivatePage />
        }
      />
      <Route
        path="/assets"
        element={
          userRole.includes("Assets") ? <AssetManagement /> : <PrivatePage />
        }
      />
      <Route
        path="/Location"
        element={
          userRole.includes("Location") ? (
            <LocationManagement />
          ) : (
            <PrivatePage />
          )
        }
      />
      <Route
        path="/Employee"
        element={
          userRole.includes("FT/FOM - KAM/ASM") ||
          userRole.includes("Employee") ? (
            <EmployeeManagement />
          ) : (
            <PrivatePage />
          )
        }
      />
      <Route
        path="/Department"
        element={
          userRole.includes("Department") ? <DprtManagement /> : <PrivatePage />
        }
      />
      <Route
        path="/Transcation"
        element={
          userRole.includes("Transaction") ||
          userRole.includes("Transcation") ? (
            <TransactionManagement />
          ) : (
            <PrivatePage />
          )
        }
      />
      <Route
        path="/asseType"

        element={
          (userRole.includes("Asset Type") || userRole.includes("Admin")) ? (
            <AssetTypeManagement />
          ) : (
            <PrivatePage />
          )
        }
      />
      <Route
        path="/assetDetail/:assetId"
        element={userRole.includes("Assets") ? <AstDetail /> : <PrivatePage />}
      />
      <Route
        path="/User"
        element={
          userRole.includes("User") ? <UserManagement /> : <PrivatePage />
        }
      />
      <Route
        path="/quickcode"
        element={
          userRole.includes("QuickCode") ? <QuickTabs /> : <PrivatePage />
        }
      />
    </Routes>
  );
};

export default AppRoutes;
