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
  fetchLocations,
  addLocation,
  updateLocation,
  activateLocation,
  deactivateLocation,
} from "../../store/actions/locationActions";
import { Location } from "./LocationInterface";
import LocationForm from "./LocationForm";
import LocationTable from "./LocationTable";

const LocationManagement: React.FC = () => {
  const locations = useSelector(
    (state: RootState) => state.location.locations
  );

  const dispatch = useDispatch<ThunkDispatch<RootState, null, any>>();

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [locationFormData, setLocationFormData] = useState<Location | null>(
    null
  );

  useEffect(() => {
    dispatch(fetchLocations());
  }, [dispatch]);

  const addNewLocation = () => {
    setIsModalOpen(true);
    setLocationFormData(null);
  };

  const editLocation = (location: Location) => {
    setIsModalOpen(true);
    setLocationFormData(location);
  };

  const toggleLocationStatus = async (
    locationId: number,
    status: boolean
  ) => {
    try {
      if (status) {
        dispatch(activateLocation(locationId));
      } else {
        dispatch(deactivateLocation(locationId));
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
    setLocationFormData(null);
  };

  const handleFormSubmit = async (location: Location) => {
    if (locationFormData === null) {
      dispatch(addLocation(location));
    } else {
      dispatch(updateLocation(location));
    }
    setIsModalOpen(false);
  };

  const filteredLocationList = locations.filter((location) => {
    const locationName = location.locationName?.toLowerCase() || "";
    return locationName.includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <h1>Location Management</h1>
      <Card>
        <CardContent>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <TextField
              label="Search Location"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={addNewLocation}
            >
              Add Location
            </Button>
          </div>
          <br />
          {locations.length === 0 ? (
            <SkeletonTable />
          ) : (
            <LocationTable
              locationList={filteredLocationList}
              editLocation={editLocation}
              toggleLocationStatus={toggleLocationStatus}
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
                  {locationFormData ? "Edit Location" : "Add Location"}
                </Typography>
                <Button color="error" onClick={handleModalClose}>
                  <Close />
                </Button>
              </div>
              <br />
              <LocationForm
                location={locationFormData}
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

export default LocationManagement;
