import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  IconButton,
  Button,
  Menu,
  MenuItem,
  Modal,
  Typography,
  CircularProgress,
  Fade,
  Card,
  CardContent,
} from "@mui/material";
import { Edit, Delete, KeyboardArrowDown } from "@mui/icons-material";
import { Transaction } from "./TransactionInterface";
import { Example } from "../assetManage/assetDetails/Invoice";

interface TransactionTableProps {
  transactionList: Transaction[];
  deleteTransaction: (transactionId: number) => void;
  editTransaction: (transaction: Transaction) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactionList,
  editTransaction,
  deleteTransaction,
}) => {
  const [userRole, setUserRole] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openModal, setOpenModal] = useState(false);
  const [assetData, setAssetData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [TxnID, setTxnID] = useState<number | undefined>(undefined);

  const open = Boolean(anchorEl);

  const [invoiceType, setInvoiceType] = useState("INVOICE");

  const handleMenuClick = (menuItem: "GATEPASS" | "INVOICE" | "CHALLAN") => {
    let selectedType = "INVOICE";

    if (menuItem === "GATEPASS") {
      selectedType = "GATEPASS";
    } else if (menuItem === "CHALLAN") {
      selectedType = "CHALLAN";
    }

    setInvoiceType(selectedType);
    handleOpenInvoiceModal();
  };

  const handleInvoiceButtonClick = (assetIdrow: number) => {
    handleOpenInvoiceModal();
    setLoading(true);
    const apiUrl = `https://asset-management-service.azurewebsites.net/asset-management/getAsset?assetId=${assetIdrow}`;
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setAssetData(data.responseData);
      })
      .catch((error) => {
        console.error("Error fetching asset data:", error);
      })
      .finally(() => {
        setLoading(false);
        handleOpenInvoiceModal();
      });
  };

  console.log("asset data: ", assetData)

  const handleTxnID = (newTxnID: number) => {
    const apiUrl = `
    https://asset-management-service.azurewebsites.net/asset-management/getTransaction?txnId=${newTxnID}`;
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setTxnID(data.responseData);
      })
      .catch((error) => {
        console.error("Error fetching asset data:", error);
      });
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenInvoiceModal = () => {
    setOpenModal(true);
    setAnchorEl(null);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    const storedUserRole = localStorage.getItem("userRole");

    if (storedUserRole) {
      setUserRole(JSON.parse(storedUserRole));
    }
  }, []);

  const formatDateToIST = (dateString: string | null) => {
    if (!dateString) {
      return "";
    }

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      timeZone: "Asia/Kolkata",
    };
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return "";
    }

    return new Intl.DateTimeFormat("en-IN", options).format(date);
  };

  const columns = [
    { field: "transactionId", headerName: "Transaction Id", width: 150 },
    { field: "assetId", headerName: "Asset Id ", width: 150 },
    {
      field: "assetName",
      headerName: "Asset Name",
      width: 150,
    },
    {
      field: "assetTag",
      headerName: "Barcode",
      width: 150,
    },

    {
      field: "assetQuantity",
      headerName: "Quantity",
      width: 150,
    },
    {
      field: "fromLocationName",
      headerName: "From Location",
      width: 150,
    },
    {
      field: "toLocationName",
      headerName: "To Location",
      width: 150,
    },
    {
      field: "fromEmployeeName",
      headerName: "From FT/FOM",
      width: 150,
    },
    {
      field: "toEmployeeName",
      headerName: "To FT/FOM",
      width: 150,
    },
    {
      field: "fromKamAsm",
      headerName: "From KAM/ASM",
      width: 150,
    },
    {
      field: "toKamAsm",
      headerName: "To KAM/ASM",
      width: 150,
    },
    {
      field: "vendorName",
      headerName: "Vendor Name",
      width: 150,
    },
    {
      field: "transactionDate",
      headerName: "Transaction Date",
      width: 170,
      renderCell: (params: any) => <div>{formatDateToIST(params.value)}</div>,
    },
    { field: "transactionType", headerName: "Transaction Type", width: 150 },

    {
      field: "action",
      headerName: "Action",
      width: 250,
      renderCell: (params: any) => (
        <div>
          <IconButton
            onClick={() => editTransaction(params.row as Transaction)}
          >
            <Edit />
          </IconButton>
          {userRole.includes("Tnx Delete") && (
            <IconButton
              onClick={() =>
                deleteTransaction((params.row as Transaction).transactionId)
              }
            >
              <Delete />
            </IconButton>
          )}
          <Button
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={(e) => {
              handleClick(e);
            }}
            endIcon={<KeyboardArrowDown />}
          >
            Invoice
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem
              onClick={() => {
                handleMenuClick("GATEPASS");
                handleInvoiceButtonClick(params.row.assetId);
                handleTxnID(params.row.transactionId);
              }}
            >
              GATEPASS
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClick("INVOICE");
                handleInvoiceButtonClick(params.row.assetId);
                handleTxnID(params.row.transactionId);
              }}
            >
              INVOICE
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClick("CHALLAN");
                handleInvoiceButtonClick((params.row as Transaction).assetId);
                handleTxnID((params.row as Transaction).transactionId);
              }}
            >
              CHALLAN
            </MenuItem>
          </Menu>
        </div>
      ),
    },
  ];

  return (
    <div style={{ minHeight: 400, maxHeight: 900, width: "100%" }}>
      <DataGrid
        rows={transactionList.map((row, index) => ({ ...row, id: index }))}
        columns={columns}
        getRowId={(row) => row.id}
        components={{
          Toolbar: GridToolbar,
        }}
        style={{ maxHeight: 700 }}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[10, 20, 30, 50, 100]}
      />

      <Modal open={openModal} closeAfterTransition>
        <Fade in={openModal} style={{ overflow: "scroll", height: "100%" }}>
          <div style={{ overflow: "scroll" }}>
            {loading ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "100vh",
                }}
              >
                <Card>
                  <CardContent
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CircularProgress />
                    <Typography>Loading data, please wait...</Typography>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Example
                invoiceData={assetData}
                invoiceType={invoiceType}
                handleModalClose={handleCloseModal}
                TxnID={TxnID}
              />
            )}
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

export default TransactionTable;
