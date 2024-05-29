import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import {
  Button,
  TextField,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  Autocomplete,
} from "@mui/material";
import { Transaction } from "./TransactionInterface";
import { SelectChangeEvent } from "@mui/material/Select";
import axios from "axios";
import { RootState } from "../../store/store";
import { useSelector, useDispatch } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { BASE_URL } from "../../utils/BaseUrl";
import { fetchAssets } from "../../store/actions/assetActions";
import { fetchLocations } from "../../store/actions/locationActions";
import { fetchEmployees } from "../../store/actions/employeeActions";
import { fetchVendors } from "../../store/actions/vendorActions";
interface TransactionFormProps {
  transaction: Transaction | null;
  onSubmit: (transaction: Transaction) => void;
  handleModalClose: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  transaction,
  onSubmit,
  handleModalClose,
}) => {
  const initialFormValues: Transaction = {
    transactionId: transaction ? transaction.transactionId : 0,
    assetId: transaction ? transaction.assetId : 0,
    fromLocation: transaction ? transaction.fromLocation : "",
    toLocation: transaction ? transaction.toLocation : "",
    fromKamAsm: transaction ? transaction.fromKamAsm : "",
    toKamAsm: transaction ? transaction.toKamAsm : "",
    fromEmployee: transaction ? transaction.fromEmployee : "",
    toEmployee: transaction ? transaction.toEmployee : 0,
    vendorName: transaction ? transaction.vendorName : "",
    transactionDate: transaction
      ? transaction.transactionDate
      : getCurrentDate(),
    transactionType: transaction ? transaction.transactionType : "",
  };

  function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const [formValues, setFormValues] = useState<Transaction>(initialFormValues);
  const dispatch = useDispatch<ThunkDispatch<RootState, null, any>>();
  const allAssetId = useSelector((state: RootState) => state.asset.assets);
  const locationIds = useSelector(
    (state: RootState) => state.location.locations
  );
  const empList = useSelector((state: RootState) => state.employee.employees);
  const vendeorList = useSelector((state: RootState) => state.vendor.vendor);
  const [selectedToFTFOM, setSelectedToFTFOM] = useState<any>();
  // const [lastTransactionId, setLastTransactionId] =
  //   useState<Transaction | null>(null);

  useEffect(() => {
    dispatch(fetchAssets());
    dispatch(fetchLocations());
    dispatch(fetchEmployees());
    dispatch(fetchVendors());
  }, [dispatch]);

  const fetchLastTransaction = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/getLastTransaction?assetId=${formValues.assetId}`
      );
      const responseData = response.data.responseData;
      if (responseData) {
        // const formattedDate = new Date(responseData.transactionDate)
        //   ?.toISOString()
        //   ?.split("T")[0];
        const frmlocation = responseData.toLocation;
        const frmemloyee = responseData.toEmployee;
        const frmKamAsm = responseData.toKamAsm;
        // setLastTransactionId({
        //   ...responseData,
        // });
        setFormValues({
          ...responseData,
          transactionDate: getCurrentDate(),
          fromLocation: frmlocation,
          fromEmployee: frmemloyee,
          fromKamAsm: frmKamAsm,
        });
  
      } else {
        console.error("Invalid API response format");
        throw new Error("Failed to fetch last transaction");
      }
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch last transaction");
    }
  };

  useEffect(() => {
    if (formValues.assetId !== 0) {
      fetchLastTransaction();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues.assetId]);

  const [transactionTypes, setTransactionTypes] = useState<
    { id: string; name: string }[]
  >([]);

  useEffect(() => {
    fetch(
      "https://asset-management-service.azurewebsites.net/asset-management/getConfig?configType=Transaction Type"
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
          setTransactionTypes(assetTypesList);
        }
      })
      .catch((error) => {
        console.error("Error fetching asset data:", error);
      });
  }, []);

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
        assetId: newValue.assetId,
      }));
    }
  };
  const handleAutoToLocationChange = (
    event: React.ChangeEvent<{}>,
    newValue: any | null
  ) => {
    if (newValue) {
      setFormValues((prevValues) => ({
        ...prevValues,
        toLocation: newValue.locationId,
      }));
    }
  };

  const handleAutoToEmpChange = (
    event: React.ChangeEvent<{}>,
    newValue: any | null
  ) => {
    if (newValue) {
      setFormValues((prevValues) => ({
        ...prevValues,
        toEmployee: newValue.employeeId,
      }));
    }
  };

  const handleAutoToKamasm = (
    event: React.ChangeEvent<{}>,
    newValue: any | null
  ) => {
    if (newValue) {
      setFormValues((prevValues) => ({
        ...prevValues,
        toKamAsm: newValue.kamAsm,
      }));
    }
  };
  const handleTransactionTypeChange = (
    event: React.ChangeEvent<{}>,
    newValue: any | null
  ) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      transactionType: newValue,
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;

    if (name === "vendorName") {
      setFormValues((prevValues) => ({
        ...prevValues,
        vendorName: value,
      }));
    } else if (name === "fromKamAsm") {
      setFormValues((prevValues) => ({
        ...prevValues,
        fromKamAsm: value,
      }));
    } else {
      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: value === "Active" ? true : false,
      }));
    }
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
        label="Transaction Id"
        variant="outlined"
        size="small"
        name="transactionId"
        value={formValues.transactionId}
        onChange={handleChange}
        disabled
        style={{ display: "none" }}
      />

      <Autocomplete
        options={allAssetId}
        className="ast-form-text-field"
        getOptionLabel={(option) => option.assetTag}
        value={
          allAssetId.find((option) => option.assetId === formValues.assetId) ||
          null
        }
        onKeyDown={handleKeyDown}
        onChange={handleAutocompleteChange}
        renderInput={(params) => <TextField {...params} label="BarCode" />}
      />
      <Autocomplete
        options={allAssetId}
        className="ast-form-text-field"
        getOptionLabel={(option) => option.assetName}
        value={
          allAssetId.find((option) => option.assetId === formValues.assetId) ||
          null
        }
        disabled
        onChange={handleAutocompleteChange}
        renderInput={(params) => <TextField {...params} label="Asset Name" />}
      />

      <FormControl variant="outlined" className="ast-form-text-field">
        <InputLabel>From Location</InputLabel>
        <Select
          label="From Location"
          name="fromLocation"
          value={formValues.fromLocation}
          disabled
        >
          {locationIds.map((loc, index) => (
            <MenuItem key={`${loc.locationId}+${index}`} value={loc.locationId}>
              {loc.locationName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Autocomplete
        options={locationIds}
        className="ast-form-text-field"
        getOptionLabel={(option) => option.locationName}
        value={
          locationIds.find(
            (option) => option.locationId === formValues.toLocation
          ) || null
        }
        onChange={handleAutoToLocationChange}
        renderInput={(params) => <TextField {...params} label="To Location" />}
      />

      <FormControl variant="outlined" className="ast-form-text-field">
        <InputLabel>From FT/FOM</InputLabel>
        <Select
          label="From FT/FOM"
          name="fromEmployee"
          value={formValues.fromEmployee}
          disabled
        >
          {empList.map((emp, index) => (
            <MenuItem key={`${emp.employeeId}+${index}`} value={emp.employeeId}>
              {emp.employeeName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* <Autocomplete
        options={empList}
        className="ast-form-text-field"
        getOptionLabel={(option) => option.employeeName}
        value={
          empList.find(
            (option) => option.employeeId === formValues.toEmployee
          ) || null
        }
        onChange={handleAutoToEmpChange}
        renderInput={(params) => <TextField {...params} label="To FT/FOM" />}
      />*/}
      <Autocomplete
        options={empList}
        className="ast-form-text-field"
        getOptionLabel={(option) => option.employeeName}
        value={
          empList.find(
            (option) => option.employeeId === formValues.toEmployee
          ) || null
        }
        onChange={(event, newValue) => {
          setSelectedToFTFOM(newValue);
          handleAutoToEmpChange(event, newValue);
        }}
        renderInput={(params) => <TextField {...params} label="To FT/FOM" />}
      />

      <FormControl variant="outlined" className="ast-form-text-field">
        <InputLabel>From KAM/ASM</InputLabel>
        <Select
          label="From KAM/ASM"
          name="fromKamAsm"
          value={formValues.fromKamAsm}
          disabled
          onChange={handleSelectChange}
        >
          {empList.map((emp, index) => (
            <MenuItem key={`${emp.employeeId}+${index}`} value={emp.kamAsm}>
              {emp.kamAsm}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* <Autocomplete
        options={empList}
        className="ast-form-text-field"
        getOptionLabel={(option) => option.kamAsm}
        value={
          empList.find((option) => option.kamAsm === formValues.toKamAsm) ||
          null
        }
        onChange={handleAutoToKamasm}
        renderInput={(params) => <TextField {...params} label="To KAM/ASM" />}
      />*/}

      <Autocomplete
        options={empList}
        className="ast-form-text-field"
        getOptionLabel={(option) => option.kamAsm}
        disabled
        value={
          empList.find(
            (option) => option.employeeId === selectedToFTFOM?.employeeId
          ) || null
        }
        onChange={handleAutoToKamasm}
        renderInput={(params) => <TextField {...params} label="To KAM/ASM" />}
      />

      <TextField
        className="ast-form-text-field"
        label="Transaction Date"
        variant="outlined"
        size="small"
        name="transactionDate"
        defaultValue={formValues.transactionDate}
        type="date"
        value={formValues.transactionDate}
        onChange={handleChange}
      />
      <FormControl variant="outlined" className="ast-form-text-field">
        <Autocomplete
          options={transactionTypes.map((astype) => astype.name)}
          value={formValues.transactionType}
          onChange={handleTransactionTypeChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Transaction Type"
              variant="outlined"
            />
          )}
        />
      </FormControl>

      {formValues.transactionType === "Received From Supplier " ||
      formValues.transactionType === "Repair" ? (
        <FormControl variant="outlined" className="ast-form-text-field">
          <InputLabel>Vendor Name</InputLabel>
          <Select
            label="  Vendor Name"
            name="vendorName"
            value={formValues.vendorName !== null ? formValues.vendorName : ""}
            onChange={handleSelectChange}
            required
          >
            {vendeorList.map((vnd, index) => (
              <MenuItem key={`${vnd.vendorId}+${index}`} value={vnd.vendorName}>
                {vnd.vendorName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : null}
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
          {transaction ? "Update" : "Add"}
        </Button>
      </div>
    </form>
  );
};

export default TransactionForm;
