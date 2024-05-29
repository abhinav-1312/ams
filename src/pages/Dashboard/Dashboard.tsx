import React, { useEffect, useState } from "react";
import { Box,  Grid } from "@mui/material";
import styles from "./Dashboard.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { fetchAssets } from "../../store/actions/assetActions";
import { fetchDepartments } from "../../store/actions/departmentActions";
import { fetchEmployees } from "../../store/actions/employeeActions";
import { fetchUsers } from "../../store/actions/userActions";
import { fetchLocations } from "../../store/actions/locationActions";
import { fetchTransactions } from "../../store/actions/transactionActions";
// import { fetchAssetTypes } from "../../store/actions/vendorActions";
import SummaryCard from "./SummaryCard";
import RecentActivities from "./RecentActivities";
import { RootState } from "../../store/store";
import { ThunkDispatch } from "redux-thunk";
import AssetOverview from "./AssetOverview";

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<ThunkDispatch<RootState, null, any>>();

  // Define types for your Redux state
  const totalAssets = useSelector(
    (state: RootState) => state.asset.assets.length
  );
  const totalDepartments = useSelector((state: RootState) => {
    const assets = state.asset.assets;

    const filteredAssets = assets.filter(
      (record) =>
        record.latestTransaction?.transactionType === "Warehouse Inventory"
    );

    return filteredAssets.length;
  });

  const totalEmployees = useSelector((state: RootState) => {
    const assets = state.asset.assets;

    const filteredAssets = assets.filter(
      (record) => record.latestTransaction?.transactionType === "Transfer"
    );

    return filteredAssets.length;
  });

  const totalUsers = useSelector((state: RootState) => state.user.users.length);
  const [activeSummaryCard, setActiveSummaryCard] = useState<string>("assets");

  useEffect(() => {
    dispatch(fetchAssets());
    dispatch(fetchDepartments());
    dispatch(fetchEmployees());
    dispatch(fetchUsers());
    dispatch(fetchLocations());
    dispatch(fetchTransactions());
    // dispatch(fetchAssetTypes());
  }, [dispatch]);

  const handleSummaryCardClick = (dataType: string) => {
    setActiveSummaryCard(dataType);
  };
  const getDynamicTitle = () => {
    switch (activeSummaryCard) {
      case "assets":
        return "Recent Assets";
      case "assetSummary":
        return " Assets Summary";
      case "departments":
        return "Recent Warehouse Inventory Assets";
      case "employees":
        return "Recent Assets Under Use ";
      case "users":
        return "Recent Users";
      default:
        return "";
    }
  };
  return (
    <div className={styles.dashboard}>
      <Box mb={3}>
        <h1>Dashboard</h1>
      </Box>
      <Grid container spacing={3}>
        {[
          { dataType: "assets", label: "Total Assets", total: totalAssets },
          {
            dataType: "departments",
            label: "Total Warehouse Inventory",
            total: totalDepartments,
          },
          {
            dataType: "employees",
            label: " Assets Under Use ",
            total: totalEmployees,
          },
          { dataType: "users", label: "Total Users", total: totalUsers },
          {
            dataType: "assetSummary",
            label: "Assets Summary ",
            total: totalAssets,
          },
        ].map((data) => (
          <Grid item xs={12} sm={6} md={3} key={data.dataType}>
            <SummaryCard
              title={data.label}
              value={data.total}
              onClick={() => handleSummaryCardClick(data.dataType)}
              isActive={data.dataType === activeSummaryCard}
            />
          </Grid>
        ))}
      </Grid>
      <br />
      {activeSummaryCard === "assetSummary" ? (
        <AssetOverview />
      ) : (
        <RecentActivities
          activeSummaryCard={activeSummaryCard}
          title={getDynamicTitle()}
        />
      )}
    </div>
  );
};

export default Dashboard;
