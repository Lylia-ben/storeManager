import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import CustomerSelector from "../CustomerSelector/CustomerSelector";
import ProductShapeSelector from "../ShapeSelector/ShapeSelector";
import ProductSelector from "../ProductSelector/ProductSelector";
import OrderTable from "../OrdersTable/OrdersTable";

const CreateOrder: React.FC = () => {
  const [customerId, setCustomerId] = useState("");
  const [shape, setShape] = useState<"Circular" | "Square" | "Rectangular">("Circular");
  const [products, setProducts] = useState<(Product & { quantity: number; unitPrice: number })[]>([]);

  // Calculate the total price of the order
  const totalAmount = products.reduce((sum, product) => sum + product.unitPrice * product.quantity, 0);

  const handleProductSelect = (selectedProduct: Product) => {
    setProducts((prevProducts) => {
      const existingProduct = prevProducts.find((p) => p.id === selectedProduct.id);
      if (existingProduct) {
        return prevProducts.map((p) =>
          p.id === selectedProduct.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prevProducts, { ...selectedProduct, quantity: 1, unitPrice: selectedProduct.unitPrice }];
    });
  };

  const handleSaveOrder = async () => {
    if (!customerId) {
      alert("Please select a customer.");
      return;
    }

    if (products.length === 0) {
      alert("Please add at least one product.");
      return;
    }

    const orderData = {
      customerId,
      products: products.map(({ id, quantity, unitPrice }) => ({ productId: id, quantity, unitPrice })),
      total: totalAmount,
      status: "Not Paid",
    };

    try {
      await window.electronAPI.createOrder(orderData);
      alert("Order created successfully!");
      setCustomerId("");
      setProducts([]);
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order.");
    }
  };

  return (
    <Box sx={{ marginLeft: "250px", display: "flex", flexDirection: "column", gap: 2 }}>
      <CustomerSelector onSelect={setCustomerId} />
      <ProductShapeSelector onShapeSelect={setShape} />
      <ProductSelector shape={shape} onSelect={handleProductSelect} />
      <OrderTable products={products} setProducts={setProducts} />
      <Typography variant="h6">Total: ${totalAmount.toFixed(2)}</Typography>
      <Button variant="contained" onClick={handleSaveOrder}>
        Save Order
      </Button>
    </Box>
  );
};

export default CreateOrder;
