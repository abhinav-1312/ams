import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { Card, CardContent } from "@mui/material";
import { BASE_URL } from "../../../utils/BaseUrl";
import { useParams, useNavigate } from "react-router-dom";

// Define the type for asset history data
interface AssetHistoryItem {
  transactionId: number;
  assetId: number;
  fromLocation: number;
  toLocation: number;
  fromDepartment: number;
  toDepartment: number;
  fromEmployee: number;
  toEmployee: number;
  assetQuantity: any;
  transactionDate: string;
  transactionType: string;
  createdDate: string | null;
  updatedDate: string;
}

const AssetsHistory = () => {
  const { assetId } = useParams();
  const navigate = useNavigate();

  // Initialize assetHistory with an empty array of the specified type
  const [assetHistory, setAssetHistory] = useState<AssetHistoryItem[]>([]);

  const fetchAssetId = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/getAllTransactionByAssetId?assetId=${assetId}`
      );
      const responseData = response.data.responseData;

      if (Array.isArray(responseData)) {
        // Set the asset history data in the state
        setAssetHistory(responseData);
      } else {
        console.error("Invalid API response format");
        throw new Error("Failed to fetch Assets");
      }
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch Assets");
    }
  };

  useEffect(() => {
    fetchAssetId();
  }, [assetId]);

  const formatDateToIST = (dateString: string | null) => {
    if (!dateString) {
      return "";
    }

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      // hour: "2-digit",
      // minute: "2-digit",
      // second: "2-digit",
      timeZone: "Asia/Kolkata",
    };
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return "";
    }

    return new Intl.DateTimeFormat("en-IN", options).format(date);
  };
  const columns = [
    { field: "transactionId", headerName: "Transaction Id", width: 150 },
    { field: "assetId", headerName: "Asset Id", width: 150 },
    {
      field: "assetName",
      headerName: "Asset Name",
      width: 150,
    },
    {
      field: "assetTag",
      headerName: "Barcode",
      width: 150,
    },
    {
      field: "assetQuantity",
      headerName: "Quantity",
      width: 150,
    },
    {
      field: "vendorName",
      headerName: " Vendor Name",
      width: 150,
    },

    {
      field: "fromLocationName",
      headerName: "From Location",
      width: 150,
    },
    {
      field: "toLocationName",
      headerName: "To Location",
      width: 150,
    },

    {
      field: "fromEmployeeName",
      headerName: "From FT/FOM",
      width: 150,
    },
    {
      field: "toEmployeeName",
      headerName: "To FT/FOM",
      width: 150,
    },
    {
      field: "fromKamAsm",
      headerName: "From KAM/ASM",
      width: 150,
    },
    {
      field: "toKamAsm",
      headerName: "To KAM/ASM",
      width: 150,
    },
    {
      field: "transactionDate",
      headerName: "Transaction Date",
      width: 170,
      renderCell: (params: any) => <div>{formatDateToIST(params.value)}</div>,
    },
    { field: "transactionType", headerName: "Transaction Type", width: 150 },
  ];

  return (
    <div style={{ minHeight: 400, width: "100%" }}>
      <Card>
        <CardContent>
          <h1>Asset Transaction History</h1>
          <DataGrid
            rows={assetHistory}
            columns={columns}
            getRowId={(row) => row.transactionId.toString()} // Convert to string
            components={{
              Toolbar: GridToolbar,
            }}
            autoHeight
            // style={{  maxHeight: 700}}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[10, 20, 30, 50, 100]}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AssetsHistory;
