import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Box, Button, Grid, Paper, Typography, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from "@mui/material";

interface CustomerDataProps {
  customer: Customer;
}

const CustomerData: React.FC<CustomerDataProps> = ({ customer }) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState(customer.status); // Track local status

  // Handle status change
  const handleStatusChange = async (event: SelectChangeEvent<string>) => {
    const newStatus = event.target.value;

    try {
      const response = await window.electronAPI.toggleCustomerDebt(customer.id);
      if (response.success) {
        setStatus(response.status); // Update state
      } else {
        console.error("Failed to update status:", response.message);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: "auto", mt: 4, marginLeft: "300px" }}>
      <Grid container spacing={2} alignItems="center">
        {/* Avatar Section */}
        <Grid item>
          <Avatar sx={{ width: 70, height: 70, bgcolor: "primary.main", fontSize: 28 }}>
            {customer.name.charAt(0).toUpperCase()}
          </Avatar>
        </Grid>

        {/* Customer Info */}
        <Grid item xs>
          <Typography variant="h6" fontWeight="bold">
            {customer.name}
          </Typography>
          <Typography color="textSecondary">Email: {customer.email}</Typography>
          <Typography color="textSecondary">Address: {customer.address}</Typography>
          <Typography color="textSecondary">Phone: {customer.phoneNumber}</Typography>

          {/* Status Selector */}
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel>Status</InputLabel>
            <Select value={status} onChange={handleStatusChange} label="Status">
              <MenuItem value="has debt">Has Debt</MenuItem>
              <MenuItem value="no debt">No Debt</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Edit Button */}
        <Grid item>
          <Button variant="contained" color="primary" size="small" onClick={() => navigate(`/main/edit-customer/${customer.id}`)}>
            Edit
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CustomerData;
