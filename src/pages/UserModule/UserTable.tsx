import React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { IconButton, Button } from "@mui/material";
import { Edit } from "@mui/icons-material";
import { User } from "./UserInterface";

interface UserTableProps {
  userList: User[];
  editUser: (user: User) => void;
  toggleUserStatus: (userId: number, status: boolean) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  userList,
  editUser,
  toggleUserStatus,
}) => {
  const columns = [
    { field: "userId", headerName: "User ID", width: 90 },
    { field: "userName", headerName: "User Name", width: 150 },
    { field: "mobileNumber", headerName: "Mobile Number ", width: 150 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "departmentName", headerName: "Department", width: 150 },
    { field: "locationName", headerName: "Location", width: 150 },
    { field: "password", headerName: "Password", width: 150 },
    {
      field: "userStatus",
      headerName: "User Status",
      width: 150,
      renderCell: (params: any) => (
        <div>{params.row.userStatus ? "Active" : "Inactive"}</div>
      ),
    },
    {
      field: "privileges",
      headerName: "Privileges",
      width: 150,
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params: any) => (
        <div>
          <IconButton onClick={() => editUser(params.row as User)}>
            <Edit />
          </IconButton>

          {params.row.userStatus ? (
            <Button
              className="table-btn"
              onClick={() => toggleUserStatus(params.row.userId, false)}
              variant="contained"
              color="secondary"
            >
              Inactive
            </Button>
          ) : (
            <Button
              className="table-btn"
              onClick={() => toggleUserStatus(params.row.userId, true)}
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
    <div style={{ minHeight: 400, maxHeight: 900, width: "100%" }}>
      <DataGrid
        rows={userList.map((row, index) => ({ ...row, id: index }))}
        columns={columns}
        getRowId={(row) => row.id}
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

export default UserTable;
