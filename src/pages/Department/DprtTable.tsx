import React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { IconButton, Button } from "@mui/material";
import { Edit,  } from "@mui/icons-material";
import { Department } from "./DprtInterface"; 

interface DepartmentTableProps {
  departmentList: Department[];
  editDepartment: (department: Department) => void;
  toggleDepartmentStatus: (departmentId: number, status: boolean) => void;
}

const DprtTable: React.FC<DepartmentTableProps> = ({
  departmentList,
  editDepartment,
  toggleDepartmentStatus,
}) => {
  const columns = [
    { field: "departmentId", headerName: "ID", width: 90 },
    { field: "departmentName", headerName: "Department Name", width: 150 },
    { field: "locationName", headerName: "Location", width: 150 },
    {
      field: "departmentStatus",
      headerName: "Status",
      width: 120,
      renderCell: (params: any) => (
        <div>{params.row.departmentStatus ? "Active" : "Inactive"}</div>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 160,
      renderCell: (params: any) => (
        <div>
          <IconButton onClick={() => editDepartment(params.row as Department)}>
            <Edit />
          </IconButton>

          <IconButton
            onClick={() =>
              toggleDepartmentStatus(
                params.row.departmentId,
                !params.row.departmentStatus
              )
            }
          >
            {params.row.departmentStatus ? (
              <Button   className="table-btn" variant="contained" color="primary">

                Inactive
              </Button>
            ) : (
              <Button   className="table-btn" variant="contained" color="secondary">
                Active
              </Button>
            )}
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <div style={{   width: "100%" }}>
      <DataGrid
        rows={departmentList.map((row, index) => ({ ...row, id: index }))}
        columns={columns}
        getRowId={(row) => row.id}
        style={{  maxHeight: 700}}
        components={{
          Toolbar: GridToolbar,
        }}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[10, 20,30,50, 100]}
      />
    </div>
  );
};

export default DprtTable;
