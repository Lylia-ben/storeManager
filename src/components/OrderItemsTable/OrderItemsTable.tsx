import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  TableFooter,
  TablePagination,
  Typography,
} from "@mui/material";

interface OrderItem {
  id: string;
  name: string;
  shape: string;
  dimension: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface OrderItemTableProps {
  orderItems: OrderItem[];
  onDelete: (id: string) => void;
}

const OrderItemsTable: React.FC<OrderItemTableProps> = ({ orderItems, onDelete }) => {
  const total = orderItems.reduce((acc, item) => acc + item.totalPrice, 0);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#1565c0" }}>
            <TableCell sx={{ color: "white" }}>Product Name</TableCell>
            <TableCell sx={{ color: "white" }}>Shape</TableCell>
            <TableCell sx={{ color: "white" }}>Dimension</TableCell>
            <TableCell sx={{ color: "white" }}>Quantity</TableCell>
            <TableCell sx={{ color: "white" }}>Unit Price</TableCell>
            <TableCell sx={{ color: "white" }}>Total Price</TableCell>
            <TableCell sx={{ color: "white" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orderItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.shape}</TableCell>
              <TableCell>{item.dimension}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.unitPrice}</TableCell>
              <TableCell>{item.totalPrice}</TableCell>
              <TableCell>
                <Button variant="contained" color="error" onClick={() => onDelete(item.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5} align="right">
              <Typography variant="h6">Total</Typography>
            </TableCell>
            <TableCell colSpan={2}>
              <Typography variant="h6">{total}</Typography>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default OrderItemsTable;
