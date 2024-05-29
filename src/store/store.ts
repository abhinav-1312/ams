import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import locationReducer from "./reducers/locationReducer";
import departmentReducer from "./reducers/departmentReducer"; 
import employeeReducer from "./reducers/employeeReducer";
import userReducer from "./reducers/userReducer";
import transactionReducer from "./reducers/transactionReducer";
import vendorReducer from "./reducers/vendorReducer";
import assetReducer from "./reducers/assetReducer";
export type RootState = {
  location: ReturnType<typeof locationReducer>;
  department: ReturnType<typeof departmentReducer>;
  employee: ReturnType<typeof employeeReducer>;
  user: ReturnType<typeof userReducer>;
  transaction: ReturnType<typeof transactionReducer>;
  vendor: ReturnType<typeof vendorReducer>;
  asset:ReturnType<typeof assetReducer>;
};

const rootReducer = combineReducers({
  location: locationReducer,
  department: departmentReducer,
  employee: employeeReducer,
  user: userReducer,
  transaction: transactionReducer,
  vendor: vendorReducer,
  asset: assetReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
