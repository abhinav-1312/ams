import React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { IconButton, Button } from "@mui/material";
import { Edit } from "@mui/icons-material";
import { Employee } from "./EmployeeInterface";

interface EmployeeTableProps {
  employeeList: Employee[];
  editEmployee: (employee: Employee) => void;
  toggleEmployeeStatus: (employeeId: number, employeeStatus: boolean) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employeeList,
  editEmployee,
  toggleEmployeeStatus,
}) => {
  const columns = [
    { field: "employeeId", headerName: "ID", width: 90 },
    { field: "employeeName", headerName: "FT/FOM Name", width: 150 },
    { field: "email", headerName: "FT/FOM Email", width: 230 },
    { field: "mobileNumber", headerName: "FT/FOM Phone", width: 150 },
    { field: "kamAsm", headerName: "KAM/ASM Name", width: 150 },
    { field: "kamAsmEmail", headerName: "KAM/ASM Email", width: 230 },
    { field: "kamAsmMobileNumber", headerName: "KAM/ASM Phone", width: 150 },
    { field: "locationName", headerName: "Location", width: 150 },
    {
      field: "employeeStatus",
      headerName: "Status",
      width: 120,
      renderCell: (params: any) => (
        <div>{params.row.employeeStatus ? "Active" : "Inactive"}</div>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 160,
      renderCell: (params: any) => (
        <div>
          <IconButton onClick={() => editEmployee(params.row as Employee)}>
            <Edit />
          </IconButton>
          {params.row.employeeStatus ? (
            <Button
              className="table-btn"
              onClick={() => toggleEmployeeStatus(params.row.employeeId, false)}
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
              onClick={() => toggleEmployeeStatus(params.row.employeeId, true)}
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
        rows={employeeList.map((row, index) => ({ ...row, id: index }))}
        columns={columns}
        getRowId={(row) => row.id}
        components={{
          Toolbar: GridToolbar,
        }}
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

export default EmployeeTable;
