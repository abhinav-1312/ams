// userReducer.ts

import {
  FETCH_USERS,
  ADD_USER,
  UPDATE_USER,
  ACTIVATE_USER,
  DEACTIVATE_USER,
} from "../actions/userActions";
import { User } from "../../pages/UserModule/UserInterface";

export interface UserState {
  users: User[];
}

const initialState: UserState = {
  users: [],
};

const userReducer = (
  state = initialState,
  action: any
): UserState => {
  switch (action.type) {
    case FETCH_USERS:
      return {
        ...state,
        users: action.payload,
      };
    case ADD_USER:
      return {
        ...state,
        users: [...state.users, action.payload],
      };
    case UPDATE_USER:
      return {
        ...state,
        users: state.users.map((user) =>
          user.userId === action.payload.userId ? action.payload : user
        ),
      };
    case ACTIVATE_USER:
      return {
        ...state,
        users: state.users.map((user) =>
          user.userId === action.payload
            ? { ...user, userStatus: true }
            : user
        ),
      };
    case DEACTIVATE_USER:
      return {
        ...state,
        users: state.users.map((user) =>
          user.userId === action.payload
            ? { ...user, userStatus: false }
            : user
        ),
      };
    default:
      return state;
  }
};

export default userReducer;
