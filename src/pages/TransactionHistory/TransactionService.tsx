import axios from "axios";
import { Transaction } from "./TransactionInterface";
import { BASE_URL } from "../../utils/BaseUrl";

export const fetchTransactions = async (): Promise<Transaction[]> => {
  try {
    const response = await axios.get<{ responseData: Transaction[] }>(`${BASE_URL}/getAllTransaction`);
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

export const addTransaction = async (transaction: Transaction): Promise<Transaction> => {
  try {
    const response = await axios.post<Transaction>(`${BASE_URL}/addTransaction`, transaction);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to add Transaction");
  }
};

export const updateTransaction = async (transaction: Transaction): Promise<Transaction> => {
  try {
    const response = await axios.post<Transaction>(
      `${BASE_URL}/modifyTransaction`,
      transaction
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update Transaction");
  }
};



export const activateTransaction = async (transactionId: number): Promise<void> => {
  try {
    await axios.post(`${BASE_URL}/activateTransaction?transactionId=${transactionId}`);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to activate Transaction");
  }
};

export const deactivateTransaction = async (transactionId: number): Promise<void> => {
  try {
    await axios.post(`${BASE_URL}/deactivateTransaction?transactionId=${transactionId}`);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to deactivate Transaction");
  }
};
