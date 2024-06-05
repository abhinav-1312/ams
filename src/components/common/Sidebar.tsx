import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";
import logo from "./../../assests/images/LookHeadLogo.jpeg";
import {
  Dashboard,
  PeopleAlt,
  Business,
  SupervisedUserCircle,
  MonetizationOn,
  LocationOn,
  Person,
  Group,
  Store,
  LocalAtm,
  AccountBalance,
} from "@mui/icons-material";

import "./Layout.css";

const iconMapping = {
  dashboard: <Dashboard />,
  assets: <PeopleAlt />,
  Location: <LocationOn />,
  User: <Person />,
  Department: <Group />,
  Employee: <Person />,
  Transaction: <LocalAtm />,
  consumers: <SupervisedUserCircle />,
  nbfc: <Store />,
  cagt: <MonetizationOn />,
  accounts: <AccountBalance />,
  Business: <Business />,
};

const Sidebar: React.FC = () => {
  const [userRole, setUserRole] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState("");

  useEffect(() => {
    const rolarr = localStorage.getItem("userRole");

    if (rolarr !== null) {
      const parsedRolarr = JSON.parse(rolarr);
      setUserRole(parsedRolarr);
    }
  }, []);

  const handleMenuItemClick = (itemName: string) => {
    setSelectedItem(itemName);
  };

  return (
    <div>
      <div
        style={{ display: "flex", justifyContent: "center", padding: "10px" }}
      >
        <img src={logo} width="80%" height="47px" alt="Kodie" />
      </div>

      <Divider />
      <List>
        {userRole.includes("Dashboard") && (
          <ListItem
            className={selectedItem === "dashboard" ? "highlighted" : ""}
            onClick={() => handleMenuItemClick("dashboard")}
          >
            <ListItemButton component={Link} to="/dashboard">
              <ListItemIcon>{iconMapping["dashboard"]}</ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>
        )}
        {userRole.includes("Assets") && (
          <ListItem
            className={selectedItem === "assets" ? "highlighted" : ""}
            onClick={() => handleMenuItemClick("assets")}
          >
            <ListItemButton component={Link} to="/assets">
              <ListItemIcon>{iconMapping["assets"]}</ListItemIcon>
              <ListItemText primary="Assets" />
            </ListItemButton>
          </ListItem>
        )}
        {(userRole.includes("Asset Type") || userRole.includes("Admin") ) && (
          <ListItem
            className={selectedItem === "asseType" ? "highlighted" : ""}
            onClick={() => handleMenuItemClick("asseType")}
          >
            <ListItemButton component={Link} to="/asseType">
              <ListItemIcon>{iconMapping["Transaction"]}</ListItemIcon>
              <ListItemText primary="Vendor" />
            </ListItemButton>
          </ListItem>
        )}
        {userRole.includes("Location") && (
          <ListItem
            className={selectedItem === "Location" ? "highlighted" : ""}
            onClick={() => handleMenuItemClick("Location")}
          >
            <ListItemButton component={Link} to="/Location">
              <ListItemIcon>{iconMapping["Location"]}</ListItemIcon>
              <ListItemText primary="Location" />
            </ListItemButton>
          </ListItem>
        )}
        {userRole.includes("User") && (
          <ListItem
            className={selectedItem === "User" ? "highlighted" : ""}
            onClick={() => handleMenuItemClick("User")}
          >
            <ListItemButton component={Link} to="/User">
              <ListItemIcon>{iconMapping["User"]}</ListItemIcon>
              <ListItemText primary="User" />
            </ListItemButton>
          </ListItem>
        )}
        {userRole.includes("Department") && (
          <ListItem
            className={selectedItem === "Department" ? "highlighted" : ""}
            onClick={() => handleMenuItemClick("Department")}
          >
            <ListItemButton component={Link} to="/Department">
              <ListItemIcon>{iconMapping["Department"]}</ListItemIcon>
              <ListItemText primary="Department" />
            </ListItemButton>
          </ListItem>
        )}
        {(userRole.includes("FT/FOM - KAM/ASM") ||
          userRole.includes("Employee")) && (
          <ListItem
            className={selectedItem === "Employee" ? "highlighted" : ""}
            onClick={() => handleMenuItemClick("Employee")}
          >
            <ListItemButton component={Link} to="/Employee">
              <ListItemIcon>{iconMapping["Employee"]}</ListItemIcon>
              <ListItemText primary="FT/FOM-KAM/ASM" />
            </ListItemButton>
          </ListItem>
        )}
        {(userRole.includes("Transcation") ||
          userRole.includes("Transaction")) && (
          <ListItem
            className={selectedItem === "Transaction" ? "highlighted" : ""}
            onClick={() => handleMenuItemClick("Transaction")}
          >
            <ListItemButton component={Link} to="/Transcation">
              <ListItemIcon>{iconMapping["Transaction"]}</ListItemIcon>
              <ListItemText primary="Transaction" />
            </ListItemButton>
          </ListItem>
        )}
        {userRole.includes("QuickCode") && (
          <ListItem
            className={selectedItem === "QuickCode" ? "highlighted" : ""}
            onClick={() => handleMenuItemClick("QuickCode")}
          >
            <ListItemButton component={Link} to="/quickcode">
              <ListItemIcon>{iconMapping["Business"]}</ListItemIcon>
              <ListItemText primary="Quick Code" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </div>
  );
};

export default Sidebar;
