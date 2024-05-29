import axios from "axios";
import { Employee } from "../../pages/employeeModule/EmployeeInterface"; // Import your Employee interface
import { ThunkAction } from "redux-thunk";
import { RootState } from "./../store";
import { BASE_URL } from "../../utils/BaseUrl";

// Define your Employee action types
export const FETCH_EMPLOYEES = "FETCH_EMPLOYEES";
export const ADD_EMPLOYEE = "ADD_EMPLOYEE";
export const UPDATE_EMPLOYEE = "UPDATE_EMPLOYEE";
export const ACTIVATE_EMPLOYEE = "ACTIVATE_EMPLOYEE";
export const DEACTIVATE_EMPLOYEE = "DEACTIVATE_EMPLOYEE";

// Define your Employee action interfaces
interface FetchEmployeesAction {
  type: typeof FETCH_EMPLOYEES;
  payload: Employee[];
}

interface AddEmployeeAction {
  type: typeof ADD_EMPLOYEE;
  payload: Employee;
}

interface UpdateEmployeeAction {
  type: typeof UPDATE_EMPLOYEE;
  payload: Employee;
}

interface ActivateEmployeeAction {
  type: typeof ACTIVATE_EMPLOYEE;
  payload: number;
}

interface DeactivateEmployeeAction {
  type: typeof DEACTIVATE_EMPLOYEE;
  payload: number;
}

// Define the union type for Employee actions
export type EmployeeActionTypes =
  | FetchEmployeesAction
  | AddEmployeeAction
  | UpdateEmployeeAction
  | ActivateEmployeeAction
  | DeactivateEmployeeAction;

// Define your async action creators using Thunk
export const fetchEmployees = (): ThunkAction<
  void,
  RootState,
  null,
  EmployeeActionTypes
> => async (dispatch) => {
  try {
    const response = await axios.get<{ responseData: Employee[] }>(
      `${BASE_URL}/getAllEmployee`
    );
    const responseData = response.data.responseData;

    if (Array.isArray(responseData)) {
      dispatch({
        type: FETCH_EMPLOYEES,
        payload: responseData,
      });
    } else {
      console.error("Invalid API response format");
      throw new Error("Failed to fetch FT/FOM-KAM/ASM");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch FT/FOM-KAM/ASM");
  }
};

export const addEmployee = (
  employee: Employee
): ThunkAction<void, RootState, null, EmployeeActionTypes> => async (dispatch) => {
  try {
    const response = await axios.post<Employee>(
      `${BASE_URL}/addEmployee`,
      employee
    );
    const newEmployee = response.data;
    alert("FT/FOM-KAM/ASM successfully Added");
    await dispatch(fetchEmployees());
    dispatch({
      type: ADD_EMPLOYEE,
      payload: newEmployee,
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to add FT/FOM-KAM/ASM");
  }
};

export const updateEmployee = (
  employee: Employee
): ThunkAction<void, RootState, null, EmployeeActionTypes> => async (dispatch) => {
  try {
    const response = await axios.post<Employee>(
      `${BASE_URL}/modifyEmployee`,
      employee
    );
    const updatedEmployee = response.data;
    alert("FT/FOM-KAM/ASM successfully Updated");
    await dispatch(fetchEmployees());
    dispatch({
      type: UPDATE_EMPLOYEE,
      payload: updatedEmployee,
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update FT/FOM-KAM/ASM");
  }
};

export const activateEmployee = (
  employeeId: number
): ThunkAction<void, RootState, null, EmployeeActionTypes> => async (dispatch) => {
  try {
    await axios.post(`${BASE_URL}/activateEmployee?employeeId=${employeeId}`);
    alert("FT/FOM-KAM/ASM successfully Activated");

    dispatch<ActivateEmployeeAction>({
      type: ACTIVATE_EMPLOYEE,
      payload: employeeId,
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to activate FT/FOM-KAM/ASM");
  }
};

export const deactivateEmployee = (
  employeeId: number
): ThunkAction<void, RootState, null, EmployeeActionTypes> => async (dispatch) => {
  try {
    await axios.post(`${BASE_URL}/deactivateEmployee?employeeId=${employeeId}`);
    alert("Employee successfully Inactivated");

    dispatch<DeactivateEmployeeAction>({
      type: DEACTIVATE_EMPLOYEE,
      payload: employeeId,
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to deactivate FT/FOM-KAM/ASM");
  }
};
