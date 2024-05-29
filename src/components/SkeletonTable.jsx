import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Skeleton } from "@mui/material";
import { css } from "@emotion/react"; // Import Emotion CSS function
import styles from "./SkeletonTableStyles.css"; // Import your CSS file

const SkeletonTable = () => {
  const skeletonCellStyle = css`
    height: 24px; /* Adjust the height as needed */
  `;

  // Set the number of skeleton rows
  const numSkeletonRows = 10; // Change this as needed

  return (
    <TableContainer component={Paper} className={`${styles.tableContainer} ${styles.root}`}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell className={`${styles.skeletonCell} ${styles.headerCell}`}>
              <Skeleton animation="wave" css={skeletonCellStyle} className={styles.skeletonCellContent} />
            </TableCell>
            <TableCell className={`${styles.skeletonCell} ${styles.headerCell}`}>
              <Skeleton animation="wave" css={skeletonCellStyle} className={styles.skeletonCellContent} />
            </TableCell>
            <TableCell className={`${styles.skeletonCell} ${styles.headerCell}`}>
              <Skeleton animation="wave" css={skeletonCellStyle} className={styles.skeletonCellContent} />
            </TableCell>
            <TableCell className={`${styles.skeletonCell} ${styles.headerCell}`}>
              <Skeleton animation="wave" css={skeletonCellStyle} className={styles.skeletonCellContent} />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Create skeleton rows */}
          {Array.from({ length: numSkeletonRows }, (_, index) => (
            <TableRow key={index}>
              <TableCell className={styles.skeletonCell}>
                <Skeleton animation="wave" css={skeletonCellStyle} className={styles.skeletonCellContent} />
              </TableCell>
              <TableCell className={styles.skeletonCell}>
                <Skeleton animation="wave" css={skeletonCellStyle} className={styles.skeletonCellContent} />
              </TableCell>
              <TableCell className={styles.skeletonCell}>
                <Skeleton animation="wave" css={skeletonCellStyle} className={styles.skeletonCellContent} />
              </TableCell>
              <TableCell className={styles.skeletonCell}>
                <Skeleton animation="wave" css={skeletonCellStyle} className={styles.skeletonCellContent} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SkeletonTable;
