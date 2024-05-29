// transactionActions.ts

import axios from "axios";
import { ThunkAction } from "redux-thunk";
import { RootState } from "../store";
import { Transaction } from "../../pages/TransactionHistory/TransactionInterface";
import { BASE_URL } from "../../utils/BaseUrl";



// transactionActionTypes.ts

export const FETCH_TRANSACTIONS = "FETCH_TRANSACTIONS";
export const ADD_TRANSACTION = "ADD_TRANSACTION";
export const UPDATE_TRANSACTION = "UPDATE_TRANSACTION";
export const ACTIVATE_TRANSACTION = "ACTIVATE_TRANSACTION";
export const DEACTIVATE_TRANSACTION = "DEACTIVATE_TRANSACTION";
export const DELETE_TRANSACTION = "DELETE_TRANSACTION";

// Fetch transactions
export const fetchTransactions = (): ThunkAction<
  void,
  RootState,
  null,
  TransactionActionTypes
> => async (dispatch) => {
  try {
    const assetIdsJSON = localStorage.getItem('assetIds');
    const assetIds = assetIdsJSON ? JSON.parse(assetIdsJSON) : [];

    if (assetIds.length === 0) {
      alert("Wait Asset data Is fetcheing ");
      return;
    }

    const response = await axios.get<{ responseData: Transaction[] }>(
      `${BASE_URL}/getAllTransaction`
    );
    const responseData = response.data.responseData;

    if (Array.isArray(responseData)) {
      const filteredTransactions = responseData.filter((transaction) => assetIds.includes(transaction.assetId));
      dispatch({
        type: FETCH_TRANSACTIONS,
        payload: filteredTransactions,
      });
    } else {
      console.error("Invalid API response format");
      alert("Failed to fetch Transactions");
    }
  } catch (error) {
    console.error(error);
    alert("Failed to fetch Transactions");
  }
};


// Add transaction
export const addTransaction = (
  transaction: Transaction
): ThunkAction<void, RootState, null, TransactionActionTypes> => async (dispatch) => {
  try {
    const response = await axios.post<Transaction>(
      `${BASE_URL}/addTransaction`,
      transaction
    );
    const newTransaction = response.data;
    alert("Transaction successfully Added");
    await dispatch(fetchTransactions());
    dispatch({
      type: ADD_TRANSACTION,
      payload: newTransaction,
    });
  } catch (error) {
    console.error(error);
   alert("Failed to add Transaction");
  }
};

// Update transaction
export const updateTransaction = (
  transaction: Transaction
): ThunkAction<void, RootState, null, TransactionActionTypes> => async (dispatch) => {
  try {
    const response = await axios.post<Transaction>(
      `${BASE_URL}/modifyTransaction`,
      transaction
    );
    const updatedTransaction = response.data;
    alert("Transaction successfully Updated");
    await dispatch(fetchTransactions());
    dispatch({
      type: UPDATE_TRANSACTION,
      payload: updatedTransaction,
    });
  } catch (error) {
    console.error(error);
   alert("Failed to update Transaction");
  }
};


// Delete transaction
export const deleteTransaction = (
  transactionId: number
): ThunkAction<void, RootState, null, TransactionActionTypes> => async (dispatch) => {
  try {
   await axios.delete(
      `${BASE_URL}/deleteTransaction?txnId=${transactionId}`
    );
    alert("Transaction successfully deleted");
    await dispatch(fetchTransactions());
    dispatch({
      type: DELETE_TRANSACTION,
      payload: transactionId,
    });
  } catch (error) {
    console.error(error);
   alert("Failed to delete Transaction");
  }
};


// Activate transaction
export const activateTransaction = (
  transactionId: number
): ThunkAction<void, RootState, null, TransactionActionTypes> => async (dispatch) => {
  try {
    await axios.post(`${BASE_URL}/activateTransaction?transactionId=${transactionId}`);
    alert("Transaction successfully Activated");
    
    dispatch({
      type: ACTIVATE_TRANSACTION,
      payload: transactionId,
    });
  } catch (error) {
    console.error(error);
   alert("Failed to activate Transaction");
  }
};

// Deactivate transaction
export const deactivateTransaction = (
  transactionId: number
): ThunkAction<void, RootState, null, TransactionActionTypes> => async (dispatch) => {
  try {
    await axios.post(`${BASE_URL}/deactivateTransaction?transactionId=${transactionId}`);
    alert("Transaction successfully Deactivated");
    dispatch({
      type: DEACTIVATE_TRANSACTION,
      payload: transactionId,
    });
  } catch (error) {
    console.error(error);
   alert("Failed to deactivate Transaction");
  }
};

export type TransactionActionTypes =
  | FetchTransactionsAction
  | AddTransactionAction
  | UpdateTransactionAction
  | ActivateTransactionAction
  | DeactivateTransactionAction
  | DeleteTransactionAction;

interface FetchTransactionsAction {
  type: typeof FETCH_TRANSACTIONS;
  payload: Transaction[];
}

interface AddTransactionAction {
  type: typeof ADD_TRANSACTION;
  payload: Transaction;
}

interface UpdateTransactionAction {
  type: typeof UPDATE_TRANSACTION;
  payload: Transaction;
}

interface ActivateTransactionAction {
  type: typeof ACTIVATE_TRANSACTION;
  payload: number;
}

interface DeactivateTransactionAction {
  type: typeof DEACTIVATE_TRANSACTION;
  payload: number;
}

interface DeleteTransactionAction {
  type: typeof DELETE_TRANSACTION;
  payload: number; 
}