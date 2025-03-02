import React from "react";
import { Avatar, Box, Button, Grid, Paper, Typography } from "@mui/material";

interface CustomerDataProps {
  customer: Customer;
}

const CustomerData: React.FC<CustomerDataProps> = ({ customer }) => {
  console.log(customer);

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: "auto", mt: 4 ,marginLeft:"300px"}}>
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
          <Typography color={customer.status === "has debt" ? "error" : "success.main"}>
            Status: {customer.status === "has debt" ? "Has Debt" : "No Debt"}
          </Typography>
        </Grid>

        {/* Edit Button */}
        <Grid item>
          <Button variant="contained" color="primary" size="small">
            Edit
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CustomerData;
