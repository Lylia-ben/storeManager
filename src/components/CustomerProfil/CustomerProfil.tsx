import React from "react";
import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import OrderItemsTable from "../OrderItemsTable/OrderItemsTable";

const CustomerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Access the dynamic ID from the route
  const orders = useSelector((state: any) => state.orders); // Access orders from Redux store

  // Filter orders by the selected customer ID
  const customerOrders = orders.filter((order: any) => order.customerId === id);

  return (
    <Box>
      <Typography variant="h5">Orders for Customer {id}</Typography>
      <OrderItemsTable
        orderItems={customerOrders}
        onDelete={(orderId) => console.log("Delete order with ID:", orderId)}
      />
    </Box>
  );
};

export default CustomerProfile;
