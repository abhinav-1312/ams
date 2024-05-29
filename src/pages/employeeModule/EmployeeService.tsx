import axios from "axios";
import { Employee } from "./EmployeeInterface";
import { BASE_URL } from "../../utils/BaseUrl";

export const fetchEmployees = async (): Promise<Employee[]> => {
  try {
    const response = await axios.get<{ responseData: Employee[] }>(`${BASE_URL}/getAllEmployee`);
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

export const addEmployee = async (employee: Employee): Promise<Employee> => {
  try {
    const response = await axios.post<Employee>(`${BASE_URL}/addEmployee`, employee);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to add Employee");
  }
};

export const updateEmployee = async (employee: Employee): Promise<Employee> => {
  try {
    const response = await axios.post<Employee>(
      `${BASE_URL}/modifyEmployee`,
      employee
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update Employee");
  }
};

export const deleteEmployee = async (employeeId: number): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}/employee/${employeeId}`);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete Employee");
  }
};

export const activateEmployee = async (employeeId: number): Promise<void> => {
  try {
    await axios.post(`${BASE_URL}/activateEmployee?employeeId=${employeeId}`);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to activate Employee");
  }
};

export const deactivateEmployee = async (employeeId: number): Promise<void> => {
  try {
    await axios.post(`${BASE_URL}/deactivateEmployee?employeeId=${employeeId}`);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to deactivate Employee");
  }
};
