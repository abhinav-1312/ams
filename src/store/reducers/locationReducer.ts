// locationReducer.ts

import {
  FETCH_LOCATIONS,
  ADD_LOCATION,
  UPDATE_LOCATION,
  ACTIVATE_LOCATION,
  DEACTIVATE_LOCATION,
} from "../actions/locationActions"; // Import the location action types
import { Location } from "../../pages/Location/LocationInterface"; // Import your Location interface

export interface LocationState {
  locations: Location[];
}

const initialState: LocationState = {
  locations: [],
};

const locationReducer = (
  state = initialState,
  action: any
): LocationState => {
  switch (action.type) {
    case FETCH_LOCATIONS:
      return {
        ...state,
        locations: action.payload,
      };
    case ADD_LOCATION:
      return {
        ...state,
        locations: [...state.locations, action.payload],
      };
    case UPDATE_LOCATION:
      return {
        ...state,
        locations: state.locations.map((location) =>
          location.locationId === action.payload.locationId
            ? action.payload
            : location
        ),
      };
    case ACTIVATE_LOCATION:
      return {
        ...state,
        locations: state.locations.map((location) =>
          location.locationId === action.payload
            ? { ...location, locationStatus: true }
            : location
        ),
      };
    case DEACTIVATE_LOCATION:
      return {
        ...state,
        locations: state.locations.map((location) =>
          location.locationId === action.payload
            ? { ...location, locationStatus: false }
            : location
        ),
      };
    default:
      return state;
  }
};

export default locationReducer;
