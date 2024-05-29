import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  TablePagination,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchAssets } from "../../store/actions/assetActions";
import { RootState } from "../../store/store";
import { ThunkDispatch } from "redux-thunk";

interface Item {
  assetQuantity: number;
  itemName: string;
  openingStockQty: number;
  usedQty: number;
  receivedQty: number;
  damageMissingQty: number;
  totalStock: number;
  assetType?: string; // Make assetType optional
  latestTransaction?: {
    transactionType?: any; // Make transactionType optional
  };
}
const ItemTable: React.FC = () => {
  const dispatch = useDispatch<ThunkDispatch<RootState, null, any>>();
  const items = useSelector((state: RootState) => state.asset.assets);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filter, setFilter] = useState<string>("");
  useEffect(() => {
    dispatch(fetchAssets());
  }, [dispatch]);

  // Organize data by asset type and transaction type
  const organizedData: Record<any | undefined, Record<string, Item[]>> = {};
  items.forEach((item) => {
    const assetType = item.assetType || "Unknown";
    if (!organizedData[assetType]) {
      organizedData[assetType] = {};
    }
    const transactionType =
      item.latestTransaction?.transactionType || "Unknown";
    if (!organizedData[assetType][transactionType]) {
      organizedData[assetType][transactionType] = [];
    }
    organizedData[assetType][transactionType].push(item as unknown as Item);
    console.log(organizedData);
  });
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };
  const totalCount = Object.keys(organizedData).length;

  return (
    <Card>
      <CardContent>
        <h1> Assets Summary </h1>
        <TextField
          label="Filter by Item Type"
          variant="outlined"
          size="small"
          value={filter}
          onChange={handleFilterChange}
        />
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>S.No.</b>
                  </TableCell>
                  <TableCell>
                    {" "}
                    <b>ITEM</b>{" "}
                  </TableCell>
                  <TableCell>
                    <b>Current Stock</b>
                  </TableCell>
                  <TableCell>
                    <b> Used In Field</b>
                  </TableCell>
                  <TableCell>
                    <b>Available Stocks</b>
                  </TableCell>
                  <TableCell>
                    <b>Damage/Missing</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(organizedData)
                  .filter((assetType) =>
                    assetType.toLowerCase().includes(filter.toLowerCase())
                  )
                  .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                  .map((assetType, index) => (
                    <TableRow key={assetType}>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>{assetType}</TableCell>
                      <TableCell>
                        {organizedData[assetType]["Warehouse Inventory"]
                          ? organizedData[assetType][
                              "Warehouse Inventory"
                            ].reduce(
                              (sum, item) => sum + (item.assetQuantity || 0),
                              0
                            )
                          : 0}
                      </TableCell>
                      <TableCell>
                        {organizedData[assetType]["Transfer"]
                          ? organizedData[assetType]["Transfer"].reduce(
                              (sum, item) => sum + (item.assetQuantity || 0),
                              0
                            )
                          : 0}
                      </TableCell>
                      <TableCell>
                        {(organizedData[assetType]["Warehouse Inventory"]
                          ? organizedData[assetType][
                              "Warehouse Inventory"
                            ].reduce(
                              (sum, item) => sum + (item.assetQuantity || 0),
                              0
                            )
                          : 0) +
                          (organizedData[assetType]["Transfer"]
                            ? organizedData[assetType]["Transfer"].reduce(
                                (sum, item) => sum + (item.assetQuantity || 0),
                                0
                              )
                            : 0)}
                      </TableCell>

                      <TableCell>
                        {[
                          "Lost/Theft",
                          "Repair",
                          "Pending for Repair",
                          "Disposal",
                        ].reduce(
                          (total, type) =>
                            total +
                            (organizedData[assetType][type]
                              ? organizedData[assetType][type]
                                  .filter((item) =>
                                    [
                                      "Lost/Theft",
                                      "Repair",
                                      "Pending for Repair",
                                      "Disposal",
                                    ].includes(
                                      item.latestTransaction?.transactionType ||
                                        ""
                                    )
                                  )
                                  .reduce(
                                    (sum, item) =>
                                      sum + (item.assetQuantity || 0),
                                    0
                                  )
                              : 0),
                          0
                        )}
                      </TableCell>
                     

                     
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </CardContent>
    </Card>
  );
};

export default ItemTable;
