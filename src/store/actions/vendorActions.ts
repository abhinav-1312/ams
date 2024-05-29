import axios from "axios";
import { Vendor } from "../../pages/vendorModule/vendorInterface";
import { ThunkAction } from "redux-thunk";
import { RootState } from "../store";
import { BASE_URL } from "../../utils/BaseUrl";

// Define action types
export const FETCH_ASSET_TYPES = "FETCH_ASSET_TYPES";
export const ADD_ASSET_TYPE = "ADD_ASSET_TYPE";
export const UPDATE_ASSET_TYPE = "UPDATE_ASSET_TYPE";
export const ACTIVATE_ASSET_TYPE = "ACTIVATE_ASSET_TYPE";
export const DEACTIVATE_ASSET_TYPE = "DEACTIVATE_ASSET_TYPE";

// Define action interfaces
interface FetchVendorsAction {
  type: typeof FETCH_ASSET_TYPES;
  payload: Vendor[];
}

interface AddVendorAction {
  type: typeof ADD_ASSET_TYPE;
  payload: Vendor;
}

interface UpdateVendorAction {
  type: typeof UPDATE_ASSET_TYPE;
  payload: Vendor;
}

interface ActivateVendorAction {
  type: typeof ACTIVATE_ASSET_TYPE;
  payload: {
    vendorId: number;
  };
}

interface DeactivateVendorAction {
  type: typeof DEACTIVATE_ASSET_TYPE;
  payload: {
    vendorId: number;
  };
}

// Define a union type for all action types
export type VendorActionTypes =
  | FetchVendorsAction
  | AddVendorAction
  | UpdateVendorAction
  | ActivateVendorAction
  | DeactivateVendorAction;

// Action creator to fetch Vendors
export const fetchVendors = (): ThunkAction<
  void,
  RootState,
  null,
  VendorActionTypes
> => async (dispatch) => {
  try {
    const response = await axios.get<{ responseData: Vendor[] }>(
      `${BASE_URL}/getAllVendor`
    );
    const responseData = response.data.responseData;

    if (Array.isArray(responseData)) {
      dispatch({
        type: FETCH_ASSET_TYPES,
        payload: responseData,
      });
    } else {
      console.error("Invalid API response format");
      throw new Error("Failed to fetch Vendors");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch Vendors");
  }
};

// Action creator to add an Vendor
export const addVendor = (
  assetType: Vendor
): ThunkAction<void, RootState, null, VendorActionTypes> => async (
  dispatch
) => {
  try {
    const response = await axios.post<Vendor>(
      `${BASE_URL}/addVendor`,
      assetType
    );
    const newVendor = response.data;
    alert("Vendor successfully Added");
    await dispatch(fetchVendors());
    dispatch({
      type: ADD_ASSET_TYPE,
      payload: newVendor,
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to add Vendor");
  }
};

// Action creator to update an Vendor
export const updateVendor = (
  assetType: Vendor
): ThunkAction<void, RootState, null, VendorActionTypes> => async (
  dispatch
) => {
  try {
    const response = await axios.post<Vendor>(
      `${BASE_URL}/modifyVendor`,
      assetType
    );
    const updatedVendor = response.data;
    alert("Vendor successfully Updated");
    await dispatch(fetchVendors());
    dispatch({
      type: UPDATE_ASSET_TYPE,
      payload: updatedVendor,
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update Vendor");
  }
};

// Action creator to activate an Vendor
export const activateVendor = (
  vendorId: number
): ThunkAction<void, RootState, null, VendorActionTypes> => async (
  dispatch
) => {
  try {
    await axios.post(`${BASE_URL}/activateVendor?vendorId=${vendorId}`);
    alert("Vendor successfully Activated");
    await dispatch(fetchVendors());
    dispatch<ActivateVendorAction>({
      type: ACTIVATE_ASSET_TYPE,
      payload: {
        vendorId,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to activate Vendor");
  }
};

// Action creator to deactivate an Vendor
export const deactivateVendor = (
  vendorId: number
): ThunkAction<void, RootState, null, VendorActionTypes> => async (
  dispatch
) => {
  try {
    await axios.post(
      `${BASE_URL}/deactivateVendor?vendorId=${vendorId}`
    );
    alert("Vendor successfully Deactivated");
    await dispatch(fetchVendors());
    dispatch<DeactivateVendorAction>({
      type: DEACTIVATE_ASSET_TYPE,
      payload: {
        vendorId,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to deactivate Vendor");
  }
};
