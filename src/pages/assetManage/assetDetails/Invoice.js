import React, { useRef } from 'react';
import { Container, Grid, Typography, Card, CardContent, Button } from '@mui/material';
import michelin from '../../../assests/images/michelin_logo.jpg';
import './Invoice.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useReactToPrint } from 'react-to-print';


const userName = localStorage.getItem('userName');

let userNameAbbreviation;

if (userName !== null) {
  userNameAbbreviation = userName.slice(0, 3);
} else {
  userNameAbbreviation = ""; // Or set it to some default value if userName is null
}

class Invoice extends React.Component {
  render() {
    const { invoiceData } = this.props;
    const { invoiceType } = this.props;
    const { TxnID } = this.props;
    function getCurrentDateTime() {
      const now = new Date();
      now.setHours(now.getHours() + 5);
      now.setMinutes(now.getMinutes() + 30);

      const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        // hour: "2-digit",
        // minute: "2-digit",
        // second: "2-digit",
        timeZone: "Asia/Kolkata",
      };

      const indianDateTime = new Intl.DateTimeFormat('en-IN', options).format(now);
      return indianDateTime;
    }
    const txnId = TxnID.transactionId    ;
    const DocumentName = userNameAbbreviation + " / " + (
      invoiceType === "INVOICE" ? "INV" :
        invoiceType === "CHALLAN" ? "CHA" :
          invoiceType === "GATEPASS" ? "GATEPASS" : ""
    ) + " / " +  txnId;


    return (
      <div style={{ padding: '1rem' }} >

        {/* Top Left Side */}
        <Grid container spacing={2}>
          <Grid item xs={6} px={'4rem'}>
            <img src={michelin} alt='michelin_logo' />
            <h4 className='invoice_title'>
             Name and Address of Supplier <br /> {TxnID?.fromLocationName}
            </h4>

            <p className='left-invoice-address'>
              {TxnID?.fromLocationAddress}
              <Typography>
                PAN NO : <span className='Invoice-span'></span>
              </Typography>
              <Typography>
                GSTIN/UNIQUE ID :  <span className='Invoice-span'>{TxnID?.fromLocationGstNumber}</span>
              </Typography>
              <Typography>
                Mobile No : <span className='Invoice-span'>{TxnID?.fromLocationMobileNumber} </span>
              </Typography>

            </p>
          </Grid>
          {/* Top Right Side */}
          <Grid item xs={6}>
            <Typography className='Invoice-span'>
              Original for Recipient
            </Typography>
            <Typography>
              Duplicate for Transporter (GOODS Only) Triplicate for Supplier
            </Typography>

            <div className='right-invoice-heading'>
              {invoiceType === 'GATEPASS' ? 'GATEPASS' : invoiceType}
            </div>
            <Typography>
              DOCUMENT NUMBER :  <span className='Invoice-span' style={{ textTransform: 'uppercase' }}>{DocumentName} </span>
            </Typography>
            <Typography>
              DATED : <span className='Invoice-span'>{getCurrentDateTime()}</span>
            </Typography>

            <Typography>
              OTHER REFERENCES: <span className='Invoice-span'>  </span>
            </Typography>
            <Typography>
              PO No :   <span className='Invoice-span'>  </span>
            </Typography>
            <Typography>
              REFERENCES :  <span className='Invoice-span'>  </span>
            </Typography>
            <Typography>
              Vehicle No :   <span className='Invoice-span'>  </span>
            </Typography>
            <Typography>
              LR No :    <span className='Invoice-span'> </span>
            </Typography>
          </Grid>
        </Grid>

        {/* Body Content */}
        <div className='invoice-body'>

          <p className='invoice-text-Georgia'>
            Place of Supply: <span className='Invoice-span'>   {TxnID?.toLocationDescription}</span>
          </p>
          {/* <span className='invoice-text-Georgia'>
            No Commercial value involved in this transaction. Value for declaration purpose only.
          </span> */}


          <div className='invoice-body'>
            <p >
              Name and Address Of Recipient: <span className='Invoice-span'> {TxnID?.toLocationName}</span>
              <br />
              {TxnID?.toLocationAddress}
              <br />
              PAN NO :
              <br />
              GSTIN/UNIQUE ID: <span className='Invoice-span'> {TxnID?.toLocationGstNumber}</span>
              <br />
              Mobile No:<span className='Invoice-span'> {TxnID?.toLocationMobileNumber}</span>
            </p>
          </div>
          <div className='invoice-body-inside'>
            <table className='invoice-table' style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th className='invoice-table-th'>S. No.</th>
                  <th className='invoice-table-th'>Asset Id</th>
                  <th className='invoice-table-th'>Product Description</th>
                  <th className='invoice-table-th'>Item Code</th>
                  <th className='invoice-table-th' >HSN Code</th>
                  <th className='invoice-table-th'>Qty</th>
                  <th className='invoice-table-th'>Rate</th>
                  <th className='invoice-table-th'>Amount</th>
                  <th className='invoice-table-th'>Taxable Value</th>
                  <th className='invoice-table-th'>Rate</th>
                  <th className='invoice-table-th'>Amount</th>
                  <th className='invoice-table-th'>Total</th>
                </tr>
              </thead>
              <tbody>


                <tr key={invoiceData.assetId}>
                  <td className='invoice-table-td'>{1}</td>
                  <td className='invoice-table-td'>{invoiceData.assetId}</td>
                  <td className='invoice-table-td'>{invoiceData.assetName}</td>
                  <td className='invoice-table-td'>{invoiceData.assetTag}</td>
                  <td className='invoice-table-td'>{invoiceData.hsnCode || 'NA'}</td>
                  <td className='invoice-table-td'>{1}</td>
                  <td className='invoice-table-td'>{invoiceData.assetCost || 0}</td>
                  <td className='invoice-table-td'>{(invoiceData.assetCost || 0) * 1}</td>
                  <td className='invoice-table-td'>{(invoiceData.assetCost || 0) * 1}</td>
                  <td className='invoice-table-td'>{(invoiceType === "GATEPASS" || invoiceType === "CHALLAN") ? '0' : '18%'}</td>
                  <td className='invoice-table-td'>{((invoiceData.assetCost || 0) * 18 / 100).toFixed(2)}</td>
                  <td className='invoice-table-td'>{(((invoiceData.assetCost || 0) * 1) + ((invoiceData.assetCost || 0) * 18 / 100)).toFixed(2)}</td>
                </tr>

                <tr>
                  <td className='invoice-table-td' colSpan="5"></td>
                  <td className='invoice-table-td' colSpan="6">Total Amount before Tax</td>
                  <td className='invoice-table-td'>{((invoiceData.assetCost || 0) * 1).toFixed(2)}</td>
                </tr>
                <tr>
                  <td className='invoice-table-td' colSpan="5"></td>
                  <td className='invoice-table-td' colSpan="6">Add : IGST</td>
                  <td className='invoice-table-td'></td>
                </tr>
                <tr>
                  <td className='invoice-table-td' colSpan="5"></td>
                  <td className='invoice-table-td' colSpan="6">Total Amount after Tax</td>
                  <td className='invoice-table-td'>{(((invoiceData.assetCost || 0) * 1) + ((invoiceData.assetCost || 0) * 18 / 100)).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>

          </div>
          <p className='invoice-text-Georgia '>
            Receipt Voucher reference No:
          </p>
        </div>

        <Grid container spacing={2} my={'2rem'}>
          {/* Left Side */}
          <Grid item xs={6}>
            <Typography variant="body1">
              Received the above mentioned goods in good condition
            </Typography>
            <Typography variant="body1">
              CUSTOMERS SIGN & STAMP
            </Typography>
          </Grid>

          {/* Right Side */}
          <Grid item xs={6}>
            <Typography variant="body1" align="center">
              FOR MICHELIN INDIA PRIVATE LIMITED
            </Typography>
            <Typography variant="body1" align="center">
              AUTHORIZED SIGNATORY
            </Typography>
            <Typography variant="body1" align="center">
              Name of the Signatory
            </Typography>
            <Typography variant="body1" align="center">
              Designation/status
            </Typography>
          </Grid>
        </Grid>


        {/* Footer */}
        <div className='footer-invoice'>

          Corporate Address: Michelin India Private Limited, World Trade Center, 5th floor, Tower 4, Dholepatil Farms Rd, EON Free Zone, Kharadi, Pune, Maharashtra - 411014 Registered Office: Michelin India Private Limited, Shyamala Towers, 3rd Floor, 136, Arcot Road, Saligramam, Chennai - 600093
          Michelin India Private Limited ( Formerly known as Michelin India Tamilnadu Tyres Private Limited )      </div>
      </div>
    );
  }
}

