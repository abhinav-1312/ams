import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Box,
  Collapse,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,

  TextField,
} from "@mui/material";

import { KeyboardArrowDown, KeyboardArrowUp, Edit } from "@mui/icons-material";
import axios from "axios";
import SkeletonTable from "../../components/SkeletonTable";

function createRow(configType, configData) {
  return {
    configType,
    configData,
    open: false,
  };
}

function QuickCodeTable() {
  const [rows, setRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [editedConfigCode, setEditedConfigCode] = useState("");
  const [editedConfigDesc, setEditedConfigDesc] = useState("");
  const [ConfigId, setConfigId] = useState("");
  const openEditModal = (rowData) => {
    setIsModalOpen(true);
    setEditedData(rowData);
    setEditedConfigCode(rowData.configCode);
    setEditedConfigDesc(rowData.configDesc);
    setConfigId(rowData.configId);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
  };

  const handleEditSubmit = () => {
    // Send a POST request to update the data
    axios
      .post("https://asset-management-service.azurewebsites.net/asset-management/modifyConfig", {
        configCode: editedData.configCode,
        configDesc: editedConfigDesc, // Use the edited configDesc
        configId: editedData.configId,
        configStatus: editedData.configStatus,
      })
      .then((response) => {
        // Handle success, e.g., update the table with the new data
        alert("Data updated successfully:", response.data);

        // Close the modal
        setIsModalOpen(false);

        // You may want to refresh the table data here if needed
      })
      .catch((error) => {
        alert("Something went wrong");
        console.error("Error updating data:", error);
        // Handle errors
      });
  };

  useEffect(() => {
    // Fetch data from the API
    axios
      .get("https://asset-management-service.azurewebsites.net/asset-management/getAllConfig")
      .then((response) => {
        // Organize the fetched data into the same structure as example rows
        const formattedData = response.data.responseData.map((item) => {
          return createRow(item.configType, item.configDtoList);
        });
        setRows(formattedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  if (rows.length === 0) {
    return <SkeletonTable />
  }
  return (
    <div>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell>Config Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <React.Fragment key={index}>
                <TableRow>
                  <TableCell>
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      onClick={() => {
                        const updatedRows = [...rows];
                        updatedRows[index].open = !updatedRows[index].open;
                        setRows(updatedRows);
                      }}
                    >
                      {row.open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                    {row.configType}
                  </TableCell>
                  <TableCell />
                  <TableCell />
                  <TableCell />
                </TableRow>
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                    <Collapse in={row.open} timeout="auto" unmountOnExit>
                      <Box sx={{ margin: 1 }}>
                        <Typography variant="h6" gutterBottom component="div">
                          Quick Code Type : {row.configType}
                        </Typography>
                        <Table size="small" aria-label="config-data">
                          <TableHead>
                            <TableRow>
                              <TableCell>Config Id</TableCell>
                              <TableCell>Config Code</TableCell>
                              <TableCell>Config Description</TableCell>
                              <TableCell>Config Status</TableCell>
                              <TableCell>Action</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {row.configData.map((config, configIndex) => (
                              <TableRow key={configIndex}>
                                <TableCell>{config.configId}</TableCell>
                                <TableCell>{config.configCode}</TableCell>
                                <TableCell>{config.configDesc}</TableCell>
                                <TableCell>{config.configStatus.toString()}</TableCell>
                                <TableCell>
                                  <IconButton onClick={() => openEditModal(config)}>
                                    <Edit />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={isModalOpen}   >
        <DialogTitle>Edit Data</DialogTitle>
        <DialogContent style={{ padding: '1rem' }}>
          <TextField
            className="ast-form-text-field"

            label="Config Code"
            fullWidth
            value={editedConfigCode}
            onChange={(e) => setEditedConfigCode(e.target.value)}
          />
          <TextField
            className="ast-form-text-field"
            style={{ marginTop: '.7rem' }}
            label="Config Description"
            fullWidth
            value={editedConfigDesc}
            onChange={(e) => setEditedConfigDesc(e.target.value)}
          />

        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditSubmit} variant="contained" color="primary">
            Save
          </Button>
          <Button onClick={closeEditModal} variant="outlined" color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
}

export default QuickCodeTable;
