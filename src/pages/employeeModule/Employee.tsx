import React, { useState, useEffect, ChangeEvent } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { RootState } from "../../store/store";
import SkeletonTable from "../../components/SkeletonTable";
import {
  fetchEmployees,
  addEmployee,
  updateEmployee,
  activateEmployee,
  deactivateEmployee,
} from "../../store/actions/employeeActions";
import { Employee } from "./EmployeeInterface";
import EmployeeForm from "./EmployeeForm";
import EmployeeTable from "./EmployeeTable";

const EmployeeManagement: React.FC = () => {
  const employees = useSelector(
    (state: RootState) => state.employee.employees
  );

  const dispatch = useDispatch<ThunkDispatch<RootState, null, any>>();

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeFormData, setEmployeeFormData] = useState<Employee | null>(
    null
  );

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const addNewEmployee = () => {
    setIsModalOpen(true);
    setEmployeeFormData(null);
  };

  const editEmployee = (employee: Employee) => {
    setIsModalOpen(true);
    setEmployeeFormData(employee);
  };

  const toggleEmployeeStatus = async (
    employeeId: number,
    status: boolean
  ) => {
    try {
      if (status) {
        dispatch(activateEmployee(employeeId));
      
      } else {
        dispatch(deactivateEmployee(employeeId));
      
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
    setEmployeeFormData(null);
  };

  const handleFormSubmit = async (employee: Employee) => {
    if (employeeFormData === null) {
      dispatch(addEmployee(employee));
    
    } else {
      dispatch(updateEmployee(employee));
    
    }
    setIsModalOpen(false);
  };

  const filteredEmployeeList = employees.filter((employee) => {
    const employeeName = employee.employeeName?.toLowerCase() || "";
    return employeeName.includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <h1>FT/FOM-KAM/ASM Management</h1>
      <Card>
        <CardContent>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <TextField
              label="Search FT/FOM-KSM/ASM"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={addNewEmployee}
            >
              Add FT/FOM-KAM/ASM
            </Button>
          </div>
          <br />
          {employees.length === 0 ? (
            <SkeletonTable />
          ) : (
            <EmployeeTable
              employeeList={filteredEmployeeList}
              editEmployee={editEmployee}
              toggleEmployeeStatus={toggleEmployeeStatus}
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
                  {employeeFormData ? "Edit FT/FOM-KAM/ASM" : "Add FT/FOM-KAM/ASM"}
                </Typography>
                <Button color="error" onClick={handleModalClose}>
                  <Close />
                </Button>
              </div>
              <br />
              <EmployeeForm
                employee={employeeFormData}
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

export default EmployeeManagement;