export default Invoice;



export const Example = ({ invoiceData, handleModalClose, invoiceType, TxnID }) => {
  console.log("ExAMPLE LOADED")
  const componentRef = useRef();
  const txnId = TxnID.transactionId;
  const DocumentName = userNameAbbreviation + " / " + (
    invoiceType === "INVOICE" ? "INV" :
      invoiceType === "CHALLAN" ? "CHA" :
        invoiceType === "GATEPASS" ? "GATEPASS" : ""
  ) + " / " + txnId;

  const handleDownload = async () => {
    console.log("Handle download called")
    const invoiceContent = componentRef.current;
    // const html = invoiceContent.innerHTML;
    // const blob = new Blob([html], { type: 'application/pdf' });
    // const url = URL.createObjectURL(blob);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = `${DocumentName}.pdf`;
    // a.click();
    // URL.revokeObjectURL(url);

    // const input = document.getElementById('pdf-content'); 
    // Specify the id of the element you want to convert to PDF
    html2canvas(invoiceContent).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 0, 0);
      pdf.save('downloaded-file.pdf'); 
      // Specify the name of the downloaded PDF file
    });

  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  return (
    <Container  >
      <Card>
        <CardContent style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'end', borderBottom: '2px solid green', padding: '1rem' }}>
            <Button variant='contained' onClick={handlePrint} style={{ margin: '10px' }}>Print or Download</Button>
            {/* <Button variant='contained' onClick={handleDownload} style={{ margin: '10px' }}>
              Download
            </Button>             */}
            <Button
              onClick={handleModalClose}
              type="submit"
              variant="outlined"
              color="error"
              style={{ margin: '10px' }}
            >
              {"Close"}
            </Button>
          </div>
          <Invoice invoiceData={invoiceData} ref={componentRef} invoiceType={invoiceType} TxnID={TxnID} />

        </CardContent>
      </Card>
    </Container>
  )
}