import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // ✅ Import useParams
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
} from "@mui/material";

const OrderDetails: React.FC = () => {
  const { orderId } = useParams(); // ✅ No generic type needed in TypeScript
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) return; // ✅ Ensure orderId is valid

      try {
        setLoading(true);
        const response = await window.electronAPI.fetchOrderById(orderId);

        if (response.success) {
          setOrder(response.data as Order);
        } else {
          setError(response.message || "Failed to fetch order details");
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
    <TableContainer component={Paper} sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      <Typography variant="h5" textAlign="center" mt={2}>
        Order Details - {order?.id}
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Product</strong></TableCell>
            <TableCell><strong>Quantity</strong></TableCell>
            <TableCell><strong>Unit Price</strong></TableCell>
            <TableCell><strong>Subtotal</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {order?.orderItems.map((product) => (
            <TableRow key={product.productId}>
              <TableCell>{product.productName}</TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell>${product.unitPrice.toFixed(2)}</TableCell>
              <TableCell>${(product.quantity * product.unitPrice).toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}><strong>Total:</strong></TableCell>
            <TableCell><strong>${order?.totalPrice.toFixed(2)}</strong></TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={3}><strong>Status:</strong></TableCell>
            <TableCell>
              {order?.status === "paid" ? "Paid ✅" : "Not Paid ❌"}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default OrderDetails;
