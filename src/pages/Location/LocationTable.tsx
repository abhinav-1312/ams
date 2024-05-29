import React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { IconButton, Button } from "@mui/material";
import { Edit } from "@mui/icons-material";
import { Location } from "./LocationInterface";

interface LocationTableProps {
  locationList: Location[];
  editLocation: (location: Location) => void;
  toggleLocationStatus: (locationId: any, status: boolean) => void; // Update this line
}

const LocationTable: React.FC<LocationTableProps> = ({
  locationList,
  editLocation,
  toggleLocationStatus,
}) => {
  const columns = [
    { field: "locationId", headerName: "ID", width: 90 },
    {
      field: "locationName",
      headerName: "Location Name",
      width: 200,
      renderCell: (params: any) => <div>{params.value}</div>,
    },
    {
      field: "locationCode",
      headerName: "Location Code",
      width: 130,
      renderCell: (params: any) => <div>{params.value}</div>,
    },
    {
      field: "address",
      headerName: "Address",
      width: 200,
      renderCell: (params: any) => <div>{params.value}</div>,
    },
    {
      field: "description",
      headerName: "State",
      width: 200,
      renderCell: (params: any) => <div>{params.value}</div>,
    },
    {
      field: "gstNumber",
      headerName: "GST Number",
      width: 200,
      renderCell: (params: any) => <div>{params.value}</div>,
    },
    {
      field: "mobileNumber",
      headerName: "Mobile Number",
      width: 200,
      renderCell: (params: any) => <div>{params.value}</div>,
    },
    {
      field: "latitude",
      headerName: "Latitude",
      width: 150,
      renderCell: (params: any) => <div>{params.value}</div>,
    },
    {
      field: "longitude",
      headerName: "Longitude",
      width: 150,
      renderCell: (params: any) => <div>{params.value}</div>,
    },
    {
      field: "locationType",
      headerName: "Location Type",
      width: 150,
      renderCell: (params: any) => <div>{params.value}</div>,
    },
    // { field: "serialNo", headerName: "Serial No", width: 120 },
    {
      field: "locationStatus",
      headerName: "Status",
      width: 120,
      renderCell: (params: any) => (
        <div>{params.row.locationStatus ? "Active" : "Inactive"}</div>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params: any) => (
        <div>
          <IconButton onClick={() => editLocation(params.row as Location)}>
            <Edit />
          </IconButton>

          {params.row.locationStatus ? (
            <Button
              className="table-btn"
              onClick={() => toggleLocationStatus(params.row.locationId, false)}
              variant="contained"
              color="secondary"
            >
              Inactive
            </Button>
          ) : (
            <Button
              className="table-btn"
              onClick={() => toggleLocationStatus(params.row.locationId, true)}
              variant="contained"
              color="primary"
            >
              Active
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div style={{ minHeight: 400, width: "100%" }}>
      <DataGrid
        rows={locationList.map((row, index) => ({ ...row, id: index }))}
        columns={columns}
        getRowId={(row) => row.id}
        style={{ maxHeight: 700 }}
        components={{
          Toolbar: GridToolbar,
        }}
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

export default LocationTable;
