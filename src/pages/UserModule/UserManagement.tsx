import React, { useState, useEffect, ChangeEvent } from "react";
import { ThunkDispatch } from "redux-thunk";
import {
  Button,
  TextField,
  Typography,
  Box,
  Modal,
  Card,
  CardContent,
} from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import { RootState } from "../../store/store";
import { useSelector, useDispatch } from "react-redux";
import SkeletonTable from "../../components/SkeletonTable";
import {
  fetchUsers,
  addUser,
  updateUser,
  activateUser,
  deactivateUser,
} from "../../store/actions/userActions";
import { User } from "./UserInterface";
import UserForm from "./UserForm";
import UserTable from "./UserTable";

const UserManagement: React.FC = () => {
  const users = useSelector((state: RootState) => state.user.users);

  const dispatch = useDispatch<ThunkDispatch<RootState, null, any>>();

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userFormData, setUserFormData] = useState<User | null>(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const addNewUser = () => {
    setIsModalOpen(true);
    setUserFormData(null);
  };

  const editUser = (user: User) => {
    setIsModalOpen(true);
    setUserFormData(user);
  };

  const toggleUserStatus = async (userId: number, status: boolean) => {
    try {
      if (status) {
        dispatch(activateUser(userId));
      } else {
        dispatch(deactivateUser(userId));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setUserFormData(null);
  };

  const handleFormSubmit = async (user: User) => {
    try {
      if (userFormData === null) {
        dispatch(addUser(user));
      } else {
        dispatch(updateUser(user));
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredUserList = users.filter((user) => {
    const userName = user.userName?.toLowerCase() || "";
    return userName.includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <h1>User Management</h1>
      <Card>
        <CardContent>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <TextField
              label="Search Users"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={addNewUser}
            >
              Add User
            </Button>
          </div>
          <br />
          {users.length === 0 ? (
            <SkeletonTable />
          ) : (
            <UserTable
              userList={filteredUserList}
              editUser={editUser}
              toggleUserStatus={toggleUserStatus}
            />
          )}
        </CardContent>
      </Card>
      <Modal open={isModalOpen}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Card>
            <CardContent>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  {userFormData ? "Edit User" : "Add User"}
                </Typography>
                <Button color="error" onClick={handleModalClose}>
                  <Close />
                </Button>
              </div>
              <br />
              <UserForm
                user={userFormData}
                onSubmit={handleFormSubmit}
                handleModalClose={handleModalClose}
              />
            </CardContent>
          </Card>
        </Box>
      </Modal>
    </div>
  );
};

export default UserManagement;
