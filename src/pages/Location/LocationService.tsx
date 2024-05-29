import axios from "axios";
import { Location } from "./LocationInterface";
import { BASE_URL } from "../../utils/BaseUrl";

export const fetchLocations = async (): Promise<Location[]> => {
  try {
    const response = await axios.get<{ responseData: Location[] }>(`${BASE_URL}/getAllLocation`);
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

export const addLocation = async (location: Location): Promise<Location> => {
  try {
    const response = await axios.post<Location>(`${BASE_URL}/addLocation`, location);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to add Location");
  }
};

export const updateLocation = async (location: Location): Promise<Location> => {
  try {
    const response = await axios.post<Location>(
      `${BASE_URL}/modifyLocation`,
      location
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update Location");
  }
};



export const activateLocation = async (locationId: any): Promise<void> => {
  try {
    await axios.post(`${BASE_URL}/activateLocation?locationId=${locationId}`);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to activate Location");
  }
};

export const deactivateLocation = async (locationId: any): Promise<void> => {
  try {
    await axios.post(`${BASE_URL}/deactivateLocation?locationId=${locationId}`);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to deactivate Location");
  }
};
