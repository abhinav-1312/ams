import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import {
  Button,
  TextField,
  Input,
  FormHelperText,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Autocomplete,
} from "@mui/material";
import { Asset } from "./AstInterface";
import "./Ast.css";
import { RootState } from "../../store/store";
import { useSelector, useDispatch } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { fetchLocations } from "../../store/actions/locationActions";
import axios from "axios";
import { ModuleDetectionKind } from "typescript";
interface AssetFormProps {
  asset: Asset | null;
  onSubmit: (asset: Asset) => void;
  handleModalClose: () => void;
}

const AssetForm: React.FC<AssetFormProps> = ({
  asset,
  onSubmit,
  handleModalClose,
}) => {
  const [formValues, setFormValues] = useState<Asset>({
    assetId: asset ? asset.assetId : 0,
    qrCodeId: asset ? asset.qrCodeId : 0,
    assetName: asset ? asset.assetName : "",
    assetTag: asset ? asset.assetTag : "",
    assetType: asset ? asset.assetType : "",
    assetBrand: asset ? asset.assetBrand : "",
    assetQuantity: asset ? asset.assetQuantity : 0,
    assetLocation: asset ? asset.assetLocation : 0,
    locationName: asset ? asset.locationName : "",
    assetPictureUrl: asset ? asset.assetPictureUrl : "",
    assetStatus: asset ? asset.assetStatus : false,
    hsnCode: asset ? asset.hsnCode : "",
    assetCost: asset ? asset.assetCost : "",
    supplier: asset ? asset.supplier : "",
    assignedDate: asset ? asset.assignedDate : getCurrentDate(),
    // createdDate: asset ? asset.createdDate : "",
    latestTransaction: {
      transactionType: "",
    },
  });
  function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  const [imageFile, setImageFile] = useState<File | null>(null);
  const dispatch = useDispatch<ThunkDispatch<RootState, null, any>>();
  const locationIds = useSelector(
    (state: RootState) => state.location.locations
  );

  const [assetTypes, setAssetTypes] = useState<{ id: string; name: string }[]>(
    []
  );
  const [allVendor, setAllVendor] = useState<{ vendorId: string; vendorName: string }[]>(
    []
  );

  useEffect(() => {
    fetch(
      "https://asset-management-service.azurewebsites.net/asset-management/getConfig?configType=Asset Type"
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
          setAssetTypes(assetTypesList);
        }
      })
      .catch((error) => {
        console.error("Error fetching asset data:", error);
      });

      populateVendor()
  }, []);

  const populateVendor = async () => {
    const url = "https://asset-management-service.azurewebsites.net/asset-management/getAllVendor"
    try{

      const {data} = await axios.get(url)
      const {responseData} = data

      const modData = responseData.map(
        (astype: any) => ({
          vendorId: astype.vendorId,
          vendorName: astype.vendorName,
        })
      );
      setAllVendor([...modData])
    }
    catch(error){
      console.log("Error fetching all vendors.")
      alert("Error fetching all vendors.")
    }
  }

  useEffect(() => {
    dispatch(fetchLocations());
  }, [dispatch]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const updatedValue = name === "assetStatus" ? value === "Active" : value;
    setFormValues((prevValues) => ({ ...prevValues, [name]: updatedValue }));
  };

  const handleAutocompleteChange = (
    event: React.ChangeEvent<{}>,
    newValue: any | null
  ) => {
    if (newValue) {
      setFormValues((prevValues) => ({
        ...prevValues,
        assetLocation: newValue.locationId,
      }));
    }
  };

  const handleAssetTypeChange = (
    event: React.ChangeEvent<{}>,
    newValue: any | null
  ) => {
    setFormValues((prevValues) => ({ ...prevValues, assetType: newValue }));
  };

  const handleVendorChange = (
    event: React.ChangeEvent<{}>,
    newValue: any | null
  ) => {
    setFormValues((prevValues) => ({ ...prevValues, supplier: newValue }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value === "Active" ? true : false,
    }));
  };
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    onSubmit(formValues);
    const formData = new FormData();
    formData.append("assetId", String(formValues.assetId));

    if (imageFile) {
      formData.append("file", imageFile);
    }

    try {
      const response = await fetch(
        `https://asset-management-service.azurewebsites.net/asset-management/uploadDocument?assetId=${formValues.assetId}&docType=Asset`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        alert("image updated");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };
  return (
    <form onSubmit={handleSubmit} className="Ast-form-container">
      <TextField
        className="ast-form-text-field"
        label="BarCode"
        variant="outlined"
        size="small"
        required
        onKeyDown={handleKeyDown}
        name="assetTag"
        value={formValues.assetTag}
        onChange={handleChange}
      />
      <TextField
        className="ast-form-text-field"
        label="Asset Name"
        variant="outlined"
        size="small"
        name="assetName"
        required
        value={formValues.assetName}
        onChange={handleChange}
      />
      <FormControl variant="outlined" className="ast-form-text-field">
        <Autocomplete
          options={assetTypes.map((astype) => astype.name)}
          value={formValues.assetType}
          onChange={handleAssetTypeChange}
          renderInput={(params) => (
            <TextField {...params} label="Asset Type" variant="outlined" />
          )}
        />
      </FormControl>

      <TextField
        className="ast-form-text-field"
        label="Brand"
        variant="outlined"
        size="small"
        name="assetBrand"
        value={formValues.assetBrand}
        onChange={handleChange}
      />
      <TextField
        className="ast-form-text-field"
        label="Quantity"
        variant="outlined"
        type="number"
        size="small"
        name="assetQuantity"
        value={formValues.assetQuantity}
        onChange={handleChange}
      />

      <TextField
        className="ast-form-text-field"
        label="HSN Code"
        variant="outlined"
        size="small"
        name="hsnCode"
        value={formValues.hsnCode}
        onChange={handleChange}
      />

      <TextField
        className="ast-form-text-field"
        label="Asset Cost"
        variant="outlined"
        size="small"
        name="assetCost"
        value={formValues.assetCost}
        onChange={handleChange}
      />

      <FormControl variant="outlined" className="ast-form-text-field">
        <Autocomplete
          options={allVendor.map((obj) => obj.vendorName)}
          value={formValues.supplier}
          onChange={handleVendorChange}
          renderInput={(params) => (
            <TextField {...params} label="Received From Supplier" variant="outlined" />
          )}
        />
      </FormControl>

      <TextField
        className="ast-form-text-field"
        label="Assigned Date"
        size="small"
        name="assignedDate"
        type="date"
        value={formValues.assignedDate}
        onChange={handleChange}
      />
      <Autocomplete
        options={locationIds}
        className="ast-form-text-field"
        getOptionLabel={(option) => option.locationName}
        value={
          locationIds.find(
            (option) => option.locationId === formValues.assetLocation
          ) || null
        }
        onChange={handleAutocompleteChange}
        renderInput={(params) => <TextField {...params} label="Location" />}
      />

      {asset === null && (
        <FormControl variant="outlined" className="ast-form-text-field">
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            name="assetStatus"
            value={formValues.assetStatus ? "Active" : "Inactive"}
            onChange={handleSelectChange}
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
      )}
      {asset ? (
        <FormControl className="asset-picture-section">
          <Input
            className=""
            type="file"
            id="asset-picture"
            name="assetImgfile"
            inputProps={{ accept: "image/*" }}
            onChange={handleFileChange}
          />
          {imageFile && (
            <img
              className="asset-picture-preview"
              src={URL.createObjectURL(imageFile)}
              alt="Asset"
            />
          )}
          <FormHelperText>Upload an image for the asset.</FormHelperText>
        </FormControl>
      ) : (
        ""
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
          {asset ? "Update" : "Add"}
        </Button>
      </div>
    </form>
  );
};

export default AssetForm;
