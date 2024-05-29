// assetTypeReducer.ts

import {
  FETCH_ASSET_TYPES,
  ADD_ASSET_TYPE,
  UPDATE_ASSET_TYPE,
  ACTIVATE_ASSET_TYPE,
  DEACTIVATE_ASSET_TYPE,
} from "../actions/vendorActions"; 
import { Vendor } from "../../pages/vendorModule/vendorInterface"; 
export interface VendorState {
  vendor: Vendor[];
}

const initialState: VendorState = {
  vendor: [],
};

const assetTypeReducer = (
  state = initialState,
  action: any
): VendorState => {
  switch (action.type) {
    case FETCH_ASSET_TYPES:
      return {
        ...state,
        vendor: action.payload,
      };
    case ADD_ASSET_TYPE:
      return {
        ...state,
        vendor: [...state.vendor, action.payload],
      };
    case UPDATE_ASSET_TYPE:
      return {
        ...state,
        vendor: state.vendor.map((assetType) =>
          assetType.vendorId === action.payload.vendorId // Change to vendorId
            ? action.payload
            : assetType
        ),
      };
    case ACTIVATE_ASSET_TYPE:
      return {
        ...state,
        vendor: state.vendor.map((assetType) =>
          assetType.vendorId === action.payload // Change to vendorId
            ? { ...assetType, vendortatus: true }
            : assetType
        ),
      };
    case DEACTIVATE_ASSET_TYPE:
      return {
        ...state,
        vendor: state.vendor.map((assetType) =>
          assetType.vendorId === action.payload // Change to vendorId
            ? { ...assetType, vendortatus: false }
            : assetType
        ),
      };
    default:
      return state;
  }
};

export default assetTypeReducer;
