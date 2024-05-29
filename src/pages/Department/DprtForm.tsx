import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Autocomplete
} from "@mui/material";
import { Department } from "./DprtInterface";
import { RootState } from "../../store/store";
import { useSelector, useDispatch } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { fetchLocations } from "../../store/actions/locationActions";


interface DepartmentFormProps {
  department: Department | null;
  onSubmit: (department: Department) => void;
  handleModalClose: () => void;
}

const DprtForm: React.FC<DepartmentFormProps> = ({
  department,
  onSubmit,
  handleModalClose,
}) => {
  const [formValues, setFormValues] = useState<Department>({
    departmentId: department ? department.departmentId : 0,
    departmentName: department ? department.departmentName : "",
    departmentLocation: department ? department.departmentLocation : 0,
    departmentStatus: department ? department.departmentStatus : false,
    createdDate: department ? department.createdDate : "",
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
  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    if (name === "departmentLocation") {
      setFormValues((prevValues) => ({
        ...prevValues,
        departmentLocation: value,
      }));
    } else {
      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: value === "Active" ? true : false,
      }));
    }
  };
  const handleAutocompleteChange = (
    event: React.ChangeEvent<{}>,
    newValue: any | null
  ) => {
    if (newValue) {
      setFormValues((prevValues) => ({
        ...prevValues,
        departmentLocation: newValue.locationId,
      }));
    }
  };
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(formValues);
  };

  return (
    <form onSubmit={handleSubmit} className="Ast-form-container">
      <TextField
        className="ast-form-text-field"
        label="Department Name"
        variant="outlined"
        size="small"
        name="departmentName"
        value={formValues.departmentName}
        onChange={handleChange}
        required
      />
      <Autocomplete
        options={locationIds}
        className="ast-form-text-field"
        getOptionLabel={(option) => option.locationName}
        value={
          locationIds.find(
            (option) => option.locationId === formValues.departmentLocation
          ) || null
        }
        onChange={handleAutocompleteChange}
        renderInput={(params) => <TextField {...params} label="Location" />}
      />
     
      {department === null && (
        <FormControl variant="outlined" className="ast-form-text-field">
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            name="departmentStatus"
            value={formValues.departmentStatus ? "Active" : "Inactive"}
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
          {department ? "Update" : "Add"}
        </Button>
      </div>
    </form>
  );
};

export default DprtForm;
