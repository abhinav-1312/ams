
import axios from "axios";
import {Department } from '../../pages/Department/DprtInterface'
import { ThunkAction } from "redux-thunk";
import  {RootState}  from "../store"; 
import { BASE_URL } from "../../utils/BaseUrl";

export const FETCH_DEPARTMENTS = "FETCH_DEPARTMENTS";
export const ADD_DEPARTMENT = "ADD_DEPARTMENT";
export const UPDATE_DEPARTMENT = "UPDATE_DEPARTMENT";
export const DELETE_DEPARTMENT = "DELETE_DEPARTMENT";
export const ACTIVATE_DEPARTMENT = "ACTIVATE_DEPARTMENT";
export const DEACTIVATE_DEPARTMENT = "DEACTIVATE_DEPARTMENT";

interface FetchDepartmentsAction {
  type: typeof FETCH_DEPARTMENTS;
  payload: Department[];
}

interface AddDepartmentAction {
  type: typeof ADD_DEPARTMENT;
  payload: Department;
}

interface UpdateDepartmentAction {
  type: typeof UPDATE_DEPARTMENT;
  payload: Department;
}


interface ActivateDepartmentAction {
  type: typeof ACTIVATE_DEPARTMENT;
  payload: number;
}

interface DeactivateDepartmentAction {
  type: typeof DEACTIVATE_DEPARTMENT;
  payload: number; 
}

export type DepartmentActionTypes =
  | FetchDepartmentsAction
  | AddDepartmentAction
  | UpdateDepartmentAction
  | ActivateDepartmentAction
  | DeactivateDepartmentAction;

export const fetchDepartments = (): ThunkAction<
  void,
  RootState, 
  null,
  DepartmentActionTypes
> => async (dispatch) => {
  try {
    const response = await axios.get<{ responseData: Department[] }>(
      `${BASE_URL}/getAllDepartment`
    );
    const responseData = response.data.responseData;

    if (Array.isArray(responseData)) {
      dispatch({
        type: FETCH_DEPARTMENTS,
        payload: responseData,
      });
    } else {
      console.error("Invalid API response format");
      throw new Error("Failed to fetch Departments");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch Departments");
  }
};
export const addDepartment = (
  department: Department
): ThunkAction<void, RootState, null, DepartmentActionTypes> => async (dispatch) => {
  try {
    const response = await axios.post<Department>(
      `${BASE_URL}/addDepartment`,
      department
    );
    const newDepartment = response.data;
    alert("Department successfully Added");
    await dispatch(fetchDepartments());
    dispatch({
      type: ADD_DEPARTMENT,
      payload: newDepartment,
    });
  } catch (error: any) {
    console.error(error);
    const errorMessage =
      error?.response?.data?.responseStatus?.message ||
      "Failed to add Department";
    alert(errorMessage);
  }
};

export const updateDepartment = (
  department: Department
): ThunkAction<void, RootState, null, DepartmentActionTypes> => async (dispatch) => {
  try {
    const response = await axios.post<Department>(
      `${BASE_URL}/modifyDepartment`,
      department
    );
    const updatedDepartment = response.data;
    alert("Department successfully Updated");
    await dispatch(fetchDepartments());
    dispatch({
      type: UPDATE_DEPARTMENT,
      payload: updatedDepartment,
    });
  } catch (error: any) {
    console.error(error);
    const errorMessage =
      error?.response?.data?.responseStatus?.message ||
      "Failed to update Department";
    alert(errorMessage);
  }
};

export const activateDepartment = (
  departmentId: number
): ThunkAction<void, RootState, null, DepartmentActionTypes> => async (dispatch) => {
  try {
    await axios.post(`${BASE_URL}/activateDepartment?departmentId=${departmentId}`);
    alert("Department successfully Activated");

    dispatch<ActivateDepartmentAction>({
      type: ACTIVATE_DEPARTMENT,
      payload: departmentId,
    });
  } catch (error: any) {
    console.error(error);
    const errorMessage =
      error?.response?.data?.responseStatus?.message ||
      "Failed to activate Department";
    alert(errorMessage);
  }
};

export const deactivateDepartment = (
  departmentId: number
): ThunkAction<void, RootState, null, DepartmentActionTypes> => async (dispatch) => {
  try {
    await axios.post(`${BASE_URL}/deactivateDepartment?departmentId=${departmentId}`);
    alert("Department successfully Inactivated");

    dispatch<DeactivateDepartmentAction>({
      type: DEACTIVATE_DEPARTMENT,
      payload: departmentId,
    });
  } catch (error: any) {
    console.error(error);
    const errorMessage =
      error?.response?.data?.responseStatus?.message ||
      "Failed to deactivate Department";
    alert(errorMessage);
  }
};
