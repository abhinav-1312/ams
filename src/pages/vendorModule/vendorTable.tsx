import React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { IconButton, Button } from "@mui/material";
import { Edit, Block, CheckCircle } from "@mui/icons-material";
import { Vendor } from "./vendorInterface";

interface VendorTableProps {
  vendorList: Vendor[];
  editVendor: (VendorType: Vendor) => void;
  toggleVendorStatus: (
    vendorId: number,
    vendorStatus: boolean
  ) => void;
}

const VendorTable: React.FC<VendorTableProps> = ({
  vendorList,
  editVendor,
  toggleVendorStatus,
}) => {


  const columns = [
    { field: "vendorId", headerName: "Vendor Id", width: 90 },
    { field: "vendorName", headerName: "Vendor Name", width: 150 },
    { field: "mobileNumber", headerName: "Mobile Number", width: 150 },
    { field: "vendorType", headerName: "Vendor Type", width: 150 },
    {
      field: "vendorStatus",
      headerName: "Status",
      width: 120,
      renderCell: (params: any) => (
        <div>{params.row.vendorStatus ? "Active" : "Inactive"}</div>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 160,
      renderCell: (params: any) => (
        <div>
          <IconButton onClick={() => editVendor(params.row as Vendor)}>
            <Edit />
          </IconButton>

          {params.row.vendorStatus ? (
            <Button
              className="table-btn"
              variant="contained"
              color="primary"
              onClick={() =>
                toggleVendorStatus(params.row.vendorId, false)
              }
            >
              Inactive
            </Button>
          ) : (
            <Button
              className="table-btn"
              variant="contained"
              color="secondary"
              onClick={() =>
                toggleVendorStatus(params.row.vendorId, true)
              }
            >
              Active
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div style={{ minHeight: 400, maxHeight: 900, width: "100%" }}>
      <DataGrid
        rows={vendorList.map((row, index) => ({ ...row, id: index }))}
        columns={columns}
        getRowId={(row) => Math.random()*vendorList.length}

        components={{
          Toolbar: GridToolbar,
        }}
        style={{  maxHeight: 700}}
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

export default VendorTable;
