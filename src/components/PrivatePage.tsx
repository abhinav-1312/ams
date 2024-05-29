import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';

const PrivatePage: React.FC = () => {
  return (
    <div className="private-page">
      <div className="private-page-content">
        <h2>Access Denied</h2>
        <p>You do not have permission to view this page.</p>
        <Button component={Link} to="/" variant="contained" color="primary">
          Go Back to Home
        </Button>
      </div>
    </div>
  );
};

export default PrivatePage;
