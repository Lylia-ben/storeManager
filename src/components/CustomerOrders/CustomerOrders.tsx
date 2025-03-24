import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  CircularProgress,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";

interface CustomerOrdersProps {
  customerId: string;
}

const CustomerOrders: React.FC<CustomerOrdersProps> = ({ customerId }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Customer ID in frontend:", customerId); // Debugging line
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await window.electronAPI.fetchOrdersByCustomerId(customerId);
        console.log("API Response:", response); // Debugging line

        if (!response || !response.success) {
          setError(response?.message || "Failed to fetch orders");
          return;
        }

        const formattedOrders: Order[] = response.data.map((order: any) => ({
          id: String(order.id || order._id),
          customerId: order.customerId || "", // ✅ Use `customerId`
          orderItems: Array.isArray(order.orderItems) ? order.orderItems : [],
          total: !isNaN(order.total) ? Number(order.total) : 0, // ✅ Use `total`
          status: order.status === "paid" ? "paid" : "not paid",
          createdAt: order.createdAt || new Date().toISOString(),
          updatedAt: order.updatedAt || new Date().toISOString(),
        }));

        setOrders(formattedOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("An error occurred while fetching orders");
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchOrders();
    }
  }, [customerId]);

  const toggleOrderStatus = async (orderId: string, currentStatus: "paid" | "not paid") => {
    try {
      const newStatus = currentStatus === "paid" ? "not paid" : "paid";
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
      );
      await window.electronAPI.toggleOrderStatus(orderId); // ✅ Use `toggleOrderStatus`
    } catch (err) {
      console.error("Error toggling order status:", err);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      setOrders((prev) => prev.filter((order) => order.id !== orderId));
      await window.electronAPI.deleteOrder(orderId);
    } catch (err) {
      console.error("Error deleting order:", err);
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
    <TableContainer component={Paper} sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Order ID</strong></TableCell>
            <TableCell><strong>Total</strong></TableCell>
            <TableCell><strong>Status</strong></TableCell>
            <TableCell><strong>Operations</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell> 
                  <TableCell>
                    <Select
                      value={order.status}
                      size="small"
                      onChange={(e) => toggleOrderStatus(order.id, e.target.value as "paid" | "not paid")}
                    >
                      <MenuItem value="not paid">Not Paid</MenuItem>
                      <MenuItem value="paid">Paid</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      sx={{ mr: 1 }}
                      onClick={() => navigate(`/main/order-details/${order.id}`)}
                    >
                      Details
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleDeleteOrder(order.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <>
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No orders found.
                  </TableCell>
                </TableRow>
              </>
            )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CustomerOrders;