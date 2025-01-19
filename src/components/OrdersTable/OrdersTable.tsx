import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper } from "@mui/material";

interface Order {
  id: string;
  total: number;
  status: string;
}

interface OrdersTableProps {
  orders: Order[];
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orders }) => {
  const handleExport = (orderId: string) => {
    console.log("Exporting order:", orderId);
    // Add export logic here
  };

  const handleDelete = (orderId: string) => {
    console.log("Deleting order:", orderId);
    // Add delete logic here
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#1565c0" }}>
            <TableCell sx={{ color: "white" }}>Order ID</TableCell>
            <TableCell sx={{ color: "white" }}>Total</TableCell>
            <TableCell sx={{ color: "white" }}>Status</TableCell>
            <TableCell sx={{ color: "white" }}>Operations</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.total}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleExport(order.id)}
                  sx={{ mr: 1 }}
                >
                  Export
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDelete(order.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrdersTable;
