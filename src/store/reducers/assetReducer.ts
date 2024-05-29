// assetReducer.ts

import {
  FETCH_ASSETS,
  ADD_ASSET,
  UPDATE_ASSET,
  ACTIVATE_ASSET,
  DEACTIVATE_ASSET,
} from "../actions/assetActions";
import { Asset } from "../../pages/assetManage/AstInterface";

export interface AssetState {
  assets: Asset[];
}

const initialState: AssetState = {
  assets: [],
};

const assetReducer = (state = initialState, action: any): AssetState => {
  switch (action.type) {
    case FETCH_ASSETS:
      return {
        ...state,
        assets: action.payload,
      };
    case ADD_ASSET:
      return {
        ...state,
        assets: [...state.assets, action.payload],
      };
    case UPDATE_ASSET:
      return {
        ...state,
        assets: state.assets.map((asset) =>
          asset.assetId === action.payload.assetId
            ? action.payload
            : asset
        ),
      };
    case ACTIVATE_ASSET:
      return {
        ...state,
        assets: state.assets.map((asset) =>
          asset.assetId === action.payload
            ? { ...asset, assetTypeStatus: true }
            : asset
        ),
      };
    case DEACTIVATE_ASSET:
      return {
        ...state,
        assets: state.assets.map((asset) =>
          asset.assetId === action.payload
            ? { ...asset, assetTypeStatus: false }
            : asset
        ),
      };
    default:
      return state;
  }
};

export default assetReducer;
