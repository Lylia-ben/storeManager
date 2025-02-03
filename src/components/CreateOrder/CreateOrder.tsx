import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import CustomerSelector from "../CustomerSelector/CustomerSelector";
import ProductShapeSelector from "../ShapeSelector/ShapeSelector";
import ProductSelector from "../ProductSelector/ProductSelector";
import OrderTable from "../OrdersTable/OrdersTable";

const CreateOrder: React.FC = () => {
  const [customerId, setCustomerId] = useState("");
  const [shape, setShape] = useState<"Circular" | "Square" | "Rectangular">("Circular");
  const [products, setProducts] = useState([]);

  const handleSaveOrder = async () => {
    await window.electronAPI.createOrder({ customerId, products });
  };

  return (
    <Box sx={{ marginLeft:"250px", display: "flex", flexDirection: "column" }}>
      <CustomerSelector onSelect={setCustomerId} />
      <ProductShapeSelector onShapeSelect={setShape} />
      <ProductSelector shape={shape} onSelect={(product) => setProducts([...products, { ...product, quantity: 1 }])} />
      <OrderTable products={products} setProducts={setProducts} />
      <Button variant="contained" onClick={handleSaveOrder}>
        Save Order
      </Button>
    </Box>
  );
};

export default CreateOrder;
