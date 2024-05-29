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
  fetchDepartments,
  addDepartment,
  updateDepartment,
  activateDepartment,
  deactivateDepartment,
} from "../../store/actions/departmentActions";
import { Department } from "./DprtInterface";
import DepartmentForm from "./DprtForm";
import DepartmentTable from "./DprtTable";

const DprtManagement: React.FC = () => {
  const departments = useSelector(
    (state: RootState) => state.department.departments
  );

  const dispatch = useDispatch<ThunkDispatch<RootState, null, any>>();

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [departmentFormData, setDepartmentFormData] =
    useState<Department | null>(null);

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  const addNewDepartment = () => {
    setIsModalOpen(true);
    setDepartmentFormData(null);
  };

  const editDepartment = (department: Department) => {
    setIsModalOpen(true);
    setDepartmentFormData(department);
  };

  const toggleDepartmentStatus = async (
    departmentId: number,
    status: boolean
  ) => {
    try {
      if (status) {
        dispatch(activateDepartment(departmentId));
      } else {
        dispatch(deactivateDepartment(departmentId));
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
    setDepartmentFormData(null);
  };

  const handleFormSubmit = async (department: Department) => {
    if (departmentFormData === null) {
      dispatch(addDepartment(department));
    } else {
      dispatch(updateDepartment(department));
    }
    setIsModalOpen(false);
  };



  const filteredDepartmentList = searchTerm
    ? departments.filter((dprt) =>
        Object.values(dprt).some(
          (value) =>
            value &&
            typeof value === "string" &&
            value.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : departments;
  return (
    <div>
      <h1>Department Management</h1>
      <Card>
        <CardContent>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <TextField
              label="Search Department"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={addNewDepartment}
            >
              Add Department
            </Button>
          </div>
          <br />
          {departments.length === 0 ? (
            <SkeletonTable />
          ) : (
            <DepartmentTable
              departmentList={filteredDepartmentList}
              editDepartment={editDepartment}
              toggleDepartmentStatus={toggleDepartmentStatus}
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
                  {departmentFormData ? "Edit Department" : "Add Department"}
                </Typography>
                <Button color="error" onClick={handleModalClose}>
                  <Close />
                </Button>
              </div>
              <br />
              <DepartmentForm
                department={departmentFormData}
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

export default DprtManagement;
