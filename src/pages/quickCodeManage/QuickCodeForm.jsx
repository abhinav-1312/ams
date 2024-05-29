import React, { useState } from "react";
import {
  Card,
  CardContent,
  Autocomplete,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import axios from "axios";
import QuickCodeTable from "./QuickCodeTable";

const QuickCode = () => {
  const [configFields, setConfigFields] = useState([{ name: "", description: "" }]);
  const [configType, setConfigType] = useState("");

  const handleAddField = () => {
    setConfigFields([...configFields, { name: "", description: "" }]);
  };

  const handleRemoveField = (index) => {
    const updatedFields = [...configFields];
    updatedFields.splice(index, 1);
    setConfigFields(updatedFields);
  };

  const handleFieldChange = (index, fieldName, value) => {
    const updatedFields = [...configFields];
    updatedFields[index][fieldName] = value;
    setConfigFields(updatedFields);
  };

  const handleConfigTypeChange = (event, newValue) => {
    if (newValue) {
      setConfigType(newValue.label);
    } else {
      setConfigType("");
    }
  };

  const handleSubmit = () => {
    const requestData = {
      configDtoList: configFields.map((field, index) => ({
        configCode: field.name,
        configDesc: field.description,
        configId: index,
        configStatus: true,
      })),
      configType: configType,
    };

    axios
      .post(
        "https://asset-management-service.azurewebsites.net/asset-management/addConfig",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        alert("Quick Code successfully Added");
      })
      .catch((error) => {
        alert("Failed Something went wrong");
        console.error("Error:", error);
      });
  };

  return (
    <>
      <h1>Add Quick Code</h1>
      <Card>
        <CardContent style={{ minheight: "500px", padding: '2rem' }}>

          <form className="quick-form-container">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={ConfigType}
                sx={{ width: 300 }}
                onChange={handleConfigTypeChange}
                value={{ label: configType }}
                renderInput={(params) => (
                  <TextField {...params} label="Select Config Type" />
                )}
              />
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddField}
              >
                Add list Values
              </Button>
            </div>
            <br />
            {configFields.map((field, index) => (
              <div key={index} style={{ display: 'flex' }} className="quick-form-container">
                <TextField
                  value={field.name}
                  onChange={(e) =>
                    handleFieldChange(index, "name", e.target.value)
                  }
                  required
                  className="ast-form-text-field"
                  id="outlined-required"
                  label="Config Name"
                />
                <TextField
                  value={field.description}
                  onChange={(e) =>
                    handleFieldChange(index, "description", e.target.value)
                  }
                  required
                  className="ast-form-text-field"
                  id="outlined-required"
                  label="Config Description"
                />
                {index > 0 && (
                  <IconButton onClick={() => handleRemoveField(index)}>
                    <Delete />
                  </IconButton>
                )}
              </div>
            ))}
            <div className="config-button">
              <Button
                style={{ minWidth: '30%', margin: '2rem' }}
                variant="contained"
                size="large"
                color="primary"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

const ConfigType = [
  { label: "Transaction Type" },
  { label: "Asset Type" },
  { label: "Vendor Type" },
  { label: "Location Type" },
];


export default QuickCode;
