import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface Activity {
  id: number;
  Name: string;
  assetQuantity?: any;
  locationName?: any;
  createdDate: string;
  Status: any;
  LatestTransaction: any;
}

interface ActivityUser {
  id: number;
  Name: string;
  createdDate: string;
  Status: any;
}

interface RecentActivitiesProps {
  activeSummaryCard: string;
  title: string;
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({
  activeSummaryCard,
  title,
}) => {
  const assets = useSelector((state: RootState) => state.asset.assets);
  const users = useSelector((state: RootState) => state.user.users);

  let recentActivities: Activity[] = [];
  let userActives: ActivityUser[] = [];

  switch (activeSummaryCard) {
    case "assets":
      recentActivities = assets
        .map((record) => ({
          id: record.assetId,
          Name: `${record.assetName}`,
          assetQuantity: `${record.assetQuantity}`,
          locationName: `${record.locationName}`,
          createdDate: `${record.createdDate}`,
          Status: `${record.assetStatus}`,
          LatestTransaction: `${record.latestTransaction.transactionType}`,
        }))
        .slice(-10);

      break;

    case "departments":
      recentActivities = assets
        .filter(
          (record) =>
            record?.latestTransaction?.transactionType === "Warehouse Inventory"
        )
        .map((record) => ({
          id: record.assetId,
          Name: `${record.assetName}`,
          createdDate: `${record.createdDate}`,
          assetQuantity: `${record.assetQuantity}`,
          locationName: `${record.locationName}`,
          Status: `${record.assetStatus}`,
          LatestTransaction: `${record.latestTransaction.transactionType}`,
        }))
        .slice(-10);
      break;

    case "employees":
      recentActivities = assets
        .filter(
          (record) => record?.latestTransaction?.transactionType === "Transfer"
        )
        .map((record) => ({
          id: record.assetId,
          Name: `${record.assetName}`,
          assetQuantity: `${record.assetQuantity}`,
          locationName: `${record.locationName}`,
          createdDate: `${record.createdDate}`,
          Status: `${record.assetStatus}`,
          LatestTransaction: `${record.latestTransaction.transactionType}`,
        }))
        .slice(-10);
      break;

    case "users":
      userActives = users
        .map((record) => ({
          id: record.userId,
          Name: `${record.userName}`,
          createdDate: `${record.createdDate}`,
          Status: `${record.userStatus}`,
        }))
        .slice(-10);
      break;

    default:
      break;
  }

  const formatDateToIST = (dateString: string | null) => {
    if (!dateString) {
      return "";
    } else {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "NaN";
      }

      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Asia/Kolkata",
      };

      return new Intl.DateTimeFormat("en-IN", options).format(date);
    }
  };
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "Name", headerName: "Name", width: 200 },
    ...(activeSummaryCard !== "users"
      ? (activeSummaryCard !== "assets" && activeSummaryCard !== "employees"
          ? [{ field: "assetQuantity", headerName: "Quantity", width: 100 }]
          : []
        ).concat([
          { field: "locationName", headerName: "Location", width: 200 },
        ])
      : []),
    {
      field: "LatestTransaction",
      headerName: "Latest Transaction",
      width: 200,
    },
    {
      field: "Status",
      headerName: "Status",
      width: 200,
      renderCell: (params: any) => (
        <div>{params.row.Status === "true" ? "Active" : "Inactive"}</div>
      ),
    },
    {
      field: "createdDate",
      headerName: "Created Date",
      width: 200,
      renderCell: (params: any) => <div>{formatDateToIST(params.value)}</div>,
    },
  ];
  if (activeSummaryCard === "users") {
    const latestTransactionIndex = columns.findIndex(
      (column) => column.field === "LatestTransaction"
    );
    if (latestTransactionIndex !== -1) {
      columns.splice(latestTransactionIndex, 1);
    }
  }
  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
        {activeSummaryCard === "users" ? (
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid rows={userActives} columns={columns} />
          </div>
        ) : (
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid rows={recentActivities} columns={columns} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivities;
