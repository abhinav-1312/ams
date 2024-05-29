// userActions.ts

import axios from "axios";
import { ThunkAction } from "redux-thunk";
import { RootState } from "./../store";

import { User } from "../../pages/UserModule/UserInterface";
import { BASE_URL } from "../../utils/BaseUrl";


export const FETCH_USERS = "FETCH_USERS";
export const ADD_USER = "ADD_USER";
export const UPDATE_USER = "UPDATE_USER";
export const ACTIVATE_USER = "ACTIVATE_USER";
export const DEACTIVATE_USER = "DEACTIVATE_USER";

interface FetchUsersAction {
  type: typeof FETCH_USERS;
  payload: User[];
}

interface AddUserAction {
  type: typeof ADD_USER;
  payload: User;
}

interface UpdateUserAction {
  type: typeof UPDATE_USER;
  payload: User;
}

interface ActivateUserAction {
  type: typeof ACTIVATE_USER;
  payload: number;
}

interface DeactivateUserAction {
  type: typeof DEACTIVATE_USER;
  payload: number;
}

export type UserActionTypes =
  | FetchUsersAction
  | AddUserAction
  | UpdateUserAction
  | ActivateUserAction
  | DeactivateUserAction;

export const fetchUsers = (): ThunkAction<
  void,
  RootState,
  null,
  UserActionTypes
> => async (dispatch) => {
  try {
    const response = await axios.get<{ responseData: User[] }>(
      `${BASE_URL}/getAllUser`
    );
    const responseData = response.data.responseData;

    if (Array.isArray(responseData)) {
      dispatch({
        type: FETCH_USERS,
        payload: responseData,
      });
    } else {
      console.error("Invalid API response format");
      throw new Error("Failed to fetch Users");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch Users");
  }
};

export const addUser = (
  user: User
): ThunkAction<void, RootState, null, UserActionTypes> => async (dispatch) => {
  try {
    const response = await axios.post<User>(`${BASE_URL}/addUser`, user);
    const newUser = response.data;
    alert("User successfully Added");
    await dispatch(fetchUsers());
    dispatch({
      type: ADD_USER,
      payload: newUser,
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to add User");
  }
};

export const updateUser = (
  user: User
): ThunkAction<void, RootState, null, UserActionTypes> => async (dispatch) => {
  try {
    const response = await axios.post<User>(`${BASE_URL}/modifyUser`, user);
    const updatedUser = response.data;
    alert("User successfully Updated");
    await dispatch(fetchUsers());
    dispatch({
      type: UPDATE_USER,
      payload: updatedUser,
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update User");
  }
};

export const activateUser = (
  userId: number
): ThunkAction<void, RootState, null, UserActionTypes> => async (dispatch) => {
  try {
    await axios.post(`${BASE_URL}/activateUser?userId=${userId}`);
    alert("User successfully Activated");

    dispatch<ActivateUserAction>({
      type: ACTIVATE_USER,
      payload: userId,
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to activate User");
  }
};

export const deactivateUser = (
  userId: number
): ThunkAction<void, RootState, null, UserActionTypes> => async (dispatch) => {
  try {
    await axios.post(`${BASE_URL}/deactivateUser?userId=${userId}`);
    alert("User successfully Inactivated");

    dispatch<DeactivateUserAction>({
      type: DEACTIVATE_USER,
      payload: userId,
    });
  } catch (error) {
    console.error(error);
    throw  new Error("Failed to deactivate User");
  }
};
