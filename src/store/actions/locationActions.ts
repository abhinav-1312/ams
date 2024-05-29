// locationActions.ts

import axios from "axios";
import { Location } from "../../pages/Location/LocationInterface"; // Import your Location interface
import { ThunkAction } from "redux-thunk";
import { RootState } from "./../store";
import { BASE_URL } from "../../utils/BaseUrl";

export const FETCH_LOCATIONS = "FETCH_LOCATIONS";
export const ADD_LOCATION = "ADD_LOCATION";
export const UPDATE_LOCATION = "UPDATE_LOCATION";
export const DELETE_LOCATION = "DELETE_LOCATION";
export const ACTIVATE_LOCATION = "ACTIVATE_LOCATION";
export const DEACTIVATE_LOCATION = "DEACTIVATE_LOCATION";

interface FetchLocationsAction {
  type: typeof FETCH_LOCATIONS;
  payload: Location[];
}

interface AddLocationAction {
  type: typeof ADD_LOCATION;
  payload: Location;
}

interface UpdateLocationAction {
  type: typeof UPDATE_LOCATION;
  payload: Location;
}

interface ActivateLocationAction {
  type: typeof ACTIVATE_LOCATION;
  payload: number;
}

interface DeactivateLocationAction {
  type: typeof DEACTIVATE_LOCATION;
  payload: number;
}

export type LocationActionTypes =
  | FetchLocationsAction
  | AddLocationAction
  | UpdateLocationAction
  | ActivateLocationAction
  | DeactivateLocationAction;

export const fetchLocations = (): ThunkAction<
  void,
  RootState,
  null,
  LocationActionTypes
> => async (dispatch) => {
  try {
    const response = await axios.get<{ responseData: Location[] }>(
      `${BASE_URL}/getAllLocation`
    );
    const responseData = response.data.responseData;

    if (Array.isArray(responseData)) {
      dispatch({
        type: FETCH_LOCATIONS,
        payload: responseData,
      });
    } else {
      console.error("Invalid API response format");
      throw new Error("Failed to fetch Locations");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch Locations");
  }
};

export const addLocation = (
  location: Location
): ThunkAction<void, RootState, null, LocationActionTypes> => async (dispatch) => {
  try {
    const response = await axios.post<Location>(
      `${BASE_URL}/addLocation`,
      location
    );
    const newLocation = response.data;
    alert("Location successfully Added");
    await dispatch(fetchLocations());
    dispatch({
      type: ADD_LOCATION,
      payload: newLocation,
    });
  } catch (error: any) {
    console.error(error);
    const errorMessage =
      error?.response?.data?.responseStatus?.message || "Failed to add Location";
    alert(errorMessage);  }
};

export const updateLocation = (
  location: Location
): ThunkAction<void, RootState, null, LocationActionTypes> => async (dispatch) => {
  try {
    const response = await axios.post<Location>(
      `${BASE_URL}/modifyLocation`,
      location
    );
    const updatedLocation = response.data;
    alert("Location successfully Updated");
    await dispatch(fetchLocations());
    dispatch({
      type: UPDATE_LOCATION,
      payload: updatedLocation,
    });
  } catch (error: any) {
    console.error(error);
    const errorMessage =
      error?.response?.data?.responseStatus?.message || "Failed to update Location";
    alert(errorMessage);
  }
};

export const activateLocation = (
  locationId: number
): ThunkAction<void, RootState, null, LocationActionTypes> => async (dispatch) => {
  try {
    await axios.post(`${BASE_URL}/activateLocation?locationId=${locationId}`);
    alert("Location successfully Activated");

    dispatch<ActivateLocationAction>({
      type: ACTIVATE_LOCATION,
      payload: locationId,
    });
  }  catch (error: any) {
    console.error(error);
    const errorMessage =
      error?.response?.data?.responseStatus?.message || "Failed to activate Location";
    alert(errorMessage);
  }
};

export const deactivateLocation = (
  locationId: number
): ThunkAction<void, RootState, null, LocationActionTypes> => async (dispatch) => {
  try {
    await axios.post(`${BASE_URL}/deactivateLocation?locationId=${locationId}`);
    alert("Location successfully Inactivated");

    dispatch<DeactivateLocationAction>({
      type: DEACTIVATE_LOCATION,
      payload: locationId,
    });
  } catch (error: any) {
    console.error(error);
    const errorMessage =
      error?.response?.data?.responseStatus?.message || "Failed to deactivate Location";
    alert(errorMessage);  }
};
