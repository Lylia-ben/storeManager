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

interface Order {
  id: string;
  total: number;
  status: "paid" | "not paid";
}

interface CustomerOrdersProps {
  customerId: string;
  total: number;
  status: "has debt" | "no debt";
}

const CustomerOrders: React.FC<CustomerOrdersProps> = ({ customerId }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await window.electronAPI.fetchOrdersByCustomerId(customerId);

        console.log("API Response:", response);

        if (response.success && Array.isArray(response.data)) {
          const validOrders: Order[] = response.data
            .map((order: any) => ({
              id: String(order.id),
              total: Number(order.totalPrice),
              status: order.status as "paid" | "not paid",
            }))
            .filter((order) => order.id && !isNaN(order.total));

          setOrders(validOrders);
        } else {
          setError(response.message || "Failed to fetch orders");
        }
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

  // Function to toggle the order status
  const toggleOrderStatus = async (orderId: string, currentStatus: "paid" | "not paid") => {
    try {
      await window.electronAPI.toggleOrderPaid(orderId);

      // Optimistically update UI
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? { ...order, status: currentStatus === "paid" ? "not paid" : "paid" }
            : order
        )
      );
    } catch (err) {
      console.error("Error toggling order status:", err);
    }
  };
  // Function to delete the order
  const handleDeleteOrder = async (orderId: string) => {
    try {
      await window.electronAPI.deleteOrder(orderId);
  
      // ✅ Remove the deleted order from the UI
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
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
    <TableContainer component={Paper} sx={{ maxWidth: 800, mx: "auto", mt: 4, marginLeft: "300px" }}>
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
                    onChange={() => toggleOrderStatus(order.id, order.status)}
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
            <TableRow>
              <TableCell colSpan={4} align="center">
                No orders found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CustomerOrders;
