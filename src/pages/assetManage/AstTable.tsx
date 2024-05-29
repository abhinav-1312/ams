import React from "react";
import { DataGrid, GridToolbar, GridValueFormatterParams, GridValueGetterParams } from "@mui/x-data-grid";
import { IconButton, Button } from "@mui/material";
import { Edit, Block, CheckCircle } from "@mui/icons-material";
import { Asset } from "./AstInterface";
import { useNavigate } from "react-router-dom";
interface AssetTableProps {
  assetList: Asset[];
  editAsset: (asset: Asset) => void;
  toggleAssetStatus: (assetId: number, status: boolean) => void; // Add this prop
}

const AssetTable: React.FC<AssetTableProps> = ({
  assetList,
  editAsset,
  toggleAssetStatus,
}) => {
  const navigate = useNavigate();

  const handleRowClick = (asset: Asset) => {
    navigate(`/assetDetail/${asset.assetId}`);
  };

  const handleInvoice = async (assetId: number) => {
    try {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = ".pdf, image/*"; // Specify the allowed file types if needed
      fileInput.click();

      await new Promise<void>((resolve, reject) => {
        fileInput.addEventListener("change", async () => {
          try {
            const file = fileInput.files?.[0];

            if (!file) {
              reject(new Error("No file selected."));
              return;
            }

            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch(
              `https://asset-management-service.azurewebsites.net/asset-management/uploadDocument?assetId=${assetId}&docType=Invoice`,
              {
                method: "POST",
                body: formData,
              }
            );

            if (response.ok) {
              // Handle successful upload
              alert("vendor invoice uploaded successfully!");
              console.log("Invoice uploaded successfully!");
              resolve();
            } else {
              // Handle upload error
              alert("Error uploading vendor invoice");
              console.error("Error uploading invoice:", response.statusText);
              reject(
                new Error(`Error uploading invoice: ${response.statusText}`)
              );
            }
          } catch (error) {
            console.error("Error handling invoice:", error);
            reject(error);
          }
        });
      });
    } catch (error) {
      console.error("Error handling invoice:", error);
    }
  };

  const formatDateToIST = (dateString: string | null) => {
    if (!dateString) {
      return "";
    }

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      // hour: "numeric",
      // minute: "2-digit",
      // second: "2-digit",
      // hour12: true, // Display time in 12-hour format (AM/PM)
      timeZone: "Asia/Kolkata", // Indian Standard Time (IST)
    };
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      // Invalid date string, return an empty string
      return "";
    }

    return new Intl.DateTimeFormat("en-IN", options).format(date);
  };

  console.log("HELLO")

  const calculateAgingDays = (assignedDate: string | null) => {
    console.log("Calcuate: ", assignedDate)
    if (!assignedDate) {
      return "";
    }

    const assignedDateObj = new Date(assignedDate);
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - assignedDateObj.getTime();
    const agingDays = Math.floor(timeDifference / (1000 * 3600 * 24)); // Calculate days

    return agingDays.toString();
  };

  const columns = [
    {
      field: "assetTag",
      headerName: "Barcode",
      width: 150,
      renderCell: (params: any) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => handleRowClick(params.row as Asset)}
        >
          {params.row.assetTag}
        </div>
      ),
    },
    {
      field: "assetId",
      headerName: "Asset Id",
      width: 90,
      renderCell: (params: any) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => handleRowClick(params.row as Asset)}
        >
          {params.row.assetId}
        </div>
      ),
    },
    {
      field: "assetPictureUrl",
      headerName: "Asset Picture",
      width: 150,
      renderCell: (params: any) => (
        <img
          src={`https://asset-management-service.azurewebsites.net/asset-management/downloadDocument?assetId=${params.row.assetId}&docType=Asset`}
          alt={`Asset ${params.row.id}`}
          style={{ maxWidth: "100%", maxHeight: "100%" }}
          onClick={() => handleRowClick(params.row as Asset)}
        />
      ),
    },
    {
      field: "assetName",
      headerName: "Asset Name",
      width: 150,
      renderCell: (params: any) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => handleRowClick(params.row as Asset)}
        >
          {params.row.assetName}
        </div>
      ),
    },

    {
      field: "assetType",
      headerName: "Type",
      width: 150,
      renderCell: (params: any) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => handleRowClick(params.row as Asset)}
        >
          {params.row.assetType}
        </div>
      ),
    },
    {
      field: "assetBrand",
      headerName: "Brand",
      width: 150,
      renderCell: (params: any) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => handleRowClick(params.row as Asset)}
        >
          {params.row.assetBrand}
        </div>
      ),
    },
    {
      field: "assetQuantity",
      headerName: "Quantity",
      width: 150,
      renderCell: (params: any) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => handleRowClick(params.row as Asset)}
        >
          {params.row.assetQuantity}
        </div>
      ),
    },
    {
      field: "currentKamAsm",
      headerName: "Current Kam/Asm",
      width: 170,
      renderCell: (params: any) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => handleRowClick(params.row as Asset)}
        >
          {params.row.currentKamAsm}
        </div>
      ),
    },
    {
      field: "locationName",
      headerName: "Current Location",
      width: 150,
      renderCell: (params: any) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => handleRowClick(params.row as Asset)}
        >
          {params.row.locationName}
        </div>
      ),
    },
    {
      field: "issuedUserName",
      headerName: "Current FT/FOM",
      width: 150,
      renderCell: (params: any) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => handleRowClick(params.row as Asset)}
        >
          {params.row.issuedUserName}
        </div>
      ),
    },
    {
      field: "assetCost",
      headerName: "Asset Cost",
      width: 150,
      renderCell: (params: any) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => handleRowClick(params.row as Asset)}
        >
          {params.row.assetCost}
        </div>
      ),
    },
    {
      field: "supplier",
      headerName: "Received From Supplier",
      width: 200,
      renderCell: (params: any) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => handleRowClick(params.row as Asset)}
        >
          {params.row.supplier}
        </div>
      ),
    },
    {
      field: "assignedDate",
      headerName: "Assigned Date",
      width: 170,
      valueFormatter: (params : GridValueFormatterParams) => params.value,
      renderCell: (params: any) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => handleRowClick(params.row as Asset)}
        >
          {formatDateToIST(params.value)}
        </div>
      ),
    },
    {
      field: "agingDays",
      headerName: "Aging Days",
      width: 150,
      // valueFormatter: (params: GridValueFormatterParams) => {
      //   const rowParams = params.api.getRowParams(params.rowIndex); // Access row params using rowIndex
      // const assignedDate = params.data.assignedDate; // Access assignedDate from row data
      // const agingDays = calculateAgingDays(assignedDate); // Calculate aging days based on assignedDate

      // },
      valueGetter: (params : GridValueGetterParams) => calculateAgingDays(params.row.assignedDate),
      renderCell: (params: any) => (
        <div style={{ cursor: "pointer" }}>
          {calculateAgingDays(params.row.assignedDate)}
        </div>
      ),
    },
    {
      field: "hsnCode",
      headerName: "HSN Code",
      width: 150,
      renderCell: (params: any) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => handleRowClick(params.row as Asset)}
        >
          {params.row.hsnCode}
        </div>
      ),
    },
    {
      field: "latestTransaction.transactionType",
      headerName: "Latest Transaction",
      width: 150,
      valueGetter: (params : GridValueGetterParams) => params.row.latestTransaction.transactionType,
      renderCell: (params: any) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => handleRowClick(params.row as Asset)}
        >
          {params.row.latestTransaction.transactionType}
        </div>
      ),
    },
    {
      field: "assetStatus",
      headerName: "Current Status",
      width: 120,
      valueFormatter: (params: GridValueFormatterParams) => params.value ? "Active" : "Inactive",
      renderCell: (params: any) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => handleRowClick(params.row as Asset)}
        >
          {params.row.assetStatus ? "Active" : "Inactive"}
        </div>
      ),
    },

    {
      field: "action",
      headerName: "Action",
      width: 160,
      renderCell: (params: any) => (
        <div>
          <IconButton onClick={() => editAsset(params.row as Asset)}>
            <Edit />
          </IconButton>

          {params.row.assetStatus ? (
            <Button
              className="table-btn"
              onClick={() => toggleAssetStatus(params.row.assetId, false)}
              variant="contained"
              color="secondary"
            >
              Inactive
            </Button>
          ) : (
            <Button
              className="table-btn"
              variant="contained"
              color="primary"
              onClick={() => toggleAssetStatus(params.row.assetId, true)}
            >
              Active
            </Button>
          )}
        </div>
      ),
    },
    {
      field: "Vendor invoice",
      headerName: "Upload Invoice",
      width: 160,
      renderCell: (params: any) => (
        <div>
          <Button
            className="table-btn"
            variant="contained"
            color="warning"
            onClick={() => handleInvoice(params.row.assetId)}
          >
            Upload
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ minHeight: 400, maxHeight: 900, width: "100%" }}>
      <DataGrid
        rows={assetList.map((row, index) => ({ ...row, id: index }))}
        columns={columns}
        getRowId={(row) => row.id}
        components={{
          Toolbar: GridToolbar,
        }}
        // autoHeight
        style={{ maxHeight: 700 }}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[10, 20, 30, 50, 100]}
      />
    </div>
  );
};

export default AssetTable;
