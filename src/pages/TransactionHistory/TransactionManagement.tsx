import React, { useState, useEffect, ChangeEvent } from "react";
import { ThunkDispatch } from "redux-thunk";
import {
  Button,
  TextField,
  Typography,
  Box,
  Modal,
  Card,
  CardContent,
} from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import { RootState } from "../../store/store";
import { useSelector, useDispatch } from "react-redux";
import SkeletonTable from "../../components/SkeletonTable";
import {
  fetchTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} from "../../store/actions/transactionActions";
import { Transaction } from "./TransactionInterface";
import TransactionForm from "./TransactionForm";
import TransactionTable from "./TransactionTable";

const TransactionManagement: React.FC = () => {
  const transactions = useSelector(
    (state: RootState) => state.transaction.transactions
  );

  const dispatch = useDispatch<ThunkDispatch<RootState, null, any>>();

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionFormData, setTransactionFormData] =
    useState<Transaction | null>(null);

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  const addNewTransaction = () => {
    setIsModalOpen(true);
    setTransactionFormData(null);
  };

  const editTransaction = (transaction: Transaction) => {
    setIsModalOpen(true);
    setTransactionFormData(transaction);
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setTransactionFormData(null);
  };

  const dltTransaction = async (transactionId: number) => {
    try {
      await dispatch(deleteTransaction(transactionId));
    } catch (error) {
      console.error(error);
    }
  };

  const handleFormSubmit = async (transaction: Transaction) => {
    try {
      if (transactionFormData === null) {
        dispatch(addTransaction(transaction));
      } else {
        dispatch(updateTransaction(transaction));
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };
 
 
  const filteredTransactionList = transactions.filter((transaction) => {
    const searchTermLower = searchTerm.toLowerCase();
    const searchTerms = searchTermLower.split(',');
  
    return searchTerms.every((term) =>
      Object.values(transaction).some((fieldValue) =>
        (typeof fieldValue === "string" || typeof fieldValue === "number") &&
        fieldValue.toString().toLowerCase().includes(term)
      )
    );
  });
  
  
  
  
  return (
    <div>
      <h1>Transaction History</h1>
      <Card>
        <CardContent>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <TextField
              label="Search Transactions"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={addNewTransaction}
            >
              Add Transaction
            </Button>
          </div>
          <br />
          {transactions.length === 0 ? (
            <SkeletonTable />
          ) : (
            <TransactionTable
              transactionList={filteredTransactionList}
              editTransaction={editTransaction}
              deleteTransaction={dltTransaction}
            />
          )}
        </CardContent>
      </Card>
      <Modal open={isModalOpen}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Card>
            <CardContent>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  {transactionFormData ? "Edit Transaction" : "Add Transaction"}
                </Typography>
                <Button color="error" onClick={handleModalClose}>
                  <Close />
                </Button>
              </div>
              <br />
              <TransactionForm
                transaction={transactionFormData}
                onSubmit={handleFormSubmit}
                handleModalClose={handleModalClose}
              />
            </CardContent>
          </Card>
        </Box>
      </Modal>
    </div>
  );
};

export default TransactionManagement;
