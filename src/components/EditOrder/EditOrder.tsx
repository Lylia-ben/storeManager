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
  TextField,
} from "@mui/material";

const EditOrder = () => {
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
          console.log("Fetched Order:", response.data); // Debugging
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

  // Handle quantity change
  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (!order) return;
    setOrder((prevOrder) => ({
      ...prevOrder!,
      orderItems: prevOrder!.orderItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ),
    }));
  };

  // Handle deleting an item
  const handleDeleteItem = (itemId: string) => {
    if (!order) return;
    setOrder((prevOrder) => ({
      ...prevOrder!,
      orderItems: prevOrder!.orderItems.filter((item) => item.id !== itemId),
    }));
  };

  // Handle saving the updated order
  const handleSaveOrder = async () => {
    if (!order) return;

    try {
      const updatedOrderItems = order.orderItems.map((item) => ({
        id: item.id, // ✅ Required
        productName: item.productName, // ✅ Required
        shape: item.shape, // ✅ Required
        dimensions: item.dimensions, // ✅ Required
        quantity: item.quantity, // ✅ Required
        unitPrice: item.unitPrice, // ✅ Required
        total: item.quantity * item.unitPrice, // ✅ Ensure total is updated
      }));

      console.log("Updated Order Items:", updatedOrderItems); // Debugging

      const response = await window.electronAPI.updateOrder(order.id, updatedOrderItems);
      if (response.success) {
        navigate(`/main/order-details/${order.id}`); // Redirect to order details page
      } else {
        setError(response.message || "Failed to update order");
      }
    } catch (err) {
      setError("Failed to update order");
    }
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
    <Box sx={{ padding: 3, marginLeft: "250px" }}>
      <Typography variant="h4" gutterBottom>
        Edit Order
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
                <TableCell>
                  <TextField
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                    inputProps={{ min: 1 }}
                    size="small"
                  />
                </TableCell>
                <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                <TableCell>${(item.unitPrice * item.quantity).toFixed(2)}</TableCell>
                <TableCell>
                  <Button variant="contained" color="error" onClick={() => handleDeleteItem(item.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Save Button */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button variant="contained" color="primary" onClick={handleSaveOrder}>
          Save Order
        </Button>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default EditOrder;