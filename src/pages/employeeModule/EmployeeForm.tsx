import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Autocomplete,
  SelectChangeEvent,
} from "@mui/material";
import { Employee } from "./EmployeeInterface";
import { RootState } from "../../store/store";
import { useSelector, useDispatch } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { fetchLocations } from "../../store/actions/locationActions";
interface EmployeeFormProps {
  employee: Employee | null;
  onSubmit: (employee: Employee) => void;
  handleModalClose: () => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  employee,
  onSubmit,
  handleModalClose,
}) => {
  const [formValues, setFormValues] = useState<Employee>({
    employeeId: employee ? employee.employeeId : 0,
    employeeName: employee ? employee.employeeName : "",
    email: employee ? employee.email : "",
    mobileNumber: employee ? employee.mobileNumber : "",
    location: employee ? employee.location : 0,
    locationName: employee ? employee.locationName : "",
    employeeStatus: employee ? employee.employeeStatus : false,
    createdDate: employee ? employee.createdDate : "",
    kamAsm: employee ? employee.kamAsm : "",
    kamAsmEmail: employee ? employee.kamAsmEmail : "",
    kamAsmMobileNumber : employee ? employee.kamAsmMobileNumber: ""
    
  });
  const dispatch = useDispatch<ThunkDispatch<RootState, null, any>>();
  const locationIds = useSelector(
    (state: RootState) => state.location.locations
  );


  useEffect(() => {
    dispatch(fetchLocations());
  }, [dispatch]);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleAutocompleteChange = (
    event: React.ChangeEvent<{}>,
    newValue: any | null
  ) => {
    if (newValue) {
      setFormValues((prevValues) => ({
        ...prevValues,
        location: newValue.locationId,
      }));
    }
  };
  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value === "Active" ? true : false,
    }));
  };
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(formValues);
  };

  return (
    <form onSubmit={handleSubmit} className="Ast-form-container">
      <TextField
        className="ast-form-text-field"
        label="FT/FOM Name"
        variant="outlined"
        size="small"
        name="employeeName"
        required
        value={formValues.employeeName}
        onChange={handleChange}
      />
      <TextField
        className="ast-form-text-field"
        label="FT/FOM Email"
        variant="outlined"
        size="small"
        name="email"
        value={formValues.email}
        onChange={handleChange}
      />
      <div style={{ width: "45%" }}>
        <TextField
          className="  emp-form-mobile"
          label="FT/FOM Phone Number"
          variant="outlined"
          size="small"
          type="number"
          name="mobileNumber"
          value={formValues.mobileNumber}
          onChange={handleChange}
        />
        {formValues.mobileNumber &&
          !/^\d{10}$/.test(formValues.mobileNumber) && (
            <Typography variant="subtitle2" sx={{ color: "red" }}>
              Please enter a valid 10-digit mobile number.
            </Typography>
          )}
      </div>
      <TextField
        className="ast-form-text-field"
        label="KAM/ASM Name"
        variant="outlined"
        size="small"
        name="kamAsm"
        required
        value={formValues.kamAsm}
        onChange={handleChange}
      />
      <TextField
        className="ast-form-text-field"
        label="KAM/ASM Email"
        variant="outlined"
        size="small"
        name="kamAsmEmail"
        value={formValues.kamAsmEmail}
        onChange={handleChange}
      />
      <div style={{ width: "45%" }}>
        <TextField
          className="  emp-form-mobile"
          label="KAM/ASM Phone Number"
          variant="outlined"
          size="small"
          type="number"
          name="kamAsmMobileNumber"
          value={formValues.kamAsmMobileNumber}
          onChange={handleChange}
        />
        {formValues.mobileNumber &&
          !/^\d{10}$/.test(formValues.mobileNumber) && (
            <Typography variant="subtitle2" sx={{ color: "red" }}>
              Please enter a valid 10-digit mobile number.
            </Typography>
          )}
      </div>
      <Autocomplete
        options={locationIds}
        className="ast-form-text-field"
        getOptionLabel={(option) => option.locationName}
        value={
          locationIds.find(
            (option) => option.locationId === formValues.location
          ) || null
        }
        onChange={handleAutocompleteChange}
        renderInput={(params) => <TextField {...params} label="Location" />}
      />
      
      {employee === null && (
        <FormControl variant="outlined" className="ast-form-text-field">
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            name="employeeStatus"
            value={formValues.employeeStatus ? "Active" : "Inactive"}
            onChange={handleSelectChange}
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
      )}
      <div className="submit-button">
        <Button
          onClick={handleModalClose}
          type="submit"
          variant="outlined"
          color="error"
          className="sub-btn"
        >
          {"Close"}
        </Button>
        <Button type="submit" variant="contained" className="sub-btn">
          {employee ? "Update" : "Add"}
        </Button>
      </div>
    </form>
  );
};

export default EmployeeForm;
