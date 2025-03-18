import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Paper, TextField } from "@mui/material";

interface OrderTableProps {
  products: { id: string; name: string; quantity: number; unitPrice: number; shape: string; width?: number; height?: number; sideLength?: number; radius?: number }[];
  onQuantityChange: (id: string, quantity: number) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({ products, onQuantityChange }) => {
  // Calculate total sum
  const totalSum = products.reduce((sum, p) => sum + p.quantity * p.unitPrice, 0);


  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Product Name</TableCell>
            <TableCell>Dimension</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Unit Price</TableCell>
            <TableCell>Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {products.map((product) => {
          console.log("Product in table:", product); // Debugging
            return (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>
                  {product.shape === "RectangularProduct" && product.width && product.height
                    ? `W: ${product.width}, H: ${product.height}`
                    : product.shape === "SquareProduct" && product.sideLength
                    ? `Side: ${product.sideLength}`
                    : product.shape === "CircularProduct" && product.radius
                    ? `Radius: ${product.radius}`
                    : "N/A"}
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={product.quantity}
                    onChange={(e) => onQuantityChange(product.id, Number(e.target.value))}
                    inputProps={{ min: 1 }}
                  />
                </TableCell>
                <TableCell>{product.unitPrice.toFixed(2)}</TableCell>
                <TableCell>{(product.quantity * product.unitPrice).toFixed(2)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Total Sum:</TableCell>
            <TableCell>{totalSum.toFixed(2)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default OrderTable;
