import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Box,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";

const OrderDetail = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await window.electronAPI.fetchOrderById(orderId);
        if (response.success && response.data) {
          setOrder(response.data);
        } else {
          setError(response.message || "Failed to fetch order details");
        }
      } catch (err) {
        setError("Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // Handle deleting an item from the order
  const handleDeleteItem = async (itemId: string) => {
    if (!order) return;

    try {
      const response = await window.electronAPI.deleteOrderItem({
        orderId: order.id,
        itemId,
      });

      if (response.success && response.data) {
        setOrder(response.data); // Update the order state
      } else {
        setError(response.message || "Failed to delete item from order");
      }
    } catch (err) {
      setError("Failed to delete item from order");
    }
  };

  // Handle updating the order status
  const handleStatusChange = async (event: SelectChangeEvent<"paid" | "not paid">) => {
    if (!order) return;

    const newStatus = event.target.value as "paid" | "not paid";
    try {
      const response = await window.electronAPI.toggleOrderPaid(order.id);
      if (response.success) {
        setOrder((prevOrder) => ({
          ...prevOrder!,
          status: newStatus,
        }));
      } else {
        setError(response.message || "Failed to update order status");
      }
    } catch (err) {
      setError("Failed to update order status");
    }
  };

  // Handle editing the order
  const handleEditOrder = () => {
    navigate(`/main/edit-order/${orderId}`);
  };

  // Loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert severity="error" sx={{ margin: 2 }}>
        {error}
      </Alert>
    );
  }

  // No order found
  if (!order) {
    return (
      <Alert severity="warning" sx={{ margin: 2 }}>
        Order not found.
      </Alert>
    );
  }

  return (
    <Box sx={{ padding: 3 ,marginLeft:"250px"}}>
      <Typography variant="h4" gutterBottom>
        Order Details
      </Typography>

      {/* Order Items Table */}
      <TableContainer component={Paper} sx={{ marginBottom: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>Shape</TableCell>
              <TableCell>Dimensions</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Unit Price</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Operations</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order.orderItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.productName}</TableCell>
                <TableCell>{item.shape}</TableCell>
                <TableCell>{item.dimensions}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                <TableCell>${item.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Total Price */}
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="h6">
          <strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}
        </Typography>
      </Box>

      {/* Order Status */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginBottom: 2 }}>
        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={order.status}
            onChange={handleStatusChange}
            label="Status"
          >
            <MenuItem value="paid">Paid</MenuItem>
            <MenuItem value="not paid">Not Paid</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Edit Order Button */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleEditOrder}
        >
          Edit Order
        </Button>
      </Box>
    </Box>
  );
};

export default OrderDetail;