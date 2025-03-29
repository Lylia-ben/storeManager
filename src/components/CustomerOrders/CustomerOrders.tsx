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
  onOrdersLoaded: (orders: Order[]) => void;
}

const CustomerOrders: React.FC<CustomerOrdersProps> = ({ customerId, onOrdersLoaded }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await window.electronAPI.fetchOrdersByCustomerId(customerId);
        
        if (!response?.success) {
          throw new Error(response?.message || "Failed to fetch orders");
        }

        const formattedOrders: Order[] = response.data?.map((order: Order) => ({
          ...order,
          id: String(order.id),
          customerId: order.customerId || customerId,
          orderItems: order.orderItems.map(item => ({
            ...item,
            customerQuantity: Number(item.customerQuantity) || 0,
            unitPrice: Number(item.unitPrice) || 0
          })),
          total: Number(order.total) || 0
        })) || [];

        setOrders(formattedOrders);
        onOrdersLoaded(formattedOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchOrders();
    }
  }, [customerId, onOrdersLoaded]);

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
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    
    try {
      const response = await window.electronAPI.deleteOrder(orderId);
      
      if (response.success) {
        const updatedOrders = orders.filter(order => order.id !== orderId);
        setOrders(updatedOrders);
        onOrdersLoaded(updatedOrders);
      }
    } catch (err) {
      console.error("Error deleting order:", err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography color="error" variant="h6" gutterBottom>
          Error Loading Orders
        </Typography>
        <Typography color="textSecondary">{error}</Typography>
        <Button 
          variant="outlined" 
          color="primary" 
          sx={{ mt: 2 }}
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ maxWidth: 800, mx: "auto", mt: 4,marginLeft:"250px" }}>
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