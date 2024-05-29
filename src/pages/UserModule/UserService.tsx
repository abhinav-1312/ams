import axios from "axios";
import { User } from "./UserInterface";
import { BASE_URL } from "../../utils/BaseUrl";

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get<{ responseData: User[] }>(`${BASE_URL}/getAllUser`);
    const responseData = response.data.responseData;
    
    if (Array.isArray(responseData)) {
      return responseData;
    } else {
      console.error("Invalid API response format");
      throw new Error("Failed to fetch users");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch users");
  }
};

export const addUser = async (user: User): Promise<User> => {
  try {
    const response = await axios.post<User>(`${BASE_URL}/addUser`, user);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to add user");
  }
};

export const modifyUser = async (user: User): Promise<User> => {
  try {
    const response = await axios.post<User>(`${BASE_URL}/modifyUser`, user);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to modify user");
  }
};


export const activateUser = async (userId: number): Promise<void> => {
  try {
    await axios.post(`${BASE_URL}/activateUser?userId=${userId}`);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to activate user");
  }
};

export const deactivateUser = async (userId: number): Promise<void> => {
  try {
    await axios.post(`${BASE_URL}/deactivateUser?userId=${userId}`);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to deactivate user");
  }
};
