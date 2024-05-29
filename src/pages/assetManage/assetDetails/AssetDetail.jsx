import React, { useState, useEffect, } from "react";
import { Paper, Typography, Button, Box, FormControl, Input, FormHelperText, Modal } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import "./AssetDetailPage.css";
import { Example } from "./Invoice";
import html2canvas from "html2canvas";
const AssetDetailPage = () => {
  const { assetId } = useParams();
  const navigate = useNavigate();
  const [qrCodeImageUrl, setQRCodeImageUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalInvoice, setIsModalInvoice] = useState(false);


  const fetchQRCodeImageUrl = async () => {
    try {
      const response = await fetch(
        `https://asset-management-service.azurewebsites.net/asset-management/generateQRCode?assetId=${assetId}&width=281&height=281`
      );
      if (response.ok) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setQRCodeImageUrl(imageUrl);
      } else {
        console.error("Failed to fetch QR code image");
      }
    } catch (error) {
      console.error("Error fetching QR code image:", error);
    }
  };

  useEffect(() => {
    fetchQRCodeImageUrl()
  }, [])
  const InoviceModal = () => {

    setIsModalInvoice(true);
  };
  const formatDateToIST = (dateString) => {
    if (!dateString) {
      return "";
    }

    const options = {
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

  const calculateAgingDays = (assignedDate) => {
    if (!assignedDate) {
      const formatDateToIST = (dateString) => {
        if (!dateString) {
          return "";
        }

        const options = {
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

      const calculateAgingDays = (assignedDate) => {
        if (!assignedDate) {
          return "";
        }

        const assignedDateObj = new Date(assignedDate);
        const currentDate = new Date();
        const timeDifference = currentDate.getTime() - assignedDateObj.getTime();
        const agingDays = Math.floor(timeDifference / (1000 * 3600 * 24)); // Calculate days

        return agingDays.toString();
      };
      return "";
    }


    const assignedDateObj = new Date(assignedDate);
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - assignedDateObj.getTime();
    const agingDays = Math.floor(timeDifference / (1000 * 3600 * 24)); // Calculate days

    return agingDays.toString();
  };
  const handleFileChange = (event) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  useEffect(() => {
    async function uploadImage() {
      if (imageFile) {
        try {
          const formData = new FormData();
          formData.append("file", imageFile);

          const response = await fetch(
            `https://asset-management-service.azurewebsites.net/asset-management/uploadDocument?assetId=${assetId}&docType=Asset`,
            {
              method: "POST",
              body: formData,
            }
          );

          if (response.ok) {
            alert("Image updated");
          }
        } catch (error) {
          console.log(error);
        }
      }
    }

    uploadImage();
  }, [imageFile, assetId]);

  useEffect(() => {
    const apiUrl = `https://asset-management-service.azurewebsites.net/asset-management/getAsset?assetId=${assetId}`;
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setAsset(data.responseData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching asset data:", error);
        setLoading(false);
      });
  }, [assetId]);

  const handleModalClose = () => {
    setIsModalInvoice(false);
  };


  const goBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!asset) {
    return <div>Error loading asset data.</div>;
  }

  const assetImageUrl = `https://asset-management-service.azurewebsites.net/asset-management/downloadDocument?assetId=${assetId}&docType=Asset`;
  const assetsellerInvoiceUrl = `https://asset-management-service.azurewebsites.net/asset-management/downloadDocument?assetId=${assetId}&docType=Invoice`;

  const assetSellerInvoiceUrl = `https://asset-management-service.azurewebsites.net/asset-management/downloadDocument?assetId=${asset.assetId}&docType=Invoice`;

  const handleDownloadClick = async () => {
    try {
      // Fetch the image as a blob
      const response = await fetch(assetSellerInvoiceUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'image/png', // Set the appropriate image content type
        },
        responseType: 'blob', // Set the responseType to 'blob'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
        alert('Error: Unable to download the file. Please try again later.');
      }

      // Convert the blob to a blob URL
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      // Create a temporary anchor element
      const anchor = document.createElement('a');
      anchor.href = blobUrl;
      anchor.download = `Asset_${asset.assetId}_Invoice.png`; // You can customize the downloaded file name and format if needed
      anchor.click();

      // Revoke the blob URL after the download is initiated
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error:', error);
      alert('Error: Unable to download the file. Please try again later.');
    }
  };

  const downloadQRCode = (format) => {
    const qrCodeImage = document.querySelector(".asset-detail-image2");

    html2canvas(qrCodeImage).then((canvas) => {
      const imgData = canvas.toDataURL(`image/${format}`);
      const a = document.createElement("a");
      a.href = imgData;
      a.download = `qr_code.${format}`;
      a.click();
    });
  };
  return (
    <div className="asset-detail-container">
      <Paper className="asset-detail-card" elevation={3}>
        <h1> Asset Details</h1>

        <div className='astdetailImg'>
          <div className='astImage'>
            <img
              src={assetImageUrl}
              alt={`Asset ${asset.assetId}`}
              className="asset-detail-image1"
            />
          </div>

          <div className="qrdiv">
            {qrCodeImageUrl ? (
              <img
                src={qrCodeImageUrl}
                alt={`QR Code for Asset ${asset.assetId}`}
                className="asset-detail-image2"
              />
            ) : (
              <Box className="qr-code-placeholder">
                <Typography variant="body2">
                  Your QR code will appear here
                </Typography>
              </Box>
            )}
            <div>
              {/* <Button variant="contained" color="primary" onClick={fetchQRCodeImageUrl}>
                Generate QR
              </Button>*/}
              <Button
                variant="contained"
                color="primary"
                onClick={() => downloadQRCode("png")}
              >
                Download QR as png
              </Button>
              {/*<Button variant="contained" color="primary" onClick={InoviceModal}>
                Generate Invoice
              </Button>*/}
            </div>
          </div>
        </div>
        <Modal open={isModalInvoice} onClose={handleModalClose} style={{ overflow: 'scroll', }} >
          <Example invoiceData={asset} handleModalClose={handleModalClose} />
        </Modal>

        <div className="asset-detail-field-container">

          <div>
            <Typography variant="h6" className="asset-detail-field">
              Asset Id: {asset.assetId}
            </Typography>
            <Typography variant="h6" className="asset-detail-field">
              Asset Name: {asset.assetName}
            </Typography>
            <FormControl className="asset-picture-section" fullWidth>
              <Input
                type="file"
                id="asset-picture"
                name="assetImgfile"
                inputProps={{ accept: "image/*" }}
                onChange={handleFileChange}
              />
              {imageFile && (
                <img
                  className="asset-picture-preview"
                  src={URL.createObjectURL(imageFile)}
                  alt="Asset"
                />
              )}
              <FormHelperText>Upload an image for the asset.</FormHelperText>
            </FormControl>
            <Typography variant="h6" className="asset-detail-field">
              Barcode: {asset.assetTag}
            </Typography>

            <Typography variant="h6" className="asset-detail-field">
              Type: {asset.assetType}
            </Typography>
            <Typography variant="h6" className="asset-detail-field">
              Quantity: {asset.assetQuantity || 0}
            </Typography>

            <Typography variant="h6" className="asset-detail-field">
              Brand: {asset.assetBrand}
            </Typography>

            <Typography variant="h6" className="asset-detail-field">
              Status: {asset.assetStatus ? "Active" : "Inactive"}
            </Typography>
          </div>
          <div>
            <Typography variant="h6" className="asset-detail-field">
              Current FT/FOM: {asset.issuedUserName}
            </Typography>
            <Typography variant="h6" className="asset-detail-field">
              Asset Cost: {asset.assetCost}
            </Typography>
            <Typography variant="h6" className="asset-detail-field">
              HSN Code: {asset.hsnCode}
            </Typography>
            <Typography variant="h6" className="asset-detail-field">
              Received From Supplier: {asset.supplier}
            </Typography>
            <Typography variant="h6" className="asset-detail-field">
              Current Location: {asset.locationName}
            </Typography>
            <Typography variant="h6" className="asset-detail-field">
              Latest Transaction: {asset?.latestTransaction?.transactionType}
            </Typography>
            <Typography variant="h6" className="asset-detail-field">
              Assigned Date: {formatDateToIST(asset.assignedDate)}
            </Typography>
            <Typography variant="h6" className="asset-detail-field">
              Aging Days:  {calculateAgingDays(asset.assignedDate)}
            </Typography>
            <br />
            <Button variant="contained" color="primary" onClick={handleDownloadClick}>Download  Vendor's invoice</Button>

          </div>
        </div>

        <Button
          variant="contained"
          color="primary"
          className="asset-detail-button"
          onClick={goBack}
        >
          Go Back
        </Button>
      </Paper>
    </div>
  );
};

export default AssetDetailPage;
