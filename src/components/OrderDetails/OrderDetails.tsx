import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Select,
  MenuItem,
  SelectChangeEvent,
  Button,
} from "@mui/material";

const OrderDetails: React.FC = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) return;

      try {
        setLoading(true);
        const response = await window.electronAPI.fetchOrderById(orderId);

        if (response.success && response.data) {
          setOrder(response.data as Order);
          console.log(order)
        } else {
          setError("Failed to fetch order details");
        }
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError("An error occurred while fetching order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleStatusChange = async (event: SelectChangeEvent<string>) => {
    if (!order || !orderId) return;

    try {
      const response = await window.electronAPI.toggleOrderPaid(orderId);
      

      if (response.success) {
        setOrder((prev) => (prev ? { ...prev, status: response.status } : prev));
      } else {
        console.error("Failed to update order status:", response.message);
      }
    } catch (error) {
      console.error("Error toggling order status:", error);
    }
  };

  const renderDimensions = (shape: string, dimensions: string) => {
    const dimObj: { [key: string]: string } = Object.fromEntries(
      dimensions.split(", ").map((dim) => dim.split(": "))
    );

    switch (shape) {
      case "RectangularProduct":
        return `W: ${dimObj["Width"]}, H: ${dimObj["Height"]}`;
      case "CircularProduct":
        return `R: ${dimObj["Radius"]}`;
      case "SquareProduct":
        return `Side: ${dimObj["Side"]}`;
      default:
        return "N/A";
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" textAlign="center" mt={4}>
        {error}
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ maxWidth: 800, mx: "auto", mt: 4, p: 2,marginLeft:"250px" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">
          Order Details - {order?.id}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(`/main/edit-order/${orderId}`)}
        >
          Edit Order
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Product</strong></TableCell>
            <TableCell><strong>Shape</strong></TableCell>
            <TableCell><strong>Dimensions</strong></TableCell>
            <TableCell><strong>Quantity</strong></TableCell>
            <TableCell><strong>Unit Price</strong></TableCell>
            <TableCell><strong>Subtotal</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {order?.orderItems.map((product, index) => (
            <TableRow key={index}>
              <TableCell>{product.productName}</TableCell>
              <TableCell>{product.shape}</TableCell>
              <TableCell>{renderDimensions(product.shape, product.dimensions)}</TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell>${product.unitPrice.toFixed(2)}</TableCell>
              <TableCell>${(product.quantity * product.unitPrice).toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5}><strong>Total:</strong></TableCell>
            <TableCell><strong>${order?.totalPrice.toFixed(2)}</strong></TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={5}><strong>Status:</strong></TableCell>
            <TableCell>
              <Select
                value={order?.status || "pending"}
                onChange={handleStatusChange}
                sx={{ minWidth: 120 }}
              >
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="not paid">Not Paid</MenuItem>
              </Select>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default OrderDetails;
