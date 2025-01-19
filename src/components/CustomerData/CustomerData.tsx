import React from "react";
import { Box, Typography, Avatar, Paper } from "@mui/material";

interface CustomerDataProps {
  profileImage: string;
  name: string;
  address: string;
  email: string;
  phoneNumber: string;
}

const CustomerData: React.FC<CustomerDataProps> = ({ profileImage, name, address, email, phoneNumber }) => {
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4, display: "flex", alignItems: "center" }}>
      <Avatar
        src={profileImage}
        alt={name}
        sx={{
          width: 100,
          height: 100,
          mr: 3,
        }}
      />
      <Box>
        <Typography variant="h5" fontWeight="bold">
          {name}
        </Typography>
        <Typography>{address}</Typography>
        <Typography>{email}</Typography>
        <Typography>{phoneNumber}</Typography>
      </Box>
    </Paper>
  );
};

export default CustomerData;
