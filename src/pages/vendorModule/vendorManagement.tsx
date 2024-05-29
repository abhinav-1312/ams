import React, { useState, useEffect, ChangeEvent } from "react";
import { ThunkDispatch } from "redux-thunk";
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
import { RootState } from "../../store/store";
import { useSelector, useDispatch } from "react-redux";
import SkeletonTable from "../../components/SkeletonTable";
import {
  fetchVendors,
  addVendor,
  updateVendor,
  activateVendor,
  deactivateVendor,
} from "../../store/actions/vendorActions"; // Import your Vendor actions and interfaces
import { Vendor } from "./vendorInterface"; // Import your Vendor interface
import VendorForm from "./vendorForm"; // Import your VendorForm component
import VendorTable from "./vendorTable"; // Import your VendorTable component

const VendorManagement: React.FC = () => {
  const vendors = useSelector((state: RootState) => state.vendor.vendor); // Replace with the correct selector for Vendors

  const dispatch = useDispatch<ThunkDispatch<RootState, null, any>>();

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vendorFormData, setVendorFormData] = useState<Vendor | null>(null);

  useEffect(() => {
    dispatch(fetchVendors());
  }, [dispatch]);

  const addNewVendor = () => {
    setIsModalOpen(true);
    setVendorFormData(null);
  };

  const editVendor = (vendor: Vendor) => {
    setIsModalOpen(true);
    setVendorFormData(vendor);
  };

  const toggleVendorStatus = async (
    assetDetailsId: number,
    vendorStatus: boolean
  ) => {
    try {
      if (vendorStatus) {
        dispatch(activateVendor(assetDetailsId));
      } else {
        dispatch(deactivateVendor(assetDetailsId));
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
    setVendorFormData(null);
  };

  const handleFormSubmit = async (vendor: Vendor) => {
    if (vendorFormData === null) {
      dispatch(addVendor(vendor));
    } else {
      dispatch(updateVendor(vendor));
    }
    setIsModalOpen(false);
  };



  const filteredVendorList = searchTerm
    ? vendors.filter((vnd) =>
        Object.values(vnd).some(
          (value) =>
            value &&
            typeof value === "string" &&
            value.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : vendors;
 

  return (
    <div>
      <h1>Vendor Management</h1>
      <Card>
        <CardContent>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <TextField
              label="Search Vendors"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={addNewVendor}
            >
              Add Vendor
            </Button>
          </div>
          <br />
          {vendors.length === 0 ? (
            <SkeletonTable />
          ) : (
            <VendorTable
              vendorList={filteredVendorList}
              editVendor={editVendor}
              toggleVendorStatus={toggleVendorStatus}
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
                  {vendorFormData ? "Edit Vendor" : "Add Vendor"}
                </Typography>
                <Button color="error" onClick={handleModalClose}>
                  <Close />
                </Button>
              </div>
              <br />
              <VendorForm
                vendor={vendorFormData}
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

export default VendorManagement;
