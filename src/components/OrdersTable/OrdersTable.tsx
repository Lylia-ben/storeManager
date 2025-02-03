import React from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, TextField, Button } from "@mui/material";

interface OrderTableProps {
  products: (Product & { quantity: number })[];
  setProducts: (products: (Product & { quantity: number })[]) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({ products, setProducts }) => {
  const handleQuantityChange = (index: number, value: number) => {
    const updatedProducts = [...products];
    updatedProducts[index].quantity = value;
    setProducts(updatedProducts);
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Product Name</TableCell>
          <TableCell>Dimensions</TableCell>
          <TableCell>Quantity</TableCell>
          <TableCell>Unit Price</TableCell>
          <TableCell>Total</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {products.map((product, index) => (
          <TableRow key={product.id}>
            <TableCell>{product.name}</TableCell>
            <TableCell>{product.shape === "Circular" ? `Radius: ${product.radius}` : product.shape === "Rectangular" ? `W: ${product.width}, H: ${product.height}` : `Side: ${product.sideLength}`}</TableCell>
            <TableCell>
              <TextField type="number" value={product.quantity} onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))} />
            </TableCell>
            <TableCell>{product.unitPrice}</TableCell>
            <TableCell>{product.unitPrice * product.quantity}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default OrderTable;
