import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import {
  Button,
  TextField,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Checkbox,
  Autocomplete,
  ListItemText,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { User } from "./UserInterface";
import { RootState } from "../../store/store";
import { useSelector, useDispatch } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { fetchLocations } from "../../store/actions/locationActions";
import { fetchEmployees } from "../../store/actions/employeeActions";
import { fetchDepartments } from "../../store/actions/departmentActions";
interface UserFormProps {
  user: User | null;
  onSubmit: (user: User) => void;
  handleModalClose: () => void;
}

const privilegesOptions = [
  "Admin",
  "Assets",
  "Location",
  "Dashboard",
  "User",
  "Department",
  "FT/FOM - KAM/ASM",
  "Transaction",
  "QuickCode",
  "Tnx Delete",
];

const UserForm: React.FC<UserFormProps> = ({
  user,
  onSubmit,
  handleModalClose,
}) => {
  const [formValues, setFormValues] = useState<User>({
    departmentId: user ? user.departmentId : 0,
    email: user ? user.email : "",
    locationId: user ? user.locationId : 0,
    password: user ? user.password : "",
    privileges: user ? user.privileges.split(",") : [],
    userId: user ? user.userId : 0,
    userName: user ? user.userName : "",
    mobileNumber: user ? user.mobileNumber : "",
    userStatus: user ? user.userStatus : false,
    // createdDate: user ? user.createdDate : "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    const updatedValue = type === "checkbox" ? checked : value;

    setFormValues((prevValues) => ({ ...prevValues, [name]: updatedValue }));
  };
  const dispatch = useDispatch<ThunkDispatch<RootState, null, any>>();
  const locationIds = useSelector(
    (state: RootState) => state.location.locations
  );

  const Dprts = useSelector((state: RootState) => state.department.departments);
  const Emplys = useSelector((state: RootState) => state.employee.employees);

  useEffect(() => {
    dispatch(fetchLocations());
    dispatch(fetchEmployees());
    dispatch(fetchDepartments());
  }, [dispatch]);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  const handleAutocompleteChange = (
    event: React.ChangeEvent<{}>,
    newValue: any | null
  ) => {
    if (newValue) {
      setFormValues((prevValues) => ({
        ...prevValues,
        locationId: newValue.locationId,
      }));
    }
  };
  const handleAutocompleteEmail = (
    event: React.ChangeEvent<{}>,
    newValue: any | null
  ) => {
    if (newValue) {
      setFormValues((prevValues) => ({
        ...prevValues,
        email: newValue.email,
      }));
    }
  };
  const handleAutocompleteMobile = (
    event: React.ChangeEvent<{}>,
    newValue: any | null
  ) => {
    if (newValue) {
      setFormValues((prevValues) => ({
        ...prevValues,
        mobileNumber: newValue.mobileNumber,
      }));
    }
  };

  const handleAutocompleteDprt = (
    event: React.ChangeEvent<{}>,
    newValue: any | null
  ) => {
    if (newValue) {
      setFormValues((prevValues) => ({
        ...prevValues,
        departmentId: newValue.departmentId,
      }));
    }
  };
  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;

    const updatedPrivileges =
      value === "Active" || value === "Inactive"
        ? formValues.privileges
        : Array.isArray(value)
        ? value
        : [value];

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]:
        value === "Active"
          ? true
          : value === "Inactive"
          ? false
          : prevValues[name as keyof User],
      privileges: updatedPrivileges,
    }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const updatedFormValues = {
      ...formValues,
      privileges: formValues.privileges.join(","),
    };

    onSubmit(updatedFormValues);
  };

  return (
    <form onSubmit={handleSubmit} className="Ast-form-container">
      <TextField
        className="ast-form-text-field"
        label="User Name"
        variant="outlined"
        size="small"
        name="userName"
        value={formValues.userName}
        onChange={handleChange}
        required
      />
      {/* <div style={{ width: "100%" }}> */}

      <Autocomplete
        options={Emplys}
        className="ast-form-text-field"
        getOptionLabel={(option) => option.mobileNumber}
        value={
          Emplys.find(
            (option) => option.mobileNumber === formValues.mobileNumber
          ) || null
        }
        onChange={handleAutocompleteMobile}
        renderInput={(params) => (
          <TextField {...params} label="Mobile Number" />
        )}
      />
      {/* {formValues.mobileNumber &&
          !/^\d{10}$/.test(formValues.mobileNumber) && (
            <Typography variant="subtitle2" sx={{ color: "red" }}>
              Please enter a valid 10-digit mobile number.
            </Typography>
          )}
      </div> */}
      <Autocomplete
        options={Emplys}
        className="ast-form-text-field"
        getOptionLabel={(option) => option.email}
        value={
          Emplys.find((option) => option.email === formValues.email) || null
        }
        onChange={handleAutocompleteEmail}
        renderInput={(params) => <TextField {...params} label="Email" />}
      />

      <Autocomplete
        options={Dprts}
        className="ast-form-text-field"
        getOptionLabel={(option) => option.departmentName}
        value={
          Dprts.find(
            (option) => option.departmentId === formValues.departmentId
          ) || null
        }
        onChange={handleAutocompleteDprt}
        renderInput={(params) => <TextField {...params} label="Department" />}
      />

      <TextField
        className="ast-form-text-field"
        label="Password"
        variant="outlined"
        size="small"
        name="password"
        type={showPassword ? "text" : "password"}
        value={formValues.password}
        onChange={handleChange}
        InputProps={{
          endAdornment: (
            <IconButton onClick={handleTogglePasswordVisibility} edge="end">
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          ),
        }}
        required
      />
      <Autocomplete
        options={locationIds}
        className="ast-form-text-field"
        getOptionLabel={(option) => option.locationName}
        value={
          locationIds.find(
            (option) => option.locationId === formValues.locationId
          ) || null
        }
        onChange={handleAutocompleteChange}
        renderInput={(params) => <TextField {...params} label="Location" />}
      />

      <FormControl variant="outlined" className="ast-form-text-field">
        <InputLabel>Privileges</InputLabel>
        <Select
          label="Privileges"
          name="privileges"
          multiple
          value={formValues.privileges}
          onChange={handleSelectChange}
          renderValue={(selected) =>
            Array.isArray(selected) ? selected.join(", ") : ""
          }
        >
          {privilegesOptions.map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox checked={formValues.privileges.includes(option)} />
              <ListItemText primary={option} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {user === null && (
        <FormControl variant="outlined" className="ast-form-text-field">
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            name="userStatus"
            value={formValues.userStatus ? "Active" : "Inactive"}
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
          {user ? "Update" : "Add"}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
