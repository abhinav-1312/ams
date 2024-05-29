import React, { useState } from "react";
import { Card, CardContent, Typography } from "@mui/material";

interface SummaryCardProps {
  title: string;
  value: any;
  isActive: boolean;
  onClick: () => void;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, onClick, isActive }) => {
  return (
    <Card
      className={`summary-card ${isActive ? "clicked" : ""}`}
      onClick={onClick}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4">{value}</Typography>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
