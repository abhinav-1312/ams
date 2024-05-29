import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Button, TextField, Typography, Autocomplete } from "@mui/material";
import { Location } from "./LocationInterface";
import { Select, InputLabel, MenuItem, FormControl } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
interface LocationFormProps {
  location: Location | null;
  onSubmit: (location: Location) => void;
  handleModalClose: () => void;
}

const LocationForm: React.FC<LocationFormProps> = ({
  location,
  onSubmit,
  handleModalClose,
}) => {
  const [formValues, setFormValues] = useState<Location>({
    locationName: location ? location.locationName : "",
    locationId: location ? location.locationId : 0,
    address: location ? location.address : "",
    description: location ? location.description : "",
    gstNumber: location ? location.gstNumber : "",
    mobileNumber: location ? location.mobileNumber : "",
    latitude: location ? location.latitude : "",
    longitude: location ? location.longitude : "",
    locationStatus: location ? location.locationStatus : true,
    serialNo: location ? location.serialNo : "",
    locationType: location ? location.locationType : "",
    locationCode: location ? location.locationCode : "",
  });

  const [LocationTypes, setLocationTypes] = useState<
    { id: string; name: string }[]
  >([]);

  useEffect(() => {
    fetch(
      "https://asset-management-service.azurewebsites.net/asset-management/getConfig?configType=Location Type"
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.responseData) {
          const assetTypesList = data.responseData.configDtoList.map(
            (astype: any) => ({
              id: astype.configId,
              name: astype.configDesc,
            })
          );
          setLocationTypes(assetTypesList);
        }
      })
      .catch((error) => {
        console.error("Error fetching asset data:", error);
      });
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const updatedValue = name === "locationStatus" ? value === "Active" : value;

    setFormValues((prevValues) => ({ ...prevValues, [name]: updatedValue }));
  };
  const StatehandleChange = (
    event: React.SyntheticEvent,
    value: string | null
  ) => {
    if (value) {
      setFormValues((prevValues) => ({ ...prevValues, description: value }));
    } else {
      setFormValues((prevValues) => ({ ...prevValues, description: "" }));
    }
  };

  const handleLocationTypeChange = (
    event: React.ChangeEvent<{}>,
    newValue: any | null
  ) => {
    setFormValues((prevValues) => ({ ...prevValues, locationType: newValue }));
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
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
        label="Location ID"
        variant="outlined"
        size="small"
        name="locationId"
        value={formValues.locationId}
        onChange={handleChange}
        disabled
        style={{ display: "none" }}
      />
      <TextField
        className="ast-form-text-field"
        label="Location Code"
        variant="outlined"
        size="small"
        name="locationCode"
        value={formValues.locationCode}
        onChange={handleChange}
      />
      <TextField
        className="ast-form-text-field"
        label="Location Name"
        variant="outlined"
        size="small"
        name="locationName"
        onKeyDown={handleKeyDown}
        value={formValues.locationName}
        onChange={handleChange}
        required
      />
      <FormControl variant="outlined" className="ast-form-text-field">
        <Autocomplete
          options={LocationTypes.map((astype) => astype.name)}
          value={formValues.locationType}
          onChange={handleLocationTypeChange}
          renderInput={(params) => (
            <TextField {...params} label="Location Type" variant="outlined" />
          )}
        />
      </FormControl>
      
      <TextField
        className="ast-form-text-field"
        label="Address"
        variant="outlined"
        size="small"
        name="address"
        value={formValues.address}
        onChange={handleChange}
      />

      <Autocomplete
        options={IndianStates}
        getOptionLabel={(option) => option}
        className="ast-form-text-field"
        renderInput={(params) => (
          <TextField
            {...params}
            label="State"
            variant="outlined"
            name="description"
          />
        )}
        value={formValues.description}
        onChange={StatehandleChange}
      />
      <TextField
        className="ast-form-text-field"
        label="GST Number"
        variant="outlined"
        size="small"
        name="gstNumber"
        value={formValues.gstNumber}
        onChange={handleChange}
      />
      <div style={{ width: "45%" }}>
        <TextField
          className="  emp-form-mobile"
          label="Mobile Number"
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
        label="Latitude"
        variant="outlined"
        size="small"
        name="latitude"
        value={formValues.latitude}
        onChange={handleChange}
      />
      <TextField
        className="ast-form-text-field"
        label="Longitude"
        variant="outlined"
        size="small"
        name="longitude"
        value={formValues.longitude}
        onChange={handleChange}
      />
      {location === null && (
        <FormControl className="ast-form-text-field">
          <InputLabel id="demo-simple-select-label">Status</InputLabel>

          <Select
            sx={{
              width: "100%",
              height: 50,
            }}
            label="Status"
            name="Status"
            // onChange={handleSelectChange}
          >
            <MenuItem value={"true"}>Active</MenuItem>
            <MenuItem value={"false"}>Inactive</MenuItem>
          </Select>
        </FormControl>
      )}
      <div className="submit-button">
        <Button
          onClick={handleModalClose}
          // type="submit"
          variant="outlined"
          color="error"
          className="sub-btn"
        >
          {"Close"}
        </Button>
        <Button type="submit" variant="contained" className="sub-btn">
          {location ? "Update" : "Add"}
        </Button>
      </div>
    </form>
  );
};

const IndianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Lakshadweep",
  "Delhi (National Capital Territory)",
  "Puducherry",
];

export default LocationForm;
