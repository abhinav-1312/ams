import axios from "axios";
import { Vendor } from "./vendorInterface";
import { BASE_URL } from "../../utils/BaseUrl";

export const fetchVendors = async (): Promise<Vendor[]> => {
  try {
    const response = await axios.get<{ responseData: Vendor[] }>(
      `${BASE_URL}/getAllVendor`
    );
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

export const addVendor = async (
  assetType: Vendor
): Promise<Vendor> => {
  try {
    const response = await axios.post<Vendor>(
      `${BASE_URL}/addVendor`,
      assetType
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to add Asset Type");
  }
};

export const updateVendor = async (
  assetType: Vendor
): Promise<Vendor> => {
  try {
    const response = await axios.post<Vendor>(
      `${BASE_URL}/modifyVendor`,
      assetType
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update Asset Type");
  }
};

export const activateVendor = async (
  assetDetailsId: number
): Promise<void> => {
  try {
    await axios.post(
      `${BASE_URL}/activateVendor?assetDetailsId=${assetDetailsId}`
    );
  } catch (error) {
    console.error(error);
    throw new Error("Failed to activate Asset Type");
  }
};

export const deactivateVendor = async (
  assetDetailsId: number
): Promise<void> => {
  try {
    await axios.post(
      `${BASE_URL}/deactivateVendor?assetDetailsId=${assetDetailsId}`
    );
  } catch (error) {
    console.error(error);
    throw new Error("Failed to deactivate Asset Type");
  }
};
