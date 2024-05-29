
import axios from "axios";
import { Asset } from "./AstInterface"; 
import { BASE_URL } from "../../utils/BaseUrl";



export const fetchAssets = async (): Promise<Asset[]> => {
  try {
    const response = await axios.get<{ responseData: Asset[] }>(`${BASE_URL}/getAllAsset`);
    const responseData = response.data.responseData;
    
    if (Array.isArray(responseData)) {
      return responseData;
    } else {
      console.error("Invalid API response format");
      throw new Error("Failed to fetch Assets");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch Assets");
  }
};


export const addAsset = async (asset: Asset): Promise<Asset> => {
  try {
    const response = await axios.post<Asset>(`${BASE_URL}/addAsset`, asset);
 
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to add Asset");
  }
};

export const updateAsset = async (asset: Asset): Promise<Asset> => {
  try {
    const response = await axios.post<Asset>(
      `${BASE_URL}/modifyAsset`,
      asset
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update Asset");
  }
};



export const deactivateAsset = async (assetId: number): Promise<void> => {
  try {
    await axios.post(`${BASE_URL}/deactivateAsset?assetId=${assetId}`);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to block Asset");
  }
};

export const activateAsset = async (assetId: number): Promise<void> => {
  try {
    await axios.post(`${BASE_URL}/activateAsset?assetId=${assetId}`);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to unblock Asset");
  }
};
