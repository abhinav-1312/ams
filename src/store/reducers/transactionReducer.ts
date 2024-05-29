// transactionReducer.ts

import {
  FETCH_TRANSACTIONS,
  ADD_TRANSACTION,
  UPDATE_TRANSACTION,
  ACTIVATE_TRANSACTION,
  DEACTIVATE_TRANSACTION,
  DELETE_TRANSACTION,
} from "../actions/transactionActions";
import { Transaction } from "../../pages/TransactionHistory/TransactionInterface";

export interface TransactionState {
  transactions: Transaction[];
}

const initialState: TransactionState = {
  transactions: [],
};

const transactionReducer = (
  state = initialState,
  action: any
): TransactionState => {
  switch (action.type) {
    case FETCH_TRANSACTIONS:
      return {
        ...state,
        transactions: action.payload,
      };
    case ADD_TRANSACTION:
      return {
        ...state,
        transactions: [...state.transactions, action.payload],
      };
    case UPDATE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.map((transaction) =>
          transaction.transactionId === action.payload.transactionId
            ? action.payload
            : transaction
        ),
      };
      case DELETE_TRANSACTION:
        // Filter out the transaction with the matching transactionId
        return {
          ...state,
          transactions: state.transactions.filter((transaction) =>
            transaction.transactionId !== action.payload
          ),
        };
    case ACTIVATE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.map((transaction) =>
          transaction.transactionId === action.payload
            ? { ...transaction, Status: true }
            : transaction
        ),
      };
    case DEACTIVATE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.map((transaction) =>
          transaction.transactionId === action.payload
            ? { ...transaction, Status: false }
            : transaction
        ),
      };
    default:
      return state;
  }
};

export default transactionReducer;
