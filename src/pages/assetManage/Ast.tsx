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
  fetchAssets,
  addAsset,
  updateAsset,
  activateAsset,
  deactivateAsset,
} from "../../store/actions/assetActions"; // Import your asset-related actions here
import { Asset } from "./AstInterface";
import AssetForm from "./AstForm";
import AssetTable from "./AstTable";

const AssetManagement: React.FC = () => {
  const assetList = useSelector((state: RootState) => state.asset.assets); // Make sure to replace 'state.location.locations' with 'state.asset.assets'
  const dispatch = useDispatch<ThunkDispatch<RootState, null, any>>();

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assetFormData, setAssetFormData] = useState<Asset | null>(null);

  useEffect(() => {
    dispatch(fetchAssets());
  }, [dispatch]);

  const addNewAsset = () => {
    setAssetFormData(null);
    setIsModalOpen(true);
  };

  const editAsset = (asset: Asset) => {
    setAssetFormData(asset);
    setIsModalOpen(true);
  };

  const toggleAssetStatus = async (assetId: number, status: boolean) => {
    try {
      if (status) {
        dispatch(activateAsset(assetId));
      } else {
        dispatch(deactivateAsset(assetId));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setAssetFormData(null);
  };

  const handleFormSubmit = async (asset: Asset) => {
    try {
      if (assetFormData === null) {
        dispatch(addAsset(asset));
      } else {
        dispatch(updateAsset(asset));
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredAssetList = assetList.filter((asset) => {
    const assetId = asset.assetId?.toString() || "";
    const assetName = asset.assetName?.toLowerCase() || "";
    const assetTag = asset.assetTag?.toLowerCase() || "";
    const searchTermLower = searchTerm.toLowerCase();
  
    // Check if the searchTerm matches any of the individual properties or the combined values
    return (
      assetId.includes(searchTermLower) ||
      assetName.includes(searchTermLower) ||
      assetTag.includes(searchTermLower) ||
      `${assetId},${assetName},${assetTag}`.includes(searchTermLower)
    );
  });
  
  

  return (
    <div>
      <h1>Asset Management</h1>
      <Card>
        <CardContent>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <TextField
              label="Search Asset"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={addNewAsset}
            >
              Add Asset
            </Button>
          </div>
          <br />
          {assetList.length === 0 ? (
            <>
            <SkeletonTable />
            </>

          ) : (
            <>
            <AssetTable
              assetList={filteredAssetList}
              editAsset={editAsset}
              toggleAssetStatus={toggleAssetStatus}
              />
              </>
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
                  {assetFormData ? "Edit Asset" : "Add Asset"}
                </Typography>
                <Button color="error" onClick={handleModalClose}>
                  <Close />
                </Button>
              </div>
              <br />
              <AssetForm
                asset={assetFormData}
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

export default AssetManagement;
