import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Typography,
  MenuItem,
  SelectChangeEvent,
  Autocomplete,
} from "@mui/material";
import { Vendor } from "./vendorInterface";

interface AssetTypeFormProps {
  vendor: Vendor | null;
  onSubmit: (vendor: Vendor) => void;
  handleModalClose: () => void;
}

const AssetTypeForm: React.FC<AssetTypeFormProps> = ({
  vendor,
  onSubmit,
  handleModalClose,
}) => {
  const [formValues, setFormValues] = useState<Vendor>({
    vendorId: vendor ? vendor.vendorId : 0,
    vendorName: vendor ? vendor.vendorName : "",
    mobileNumber: vendor ? vendor.mobileNumber : "",
    vendorType: vendor ? vendor.vendorType : "",
    vendorStatus: vendor ? vendor.vendorStatus : false,
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };
  const [vendorTypes, setVendorTypes] = useState<
    { id: string; name: string }[]
  >([]);

  useEffect(() => {
    fetch(
      "https://asset-management-service.azurewebsites.net/asset-management/getConfig?configType=Vendor Type"
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
          setVendorTypes(assetTypesList);
        }
      })
      .catch((error) => {
        console.error("Error fetching asset data:", error);
      });
  }, []);

  const handleVendorTypeChange = (
    event: React.ChangeEvent<{}>,
    newValue: any | null
  ) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      vendorType: newValue,
    }));
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
        label="Vendor ID"
        variant="outlined"
        size="small"
        name="vendorId"
        value={formValues.vendorId}
        onChange={handleChange}
        disabled
      />

      <TextField
        className="ast-form-text-field"
        label="Vendor Name"
        variant="outlined"
        size="small"
        name="vendorName"
        value={formValues.vendorName}
        onChange={handleChange}
        required
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
      <FormControl variant="outlined" className="ast-form-text-field">
        <Autocomplete
          options={vendorTypes.map((astype) => astype.name)}
          value={formValues.vendorType}
          onChange={handleVendorTypeChange}
          renderInput={(params) => (
            <TextField {...params} label="Vendor Type" variant="outlined" />
          )}
        />
      </FormControl>

      {vendor === null && (
        <FormControl variant="outlined" className="ast-form-text-field">
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            name="vendorStatus"
            value={formValues.vendorStatus ? "Active" : "Inactive"}
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
          {vendor ? "Update" : "Add"}
        </Button>
      </div>
    </form>
  );
};

export default AssetTypeForm;
