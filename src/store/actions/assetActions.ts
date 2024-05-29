// assetActions.ts

import axios from "axios";
import { Asset } from "../../pages/assetManage/AstInterface";
import { ThunkAction } from "redux-thunk";
import { RootState } from "./../store";
import { BASE_URL } from "../../utils/BaseUrl";

// Define action types
export const FETCH_ASSETS = "FETCH_ASSETS";
export const ADD_ASSET = "ADD_ASSET";
export const UPDATE_ASSET = "UPDATE_ASSET";
export const ACTIVATE_ASSET = "ACTIVATE_ASSET";
export const DEACTIVATE_ASSET = "DEACTIVATE_ASSET";

// Define action interfaces
interface FetchAssetsAction {
  type: typeof FETCH_ASSETS;
  payload: Asset[];
}

interface AddAssetAction {
  type: typeof ADD_ASSET;
  payload: Asset;
}

interface UpdateAssetAction {
  type: typeof UPDATE_ASSET;
  payload: Asset;
}

interface ActivateAssetAction {
  type: typeof ACTIVATE_ASSET;
  payload: number;
}

interface DeactivateAssetAction {
  type: typeof DEACTIVATE_ASSET;
  payload: number;
}

// Define a union type for all action types
export type AssetActionTypes =
  | FetchAssetsAction
  | AddAssetAction
  | UpdateAssetAction
  | ActivateAssetAction
  | DeactivateAssetAction;

export const fetchAssets = (): ThunkAction<void, RootState, null, AssetActionTypes> => async (dispatch) => {
  try {
    const userRole = JSON.parse(localStorage.getItem("userRole") || "[]"); // Parse the JSON stored in localStorage
    const isAdmin = userRole.includes("Admin");

    if (isAdmin) {
      const response = await axios.get<{ responseData: Asset[] }>(
        `${BASE_URL}/getAllAsset`
      );
      const responseData = response.data.responseData;

      if (Array.isArray(responseData)) {
        dispatch({
          type: FETCH_ASSETS,
          payload: responseData,
        });
         const assetIds = responseData.map((asset) => asset.assetId);
         localStorage.setItem('assetIds', JSON.stringify(assetIds));
      } else {
        console.error("Invalid API response format");
        throw new Error("Failed to fetch Assets");
      }
    } else {
      const response = await axios.get<{ responseData: Asset[] }>(
        `${BASE_URL}/getAllAsset`
      );
      const responseData = response.data.responseData;

      if (Array.isArray(responseData)) {
        const locationId = localStorage.getItem('locationId');

        if (locationId === null) {
          console.error("Location not found in ");
          throw new Error("Failed to fetch Assets");
        }
        const filteredAssets = responseData.filter((asset) => asset.assetLocation === Number(locationId));
        dispatch({
          type: FETCH_ASSETS,
          payload: filteredAssets,
        });
         const assetIds = filteredAssets.map((asset) => asset.assetId);
         localStorage.setItem('assetIds', JSON.stringify(assetIds));
      } else {
        console.error("Invalid API response format");
        throw new Error("Failed to fetch Assets");
      }
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch Assets");
  }
};

export const addAsset = (
  asset: Asset
): ThunkAction<void, RootState, null, AssetActionTypes> => async (
  dispatch
) => {
  try {
    const response = await axios.post<Asset>(`${BASE_URL}/addAsset`, asset);
    const newAsset = response.data;
    alert("Asset successfully Added");
    await dispatch(fetchAssets());
    dispatch({
      type: ADD_ASSET,
      payload: newAsset,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      if (responseData?.responseStatus) {
        const { statusCode, message } = responseData.responseStatus;
        alert(`Error (Status Code: ${statusCode}): ${message}`);
      } else {
        alert("Failed to add Asset");
      }
    } else {
      alert("Failed to add Asset");
    }
   
    throw new Error("Failed to add Asset");
  }
};

// Action creator to update an asset
export const updateAsset = (
  asset: Asset
): ThunkAction<void, RootState, null, AssetActionTypes> => async (
  dispatch
) => {
  try {
    const response = await axios.post<Asset>(
      `${BASE_URL}/modifyAsset`,
      asset
    );
    const updatedAsset = response.data;
    alert("Asset successfully Updated");
    await dispatch(fetchAssets());
    dispatch({
      type: UPDATE_ASSET,
      payload: updatedAsset,
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update Asset");
  }
};

// Action creator to activate an asset
export const activateAsset = (
  assetId: number
): ThunkAction<void, RootState, null, AssetActionTypes> => async (
  dispatch
) => {
  try {
    await axios.post(`${BASE_URL}/activateAsset?assetId=${assetId}`);
    alert("Asset successfully Activated");
    await dispatch(fetchAssets());
    dispatch<ActivateAssetAction>({
      type: ACTIVATE_ASSET,
      payload: assetId,
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to activate Asset");
  }
};

// Action creator to deactivate an asset
export const deactivateAsset = (
  assetId: number
): ThunkAction<void, RootState, null, AssetActionTypes> => async (
  dispatch
) => {
  try {
    await axios.post(`${BASE_URL}/deactivateAsset?assetId=${assetId}`);
    alert("Asset successfully Deactivated");
    await dispatch(fetchAssets());
    dispatch<DeactivateAssetAction>({
      type: DEACTIVATE_ASSET,
      payload: assetId,
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to deactivate Asset");
  }
};
